import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Pill, 
  FileCheck, 
  ExternalLink,
  X,
  AlertCircle,
  FileSpreadsheet,
  Activity
} from 'lucide-react';
import { recordsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  
  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('Prescription');
  const [doctorName, setDoctorName] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescribedMedications, setPrescribedMedications] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await recordsAPI.getAll();
      setRecords(res.data);
    } catch (e) {
      console.error("Failed to load records", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload (PDF, PNG, JPG).");
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('record_type', recordType);
      formData.append('doctor_name', doctorName || 'Attending Physician');
      formData.append('record_date', recordDate);
      formData.append('diagnosis', diagnosis);
      formData.append('prescribed_medications', prescribedMedications);
      formData.append('notes', notes);
      formData.append('file', selectedFile);

      await recordsAPI.upload(formData);
      
      // Reset form
      setTitle('');
      setDoctorName('');
      setDiagnosis('');
      setPrescribedMedications('');
      setNotes('');
      setSelectedFile(null);
      setIsUploadOpen(false);

      await fetchRecords();
    } catch (err) {
      setUploadError(err.response?.data?.detail || "Upload failed. Please ensure file is valid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) return;
    try {
      await recordsAPI.delete(id);
      await fetchRecords();
    } catch (e) {
      alert("Failed to delete record.");
    }
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesFilter = filterType === 'All' || r.record_type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          (r.doctor_name && r.doctor_name.toLowerCase().includes(search.toLowerCase())) ||
                          (r.diagnosis && r.diagnosis.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getRecordTypeBadge = (type) => {
    switch (type.toLowerCase()) {
      case 'prescription':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'lab report':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'diagnostic scan':
        return 'bg-purple-50 text-purple-700 border-purple-200';
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
            Electronic Health Records (EHR)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Store and manage your medical prescriptions, lab reports, and diagnostic test records securely in one place.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Record / Prescription</span>
        </button>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Documents</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{records.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prescriptions</p>
          <p className="text-2xl font-extrabold text-teal-600 mt-1">
            {records.filter(r => r.record_type === 'Prescription').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lab Panels</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {records.filter(r => r.record_type === 'Lab Report').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnostic Scans</p>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">
            {records.filter(r => r.record_type === 'Diagnostic Scan').length}
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, doctor, diagnosis..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['All', 'Prescription', 'Lab Report', 'Diagnostic Scan'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Record Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading medical records...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No medical records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your medical prescriptions, lab reports, or doctor summaries to maintain a unified medical history.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            Upload New File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-teal-600 shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{rec.record_date}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRecordTypeBadge(rec.record_type)}`}>
                    {rec.record_type}
                  </span>
                </div>

                {/* Doctor and file meta */}
                <div className="space-y-2 py-3 text-xs text-slate-600">
                  {rec.doctor_name && (
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">Prescribed by {rec.doctor_name}</span>
                    </div>
                  )}

                  {rec.diagnosis && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnosis</span>
                      <p className="font-semibold">{rec.diagnosis}</p>
                    </div>
                  )}

                  {rec.prescribed_medications && (
                    <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 text-slate-700 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-teal-700 flex items-center space-x-1">
                        <Pill className="w-3 h-3" />
                        <span>Medications / Dosage</span>
                      </span>
                      <p className="font-medium text-slate-800">{rec.prescribed_medications}</p>
                    </div>
                  )}

                  {rec.notes && (
                    <p className="text-xs text-slate-500 italic">
                      "{rec.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={rec.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View / Download</span>
                </a>

                <button
                  onClick={() => handleDelete(rec.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative">
            
            <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Upload Medical Document</h3>
                <p className="text-xs text-teal-100">Attach prescriptions, lab panels, or scans</p>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Blood Chemistry, Skin Clinic Prescription"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Type and Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Record Type
                  </label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Diagnostic Scan">Diagnostic Scan</option>
                    <option value="Clinical Note">Clinical Note</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Record
                  </label>
                  <input
                    type="date"
                    required
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  >
                  </input>
                </div>
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physician / Clinic Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Marcus Vance, City Health Lab"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Diagnosis (Optional)
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Acute Bronchitis"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Prescribed Medications */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prescribed Medications & Dosages
                </label>
                <textarea
                  value={prescribedMedications}
                  onChange={(e) => setPrescribedMedications(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg (3x daily for 7 days), Paracetamol 650mg SOS"
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach File (PDF, PNG, JPG, WEBP) *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-teal-500 transition-colors">
                  <input
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="medical-file-input"
                  />
                  <label htmlFor="medical-file-input" className="cursor-pointer space-y-1 block">
                    <Upload className="w-8 h-8 text-teal-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">
                      {selectedFile ? selectedFile.name : 'Click to select or drag document here'}
                    </p>
                    <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Save to EHR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
