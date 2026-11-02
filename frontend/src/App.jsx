import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { SymptomChatbot } from './components/SymptomChatbot';

import { Home } from './pages/Home';
import { DiseasePredictor } from './pages/DiseasePredictor';
import { Doctors } from './pages/Doctors';
import { Appointments } from './pages/Appointments';
import { MedicalRecords } from './pages/MedicalRecords';
import { VitalsMonitor } from './pages/VitalsMonitor';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { Bot, Sparkles } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Booking modal state
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingPrefilledSymptoms, setBookingPrefilledSymptoms] = useState('');
  
  // Preselected symptoms for predictor
  const [preselectedSymptoms, setPreselectedSymptoms] = useState([]);

  const handleOpenBooking = (doctor, symptoms = '') => {
    setBookingDoctor(doctor);
    setBookingPrefilledSymptoms(symptoms);
  };

  const handleBookingSuccess = () => {
    // Navigate to appointments tab upon successful booking
    setCurrentTab('appointments');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            setCurrentTab={setCurrentTab}
            onOpenChat={() => setIsChatOpen(true)}
            onSelectDoctor={handleOpenBooking}
            setSelectedSymptomsForPredictor={setPreselectedSymptoms}
          />
        )}

        {currentTab === 'predict' && (
          <DiseasePredictor
            preselectedSymptoms={preselectedSymptoms}
            onSelectDoctor={handleOpenBooking}
          />
        )}

        {currentTab === 'doctors' && (
          <Doctors onSelectDoctor={handleOpenBooking} />
        )}

        {currentTab === 'appointments' && (
          <Appointments
            setCurrentTab={setCurrentTab}
            onOpenBookModal={handleOpenBooking}
          />
        )}

        {currentTab === 'records' && (
          <MedicalRecords />
        )}

        {currentTab === 'vitals' && (
          <VitalsMonitor />
        )}

        {currentTab === 'doctor-portal' && (
          <DoctorDashboard setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'login' && (
          <Login setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'register' && (
          <Register setCurrentTab={setCurrentTab} />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        doctor={bookingDoctor}
        isOpen={!!bookingDoctor}
        onClose={() => setBookingDoctor(null)}
        prefilledSymptoms={bookingPrefilledSymptoms}
        onSuccess={handleBookingSuccess}
      />

      {/* Conversational AI Health Chatbot */}
      <SymptomChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onBookDoctor={(doc, syms) => {
          setIsChatOpen(false);
          handleOpenBooking(doc, syms);
        }}
      />

      {/* Floating Chat Trigger Button (when chat is closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 group cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-teal-600 animate-pulse"></span>
          </div>
          <span className="text-xs font-bold pr-1.5 hidden sm:inline-block">
            AI Triage Assistant
          </span>
        </button>
      )}

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
