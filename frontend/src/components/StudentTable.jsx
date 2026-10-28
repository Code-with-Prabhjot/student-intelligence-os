import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit3,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileDown,
  RotateCcw,
  Github,
  Code2
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function StudentTable() {
  const {
    students,
    pagination,
    loading,
    filters,
    setFilter,
    selectedIds,
    toggleSelectStudent,
    toggleSelectAll,
    openEditDrawer,
    openDetailModal,
    openDeleteModal,
    openCreateDrawer,
  } = useStudentContext();

  const handleSort = (column) => {
    if (filters.sortBy === column) {
      setFilter('order', filters.order === 'asc' ? 'desc' : 'asc');
    } else {
      setFilter('sortBy', column);
      setFilter('order', 'desc');
    }
  };

  const isAllSelected = students.length > 0 && students.every((s) => selectedIds.includes(s._id));

  const renderSortIcon = (column) => {
    if (filters.sortBy !== column) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return filters.order === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
    );
  };

  const getBranchBadgeStyle = (branch) => {
    switch (branch) {
      case 'CSE':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'AIML':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20';
      case 'ISE':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20';
      case 'ECE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'MECH':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
    }
  };

  const getAttendanceBadge = (attendance) => {
    if (attendance >= 85) {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
          {attendance}% (Safe)
        </span>
      );
    }
    if (attendance >= 75) {
      return (
        <span className="bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
          {attendance}% (Warning)
        </span>
      );
    }
    return (
      <span className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
        <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> {attendance}% (Risk)
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Bulk Action Header Toolbar */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 rounded-2xl glass-panel bg-blue-50/90 dark:bg-slate-900/90 border border-blue-500/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {selectedIds.length} {selectedIds.length === 1 ? 'student' : 'students'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openDeleteModal({ isBulk: true, ids: selectedIds })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSelectAll(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Table Container */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-2xl bg-white dark:bg-slate-950/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/90 dark:bg-slate-900/60 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {/* Select All Checkbox */}
                <th className="py-4 px-4 w-12 text-center">
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(isAllSelected)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                </th>

                {/* USN */}
                <th
                  onClick={() => handleSort('usn')}
                  className="py-4 px-4 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>USN</span>
                    {renderSortIcon('usn')}
                  </div>
                </th>

                {/* Name */}
                <th
                  onClick={() => handleSort('name')}
                  className="py-4 px-4 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Identity</span>
                    {renderSortIcon('name')}
                  </div>
                </th>

                {/* Branch */}
                <th
                  onClick={() => handleSort('branch')}
                  className="py-4 px-4 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Dept</span>
                    {renderSortIcon('branch')}
                  </div>
                </th>

                {/* Semester */}
                <th
                  onClick={() => handleSort('semester')}
                  className="py-4 px-4 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Sem</span>
                    {renderSortIcon('semester')}
                  </div>
                </th>

                {/* CGPA */}
                <th
                  onClick={() => handleSort('cgpa')}
                  className="py-4 px-4 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>CGPA</span>
                    {renderSortIcon('cgpa')}
                  </div>
                </th>

                {/* Attendance */}
                <th
                  onClick={() => handleSort('attendance')}
                  className="py-4 px-4 cursor-pointer group hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Attendance</span>
                    {renderSortIcon('attendance')}
                  </div>
                </th>

                {/* Status */}
                <th className="py-4 px-4">Status</th>

                {/* Actions */}
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05] text-sm">
              {loading && students.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-medium">Retrieving student records from database...</p>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3 border border-slate-200 dark:border-white/10">
                        <AlertCircle className="w-6 h-6 text-slate-400" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Students Found</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
                        No student records match your active search and filter constraints.
                      </p>
                      <button
                        type="button"
                        onClick={openCreateDrawer}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-glow-blue transition-all"
                      >
                        Enroll First Student
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => {
                  const isSelected = selectedIds.includes(student._id);
                  const isAtRisk = student.attendance < 75;
                  const isWarning = student.attendance >= 75 && student.attendance < 85;
                  const riskBorder = isAtRisk
                    ? 'border-l-4 border-l-rose-500'
                    : isWarning
                    ? 'border-l-4 border-l-amber-500'
                    : 'border-l-4 border-l-transparent';

                  return (
                    <tr
                      key={student._id}
                      className={`group transition-colors ${
                        idx % 2 === 0 ? 'bg-white dark:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-900/10'
                      } hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                        isSelected ? 'bg-blue-50/80 dark:bg-blue-900/20' : ''
                      } ${student.isDeleted ? 'opacity-60 bg-rose-50/40 dark:bg-rose-950/20' : ''} ${riskBorder}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectStudent(student._id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* USN */}
                      <td className="py-3 px-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400 tracking-wider">
                        {student.usn}
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-slate-200 dark:border-blue-500/20 shadow-xs flex-shrink-0 overflow-hidden">
                            <img
                              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(student.usn || student.name)}`}
                              alt={student.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                              }}
                            />
                            <span style={{ display: 'none' }} className="w-full h-full items-center justify-center font-bold">
                              {getInitials(student.name)}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{student.name}</span>
                              {student.cgpa >= 9.0 && (
                                <span title="Distinction Scholar">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 inline" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{student.email}</span>
                              {student.githubUsername && (
                                <a
                                  href={`https://github.com/${student.githubUsername}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors inline-flex items-center"
                                  title={`GitHub: @${student.githubUsername}`}
                                >
                                  <Github className="w-3 h-3" />
                                </a>
                              )}
                              {student.leetcodeHandle && (
                                <span className="text-amber-600 dark:text-amber-400 inline-flex items-center" title={`LeetCode: ${student.leetcodeHandle}`}>
                                <Code2 className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Branch Badge */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getBranchBadgeStyle(student.branch)}`}>
                          {student.branch}
                        </span>
                      </td>

                      {/* Semester */}
                      <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        Sem {student.semester}
                      </td>

                      {/* CGPA */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-black text-sm ${student.cgpa >= 9.0 ? 'text-amber-600 dark:text-amber-400' : student.cgpa >= 7.5 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {student.cgpa.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-4">
                        {getAttendanceBadge(student.attendance)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            student.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                              : student.status === 'At-Risk'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                              : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              student.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {/* View Detail */}
                          <button
                            type="button"
                            onClick={() => openDetailModal(student)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Drawer */}
                          <button
                            type="button"
                            onClick={() => openEditDrawer(student)}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit Record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => openDeleteModal({ isBulk: false, data: student })}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/90 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-bold text-slate-900 dark:text-white">{students.length}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{pagination.totalCount}</span> entries
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={filters.limit}
                onChange={(e) => setFilter('limit', Number(e.target.value))}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 text-xs focus:outline-none shadow-xs font-semibold"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-2">
              Page <span className="font-bold text-slate-900 dark:text-white">{pagination.currentPage}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{pagination.totalPages}</span>
            </span>
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() => setFilter('page', pagination.currentPage - 1)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setFilter('page', pagination.currentPage + 1)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
