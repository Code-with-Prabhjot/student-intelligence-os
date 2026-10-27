import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Calculator, 
  UserX, 
  ArrowRight, 
  Copy, 
  Check, 
  Mail, 
  FileText,
  Search,
  Sparkles,
  Percent
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function AttendanceRiskRadar() {
  const { students, openDetailModal, showToast } = useStudentContext();

  // Custom Calculator State
  const [calcAttended, setCalcAttended] = useState(38);
  const [calcTotal, setCalcTotal] = useState(55);
  const [targetPercent, setTargetPercent] = useState(75);
  const [copiedId, setCopiedId] = useState(null);
  const [radarFilter, setRadarFilter] = useState('critical'); // 'critical' (<75%), 'warning' (75-80%), 'all-risk'

  // Calculator Logic
  // Formula: (calcAttended + X) / (calcTotal + X) = target / 100
  // 100 * calcAttended + 100 * X = target * calcTotal + target * X
  // X * (100 - target) = target * calcTotal - 100 * calcAttended
  // X = (target * calcTotal - 100 * calcAttended) / (100 - target)
  const currentCalcPercent = calcTotal > 0 ? ((calcAttended / calcTotal) * 100).toFixed(1) : 0;
  
  const calculateConsecutiveClassesNeeded = (attended, total, target = 75) => {
    if (total <= 0) return 0;
    const current = (attended / total) * 100;
    if (current >= target) return 0;
    const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
    return Math.max(0, needed);
  };

  const calculateBunkBuffer = (attended, total, target = 75) => {
    if (total <= 0) return 0;
    const current = (attended / total) * 100;
    if (current < target) return 0;
    // attended / (total + Y) = target / 100 => Y = (100 * attended / target) - total
    const safeBunk = Math.floor((100 * attended) / target - total);
    return Math.max(0, safeBunk);
  };

  const classesNeeded = calculateConsecutiveClassesNeeded(calcAttended, calcTotal, targetPercent);
  const safeBunks = calculateBunkBuffer(calcAttended, calcTotal, targetPercent);

  // Filter students for the radar
  // Assume standard RVCE semester course total = 60 hours
  const STANDARD_COURSE_HOURS = 60;

  const atRiskStudents = students.filter((s) => {
    if (radarFilter === 'critical') return s.attendance < 75;
    if (radarFilter === 'warning') return s.attendance >= 75 && s.attendance < 85;
    return s.attendance < 85 || s.cgpa < 7.0;
  });

  const generateProctorAdvisory = (student) => {
    const attendedEst = Math.round((student.attendance / 100) * STANDARD_COURSE_HOURS);
    const needed = calculateConsecutiveClassesNeeded(attendedEst, STANDARD_COURSE_HOURS, 75);
    
    const text = `[RVCE PROCTORING ACADEMIC NOTICE]
To: ${student.name} (${student.usn})
Department: ${student.branch} (Semester ${student.semester}, Sec ${student.section || 'A'})
Faculty Mentor: ${student.mentor || 'Dr. Assigned Proctor'}
Current Attendance: ${student.attendance}% (Below VTU 75% mandatory threshold)
Deficit Status: Requires minimum ${needed} consecutive classes without absence to achieve 75% exam eligibility.
Action: Please report to your Proctor during advisory hours.`;

    navigator.clipboard.writeText(text);
    setCopiedId(student._id);
    showToast(`Advisory notice copied for ${student.name}`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive VTU Eligibility Calculator Card */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-5 border border-indigo-500/20 bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-950">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">VTU Attendance Engine</h3>
                <p className="text-[11px] text-slate-400">Eligibility & Bunk Margin Simulator</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              75% Rule
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Classes Attended</label>
                <input
                  type="number"
                  min="0"
                  max={calcTotal}
                  value={calcAttended}
                  onChange={(e) => setCalcAttended(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Total Classes Held</label>
                <input
                  type="number"
                  min="1"
                  value={calcTotal}
                  onChange={(e) => setCalcTotal(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Target Threshold:</span>
              <div className="flex items-center gap-1.5">
                {[75, 85].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTargetPercent(pct)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      targetPercent === pct
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Standing:</span>
                <span className={`font-mono font-bold text-sm ${
                  Number(currentCalcPercent) >= targetPercent ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {currentCalcPercent}%
                </span>
              </div>

              {Number(currentCalcPercent) < targetPercent ? (
                <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] leading-relaxed">
                    Must attend <strong className="text-white text-xs underline decoration-rose-500 underline-offset-2">{classesNeeded}</strong> consecutive classes without skipping to hit {targetPercent}%.
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] leading-relaxed">
                    Compliant! Safe to miss up to <strong className="text-white text-xs underline decoration-emerald-500 underline-offset-2">{safeBunks}</strong> classes before dropping below {targetPercent}%.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Radar Insights & Summary */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Autonomous Risk Detection</h3>
                  <p className="text-[11px] text-slate-400">RVCE Academic Regulation & Proctoring Policy</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setRadarFilter('critical')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    radarFilter === 'critical'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Critical (&lt;75%)
                </button>
                <button
                  type="button"
                  onClick={() => setRadarFilter('warning')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    radarFilter === 'warning'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Warning (75-84%)
                </button>
                <button
                  type="button"
                  onClick={() => setRadarFilter('all-risk')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    radarFilter === 'all-risk'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Interventions
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-rose-500/20">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Critical Barred Risk</span>
                <div className="text-2xl font-extrabold text-rose-400 mt-1">
                  {students.filter((s) => s.attendance < 75).length}
                </div>
                <span className="text-[10px] text-rose-300/70">Ineligible for Semester End Exam</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/20">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Cautionary Zone</span>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">
                  {students.filter((s) => s.attendance >= 75 && s.attendance < 85).length}
                </div>
                <span className="text-[10px] text-amber-300/70">Buffer &lt; 3 classes</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-blue-500/20">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Academic Probation (CGPA)</span>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">
                  {students.filter((s) => s.cgpa < 7.0).length}
                </div>
                <span className="text-[10px] text-blue-300/70">Requires Proctor Counselling</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Institutional policy flags any student below <strong>75%</strong> attendance as legally barred from Semester End Examinations unless condonation on medical grounds is approved by the Principal.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {atRiskStudents.length} student profile{atRiskStudents.length === 1 ? '' : 's'} needing advisory</span>
            <span className="text-indigo-400 font-semibold">Proctor Action Station</span>
          </div>
        </div>

      </div>

      {/* Flagged Students Intervention Roster */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50">
          <div>
            <h4 className="font-extrabold text-white text-base">Students Requiring Immediate Academic Intervention</h4>
            <p className="text-xs text-slate-400 mt-0.5">Automated deficit calculation based on 60-contact-hour semester standard</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-semibold self-start sm:self-auto">
            {atRiskStudents.length} Active Alerts
          </span>
        </div>

        {atRiskStudents.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h5 className="font-bold text-white text-base">No Students in Selected Risk Category</h5>
            <p className="text-xs text-slate-400 mt-1">
              All students currently meet the selected attendance & academic threshold.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Student & USN</th>
                  <th className="py-3 px-3">Dept & Sem</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">Deficit / Buffer</th>
                  <th className="py-3 px-3">CGPA</th>
                  <th className="py-3 px-3">Assigned Mentor</th>
                  <th className="py-3 px-4 text-right">Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {atRiskStudents.map((s) => {
                  const attendedEst = Math.round((s.attendance / 100) * STANDARD_COURSE_HOURS);
                  const deficitNeeded = calculateConsecutiveClassesNeeded(attendedEst, STANDARD_COURSE_HOURS, 75);
                  const safeBuffer = calculateBunkBuffer(attendedEst, STANDARD_COURSE_HOURS, 75);
                  const isCritical = s.attendance < 75;

                  return (
                    <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                            alt={s.name}
                            className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10"
                          />
                          <div>
                            <span 
                              onClick={() => openDetailModal(s)}
                              className="font-bold text-white hover:text-blue-400 cursor-pointer block"
                            >
                              {s.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">{s.usn}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-200">{s.branch}</span>
                        <span className="text-slate-400 block text-[11px]">Sem {s.semester} (Sec {s.section || 'A'})</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                            isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {s.attendance}%
                          </span>
                        </div>
                        {/* Progress Bar with 75% mark */}
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden relative">
                          <div
                            className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${s.attendance}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {isCritical ? (
                          <span className="text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Attend <strong>+{deficitNeeded}</strong> classes
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Buffer: <strong>{safeBuffer}</strong> missable
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`font-mono font-bold ${s.cgpa < 7.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {s.cgpa?.toFixed(2)}
                        </span>
                        {s.cgpa < 7.0 && (
                          <span className="block text-[10px] text-rose-400/80">Below 7.0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-slate-300">
                        <span className="font-medium">{s.mentor || 'Proctor Office'}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => generateProctorAdvisory(s)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors font-medium text-[11px]"
                            title="Copy official VTU advisory notice"
                          >
                            {copiedId === s._id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy Notice</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openDetailModal(s)}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition-colors"
                            title="Inspect complete student profile"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
