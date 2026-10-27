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
  Globe
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

const NAV = [
  {
    group: 'Main',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Students',
    items: [
      { id: 'directory', label: 'Directory', icon: Users },
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

export default function Sidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const { dbHealth, theme, toggleTheme, openCreateDrawer } = useStudentContext();

  return (
    <aside
      className={`sidebar-surface relative flex-shrink-0 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out border-r border-white/[0.06] ${collapsed ? 'w-[68px]' : 'w-[220px]'
        }`}
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-glow-blue">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-extrabold text-sm text-white leading-tight tracking-tight">RVCE</p>
            <p className="text-[10px] text-slate-400 font-medium">Student IQ</p>
          </div>
        )}
      </div>

      {/* ── Nav Groups ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-1.5">
                {group}
              </p>
            )}
            <div className="space-y-0.5">
              {items.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (id === 'enroll') { openCreateDrawer(); return; }
                      setActiveTab(id);
                    }}
                    title={collapsed ? label : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 group relative ${isActive
                        ? 'bg-blue-600/15 text-blue-600 border border-blue-500/20'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/[0.05] border border-transparent dark:text-slate-400 dark:hover:text-white'
                      }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />
                    )}
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    {!collapsed && (
                      <span className="truncate text-[13px]">{label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer: DB Status + Theme ── */}
      <div className="border-t border-white/[0.06] px-2 py-3 space-y-1.5">
        {/* DB dot */}
        <div className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`} title="MongoDB Status">
          <span className="relative flex-shrink-0">
            <span className={`w-2 h-2 rounded-full block ${dbHealth.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {dbHealth.connected && (
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            )}
          </span>
          {!collapsed && (
            <span className="text-[11px] text-slate-400 font-medium truncate">
              {dbHealth.connected ? 'Atlas Connected' : 'Connecting…'}
            </span>
          )}
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-[13px] ${collapsed ? 'justify-center' : ''}`}
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4 flex-shrink-0 text-amber-400" />
            : <Moon className="w-4 h-4 flex-shrink-0 text-blue-400" />
          }
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="sidebar-collapse-btn absolute -right-3.5 top-[72px] w-7 h-7 rounded-full border flex items-center justify-center transition-all shadow-lg z-10"
      >
        {collapsed
          ? <ChevronRight className="w-3.5 h-3.5" />
          : <ChevronLeft className="w-3.5 h-3.5" />
        }
      </button>
    </aside>
  );
}
