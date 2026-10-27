import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  RefreshCw,
  Command,
  LayoutGrid,
  TableProperties,
  ChevronRight,
  Home
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

const TAB_LABELS = {
  overview: 'Overview',
  directory: 'Student Directory',
  enroll: 'Enroll Student',
  records: 'Academic Records',
  analytics: 'Analytics',
  placement: 'Placement Radar',
  radar: 'Risk Radar',
  performers: 'Top Performers',
  export: 'Export Data',
  portal: 'Showcase Portal',
  settings: 'Settings',
};

export default function Topbar({ activeTab }) {
  const {
    searchTerm, setSearchTerm,
    fetchStudents, fetchAnalytics, checkDbHealth,
    openCreateDrawer,
    viewMode, setViewMode,
    setIsCommandPaletteOpen,
    showToast,
  } = useStudentContext();

  const refresh = () => {
    fetchStudents();
    fetchAnalytics();
    checkDbHealth();
    showToast('Dashboard refreshed', 'info');
  };

  return (
    <header
      className="topbar-surface sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3 border-b border-white/[0.06]"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400 min-w-0">
        <Home className="w-3.5 h-3.5 flex-shrink-0" />
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
        <span className="text-slate-500">RVCE</span>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
        <span className="font-semibold text-white truncate">{TAB_LABELS[activeTab] || 'Dashboard'}</span>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students…"
            className="w-52 pl-9 pr-10 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="absolute right-2 text-[10px] font-mono text-slate-500 px-1 py-0.5 rounded border border-white/10 hover:text-white transition-colors"
          >
            ⌘K
          </button>
        </div>

        {/* View toggle (only for directory) */}
        {activeTab === 'directory' && (
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table view"
            >
              <TableProperties className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Refresh */}
        <button
          type="button"
          onClick={refresh}
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Enroll CTA */}
        <button
          type="button"
          onClick={openCreateDrawer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-glow-blue active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll</span>
        </button>
      </div>
    </header>
  );
}
