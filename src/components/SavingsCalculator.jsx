import { useState } from 'react';
import { Calculator, Plus, Trash2, Shield, Database, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import priceEstimates from '../data/price-estimates.json';

const ASSISTANCE_SAVINGS = {
    pap: { min: 0.95, max: 1.0, label: 'Patient Assistance Program', description: 'Usually free ($0)' },
    copay_card: { min: 0.70, max: 0.95, label: 'Copay Card', description: '$0-$35/month typical' },
    foundation: { min: 0.80, max: 1.0, label: 'Foundation Grant', description: 'Covers copays' },
    generic: { min: 0.70, max: 0.90, label: 'Generic Switch', description: '70-90% savings' },
    discount_card: { min: 0.50, max: 0.80, label: 'Discount Card (GoodRx)', description: '50-80% off retail' },
    medicare_negotiated: { min: 0.50, max: 0.79, label: 'Medicare Negotiated', description: '50-79% off (2026)' },
};

function getRetailPrice(medicationId, medicationName) {
    const id = medicationId?.toLowerCase() || medicationName?.toLowerCase().split(' ')[0];

    if (priceEstimates.medicationOverrides[id]) {
        const override = priceEstimates.medicationOverrides[id];
        return override.walmart?.max || override.goodrx?.max || 500;
    }

    return priceEstimates.categoryDefaults?.default?.walmart?.max || 85;
}

function getAssistedPrice(medicationId, medicationName) {
    const id = medicationId?.toLowerCase() || medicationName?.toLowerCase().split(' ')[0];

    if (priceEstimates.medicationOverrides[id]) {
        const override = priceEstimates.medicationOverrides[id];
        if (override.medicare2026?.negotiated) {
            return override.medicare2026.negotiated;
        }
        return override.costplus?.min || override.goodrx?.min || 50;
    }

    return priceEstimates.categoryDefaults?.default?.costplus?.min || 15;
}

const FALLBACK_MEDICATIONS = [
    { id: 'creon', name: 'Creon (Pancrelipase)', category: 'Digestive Enzyme' },
    { id: 'eliquis', name: 'Eliquis (Apixaban)', category: 'Anticoagulant' },
    { id: 'entresto', name: 'Entresto (Heart Failure)', category: 'Cardiovascular' },
    { id: 'farxiga', name: 'Farxiga (Dapagliflozin)', category: 'Diabetes/Heart/Kidney' },
    { id: 'jardiance', name: 'Jardiance (Empagliflozin)', category: 'Diabetes/Heart/Kidney' },
    { id: 'mycophenolate', name: 'Mycophenolate (Generic CellCept)', category: 'Immunosuppressant' },
    { id: 'ozempic', name: 'Ozempic (Semaglutide)', category: 'Diabetes' },
    { id: 'dupixent', name: 'Dupixent (Dupilumab)', category: 'Immunology' },
    { id: 'tacrolimus', name: 'Tacrolimus (Generic Prograf)', category: 'Immunosuppressant' },
    { id: 'xarelto', name: 'Xarelto (Rivaroxaban)', category: 'Anticoagulant' },
    { id: 'spiriva', name: 'Spiriva (Tiotropium)', category: 'Respiratory' },
    { id: 'trulicity', name: 'Trulicity (Dulaglutide)', category: 'Diabetes' },
    { id: 'nucala', name: 'Nucala (Mepolizumab)', category: 'Respiratory' },
    { id: 'januvia', name: 'Januvia (Sitagliptin)', category: 'Diabetes' },
];

export default function SavingsCalculator({ medications = [], onCalculate }) {
    const [selectedMeds, setSelectedMeds] = useState([
        { id: '', name: '', quantity: 1 }
    ]);
    const [showResults, setShowResults] = useState(false);
    const [calculations, setCalculations] = useState(null);
    const [errors, setErrors] = useState({});

    const allMedications = medications?.length > 0
        ? medications.map(med => ({
            id: med.id,
            name: med.brandName || med.genericName || med.name,
            category: med.category
        }))
        : [...FALLBACK_MEDICATIONS];

    allMedications.sort((a, b) => a.name.localeCompare(b.name));

    const addMedication = () => {
        setSelectedMeds(prev => [...prev, { id: '', name: '', quantity: 1 }]);
        setShowResults(false);
    };

    const updateMedication = (index, field, value) => {
        setSelectedMeds(prev => {
            const updated = [...prev];
            if (field === 'medication') {
                const med = allMedications.find(m => m.id === value);
                updated[index] = {
                    ...updated[index],
                    id: value,
                    name: med?.name || value
                };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            return updated;
        });
        setErrors(prev => {
            const updated = { ...prev };
            delete updated[`medication-${index}`];
            delete updated[`quantity-${index}`];
            return updated;
        });
        setShowResults(false);
    };

    const removeMedication = (index) => {
        setSelectedMeds(prev => prev.filter((_, i) => i !== index));
        setShowResults(false);
    };

    const calculateSavings = () => {
        const newErrors = {};
        selectedMeds.forEach((med, index) => {
            if (!med.id && !med.name) {
                newErrors[`medication-${index}`] = 'Please select a medication';
            }
            if (!med.quantity || med.quantity < 1 || med.quantity > 12) {
                newErrors[`quantity-${index}`] = 'Quantity must be between 1 and 12';
            }
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        if (onCalculate && !onCalculate()) {
            return;
        }

        const results = selectedMeds
            .filter(med => med.id || med.name)
            .map(med => {
                const retailPrice = getRetailPrice(med.id, med.name);
                const assistedPrice = getAssistedPrice(med.id, med.name);
                const monthlySavings = (retailPrice - assistedPrice) * (med.quantity || 1);
                const annualSavings = monthlySavings * 12;

                return {
                    ...med,
                    retailPrice: retailPrice * (med.quantity || 1),
                    assistedPrice: assistedPrice * (med.quantity || 1),
                    monthlySavings,
                    annualSavings
                };
            });

        const totalMonthlyRetail = results.reduce((sum, r) => sum + r.retailPrice, 0);
        const totalMonthlyAssisted = results.reduce((sum, r) => sum + r.assistedPrice, 0);
        const totalAnnualSavings = results.reduce((sum, r) => sum + r.annualSavings, 0);

        setCalculations({
            medications: results,
            totalMonthlyRetail,
            totalMonthlyAssisted,
            totalAnnualSavings
        });
        setShowResults(true);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    <Calculator className="w-8 h-8 text-emerald-600" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Estimate Your Medication Savings
                </h2>
                <p className="text-slate-600 max-w-xl mx-auto">
                    Prescription medications can be expensive, but you shouldn't have to overpay.
                    Use our calculator to see how much you could save with assistance programs.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Medication List</h3>
                <p className="text-sm text-slate-500 mb-4">
                    Add your current prescriptions to calculate potential savings
                </p>

                <div className="space-y-3">
                    {selectedMeds.map((med, index) => (
                        <div key={index} className="flex items-end gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                                <label htmlFor={`medication-select-${index}`} className="block text-sm font-medium text-slate-700 mb-1">
                                    Medication {index + 1}
                                </label>
                                <select
                                    id={`medication-select-${index}`}
                                    value={med.id}
                                    onChange={(e) => updateMedication(index, 'medication', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white min-h-[44px] ${errors[`medication-${index}`] ? 'border-red-500' : 'border-slate-300'}`}
                                    aria-describedby={errors[`medication-${index}`] ? `medication-error-${index}` : undefined}
                                    aria-invalid={errors[`medication-${index}`] ? 'true' : undefined}
                                >
                                    <option value="">Select a medication...</option>
                                    {allMedications.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                                {errors[`medication-${index}`] && (
                                    <p id={`medication-error-${index}`} className="text-red-600 text-xs mt-1" role="alert">
                                        {errors[`medication-${index}`]}
                                    </p>
                                )}
                            </div>
                            <div className="w-24">
                                <label htmlFor={`medication-quantity-${index}`} className="block text-sm font-medium text-slate-700 mb-1">
                                    Qty/mo
                                </label>
                                <input
                                    id={`medication-quantity-${index}`}
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={med.quantity}
                                    onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value) || 1)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center min-h-[44px] ${errors[`quantity-${index}`] ? 'border-red-500' : 'border-slate-300'}`}
                                    aria-describedby={errors[`quantity-${index}`] ? `quantity-error-${index}` : undefined}
                                    aria-invalid={errors[`quantity-${index}`] ? 'true' : undefined}
                                />
                                {errors[`quantity-${index}`] && (
                                    <p id={`quantity-error-${index}`} className="text-red-600 text-xs mt-1" role="alert">
                                        {errors[`quantity-${index}`]}
                                    </p>
                                )}
                            </div>
                            {selectedMeds.length > 1 && (
                                <button
                                    onClick={() => removeMedication(index)}
                                    className="p-2 text-slate-500 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label={`Remove ${med.name || 'medication'} from list`}
                                >
                                    <Trash2 size={18} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={addMedication}
                    className="mt-4 w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 transition-colors min-h-[44px] border-slate-300 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
                >
                    <Plus size={18} aria-hidden="true" />
                    Add Another Medication
                </button>

                <button
                    onClick={calculateSavings}
                    disabled={!selectedMeds.some(m => m.id || m.name)}
                    className="mt-6 w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg min-h-[44px]"
                >
                    <Calculator size={22} aria-hidden="true" />
                    Calculate My Savings
                </button>
            </div>

            <div aria-live="polite" aria-atomic="true">
            {showResults && calculations && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white text-center">
                        <p className="text-emerald-100 text-sm uppercase tracking-wide mb-2">
                            Potential Annual Savings
                        </p>
                        <div className="text-6xl font-bold mb-2">
                            ${calculations.totalAnnualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-emerald-100">
                            Based on estimated retail vs. assisted prices
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                            <div>
                                <p className="text-emerald-100 text-xs uppercase mb-1">Monthly Retail Cost</p>
                                <p className="text-2xl font-bold">
                                    ${calculations.totalMonthlyRetail.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-emerald-100 text-xs uppercase mb-1">New Monthly Cost</p>
                                <p className="text-2xl font-bold">
                                    ${calculations.totalMonthlyAssisted.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Savings Breakdown</h3>
                        <div className="space-y-3">
                            {calculations.medications.map((med, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-slate-900">{med.name}</p>
                                        <p className="text-sm text-slate-500">
                                            ${med.retailPrice}/mo &rarr; ${med.assistedPrice}/mo
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600 text-lg">
                                            -${med.annualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                        <h3 className="text-lg font-bold text-purple-900 mb-2">Unlock These Savings</h3>
                        <p className="text-purple-700 mb-4">
                            Find the specific assistance programs, copay cards, and patient support
                            for your medications.
                        </p>
                        <Link
                            to="/medications"
                            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors min-h-[44px]"
                        >
                            Search Assistance Programs
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full mb-3">
                        <Shield className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">Verified Programs</h4>
                    <p className="text-sm text-slate-600">
                        We only list verified patient assistance programs and manufacturer discounts.
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-3">
                        <Database className="w-5 h-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">Real Price Data</h4>
                    <p className="text-sm text-slate-600">
                        Our estimates use current NADAC and retail pricing data for accuracy.
                    </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-rose-100 rounded-full mb-3">
                        <Heart className="w-5 h-5 text-rose-600" aria-hidden="true" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">Patient First</h4>
                    <p className="text-sm text-slate-600">
                        Created by patients, for patients. Always transparent.
                    </p>
                </div>
            </div>
        </div>
    );
}
