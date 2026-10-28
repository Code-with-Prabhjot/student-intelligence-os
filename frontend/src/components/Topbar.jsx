import React from 'react';
import {
  RefreshCw,
  LayoutGrid,
  TableProperties
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

const TAB_LABELS = {
  overview: 'Executive Overview',
  directory: 'Student Directory',
  enroll: 'Enroll Student',
  records: 'Academic Records',
  analytics: 'Institutional Analytics',
  placement: 'Tier-1 Placement Radar',
  radar: 'CIE & Attendance Risk Radar',
  performers: 'Top Performers',
  export: 'Export Data',
  portal: 'Showcase Portal',
  settings: 'Settings',
};

export default function Topbar({ activeTab }) {
  const {
    fetchStudents, fetchAnalytics, checkDbHealth,
    viewMode, setViewMode,
    showToast,
  } = useStudentContext();

  const refresh = () => {
    fetchStudents();
    fetchAnalytics();
    checkDbHealth();
    showToast('Dashboard metrics refreshed', 'info');
  };

  return (
    <header
      className="topbar-surface sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3 border-b border-slate-200 dark:border-white/[0.06] bg-white/90 dark:bg-[var(--bg-topbar)] backdrop-blur-xl transition-colors"
    >
      {/* Clean Page Title (Redundant Home/Showcase sub-breadcrumbs removed) */}
      <div className="flex items-center gap-2.5 text-sm min-w-0">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <h2 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm sm:text-base">
          {TAB_LABELS[activeTab] || 'Dashboard'}
        </h2>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          &bull; RVCE Autonomous Governance
        </span>
      </div>

      {/* Contextual Actions (Duplicate search & duplicate enroll removed) */}
      <div className="flex items-center gap-2">
        {/* View toggle (only for directory) */}
        {activeTab === 'directory' && (
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table view"
            >
              <TableProperties className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Refresh */}
        <button
          type="button"
          onClick={refresh}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
          title="Refresh Metrics"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
