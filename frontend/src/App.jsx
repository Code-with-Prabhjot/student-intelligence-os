import React, { useState } from 'react';
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
import AttendanceRiskRadar from './components/AttendanceRiskRadar';
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
  Search,
  Users,
  BarChart3,
  ShieldAlert,
  ChevronDown,
  X
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

  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'analytics' | 'radar'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const isFiltered = 
    filters.branch !== 'ALL' ||
    filters.semester !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.minCgpa !== '' ||
    filters.maxCgpa !== '' ||
    filters.attendanceRisk !== '' ||
    filters.includeDeleted === 'only' ||
    searchTerm.trim() !== '';

  const criticalCount = students.filter((s) => s.attendance < 75).length;

  // Preset pill click handler
  const handlePreset = (preset) => {
    resetFilters();
    if (preset === 'critical') {
      setFilter('attendanceRisk', 'critical');
    } else if (preset === 'distinction') {
      setFilter('minCgpa', '9.0');
    } else if (preset === 'warning') {
      setFilter('attendanceRisk', 'warning');
    } else if (preset === 'final') {
      setFilter('semester', '7');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500/20">
      
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Institutional Header & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                RVCE Academic Registry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Student Intelligence & Lifecycle Hub
            </h1>
          </div>

          {/* Quick Actions & Export */}
          <ExportTools />
        </div>

        {/* Lightweight Modern Tab Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 mb-6 pb-2 overflow-x-auto gap-4">
          <div className="flex items-center gap-2">
            
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Directory</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'directory' ? 'bg-blue-800 text-blue-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {pagination.totalCount || students.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'radar'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Attendance & Risk Radar</span>
              {criticalCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                  {criticalCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Institutional Analytics</span>
            </button>

          </div>
        </div>

        {/* TAB 1: STUDENT DIRECTORY (De-cluttered & streamlined) */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            
            {/* Quick Filter Ribbon & Search Bar */}
            <div className="glass-card rounded-2xl p-3 sm:p-4 border border-white/10 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                {/* Fast Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold mr-1 hidden sm:inline">Presets:</span>
                  
                  <button
                    type="button"
                    onClick={() => resetFilters()}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                      !isFiltered
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreset('critical')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                      filters.attendanceRisk === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    Critical (&lt;75%)
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreset('distinction')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                      filters.minCgpa === '9.0'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    Dean's List (≥ 9.0)
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreset('warning')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                      filters.attendanceRisk === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    Warning (75-84%)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilter('includeDeleted', filters.includeDeleted === 'only' ? 'false' : 'only')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
                      filters.includeDeleted === 'only'
                        ? 'bg-rose-600/30 text-rose-200 border border-rose-500/50'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Trash</span>
                  </button>
                </div>

                {/* Right controls: Advanced Filter Toggle & Reset */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      showAdvancedFilters || isFiltered
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                        : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Advanced Filters</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </button>

                  {isFiltered && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Reset all filters"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

              {/* Collapsible Advanced Filters Drawer */}
              {showAdvancedFilters && (
                <div className="pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
                  {/* Branch */}
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Department</label>
                    <select
                      value={filters.branch}
                      onChange={(e) => setFilter('branch', e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {branchOptions.map((b) => (
                        <option key={b} value={b} className="bg-slate-900">
                          {b === 'ALL' ? 'All Departments' : b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Semester</label>
                    <select
                      value={filters.semester}
                      onChange={(e) => setFilter('semester', e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">All Semesters</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s} className="bg-slate-900">
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilter('status', e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">All Status</option>
                      <option value="Active">Active</option>
                      <option value="At-Risk">At-Risk</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>

                  {/* CGPA Min/Max */}
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">CGPA Range</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="Min"
                        value={filters.minCgpa}
                        onChange={(e) => setFilter('minCgpa', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-center"
                      />
                      <span className="text-slate-500">-</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="Max"
                        value={filters.maxCgpa}
                        onChange={(e) => setFilter('maxCgpa', e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 text-center"
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* View Layout: Table View OR Cards Grid View */}
            {viewMode === 'table' ? (
              <StudentTable />
            ) : (
              <div>
                {students.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center border border-white/5">
                    <p className="text-slate-400 text-sm">No student records match the active criteria.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {students.map((student) => (
                        <StudentCard key={student._id} student={student} />
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6 text-xs text-slate-400">
                      <span>Showing {students.length} of {pagination.totalCount} entries</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!pagination.hasPrevPage}
                          onClick={() => setFilter('page', pagination.currentPage - 1)}
                          className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-40"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span>{pagination.currentPage} / {pagination.totalPages}</span>
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

          </div>
        )}

        {/* TAB 2: ATTENDANCE & RISK RADAR */}
        {activeTab === 'radar' && (
          <AttendanceRiskRadar />
        )}

        {/* TAB 3: INSTITUTIONAL ANALYTICS */}
        {activeTab === 'analytics' && (
          <BentoStats />
        )}

      </main>

      {/* Global Clean Academic Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-white/[0.08] glass-panel py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-300">
              R.V. College of Engineering (RVCE)
            </span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span>Autonomous Institution Affiliated to VTU, Belagavi</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>MongoDB Atlas Connected &bull; <strong className="font-mono text-slate-900 dark:text-white">rvce_student_db</strong></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-over Registration & Edit Drawer */}
      <StudentDrawer />

      {/* Student Detail Modal with Proctoring & Calculator */}
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
