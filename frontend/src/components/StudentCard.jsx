import React from 'react';
import { 
  Sparkles, 
  Eye, 
  Edit3, 
  Trash2, 
  Award, 
  Calendar, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle,
  Mail,
  Phone,
  Github,
  Code2,
  ExternalLink,
  Stethoscope,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function StudentCard({ student }) {
  const { openDetailModal, openEditDrawer, openDeleteModal } = useStudentContext();

  const getBranchBadgeStyle = (branch) => {
    switch (branch) {
      case 'CSE':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'AIML':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'ISE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'ECE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MECH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // RVCE Status Tag with glowing micro-borders
  const getAttendanceStatusBadge = (att) => {
    if (att >= 85) {
      return (
        <span className="badge-safe px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> SEE Eligible
        </span>
      );
    }
    if (att >= 75) {
      return (
        <span className="text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> SEE Compliant
        </span>
      );
    }
    if (att >= 65) {
      return (
        <span className="badge-condonation px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse">
          <Stethoscope className="w-3 h-3" /> Condonation Risk
        </span>
      );
    }
    return (
      <span className="badge-nsar px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse">
        <XCircle className="w-3 h-3" /> Detained (NSAR)
      </span>
    );
  };

  const isPlacementEligible = student.cgpa >= 8.5 && Boolean(student.githubUsername && student.githubUsername.trim());

  return (
    <div className="glass-card rounded-2xl overflow-hidden p-5 flex flex-col justify-between group transition-all duration-300 relative border border-slate-200 dark:border-white/[0.08] hover:border-blue-500/30">
      
      {/* Top Banner Accent Glow */}
      <div className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
        student.cgpa >= 9.0 
          ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-90' 
          : student.attendance < 65
          ? 'bg-gradient-to-r from-rose-600 to-rose-400 opacity-90'
          : student.attendance < 75
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 opacity-80'
          : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-80'
      }`}></div>

      <div>
        {/* Header: Avatar, USN, Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-bold text-sm flex items-center justify-center shadow-md">
                {getInitials(student.name)}
              </div>
              {student.cgpa >= 9.0 && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-black shadow-lg" title="Distinction Rank">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 
                  onClick={() => openDetailModal(student)}
                  className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {student.name}
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
                {student.usn}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBranchBadgeStyle(student.branch)}`}>
              {student.branch}
            </span>
            {isPlacementEligible && (
              <span className="text-[10px] px-2 py-0.5 rounded-full badge-tier1 font-bold">
                Tier-1 Ready
              </span>
            )}
          </div>
        </div>

        {/* Academic Vital Meters */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5 mb-3 text-xs">
          
          {/* CGPA */}
          <div>
            <span className="text-slate-400 text-[11px] block">CGPA Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-extrabold ${student.cgpa >= 9.0 ? 'text-amber-400' : 'text-white'}`}>
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500">/ 10.0</span>
            </div>
          </div>

          {/* Attendance */}
          <div>
            <span className="text-slate-400 text-[11px] block">Attendance</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-extrabold ${
                student.attendance >= 85 ? 'text-emerald-400' : student.attendance >= 75 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {student.attendance}%
              </span>
              <span className="text-[10px] text-slate-500">
                {student.attendance >= 85 ? 'Safe' : student.attendance >= 75 ? 'Warn' : 'Risk'}
              </span>
            </div>
          </div>

          {/* Exam Status & Standing */}
          <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span>Sem {student.semester} &bull; Sec {student.section || 'A'}</span>
            {getAttendanceStatusBadge(student.attendance)}
          </div>
        </div>

        {/* Developer Footprint Launcher (if present) */}
        {(student.githubUsername || student.leetcodeHandle) && (
          <div className="flex items-center gap-2 mb-3">
            {student.githubUsername && (
              <a
                href={`https://github.com/${student.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[10px] font-mono transition-colors"
                title={`Visit GitHub: @${student.githubUsername}`}
              >
                <Github className="w-3 h-3 text-purple-400" />
                <span>@{student.githubUsername}</span>
                <ExternalLink className="w-2.5 h-2.5 text-purple-400/70" />
              </a>
            )}
            {student.leetcodeHandle && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                <Code2 className="w-3 h-3 text-amber-400" />
                <span>{student.leetcodeHandle}</span>
              </span>
            )}
          </div>
        )}

        {/* Skills Chips */}
        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {student.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-white/5 text-[10px] font-medium text-slate-300"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-400">
                +{student.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <button
          type="button"
          onClick={() => openDetailModal(student)}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Dossier</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditDrawer(student)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
            title="Edit Record"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => openDeleteModal({ isBulk: false, data: student })}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Student"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
