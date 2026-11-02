import React, { useState } from 'react';
import { X, Calendar, Clock, Video, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../services/api';

export const BookingModal = ({ doctor, isOpen, onClose, prefilledSymptoms = '', onSuccess }) => {
  const { isAuthenticated, demoLogin } = useAuth();
  
  // Date setup: default to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState(doctor?.available_time_slots?.[0] || '10:00 AM');
  const [consultationType, setConsultationType] = useState('In-Person');
  const [symptoms, setSymptoms] = useState(prefilledSymptoms);
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen || !doctor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please sign in or use Demo Patient login below to book an appointment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await appointmentsAPI.create({
        doctor_id: doctor.id,
        appointment_date: date,
        time_slot: selectedSlot,
        consultation_type: consultationType,
        symptoms_summary: symptoms || "Routine checkup",
        notes: notes || ""
      });

      setConfirmedBooking(res.data);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || "Could not complete booking. Please try another time slot.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAuth = async () => {
    try {
      await demoLogin('patient');
      setError(null);
    } catch (err) {
      setError("Failed to initialize demo login.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Book Medical Consultation</h3>
            <p className="text-xs text-teal-100">Schedule your appointment with {doctor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Your appointment with <strong className="text-slate-800">{doctor.name}</strong> ({doctor.specialization}) has been scheduled successfully.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID:</span>
                <span className="font-mono font-bold text-slate-800">#APT-{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.appointment_date} at {confirmedBooking.time_slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Type:</span>
                <span className="font-semibold text-teal-700">{confirmedBooking.consultation_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital:</span>
                <span className="font-medium text-slate-800">{doctor.hospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fee:</span>
                <span className="font-bold text-slate-900">${doctor.consultation_fee}</span>
              </div>
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Doctor Snapshot */}
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={doctor.image_url}
                alt={doctor.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{doctor.name}</h4>
                <p className="text-xs text-teal-600 font-medium">{doctor.specialization} • ${doctor.consultation_fee}</p>
                <p className="text-[11px] text-slate-500 truncate">{doctor.hospital}</p>
              </div>
            </div>

            {/* Quick Guest / Auth Notice if not authenticated */}
            {!isAuthenticated && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs text-teal-900">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>You're currently booking as a guest.</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoAuth}
                  className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer"
                >
                  1-Click Demo Login
                </button>
              </div>
            )}

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1 space-y-1.5">
                  <p className="font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleDemoAuth();
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) form.requestSubmit();
                      }, 200);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Instant Login as Demo Patient & Book</span>
                  </button>
                </div>
              </div>
            )}

            {/* Consultation Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Consultation Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultationType('In-Person')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                    consultationType === 'In-Person'
                      ? 'border-teal-600 bg-teal-50 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>In-Person Visit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType('Video Call')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                    consultationType === 'Video Call'
                      ? 'border-teal-600 bg-teal-50 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>HD Video Call</span>
                </button>
              </div>
            </div>

            {/* Select Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            {/* Select Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {doctor.available_time_slots?.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 rounded-xl border text-xs font-mono font-medium transition-all ${
                      selectedSlot === slot
                        ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms / Chief Complaints */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Symptoms / Reason for Visit
              </label>
              <input
                type="text"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Chest pain, severe headache, seasonal allergy rash"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any ongoing medications or relevant medical history"
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
