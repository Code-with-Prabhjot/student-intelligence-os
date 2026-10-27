import React from 'react';
import { 
  X, 
  Sparkles, 
  Award, 
  Mail, 
  Phone, 
  UserCheck, 
  BookOpen, 
  ShieldAlert, 
  Layers, 
  Edit3, 
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function StudentDetailModal() {
  const { isDetailModalOpen, detailStudent, closeDetailModal, openEditDrawer } = useStudentContext();

  if (!isDetailModalOpen || !detailStudent) return null;

  const s = detailStudent;

  const getAttendanceBadge = (att) => {
    if (att >= 85) {
      return (
        <span className="badge-safe px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> {att}% Attendance (Compliant)
        </span>
      );
    }
    if (att >= 75) {
      return (
        <span className="badge-warning px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" /> {att}% Attendance (Warning Zone)
        </span>
      );
    }
    return (
      <span className="badge-critical px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5" /> {att}% Attendance (Critical Risk)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        onClick={closeDetailModal}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative glass-card bg-slate-950/95 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-start justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                alt={s.name}
                className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-blue-500/30 object-cover shadow-lg"
              />
              {s.cgpa >= 9.0 && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-black shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white">{s.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {s.branch}
                </span>
              </div>
              <span className="font-mono text-sm font-semibold text-blue-400 block tracking-wider mt-0.5">
                {s.usn}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                R.V. College of Engineering, Bengaluru
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDetailModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Score Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          
          {/* CGPA */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Academic Score
            </span>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-white">
                {s.cgpa?.toFixed(2)}
                <span className="text-xs text-slate-500 font-normal ml-1">/ 10.0</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-amber-400">
              {s.cgpa >= 9.0 ? '★ Distinction Rank' : s.cgpa >= 7.5 ? 'First Class with Honors' : 'Second Class'}
            </span>
          </div>

          {/* Attendance */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Attendance
            </span>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-white">
                {s.attendance}%
              </div>
            </div>
            <div>{getAttendanceBadge(s.attendance)}</div>
          </div>

          {/* Cohort Placement */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" /> Lifecycle Status
            </span>
            <div className="my-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                s.status === 'Active'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {s.status}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Semester {s.semester} &bull; Section {s.section || 'A'}
            </span>
          </div>

        </div>

        {/* Academic Details & Faculty Mentor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2.5 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">
              Student Communication
            </h5>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{s.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{s.phone || '+91 98765 43210'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2.5 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">
              Faculty Mentorship
            </h5>
            <div className="flex items-center gap-2 text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Assigned Mentor: <strong className="text-white">{s.mentor || 'Dr. K. N. Subramanya'}</strong></span>
            </div>
            <p className="text-[11px] text-slate-400">
              Department of {s.branch} Engineering, RVCE Campus.
            </p>
          </div>
        </div>

        {/* Skills & Tech Stacks */}
        {s.skills && s.skills.length > 0 && (
          <div className="mb-6">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2.5">
              Verified Technical Stack & Competencies
            </h5>
            <div className="flex flex-wrap gap-2">
              {s.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-slate-800 border border-white/10 text-xs font-medium text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            DB ID: {s._id}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                closeDetailModal();
                openEditDrawer(s);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
            <button
              type="button"
              onClick={closeDetailModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
