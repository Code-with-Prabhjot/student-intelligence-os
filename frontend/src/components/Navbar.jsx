import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Command, 
  Database, 
  RefreshCw, 
  LayoutGrid, 
  TableProperties, 
  Check, 
  Copy, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function Navbar({ viewState = 'app', setViewState, activeTab = 'directory', setActiveTab }) {
  const { 
    searchTerm, 
    setSearchTerm, 
    dbHealth, 
    checkDbHealth, 
    fetchAnalytics, 
    fetchStudents, 
    viewMode, 
    setViewMode,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    showToast,
    theme,
    toggleTheme
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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#090d16]/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Fix 2: Interactive Brand Logo & College Identity (Home / Showcase Redirect) */}
        <div 
          onClick={() => setViewState && setViewState('landing')}
          className="flex items-center gap-3.5 flex-shrink-0 cursor-pointer group transition-transform hover:scale-[1.02] active:scale-95"
          title="Click to return to Showcase Portal"
        >
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-glow-blue transition-transform duration-300 group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#090d16] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white font-sans">
                RVCE <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">STUDENT IQ</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                Showcase Portal ↗
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Academic Lifecycle &bull; <span className="text-blue-600 dark:text-blue-400 font-semibold">Click to return to Showcase</span>
            </p>
          </div>
        </div>

        {/* Fix 3: Expanded Real-time Search Bar with Ctrl+K Trigger (No redundant centered tabs) */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by USN (1RV23..., 1RZ25...), Name, Branch, or Skills... (Ctrl + K)"
              className="w-full pl-10 pr-20 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xs transition-all"
            />
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="absolute right-2 px-1.5 py-0.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-0.5 transition-colors"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </button>
          </div>
        </div>

        {/* Actions & Utilities (VTU Calc and Duplicate Enroll removed) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* View Mode Toggle (Only when in Management OS) */}
          {viewState === 'app' && (
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Table View"
              >
                <TableProperties className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* MongoDB Compass Connection Badge with Dropdown Info */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDbInfo(!showDbInfo)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:border-blue-500/40 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all shadow-xs"
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
              <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden xs:inline" />
              <span className="font-mono text-[11px] hidden sm:inline">
                {dbHealth.connected ? 'Compass Live' : 'In-Memory DB'}
              </span>
            </button>

            {/* DB Status Popover */}
            {showDbInfo && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card bg-white dark:bg-slate-950/95 p-4 shadow-2xl z-50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white animate-scale-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider">
                        Database Architecture
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {dbHealth.connected ? 'MongoDB Compass Live' : 'High-Resilience In-Memory Hub'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    {dbHealth.status || 'Active'}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-1 font-medium">
                      MongoDB Compass Connection URI:
                    </span>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-blue-700 dark:text-blue-300 break-all select-all">
                      <span>{dbHealth.compassUri}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={copyCompassUri}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied URI' : 'Copy for Compass'}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 italic mt-1 text-center">
                    Paste directly into MongoDB Compass to inspect collections and documents.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={refreshAll}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
            title="Refresh Data & Aggregations"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
}
