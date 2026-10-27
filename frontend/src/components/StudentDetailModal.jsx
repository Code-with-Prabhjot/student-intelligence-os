import React, { useState } from 'react';
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
  AlertTriangle,
  Printer,
  TrendingUp,
  MessageSquare,
  Send,
  Calculator,
  Building
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function StudentDetailModal() {
  const { isDetailModalOpen, detailStudent, closeDetailModal, openEditDrawer, showToast } = useStudentContext();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'academics' | 'proctor'
  const [newNote, setNewNote] = useState('');
  const [proctorNotes, setProctorNotes] = useState(() => {
    return [
      {
        id: 1,
        date: '2024-02-10',
        author: 'Dr. Proctor Officer',
        text: 'Mid-semester performance review completed. Advised student on core course preparation and placement milestones.'
      }
    ];
  });

  if (!isDetailModalOpen || !detailStudent) return null;

  const s = detailStudent;

  // Calculate realistic semester progression up to student.semester
  const calculateSemesterHistory = (currentSem, finalCgpa) => {
    const history = [];
    const base = Math.max(5.5, finalCgpa - 0.4);
    for (let sem = 1; sem <= currentSem; sem++) {
      // Small variation ending close to current CGPA
      const variation = Math.sin(sem * 1.5) * 0.35 + (sem / currentSem) * 0.4;
      const sgpa = Math.min(10, Math.max(5.0, Number((base + variation).toFixed(2))));
      history.push({ semester: sem, sgpa });
    }
    return history;
  };

  const semHistory = calculateSemesterHistory(s.semester || 1, s.cgpa || 8.0);

  // Attendance Deficit / Buffer Logic (Standard 60 class semester)
  const STANDARD_CLASSES = 60;
  const attendedClasses = Math.round(((s.attendance || 0) / 100) * STANDARD_CLASSES);
  const isBelowCutoff = s.attendance < 75;
  
  // Classes needed to reach 75%: (attended + X) / (total + X) = 0.75 => X = 3*total - 4*attended
  const classesNeededFor75 = Math.max(0, Math.ceil(3 * STANDARD_CLASSES - 4 * attendedClasses));
  // Missable classes before dropping below 75%: (attended) / (total + Y) = 0.75 => Y = (4/3)*attended - total
  const classesMissable = Math.max(0, Math.floor((4 / 3) * attendedClasses - STANDARD_CLASSES));

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const noteObj = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      author: s.mentor || 'Faculty Proctor',
      text: newNote.trim(),
    };
    setProctorNotes([noteObj, ...proctorNotes]);
    setNewNote('');
    showToast('Proctor note recorded', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        onClick={closeDetailModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog */}
      <div className="relative glass-card bg-slate-950/95 rounded-3xl max-w-2xl w-full p-5 sm:p-7 border border-white/10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Printable Official College Header (Visible during Print) */}
        <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-4">
          <h2 className="text-xl font-bold tracking-tight text-black">R.V. COLLEGE OF ENGINEERING (RVCE)</h2>
          <p className="text-xs text-slate-600">Autonomous Institution affiliated to VTU &bull; Bengaluru - 560059</p>
          <h3 className="text-sm font-semibold uppercase mt-2 text-slate-800">Student Institutional Academic Transcript & Lifecycle Profile</h3>
        </div>

        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                alt={s.name}
                className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-indigo-500/30 object-cover"
              />
              {s.cgpa >= 9.0 && (
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-500 text-black shadow">
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">{s.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {s.branch}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-semibold text-blue-400 tracking-wider">
                  {s.usn}
                </span>
                <span className="text-slate-500 text-xs">&bull;</span>
                <span className="text-xs text-slate-400">
                  Semester {s.semester} (Sec {s.section || 'A'})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5 transition-colors print:hidden"
              title="Print Official Academic Record"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeDetailModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5 transition-colors print:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 pb-3 border-b border-white/5 flex-shrink-0 print:hidden text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academics')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'academics'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            SGPA Progression
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('proctor')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'proctor'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Proctor Counselling ({proctorNotes.length})
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Score Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* CGPA */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> CGPA Score
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {s.cgpa?.toFixed(2)}
                    <span className="text-xs text-slate-500 font-normal ml-1">/ 10</span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-400 mt-1 block">
                    {s.cgpa >= 9.0 ? '★ Distinction Rank' : s.cgpa >= 7.5 ? 'First Class' : 'Second Class'}
                  </span>
                </div>

                {/* Attendance */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Attendance
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {s.attendance}%
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 block ${
                    s.attendance >= 85 ? 'text-emerald-400' : s.attendance >= 75 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {s.attendance >= 75 ? 'VTU Compliant' : 'Barred from Exams'}
                  </span>
                </div>

                {/* Status */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" /> Academic Standing
                  </span>
                  <div className="text-xl font-extrabold text-white mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      s.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Section {s.section || 'A'} &bull; Dept of {s.branch}
                  </span>
                </div>
              </div>

              {/* VTU Deficit / Bunk Buffer Card */}
              <div className={`p-4 rounded-2xl border text-xs ${
                isBelowCutoff 
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
                  : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-1.5 font-bold">
                  {isBelowCutoff ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">VTU 75% Attendance Deficit Alert</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">VTU 75% Exam Eligibility Confirmed</span>
                    </>
                  )}
                </div>
                {isBelowCutoff ? (
                  <p className="leading-relaxed text-[11px] text-rose-200/90">
                    Student has missed {STANDARD_CLASSES - attendedClasses} out of {STANDARD_CLASSES} contact hours. 
                    Must attend <strong>{classesNeededFor75}</strong> consecutive classes without missing any to restore eligibility before semester end.
                  </p>
                ) : (
                  <p className="leading-relaxed text-[11px] text-emerald-200/90">
                    Student is safely above the VTU cutoff. Can safely miss up to <strong>{classesMissable}</strong> classes without falling below 75%.
                  </p>
                )}
              </div>

              {/* Faculty Mentor & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2">
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    Student Contact
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

                <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2">
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    Faculty Mentorship
                  </h5>
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{s.mentor || 'Dr. K. N. Subramanya'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Assigned Proctor &bull; RVCE Bengaluru
                  </p>
                </div>
              </div>

              {/* Skills */}
              {s.skills && s.skills.length > 0 && (
                <div>
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                    Verified Technical Competencies
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {s.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 text-[11px] text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: SGPA PROGRESSION */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                    Semester-Wise SGPA Progression
                  </h5>
                  <span className="text-xs font-mono text-blue-400 font-bold">
                    Cumulative CGPA: {s.cgpa?.toFixed(2)}
                  </span>
                </div>

                {/* Visual Bar Progression */}
                <div className="space-y-2.5">
                  {semHistory.map((item) => {
                    const percentage = (item.sgpa / 10) * 100;
                    return (
                      <div key={item.semester} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">Semester {item.semester}</span>
                          <span className="font-mono font-bold text-white">{item.sgpa.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.sgpa >= 9.0 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                                : item.sgpa >= 7.5 
                                ? 'bg-emerald-500' 
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/30 border border-white/5 text-xs text-slate-400">
                <p>
                  Calculated against RVCE 2022 Autonomous Scheme. Credits registered per semester: 22-25. Total credits earned: {(s.semester - 1) * 22} / 160.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PROCTOR COUNSELLING */}
          {activeTab === 'proctor' && (
            <div className="space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Add Proctoring / Advisory Remark
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter counselling notes (attendance, IA marks, academic advice)..."
                    className="flex-1 glass-input rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Log
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-2.5">
                {proctorNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-900/70 border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-semibold text-indigo-300">{note.author}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-shrink-0 print:hidden">
          <span className="text-[11px] text-slate-500 font-mono">
            {s.usn} &bull; DB Verified
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closeDetailModal();
                openEditDrawer(s);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={closeDetailModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
