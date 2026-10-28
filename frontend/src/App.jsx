import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
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
import NetworkCanvas from './components/NetworkCanvas';
import { useStudentContext } from './context/StudentContext';
import {
  Plus, RotateCcw, SlidersHorizontal, ChevronLeft, ChevronRight,
  Trash2, Users, ChevronDown, BookOpen, FileDown, Settings as SettingsIcon, Briefcase,
  Layers, Filter, Sparkles
} from 'lucide-react';

const branchOptions = [
  'ALL', 'CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'BIOTECH', 'CHEMICAL', 'AEROSPACE', 'ETE', 'IEM'
];

const tier1YearOptions = [
  { id: 'ALL', label: 'All Batches', sub: 'All Batches' },
  { id: '1st Year', label: '1st Year (2025 / 1RV & 1RZ)', sub: '2025' },
  { id: '2nd Year', label: '2nd Year (2024)', sub: '2024' },
  { id: '3rd Year', label: '3rd Year (2023)', sub: '2023' },
  { id: '4th Year', label: '4th Year (2022)', sub: '2022' },
];

const tier2BranchTabs = [
  { id: 'ALL', label: 'All Branches' },
  { id: 'CSE', label: 'CSE' },
  { id: 'AIML', label: 'AIML' },
  { id: 'ISE', label: 'ISE' },
  { id: 'ECE', label: 'ECE' },
  { id: 'EEE', label: 'EEE' },
  { id: 'MECH', label: 'MECH' },
  { id: 'CIVIL', label: 'CIVIL' },
  { id: 'BIOTECH', label: 'BIOTECH' },
];

