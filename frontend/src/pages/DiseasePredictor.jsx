import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  X, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Stethoscope, 
  Calendar, 
  RefreshCw, 
  CheckCircle2, 
  Info,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { mlAPI } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';

export const DiseasePredictor = ({ preselectedSymptoms = [], onSelectDoctor }) => {
  const [categories, setCategories] = useState({});
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState(preselectedSymptoms);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [loading, setLoading] = useState(false);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await mlAPI.getSymptoms();
        setCategories(res.data.categories);
        setAllSymptoms(res.data.all_symptoms);
      } catch (err) {
        console.error("Failed to load symptoms", err);
      } finally {
        setLoadingSymptoms(false);
      }
    };
    fetchSymptoms();
  }, []);

  // If preselected symptoms passed from quick scenarios or other pages
  useEffect(() => {
    if (preselectedSymptoms && preselectedSymptoms.length > 0) {
      setSelectedSymptoms(preselectedSymptoms);
      // Auto-trigger prediction
      handlePredict(preselectedSymptoms);
    }
  }, [preselectedSymptoms]);

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptomId)) {
        return prev.filter((s) => s !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const handlePredict = async (symptomsToRun = selectedSymptoms) => {
    if (!symptomsToRun || symptomsToRun.length === 0) {
      setError("Please select at least one symptom to run the disease predictor.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await mlAPI.predictDisease({
        symptoms: symptomsToRun,
        top_k: 3
      });
      setResult(res.data);
      // Scroll smoothly down to results
      setTimeout(() => {
        document.getElementById('prediction-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed. Please try selecting different symptoms.");
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedSymptoms([]);
    setResult(null);
    setError(null);
  };

  // Filter symptoms based on search and category
  const filteredSymptoms = allSymptoms.filter((s) => {
    const matchesSearch = s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    const catList = categories[activeCategory] || [];
    const isInCat = catList.some((item) => item.id === s.id);
    return matchesSearch && isInCat;
  });

  const getSeverityBadge = (sev) => {
    const lower = (sev || '').toLowerCase();
    if (lower.includes('emergency') || lower.includes('critical')) {
      return 'bg-rose-100 text-rose-800 border-rose-300';
    }
    if (lower.includes('high')) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    }
    if (lower.includes('moderate')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Machine Learning Clinical Classifier</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Symptom-Based Disease Prediction
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Select all symptoms you are currently experiencing. Our validated clinical model will compute disease likelihoods, explain key precautions, and recommend the exact medical specialist for your condition.
        </p>
      </div>

      {/* Selected Symptoms Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-800">
              Selected Symptoms:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              {selectedSymptoms.length}
            </span>
          </div>

          {selectedSymptoms.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {selectedSymptoms.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-400 italic py-2">
            No symptoms selected yet. Pick symptoms from the catalog below or use search to begin.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 py-1 max-h-36 overflow-y-auto">
            {selectedSymptoms.map((symId) => {
              const label = symId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              return (
                <span
                  key={symId}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-semibold shadow-xs animate-in zoom-in-95 duration-100"
                >
                  <span>{label}</span>
                  <button
                    onClick={() => toggleSymptom(symId)}
                    className="hover:bg-teal-700 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Prediction Trigger CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            For highest accuracy, pick 2 or more related symptoms.
          </span>
          <button
            onClick={() => handlePredict()}
            disabled={selectedSymptoms.length === 0 || loading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Running Prediction Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Predict Disease & Find Doctors</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Symptoms Browser / Catalog */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
        
        {/* Search Bar & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symptom (e.g. chest, fever, cough)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <span className="text-xs text-slate-500">
            Showing <strong>{filteredSymptoms.length}</strong> of {allSymptoms.length} clinical symptoms
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-100 text-xs">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
              activeCategory === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Symptoms Grid */}
        {loadingSymptoms ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Loading symptom database...
          </div>
        ) : filteredSymptoms.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No symptoms matching "<strong>{searchQuery}</strong>". Try a different search term.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[460px] overflow-y-auto p-1">
            {filteredSymptoms.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="truncate mr-2">{sym.label}</span>
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 group-hover:border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Prediction Output Section */}
      {result && (
        <div id="prediction-results" className="space-y-8 pt-6 animate-in fade-in duration-300">
          
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-lg">
            <Activity className="w-5 h-5" />
            <h2>Clinical Assessment & Recommendations</h2>
          </div>

          {/* Primary Condition Card */}
          {result.primary_prediction && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-teal-500/80 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Primary Predicted Condition
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                    {result.primary_prediction.disease}
                  </h3>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Severity Badge */}
                  <div className={`px-3 py-1 rounded-xl text-xs font-bold border ${getSeverityBadge(result.primary_prediction.severity)}`}>
                    Severity: {result.primary_prediction.severity}
                  </div>

                  {/* Confidence Percentage */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-bold flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <span>{result.primary_prediction.confidence_percentage}% Probability</span>
                  </div>
                </div>
              </div>

              {/* Disease Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Clinical Overview</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  {result.primary_prediction.description}
                </p>
              </div>

              {/* Recommended Precautions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended Precautions & Immediate Care
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.primary_prediction.precautions.map((prec, i) => (
                    <div key={i} className="flex items-start space-x-2.5 p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{prec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialist Routing Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-700 to-cyan-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-100">Recommended Medical Specialist</p>
                    <p className="text-lg font-bold">{result.recommended_specialty}</p>
                  </div>
                </div>
                <span className="text-xs text-teal-100 bg-white/10 px-3 py-1 rounded-lg">
                  Matched via Clinical ML
                </span>
              </div>
            </div>
          )}

          {/* Alternative Diagnoses */}
          {result.all_predictions?.length > 1 && (
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-3">
              <h4 className="text-sm font-bold text-slate-800">
                Alternative Differential Diagnoses
              </h4>
              <p className="text-xs text-slate-500">
                Other conditions that share overlapping symptoms with your report:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {result.all_predictions.slice(1).map((alt, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{alt.disease}</p>
                      <p className="text-[11px] text-slate-500">{alt.specialization}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {alt.confidence_percentage}% match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Doctors for this condition */}
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Recommended {result.recommended_specialty} Specialists
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verified physicians matching your predicted condition available for immediate scheduling.
              </p>
            </div>

            {result.recommended_doctors?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No specialist available at this exact moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.recommended_doctors.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    onBook={() => onSelectDoctor(doc, result.primary_prediction?.disease)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
