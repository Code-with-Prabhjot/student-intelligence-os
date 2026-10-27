import React, { useState, useMemo } from 'react';
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
import PlacementRadar from './components/PlacementRadar';
import NetworkCanvas from './components/NetworkCanvas';
import LandingPage from './components/LandingPage';
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
  X,
  Briefcase,
  Github,
  Zap
} from 'lucide-react';

const branchOptions = [
  'ALL', 'CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 
  'CIVIL', 'BIOTECH', 'CHEMICAL', 'AEROSPACE', 'ETE', 'IEM'
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
  { id: 'OTHERS', label: 'Others' },
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

  const [pageView, setPageView] = useState('app'); // 'app' | 'portal'
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'radar' | 'placement' | 'analytics'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { analytics } = useStudentContext();

  const isFiltered = 
    filters.branch !== 'ALL' ||
    filters.academicYear !== 'ALL' ||
    filters.semester !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.minCgpa !== '' ||
    filters.maxCgpa !== '' ||
    filters.attendanceRisk !== '' ||
    filters.includeDeleted === 'only' ||
    searchTerm.trim() !== '';

  const yearCounts = useMemo(() => {
    if (analytics?.semesterStats) {
      const getSum = (sems) => 
        analytics.semesterStats
          .filter((s) => sems.includes(s._id))
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

  const criticalCount = students.filter((s) => s.attendance < 75).length;
  const placementCount = students.filter((s) => s.cgpa >= 8.5 && s.githubUsername).length;

  // Preset chip click handler
  const handlePreset = (preset) => {
    resetFilters();
    if (preset === 'critical') {
      setFilter('attendanceRisk', 'critical');
    } else if (preset === 'distinction') {
      setFilter('minCgpa', '9.0');
    } else if (preset === 'warning') {
      setFilter('attendanceRisk', 'warning');
    } else if (preset === 'tier1') {
      setFilter('minCgpa', '8.5');
    }
  };

  if (pageView === 'portal') {
    return (
      <div className="min-h-screen">
        <LandingPage onLaunchApp={() => setPageView('app')} />
        <StudentDrawer />
        <StudentDetailModal />
        <DeleteModal />
        <CommandPalette />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500/20">
      
      {/* Top Sticky Navigation */}
      <Navbar pageView={pageView} setPageView={setPageView} />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Executive Hero Banner with Embedded 3D Interactive Particle Canvas */}
        <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-8 mb-6 border border-white/[0.08] shadow-2xl">
          {/* 3D Network Canvas Particle Mesh Background */}
          <NetworkCanvas className="pointer-events-none opacity-40" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-blue-400">
                  RVCE Autonomous Academic Registry &bull; Bengaluru
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Autonomous 2024
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Student Intelligence <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">&amp; Lifecycle OS</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 max-w-2xl leading-relaxed">
                Executive analytics cockpit powering VTU attendance risk forecasting, RVCE CIE exam clearance simulations, and Tier-1 open-source placement readiness telemetry.
              </p>
            </div>

            {/* Quick Actions & Export */}
            <div className="relative z-10 flex-shrink-0">
              <ExportTools />
            </div>
          </div>
        </div>

        {/* Lightweight Modern Tab Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 mb-6 pb-2 overflow-x-auto gap-4">
          <div className="flex items-center gap-2">
            
            {/* Tab 1: Student Directory */}
            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Directory</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'directory' ? 'bg-blue-800 text-blue-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {pagination.totalCount || students.length}
              </span>
            </button>

            {/* Tab 2: Attendance Risk Radar (Module A) */}
            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'radar'
                  ? 'bg-rose-600 text-white shadow-glow-rose'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>CIE &amp; Attendance Risk Radar</span>
              {criticalCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold animate-pulse">
                  {criticalCount}
                </span>
              )}
            </button>

            {/* Tab 3: Placement Radar (Module B) */}
            <button
              type="button"
              onClick={() => setActiveTab('placement')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'placement'
                  ? 'bg-purple-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Tier-1 Placement Radar</span>
              {placementCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white font-bold">
                  {placementCount}
                </span>
              )}
            </button>

            {/* Tab 4: Institutional Analytics */}
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Institutional Analytics</span>
            </button>

          </div>
        </div>

        {/* TAB 1: STUDENT DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            
            {/* Two-Tier Navigation Hub (Academic Year & Branch Ribbons) */}
            <div className="space-y-3 glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-lg">
              
              {/* Tier 1: Academic Year Selector (Pill Bar) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    Tier 1 &bull; Academic Year &amp; Batch
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
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
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-glow-blue scale-[1.02]'
                            : 'bg-slate-100 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5'
                        }`}
                      >
                        <span>{yr.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                          isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
                    <Filter className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    Tier 2 &bull; Branch / Engineering Department
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {filters.branch === 'ALL' ? 'All Departments' : filters.branch}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {tier2BranchTabs.map((br) => {
                    const isSelected = filters.branch === br.id;
                    return (
                      <button
                        key={br.id}
                        type="button"
                        onClick={() => setFilter('branch', br.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-glow-indigo'
                            : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5'
                        }`}
                      >
                        {br.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
            
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
                    onClick={() => handlePreset('tier1')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                      filters.minCgpa === '8.5'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    Tier-1 Cutoff (&ge; 8.5)
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
                    Dean's List (&ge; 9.0)
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

        {/* TAB 2: ATTENDANCE & RISK RADAR (Module A) */}
        {activeTab === 'radar' && (
          <AttendanceRiskRadar />
        )}

        {/* TAB 3: PLACEMENT RADAR (Module B) */}
        {activeTab === 'placement' && (
          <PlacementRadar />
        )}

        {/* TAB 4: INSTITUTIONAL ANALYTICS */}
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

      {/* Student Detail Modal with Dossier & Calculator */}
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