/* ── Filter Bar (for Directory) ── */
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
    <div className="glass-card rounded-2xl px-4 py-3 border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[var(--bg-card)] space-y-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Quick Presets: High-Contrast Light Mode & Dark Mode Variants */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { 
              label: 'All', 
              active: !isFiltered, 
              fn: resetFilters, 
              cls: 'bg-white text-slate-700 border-slate-300 dark:bg-slate-800/60 dark:text-slate-200 dark:border-white/10 font-semibold' 
            },
            { 
              label: '🔴 Critical', 
              active: filters.attendanceRisk === 'critical', 
              fn: () => { resetFilters(); setFilter('attendanceRisk', 'critical'); }, 
              cls: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold shadow-xs dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-500/30' 
            },
            { 
              label: '🏆 Dean\'s List', 
              active: filters.minCgpa === '9.0', 
              fn: () => { resetFilters(); setFilter('minCgpa', '9.0'); }, 
              cls: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold shadow-xs dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/30' 
            },
            { 
              label: '⚠️ Warning', 
              active: filters.attendanceRisk === 'warning', 
              fn: () => { resetFilters(); setFilter('attendanceRisk', 'warning'); }, 
              cls: 'bg-amber-50 text-amber-700 border-amber-300 font-semibold shadow-xs dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-500/30' 
            },
          ].map(({ label, active, fn, cls }) => (
            <button 
              key={label} 
              type="button" 
              onClick={fn}
              className={`px-3 py-1.5 rounded-xl border transition-all ${cls} ${
                active 
                  ? 'ring-2 ring-blue-500/50 scale-[1.02] shadow-xs' 
                  : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
              }`}
            >
              {label}
            </button>
          ))}

          <button 
            type="button"
            onClick={() => setFilter('includeDeleted', filters.includeDeleted === 'only' ? 'false' : 'only')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
              filters.includeDeleted === 'only' 
                ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold dark:bg-rose-600/20 dark:text-rose-300 dark:border-rose-500/30' 
                : 'bg-slate-100 text-slate-700 border-slate-300 font-medium dark:bg-slate-800/40 dark:text-slate-400 dark:border-white/5 opacity-80 hover:opacity-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" /> Trash
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              open || isFiltered 
                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-white/10 dark:text-white dark:border-white/20' 
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 dark:bg-transparent dark:text-slate-400 dark:border-white/5 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {isFiltered && (
            <button 
              type="button" 
              onClick={resetFilters}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
              title="Reset all filter selections"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs animate-slide-up-fade">
          <div>
            <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Batch / Year</label>
            <select 
              value={filters.academicYear || 'ALL'} 
              onChange={e => setFilter('academicYear', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors"
            >
              {tier1YearOptions.map(y => <option key={y.id} value={y.id} className="bg-white dark:bg-slate-900">{y.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Department</label>
            <select 
              value={filters.branch} 
              onChange={e => setFilter('branch', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors"
            >
              {branchOptions.map(b => <option key={b} value={b} className="bg-white dark:bg-slate-900">{b === 'ALL' ? 'All Departments' : b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Semester</label>
            <select 
              value={filters.semester} 
              onChange={e => setFilter('semester', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} className="bg-white dark:bg-slate-900">Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">Status</label>
            <select 
              value={filters.status} 
              onChange={e => setFilter('status', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="At-Risk">At-Risk</option>
              <option value="Detained">Detained</option>
              <option value="Condonation Required">Condonation Required</option>
            </select>
          </div>
          <div>
            <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1.5">CGPA Range</label>
            <div className="flex items-center gap-1.5">
              <input 
                type="number" step="0.1" min="0" max="10" placeholder="Min"
                value={filters.minCgpa} 
                onChange={e => setFilter('minCgpa', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-2 text-slate-800 dark:text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/40" 
              />
              <span className="text-slate-400">&ndash;</span>
              <input 
                type="number" step="0.1" min="0" max="10" placeholder="Max"
                value={filters.maxCgpa} 
                onChange={e => setFilter('maxCgpa', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-2 text-slate-800 dark:text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/40" 
              />
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
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] p-4 space-y-3 bg-white dark:bg-slate-950/60">
        <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-12 bg-slate-50 dark:bg-white/[0.03] rounded-xl animate-pulse flex items-center px-4 gap-4">
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10" />
            <div className="w-24 h-4 rounded bg-slate-200 dark:bg-white/10" />
            <div className="flex-1 h-4 rounded bg-slate-100 dark:bg-white/5" />
            <div className="w-16 h-4 rounded bg-slate-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/[0.08] space-y-4 animate-pulse bg-white dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/10" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-white/5" />
            </div>
            <div className="w-12 h-5 rounded-full bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-white/5" />
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Directory View (With Restored Two-Tier Navigation Hub & 3D Hero) ── */
function DirectoryView() {
  const { students, pagination, filters, setFilter, loading, viewMode, analytics, openCreateDrawer } = useStudentContext();

  const yearCounts = useMemo(() => {
    if (analytics?.semesterStats) {
      const getSum = (sems) => 
        analytics.semesterStats
          .filter((s) => sems.includes(Number(String(s.semester).replace(/\D/g, ''))))
          .reduce((acc, curr) => acc + curr.count, 0);
      return {
        ALL: analytics.summary?.totalStudents || 100,
        '1st Year': getSum([1, 2]) || 25,
        '2nd Year': getSum([3, 4]) || 25,
        '3rd Year': getSum([5, 6]) || 25,
        '4th Year': getSum([7, 8]) || 25,
      };
    }
    return { ALL: 100, '1st Year': 25, '2nd Year': 25, '3rd Year': 25, '4th Year': 25 };
  }, [analytics]);

  return (
    <div className="space-y-4 animate-slide-up-fade">
      
      {/* Executive Hero Banner with Embedded 3D Interactive Particle Mesh */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-2xl bg-white dark:bg-slate-900/40">
        <NetworkCanvas className="pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400">
                RVCE Autonomous Academic Registry &bull; Bengaluru
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30">
                Autonomous 2024-2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Student Intelligence <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">&amp; Lifecycle OS</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              Autonomous VTU attendance risk forecasting, RVCE CIE exam clearance simulations, and Tier-1 open-source placement telemetry over 100 seeded student records with both 1RV and 1RZ format support.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={openCreateDrawer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-glow-blue transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
            <ExportTools />
          </div>
        </div>
      </div>

      {/* Two-Tier Navigation Hub (Restored: Academic Year & Branch Ribbons) */}
      <div className="space-y-3 glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 bg-white dark:bg-[var(--bg-card)] shadow-xs">
        
        {/* Tier 1: Academic Year Selector (Pill Bar) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Tier 1 &bull; Academic Year &amp; Batch
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              {filters.academicYear === 'ALL' ? 'Showing All Batches' : `Filtered: ${filters.academicYear}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {tier1YearOptions.map((yr) => {
              const isSelected = filters.academicYear === yr.id;
              const count = yearCounts[yr.id] ?? 25;
              return (
                <button
                  key={yr.id}
                  type="button"
                  onClick={() => setFilter('academicYear', yr.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-glow-blue scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-white/5'
                  }`}
                >
                  <span>{yr.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2: Branch Filter Tabs */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Tier 2 &bull; Branch / Engineering Department
            </span>
            <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
              {filters.branch === 'ALL' ? 'All Departments' : filters.branch}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {tier2BranchTabs.map((b) => {
              const isSelected = filters.branch === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setFilter('branch', b.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-white/5'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Preset and Advanced Filter Ribbon */}
      <FilterBar />

      {/* Main Student Directory Content */}
      {loading ? (
        <DirectorySkeleton viewMode={viewMode} />
      ) : viewMode === 'table' ? (
        <StudentTable />
      ) : (
        <div>
          {students.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/10">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">
                No student records match the active criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {students.map((student, idx) => (
                  <StudentCard key={student._id} student={student} style={{ animationDelay: `${idx * 45}ms` }} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>Showing {students.length} of {pagination.totalCount} profiles</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setFilter('page', pagination.currentPage - 1)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button 
                    type="button" 
                    disabled={!pagination.hasNextPage}
                    onClick={() => setFilter('page', pagination.currentPage + 1)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 disabled:opacity-30 transition-colors"
                  >
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
    <div className="animate-slide-up-fade max-w-4xl mx-auto space-y-4">
      <div className="p-6 glass-card rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <FileDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Institutional Data Ingestion &amp; Export Center
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Batch ingestion and CSV/JSON reporting formatted for VTU compliance submissions, internal audit archiving, and soft-delete record restoration.
        </p>
        <ExportTools />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN APPLICATION
══════════════════════════════════════ */
export default function App() {
  // Requirement 1: Default view state must be 'landing' (Showcase Portal) on initial load
  const [viewState, setViewState] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'overview' | 'analytics' | 'radar' | 'performers' | 'placement' | 'records' | 'export' | 'settings'

  const renderContent = () => {
    switch (activeTab) {
      case 'directory': return <DirectoryView />;
      case 'overview': return <OverviewPage setActiveTab={setActiveTab} />;
      case 'analytics': return <BentoStats />;
      case 'radar': return <AttendanceRiskRadar />;
      case 'performers': return <TopPerformers />;
      case 'placement': return <PlacementRadar />;
      case 'records': return <RecordsPage setActiveTab={setActiveTab} />;
      case 'export': return <ExportPage />;
      case 'settings': return <SettingsPage />;
      default: return <DirectoryView />;
    }
  };

  // 1. Initial Default Route: Showcase Portal (Full viewport, smooth launch into Directory)
  if (viewState === 'landing') {
    return (
      <div className="min-h-screen w-full overflow-y-auto bg-[var(--bg-app)] selection:bg-blue-500/20">
        <LandingPage onLaunchApp={() => {
          setViewState('app');
          setActiveTab('directory');
        }} />

        {/* Global Overlays */}
        <StudentDrawer />
        <StudentDetailModal />
        <DeleteModal />
        <CommandPalette />
        <Toast />
      </div>
    );
  }

  // 2. Management OS View (Top sticky Navbar + Sidebar navigation + Content pane)
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-app)] selection:bg-blue-500/20">
      
      {/* Top Persistent Institutional Navbar */}
      <Navbar 
        viewState={viewState} 
        setViewState={setViewState} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setViewState={setViewState} 
        />

        {/* Right Dashboard Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar activeTab={activeTab} setViewState={setViewState} />

          {/* Scrollable Main Content Pane */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Global Overlays */}
      <StudentDrawer />
      <StudentDetailModal />
      <DeleteModal />
      <CommandPalette />
      <Toast />
    </div>
  );
}
