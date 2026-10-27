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
  Phone
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

  return (
    <div className="glass-card rounded-2xl overflow-hidden p-5 flex flex-col justify-between group transition-all duration-300 relative border border-white/[0.08] hover:border-blue-500/30">
      
      {/* Top Banner Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

      <div>
        {/* Header: Avatar, USN, Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                alt={student.name}
                className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 object-cover shadow-md"
              />
              {student.cgpa >= 9.0 && (
                <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-black shadow-lg">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">
                  {student.name}
                </h4>
              </div>
              <span className="font-mono text-xs font-semibold text-blue-400 block tracking-wider">
                {student.usn}
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBranchBadgeStyle(student.branch)}`}>
            {student.branch}
          </span>
        </div>

        {/* Academic Vital Meters */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5 mb-4 text-xs">
          
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

          {/* Semester & Section */}
          <div className="col-span-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Semester {student.semester} &bull; Sec {student.section || 'A'}</span>
            <span className={`font-semibold ${student.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {student.status}
            </span>
          </div>
        </div>

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
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
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
