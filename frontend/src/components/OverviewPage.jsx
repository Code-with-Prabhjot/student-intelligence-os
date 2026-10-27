import React from 'react';
import {
  Users, Award, ShieldAlert, Activity,
  TrendingUp, ArrowRight, Clock, Sparkles
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import CountUp from './ui/CountUp';
import SpotlightCard from './ui/SpotlightCard';

function StatCard({ icon: Icon, label, value, sub, color, decimals = 0, suffix = '', onClick }) {
  return (
    <SpotlightCard
      className="glass-card rounded-2xl cursor-default group"
      spotlightColor={color.spotlight}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl border ${color.bg} ${color.border}`}>
            <Icon className={`w-4 h-4 ${color.icon}`} />
          </div>
          {onClick && (
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-extrabold text-white tabular-nums">
            <CountUp to={value} decimals={decimals} suffix={suffix} duration={1.2} />
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </SpotlightCard>
  );
}

export default function OverviewPage({ setActiveTab }) {
  const { analytics, statsLoading, students } = useStudentContext();
  const s = analytics?.summary || {};
  const top = analytics?.topPerformers || [];
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Welcome */}
      <div>
        <p className="text-slate-400 text-sm mb-0.5">
          {greeting} • {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h2 className="text-2xl font-extrabold text-white">
          Welcome back, <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">RVCE Admin</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">Here's your institutional snapshot for today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users} label="Total Enrolled" sub={`Top: ${s.topBranch?.branch || '—'} (${s.topBranch?.count || 0})`}
          value={statsLoading ? 0 : s.totalStudents || 0}
          color={{ bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', spotlight: 'rgba(59,130,246,0.18)' }}
          onClick={() => setActiveTab('directory')}
        />
        <StatCard
          icon={Award} label="Average CGPA" sub={`Peak: ${s.highestCgpa?.toFixed(2) || '—'}`}
          value={statsLoading ? 0 : s.avgCgpa || 0} decimals={2}
          color={{ bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'text-indigo-400', spotlight: 'rgba(99,102,241,0.18)' }}
          onClick={() => setActiveTab('analytics')}
        />
        <StatCard
          icon={ShieldAlert} label="At-Risk Students" sub="Attendance < 75%"
          value={statsLoading ? 0 : s.criticalRiskStudents || 0}
          color={{ bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'text-rose-400', spotlight: 'rgba(244,63,94,0.18)' }}
          onClick={() => setActiveTab('radar')}
        />
        <StatCard
          icon={Activity} label="Avg Attendance" sub={`${s.safeStudents || 0} students safe`}
          value={statsLoading ? 0 : s.avgAttendance || 0} suffix="%"
          color={{ bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', spotlight: 'rgba(16,185,129,0.18)' }}
        />
      </div>

      {/* Quick actions + Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'View Student Directory', tab: 'directory', color: 'text-blue-400' },
              { label: 'Check Risk Radar', tab: 'radar', color: 'text-rose-400' },
              { label: 'View Analytics', tab: 'analytics', color: 'text-indigo-400' },
              { label: 'Top Performers', tab: 'performers', color: 'text-amber-400' },
              { label: 'Export Data', tab: 'export', color: 'text-emerald-400' },
            ].map(({ label, tab, color }) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
              >
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${color} group-hover:translate-x-0.5 transition-transform`} />
              </button>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Top Performers
            </h3>
            <button
              type="button"
              onClick={() => setActiveTab('performers')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {top.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              {statsLoading ? 'Loading…' : 'No data available'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {top.slice(0, 5).map((student, idx) => (
                <div key={student._id || idx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                  <span className="w-6 text-center text-[11px] font-bold text-slate-500 font-mono">#{idx + 1}</span>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
                    {(student.name || 'ST').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{student.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{student.usn} · {student.branch}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-extrabold text-amber-400">{student.cgpa?.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-500">CGPA</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
