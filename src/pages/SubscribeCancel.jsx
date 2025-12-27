import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

const SubscribeCancel = () => {
    return (
        <article className="max-w-2xl mx-auto text-center py-12 space-y-8">
            {/* Cancel Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full">
                <XCircle size={48} className="text-slate-400" />
            </div>

            {/* Header */}
            <header>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
                    Subscription Cancelled
                </h1>
                <p className="text-xl text-slate-600">
                    No worries! You can still use all our free features.
                </p>
            </header>

            {/* Free Features Reminder */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    You still have access to:
                </h2>
                <ul className="space-y-2 text-slate-600">
                    <li>1 My Path Quiz</li>
                    <li>Basic medication search</li>
                    <li>All assistance program links</li>
                    <li>Educational resources</li>
                </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition"
                >
                    <ArrowLeft size={18} />
                    Back to Pricing
                </Link>
                <Link
                    to="/wizard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold rounded-xl transition"
                >
                    Continue with Free
                </Link>
            </div>

            {/* Help */}
            <div className="flex items-center justify-center gap-2 text-slate-500">
                <HelpCircle size={16} />
                <span>
                    Questions? Email us at{' '}
                    <a href="mailto:info@medicationnavigator.com" className="text-emerald-700 hover:underline">
                        info@medicationnavigator.com
                    </a>
                </span>
            </div>
        </article>
    );
};

export default SubscribeCancel;
