import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import OverviewPage from './components/OverviewPage';
import BentoStats from './components/BentoStats';
import StudentTable from './components/StudentTable';
import StudentCard from './components/StudentCard';
import StudentDrawer from './components/StudentDrawer';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteModal from './components/DeleteModal';
import CommandPalette from './components/CommandPalette';
import ExportTools from './components/ExportTools';
import Toast from './components/Toast';
import AttendanceRiskRadar from './components/AttendanceRiskRadar';
import TopPerformers from './components/TopPerformers';
import PlacementRadar from './components/PlacementRadar';
import LandingPage from './components/LandingPage';
import RecordsPage from './components/RecordsPage';
import SettingsPage from './components/SettingsPage';
import { useStudentContext } from './context/StudentContext';
import {
  RotateCcw, SlidersHorizontal, ChevronLeft, ChevronRight,
  Trash2, Users, ChevronDown, BookOpen, FileDown, Settings as SettingsIcon, Briefcase
} from 'lucide-react';

const branchOptions = [
  'ALL', 'CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'BIOTECH', 'CHEMICAL', 'AEROSPACE', 'ETE', 'IEM'
];

const yearOptions = [
  { id: 'ALL', label: 'All Batches' },
  { id: '1st Year', label: '1st Year (2025 / 1RV & 1RZ)' },
  { id: '2nd Year', label: '2nd Year (2024)' },
  { id: '3rd Year', label: '3rd Year (2023)' },
  { id: '4th Year', label: '4th Year (2022)' },
];

