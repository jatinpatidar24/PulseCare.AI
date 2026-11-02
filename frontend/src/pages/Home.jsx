import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  Calendar, 
  FileText, 
  HeartPulse, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  CheckCircle,
  Thermometer,
  Zap,
  Lock,
  ChevronRight
} from 'lucide-react';
import { doctorsAPI } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';

export const Home = ({ setCurrentTab, onOpenChat, onSelectDoctor, setSelectedSymptomsForPredictor }) => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorsAPI.getAll({ min_rating: 4.8 });
        setFeaturedDoctors(res.data.slice(0, 4));
      } catch (e) {
        console.error("Failed to load featured doctors", e);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDoctors();
  }, []);

  const quickSymptomScenarios = [
    {
      title: "Fever & Chills",
      desc: "High fever, chills, shivering, body ache",
      symptoms: ["high_fever", "chills", "sweating", "headache"],
      color: "from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-800"
    },
    {
      title: "Skin Rash & Irritation",
      desc: "Itching, redness, nodal skin eruptions",
      symptoms: ["itching", "skin_rash", "nodal_skin_eruptions"],
      color: "from-rose-500/10 to-pink-500/10 border-rose-200 text-rose-800"
    },
    {
      title: "Chest Tightness & Breath",
      desc: "Chest pain, shortness of breath, palpitations",
      symptoms: ["chest_pain", "breathlessness", "fast_heart_rate"],
      color: "from-red-500/10 to-rose-500/10 border-red-200 text-red-800"
    },
    {
      title: "Persistent Cough & Phlegm",
      desc: "Continuous cough, fatigue, phlegm",
      symptoms: ["cough", "phlegm", "breathlessness", "fatigue"],
      color: "from-cyan-500/10 to-teal-500/10 border-cyan-200 text-cyan-800"
    },
    {
      title: "Headache & Dizziness",
      desc: "Severe throbbing head pain, loss of balance",
      symptoms: ["headache", "dizziness", "loss_of_balance"],
      color: "from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-800"
    },
    {
      title: "Stomach & Digestion",
      desc: "Abdominal pain, acidity, nausea, vomiting",
      symptoms: ["abdominal_pain", "acidity", "vomiting"],
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-800"
    }
  ];

  const handleQuickSymptom = (symptoms) => {
    if (setSelectedSymptomsForPredictor) {
      setSelectedSymptomsForPredictor(symptoms);
    }
    setCurrentTab('predict');
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-teal-100/60 via-cyan-50/50 to-transparent blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Clinical Random Forest Machine Learning Model</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Intelligent Healthcare, <br />
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
                  Predictive & Connected.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Analyze your symptoms using clinical machine learning, receive instant disease probabilities, consult certified medical specialists, track your vitals, and keep digital health records in one secure portal.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => setCurrentTab('predict')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-teal-600/25 flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Check Symptoms with ML</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTab('doctors')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm sm:text-base shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span>Find Specialists</span>
                </button>

                <button
                  onClick={onOpenChat}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-sm sm:text-base transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>AI Triage Chat</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>41+ Validated Conditions</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>Secure HIPAA-Ready EHR</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Zero-Wait Telehealth</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
                
                {/* Floating badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Live AI Triage Active
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    98.4% Precision
                  </span>
                </div>

                {/* Simulated Triage snippet */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="text-xs text-slate-500 font-medium">Reported presentation:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['itching', 'skin rash', 'nodal eruptions'].map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">ML Predicted Condition:</p>
                      <p className="text-sm font-bold text-slate-900">Fungal infection</p>
                    </div>
                    <span className="text-xs font-extrabold text-teal-700 bg-teal-100/80 px-2.5 py-1 rounded-lg">
                      94% Match
                    </span>
                  </div>
                </div>

                {/* Suggested Specialist Box */}
                <div className="p-3.5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/70 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1594824813637-8e6587c69992?w=400&auto=format&fit=crop&q=80"
                      alt="Doctor"
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dr. Elena Rostova</p>
                      <p className="text-[11px] text-teal-700 font-medium">Board Dermatologist</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentTab('doctors')}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Connect
                  </button>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-base font-extrabold text-slate-900">130+</p>
                    <p className="text-[10px] text-slate-500">Symptoms</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-base font-extrabold text-slate-900">41</p>
                    <p className="text-[10px] text-slate-500">Diseases</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-base font-extrabold text-slate-900">100%</p>
                    <p className="text-[10px] text-slate-500">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1-Click Quick Triage Scenarios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            One-Click Clinical Symptom Checkers
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Select a common presentation below to run the machine learning model immediately or start your custom check.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickSymptomScenarios.map((sc, i) => (
            <div
              key={i}
              onClick={() => handleQuickSymptom(sc.symptoms)}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${sc.color} hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-slate-900">{sc.title}</h3>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {sc.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 text-xs font-semibold">
                <span className="text-slate-500">{sc.symptoms.length} symptoms included</span>
                <span className="text-teal-700 flex items-center space-x-1">
                  <span>Diagnose</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="bg-slate-900 text-white rounded-3xl py-14 px-6 sm:px-12 max-w-7xl mx-auto my-12">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Complete Healthcare Ecosystem</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Designed for Accuracy, Privacy & Continuity of Care
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Everything patient and physician need to triage, treat, monitor, and maintain long-term health records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Disease Prediction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained Random Forest model computes statistical probability over 40+ clinical diseases with lifestyle precautions.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Specialist Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated routing directs patients directly to Cardiologists, Dermatologists, Neurologists, or Pulmonologists.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Digital Health Records</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload and store prescriptions, lab panels, and diagnostic imaging securely with fast one-click doctor retrieval.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Patient Vitals Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log blood pressure, pulse, glucose, and oxygen saturation with smart alert indicators for hypertensive thresholds.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Top Verified Medical Specialists
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Connect with leading board-certified physicians for online and clinic consultations.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('doctors')}
            className="flex items-center space-x-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loadingDocs ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Loading verified doctors...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBook={() => onSelectDoctor(doctor)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">Unsure which doctor you need?</h3>
            <p className="text-sm text-teal-100 max-w-xl">
              Talk directly with our AI Medical Triage Assistant or select your exact symptoms to receive an instant specialized diagnosis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onOpenChat}
              className="px-6 py-3 rounded-xl bg-white text-teal-800 font-bold text-sm hover:bg-teal-50 transition-colors shadow-sm"
            >
              Start AI Chat
            </button>
            <button
              onClick={() => setCurrentTab('predict')}
              className="px-6 py-3 rounded-xl bg-teal-900/60 border border-teal-400/40 text-white font-semibold text-sm hover:bg-teal-900 transition-colors"
            >
              Open Symptom Checker
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
