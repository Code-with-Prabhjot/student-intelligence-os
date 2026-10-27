import React from 'react';
import { Sparkles, Award, TrendingUp, GraduationCap } from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import SpotlightCard from './ui/SpotlightCard';
import CountUp from './ui/CountUp';

const medals = ['🥇', '🥈', '🥉'];

function cgpaColor(v) {
  if (v >= 9.5) return 'text-amber-400';
  if (v >= 9.0) return 'text-yellow-400';
  if (v >= 8.5) return 'text-emerald-400';
  return 'text-blue-400';
}

export default function TopPerformers() {
  const { analytics, statsLoading, openDetailModal, students } = useStudentContext();
  const top = analytics?.topPerformers || [];

  // Also get distinction students from loaded students
  const distinction = students.filter(s => s.cgpa >= 9.0).sort((a, b) => b.cgpa - a.cgpa);

  return (
    <div className="space-y-6 animate-slide-up-fade">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> Top Performers
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">Students with CGPA ≥ 9.0 — Dean's List candidates</p>
      </div>

      {statsLoading ? (
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm gap-2">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          Loading…
        </div>
      ) : top.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-slate-400 text-sm">
          No top performers data available.
        </div>
      ) : (
        <>
          {/* Podium top 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top.slice(0, 3).map((s, idx) => (
              <SpotlightCard
                key={s._id || idx}
                className="glass-card rounded-2xl group cursor-pointer"
                spotlightColor="rgba(251,191,36,0.15)"
                onClick={() => openDetailModal(s)}
              >
                <div className="p-5 text-center">
                  <div className="text-3xl mb-3">{medals[idx] || `#${idx + 1}`}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 text-base font-extrabold text-amber-300">
                    {(s.name || 'ST').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <p className="font-bold text-white text-sm mb-0.5 group-hover:text-blue-300 transition-colors">{s.name}</p>
                  <p className="text-[11px] font-mono text-slate-500 mb-3">{s.usn} · {s.branch}</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-2xl font-extrabold ${cgpaColor(s.cgpa)}`}>
                      {s.cgpa?.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500">/10</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Attendance: <span className="text-emerald-400 font-semibold">{s.attendance}%</span></p>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Rest of top performers */}
          {top.length > 3 && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">Honour Roll</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {top.slice(3).map((s, idx) => (
                  <div
                    key={s._id || idx}
                    onClick={() => openDetailModal(s)}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <span className="w-7 text-xs font-mono text-slate-500 text-center">#{idx + 4}</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
                      {(s.name || 'ST').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">{s.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{s.usn} · {s.branch} · Sem {s.semester}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-extrabold ${cgpaColor(s.cgpa)}`}>{s.cgpa?.toFixed(2)}</p>
                      <p className={`text-[10px] ${s.attendance >= 85 ? 'text-emerald-400' : s.attendance >= 75 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {s.attendance}% att.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
