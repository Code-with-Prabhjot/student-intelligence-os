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
      mentor: "Dr. B. S. Shylaja",
      githubUsername: "harish-murthy",
      leetcodeHandle: "harish_code",
      portfolioUrl: "https://harishmurthy.dev"
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
      if (res && res.success) {
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
          title="Download as CSV spreadsheet formatted for VTU reporting"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          onClick={() => exportData('json')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
          title="Export all database records as JSON payload"
        >
          <FileJson className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Export JSON</span>
        </button>

        <button
          type="button"
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all shadow-xs"
          title="Bulk Import Student Records (1RV & 1RZ formats supported)"
        >
          <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
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

          <div className="relative glass-card bg-white dark:bg-slate-950/95 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl z-10 animate-scale-in">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Bulk Student Ingestion Portal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Import or batch update multiple RVCE profiles (1RV and 1RZ prefixes supported)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  JSON Records Array
                </label>
                <button
                  type="button"
                  onClick={loadSampleTemplate}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold flex items-center gap-1"
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
    "usn": "1RV25AI001",
    "name": "Sneha Joshi",
    "email": "sneha.aiml25@rvce.edu.in",
    "branch": "AIML",
    "semester": 1,
    "cgpa": 9.29,
    "attendance": 74,
    "skills": ["Python", "PyTorch"]
  }
]'
                className="w-full p-3.5 rounded-xl font-mono text-xs text-slate-800 dark:text-blue-200 leading-relaxed bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              ></textarea>

              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-glow-blue transition-all"
                >
                  {importing ? 'Processing Ingestion...' : 'Ingest Student Batch'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
