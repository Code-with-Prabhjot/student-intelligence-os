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
  Briefcase,
  Copy,
  Check,
  Bot,
  Calculator,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import VtuEstimator from './VtuEstimator';

export default function StudentDetailModal() {
  const { isDetailModalOpen, detailStudent, closeDetailModal, openEditDrawer, showToast } = useStudentContext();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'proctor' | 'estimator' | 'placement' | 'academics'
  const [newNote, setNewNote] = useState('');
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [proctorNotes, setProctorNotes] = useState(() => {
    return [
      {
        id: 1,
        date: '2024-02-10',
        author: 'Dr. Faculty Proctor',
        text: 'Comprehensive mid-semester review executed. Evaluated CIE internals, GitHub repository telemetry, and VTU attendance compliance.'
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
      author: s.mentor || 'Faculty Proctor',
      text: newNote.trim()
    };

    setProctorNotes((prev) => [note, ...prev]);
    setNewNote('');
    showToast('Proctor note recorded successfully', 'success');
  };

  // Autonomous Proctor Advisory Heuristics Engine
  const proctorAdvisories = (() => {
    const advisories = [];
    const hasGithub = Boolean(s.githubUsername && s.githubUsername.trim());
    const isHighCgpa = s.cgpa >= 8.5;
    const isDetentionRisk = s.attendance < 75;
    const isWarningAttendance = s.attendance >= 75 && s.attendance < 85;

    // Heuristic 1: High CGPA + Missing GitHub (Mandated Novelty)
    if (isHighCgpa && !hasGithub) {
      advisories.push({
        type: 'critical',
        badge: 'Critical Advisory • Tier-1 Recruiter Telemetry Deficit',
        color: 'rose',
        title: 'Tier-1 Super Dream Eligibility Without Public Telemetry',
        text: 'Critical Advisory: Student holds eligible academic standing for Tier-1 Super Dream companies (20+ LPA) but lacks public repository telemetry. Immediate action required: proctor assignment to initialize GitHub portfolio.',
        directive: 'Immediate proctor assignment required to initialize GitHub portfolio. Direct student to publish at least two documented capstone repositories prior to the 6th semester recruitment cycle.'
      });
    }

    // Heuristic 2: Attendance < 75% (Mandated Novelty)
    if (isDetentionRisk) {
      advisories.push({
        type: 'detention',
        badge: 'Detention Alert (NSAR) • VTU Regulation 18OB',
        color: 'rose',
        title: 'Statutory Course Detention Alert',
        text: 'Detention Alert (NSAR): Current attendance requires proctor medical condonation filing or mandatory attendance in upcoming remedial laboratory modules.',
        directive: 'Initiate formal notice to student and registered guardian. File medical condonation dossier with Dean (Academics) if qualifying under clause 18OB4.1, or register for mandatory remedial laboratory makeup modules.'
      });
    }

    // Heuristic 3: Warning Attendance 75% - 85%
    if (isWarningAttendance) {
      advisories.push({
        type: 'warning',
        badge: 'Attendance Caution • Condonation Margin Alert',
        color: 'amber',
        title: 'Narrow Attendance Clearance Buffer',
        text: `Attendance Caution: Student attendance stands at ${s.attendance}%. With only ${classesMissable75} allowable absence(s) remaining, student is near the 75% statutory bar.`,
        directive: 'Proctor counselling recommended to restrict unexcused leaves and maintain consistent attendance in remaining syllabus blocks.'
      });
    }

    // Heuristic 4: Dean\'s Honors Scholar (CGPA >= 9.0 + Active GitHub)
    if (s.cgpa >= 9.0 && hasGithub) {
      advisories.push({
        type: 'excellence',
        badge: 'Dean\'s Honors Scholar • Fast-Track Placement Ready',
        color: 'emerald',
        title: 'Tier-1 Super Dream Research & Placement Candidate',
        text: `Distinction Commendation: Cumulative CGPA of ${s.cgpa.toFixed(2)} coupled with active public GitHub repository telemetry (@${s.githubUsername}). Fully qualified for Super Dream recruitments (20+ LPA).`,
        directive: 'Nominate for RVCE Academic Fellowship, fast-track corporate interview slots, and departmental research grant opportunities.'
      });
    }

    // Heuristic 5: Low CGPA Remedial (< 7.0)
    if (s.cgpa < 7.0) {
      advisories.push({
        type: 'academic',
        badge: 'Academic Support • Remedial Mentoring',
        color: 'blue',
        title: 'CIE & Semester End Remedial Support Recommended',
        text: `Academic Standing Notice: Student CGPA (${s.cgpa.toFixed(2)}) is below the 7.0 First Class standard benchmark.`,
        directive: 'Enroll in remedial mentoring circles and review previous internal assessment (CIE) answer scripts with subject coordinators.'
      });
    }

    return advisories;
  })();

  // Copy Official Proctor Memo to Clipboard
  const copyOfficialProctorMemo = () => {
    const today = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const vtuPercentage = ((s.cgpa - 0.75) * 10).toFixed(1);

    const advisoryText = proctorAdvisories.map((a, i) => 
      `[FINDING ${i + 1}: ${a.badge.toUpperCase()}]\n${a.text}\n• ACTION DIRECTIVE: ${a.directive}`
    ).join('\n\n');

    const memoText = `================================================================================
OFFICIAL PROCTOR ADVISORY MEMORANDUM - R.V. COLLEGE OF ENGINEERING (RVCE)
Autonomous Institution Affiliated to VTU | Mysuru Road, Bengaluru - 560059
Office of Academic Mentorship & Autonomous Student Lifecycle Governance
Date of Issue: ${today}
--------------------------------------------------------------------------------
1. STUDENT IDENTITY & ENROLLMENT TELEMETRY:
   • Full Name:           ${s.name}
   • USN:                 ${s.usn}
   • Engineering Dept:    ${s.branch} Engineering
   • Current Term:        Semester ${s.semester} (Section ${s.section || 'A'})
   • Official Email:      ${s.email}
   • Contact Telephone:   ${s.phone || '+91 98450 11021'}
   • Assigned Faculty:    ${s.mentor || 'Dr. Department Mentor'}

2. ACADEMIC & STATUTORY EXAMINATION TELEMETRY:
   • Cumulative CGPA:     ${s.cgpa?.toFixed(2)} / 10.00 (Autonomous RVCE 2022 Scheme)
   • VTU Percentage Eq:   ${vtuPercentage}% (Formula: [CGPA - 0.75] * 10)
   • Contact Hours Att:   ${s.attendance}% (${attendedClasses} / ${STANDARD_CLASSES} contact hours)
   • Academic Standing:   ${s.status}
   • Developer Telemetry: GitHub: ${s.githubUsername ? '@' + s.githubUsername : 'NONE LINKED'} | LeetCode: ${s.leetcodeHandle || 'None'}

3. AUTONOMOUS PROCTOR HEURISTIC EVALUATION:
${advisoryText || 'No critical deficiencies detected. Student is in satisfactory academic standing.'}

4. FORMAL ADVISORY DIRECTIVES & ACTION PLAN:
   • The student is instructed to report to Faculty Proctor ${s.mentor || 'Dr. Department Mentor'} within 3 working days.
   • Compliance status will be lodged with the Office of Dean (Academics) prior to CIE test clearance.

ISSUED BY:
Office of Academic Mentorship & Autonomous Student Proctorate
R.V. College of Engineering, Bengaluru - 560059
================================================================================`;

    navigator.clipboard.writeText(memoText);
    setCopiedMemo(true);
    showToast('Official Proctor Memo copied to clipboard!', 'success');
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  // Placement Readiness Evaluation
  const isPlacementEligible = s.cgpa >= 8.5 && Boolean(s.githubUsername && s.githubUsername.trim());
  const placementTier = s.cgpa >= 9.0 && s.githubUsername 
    ? 'Tier-1 Super Dream (20+ LPA)' 
    : s.cgpa >= 8.5 
    ? 'Tier-1 Dream Company (10-20 LPA)' 
    : s.cgpa >= 7.5 
    ? 'Core & IT Placement (6-10 LPA)' 
    : 'Skill Enhancement Required';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 print:p-0 print:static print:overflow-visible">
      {/* Backdrop */}
      <div 
        onClick={closeDetailModal}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity print:hidden"
      ></div>

      {/* Modal Dialog Card */}
      <div className="relative glass-card bg-white dark:bg-slate-950/95 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col print:max-w-none print:w-full print:border-none print:shadow-none print:p-8 print:max-h-none print:bg-white print:text-black">
        
        {/* Printable Official Institutional Header (Visible ONLY on Print) */}
        <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-black">
                R.V. COLLEGE OF ENGINEERING (RVCE)
              </h1>
              <p className="text-xs text-slate-700 font-semibold">
                Autonomous Institution Affiliated to VTU &bull; Approved by AICTE &bull; NAAC A+ Accredited
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Mysuru Road, RV Vidyaniketan Post, Bengaluru - 560059, Karnataka, India
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded border border-black text-xs font-bold font-mono">
                AUTONOMOUS TRANSCRIPT
              </span>
              <p className="text-[10px] text-slate-600 mt-1">Ref: RVCE/ACAD/2026/DOSSIER</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-300 text-center">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-black">
              Official Cumulative Academic Record &amp; Proctor Advisory Dossier
            </h2>
          </div>
        </div>

        {/* Modal Header (Screen Mode) */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-white/10 flex-shrink-0 print:border-b-2 print:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <img
                src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                alt={s.name}
                className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/15 shadow-sm object-cover"
              />
              {s.cgpa >= 9.0 && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-black shadow-md print:hidden" title="Distinction Scholar">
                  <Sparkles className="w-3 h-3" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white print:text-black">
                  {s.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/15 print:border-black print:text-black">
                  {s.branch}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 print:text-black tracking-wider">
                  {s.usn}
                </span>
                <span className="text-slate-400 text-xs">&bull;</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-800 font-medium">
                  Semester {s.semester} (Sec {s.section || 'A'})
                </span>
                <span className="text-slate-400 text-xs">&bull;</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-800 font-medium">
                  Proctor: {s.mentor || 'Dr. Assigned Proctor'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors shadow-xs"
              title="Print Official Institutional Academic Transcript"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Print Official Dossier</span>
            </button>
            <button
              type="button"
              onClick={closeDetailModal}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Developer Profiles Quick Launcher Ribbon */}
        {(s.githubUsername || s.leetcodeHandle || s.portfolioUrl) && (
          <div className="flex flex-wrap items-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 my-3 text-xs flex-shrink-0 print:border-slate-300">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mr-1">Telemetry Links:</span>
            {s.githubUsername && (
              <a
                href={`https://github.com/${s.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-[11px] font-mono transition-colors shadow-xs"
              >
                <Github className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>@{s.githubUsername}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            )}
            {s.leetcodeHandle && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-white/5 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-white/10 text-[11px] font-mono shadow-xs">
                <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{s.leetcodeHandle}</span>
              </span>
            )}
            {s.portfolioUrl && (
              <a
                href={s.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-white/5 hover:bg-emerald-100 dark:hover:bg-white/10 text-emerald-800 dark:text-slate-300 border border-emerald-200 dark:border-white/10 text-[11px] transition-colors shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Portfolio</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            )}
          </div>
        )}

        {/* Modal Navigation Tabs (Screen Only) */}
        <div className="flex items-center gap-1.5 pb-3 border-b border-slate-200 dark:border-white/5 flex-shrink-0 print:hidden text-xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Standing', icon: Award },
            { id: 'proctor', label: `Proctor Advisory Engine (${proctorAdvisories.length})`, icon: Bot, highlight: true },
            { id: 'estimator', label: 'VTU Estimator', icon: Calculator },
            { id: 'placement', label: 'Placement Radar', icon: Briefcase },
            { id: 'academics', label: 'SGPA History', icon: TrendingUp },
          ].map(({ id, label, icon: Icon, highlight }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : highlight
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 print:overflow-visible print:py-0">

          {/* TAB 1: OVERVIEW & EXAM STANDING */}
          {(activeTab === 'overview' || window.matchMedia?.('print')?.matches) && (
            <div className="space-y-4">
              {/* Score Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* CGPA */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 print:border-slate-300">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Cumulative CGPA
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 print:text-black">
                    {s.cgpa?.toFixed(2)}
                    <span className="text-xs text-slate-400 font-normal ml-1">/ 10</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1 block">
                    {s.cgpa >= 9.0 ? '★ Distinction Rank' : s.cgpa >= 7.5 ? 'First Class' : 'Second Class'}
                    <span className="text-slate-500 font-normal font-mono ml-1">
                      ({((s.cgpa - 0.75) * 10).toFixed(1)}% VTU)
                    </span>
                  </span>
                </div>

                {/* Attendance */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 print:border-slate-300">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Total Attendance
                  </span>
                  <div className={`text-2xl font-black mt-1 ${s.attendance >= 85 ? 'text-emerald-600 dark:text-emerald-400' : s.attendance >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'} print:text-black`}>
                    {s.attendance}%
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                    {attendedClasses} of {STANDARD_CLASSES} contact hours
                  </span>
                </div>

                {/* Status */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 print:border-slate-300">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Academic Standing
                  </span>
                  <div className="text-xl font-extrabold mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      s.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400'
                    } print:border-black print:text-black`}>
                      {s.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Section {s.section || 'A'} &bull; Dept of {s.branch}
                  </span>
                </div>
              </div>

              {/* VTU Condonation Regulations Card */}
              <div className={`p-4 rounded-2xl border text-xs ${
                s.attendance < 65 
                  ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-500/30 dark:text-rose-200' 
                  : s.attendance < 75
                  ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-500/30 dark:text-amber-200'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-500/30 dark:text-emerald-200'
              } print:border-black print:bg-white print:text-black`}>
                <div className="flex items-center gap-2 mb-1.5 font-bold">
                  {s.attendance < 65 ? (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span className="font-extrabold">Detained & Barred (NSAR) &bull; VTU Reg 18OB4.2</span>
                    </>
                  ) : s.attendance < 75 ? (
                    <>
                      <Stethoscope className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="font-extrabold">Condonation Required (Medical / HoD Clearance)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-extrabold">SEE Examination Eligibility Confirmed (&ge; 75%)</span>
                    </>
                  )}
                </div>

                {s.attendance < 65 ? (
                  <p className="leading-relaxed text-[11px] opacity-90">
                    Attendance is strictly below the 65% statutory threshold. As per VTU Academic Regulations, condonation is prohibited. Student must re-register for the course (NSAR).
                  </p>
                ) : s.attendance < 75 ? (
                  <p className="leading-relaxed text-[11px] opacity-90">
                    Attendance lies between 65% and 75%. Student must submit certified medical documents / HoD approval to Principal for condonation approval. Requires attending <strong>{classesNeededFor75}</strong> consecutive lectures to reach 75%.
                  </p>
                ) : (
                  <p className="leading-relaxed text-[11px] opacity-90">
                    Student meets mandatory 75% attendance. Has buffer to miss up to <strong>{classesMissable75}</strong> lectures without falling below threshold.
                  </p>
                )}
              </div>

              {/* Faculty Mentor & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2 print:border-slate-300">
                  <h5 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Student Contact
                  </h5>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{s.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{s.phone || '+91 98765 43210'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-2 print:border-slate-300">
                  <h5 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Faculty Mentorship
                  </h5>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{s.mentor || 'Dr. K. S. Geetha (HOD)'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Enrolled: 2022-2025 Autonomous Scheme &bull; RVCE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROCTOR ADVISORY ENGINE ("Proctor AI Assistant") */}
          {(activeTab === 'proctor' || window.matchMedia?.('print')?.matches) && (
            <div className="space-y-4">
              {/* Proctor AI Assistant Header with Copy Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:border-black print:bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-glow-blue flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white print:text-black flex items-center gap-2">
                      <span>RVCE Autonomous Proctor Advisory Engine</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 print:hidden">
                        Heuristic AI
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-800">
                      Automated telemetry inference for VTU attendance risk &amp; Tier-1 recruiter milestones.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyOfficialProctorMemo}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 print:hidden"
                  title="Copy formal institutional notice to clipboard"
                >
                  {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMemo ? 'Memo Copied!' : 'Copy Official Proctor Memo'}</span>
                </button>
              </div>

              {/* Heuristic Advisory Cards */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Live Heuristic Findings &amp; Official Directives
                </h5>

                {proctorAdvisories.map((advisory, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      advisory.type === 'critical' || advisory.type === 'detention'
                        ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'
                        : advisory.type === 'warning'
                        ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-500/30 text-amber-950 dark:text-amber-200'
                        : advisory.type === 'excellence'
                        ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                        : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-500/30 text-blue-950 dark:text-blue-200'
                    } print:border-black print:bg-white print:text-black`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                        {advisory.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] font-semibold leading-relaxed mb-2">
                      {advisory.text}
                    </p>

                    <div className="pt-2 border-t border-black/10 dark:border-white/10 text-xs font-medium space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                        Mandated Action Directive:
                      </span>
                      <p className="text-[12px] opacity-90">
                        {advisory.directive}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Proctor Counselling Log Timeline */}
              <div className="space-y-3 pt-2">
                <form onSubmit={handleAddNote} className="space-y-2 print:hidden">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Log Faculty Proctor Remark
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter proctoring session note (attendance commitment, internal mark review)..."
                      className="flex-1 glass-input rounded-xl px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log Memo</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h6 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Historical Counselling Records ({proctorNotes.length})
                  </h6>
                  {proctorNotes.map((note) => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs space-y-1 print:border-slate-300">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="font-bold text-slate-800 dark:text-slate-200 print:text-black">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 print:text-black text-xs leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VTU ESTIMATOR */}
          {activeTab === 'estimator' && (
            <VtuEstimator defaultCgpa={s.cgpa || 8.5} defaultSem={s.semester || 4} />
          )}

          {/* TAB 4: PLACEMENT RADAR */}
          {activeTab === 'placement' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Placement Eligibility Tier
                  </h5>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-500/30">
                    {placementTier}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">CGPA Cutoff (&ge; 8.5):</span>
                    <span className={`font-mono font-bold ${s.cgpa >= 8.5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {s.cgpa >= 8.5 ? '✓ Satisfied' : '✗ Below 8.5 Cutoff'} ({s.cgpa.toFixed(2)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Open-Source &amp; GitHub Profile:</span>
                    <span className={`font-mono font-bold ${s.githubUsername ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {s.githubUsername ? `✓ Linked (@${s.githubUsername})` : '✗ Missing GitHub'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-white/5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">LeetCode Problem Solving:</span>
                    <span className={`font-mono font-bold ${s.leetcodeHandle ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                      {s.leetcodeHandle ? `✓ Linked (${s.leetcodeHandle})` : 'Not Provided'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Attendance SEE Exam Clearance:</span>
                    <span className={`font-mono font-bold ${s.attendance >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {s.attendance >= 75 ? '✓ Compliant' : '✗ At Risk'} ({s.attendance}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-950/20 dark:border-purple-500/20 text-xs text-purple-900 dark:text-purple-200/90 leading-relaxed font-normal">
                <p>
                  Tier-1 campus recruiters (Google, Microsoft, Cisco, Atlassian) require high academic CGPA verified by active GitHub engineering footprints. Candidate telemetry indicates strong eligibility for Tier-1 Super Dream pools once public repositories are linked.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: SGPA HISTORY */}
          {(activeTab === 'academics' || window.matchMedia?.('print')?.matches) && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 print:border-slate-300">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider print:text-black">
                    Semester-Wise SGPA Progression
                  </h5>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold print:text-black">
                    Cumulative CGPA: {s.cgpa?.toFixed(2)} ({((s.cgpa - 0.75) * 10).toFixed(1)}% VTU)
                  </span>
                </div>

                {/* Progression Bar History */}
                <div className="space-y-2.5">
                  {semHistory.map((item) => {
                    const percentage = (item.sgpa / 10) * 100;
                    return (
                      <div key={item.semester} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700 dark:text-slate-300 print:text-black">Semester {item.semester}</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white print:text-black">{item.sgpa.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden print:border print:border-slate-400">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.sgpa >= 9.0 
                                ? 'bg-amber-500 dark:bg-amber-400' 
                                : item.sgpa >= 7.5 
                                ? 'bg-blue-600 dark:bg-blue-500' 
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

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 print:border-slate-300 print:text-black">
                <p>
                  Calculated under RVCE 2022 Autonomous Scheme. Prescribed graduation credit benchmark: 160 credits.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Printable Institutional Signature Block (Visible ONLY on Print) */}
        <div className="hidden print:block pt-8 mt-6 border-t-2 border-black">
          <div className="grid grid-cols-4 gap-4 text-center text-xs">
            <div className="pt-8 border-t border-black">
              <span className="font-bold">Student Signature</span>
              <p className="text-[10px] text-slate-600">({s.name})</p>
            </div>
            <div className="pt-8 border-t border-black">
              <span className="font-bold">Faculty Proctor</span>
              <p className="text-[10px] text-slate-600">({s.mentor || 'Mentor'})</p>
            </div>
            <div className="pt-8 border-t border-black">
              <span className="font-bold">Head of Department</span>
              <p className="text-[10px] text-slate-600">Dept of {s.branch}</p>
            </div>
            <div className="pt-8 border-t border-black">
              <span className="font-bold">Dean (Academics)</span>
              <p className="text-[10px] text-slate-600">RVCE Autonomous Seal</p>
            </div>
          </div>
        </div>

        {/* Footer Actions (Screen Only) */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between flex-shrink-0 print:hidden">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {s.usn} &bull; RVCE Verified Autonomous Record
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closeDetailModal();
                openEditDrawer(s);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={closeDetailModal}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
