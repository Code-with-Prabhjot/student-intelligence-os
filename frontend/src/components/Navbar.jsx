import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Command, 
  Database, 
  Plus, 
  RefreshCw, 
  LayoutGrid, 
  TableProperties, 
  Check, 
  Copy, 
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function Navbar() {
  const { 
    searchTerm, 
    setSearchTerm, 
    dbHealth, 
    checkDbHealth, 
    fetchAnalytics, 
    fetchStudents, 
    openCreateDrawer, 
    viewMode, 
    setViewMode,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    showToast
  } = useStudentContext();

  const [copied, setCopied] = useState(false);
  const [showDbInfo, setShowDbInfo] = useState(false);

  const copyCompassUri = () => {
    navigator.clipboard.writeText(dbHealth.compassUri);
    setCopied(true);
    showToast('Compass URI copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const refreshAll = () => {
    fetchStudents();
    fetchAnalytics();
    checkDbHealth();
    showToast('Dashboard metrics refreshed', 'info');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/[0.08] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & College Identity */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#090d16] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                  RVCE <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">STUDENT IQ</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v2.4 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Academic Lifecycle & Intelligence Management
              </p>
            </div>
          </div>

          {/* Real-time Search with Ctrl+K trigger */}
          <div className="flex-1 max-w-lg mx-2 hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by USN (1RV23...), Name, Branch, or Skill..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl glass-input text-sm text-slate-200 placeholder:text-slate-400/70"
              />
              <button
                type="button"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="absolute right-2 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1 transition-colors"
                title="Open Command Palette"
              >
                <Command className="w-3 h-3" />
                <span>K</span>
              </button>
            </div>
          </div>

          {/* Actions & DB Connection Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <TableProperties className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* MongoDB Compass Connection Badge with Dropdown Info */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDbInfo(!showDbInfo)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-blue-500/40 text-xs font-medium transition-all"
                title="MongoDB Compass Connection"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      dbHealth.connected ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      dbHealth.connected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  ></span>
                </span>
                <Database className="w-3.5 h-3.5 text-slate-400 hidden xs:inline" />
                <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
                  {dbHealth.connected ? 'MongoDB Live' : 'Connecting'}
                </span>
              </button>

              {/* DB Status Popover */}
              {showDbInfo && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card p-4 shadow-2xl z-50 border border-white/10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Database Architecture
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {dbHealth.connected ? 'Connected to MongoDB' : 'Connecting or In-Memory'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {dbHealth.status || 'Active'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] mb-1 font-medium">
                        MongoDB Compass Connection URI:
                      </span>
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-blue-300 break-all select-all">
                        <span>{dbHealth.compassUri}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={copyCompassUri}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied URI' : 'Copy for Compass'}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 italic mt-1 text-center">
                      Paste directly into MongoDB Compass to inspect collections and documents.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={refreshAll}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Refresh Data & Aggregations"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Add Student Primary CTA */}
            <button
              type="button"
              onClick={openCreateDrawer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-glow-blue transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
