import React, { useState, useEffect } from 'react';
import { Search, Stethoscope, Filter, Star, X } from 'lucide-react';
import { doctorsAPI } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';

export const Doctors = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('');
  
  const [loading, setLoading] = useState(true);

  // Load available specializations
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await doctorsAPI.getSpecializations();
        setSpecializations(['All', ...res.data]);
      } catch (e) {
        console.error("Failed to load specialties", e);
      }
    };
    fetchSpecialties();
  }, []);

  // Fetch doctors whenever filters change
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedSpecialty !== 'All') params.specialization = selectedSpecialty;
        if (search) params.search = search;
        if (minRating) params.min_rating = parseFloat(minRating);

        const res = await doctorsAPI.getAll(params);
        setDoctors(res.data);
      } catch (e) {
        console.error("Failed to fetch doctors", e);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchDoctors, 250);
    return () => clearTimeout(debounce);
  }, [selectedSpecialty, search, minRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find & Consult Specialists
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Browse verified board-certified physicians, compare experience and patient reviews, and book instant in-person or video consultations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Box */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name, hospital, or qualification..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Rating Filter */}
          <div className="sm:col-span-4 flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
            >
              <option value="">Any Rating</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="4.9">4.9+ Stars</option>
            </select>
          </div>
        </div>

        {/* Specialization Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Searching doctors...
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Stethoscope className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No doctors found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any doctors matching your filters. Try clearing your search query or choosing another specialty.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSpecialty('All');
              setMinRating('');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={() => onSelectDoctor(doctor)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
