import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Video, 
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DoctorDashboard = ({ setCurrentTab }) => {
  const { user, isDoctor, demoLogin } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  
  // Note Modal
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentsAPI.getAll();
      setAppointments(res.data);
    } catch (e) {
      console.error("Failed to load doctor appointments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDoctor) {
      fetchDoctorAppointments();
    }
  }, [isDoctor]);

  const handleUpdateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await appointmentsAPI.updateStatus(id, {
        status,
        notes: clinicalNotes || undefined
      });
      setSelectedAppt(null);
      setClinicalNotes('');
      await fetchDoctorAppointments();
    } catch (e) {
      alert("Failed to update appointment");
    } finally {
      setUpdating(false);
    }
  };

  if (!isDoctor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Doctor Provider Portal</h2>
          <p className="text-sm text-slate-600">
            You are currently logged in as a patient (or guest). To access the Doctor's clinical schedule and patient management dashboard, switch to a doctor account.
          </p>
        </div>
        <button
          onClick={() => demoLogin('doctor')}
          className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer"
        >
          Sign In as Dr. Marcus Vance (Demo Doctor)
        </button>
      </div>
    );
  }

  const filtered = appointments.filter(a => {
    if (activeTab === 'All') return true;
    return a.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase">
                Physician Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => demoLogin('patient')}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            Switch to Patient View
          </button>
        </div>
      </div>

      {/* Appointment Schedule List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-slate-900">Patient Appointment Schedule</h2>
          
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            {['Upcoming', 'Completed', 'Cancelled', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Loading doctor schedule...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No appointments in this view</h3>
            <p className="text-xs text-slate-500">There are no {activeTab.toLowerCase()} sessions scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold block">
                      APT-#{appt.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Patient: {appt.patient_name}
                    </h3>
                    <p className="text-xs text-teal-700 font-medium">
                      {appt.appointment_date} at {appt.time_slot}
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    appt.status === 'Upcoming' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {appt.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Reported Symptoms / Reason
                    </span>
                    <p className="text-slate-800 font-medium">
                      {appt.symptoms_summary || "Routine consult"}
                    </p>
                  </div>

                  {appt.notes && (
                    <div className="p-3 bg-teal-50/60 rounded-xl text-teal-900 space-y-0.5 border border-teal-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-700">
                        Doctor Notes / Instructions
                      </span>
                      <p>{appt.notes}</p>
                    </div>
                  )}
                </div>

                {appt.status === 'Upcoming' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAppt(appt);
                        setClinicalNotes(appt.notes || '');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                    >
                      Complete & Add Notes
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete Visit Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Complete Consultation #{selectedAppt.id}
            </h3>
            <p className="text-xs text-slate-600">
              Provide clinical observations, recommendations, or prescription notes for <strong>{selectedAppt.patient_name}</strong>.
            </p>

            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Recommended lifestyle modifications, prescribed antihistamine 10mg daily for 5 days. Follow up in 2 weeks."
              rows={4}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedAppt(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedAppt.id, 'Completed')}
                disabled={updating}
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Mark Completed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
