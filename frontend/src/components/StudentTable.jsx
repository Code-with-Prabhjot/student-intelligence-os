import React, { useState } from 'react';
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
  ExternalLink,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  XCircle,
  Users
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
    bulkDelete,
  } = useStudentContext();

  const [tableTab, setTableTab] = useState('all'); // 'all', 'placement', 'risk', 'opensource'

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
      return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return filters.order === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-blue-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-400" />
    );
  };

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

  // RVCE Status Badge with distinction / condonation / NSAR glow
  const getAttendanceBadge = (attendance) => {
    if (attendance >= 85) {
      return (
        <span className="badge-safe px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {attendance}% (SEE Eligible)
        </span>
      );
    }
    if (attendance >= 75) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {attendance}% (Compliant)
        </span>
      );
    }
    if (attendance >= 65) {
      return (
        <span className="badge-condonation px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
          <Stethoscope className="w-3 h-3" />
          {attendance}% (Condonation)
        </span>
      );
    }
    return (
      <span className="badge-nsar px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        {attendance}% (NSAR Detained)
      </span>
    );
  };

  // Filter students based on Table Quick-Action Tab
  const displayedStudents = students.filter((s) => {
    if (tableTab === 'placement') {
      return s.cgpa >= 8.5 && Boolean(s.githubUsername && s.githubUsername.trim());
    }
    if (tableTab === 'risk') {
      return s.attendance < 75;
    }
    if (tableTab === 'opensource') {
      return Boolean(s.githubUsername && s.githubUsername.trim());
    }
    return true;
  });

  return (
    <div className="w-full space-y-4">
      
      {/* Quick-Action Sub Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl glass-panel border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setTableTab('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              tableTab === 'all'
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Students</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTableTab('placement')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              tableTab === 'placement'
                ? 'bg-purple-600 text-white shadow-glow-indigo'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>Placement Eligible (Tier-1)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
              {students.filter((s) => s.cgpa >= 8.5 && s.githubUsername).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTableTab('risk')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              tableTab === 'risk'
                ? 'bg-rose-600 text-white shadow-glow-rose'
                : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Attendance At-Risk</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
              {students.filter((s) => s.attendance < 75).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTableTab('opensource')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              tableTab === 'opensource'
                ? 'bg-indigo-600 text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Source Contributors</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
              {students.filter((s) => s.githubUsername).length}
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-400 px-3 hidden md:inline">
          Showing {displayedStudents.length} of {students.length} filtered
        </span>
      </div>

      {/* Bulk Action Header Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-2xl glass-panel border border-blue-500/30 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold text-white">
              {selectedIds.length} {selectedIds.length === 1 ? 'student' : 'students'} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openDeleteModal({ isBulk: true, ids: selectedIds })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSelectAll(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Table Container */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-100/95 dark:bg-slate-900/80 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                
                {/* Select All Checkbox */}
                <th className="py-4 px-4 w-12 text-center">
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(isAllSelected)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </th>

                {/* USN */}
                <th
                  onClick={() => handleSort('usn')}
                  className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>USN</span>
                    {renderSortIcon('usn')}
                  </div>
                </th>

                {/* Name & Profiles */}
                <th
                  onClick={() => handleSort('name')}
                  className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Identity & GitHub</span>
                    {renderSortIcon('name')}
                  </div>
                </th>

                {/* Branch */}
                <th
                  onClick={() => handleSort('branch')}
                  className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Dept</span>
                    {renderSortIcon('branch')}
                  </div>
                </th>

                {/* Semester */}
                <th
                  onClick={() => handleSort('semester')}
                  className="py-4 px-4 cursor-pointer group hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Sem</span>
                    {renderSortIcon('semester')}
                  </div>
                </th>

                {/* CGPA */}
                <th
                  onClick={() => handleSort('cgpa')}
                  className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>CGPA</span>
                    {renderSortIcon('cgpa')}
                  </div>
                </th>

                {/* Attendance */}
                <th
                  onClick={() => handleSort('attendance')}
                  className="py-4 px-4 cursor-pointer group hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>RVCE Exam Standing</span>
                    {renderSortIcon('attendance')}
                  </div>
                </th>

                {/* Status */}
                <th className="py-4 px-4">Status</th>

                {/* Actions */}
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.05] text-sm">
              {loading && students.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm">Retrieving student records from database...</p>
                    </div>
                  </td>
                </tr>
              ) : displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3 border border-white/10">
                        <AlertCircle className="w-6 h-6 text-slate-500" />
                      </div>
                      <h4 className="text-base font-semibold text-white mb-1">No Students Found</h4>
                      <p className="text-xs text-slate-400 mb-4 text-center">
                        No student records match the selected quick-action filter.
                      </p>
                      <button
                        type="button"
                        onClick={() => setTableTab('all')}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-glow-blue transition-all"
                      >
                        Reset to All Students
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedStudents.map((student) => {
                  const isSelected = selectedIds.includes(student._id);

                  return (
                    <tr
                      key={student._id}
                      className={`group transition-colors hover:bg-slate-800/40 ${
                        isSelected ? 'bg-blue-900/20' : ''
                      } ${student.isDeleted ? 'opacity-60 bg-rose-950/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectStudent(student._id)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* USN */}
                      <td className="py-3 px-4 font-mono font-bold text-xs text-blue-600 dark:text-blue-400 tracking-wider">
                        {student.usn}
                      </td>

                      {/* Name, Avatar, & GitHub Launcher */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 shadow-sm flex-shrink-0">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span 
                                onClick={() => openDetailModal(student)}
                                className="cursor-pointer hover:text-blue-400 transition-colors"
                              >
                                {student.name}
                              </span>
                              {student.cgpa >= 9.0 && (
                                <span title="Distinction Scholar">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 inline" />
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {student.email}
                              </span>

                              {/* GitHub Icon Link */}
                              {student.githubUsername && (
                                <a
                                  href={`https://github.com/${student.githubUsername}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-400 hover:text-purple-300 hover:underline"
                                  title={`Open GitHub: @${student.githubUsername}`}
                                >
                                  <Github className="w-3 h-3" />
                                  <span>@{student.githubUsername}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Branch Badge */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getBranchBadgeStyle(student.branch)}`}>
                          {student.branch}
                        </span>
                      </td>

                      {/* Semester */}
                      <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        Sem {student.semester}
                      </td>

                      {/* CGPA */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold text-sm ${student.cgpa >= 9.0 ? 'text-amber-600 dark:text-amber-400 font-extrabold' : student.cgpa >= 7.5 ? 'text-blue-600 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            {student.cgpa.toFixed(2)}
                          </span>
                        </div>
                      </td>

                      {/* Attendance & RVCE Standing */}
                      <td className="py-3 px-4">
                        {getAttendanceBadge(student.attendance)}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            student.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : student.status === 'At-Risk'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            student.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}></span>
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
                            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-blue-400 transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Drawer */}
                          <button
                            type="button"
                            onClick={() => openEditDrawer(student)}
                            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Edit Record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => openDeleteModal({ isBulk: false, data: student })}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
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
              Showing <span className="font-bold text-slate-900 dark:text-white">{displayedStudents.length}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{pagination.totalCount}</span> entries
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={filters.limit}
                onChange={(e) => setFilter('limit', Number(e.target.value))}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 text-xs focus:outline-none shadow-sm"
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
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setFilter('page', pagination.currentPage + 1)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
