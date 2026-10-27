import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Calculator, 
  UserX, 
  ArrowRight, 
  Copy, 
  Check, 
  Mail, 
  FileText,
  Search,
  Sparkles,
  Percent,
  Sliders,
  HelpCircle,
  TrendingUp,
  Stethoscope,
  XCircle,
  Activity
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import AnimatedCounter from './AnimatedCounter';

export default function AttendanceRiskRadar() {
  const { students, openDetailModal, showToast } = useStudentContext();

  // Custom Simulation Engine State
  const [calcAttended, setCalcAttended] = useState(38);
  const [calcTotal, setCalcTotal] = useState(55);
  const [futureHeld, setFutureHeld] = useState(15);
  const [futureAttend, setFutureAttend] = useState(12);
  const [copiedId, setCopiedId] = useState(null);
  const [radarFilter, setRadarFilter] = useState('all-risk'); // 'all-risk', 'nsar', 'condonation', 'warning'
  const [searchTerm, setSearchTerm] = useState('');

  const STANDARD_COURSE_HOURS = 60;

  // Real-time Math Formulas
  const currentCalcPercent = calcTotal > 0 ? (calcAttended / calcTotal) * 100 : 0;
  const projectedTotal = calcTotal + futureHeld;
  const projectedAttended = calcAttended + futureAttend;
  const projectedPercent = projectedTotal > 0 ? (projectedAttended / projectedTotal) * 100 : 0;

  // Consecutive classes needed to reach target %
  const calculateClassesNeeded = (attended, total, target) => {
    if (total <= 0) return 0;
    const current = (attended / total) * 100;
    if (current >= target) return 0;
    // (attended + X) / (total + X) = target / 100
    // 100 * attended + 100 * X = target * total + target * X
    // X = (target * total - 100 * attended) / (100 - target)
    const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
    return Math.max(0, needed);
  };

  // Safe missable classes before dropping below target %
  const calculateBunkBuffer = (attended, total, target) => {
    if (total <= 0) return 0;
    const current = (attended / total) * 100;
    if (current < target) return 0;
    // attended / (total + Y) = target / 100 => Y = (100 * attended / target) - total
    const safeBunk = Math.floor((100 * attended) / target - total);
    return Math.max(0, safeBunk);
  };

  const neededFor75 = calculateClassesNeeded(calcAttended, calcTotal, 75);
  const neededFor85 = calculateClassesNeeded(calcAttended, calcTotal, 85);
  const buffer75 = calculateBunkBuffer(calcAttended, calcTotal, 75);
  const buffer85 = calculateBunkBuffer(calcAttended, calcTotal, 85);

  // Status classifier conforming to RVCE Autonomous Regulations
  const getRVCEStatus = (attendance) => {
    if (attendance >= 85) {
      return {
        label: 'Eligible for SEE (Distinction)',
        tier: 'safe',
        badgeClass: 'badge-safe text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        icon: CheckCircle2,
        description: 'Unconditional eligibility for Semester End Examination.'
      };
    }
    if (attendance >= 75) {
      return {
        label: 'Eligible for SEE',
        tier: 'compliant',
        badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        icon: CheckCircle2,
        description: 'Compliant with VTU mandatory 75% attendance criterion.'
      };
    }
    if (attendance >= 65) {
      return {
        label: 'Medical Condonation Required',
        tier: 'condonation',
        badgeClass: 'badge-warning text-amber-300 bg-amber-500/15 border-amber-500/30 shadow-glow-amber',
        icon: Stethoscope,
        description: 'Barred unless Dean approves formal Medical Condonation petition.'
      };
    }
    return {
      label: 'Detained (NSAR)',
      tier: 'nsar',
      badgeClass: 'badge-critical text-rose-300 bg-rose-500/20 border-rose-500/40 shadow-glow-rose',
      icon: XCircle,
      description: 'Not Satisfied Attendance Requirement. Strictly detained from SEE.'
    };
  };

  const currentSimStatus = getRVCEStatus(currentCalcPercent);
  const projectedSimStatus = getRVCEStatus(projectedPercent);

  // Load a student into the simulator
  const loadStudentIntoSimulator = (student) => {
    const estTotal = STANDARD_COURSE_HOURS;
    const estAttended = Math.round((student.attendance / 100) * estTotal);
    setCalcAttended(estAttended);
    setCalcTotal(estTotal);
    setFutureHeld(10);
    setFutureAttend(10);
    showToast(`Loaded ${student.name}'s attendance profile into simulator`, 'info');
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (radarFilter === 'nsar') return s.attendance < 65;
    if (radarFilter === 'condonation') return s.attendance >= 65 && s.attendance < 75;
    if (radarFilter === 'warning') return s.attendance >= 75 && s.attendance < 85;
    return s.attendance < 85; // 'all-risk'
  });

  const nsarCount = students.filter((s) => s.attendance < 65).length;
  const condonationCount = students.filter((s) => s.attendance >= 65 && s.attendance < 75).length;
  const warningCount = students.filter((s) => s.attendance >= 75 && s.attendance < 85).length;

  const generateProctorAdvisory = (student) => {
    const status = getRVCEStatus(student.attendance);
    const attendedEst = Math.round((student.attendance / 100) * STANDARD_COURSE_HOURS);
    const needed = calculateClassesNeeded(attendedEst, STANDARD_COURSE_HOURS, 75);
    
    const text = `[RVCE ACADEMIC PROCTORING NOTICE]
To: ${student.name} (${student.usn})
Department: ${student.branch} (Sem ${student.semester}, Sec ${student.section || 'A'})
Faculty Mentor: ${student.mentor || 'Dr. Assigned Proctor'}
Attendance Standing: ${student.attendance}% [${status.label}]

REGULATION ASSESSMENT:
- RVCE Minimum Mandatory Threshold: 75%
- Status Assessment: ${status.description}
${student.attendance < 75 ? `- Required Recovery: Must attend minimum ${needed} consecutive classes without missing to attain 75% eligibility.` : ''}

ACTION REQUIRED: Please meet your assigned Faculty Proctor during advisory hours immediately.`;

    navigator.clipboard.writeText(text);
    setCopiedId(student._id);
    showToast(`Advisory notice copied for ${student.name}`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Simulation Header & Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module A: Interactive Simulation Card */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-indigo-500/25 bg-gradient-to-br from-slate-900/95 via-indigo-950/20 to-slate-950 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight">
                    RVCE CIE & Attendance Risk Engine
                  </h3>
                  <p className="text-xs text-slate-400">VTU Autonomous Simulation & Forecasting</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                Autonomous v2.4
              </span>
            </div>

            {/* Current Inputs */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Classes Attended So Far
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={calcTotal}
                    value={calcAttended}
                    onChange={(e) => setCalcAttended(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Classes Held So Far
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={calcTotal}
                    onChange={(e) => setCalcTotal(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Current Ratio</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-2xl font-black text-white">
                      {currentCalcPercent.toFixed(1)}%
                    </span>
                    <span className="text-slate-500 text-xs">
                      ({calcAttended}/{calcTotal} classes)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentSimStatus.badgeClass}`}>
                    <currentSimStatus.icon className="w-3.5 h-3.5" />
                    <span>{currentSimStatus.label}</span>
                  </span>
                </div>
              </div>

              {/* Exact Classes Recovery Calculations */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Target: 75% SEE Cutoff</span>
                    <span className="text-blue-400 font-mono">Min Mandatory</span>
                  </div>
                  {currentCalcPercent < 75 ? (
                    <p className="text-rose-400 text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      Attend <strong>+{neededFor75}</strong> straight classes
                    </p>
                  ) : (
                    <p className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      Safe buffer: <strong>{buffer75}</strong> bunks
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Target: 85% Distinction</span>
                    <span className="text-amber-400 font-mono">Dean's Honor</span>
                  </div>
                  {currentCalcPercent < 85 ? (
                    <p className="text-amber-300 text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                      Attend <strong>+{neededFor85}</strong> straight classes
                    </p>
                  ) : (
                    <p className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      Safe buffer: <strong>{buffer85}</strong> bunks
                    </p>
                  )}
                </div>
              </div>

              {/* Interactive Semester Forecast Slider */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-300 text-xs flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> What-If Semester Forecaster
                  </span>
                  <span className="text-[10px] text-slate-400">Hypothetical Simulation</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">Upcoming Classes Held:</span>
                    <span className="font-mono font-bold text-white">{futureHeld} classes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={futureHeld}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setFutureHeld(v);
                      if (futureAttend > v) setFutureAttend(v);
                    }}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">Classes You Will Attend:</span>
                    <span className="font-mono font-bold text-emerald-400">{futureAttend} classes</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={futureHeld}
                    value={futureAttend}
                    onChange={(e) => setFutureAttend(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Forecasted Outcome:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-white text-sm">
                      {projectedPercent.toFixed(1)}%
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${projectedSimStatus.badgeClass}`}>
                      {projectedSimStatus.label}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>RVCE Autonomous Academic Hand-book &sect; 4.2</span>
            <span className="text-indigo-400 font-semibold">Active Engine</span>
          </div>
        </div>

        {/* Regulatory Breakdown & Cohort Status */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight">
                    RVCE CIE & SEE Regulatory Policy Framework
                  </h3>
                  <p className="text-xs text-slate-400">Autonomous Degree Regulations & Detention Policy</p>
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setRadarFilter('all-risk')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    radarFilter === 'all-risk' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Alerts ({students.filter((s) => s.attendance < 85).length})
                </button>
                <button
                  type="button"
                  onClick={() => setRadarFilter('nsar')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    radarFilter === 'nsar' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  Detained NSAR ({nsarCount})
                </button>
                <button
                  type="button"
                  onClick={() => setRadarFilter('condonation')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    radarFilter === 'condonation' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  Condonation ({condonationCount})
                </button>
                <button
                  type="button"
                  onClick={() => setRadarFilter('warning')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    radarFilter === 'warning' ? 'bg-yellow-600 text-white shadow-sm' : 'text-slate-400 hover:text-yellow-300'
                  }`}
                >
                  Warning ({warningCount})
                </button>
              </div>
            </div>

            {/* 3 Autonomous Regulation Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              
              {/* NSAR Tier */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> &lt; 65% NSAR
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30">
                    Detained
                  </span>
                </div>
                <div className="text-2xl font-black text-rose-700 dark:text-rose-400">
                  <AnimatedCounter value={nsarCount} />
                  <span className="text-xs text-rose-600 dark:text-rose-300/70 font-normal ml-1">students</span>
                </div>
                <p className="text-[11px] text-rose-950 dark:text-rose-200/90 font-medium mt-2 leading-relaxed">
                  Strictly barred from SEE. Cannot be condoned even with medical grounds. Must repeat course.
                </p>
              </div>

              {/* Medical Condonation Tier */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> 65% - 74.9%
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                    Conditional
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-400">
                  <AnimatedCounter value={condonationCount} />
                  <span className="text-xs text-amber-700 dark:text-amber-300/70 font-normal ml-1">students</span>
                </div>
                <p className="text-[11px] text-amber-950 dark:text-amber-200/90 font-medium mt-2 leading-relaxed">
                  Eligible only upon Dean & Principal approval of formal medical certificates and proctor appeal.
                </p>
              </div>

              {/* SEE Compliant Tier */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> &ge; 75% SEE
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                    Eligible
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  <AnimatedCounter value={students.filter((s) => s.attendance >= 75).length} />
                  <span className="text-xs text-emerald-700 dark:text-emerald-300/70 font-normal ml-1">students</span>
                </div>
                <p className="text-[11px] text-emerald-950 dark:text-emerald-200/90 font-medium mt-2 leading-relaxed">
                  Fully eligible for Semester End Examination hall tickets and grade card generation.
                </p>
              </div>

            </div>

            {/* Quick Search */}
            <div className="relative mb-2">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search at-risk students by name, USN, or department..."
                className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-slate-200 placeholder:text-slate-500"
              />
            </div>

          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredStudents.length} student profile{filteredStudents.length === 1 ? '' : 's'} matching active filter</span>
            <span className="text-emerald-400 font-semibold">Proctor Action Roster</span>
          </div>
        </div>

      </div>

      {/* Flagged Students Intervention Roster Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
          <div>
            <h4 className="font-extrabold text-white text-base">Students Requiring Immediate Academic Intervention</h4>
            <p className="text-xs text-slate-400 mt-0.5">Automated deficit calculation based on 60-contact-hour semester standard</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold self-start sm:self-auto">
            {filteredStudents.length} Active Alerts
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h5 className="font-bold text-white text-base">No Students in Selected Risk Category</h5>
            <p className="text-xs text-slate-400 mt-1">
              All students currently meet the selected attendance & academic threshold.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-4">Student & USN</th>
                  <th className="py-3.5 px-3">Dept & Sem</th>
                  <th className="py-3.5 px-3">Attendance</th>
                  <th className="py-3.5 px-3">RVCE Exam Status</th>
                  <th className="py-3.5 px-3">Deficit / Buffer</th>
                  <th className="py-3.5 px-3">CGPA</th>
                  <th className="py-3.5 px-3">Faculty Mentor</th>
                  <th className="py-3.5 px-4 text-right">Intervention & Simulator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((s) => {
                  const attendedEst = Math.round((s.attendance / 100) * STANDARD_COURSE_HOURS);
                  const deficitNeeded = calculateClassesNeeded(attendedEst, STANDARD_COURSE_HOURS, 75);
                  const safeBuffer = calculateBunkBuffer(attendedEst, STANDARD_COURSE_HOURS, 75);
                  const status = getRVCEStatus(s.attendance);

                  return (
                    <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                            alt={s.name}
                            className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10"
                          />
                          <div>
                            <span 
                              onClick={() => openDetailModal(s)}
                              className="font-bold text-white hover:text-blue-400 cursor-pointer block text-sm"
                            >
                              {s.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">{s.usn}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-200">{s.branch}</span>
                        <span className="text-slate-400 block text-[11px]">Sem {s.semester} (Sec {s.section || 'A'})</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${status.badgeClass}`}>
                            {s.attendance}%
                          </span>
                        </div>
                        {/* Progress Bar with 75% line indicator */}
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden relative">
                          <div
                            className={`h-full rounded-full ${
                              s.attendance < 65 ? 'bg-rose-500' : s.attendance < 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${s.attendance}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Flag Badge */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${status.badgeClass}`}>
                          <status.icon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        {s.attendance < 75 ? (
                          <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                            Attend <strong>+{deficitNeeded}</strong> classes
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                            Buffer: <strong>{safeBuffer}</strong> missable
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`font-mono font-bold ${s.cgpa < 7.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {s.cgpa?.toFixed(2)}
                        </span>
                        {s.cgpa < 7.0 && (
                          <span className="block text-[10px] text-rose-400/80">Below 7.0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-slate-300">
                        <span className="font-medium">{s.mentor || 'Proctor Office'}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Load into Simulator */}
                          <button
                            type="button"
                            onClick={() => loadStudentIntoSimulator(s)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 flex items-center gap-1 text-[11px] font-medium transition-colors"
                            title="Load into Simulation Engine"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Simulate</span>
                          </button>

                          {/* Copy Notice */}
                          <button
                            type="button"
                            onClick={() => generateProctorAdvisory(s)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors font-medium text-[11px]"
                            title="Copy official VTU advisory notice"
                          >
                            {copiedId === s._id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy Notice</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openDetailModal(s)}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition-colors"
                            title="Inspect complete student profile"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
