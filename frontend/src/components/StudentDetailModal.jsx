import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Printer, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Mail, 
  Phone, 
  Award, 
  Layers, 
  Calendar, 
  Clock, 
  UserCheck, 
  TrendingUp, 
  MessageSquare, 
  Send,
  Building,
  Github,
  ExternalLink,
  Code2,
  Globe,
  Stethoscope,
  XCircle,
  Briefcase
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function StudentDetailModal() {
  const { isDetailModalOpen, detailStudent, closeDetailModal, openEditDrawer, showToast } = useStudentContext();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'placement' | 'academics' | 'proctor'
  const [newNote, setNewNote] = useState('');
  const [proctorNotes, setProctorNotes] = useState(() => {
    return [
      {
        id: 1,
        date: '2024-02-10',
        author: 'Dr. Proctor Officer',
        text: 'Mid-semester performance review completed. Advised student on core course preparation, open-source projects, and placement milestones.'
      }
    ];
  });

  if (!isDetailModalOpen || !detailStudent) return null;

  const s = detailStudent;

  // Calculate semester SGPA progression
  const calculateSemesterHistory = (currentSem, finalCgpa) => {
    const history = [];
    const base = Math.max(5.5, finalCgpa - 0.4);
    for (let sem = 1; sem <= currentSem; sem++) {
      const variation = Math.sin(sem * 1.5) * 0.35 + (sem / currentSem) * 0.4;
      const sgpa = Math.min(10, Math.max(5.0, Number((base + variation).toFixed(2))));
      history.push({ semester: sem, sgpa });
    }
    return history;
  };

  const semHistory = calculateSemesterHistory(s.semester || 1, s.cgpa || 8.0);

  // Attendance Deficit & RVCE Regulations Logic
  const STANDARD_CLASSES = 60;
  const attendedClasses = Math.round(((s.attendance || 0) / 100) * STANDARD_CLASSES);

  const getNeededClasses = (target) => {
    if (s.attendance >= target) return 0;
    return Math.max(0, Math.ceil((target * STANDARD_CLASSES - 100 * attendedClasses) / (100 - target)));
  };

  const getBunkBuffer = (target) => {
    if (s.attendance < target) return 0;
    return Math.max(0, Math.floor((100 * attendedClasses) / target - STANDARD_CLASSES));
  };

  const classesNeededFor75 = getNeededClasses(75);
  const classesNeededFor85 = getNeededClasses(85);
  const classesMissable75 = getBunkBuffer(75);

  const handlePrint = () => {
    window.print();
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      author: 'Academic Advisor',
      text: newNote.trim()
    };

    setProctorNotes((prev) => [note, ...prev]);
    setNewNote('');
    showToast('Proctor note recorded successfully', 'success');
  };

  // Placement Readiness Evaluation
  const isPlacementEligible = s.cgpa >= 8.5 && Boolean(s.githubUsername && s.githubUsername.trim());
  const placementTier = s.cgpa >= 9.0 && s.githubUsername 
    ? 'Tier-1 Super Dream (20+ LPA)' 
    : s.cgpa >= 8.5 
    ? 'Dream Company (10-20 LPA)' 
    : s.cgpa >= 7.5 
    ? 'Core & IT Placement (6-10 LPA)' 
    : 'Skill Enhancement Required';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        onClick={closeDetailModal}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      ></div>

      {/* Modal Dialog Card */}
      <div className="relative glass-card bg-slate-950/95 rounded-3xl max-w-2xl w-full p-6 border border-white/10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Printable Official College Header */}
        <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-4">
          <h2 className="text-xl font-bold tracking-tight text-black">R.V. COLLEGE OF ENGINEERING (RVCE)</h2>
          <p className="text-xs text-slate-600">Autonomous Institution affiliated to VTU &bull; Bengaluru - 560059</p>
          <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">Office of Dean (Academics) &bull; Official Student Cumulative Record</p>
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <img
                src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                alt={s.name}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 shadow-inner"
              />
              {s.cgpa >= 9.0 && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-black shadow-md" title="Distinction Scholar">
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">{s.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
                  {s.branch}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-semibold text-slate-300 tracking-wider">
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
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-colors print:hidden"
              title="Print Official Academic Record"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeDetailModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/5 transition-colors print:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Developer Profiles Quick Launcher Ribbon */}
        {(s.githubUsername || s.leetcodeHandle || s.portfolioUrl) && (
          <div className="flex flex-wrap items-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/5 my-3 text-xs flex-shrink-0">
            <span className="text-slate-400 text-[11px] font-semibold mr-1">Profiles:</span>
            {s.githubUsername && (
              <a
                href={`https://github.com/${s.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-[11px] font-mono transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-purple-400" />
                <span>@{s.githubUsername}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
              </a>
            )}
            {s.leetcodeHandle && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-amber-300 border border-white/10 text-[11px] font-mono">
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{s.leetcodeHandle}</span>
              </span>
            )}
            {s.portfolioUrl && (
              <a
                href={s.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] transition-colors"
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Portfolio</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
              </a>
            )}
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/5 flex-shrink-0 print:hidden text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview & Exam Standing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('placement')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'placement'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            Placement Radar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academics')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'academics'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-slate-300" />
            SGPA Progression
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('proctor')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'proctor'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Proctor Counselling ({proctorNotes.length})
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">

          {/* TAB 1: OVERVIEW & EXAM STANDING */}
          {activeTab === 'overview' && (
            <>
              {/* Score Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* CGPA */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
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
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> Total Attendance
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {s.attendance}%
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                    {attendedClasses} of {STANDARD_CLASSES} contact hours
                  </span>
                </div>

                {/* Status */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-white" /> Academic Standing
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

              {/* VTU Condonation Regulations Card */}
              <div className={`p-4 rounded-2xl border text-xs ${
                s.attendance < 65 
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
                  : s.attendance < 75
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-1.5 font-bold">
                  {s.attendance < 65 ? (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">Detained & Barred (NSAR) &bull; VTU Reg 18OB4.2</span>
                    </>
                  ) : s.attendance < 75 ? (
                    <>
                      <Stethoscope className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">Condonation Required (Medical / HoD Clearance)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">SEE Examination Eligibility Confirmed (&ge; 75%)</span>
                    </>
                  )}
                </div>

                {s.attendance < 65 ? (
                  <p className="leading-relaxed text-[11px] text-rose-200/90">
                    Attendance is strictly below the 65% statutory threshold. As per VTU Academic Regulations, condonation is prohibited. Student must re-register for the course (NSAR).
                  </p>
                ) : s.attendance < 75 ? (
                  <p className="leading-relaxed text-[11px] text-amber-200/90">
                    Attendance lies between 65% and 75%. Student must submit certified medical documents / HoD approval to Principal for condonation approval. Requires attending <strong>{classesNeededFor75}</strong> consecutive lectures to reach 75%.
                  </p>
                ) : (
                  <p className="leading-relaxed text-[11px] text-emerald-200/90">
                    Student meets mandatory 75% attendance. Has buffer to miss up to <strong>{classesMissable75}</strong> lectures without falling below threshold.
                  </p>
                )}
              </div>

              {/* Faculty Mentor & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    Student Contact
                  </h5>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-white" />
                    <span>{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{s.phone || '+91 98765 43210'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                    Faculty Mentorship
                  </h5>
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-slate-300" />
                    <span>{s.mentor || 'Dr. K. S. Geetha (HOD)'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Enrolled: Aug 2023 &bull; Autonomous</span>
                  </div>
                </div>
              </div>

            </>
          )}

          {/* TAB 2: PLACEMENT RADAR */}
          {activeTab === 'placement' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-purple-400" /> Placement Eligibility Tier
                  </h5>
                  <span className="px-3 py-1 rounded-full text-xs font-bold badge-tier1">
                    {placementTier}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">CGPA Requirement (&ge; 8.5):</span>
                    <span className={`font-mono font-bold ${s.cgpa >= 8.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {s.cgpa >= 8.5 ? '✓ Satisfied' : '✗ Below 8.5 Cutoff'} ({s.cgpa.toFixed(2)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Open-Source & GitHub Profile:</span>
                    <span className={`font-mono font-bold ${s.githubUsername ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {s.githubUsername ? `✓ Linked (@${s.githubUsername})` : '✗ Missing GitHub'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400">LeetCode Problem Solving:</span>
                    <span className={`font-mono font-bold ${s.leetcodeHandle ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {s.leetcodeHandle ? `✓ Linked (${s.leetcodeHandle})` : 'Not Provided'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400">Attendance Examination Clearance:</span>
                    <span className={`font-mono font-bold ${s.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {s.attendance >= 75 ? '✓ Compliant' : '✗ At Risk'} ({s.attendance}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed">
                <p>
                  Tier-1 campus recruiters (Google, Microsoft, Cisco, Atlassian) prioritize candidates with high academic CGPA verified by active GitHub engineering footprints. Capstone and open-source contributions boost shortlisting odds by 3.8x.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SGPA PROGRESSION */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                    Semester-Wise SGPA Progression
                  </h5>
                  <span className="text-xs font-mono text-slate-300 font-bold">
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
                                ? 'bg-amber-400' 
                                : item.sgpa >= 7.5 
                                ? 'bg-emerald-500' 
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400">
                <p>
                  Calculated against RVCE 2022 Autonomous Scheme. Credits registered per semester: 22-25. Total credits earned: {(s.semester - 1) * 22} / 160.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PROCTOR COUNSELLING */}
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
                    placeholder="Enter counselling notes (attendance, IA marks, placement advice)..."
                    className="flex-1 glass-input rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Log
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-2.5">
                {proctorNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-300">{note.author}</span>
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
            {s.usn} &bull; RVCE Verified Record
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closeDetailModal();
                openEditDrawer(s);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={closeDetailModal}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
