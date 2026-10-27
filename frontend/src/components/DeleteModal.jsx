import React, { useState } from 'react';
import {
  AlertTriangle,
  Trash2,
  X,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function DeleteModal() {
  const { isDeleteModalOpen, deleteTarget, closeDeleteModal, deleteSingleStudent, bulkDelete } = useStudentContext();
  const [permanent, setPermanent] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isDeleteModalOpen || !deleteTarget) return null;

  const isBulk = deleteTarget.isBulk;
  const student = !isBulk ? deleteTarget.data : null;
  const count = isBulk ? deleteTarget.ids?.length : 1;

  const handleConfirm = async () => {
    setDeleting(true);
    if (isBulk) {
      await bulkDelete(deleteTarget.ids, permanent);
    } else {
      await deleteSingleStudent(student, permanent);
    }
    setDeleting(false);
    closeDeleteModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={closeDeleteModal}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative glass-card bg-slate-950/95 rounded-2xl max-w-md w-full p-6 border border-rose-500/30 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1">
              {isBulk ? `Delete ${count} Selected Records?` : `Remove ${student?.name}?`}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {!isBulk ? (
                <>
                  Are you sure you want to remove student <span className="font-semibold text-white">{student?.name}</span> (<span className="font-mono text-blue-400">{student?.usn}</span>)?
                </>
              ) : (
                `Are you sure you want to remove ${count} student records from the roster?`
              )}
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-400 mb-4 flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-emerald-300">Soft Recovery Enabled:</strong> Records can be restored anytime via the Trash filter or immediate undo toast.
              </span>
            </div>

            {/* Permanent Purge Checkbox */}
            <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer select-none mb-4 group">
              <input
                type="checkbox"
                checked={permanent}
                onChange={(e) => setPermanent(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500/20"
              />
              <span className="group-hover:text-slate-300 transition-colors">
                Permanently purge from MongoDB (Bypass soft trash)
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-glow-rose transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'Deleting...' : permanent ? 'Permanently Purge' : 'Move to Trash'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
