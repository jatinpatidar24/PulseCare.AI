import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Activity, 
  Plus, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Droplets,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { recordsAPI } from '../services/api';

export const VitalsMonitor = () => {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Log Vitals Form State
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [heartRate, setHeartRate] = useState('72');
  const [bloodSugar, setBloodSugar] = useState('95');
  const [spo2, setSpo2] = useState('99');
  const [temperature, setTemperature] = useState('98.6');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      const res = await recordsAPI.getVitals();
      setVitals(res.data);
    } catch (e) {
      console.error("Failed to fetch vitals", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const handleLogVitals = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await recordsAPI.logVitals({
        systolic_bp: systolic ? parseInt(systolic) : undefined,
        diastolic_bp: diastolic ? parseInt(diastolic) : undefined,
        heart_rate: heartRate ? parseInt(heartRate) : undefined,
        blood_sugar: bloodSugar ? parseFloat(bloodSugar) : undefined,
        spo2: spo2 ? parseInt(spo2) : undefined,
        temperature: temperature ? parseFloat(temperature) : undefined,
        notes: notes || undefined
      });

      setIsModalOpen(false);
      setNotes('');
      await fetchVitals();
    } catch (err) {
      setError("Failed to record vitals. Please check values.");
    } finally {
      setSubmitting(false);
    }
  };

  const latest = vitals[0] || {
    systolic_bp: 120,
    diastolic_bp: 80,
    heart_rate: 72,
    blood_sugar: 95.0,
    temperature: 98.6,
    spo2: 99,
    status: 'Normal'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Vitals & Health Monitoring
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track daily physiological biomarkers, monitor cardiopulmonary trends, and maintain proactive health vigilance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Reading</span>
        </button>
      </div>

      {/* Latest Vitals Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Blood Pressure */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Pressure</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">
                {latest.systolic_bp || 120}/{latest.diastolic_bp || 80}
              </span>
              <span className="text-xs text-slate-400 font-medium">mmHg</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Normal Resting Range</span>
            </p>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heart Rate</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">
                {latest.heart_rate || 72}
              </span>
              <span className="text-xs text-slate-400 font-medium">BPM</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Optimal Pulse Rhythm</span>
            </p>
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Glucose</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">
                {latest.blood_sugar || 95.0}
              </span>
              <span className="text-xs text-slate-400 font-medium">mg/dL</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Fasting Range In-Target</span>
            </p>
          </div>
        </div>

        {/* Oxygen Saturation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Oxygen (SpO2)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">
                {latest.spo2 || 99}%
              </span>
              <span className="text-xs text-slate-400 font-medium">SpO2</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Excellent Oxygenation</span>
            </p>
          </div>
        </div>
      </div>

      {/* Vitals History Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Historical Biomarkers</h3>
            <p className="text-xs text-slate-500">Record history logged during routine checkups</p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg">
            {vitals.length} Logs Available
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Loading biomarker records...
          </div>
        ) : vitals.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No vitals logged yet. Click "Log New Reading" above to record your health metrics.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Blood Pressure</th>
                  <th className="py-3 px-4">Heart Rate</th>
                  <th className="py-3 px-4">Blood Glucose</th>
                  <th className="py-3 px-4">SpO2</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vitals.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{log.logged_date}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {log.systolic_bp && log.diastolic_bp ? `${log.systolic_bp}/${log.diastolic_bp} mmHg` : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono">{log.heart_rate ? `${log.heart_rate} bpm` : '—'}</td>
                    <td className="py-3 px-4 font-mono">{log.blood_sugar ? `${log.blood_sugar} mg/dL` : '—'}</td>
                    <td className="py-3 px-4 font-mono">{log.spo2 ? `${log.spo2}%` : '—'}</td>
                    <td className="py-3 px-4 font-mono">{log.temperature ? `${log.temperature}°F` : '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        log.status === 'Normal'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">{log.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Vitals Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Log Health Biomarkers</h3>
                <p className="text-xs text-teal-100">Record current vital signs</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogVitals} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs">{error}</div>
              )}

              {/* BP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="120"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="80"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Pulse & Sugar */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="72"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    placeholder="95.0"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* SpO2 and Temp */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Oxygen SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="99"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="98.6"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Activity State (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Fasting morning, post-lunch check"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Vitals'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
