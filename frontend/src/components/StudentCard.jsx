import React from 'react';
import {
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  Award,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Github,
  Code2,
  ExternalLink
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import SpotlightCard from './ui/SpotlightCard';
import CountUp from './ui/CountUp';

const branchStyles = {
  CSE: { badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30', accent: '#3b82f6' },
  AIML: { badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30', accent: '#8b5cf6' },
  ISE: { badge: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30', accent: '#06b6d4' },
  ECE: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30', accent: '#10b981' },
  EEE: { badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30', accent: '#f59e0b' },
  MECH: { badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30', accent: '#f97316' },
  CIVIL: { badge: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', accent: '#64748b' },
  BIOTECH: { badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30', accent: '#14b8a6' },
};

export default function StudentCard({ student, style }) {
  const { openDetailModal, openEditDrawer, openDeleteModal } = useStudentContext();

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const branch = branchStyles[student.branch] || {
    badge: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    accent: '#3b82f6'
  };

  const isSafe = student.attendance >= 85;
  const isWarning = student.attendance >= 75 && student.attendance < 85;
  const isTopPerformer = student.cgpa >= 9.0;
  const isPlacementEligible = student.cgpa >= 8.5 && Boolean(student.githubUsername && student.githubUsername.trim());

  return (
    <SpotlightCard
      className="glass-card rounded-2xl overflow-hidden group animate-card-enter bg-white dark:bg-[var(--bg-card)] border border-slate-200 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all"
      spotlightColor="rgba(59, 130, 246, 0.12)"
      style={style}
    >
      {/* Top Accent Gradient Border */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${branch.accent}, ${student.cgpa >= 9.0 ? '#f59e0b' : '#3b82f6'})`
        }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* ── Row 1: Avatar + Name + Branch Badge ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl font-extrabold text-sm flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(student.usn || student.name)}`}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <span style={{ display: 'none' }} className="w-full h-full items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                  {getInitials(student.name)}
                </span>
              </div>
              {isTopPerformer && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 shadow-md text-black">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            {/* Name + USN */}
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                {student.name}
              </h4>
              <span className="font-mono text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300">
                {student.usn}
              </span>
            </div>
          </div>

          {/* Branch Badge & Placement Readiness */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${branch.badge}`}>
              {student.branch}
            </span>
            {isPlacementEligible && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/25">
                Tier-1 Ready
              </span>
            )}
          </div>
        </div>

        {/* ── Row 2: CGPA + Attendance Stat Boxes (High-Contrast Polish) ── */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* CGPA Container */}
          <div className="bg-slate-50 border border-slate-200/90 shadow-sm rounded-xl p-3.5 dark:bg-slate-800/50 dark:border-white/[0.06] transition-all">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              CGPA
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black tabular-nums text-amber-600 dark:text-amber-400">
                <CountUp to={student.cgpa} decimals={2} duration={0.8} />
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">/10</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 h-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-amber-500 dark:bg-amber-400"
                style={{ width: `${(student.cgpa / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* ATTENDANCE Container */}
          <div className="bg-slate-50 border border-slate-200/90 shadow-sm rounded-xl p-3.5 dark:bg-slate-800/50 dark:border-white/[0.06] transition-all">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              ATTENDANCE
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl font-black tabular-nums ${
                  isSafe
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isWarning
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                <CountUp to={student.attendance} suffix="%" duration={0.8} />
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 h-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isSafe
                    ? 'bg-emerald-500 dark:bg-emerald-400'
                    : isWarning
                    ? 'bg-amber-500 dark:bg-amber-400'
                    : 'bg-rose-500 dark:bg-rose-400'
                }`}
                style={{ width: `${student.attendance}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Row 3: Meta Info Strip ── */}
        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-1 font-medium">
          <span>
            Sem <strong className="text-slate-900 dark:text-slate-200">{student.semester}</strong> &bull; Sec <strong className="text-slate-900 dark:text-slate-200">{student.section || 'A'}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            {isSafe ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className={`w-3.5 h-3.5 ${isWarning ? 'text-amber-500' : 'text-rose-500'}`} />
            )}
            <span className={`font-bold ${isSafe ? 'text-emerald-700 dark:text-emerald-400' : isWarning ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {isSafe ? 'Safe' : isWarning ? 'Warn' : 'Risk'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span className={`font-semibold ${student.status === 'Active' ? 'text-emerald-700 dark:text-emerald-400' : student.status === 'At-Risk' ? 'text-amber-700 dark:text-amber-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {student.status}
            </span>
          </div>
        </div>

        {/* Developer Footprint (GitHub & LeetCode) */}
        {(student.githubUsername || student.leetcodeHandle) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {student.githubUsername && (
              <a
                href={`https://github.com/${student.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] font-mono transition-colors dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200 dark:border-white/10"
                title={`GitHub: @${student.githubUsername}`}
              >
                <Github className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>@{student.githubUsername}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            )}
            {student.leetcodeHandle && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono dark:bg-white/5 dark:text-amber-300 dark:border-white/10">
                <Code2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{student.leetcodeHandle}</span>
              </span>
            )}
          </div>
        )}

        {/* ── Row 4: Skills Pills ── */}
        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {student.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700 dark:bg-white/[0.06] dark:border-white/[0.08] dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-[10px] text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-white/5 font-semibold">
                +{student.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer Actions: Aligned with Crisp Contrast ── */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/[0.07] flex items-center justify-between">
          <button
            type="button"
            onClick={() => openDetailModal(student)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-1.5 transition-all hover:gap-2 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Profile</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => openEditDrawer(student)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all duration-200"
              title="Edit Record"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => openDeleteModal({ isBulk: false, data: student })}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all duration-200"
              title="Delete Student"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