/* ── Filter Bar (only for Directory) ── */
function FilterBar() {
  const { filters, setFilter, resetFilters, searchTerm } = useStudentContext();
  const [open, setOpen] = useState(false);

  const isFiltered =
    filters.branch !== 'ALL' || (filters.academicYear && filters.academicYear !== 'ALL') ||
    filters.semester !== 'ALL' || filters.status !== 'ALL' ||
    filters.minCgpa !== '' || filters.maxCgpa !== '' ||
    filters.attendanceRisk !== '' || filters.includeDeleted === 'only' ||
    searchTerm.trim() !== '';

  return (
    <div className="glass-card rounded-2xl px-4 py-3 border border-white/[0.07] space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { label: 'All', active: !isFiltered, fn: resetFilters, cls: 'border-white/10 text-slate-300' },
            { label: '🔴 Critical', active: filters.attendanceRisk === 'critical', fn: () => { resetFilters(); setFilter('attendanceRisk', 'critical'); }, cls: 'border-rose-500/20 text-rose-300' },
            { label: '🏆 Dean\'s List', active: filters.minCgpa === '9.0', fn: () => { resetFilters(); setFilter('minCgpa', '9.0'); }, cls: 'border-amber-500/20 text-amber-300' },
            { label: '⚠️ Warning', active: filters.attendanceRisk === 'warning', fn: () => { resetFilters(); setFilter('attendanceRisk', 'warning'); }, cls: 'border-yellow-500/20 text-yellow-300' },
          ].map(({ label, active, fn, cls }) => (
            <button key={label} type="button" onClick={fn}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-all ${cls} ${active ? 'bg-white/5 ring-1 ring-white/10' : 'bg-transparent opacity-60 hover:opacity-100'}`}>
              {label}
            </button>
          ))}
          <button type="button"
            onClick={() => setFilter('includeDeleted', filters.includeDeleted === 'only' ? 'false' : 'only')}
            className={`px-3 py-1.5 rounded-xl font-medium border flex items-center gap-1.5 transition-all ${filters.includeDeleted === 'only' ? 'bg-rose-600/15 text-rose-300 border-rose-500/30' : 'bg-transparent text-slate-400 border-white/5 opacity-60 hover:opacity-100'
              }`}>
            <Trash2 className="w-3 h-3" /> Trash
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(!open)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${open || isFiltered ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-slate-400 border-white/5 hover:text-white'
              }`}>
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {isFiltered && (
            <button type="button" onClick={resetFilters}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs animate-slide-up-fade">
          <div>
            <label className="text-slate-400 font-semibold block mb-1.5">Batch / Year</label>
            <select value={filters.academicYear || 'ALL'} onChange={e => setFilter('academicYear', e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-white/30 transition-colors">
              {yearOptions.map(y => <option key={y.id} value={y.id} className="bg-slate-900">{y.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1.5">Department</label>
            <select value={filters.branch} onChange={e => setFilter('branch', e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-white/30 transition-colors">
              {branchOptions.map(b => <option key={b} value={b} className="bg-slate-900">{b === 'ALL' ? 'All Departments' : b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1.5">Semester</label>
            <select value={filters.semester} onChange={e => setFilter('semester', e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-white/30 transition-colors">
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-slate-900">Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1.5">Status</label>
            <select value={filters.status} onChange={e => setFilter('status', e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-white/30 transition-colors">
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="At-Risk">At-Risk</option>
              <option value="Suspended">Suspended</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1.5">CGPA Range</label>
            <div className="flex items-center gap-1.5">
              <input type="number" step="0.1" min="0" max="10" placeholder="Min"
                value={filters.minCgpa} onChange={e => setFilter('minCgpa', e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-2 py-2 text-slate-200 text-center focus:outline-none focus:border-white/30" />
              <span className="text-slate-600">–</span>
              <input type="number" step="0.1" min="0" max="10" placeholder="Max"
                value={filters.maxCgpa} onChange={e => setFilter('maxCgpa', e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-2 py-2 text-slate-200 text-center focus:outline-none focus:border-white/30" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shimmer Skeleton Loader ── */
function DirectorySkeleton({ viewMode }) {
  if (viewMode === 'table') {
    return (
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.08] p-4 space-y-3">
        <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse flex items-center px-4 gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="w-24 h-4 rounded bg-white/10" />
            <div className="flex-1 h-4 rounded bg-white/5" />
            <div className="w-16 h-4 rounded bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-5 border border-white/[0.08] space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/5" />
            </div>
            <div className="w-12 h-5 rounded-full bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            <div className="h-10 rounded-xl bg-white/5" />
            <div className="h-10 rounded-xl bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Directory view ── */
function DirectoryView() {
  const { students, pagination, filters, setFilter, loading, viewMode } = useStudentContext();

  return (
    <div className="space-y-4 animate-slide-up-fade">
      <FilterBar />

      {loading ? (
        <DirectorySkeleton viewMode={viewMode} />
      ) : viewMode === 'table' ? (
        <StudentTable />
      ) : (
        <div>
          {students.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No student records match the active criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {students.map((student, idx) => (
                  <StudentCard key={student._id} student={student} style={{ animationDelay: `${idx * 45}ms` }} />
                ))}
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between mt-5 text-xs text-slate-400">
                <span>Showing {students.length} of {pagination.totalCount}</span>
                <div className="flex items-center gap-2">
                  <button type="button" disabled={!pagination.hasPrevPage}
                    onClick={() => setFilter('page', pagination.currentPage - 1)}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 rounded-xl bg-white/5 font-mono">{pagination.currentPage} / {pagination.totalPages}</span>
                  <button type="button" disabled={!pagination.hasNextPage}
                    onClick={() => setFilter('page', pagination.currentPage + 1)}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 disabled:opacity-30 hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Export Page ── */
function ExportPage() {
  return (
    <div className="animate-slide-up-fade">
      <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mb-6">
        <FileDown className="w-5 h-5 text-slate-400" /> Export Data
      </h2>
      <ExportTools standalone />
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewPage setActiveTab={setActiveTab} />;
      case 'directory': return <DirectoryView />;
      case 'analytics': return <BentoStats />;
      case 'radar': return <AttendanceRiskRadar />;
      case 'performers': return <TopPerformers />;
      case 'placement': return <PlacementRadar />;
      case 'portal': return <LandingPage onLaunchApp={() => setActiveTab('overview')} />;
      case 'records': return <RecordsPage setActiveTab={setActiveTab} />;
      case 'export': return <ExportPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-app)] selection:bg-blue-500/20">

      {/* ── Left Sidebar ── */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ── Right Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeTab={activeTab} />

        {/* Scrollable content pane */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {renderContent()}
        </main>
      </div>

      {/* ── Global Overlays ── */}
      <StudentDrawer />
      <StudentDetailModal />
      <DeleteModal />
      <CommandPalette />
      <Toast />
    </div>
  );
}
