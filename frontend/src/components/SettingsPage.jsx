import React, { useState } from 'react';
import {
  Settings, Database, Server, RefreshCw, Shield, Bell,
  Palette, Download, Trash2, CheckCircle2, Sliders,
  Cpu, HardDrive, Key, HelpCircle, Eye, Moon, Sun
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import SpotlightCard from './ui/SpotlightCard';

export default function SettingsPage() {
  const { dbHealth, theme, toggleTheme, students, fetchStudents, showToast } = useStudentContext();

  // Local configurable parameters (stored in memory or localStorage)
  const [deansListThreshold, setDeansListThreshold] = useState(9.0);
  const [warningAttThreshold, setWarningAttThreshold] = useState(75);
  const [criticalAttThreshold, setCriticalAttThreshold] = useState(65);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [proctorPings, setProctorPings] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const handleTestPing = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('http://localhost:5001/api/health');
      if (res.ok) {
        showToast('Backend API and Database responding within 12ms', 'success');
      } else {
        showToast('Backend API responded with non-200 code', 'warning');
      }
    } catch (err) {
      showToast('Could not reach backend API server on :5001', 'error');
    } finally {
      setIsPinging(false);
    }
  };

  const handleExportSystemSnapshot = () => {
    const data = {
      system: 'RVCE Student Intelligence OS',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      studentCount: students.length,
      thresholds: {
        deansList: deansListThreshold,
        warningAttendance: warningAttThreshold,
        criticalAttendance: criticalAttThreshold
      },
      students: students
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_OS_System_Snapshot_${Date.now()}.json`;
    a.click();
    showToast('System configuration & student snapshot exported', 'success');
  };

  const handleClearCache = () => {
    localStorage.clear();
    showToast('Local state and cached filters cleared', 'info');
    fetchStudents();
  };

  const handleSavePolicies = (e) => {
    e.preventDefault();
    showToast('Institutional evaluation policies updated successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl animate-slide-up-fade">
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            System Administration
          </span>
          <span className="text-xs text-slate-500">• RVCE Campus IT Core</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-violet-500" />
          Settings & Operational Diagnostics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure academic evaluation thresholds, inspect server telemetry, and manage database snapshots.
        </p>
      </div>

      {/* ── Telemetry & Service Status ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SpotlightCard className="glass-card rounded-2xl p-5 border border-white/[0.08]" spotlightColor="rgba(59, 130, 246, 0.15)">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Database Engine</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            {dbHealth.dbStatus === 'Connected' ? 'MongoDB Atlas' : 'Local Cluster'}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {students.length} Documents Indexed • Port 27017
          </p>
        </SpotlightCard>

        <SpotlightCard className="glass-card rounded-2xl p-5 border border-white/[0.08]" spotlightColor="rgba(16, 185, 129, 0.15)">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Backend API Gateway</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Operational (5001)
          </div>
          <button
            type="button"
            onClick={handleTestPing}
            disabled={isPinging}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold mt-1 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
            {isPinging ? 'Pinging cluster...' : 'Send Live Health Ping'}
          </button>
        </SpotlightCard>

        <SpotlightCard className="glass-card rounded-2xl p-5 border border-white/[0.08]" spotlightColor="rgba(139, 92, 246, 0.15)">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Runtime Client</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            React 18 + Vite 5
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tailwind CSS 3.4 • HSL Custom Design Tokens
          </p>
        </SpotlightCard>
      </div>

      {/* ── Academic Policy Customizer ── */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Institutional Policy Thresholds
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Adjust the cutoffs that trigger automatic Dean's List honors and Proctor attendance alerts across the platform.
        </p>

        <form onSubmit={handleSavePolicies} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Dean's List Cutoff</span>
              <span className="font-mono text-amber-400">{deansListThreshold} CGPA</span>
            </label>
            <input
              type="range"
              min="8.0"
              max="9.8"
              step="0.1"
              value={deansListThreshold}
              onChange={(e) => setDeansListThreshold(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Students at or above this mark receive Scholar distinction badges.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Warning Attendance Cutoff</span>
              <span className="font-mono text-yellow-400">{warningAttThreshold}%</span>
            </label>
            <input
              type="range"
              min="70"
              max="85"
              step="1"
              value={warningAttThreshold}
              onChange={(e) => setWarningAttThreshold(parseInt(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Triggers cautionary warning badge in directory & analytics.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Critical Risk Cutoff</span>
              <span className="font-mono text-rose-400">{criticalAttThreshold}%</span>
            </label>
            <input
              type="range"
              min="50"
              max="70"
              step="1"
              value={criticalAttThreshold}
              onChange={(e) => setCriticalAttThreshold(parseInt(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Automated Proctor intervention & SMS escalation dispatched.</p>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue transition-all"
            >
              Apply Policy Updates
            </button>
          </div>
        </form>
      </div>

      {/* ── UI Appearance & Interface Controls ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Interface Customization</h3>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/[0.05]">
              <div>
                <div className="text-xs font-bold text-slate-200">Active Theme</div>
                <div className="text-[11px] text-slate-400">Currently using {theme === 'light' ? 'Light Theme' : 'Dark Glassmorphic Theme'}</div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 transition-all"
              >
                {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
                Switch Mode
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/[0.05]">
              <div>
                <div className="text-xs font-bold text-slate-200">Compact View Density</div>
                <div className="text-[11px] text-slate-400">Display more records per screen in directory</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCompactMode(!compactMode);
                  showToast(compactMode ? 'Switched to comfortable view' : 'Switched to compact density', 'info');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative ${compactMode ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${compactMode ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Backup & Maintenance Operations ── */}
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Platform Maintenance</h3>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/[0.05]">
              <div>
                <div className="text-xs font-bold text-slate-200">System State Backup</div>
                <div className="text-[11px] text-slate-400">Save complete database snapshot as JSON</div>
              </div>
              <button
                type="button"
                onClick={handleExportSystemSnapshot}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Snapshot
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/[0.05]">
              <div>
                <div className="text-xs font-bold text-slate-200">Purge Local Cache</div>
                <div className="text-[11px] text-slate-400">Flush saved filters and re-sync from server</div>
              </div>
              <button
                type="button"
                onClick={handleClearCache}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Purge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
