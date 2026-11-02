import React from 'react';
import { Activity, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export const Footer = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Medical Emergency Disclaimer Banner */}
        <div className="mb-10 p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-300 font-semibold">Medical Disclaimer:</strong> PulseCare.AI provides clinical triage assistance, machine-learning based symptom analysis, and provider matching for educational and preliminary assessment purposes only. In case of life-threatening emergencies, severe chest pain, shortness of breath, or trauma, please dial <strong>911 (US) / 112 (EU/IN)</strong> or visit your nearest emergency room immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PulseCare<span className="text-teal-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent machine-learning disease prediction, smart specialist matching, real-time vital monitoring, and HIPAA-compliant electronic health records.
            </p>
            <div className="flex items-center space-x-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Clinical Machine Learning Engine</span>
            </div>
          </div>

          {/* Clinical Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Clinical ML</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('predict')} className="hover:text-teal-400 transition-colors">
                  Symptom-Based Disease Prediction
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('predict')} className="hover:text-teal-400 transition-colors">
                  Multi-Disease Classifier (40+ Conditions)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('doctors')} className="hover:text-teal-400 transition-colors">
                  Specialist Recommendation Engine
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('vitals')} className="hover:text-teal-400 transition-colors">
                  Vitals & Risk Monitoring
                </button>
              </li>
            </ul>
          </div>

          {/* Telehealth */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Telehealth Portal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('doctors')} className="hover:text-teal-400 transition-colors">
                  Find Verified Doctors
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('appointments')} className="hover:text-teal-400 transition-colors">
                  Book In-Person & Video Visits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('records')} className="hover:text-teal-400 transition-colors">
                  Prescription & EHR Management
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('doctor-portal')} className="hover:text-teal-400 transition-colors">
                  Doctor Provider Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Medical Specialties</h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Cardiology', 'Dermatology', 'Neurology', 
                'Orthopedics', 'Gastroenterology', 'Pulmonology',
                'Endocrinology', 'General Medicine'
              ].map((spec) => (
                <span key={spec} className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PulseCare AI Health Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with precision for healthcare & clinical intelligence</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
