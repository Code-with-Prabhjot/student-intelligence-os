import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  FileSpreadsheet, 
  FileJson, 
  Database, 
  AlertTriangle, 
  LayoutGrid, 
  TableProperties, 
  X, 
  Sparkles, 
  GraduationCap 
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    openCreateDrawer,
    setFilter,
    exportData,
    dbHealth,
    showToast,
    viewMode,
    setViewMode,
    students,
    openDetailModal,
  } = useStudentContext();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickActions = [
    {
      id: 'enroll',
      title: 'Enroll New Student',
      subtitle: 'Open student registration drawer',
      icon: UserPlus,
      action: () => openCreateDrawer(),
    },
    {
      id: 'risk',
      title: 'Filter: Critical Attendance Risk (<75%)',
      subtitle: 'Identify students at risk of semester detention',
      icon: AlertTriangle,
      action: () => setFilter('attendanceRisk', 'true'),
    },
    {
      id: 'export-csv',
      title: 'Export Student Roster to CSV',
      subtitle: 'Download spreadsheet compatible with Excel/Sheets',
      icon: FileSpreadsheet,
      action: () => exportData('csv'),
    },
    {
      id: 'export-json',
      title: 'Export Database Collection to JSON',
      subtitle: 'Complete JSON data dump',
      icon: FileJson,
      action: () => exportData('json'),
    },
    {
      id: 'copy-compass',
      title: 'Copy MongoDB Compass URI',
      subtitle: dbHealth.compassUri,
      icon: Database,
      action: () => {
        navigator.clipboard.writeText(dbHealth.compassUri);
        showToast('Compass URI copied to clipboard!', 'info');
      },
    },
    {
      id: 'toggle-view',
      title: `Switch View: ${viewMode === 'table' ? 'Grid Cards' : 'Table'}`,
      subtitle: 'Change interface presentation layout',
      icon: viewMode === 'table' ? LayoutGrid : TableProperties,
      action: () => setViewMode(viewMode === 'table' ? 'cards' : 'table'),
    },
  ];

  const filteredActions = quickActions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const matchedStudents = students
    .filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.usn.toLowerCase().includes(query.toLowerCase()) ||
      s.branch.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 px-4">
      <div 
        onClick={() => setIsCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      ></div>

      <div className="relative glass-card bg-slate-950/95 rounded-2xl max-w-xl w-full border border-white/10 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or student name..."
            className="w-full bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none font-medium"
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-white/10 font-mono">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          
          {query.trim() && matchedStudents.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
                Matching Student Records
              </span>
              {matchedStudents.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    openDetailModal(s);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                      alt={s.name}
                      className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-blue-300 block">
                        {s.name}
                      </span>
                      <span className="text-[11px] font-mono text-blue-400">
                        {s.usn} &bull; {s.branch}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400">
                    {s.cgpa.toFixed(2)} CGPA
                  </span>
                </button>
              ))}
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
              Commands & Quick Actions
            </span>
            {filteredActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-800/80 flex items-center gap-3 text-left transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-white group-hover:text-blue-200 truncate">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer tip */}
        <div className="p-3 border-t border-white/5 bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press <kbd className="px-1 rounded bg-slate-800 text-slate-400">Ctrl</kbd> + <kbd className="px-1 rounded bg-slate-800 text-slate-400">K</kbd> anywhere</span>
          <span>RVCE Academic Console</span>
        </div>

      </div>
    </div>
  );
}
