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

const branchColors = {
  CSE: { bg: 'rgba(59,130,246,0.12)', text: '#93c5fd', border: 'rgba(59,130,246,0.25)' },
  AIML: { bg: 'rgba(139,92,246,0.12)', text: '#c4b5fd', border: 'rgba(139,92,246,0.25)' },
  ISE: { bg: 'rgba(6,182,212,0.12)', text: '#67e8f9', border: 'rgba(6,182,212,0.25)' },
  ECE: { bg: 'rgba(16,185,129,0.12)', text: '#6ee7b7', border: 'rgba(16,185,129,0.25)' },
  EEE: { bg: 'rgba(245,158,11,0.12)', text: '#fcd34d', border: 'rgba(245,158,11,0.25)' },
  MECH: { bg: 'rgba(249,115,22,0.12)', text: '#fdba74', border: 'rgba(249,115,22,0.25)' },
  CIVIL: { bg: 'rgba(100,116,139,0.12)', text: '#94a3b8', border: 'rgba(100,116,139,0.25)' },
  BIOTECH: { bg: 'rgba(20,184,166,0.12)', text: '#5eead4', border: 'rgba(20,184,166,0.25)' },
};

function getAttendanceRing(pct) {
  if (pct >= 85) return { color: '#34d399', label: 'Safe', icon: CheckCircle };
  if (pct >= 75) return { color: '#fbbf24', label: 'Warn', icon: AlertTriangle };
  return { color: '#fb7185', label: 'Risk', icon: AlertTriangle };
}

function getCgpaColor(cgpa) {
  if (cgpa >= 9.0) return '#fbbf24'; // gold
  if (cgpa >= 8.0) return '#34d399'; // emerald
  if (cgpa >= 7.0) return '#60a5fa'; // blue
  return '#fb7185';                   // red
}

export default function StudentCard({ student, style }) {
  const { openDetailModal, openEditDrawer, openDeleteModal } = useStudentContext();

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const branch = branchColors[student.branch] || { bg: 'rgba(100,116,139,0.1)', text: '#94a3b8', border: 'rgba(100,116,139,0.2)' };
  const att = getAttendanceRing(student.attendance);
  const AttIcon = att.icon;
  const cgpaColor = getCgpaColor(student.cgpa);
  const isTopPerformer = student.cgpa >= 9.0;
  const isPlacementEligible = student.cgpa >= 8.5 && Boolean(student.githubUsername && student.githubUsername.trim());

  return (
    <SpotlightCard
      className="glass-card rounded-2xl overflow-hidden group animate-card-enter"
      spotlightColor={`${branch.bg.replace('0.12', '0.25')}`}
      style={style}
    >
      {/* Gradient top strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${branch.text}, ${cgpaColor})` }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* ── Row 1: Avatar + Name + Branch Badge ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-12 h-12 rounded-2xl font-extrabold text-sm flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${branch.bg}, ${branch.bg.replace('0.12', '0.2')})`,
                  color: branch.text,
                  border: `1px solid ${branch.border}`,
                }}
              >
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(student.usn || student.name)}`}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <span style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                  {getInitials(student.name)}
                </span>
              </div>
              {isTopPerformer && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 shadow-lg animate-float">
                  <Sparkles className="w-2.5 h-2.5 text-black" />
                </div>
              )}
            </div>

            {/* Name + USN */}
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors duration-200 truncate">
                {student.name}
              </h4>
              <span
                className="font-mono text-[11px] font-bold tracking-wider"
                style={{ color: branch.text }}
              >
                {student.usn}
              </span>
            </div>
          </div>

          {/* Branch Badge & Placement Readiness */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border"
              style={{ background: branch.bg, color: branch.text, borderColor: branch.border }}
            >
              {student.branch}
            </span>
            {isPlacementEligible && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/25">
                Tier-1 Ready
              </span>
            )}
          </div>
        </div>

        {/* ── Row 2: CGPA + Attendance Stats ── */}
        <div className="grid grid-cols-2 gap-2">
          {/* CGPA */}
          <div className="rounded-xl p-3 bg-black/20 border border-white/5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">CGPA</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold tabular-nums" style={{ color: cgpaColor }}>
                <CountUp to={student.cgpa} decimals={2} duration={0.8} />
              </span>
              <span className="text-[10px] text-slate-500">/10</span>
            </div>
            {/* Mini progress bar */}
            <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(student.cgpa / 10) * 100}%`, background: cgpaColor, opacity: 0.7 }}
              />
            </div>
          </div>

          {/* Attendance */}
          <div className="rounded-xl p-3 bg-black/20 border border-white/5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Attendance</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold tabular-nums" style={{ color: att.color }}>
                <CountUp to={student.attendance} suffix="%" duration={0.8} />
              </span>
            </div>
            {/* Mini progress bar */}
            <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${student.attendance}%`, background: att.color, opacity: 0.7 }}
              />
            </div>
          </div>
        </div>

        {/* ── Row 3: Meta info strip ── */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Sem <strong className="text-slate-300">{student.semester}</strong> • Sec <strong className="text-slate-300">{student.section || 'A'}</strong></span>
          <div className="flex items-center gap-1">
            <AttIcon className="w-3 h-3" style={{ color: att.color }} />
            <span style={{ color: att.color }} className="font-semibold">{att.label}</span>
            <span className="mx-1 text-slate-600">•</span>
            <span className={`font-semibold ${student.status === 'Active' ? 'text-emerald-400' : student.status === 'At-Risk' ? 'text-amber-400' : 'text-rose-400'}`}>
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
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[10px] font-mono transition-colors"
                title={`GitHub: @${student.githubUsername}`}
              >
                <Github className="w-3 h-3 text-purple-400" />
                <span>@{student.githubUsername}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
              </a>
            )}
            {student.leetcodeHandle && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 text-amber-300 border border-white/10 text-[10px] font-mono">
                <Code2 className="w-3 h-3 text-amber-400" />
                <span>{student.leetcodeHandle}</span>
              </span>
            )}
          </div>
        )}

        {/* ── Row 4: Skills ── */}
        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {student.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[10px] font-medium text-slate-300 hover:bg-white/10 transition-colors"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-lg bg-slate-800/60 text-[10px] text-slate-400 border border-white/5">
                +{student.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer Actions ── */}
        <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between">
          <button
            type="button"
            onClick={() => openDetailModal(student)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-all hover:gap-2"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Profile</span>
          </button>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => openEditDrawer(student)}
              className="p-2 rounded-xl hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 transition-all duration-200"
              title="Edit Record"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => openDeleteModal({ isBulk: false, data: student })}
              className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all duration-200"
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
