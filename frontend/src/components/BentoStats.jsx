import React from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  Flame,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import CountUp from './ui/CountUp';
import SpotlightCard from './ui/SpotlightCard';

const branchGradients = {
  CSE: 'from-blue-500/20 to-blue-600/5',
  AIML: 'from-violet-500/20 to-violet-600/5',
  ISE: 'from-cyan-500/20 to-cyan-600/5',
  ECE: 'from-emerald-500/20 to-emerald-600/5',
  EEE: 'from-amber-500/20 to-amber-600/5',
  MECH: 'from-orange-500/20 to-orange-600/5',
};

const branchTextColors = {
  CSE: 'text-blue-300',
  AIML: 'text-violet-300',
  ISE: 'text-cyan-300',
  ECE: 'text-emerald-300',
  EEE: 'text-amber-300',
  MECH: 'text-orange-300',
};

export default function BentoStats() {
  const { analytics, statsLoading, setFilter, filters } = useStudentContext();

  const summary = analytics?.summary || {
    totalStudents: 0, avgCgpa: 0, avgAttendance: 0,
    highestCgpa: 0, criticalRiskStudents: 0, warningStudents: 0,
    safeStudents: 0, riskRate: 0, topBranch: null,
  };

  const branchStats = analytics?.branchDistribution || [];
  const topSkills = analytics?.topSkills || [];

  return (
    <div className="space-y-4 animate-slide-up-fade">

      {/* ── Top 4 KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* KPI 1: Total Students */}
        <SpotlightCard className="glass-card rounded-2xl relative overflow-hidden group" spotlightColor="rgba(59,130,246,0.15)">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Enrolled</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {statsLoading ? '—' : <CountUp to={summary.totalStudents} duration={1.2} />}
              </span>
              <span className="text-xs text-slate-400">students</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Top Dept</span>
              <span className="font-semibold text-blue-300">{summary.topBranch?.branch || '—'} ({summary.topBranch?.count || 0})</span>
            </div>
          </div>
        </SpotlightCard>

        {/* KPI 2: Avg CGPA */}
        <SpotlightCard className="glass-card rounded-2xl relative overflow-hidden group" spotlightColor="rgba(139,92,246,0.15)">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <Award className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg CGPA</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-300">
                {statsLoading ? '—' : <CountUp to={summary.avgCgpa} decimals={2} duration={1.3} />}
              </span>
              <span className="text-xs text-slate-400">/ 10</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Peak CGPA</span>
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {statsLoading ? '—' : summary.highestCgpa?.toFixed(2)}
              </span>
            </div>
          </div>
        </SpotlightCard>

        {/* KPI 3: At-Risk Students */}
        <SpotlightCard
          className={`glass-card rounded-2xl relative overflow-hidden group cursor-pointer transition-all ${filters.attendanceRisk === 'critical' ? 'ring-2 ring-rose-500/40' : ''
            }`}
          spotlightColor="rgba(244,63,94,0.15)"
          onClick={() => setFilter('attendanceRisk', filters.attendanceRisk === 'critical' ? '' : 'critical')}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">At-Risk</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-400">
                {statsLoading ? '—' : <CountUp to={summary.criticalRiskStudents} duration={1.1} />}
              </span>
              <span className="text-xs text-slate-400">({summary.riskRate}%)</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Attendance</span>
              <span className="font-semibold text-rose-300">{'<'} 75% cutoff</span>
            </div>
          </div>
        </SpotlightCard>

        {/* KPI 4: Avg Attendance */}
        <SpotlightCard className="glass-card rounded-2xl relative overflow-hidden group" spotlightColor="rgba(16,185,129,0.15)">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400">
                {statsLoading ? '—' : <CountUp to={summary.avgAttendance} suffix="%" duration={1.2} />}
              </span>
              <span className="text-xs text-slate-400">avg</span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Safe Zone (≥85%)</span>
              <span className="font-semibold text-emerald-300">{summary.safeStudents} students</span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* ── Department Performance Matrix ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Department Matrix</h4>
              <p className="text-[11px] text-slate-400">Click a branch to filter</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {branchStats.slice(0, 6).map((branch) => {
              const isActive = filters.branch === branch.branch;
              const gradClass = branchGradients[branch.branch] || 'from-slate-500/20 to-slate-600/5';
              const textClass = branchTextColors[branch.branch] || 'text-slate-300';
              const cgpaNum = parseFloat(branch.avgCgpa) || 0;

              return (
                <div
                  key={branch.branch}
                  onClick={() => setFilter('branch', isActive ? 'ALL' : branch.branch)}
                  className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden group/branch ${isActive
                      ? 'border-blue-500/50 shadow-glow-blue bg-blue-600/10'
                      : 'border-white/5 hover:border-white/15 bg-slate-900/40'
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradClass} opacity-0 group-hover/branch:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-bold text-xs font-mono ${isActive ? 'text-blue-300' : textClass}`}>
                        {branch.branch}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                        {branch.count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Avg CGPA</span>
                      <span className={`text-sm font-extrabold ${isActive ? 'text-blue-200' : textClass}`}>
                        {branch.avgCgpa}
                      </span>
                    </div>
                    {/* mini bar */}
                    <div className="mt-1.5 h-0.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(cgpaNum / 10) * 100}%`, background: isActive ? '#60a5fa' : '#475569' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Top Skills ── */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Top Engineering Skills</h4>
              <p className="text-[11px] text-slate-400">Most common tech stacks</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {topSkills.slice(0, 8).map((item, idx) => {
              const maxCount = topSkills[0]?.count || 1;
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.skill} className="flex items-center gap-3">
                  <span className="w-5 text-[10px] font-mono text-slate-500 text-right flex-shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-200 truncate">{item.skill}</span>
                      <span className="text-[10px] font-mono text-slate-400 flex-shrink-0 ml-2">{item.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `hsl(${220 + idx * 15}, 80%, 65%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {topSkills.length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-4">No skills data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
