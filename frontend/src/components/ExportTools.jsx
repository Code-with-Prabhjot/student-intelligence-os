import React, { useState } from 'react';
import { 
  FileDown, 
  FileSpreadsheet, 
  FileJson, 
  UploadCloud, 
  Download, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function ExportTools() {
  const { exportData, isImportModalOpen, setIsImportModalOpen, bulkImport, showToast } = useStudentContext();
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);

  const sampleTemplate = [
    {
      usn: "1RV24CS099",
      name: "Harish Murthy",
      email: "harish.cs24@rvce.edu.in",
      branch: "CSE",
      semester: 2,
      cgpa: 8.95,
      attendance: 92,
      status: "Active",
      skills: ["Python", "Flask", "PostgreSQL", "C++"],
      section: "B",
      phone: "+91 98450 99881",
      mentor: "Dr. B. S. Shylaja"
    }
  ];

  const loadSampleTemplate = () => {
    setImportJsonText(JSON.stringify(sampleTemplate, null, 2));
    setImportError('');
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setImportError('');

    if (!importJsonText.trim()) {
      setImportError('Please provide a valid JSON array of students.');
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        setImportError('JSON root must be an array of student objects: [ { ... } ]');
        return;
      }
      setImporting(true);
      const res = await bulkImport(parsed);
      setImporting(false);
      if (res.success) {
        setImportJsonText('');
      }
    } catch (err) {
      setImportError('Invalid JSON format: ' + err.message);
      setImporting(false);
    }
  };

  return (
    <>
      {/* Quick Action Ribbon */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => exportData('csv')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          title="Download as CSV spreadsheet"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          onClick={() => exportData('json')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          title="Export all database records as JSON"
        >
          <FileJson className="w-4 h-4 text-blue-400" />
          <span>Export JSON</span>
        </button>

        <button
          type="button"
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          title="Bulk Import Student Records"
        >
          <UploadCloud className="w-4 h-4 text-indigo-400" />
          <span>Bulk Ingest</span>
        </button>
      </div>

      {/* Bulk Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsImportModalOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="relative glass-card bg-slate-950/95 rounded-2xl max-w-2xl w-full p-6 border border-white/10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Bulk Student Ingestion Portal
                  </h3>
                  <p className="text-xs text-slate-400">
                    Import or batch update multiple RVCE student profiles via JSON payload
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  JSON Records Array
                </label>
                <button
                  type="button"
                  onClick={loadSampleTemplate}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Insert Sample Schema</span>
                </button>
              </div>

              <textarea
                rows={9}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[
  {
    "usn": "1RV24CS001",
    "name": "Student Name",
    "email": "name.cs24@rvce.edu.in",
    "branch": "CSE",
    "semester": 2,
    "cgpa": 9.2,
    "attendance": 90,
    "skills": ["React", "Python"]
  }
]'
                className="w-full p-3.5 rounded-xl glass-input font-mono text-xs text-blue-200 leading-relaxed"
              ></textarea>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-violet transition-all disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{importing ? 'Processing Ingestion...' : 'Execute Batch Ingest'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
