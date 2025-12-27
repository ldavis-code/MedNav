import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle, Shield, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const Subscribe = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const plan = searchParams.get('plan') || 'monthly';

    const plans = {
        monthly: {
            name: 'Monthly',
            price: '$8.99',
            period: 'per month',
            description: 'Billed monthly, cancel anytime',
            color: 'blue'
        },
        yearly: {
            name: 'Yearly',
            price: '$79.99',
            period: 'per year',
            description: 'Save 26% - Best value!',
            color: 'purple'
        }
    };

    const selectedPlan = plans[plan] || plans.monthly;

    const features = [
        'Unlimited My Path Quiz',
        'Save medications',
        'Share and print your list',
        'Unlimited medications in Search Meds',
        'Reminders on copay cards',
        'My Medication Savings'
    ];

    const handleSubscribe = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get user info from Supabase if logged in
            let email = null;
            let userId = null;

            if (window.supabaseClient) {
                const { data: { user } } = await window.supabaseClient.auth.getUser();
                if (user) {
                    email = user.email;
                    userId = user.id;
                }
            }

            const response = await fetch('/.netlify/functions/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plan: plan,
                    email: email,
                    userId: userId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-300',
            button: 'bg-blue-700 hover:bg-blue-800',
            check: 'text-blue-600',
            badge: 'bg-blue-100 text-blue-800'
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-300',
            button: 'bg-purple-700 hover:bg-purple-800',
            check: 'text-purple-600',
            badge: 'bg-purple-100 text-purple-800'
        }
    };

    const colors = colorClasses[selectedPlan.color];

    return (
        <article className="max-w-2xl mx-auto space-y-8 pb-12">
            {/* Back Link */}
            <Link
                to="/pricing"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition"
            >
                <ArrowLeft size={18} />
                Back to Pricing
            </Link>

            {/* Header */}
            <header className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                    <CreditCard size={32} className="text-emerald-700" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                    Subscribe to Pro
                </h1>
                <p className="text-lg text-slate-600">
                    Unlock all features with a {selectedPlan.name.toLowerCase()} subscription
                </p>
            </header>

            {/* Plan Selection */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => navigate('/subscribe?plan=monthly')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        plan === 'monthly'
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => navigate('/subscribe?plan=yearly')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        plan === 'yearly'
                            ? 'bg-purple-700 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                    Yearly (Save 26%)
                </button>
            </div>

            {/* Plan Card */}
            <div className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-8`}>
                <div className="text-center mb-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${colors.badge} mb-4`}>
                        {selectedPlan.name} Plan
                    </span>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-slate-900">{selectedPlan.price}</span>
                        <span className="text-slate-600">{selectedPlan.period}</span>
                    </div>
                    <p className="text-slate-600 mt-2">{selectedPlan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <CheckCircle size={20} className={colors.check} />
                            <span className="text-slate-700">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                        <AlertCircle size={20} className="text-red-600" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                {/* Subscribe Button */}
                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className={`w-full ${colors.button} text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard size={20} />
                            Subscribe Now
                        </>
                    )}
                </button>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Shield size={16} />
                <span>Secure payment powered by Stripe</span>
            </div>

            {/* Terms */}
            <p className="text-center text-slate-500 text-sm">
                By subscribing, you agree to our{' '}
                <Link to="/terms" className="text-emerald-700 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-emerald-700 hover:underline">Privacy Policy</Link>.
                Cancel anytime from your account settings.
            </p>
        </article>
    );
};

export default Subscribe;
