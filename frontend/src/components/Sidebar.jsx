import React, { useState } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  ShieldAlert,
  FileDown,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Sun,
  Moon,
  Activity,
  BookOpen,
  Award,
  Bell,
  Briefcase,
  Globe,
  Calculator,
  X
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import VtuEstimator from './VtuEstimator';

const NAV = [
  {
    group: 'Main',
    items: [
      { id: 'directory', label: 'Student Directory', icon: Users },
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Students',
    items: [
      { id: 'enroll', label: 'Enroll Student', icon: UserPlus },
      { id: 'records', label: 'Academic Records', icon: BookOpen },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'placement', label: 'Placement Radar', icon: Briefcase },
      { id: 'radar', label: 'Risk Radar', icon: ShieldAlert },
      { id: 'performers', label: 'Top Performers', icon: Award },
      { id: 'vtu', label: 'VTU Estimator', icon: Calculator, badge: 'VTU §4.0' },
    ],
  },
  {
    group: 'System',
    items: [
      { id: 'portal', label: 'Showcase Portal', icon: Globe },
      { id: 'export', label: 'Export Data', icon: FileDown },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ activeTab, setActiveTab, setViewState }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showVtuModal, setShowVtuModal] = useState(false);
  const { dbHealth, theme, toggleTheme, openCreateDrawer } = useStudentContext();

  return (
    <>
      <aside
        className={`sidebar-surface relative flex-shrink-0 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-white/[0.06] ${
          collapsed ? 'w-[68px]' : 'w-[220px]'
        }`}
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* ── Logo ── */}
        <div 
          onClick={() => setViewState && setViewState('landing')}
          className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-white/[0.06] cursor-pointer group"
          title="View Interactive Showcase Portal"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-glow-blue group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight tracking-tight">RVCE</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Student IQ</p>
            </div>
          )}
        </div>

        {/* ── Nav Groups ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
          {NAV.map(({ group, items }) => (
            <div key={group}>
              {!collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2 mb-1.5">
                  {group}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(({ id, label, icon: Icon, badge }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        if (id === 'enroll') { openCreateDrawer(); return; }
                        if (id === 'vtu') { setShowVtuModal(true); return; }
                        if (id === 'portal') { if (setViewState) setViewState('landing'); return; }
                        setActiveTab(id);
                      }}
                      title={collapsed ? (badge ? `${label} (${badge})` : label) : undefined}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 group relative ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.05]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
                      )}
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                      }`} />
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate text-[13px]">{label}</span>
                          {badge && (
                            <span className="ml-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex-shrink-0">
                              {badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer: DB Status + Theme ── */}
        <div className="border-t border-slate-200 dark:border-white/[0.06] px-2 py-3 space-y-1.5">
          {/* DB dot */}
          <div className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`} title="MongoDB Status">
            <span className="relative flex-shrink-0">
              <span className={`w-2 h-2 rounded-full block ${dbHealth.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {dbHealth.connected && (
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
              )}
            </span>
            {!collapsed && (
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold truncate">
                {dbHealth.connected ? 'Compass Live' : 'In-Memory DB'}
              </span>
            )}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-[13px] font-medium ${collapsed ? 'justify-center' : ''}`}
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 flex-shrink-0 text-amber-400" />
              : <Moon className="w-4 h-4 flex-shrink-0 text-blue-600" />
            }
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* ── Collapse Toggle ── */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-collapse-btn absolute -right-3.5 top-[72px] w-7 h-7 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-md z-10"
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft className="w-3.5 h-3.5" />
          }
        </button>
      </aside>

      {/* Fix 4: Standalone VTU Estimator Modal Triggered Cleanly from Sidebar */}
      {showVtuModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            onClick={() => setShowVtuModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          ></div>
          <div className="relative glass-card bg-white dark:bg-slate-950/95 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl z-10 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    VTU Estimator &bull; SGPA to % &amp; Target Simulator
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    RVCE Autonomous Academic Regulations &sect; 4.0
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVtuModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <VtuEstimator defaultCgpa={8.5} defaultSem={4} />
          </div>
        </div>
      )}
    </>
  );
}
