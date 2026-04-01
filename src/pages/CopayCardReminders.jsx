import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2, Plus, AlertTriangle, Download, Upload, Bell,
  Calendar, CreditCard, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { useConfirmDialog } from '../components/ConfirmDialog';
import { useMetaTags } from '../hooks/useMetaTags';
import { seoMetadata } from '../data/seo-metadata';

const STORAGE_KEY = 'tmn_copay_reminders';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(dateStr);
  expDate.setHours(0, 0, 0, 0);
  const diffTime = expDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getStatusInfo(daysUntil, reminderDays) {
  if (daysUntil === null) {
    return { status: 'unknown', label: 'No date set', color: 'slate', icon: Clock };
  }
  if (daysUntil < 0) {
    return { status: 'expired', label: 'Expired', color: 'red', icon: AlertCircle };
  }
  if (daysUntil === 0) {
    return { status: 'today', label: 'Expires today', color: 'red', icon: AlertTriangle };
  }
  if (daysUntil <= reminderDays) {
    return { status: 'upcoming', label: `${daysUntil} days left`, color: 'amber', icon: Bell };
  }
  return { status: 'active', label: `${daysUntil} days left`, color: 'emerald', icon: CheckCircle };
}

const reminderDaysOptions = [
  { value: 7, label: '1 week before' },
  { value: 14, label: '2 weeks before' },
  { value: 30, label: '1 month before' },
  { value: 60, label: '2 months before' },
  { value: 90, label: '3 months before' }
];

const renewalTypeLabels = {
  'calendar_year': 'Calendar year (Jan 1)',
  'enrollment_anniversary': 'Enrollment anniversary',
  'max_benefit': 'After max benefit reached',
  'other': 'Other'
};

