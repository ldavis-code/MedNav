import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Clock, Sparkles, X } from 'lucide-react';
import { useDemoMode } from '../context/DemoModeContext';

/**
 * DemoBanner - Sticky banner displayed when the app is in demo mode.
 * Shows remaining demo time, demo type label, and exit/pricing actions.
 */
const DemoBanner = () => {
  const { isDemoMode, demoType, exitDemoMode, getDemoTimeRemaining } = useDemoMode();
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('');

  // Update time display every 60 seconds
  useEffect(() => {
    if (!isDemoMode) return;

    const updateTime = () => {
      const remaining = getDemoTimeRemaining();
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeDisplay(`${hours}h ${minutes}m remaining`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [isDemoMode, getDemoTimeRemaining]);

  if (!isDemoMode) return null;

  const typeLabel = demoType === 'enterprise' ? 'Enterprise Demo' : demoType === 'partner' ? 'Partner Demo' : 'Demo Mode';

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition min-w-[44px] min-h-[44px]"
        aria-label="Expand demo mode banner"
      >
        <Monitor size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Demo</span>
      </button>
    );
  }

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Monitor size={18} aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{typeLabel}</span>
            <span className="hidden md:inline text-purple-200">|</span>
            <span className="hidden md:flex items-center gap-1 text-sm text-purple-100">
              <Sparkles size={14} aria-hidden="true" />
              Pro features unlocked
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-sm text-purple-100">
            <Clock size={14} aria-hidden="true" />
            {timeDisplay}
          </span>
          <Link
            to="/pricing"
            className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
          >
            View Pricing
          </Link>
          <button
            onClick={exitDemoMode}
            className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition hidden sm:block"
          >
            Exit demo mode
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Minimize demo banner"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
