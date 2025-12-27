-- Migration: User Savings Tracking
-- Allows patients to log their savings when using assistance programs

CREATE TABLE IF NOT EXISTS user_savings (
    id SERIAL PRIMARY KEY,
    -- User identifier (from localStorage or auth system)
    user_id VARCHAR(255) NOT NULL,
    -- Medication reference
    medication_id VARCHAR(255),
    medication_name VARCHAR(255) NOT NULL,
    -- Program used for savings
    program_name VARCHAR(255),
    program_type VARCHAR(50), -- 'copay_card', 'pap', 'foundation', 'discount_card', 'negotiated_price', 'other'
    -- Pricing info
    original_price DECIMAL(10, 2) NOT NULL,
    paid_price DECIMAL(10, 2) NOT NULL,
    amount_saved DECIMAL(10, 2) GENERATED ALWAYS AS (original_price - paid_price) STORED,
    -- Date of the fill/purchase
    fill_date DATE,
    -- Optional notes
    notes TEXT,
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_user_savings_user_id ON user_savings(user_id);
CREATE INDEX idx_user_savings_medication ON user_savings(medication_id);
CREATE INDEX idx_user_savings_created ON user_savings(created_at DESC);
CREATE INDEX idx_user_savings_fill_date ON user_savings(fill_date DESC);

-- User savings summary view (for dashboard)
CREATE OR REPLACE VIEW user_savings_summary AS
SELECT
    user_id,
    COUNT(*) as total_entries,
    SUM(amount_saved) as total_saved,
    SUM(original_price) as total_original,
    SUM(paid_price) as total_paid,
    MIN(fill_date) as first_fill_date,
    MAX(fill_date) as last_fill_date,
    COUNT(DISTINCT medication_id) as unique_medications,
    ROUND(AVG(amount_saved), 2) as avg_savings_per_fill
FROM user_savings
GROUP BY user_id;

-- Monthly savings summary for charts
CREATE OR REPLACE VIEW user_savings_by_month AS
SELECT
    user_id,
    DATE_TRUNC('month', fill_date) as month,
    SUM(amount_saved) as monthly_saved,
    SUM(original_price) as monthly_original,
    SUM(paid_price) as monthly_paid,
    COUNT(*) as fill_count
FROM user_savings
WHERE fill_date IS NOT NULL
GROUP BY user_id, DATE_TRUNC('month', fill_date)
ORDER BY user_id, month DESC;
