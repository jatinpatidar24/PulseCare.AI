import React from 'react';
import { Star, MapPin, Building, Clock, Award, Calendar, Video } from 'lucide-react';

export const DoctorCard = ({ doctor, onBook }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Header with Avatar & Badge */}
        <div className="p-5 pb-3">
          <div className="flex items-start space-x-4">
            <div className="relative shrink-0">
              <img
                src={doctor.image_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"}
                alt={doctor.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-slate-100 group-hover:scale-102 transition-transform shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20" title="Available"></span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                  {doctor.specialization}
                </span>
                <div className="flex items-center space-x-1 text-xs text-amber-600 font-semibold ml-auto">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating}</span>
                  <span className="text-slate-400 font-normal">({doctor.reviews_count})</span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate">
                {doctor.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">{doctor.qualification}</p>

              <div className="flex items-center space-x-1 text-xs text-slate-600 mt-1 font-medium">
                <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{doctor.experience_years} years experience</span>
              </div>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center space-x-2 truncate">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
            <div className="flex items-center space-x-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.location}</span>
            </div>
          </div>

          {/* Short Bio */}
          {doctor.bio && (
            <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed italic">
              "{doctor.bio}"
            </p>
          )}

          {/* Availability chips */}
          <div className="mt-3 flex items-center space-x-1 overflow-x-auto text-[11px] text-slate-500">
            <Clock className="w-3 h-3 text-slate-400 shrink-0 mr-1" />
            <span>Slots:</span>
            {doctor.available_time_slots?.slice(0, 2).map((slot, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
                {slot}
              </span>
            ))}
            {doctor.available_time_slots?.length > 2 && (
              <span className="text-[10px] text-slate-400">+{doctor.available_time_slots.length - 2} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Fee & Action */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Fee</span>
          <span className="text-lg font-bold text-slate-900">${doctor.consultation_fee}</span>
          <span className="text-[10px] text-slate-500"> / session</span>
        </div>

        <button
          onClick={() => onBook(doctor)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Visit</span>
        </button>
      </div>
    </div>
  );
};
