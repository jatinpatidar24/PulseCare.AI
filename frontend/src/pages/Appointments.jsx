import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  UserCheck, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Plus,
  PhoneCall,
  Camera,
  Mic,
  X
} from 'lucide-react';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Appointments = ({ setCurrentTab, onOpenBookModal }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [statusActionLoading, setStatusActionLoading] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentsAPI.getAll();
      setAppointments(res.data);
    } catch (e) {
      console.error("Failed to load appointments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    setStatusActionLoading(id);
    try {
      await appointmentsAPI.updateStatus(id, { status: 'Cancelled' });
      await fetchAppointments();
    } catch (e) {
      alert("Failed to cancel appointment");
    } finally {
      setStatusActionLoading(null);
    }
  };

  const filtered = appointments.filter(a => {
    if (filter === 'All') return true;
    return a.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (st) => {
    switch (st.toLowerCase()) {
      case 'upcoming':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Consultation Appointments
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track your scheduled visits, access video telehealth sessions, and review clinical consultation summaries.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('doctors')}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Visit</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs sm:text-sm font-semibold">
        {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
            <span className="ml-1.5 opacity-60 text-xs">
              ({tab === 'All' ? appointments.length : appointments.filter(a => a.status.toLowerCase() === tab.toLowerCase()).length})
            </span>
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading appointments...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} consultations scheduled at the moment.
          </p>
          <button
            onClick={() => setCurrentTab('doctors')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      APT-#{appt.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {appt.doctor_name}
                    </h3>
                    <span className="inline-block text-xs font-medium text-teal-700">
                      {appt.doctor_specialty}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 py-3 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{appt.appointment_date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{appt.time_slot}</span>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    {appt.consultation_type === 'Video Call' ? (
                      <Video className="w-4 h-4 text-cyan-600 shrink-0" />
                    ) : (
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-medium">{appt.consultation_type} Consultation</span>
                  </div>
                </div>

                {/* Symptoms / Chief Complaint */}
                {appt.symptoms_summary && (
                  <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Chief Complaint / Symptoms
                    </span>
                    <p className="text-slate-700 font-medium">{appt.symptoms_summary}</p>
                  </div>
                )}

                {/* Doctor's Notes (if any) */}
                {appt.notes && (
                  <div className="mt-2 p-3 bg-teal-50/60 rounded-2xl text-xs space-y-1 border border-teal-100">
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                      Clinical Notes / Instructions
                    </span>
                    <p className="text-slate-700">{appt.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {appt.status === 'Upcoming' && (
                  <>
                    <button
                      onClick={() => handleCancel(appt.id)}
                      disabled={statusActionLoading === appt.id}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      {statusActionLoading === appt.id ? 'Cancelling...' : 'Cancel Visit'}
                    </button>

                    {appt.consultation_type === 'Video Call' && (
                      <button
                        onClick={() => setActiveVideoModal(appt)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Telehealth Call</span>
                      </button>
                    )}
                  </>
                )}

                {appt.status === 'Completed' && (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Consultation Finished</span>
                    </span>
                    <button
                      onClick={() => setCurrentTab('records')}
                      className="text-xs font-semibold text-teal-700 hover:underline flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Check Prescriptions</span>
                    </button>
                  </div>
                )}

                {appt.status === 'Cancelled' && (
                  <span className="text-xs text-slate-400 italic">
                    Appointment was cancelled.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Telehealth Room Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Encrypted Video Consultation Room
                </span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport */}
            <div className="p-6 space-y-6">
              <div className="aspect-video bg-slate-800 rounded-2xl relative flex items-center justify-center border border-slate-700 overflow-hidden">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
                    <UserCheck className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{activeVideoModal.doctor_name}</h4>
                    <p className="text-xs text-slate-400">{activeVideoModal.doctor_specialty}</p>
                    <p className="text-xs text-emerald-400 mt-2">Connecting audio/video stream...</p>
                  </div>
                </div>

                {/* Patient self-view picture in picture */}
                <div className="absolute bottom-4 right-4 w-28 h-20 bg-slate-700/80 rounded-xl border border-slate-600 flex items-center justify-center text-[10px] text-slate-300">
                  <span>Your Camera</span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4 rotate-135" />
                  <span>Leave Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
