import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';

export default function VtuEstimator({ defaultCgpa = 8.5, defaultSem = 4, standalone = false }) {
  const [currentCgpa, setCurrentCgpa] = useState(defaultCgpa);
  const [completedSem, setCompletedSem] = useState(defaultSem);
  const [targetCgpa, setTargetCgpa] = useState(9.0);

  // Autonomous VTU Formula: Percentage = (SGPA/CGPA - 0.75) * 10
  const currentPercentage = useMemo(() => {
    const val = (Number(currentCgpa) - 0.75) * 10;
    return Math.max(0, Math.min(100, Number(val.toFixed(2))));
  }, [currentCgpa]);

  const targetPercentage = useMemo(() => {
    const val = (Number(targetCgpa) - 0.75) * 10;
    return Math.max(0, Math.min(100, Number(val.toFixed(2))));
  }, [targetCgpa]);

  // Target Estimator Logic across remaining semesters
  const simulation = useMemo(() => {
    const c = Math.max(1, Math.min(7, Number(completedSem)));
    const remaining = 8 - c;
    const cur = Math.max(0, Math.min(10, Number(currentCgpa)));
    const tgt = Math.max(0, Math.min(10, Number(targetCgpa)));

    // Total target points needed = tgt * 8
    // Current points earned = cur * c
    // Remaining points needed = (tgt * 8) - (cur * c)
    // Required average SGPA = remaining points / remaining
    const requiredSgpa = Number((((tgt * 8) - (cur * c)) / remaining).toFixed(2));
    const maxAchievableCgpa = Number((((cur * c) + (10.0 * remaining)) / 8).toFixed(2));
    const maxAchievablePercentage = Number(((maxAchievableCgpa - 0.75) * 10).toFixed(2));

    const isAchievable = requiredSgpa <= 10.0;
    const isAlreadyAchieved = cur >= tgt && tgt <= 10;

    return {
      completed: c,
      remaining,
      requiredSgpa,
      maxAchievableCgpa,
      maxAchievablePercentage,
      isAchievable,
      isAlreadyAchieved
    };
  }, [currentCgpa, completedSem, targetCgpa]);

  const quickTargets = [
    { label: "Dean's List (9.0)", val: 9.0 },
    { label: "Tier-1 Cutoff (8.5)", val: 8.5 },
    { label: "Distinction (7.75)", val: 7.75 },
    { label: "First Class (6.75)", val: 6.75 },
  ];

  return (
    <div className={`space-y-4 ${standalone ? 'p-6 glass-card rounded-3xl max-w-2xl mx-auto shadow-2xl' : ''}`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                VTU SGPA-to-Percentage &amp; Target Estimator
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                RVCE Autonomous
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Autonomous Formula: <code className="font-mono text-blue-600 dark:text-blue-300 font-semibold">% = (SGPA - 0.75) × 10</code>
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Current CGPA */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Current CGPA
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={currentCgpa}
              onChange={(e) => setCurrentCgpa(Number(e.target.value))}
              className="w-full text-xl font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
            = {currentPercentage}% VTU Equiv
          </span>
        </div>

        {/* Semesters Completed */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Completed Semesters
          </label>
          <select
            value={completedSem}
            onChange={(e) => setCompletedSem(Number(e.target.value))}
            className="w-full text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Semester {num} ({8 - num} sem remaining)
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            {simulation.remaining} semester(s) to graduate
          </span>
        </div>

        {/* Target CGPA */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Target CGPA
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.05"
              min="0"
              max="10"
              value={targetCgpa}
              onChange={(e) => setTargetCgpa(Number(e.target.value))}
              className="w-full text-xl font-extrabold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/15 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block">
            = {targetPercentage}% VTU Equiv
          </span>
        </div>
      </div>

      {/* Quick Target Presets Ribbon */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
          Quick Benchmarks:
        </span>
        {quickTargets.map((item) => (
          <button
            key={item.val}
            type="button"
            onClick={() => setTargetCgpa(item.val)}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              targetCgpa === item.val
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Dynamic Target Feasibility Telemetry Card */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          simulation.isAchievable
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-500/30 dark:text-emerald-200'
            : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-500/30 dark:text-rose-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {simulation.isAchievable ? (
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}

          <div className="space-y-1">
            <h5 className="font-bold text-sm sm:text-base">
              {simulation.isAchievable
                ? `Target Feasible: Need Minimum ${simulation.requiredSgpa.toFixed(2)} SGPA in each remaining semester`
                : `Target Mathematically Infeasible (Cap Exceeded: ${simulation.requiredSgpa.toFixed(2)} Required)`}
            </h5>

            <p className="text-xs leading-relaxed opacity-90">
              {simulation.isAchievable ? (
                <>
                  To graduate with a cumulative CGPA of <strong>{targetCgpa.toFixed(2)}</strong> (<strong>{targetPercentage}%</strong>), the student must secure an average SGPA of <strong>{simulation.requiredSgpa.toFixed(2)}</strong> across Semesters {simulation.completed + 1} through 8.
                </>
              ) : (
                <>
                  Even with a maximum possible <strong>10.00 SGPA</strong> in all remaining {simulation.remaining} semester(s), the highest possible cumulative CGPA attainable is <strong>{simulation.maxAchievableCgpa.toFixed(2)}</strong> (<strong>{simulation.maxAchievablePercentage}%</strong>).
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 font-bold">
                Completed: {simulation.completed} Sems
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 font-bold">
                Remaining: {simulation.remaining} Sems
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 font-bold">
                Maximum Reachable: {simulation.maxAchievableCgpa.toFixed(2)} CGPA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official VTU Grading Scale Table Reference */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 text-xs">
        <h6 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          Autonomous VTU Conversion Reference Matrix (Reg 18OB)
        </h6>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">10.0 SGPA</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">92.5% (Distinction)</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">9.0 SGPA</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">82.5% (Distinction)</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">8.5 SGPA</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">77.5% (Super Dream)</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">7.75 SGPA</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">70.0% (First Class)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
