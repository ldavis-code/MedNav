import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, AlertTriangle, Download, Upload, TrendingUp } from 'lucide-react';

const STORAGE_KEY = 'tmn_my_medications';

// Generate a simple unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function MyMedications() {
  const [medications, setMedications] = useState([]);
  const [medMessage, setMedMessage] = useState({ text: '', type: '' });
  const [newMed, setNewMed] = useState({
    name: '',
    brand: '',
    dosage: '',
    cost: '',
    renewal: '',
    renewalType: ''
  });

  const renewalTypeLabels = {
    'calendar_year': 'Calendar year',
    'enrollment_anniversary': 'Enrollment anniversary',
    'after_max_reached': 'After max reached'
  };

  // Load medications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMedications(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading medications:', e);
    }
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch (e) {
      console.error('Error saving medications:', e);
    }
  }, [medications]);

  function handleAddMedication(e) {
    e.preventDefault();
    if (!newMed.name.trim()) {
      setMedMessage({ text: 'Please enter a medication name', type: 'error' });
      return;
    }

    const medication = {
      id: generateId(),
      medication_name: newMed.name.trim(),
      brand_name: newMed.brand.trim() || null,
      dosage: newMed.dosage.trim() || null,
      monthly_cost: newMed.cost ? parseFloat(newMed.cost) : null,
      renewal_date: newMed.renewal || null,
      renewal_type: newMed.renewalType || null,
      added_at: new Date().toISOString()
    };

    setMedications(prev => [medication, ...prev]);
    setMedMessage({ text: 'Medication saved!', type: 'success' });
    setNewMed({ name: '', brand: '', dosage: '', cost: '', renewal: '', renewalType: '' });

    // Clear success message after 3 seconds
    setTimeout(() => setMedMessage({ text: '', type: '' }), 3000);
  }

  function handleDeleteMedication(id) {
    if (!confirm('Delete this medication?')) return;
    setMedications(prev => prev.filter(med => med.id !== id));
  }

  function handleExport() {
    const dataStr = JSON.stringify(medications, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-medications.json';
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
          // Add IDs to any medications that don't have them
          const withIds = imported.map(med => ({
            ...med,
            id: med.id || generateId()
          }));
          setMedications(prev => [...withIds, ...prev]);
          setMedMessage({ text: `Imported ${imported.length} medication(s)`, type: 'success' });
        } else {
          setMedMessage({ text: 'Invalid file format', type: 'error' });
        }
      } catch (err) {
        setMedMessage({ text: 'Error reading file', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Privacy Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-medium">Your data stays on this device</p>
            <p className="text-amber-700 text-sm mt-1">
              Medications are stored in your browser only. They are not sent to any server.
              Clearing your browser data will remove this list. Use Export to save a backup.
            </p>
          </div>
        </div>
      </div>

      {/* Savings Tracker CTA */}
      <Link
        to="/savings-tracker"
        className="block bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 mb-6 text-white hover:from-emerald-700 hover:to-teal-700 transition-all"
      >
        <div className="flex items-center gap-3">
          <TrendingUp size={24} />
          <div>
            <div className="font-semibold">Track Your Savings</div>
            <div className="text-emerald-100 text-sm">Log prescription fills and see how much you're saving</div>
          </div>
        </div>
      </Link>

      {/* Header with Export/Import */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Track Your Savings</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={medications.length === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export medications"
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
          Track your medications and renewal dates
        </p>
      </div>

      {/* Add Medication Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-600" />
          Add a Medication
        </h2>
        <form onSubmit={handleAddMedication} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              placeholder="Medication name (e.g., Tacrolimus)"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              value={newMed.brand}
              onChange={(e) => setNewMed({ ...newMed, brand: e.target.value })}
              placeholder="Brand name (e.g., Prograf)"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              placeholder="Dosage (e.g., 1mg twice daily)"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="number"
              step="0.01"
              value={newMed.cost}
              onChange={(e) => setNewMed({ ...newMed, cost: e.target.value })}
              placeholder="Monthly cost ($)"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div>
              <label className="block text-sm text-slate-600 mb-1">Renewal date (optional)</label>
              <input
                type="date"
                value={newMed.renewal}
                onChange={(e) => setNewMed({ ...newMed, renewal: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Renewal type (optional)</label>
              <select
                value={newMed.renewalType}
                onChange={(e) => setNewMed({ ...newMed, renewalType: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">-- Select --</option>
                <option value="calendar_year">Calendar year (Jan 1)</option>
                <option value="enrollment_anniversary">Enrollment anniversary</option>
                <option value="after_max_reached">After max benefit reached</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Save Medication
          </button>
        </form>
        {medMessage.text && (
          <p className={`mt-4 text-center ${medMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {medMessage.text}
          </p>
        )}
      </div>

      {/* Medications List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Saved Medications {medications.length > 0 && <span className="text-slate-500 font-normal">({medications.length})</span>}
        </h2>
        {medications.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No medications saved yet.</p>
        ) : (
          <div className="space-y-4">
            {medications.map((med) => (
              <div key={med.id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{med.medication_name}</h3>
                    {med.brand_name && <p className="text-slate-600">Brand: {med.brand_name}</p>}
                    {med.dosage && <p className="text-slate-600">Dosage: {med.dosage}</p>}
                    {med.monthly_cost && <p className="text-slate-600">Monthly cost: ${med.monthly_cost}</p>}
                    {med.renewal_date && <p className="text-slate-600">Renewal: {new Date(med.renewal_date).toLocaleDateString()}</p>}
                    {med.renewal_type && <p className="text-slate-600">Type: {renewalTypeLabels[med.renewal_type] || med.renewal_type}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteMedication(med.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    aria-label="Delete medication"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
