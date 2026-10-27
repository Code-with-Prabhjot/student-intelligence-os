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
  Flame
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function BentoStats() {
  const { analytics, statsLoading, setFilter, filters } = useStudentContext();

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Bento 1: Total Enrolled & Performance Overview */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" /> Total Enrolled
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
            Active Roster
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            {statsLoading ? '...' : summary.totalStudents}
          </h3>
          <span className="text-xs text-slate-400">RVCE Engineers</span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Top Dept:</span>
          <span className="font-semibold text-blue-300">
            {summary.topBranch?.branch || 'CSE'} ({summary.topBranch?.count || 0})
          </span>
        </div>
      </div>

      {/* Bento 2: Institutional CGPA Index */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" /> Academic Index
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            Avg CGPA
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            {statsLoading ? '...' : summary.avgCgpa.toFixed(2)}
          </h3>
          <span className="text-xs text-slate-400">/ 10.0 scale</span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Highest CGPA:</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {summary.highestCgpa?.toFixed(2) || '10.0'}
          </span>
        </div>
      </div>

      {/* Bento 3: Attendance Risk Intelligence */}
      <div 
        onClick={() => setFilter('attendanceRisk', filters.attendanceRisk === 'true' ? '' : 'true')}
        className={`glass-card rounded-2xl p-5 relative overflow-hidden cursor-pointer group transition-all ${
          filters.attendanceRisk === 'true' ? 'ring-2 ring-rose-500/50 bg-rose-500/5' : ''
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Risk Radar
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
            &lt;75% Cutoff
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-extrabold text-rose-400 tracking-tight">
            {statsLoading ? '...' : summary.criticalRiskStudents}
          </h3>
          <span className="text-xs text-slate-400">
            ({summary.riskRate}% cohort)
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Click to filter:</span>
          <span className="font-semibold text-rose-300">
            {filters.attendanceRisk === 'true' ? 'Active Filter [Clear]' : 'Show At-Risk'}
          </span>
        </div>
      </div>

      {/* Bento 4: Cohort Attendance Health */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cohort Attendance
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
            Institutional
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
            {statsLoading ? '...' : `${summary.avgAttendance}%`}
          </h3>
          <span className="text-xs text-slate-400">Average Presence</span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Safe Zone (&ge;85%):</span>
          <span className="font-semibold text-emerald-300">
            {summary.safeStudents} students
          </span>
        </div>
      </div>

      {/* Bento Span 2: Department Performance Matrix */}
      <div className="md:col-span-2 glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Department Performance Matrix
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Avg CGPA by Engineering Branch
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {branchStats.slice(0, 6).map((branch) => (
            <div
              key={branch.branch}
              onClick={() => setFilter('branch', filters.branch === branch.branch ? 'ALL' : branch.branch)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                filters.branch === branch.branch
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-glow-blue'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/20 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs font-mono">{branch.branch}</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded bg-white/5 text-slate-300">
                  {branch.count} std
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Avg CGPA:</span>
                <span className="font-bold text-blue-300">{branch.avgCgpa}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Span 2: Top Skills & Distinction Talent */}
      <div className="md:col-span-2 glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              High-Impact Engineering Skills
            </h4>
          </div>
          <span className="text-xs text-slate-400">Top Tech Stacks</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {topSkills.map((item, idx) => (
            <span
              key={item.skill}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors cursor-default"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></span>
              {item.skill}
              <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-white/10 text-slate-400 font-mono">
                {item.count}
              </span>
            </span>
          ))}
          {topSkills.length === 0 && (
            <p className="text-xs text-slate-500 italic">No skills recorded yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}
