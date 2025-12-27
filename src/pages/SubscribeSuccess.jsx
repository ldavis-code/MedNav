import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const SubscribeSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Optionally verify the session or update local state
        if (sessionId) {
            console.log('Checkout session completed:', sessionId);
        }
    }, [sessionId]);

    return (
        <article className="max-w-2xl mx-auto text-center py-12 space-y-8">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                <CheckCircle size={48} className="text-emerald-600" />
            </div>

            {/* Header */}
            <header>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
                    Welcome to Pro!
                </h1>
                <p className="text-xl text-slate-600">
                    Your subscription is now active. Thank you for supporting Medication Navigator!
                </p>
            </header>

            {/* Features Unlocked */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Sparkles size={24} className="text-emerald-600" />
                    <h2 className="text-xl font-bold text-emerald-900">You now have access to:</h2>
                </div>
                <ul className="space-y-3 text-left max-w-md mx-auto">
                    {[
                        'Unlimited My Path Quiz',
                        'Save medications',
                        'Share and print your list',
                        'Unlimited medications in Search Meds',
                        'Reminders on copay cards',
                        'My Medication Savings'
                    ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                            <span className="text-slate-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/wizard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition"
                >
                    Start My Path Quiz
                    <ArrowRight size={18} />
                </Link>
                <Link
                    to="/my-medications"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-emerald-700 border-2 border-emerald-200 font-bold rounded-xl transition"
                >
                    Track Your Savings
                </Link>
            </div>

            {/* Support Note */}
            <p className="text-slate-500 text-sm">
                Need help? Contact us at{' '}
                <a href="mailto:info@medicationnavigator.com" className="text-emerald-700 hover:underline">
                    info@medicationnavigator.com
                </a>
            </p>
        </article>
    );
};

export default SubscribeSuccess;
