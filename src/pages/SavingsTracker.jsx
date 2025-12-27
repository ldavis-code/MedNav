import { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogSavingsForm from '../components/LogSavingsForm';
import SavingsDashboard from '../components/SavingsDashboard';
import { syncPendingEntries } from '../lib/savingsApi';
import { useMedications } from '../context/MedicationsContext';

export default function SavingsTracker() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [syncMessage, setSyncMessage] = useState(null);
    const { medications } = useMedications();

    // Try to sync any pending local entries on mount
    useEffect(() => {
        async function trySync() {
            try {
                const result = await syncPendingEntries();
                if (result.synced > 0) {
                    setSyncMessage(`Synced ${result.synced} pending entries`);
                    setRefreshTrigger(prev => prev + 1);
                    setTimeout(() => setSyncMessage(null), 3000);
                }
            } catch (error) {
                console.error('Sync error:', error);
            }
        }
        trySync();
    }, []);

    const handleSavingsLogged = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Link
                        to="/my-medications"
                        className="text-white/80 hover:text-white flex items-center gap-1 text-sm"
                    >
                        <ArrowLeft size={16} />
                        Track Your Savings
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <TrendingUp size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">Savings Tracker</h1>
                        <p className="text-emerald-100">
                            Log your medication savings and track your progress over time
                        </p>
                    </div>
                </div>
            </div>

            {/* Sync Message */}
            {syncMessage && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg mb-6 text-sm">
                    {syncMessage}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: Log Form */}
                <div>
                    <LogSavingsForm
                        onSuccess={handleSavingsLogged}
                        medications={medications || []}
                    />

                    {/* Tips */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Tips for Tracking</h4>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li>• Log each prescription fill as you pick it up</li>
                            <li>• Include what you would have paid without assistance</li>
                            <li>• Check your pharmacy receipt for the "You Saved" amount</li>
                            <li>• Track different program types to see which save you most</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column: Dashboard */}
                <div>
                    <SavingsDashboard refreshTrigger={refreshTrigger} />
                </div>
            </div>

            {/* Call to Action for Programs */}
            <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <h3 className="font-bold text-purple-900 mb-2">Want to save more?</h3>
                <p className="text-purple-700 mb-4">
                    Use our medication search to find Patient Assistance Programs, foundation grants,
                    and copay cards for your specific medications.
                </p>
                <Link
                    to="/medications"
                    className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                    Search Medications
                </Link>
            </div>
        </div>
    );
}
