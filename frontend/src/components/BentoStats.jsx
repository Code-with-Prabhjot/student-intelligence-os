import React from 'react';
import { 
  Users, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Layers, 
  BarChart3,
  Flame,
  Briefcase,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import AnimatedCounter from './AnimatedCounter';

export default function BentoStats() {
  const { analytics, statsLoading, setFilter, filters, openDetailModal } = useStudentContext();

  const summary = analytics?.summary || {
    totalStudents: 0,
    avgCgpa: 0,
    avgAttendance: 0,
    highestCgpa: 0,
    criticalRiskStudents: 0,
    warningStudents: 0,
    safeStudents: 0,
    riskRate: 0,
    topBranch: null,
  };

  const branchStats = analytics?.branchDistribution || [];
  const performanceTiers = analytics?.performanceTiers || [];
  const topSkills = analytics?.topSkills || [];
  const topPerformers = analytics?.topPerformers || [];

  return (
    <div className="space-y-6 mb-8">
      
      {/* 4 Primary Executive Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Bento 1: Total Enrolled */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/[0.08]">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
                <Users className="w-4 h-4" />
              </span>
              Enrolled Cohort
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/25 font-bold">
              Active Registry
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-black text-white tracking-tight">
              {statsLoading ? '...' : <AnimatedCounter value={summary.totalStudents} />}
            </h3>
            <span className="text-xs text-slate-400 font-medium">RVCE Engineers</span>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Top Department:</span>
              <span className="font-bold text-blue-300">
                {summary.topBranch?.branch || 'CSE'} ({summary.topBranch?.count || 0})
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${Math.min(100, (summary.topBranch?.count || 1) * 15)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bento 2: Academic Index (CGPA) */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/[0.08]">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                <Award className="w-4 h-4" />
              </span>
              Academic Index
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 font-bold">
              Avg CGPA
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-black text-white tracking-tight">
              {statsLoading ? '...' : <AnimatedCounter value={summary.avgCgpa} decimals={2} />}
            </h3>
            <span className="text-xs text-slate-400 font-medium">/ 10.0 scale</span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Highest Scholar:</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {summary.highestCgpa?.toFixed(2) || '10.00'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${((summary.avgCgpa || 0) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bento 3: Risk Radar */}
        <div 
          onClick={() => setFilter('attendanceRisk', filters.attendanceRisk === 'true' ? '' : 'true')}
          className={`glass-card rounded-3xl p-6 relative overflow-hidden cursor-pointer group transition-all border ${
            filters.attendanceRisk === 'true' 
              ? 'ring-2 ring-rose-500/50 bg-rose-500/10 border-rose-500/40 shadow-glow-rose' 
              : 'border-white/[0.08] hover:border-rose-500/30'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-4 h-4" />
              </span>
              Risk Radar
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
              &lt; 75% Cutoff
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-black text-rose-400 tracking-tight">
              {statsLoading ? '...' : <AnimatedCounter value={summary.criticalRiskStudents} />}
            </h3>
            <span className="text-xs text-rose-300/80 font-medium">
              ({summary.riskRate}% cohort)
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Filter Status:</span>
              <span className="font-bold text-rose-300">
                {filters.attendanceRisk === 'true' ? 'Active [Click to Reset]' : 'Click to Filter At-Risk'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${Math.min(100, (summary.riskRate || 0) * 2)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bento 4: Cohort Attendance Health */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/[0.08]">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              Cohort Attendance
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-bold">
              Institutional
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-4xl font-black text-emerald-400 tracking-tight">
              {statsLoading ? '...' : <AnimatedCounter value={summary.avgAttendance} decimals={1} suffix="%" />}
            </h3>
            <span className="text-xs text-slate-400 font-medium">Average Presence</span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Safe Zone (&ge;85%):</span>
              <span className="font-bold text-emerald-300">
                {summary.safeStudents} students
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, summary.avgAttendance || 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Expanded Bento Matrix: Department Performance & Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Department Performance Matrix (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Department Performance Matrix
                  </h4>
                  <p className="text-xs text-slate-400">Real-time CGPA and Attendance by Engineering Branch</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {branchStats.length} Depts Recorded
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {branchStats.slice(0, 6).map((branch) => (
                <div
                  key={branch.branch}
                  onClick={() => setFilter('branch', filters.branch === branch.branch ? 'ALL' : branch.branch)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    filters.branch === branch.branch
                      ? 'bg-blue-600/25 border-blue-500 text-white shadow-glow-blue'
                      : 'bg-slate-900/50 border-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-xs font-mono tracking-wider">{branch.branch}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-medium">
                      {branch.count} std
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Avg CGPA:</span>
                    <span className="font-bold text-blue-300">{branch.avgCgpa}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs mt-1">
                    <span className="text-slate-400 text-[11px]">Attendance:</span>
                    <span className={`font-semibold text-[11px] ${branch.avgAttendance >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {branch.avgAttendance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Click any department card to filter active student registry</span>
            <span className="text-blue-400 font-semibold">Interactive Filter</span>
          </div>
        </div>

        {/* High-Impact Tech Stacks & Distinction Leaders (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    High-Impact Tech Stacks
                  </h4>
                  <p className="text-xs text-slate-400">Skill telemetry across student portfolios</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {topSkills.map((item) => (
                <span
                  key={item.skill}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors cursor-default shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></span>
                  {item.skill}
                  <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-white/10 text-slate-400 font-mono font-bold">
                    {item.count}
                  </span>
                </span>
              ))}
              {topSkills.length === 0 && (
                <p className="text-xs text-slate-500 italic">No skills recorded yet.</p>
              )}
            </div>

            {/* Distinction Talent Mini-List */}
            {topPerformers.length > 0 && (
              <div className="pt-3 border-t border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Dean's List Scholars (Top CGPA)
                </span>
                <div className="space-y-1.5">
                  {topPerformers.slice(0, 3).map((student) => (
                    <div
                      key={student.usn}
                      onClick={() => openDetailModal(student)}
                      className="p-2 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                          alt={student.name}
                          className="w-7 h-7 rounded-lg bg-slate-800"
                        />
                        <div>
                          <span className="font-bold text-xs text-white block">{student.name}</span>
                          <span className="text-[10px] text-slate-400">{student.usn} &bull; {student.branch}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-amber-400">
                        {student.cgpa.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-400 flex justify-between">
            <span>RVCE Talent Repository</span>
            <span className="text-amber-400 font-semibold">Verified Registry</span>
          </div>
        </div>

      </div>

    </div>
  );
}
