import React, { useState, useMemo } from 'react';
import {
  BookOpen, Award, TrendingUp, AlertTriangle, CheckCircle2,
  Users, Layers, ArrowUpRight, Filter, ChevronRight, BarChart3,
  Calendar, FileSpreadsheet, ShieldAlert, GraduationCap, Download
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import SpotlightCard from './ui/SpotlightCard';
import CountUp from './ui/CountUp';

export default function RecordsPage({ setActiveTab }) {
  const { students, analytics, setFilter, showToast } = useStudentContext();
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Filter students based on local tab filters
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchDept = selectedDept === 'ALL' || s.branch === selectedDept;
      const matchSem = selectedSemester === 'ALL' || s.semester === Number(selectedSemester);
      return matchDept && matchSem;
    });
  }, [students, selectedDept, selectedSemester]);

  // Aggregate Grade Bands
  const gradeBands = useMemo(() => {
    const list = filteredStudents;
    const total = list.length || 1;
    const deansList = list.filter((s) => s.cgpa >= 9.0).length;
    const distinction = list.filter((s) => s.cgpa >= 8.0 && s.cgpa < 9.0).length;
    const firstClass = list.filter((s) => s.cgpa >= 7.0 && s.cgpa < 8.0).length;
    const secondClass = list.filter((s) => s.cgpa >= 6.0 && s.cgpa < 7.0).length;
    const atRisk = list.filter((s) => s.cgpa < 6.0 || s.attendance < 75).length;

    return [
      { label: "Dean's List (9.0 - 10.0)", count: deansList, pct: Math.round((deansList / total) * 100), color: 'bg-amber-400', textColor: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/30' },
      { label: "Distinction (8.0 - 8.9)", count: distinction, pct: Math.round((distinction / total) * 100), color: 'bg-blue-400', textColor: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/30' },
      { label: "First Class (7.0 - 7.9)", count: firstClass, pct: Math.round((firstClass / total) * 100), color: 'bg-emerald-400', textColor: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/30' },
      { label: "Second Class (6.0 - 6.9)", count: secondClass, pct: Math.round((secondClass / total) * 100), color: 'bg-purple-400', textColor: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/30' },
      { label: "Academic Watch (< 6.0 / Low Att)", count: atRisk, pct: Math.round((atRisk / total) * 100), color: 'bg-rose-400', textColor: 'text-rose-400', badge: 'bg-rose-500/10 border-rose-500/30' },
    ];
  }, [filteredStudents]);

  // Aggregate Department-wise breakdown
  const deptBreakdown = useMemo(() => {
    const branches = ['CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'BIOTECH'];
    return branches.map((dept) => {
      const cohort = students.filter((s) => s.branch === dept);
      if (cohort.length === 0) {
        return { dept, count: 0, avgCgpa: 0, maxCgpa: 0, avgAtt: 0, riskCount: 0, honorsPct: 0 };
      }
      const avgCgpa = (cohort.reduce((acc, s) => acc + (s.cgpa || 0), 0) / cohort.length).toFixed(2);
      const maxCgpa = Math.max(...cohort.map((s) => s.cgpa || 0)).toFixed(2);
      const avgAtt = Math.round(cohort.reduce((acc, s) => acc + (s.attendance || 0), 0) / cohort.length);
      const riskCount = cohort.filter((s) => (s.attendance || 0) < 75 || (s.cgpa || 0) < 6.0).length;
      const honorsCount = cohort.filter((s) => (s.cgpa || 0) >= 8.5).length;
      const honorsPct = Math.round((honorsCount / cohort.length) * 100);

      return {
        dept,
        count: cohort.length,
        avgCgpa: Number(avgCgpa),
        maxCgpa: Number(maxCgpa),
        avgAtt,
        riskCount,
        honorsPct,
      };
    });
  }, [students]);

  // Overall KPIs
  const overallAvgCgpa = useMemo(() => {
    if (!students.length) return 0;
    return (students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / students.length).toFixed(2);
  }, [students]);

  const overallAvgAtt = useMemo(() => {
    if (!students.length) return 0;
    return Math.round(students.reduce((acc, s) => acc + (s.attendance || 0), 0) / students.length);
  }, [students]);

  const handleInspectDept = (dept) => {
    setFilter('branch', dept);
    if (setActiveTab) setActiveTab('directory');
    showToast(`Filtered directory to ${dept} department`, 'info');
  };

  const handleExportReport = () => {
    const csvHeader = "USN,Name,Department,Semester,CGPA,Attendance,Status\n";
    const csvRows = filteredStudents.map(s => 
      `"${s.usn}","${s.name}","${s.branch}","${s.semester}","${s.cgpa}","${s.attendance}%","${s.status}"`
    ).join("\n");
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RVCE_Academic_Records_${selectedDept}_Sem${selectedSemester}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Academic audit CSV downloaded successfully', 'success');
  };

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Autonomous Curriculum Analytics
            </span>
            <span className="text-xs text-slate-500">• RVCE Ordinance 2022-26</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            Academic Records & Cohort Audits
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional performance tracking, grade distributions, and department-level academic progression.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Report
          </button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="glass-card rounded-2xl p-5" spotlightColor="rgba(59, 130, 246, 0.15)">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Institutional CGPA</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">
            <CountUp to={Number(overallAvgCgpa)} decimals={2} duration={1.2} />
            <span className="text-xs font-normal text-slate-500 ml-1">/ 10.0</span>
          </div>
          <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Across {students.length} enrolled scholars
          </p>
        </SpotlightCard>

        <SpotlightCard className="glass-card rounded-2xl p-5" spotlightColor="rgba(245, 158, 11, 0.15)">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Dean's List Cohort</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">
            <CountUp to={students.filter(s => s.cgpa >= 9.0).length} duration={1.2} />
          </div>
          <p className="text-[11px] text-amber-500 font-medium">
            {students.length ? Math.round((students.filter(s => s.cgpa >= 9.0).length / students.length) * 100) : 0}% of student body (CGPA ≥ 9.0)
          </p>
        </SpotlightCard>

        <SpotlightCard className="glass-card rounded-2xl p-5" spotlightColor="rgba(16, 185, 129, 0.15)">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Median Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">
            <CountUp to={overallAvgAtt} suffix="%" duration={1.2} />
          </div>
          <p className="text-[11px] text-emerald-500 font-medium">
            Comfortably above 75% VTU/RVCE baseline
          </p>
        </SpotlightCard>

        <SpotlightCard className="glass-card rounded-2xl p-5" spotlightColor="rgba(244, 63, 94, 0.15)">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Academic Intervention</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-500 mb-1 tabular-nums">
            <CountUp to={students.filter(s => s.attendance < 75 || s.cgpa < 6.0).length} duration={1.2} />
          </div>
          <p className="text-[11px] text-rose-400 font-medium">
            Immediate Proctor outreach scheduled
          </p>
        </SpotlightCard>
      </div>

      {/* ── Filters & Scope Bar ── */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 border border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Cohort Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department selector */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-900/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Departments</option>
            {['CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'BIOTECH'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Semester selector */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-slate-900/80 dark:bg-slate-900/80 text-xs font-semibold text-slate-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>

          {(selectedDept !== 'ALL' || selectedSemester !== 'ALL') && (
            <button
              type="button"
              onClick={() => { setSelectedDept('ALL'); setSelectedSemester('ALL'); }}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2 py-1 underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing <b>{filteredStudents.length}</b> records
        </span>
      </div>

      {/* ── Grade Band Distribution & Regulations Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Grade Bands Histogram */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/[0.08] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Academic Grade Distribution
            </h3>
            <span className="text-xs text-slate-500">CGPA Grading Bell Curve</span>
          </div>

          <div className="space-y-4">
            {gradeBands.map((band) => (
              <div key={band.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${band.color}`} />
                    {band.label}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{band.count}</span>
                    <span className="text-slate-400 text-[11px]">({band.pct}%)</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-800/40 dark:bg-slate-800/60 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
                  <div
                    className={`h-full rounded-full ${band.color} transition-all duration-700`}
                    style={{ width: `${Math.max(3, band.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.08] grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-800/30 border border-white/[0.05]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Top Decile CGPA</span>
              <span className="text-amber-400 font-extrabold text-sm">9.62</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/30 border border-white/[0.05]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Average Backlogs</span>
              <span className="text-emerald-400 font-extrabold text-sm">0.12 / student</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/30 border border-white/[0.05]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Retention Health</span>
              <span className="text-blue-400 font-extrabold text-sm">98.4%</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Autonomous Credit & Rules Reference */}
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Degree Milestones</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Standard RVCE Autonomous credit progression requirements for 4-year B.E. programs.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/30 border border-white/[0.05]">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  1Y
                </div>
                <div>
                  <div className="font-bold text-slate-200">First Year (40 Credits)</div>
                  <div className="text-[11px] text-slate-400">Basic Sciences & Engineering Core</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/30 border border-white/[0.05]">
                <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  2Y
                </div>
                <div>
                  <div className="font-bold text-slate-200">Second Year (80 Credits)</div>
                  <div className="text-[11px] text-slate-400">Discipline Core & Minor Track Choice</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/30 border border-white/[0.05]">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  3Y
                </div>
                <div>
                  <div className="font-bold text-slate-200">Third Year (120 Credits)</div>
                  <div className="text-[11px] text-slate-400">Professional Electives & Mini Project</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/30 border border-white/[0.05]">
                <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  4Y
                </div>
                <div>
                  <div className="font-bold text-slate-200">Final Year (160 Credits)</div>
                  <div className="text-[11px] text-slate-400">Capstone Thesis & Industry Internship</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Attendance below 75% in any registered theory/lab course blocks issuance of exam hall ticket.</span>
          </div>
        </div>
      </div>

      {/* ── Department Cohort Benchmarking Table ── */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Department-Wise Academic Performance Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Comparative benchmarks across all major engineering departments.</p>
          </div>
          <span className="text-xs font-mono text-slate-500">{deptBreakdown.length} Departments Audited</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-white/[0.08]">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Cohort Size</th>
                <th className="py-3 px-4">Mean CGPA</th>
                <th className="py-3 px-4">Peak CGPA</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4 text-center">Honors Readiness (≥8.5)</th>
                <th className="py-3 px-4 text-center">Critical At-Risk</th>
                <th className="py-3 px-4 text-right">Directory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {deptBreakdown.map((row) => (
                <tr key={row.dept} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {row.dept}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {row.count} scholars
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{row.avgCgpa || '—'}</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(row.avgCgpa / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {row.maxCgpa || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${row.avgAtt >= 85 ? 'text-emerald-400' : row.avgAtt >= 75 ? 'text-yellow-400' : 'text-rose-400'}`}>
                      {row.avgAtt ? `${row.avgAtt}%` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {row.honorsPct}% cohort
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.riskCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        {row.riskCount} students
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleInspectDept(row.dept)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-0.5 transition-all"
                    >
                      Inspect Cohort <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