export default function CopayCardReminders() {
  useMetaTags(seoMetadata.copayReminders || seoMetadata.myMedications);

  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [newReminder, setNewReminder] = useState({
    programName: '',
    medicationName: '',
    expirationDate: '',
    renewalType: '',
    reminderDays: 30,
    maxBenefit: '',
    notes: ''
  });
  const { showConfirm, DialogComponent } = useConfirmDialog();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReminders(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading reminders:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (e) {
      console.error('Error saving reminders:', e);
    }
  }, [reminders]);

  const upcomingAlerts = useMemo(() => {
    return reminders
      .map(r => {
        const daysUntil = getDaysUntil(r.expiration_date);
        const statusInfo = getStatusInfo(daysUntil, r.reminder_days || 30);
        return { ...r, daysUntil, statusInfo };
      })
      .filter(r => r.statusInfo.status === 'upcoming' || r.statusInfo.status === 'today' || r.statusInfo.status === 'expired')
      .sort((a, b) => (a.daysUntil || 999) - (b.daysUntil || 999));
  }, [reminders]);

  function handleAddReminder(e) {
    e.preventDefault();
    if (!newReminder.programName.trim()) {
      setMessage({ text: 'Please enter a program name', type: 'error' });
      return;
    }

    const reminder = {
      id: generateId(),
      program_name: newReminder.programName.trim(),
      medication_name: newReminder.medicationName.trim() || null,
      expiration_date: newReminder.expirationDate || null,
      renewal_type: newReminder.renewalType || null,
      reminder_days: parseInt(newReminder.reminderDays) || 30,
      max_benefit: newReminder.maxBenefit ? parseFloat(newReminder.maxBenefit) : null,
      notes: newReminder.notes.trim() || null,
      added_at: new Date().toISOString()
    };

    setReminders(prev => [reminder, ...prev]);
    setMessage({ text: 'Reminder saved!', type: 'success' });
    setNewReminder({
      programName: '',
      medicationName: '',
      expirationDate: '',
      renewalType: '',
      reminderDays: 30,
      maxBenefit: '',
      notes: ''
    });

    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  }

  async function handleDeleteReminder(id) {
    const confirmed = await showConfirm({
      title: 'Delete Reminder',
      message: 'Are you sure you want to delete this copay card reminder?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'confirm'
    });
    if (!confirmed) return;
    setReminders(prev => prev.filter(r => r.id !== id));
  }

  function handleExport() {
    const dataStr = JSON.stringify(reminders, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copay-card-reminders.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const withIds = imported.map(r => ({
            ...r,
            id: r.id || generateId()
          }));
          setReminders(prev => [...withIds, ...prev]);
          setMessage({ text: `Imported ${imported.length} reminder(s)`, type: 'success' });
        } else {
          setMessage({ text: 'Invalid file format', type: 'error' });
        }
      } catch (err) {
        setMessage({ text: 'Error reading file', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const sortedReminders = useMemo(() => {
    return [...reminders].map(r => {
      const daysUntil = getDaysUntil(r.expiration_date);
      const statusInfo = getStatusInfo(daysUntil, r.reminder_days || 30);
      return { ...r, daysUntil, statusInfo };
    }).sort((a, b) => {
      const priorityOrder = { expired: 0, today: 1, upcoming: 2, active: 3, unknown: 4 };
      const aPriority = priorityOrder[a.statusInfo.status] ?? 5;
      const bPriority = priorityOrder[b.statusInfo.status] ?? 5;
      if (aPriority !== bPriority) return aPriority - bPriority;
      if (a.daysUntil !== null && b.daysUntil !== null) {
        return a.daysUntil - b.daysUntil;
      }
      return 0;
    });
  }, [reminders]);

  return (
    <>
      {DialogComponent}
      <div className="max-w-2xl mx-auto">
        {upcomingAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6" role="alert">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-amber-800 font-medium">
                  {upcomingAlerts.length === 1
                    ? 'You have 1 copay card expiring soon'
                    : `You have ${upcomingAlerts.length} copay cards expiring soon`}
                </p>
                <ul className="mt-2 space-y-1">
                  {upcomingAlerts.slice(0, 3).map(alert => (
                    <li key={alert.id} className="text-amber-700 text-sm flex items-center gap-2">
                      <alert.statusInfo.icon className="w-4 h-4" aria-hidden="true" />
                      <span className="font-medium">{alert.program_name}</span>
                      {alert.medication_name && <span className="text-amber-600">({alert.medication_name})</span>}
                      <span>-</span>
                      <span className={alert.statusInfo.status === 'expired' ? 'text-red-600 font-medium' : ''}>
                        {alert.statusInfo.label}
                      </span>
                    </li>
                  ))}
                  {upcomingAlerts.length > 3 && (
                    <li className="text-amber-600 text-sm">
                      ...and {upcomingAlerts.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-amber-800 font-medium">Your data stays on this device</p>
              <p className="text-amber-700 text-sm mt-1">
                Reminders are stored in your browser only. They are not sent to any server.
                Clearing your browser data will remove this list. Use Export to save a backup.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/my-medications"
          className="block bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 mb-6 text-white hover:from-emerald-700 hover:to-teal-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <CreditCard size={24} />
            <div>
              <div className="font-semibold">My Medications</div>
              <div className="text-emerald-100 text-sm">Track your medications and renewal dates</div>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-7 h-7 text-amber-500" aria-hidden="true" />
              Copay Card Reminders
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                disabled={reminders.length === 0}
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export reminders"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            Never miss a copay card renewal. Many programs expire annually and require re-enrollment.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <h2 id="add-reminder-heading" className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            Add a Copay Card Reminder
          </h2>

          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            id="form-status"
            className={message.text ? `mb-4 p-3 rounded-lg text-center ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}` : 'sr-only'}
          >
            {message.text || 'Form ready'}
          </div>

          <form onSubmit={handleAddReminder} className="space-y-4" aria-labelledby="add-reminder-heading" aria-describedby="form-status">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="program-name" className="block text-sm font-medium text-slate-700 mb-1">
                  Program name <span className="text-red-500" aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="program-name"
                  type="text"
                  value={newReminder.programName}
                  onChange={(e) => setNewReminder({ ...newReminder, programName: e.target.value })}
                  placeholder="e.g., Jardiance Savings Card"
                  aria-required="true"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="medication-name" className="block text-sm font-medium text-slate-700 mb-1">
                  Medication <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  id="medication-name"
                  type="text"
                  value={newReminder.medicationName}
                  onChange={(e) => setNewReminder({ ...newReminder, medicationName: e.target.value })}
                  placeholder="e.g., Empagliflozin"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="expiration-date" className="block text-sm font-medium text-slate-700 mb-1">
                  Expiration date <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  id="expiration-date"
                  type="date"
                  value={newReminder.expirationDate}
                  onChange={(e) => setNewReminder({ ...newReminder, expirationDate: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="renewal-type" className="block text-sm font-medium text-slate-700 mb-1">
                  Renewal type <span className="text-slate-400">(optional)</span>
                </label>
                <select
                  id="renewal-type"
                  value={newReminder.renewalType}
                  onChange={(e) => setNewReminder({ ...newReminder, renewalType: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">-- Select --</option>
                  <option value="calendar_year">Calendar year (Jan 1)</option>
                  <option value="enrollment_anniversary">Enrollment anniversary</option>
                  <option value="max_benefit">After max benefit reached</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="reminder-days" className="block text-sm font-medium text-slate-700 mb-1">
                  Remind me
                </label>
                <select
                  id="reminder-days"
                  value={newReminder.reminderDays}
                  onChange={(e) => setNewReminder({ ...newReminder, reminderDays: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {reminderDaysOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="max-benefit" className="block text-sm font-medium text-slate-700 mb-1">
                  Max annual benefit ($) <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  id="max-benefit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newReminder.maxBenefit}
                  onChange={(e) => setNewReminder({ ...newReminder, maxBenefit: e.target.value })}
                  placeholder="e.g., 6000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
                Notes <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={newReminder.notes}
                onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                placeholder="e.g., Call 1-800-XXX-XXXX to re-enroll, need income verification"
                rows={2}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              Save Reminder
            </button>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for Managing Copay Cards</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>Most manufacturer copay cards expire on December 31st and require annual re-enrollment</li>
            <li>Some programs have maximum annual benefits (e.g., $6,000/year) - track your usage</li>
            <li>Keep the enrollment phone number handy for quick re-enrollment</li>
            <li>Set reminders 30+ days before expiration to allow time for processing</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Your Reminders {reminders.length > 0 && <span className="text-slate-500 font-normal">({reminders.length})</span>}
          </h2>
          {sortedReminders.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No reminders saved yet.</p>
          ) : (
            <div className="space-y-4">
              {sortedReminders.map((reminder) => {
                const StatusIcon = reminder.statusInfo.icon;
                const colorClasses = {
                  red: 'border-red-200 bg-red-50',
                  amber: 'border-amber-200 bg-amber-50',
                  emerald: 'border-slate-200 bg-white',
                  slate: 'border-slate-200 bg-white'
                };
                const badgeClasses = {
                  red: 'bg-red-100 text-red-700',
                  amber: 'bg-amber-100 text-amber-700',
                  emerald: 'bg-emerald-100 text-emerald-700',
                  slate: 'bg-slate-100 text-slate-600'
                };

                return (
                  <div
                    key={reminder.id}
                    className={`border rounded-xl p-4 hover:shadow-md transition ${colorClasses[reminder.statusInfo.color]}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{reminder.program_name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeClasses[reminder.statusInfo.color]}`}>
                            <StatusIcon className="w-3 h-3" aria-hidden="true" />
                            {reminder.statusInfo.label}
                          </span>
                        </div>
                        {reminder.medication_name && (
                          <p className="text-slate-600 text-sm mt-1">
                            Medication: {reminder.medication_name}
                          </p>
                        )}
                        {reminder.expiration_date && (
                          <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                            <Calendar className="w-4 h-4" aria-hidden="true" />
                            Expires: {new Date(reminder.expiration_date).toLocaleDateString()}
                          </p>
                        )}
                        {reminder.renewal_type && (
                          <p className="text-slate-600 text-sm mt-1">
                            Renewal: {renewalTypeLabels[reminder.renewal_type] || reminder.renewal_type}
                          </p>
                        )}
                        {reminder.max_benefit && (
                          <p className="text-slate-600 text-sm mt-1">
                            Max benefit: ${reminder.max_benefit.toLocaleString()}
                          </p>
                        )}
                        {reminder.notes && (
                          <p className="text-slate-500 text-sm mt-2 italic">
                            {reminder.notes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        aria-label={`Delete ${reminder.program_name} reminder`}
                      >
                        <Trash2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
