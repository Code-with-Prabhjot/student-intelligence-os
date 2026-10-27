import React from 'react';
import Navbar from './components/Navbar';
import BentoStats from './components/BentoStats';
import StudentTable from './components/StudentTable';
import StudentCard from './components/StudentCard';
import StudentDrawer from './components/StudentDrawer';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteModal from './components/DeleteModal';
import CommandPalette from './components/CommandPalette';
import ExportTools from './components/ExportTools';
import Toast from './components/Toast';
import { useStudentContext } from './context/StudentContext';
import { 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Database, 
  Layers,
  Sparkles,
  Search
} from 'lucide-react';

const branchOptions = [
  'ALL', 'CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 
  'CIVIL', 'BIOTECH', 'CHEMICAL', 'AEROSPACE', 'ETE', 'IEM'
];

export default function App() {
  const { 
    students, 
    pagination, 
    loading, 
    viewMode, 
    filters, 
    setFilter, 
    resetFilters,
    searchTerm,
    setSearchTerm,
    dbHealth
  } = useStudentContext();

  const isFiltered = 
    filters.branch !== 'ALL' ||
    filters.semester !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.minCgpa !== '' ||
    filters.maxCgpa !== '' ||
    filters.attendanceRisk !== '' ||
    filters.includeDeleted === 'only' ||
    searchTerm.trim() !== '';

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500/20">
      
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome & System Summary Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
                Institutional Academic Registry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Student Intelligence & Lifecycle Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Autonomous performance tracking, real-time attendance telemetry, and academic lifecycle monitoring for RVCE.
            </p>
          </div>

          {/* Export Ribbon & Bulk Ingestion */}
          <ExportTools />
        </div>

        {/* Intelligence Bento Grid Aggregations */}
        <BentoStats />

        {/* Multi-Dimensional Filter Ribbon */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6 border border-white/[0.08]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Filter Group: Branch, Semester, Status, CGPA */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Branch Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-semibold">Dept:</span>
                <select
                  value={filters.branch}
                  onChange={(e) => setFilter('branch', e.target.value)}
                  className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {branchOptions.map((b) => (
                    <option key={b} value={b} className="bg-slate-900 text-slate-200">
                      {b === 'ALL' ? 'All Departments' : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-semibold">Sem:</span>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilter('semester', e.target.value)}
                  className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-slate-200">
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-semibold">Status:</span>
                <select
                  value={filters.status}
                  onChange={(e) => setFilter('status', e.target.value)}
                  className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="Active">Active</option>
                  <option value="At-Risk">At-Risk</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              {/* CGPA Range Filter */}
              <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400 font-semibold px-2">CGPA:</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="Min"
                  value={filters.minCgpa}
                  onChange={(e) => setFilter('minCgpa', e.target.value)}
                  className="w-16 bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 text-center"
                />
                <span className="text-slate-500 text-xs">-</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="Max"
                  value={filters.maxCgpa}
                  onChange={(e) => setFilter('maxCgpa', e.target.value)}
                  className="w-16 bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 text-center"
                />
              </div>

              {/* Trash View Switch */}
              <button
                type="button"
                onClick={() => setFilter('includeDeleted', filters.includeDeleted === 'only' ? 'false' : 'only')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  filters.includeDeleted === 'only'
                    ? 'bg-rose-600/20 text-rose-300 border-rose-500/40 shadow-glow-rose'
                    : 'bg-slate-900/80 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
                title="View soft deleted students in trash"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{filters.includeDeleted === 'only' ? 'Viewing Trash' : 'Trash'}</span>
              </button>

            </div>

            {/* Filter Reset Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors self-start lg:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

          </div>

          {/* Mobile Search input */}
          <div className="mt-3 pt-3 border-t border-white/5 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search USN, Name, or Branch..."
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>
        </div>

        {/* View Layout: Table View OR Cards Grid View */}
        {viewMode === 'table' ? (
          <StudentTable />
        ) : (
          <div>
            {loading && students.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm">Loading students in grid view...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="py-20 text-center glass-card rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-base font-semibold text-white mb-1">No matching profiles found</p>
                <p className="text-xs text-slate-400">Try loosening your filter parameters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                  {students.map((student) => (
                    <StudentCard key={student._id} student={student} />
                  ))}
                </div>

                {/* Grid Pagination Footer */}
                <div className="glass-card rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Showing {students.length} of {pagination.totalCount} students
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setFilter('page', pagination.currentPage - 1)}
                      className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>
                      {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setFilter('page', pagination.currentPage + 1)}
                      className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* Global Footer with MongoDB Compass URI & Institutional Info */}
      <footer className="mt-16 border-t border-white/[0.08] glass-panel py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200">
              R.V. College of Engineering &bull; Mysore Road, Bengaluru
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Autonomous Institution affiliated to VTU</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-white/5 font-mono text-[11px] text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compass: {dbHealth.compassUri}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-over Registration & Edit Drawer */}
      <StudentDrawer />

      {/* Student Detail Modal */}
      <StudentDetailModal />

      {/* Delete Confirmation Modal */}
      <DeleteModal />

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Interactive Toast Notifications */}
      <Toast />

    </div>
  );
}
