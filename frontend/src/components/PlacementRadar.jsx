import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Award, 
  Github, 
  ExternalLink, 
  Code2, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowRight, 
  Flame,
  Terminal,
  Zap,
  Target,
  Building2
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';
import AnimatedCounter from './AnimatedCounter';

export default function PlacementRadar() {
  const { students, openDetailModal, openEditDrawer, showToast } = useStudentContext();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'super-dream', 'open-source', 'missing-github'
  const [searchTerm, setSearchTerm] = useState('');

  // Evaluate Placement Readiness Score (0 - 100)
  const evaluateStudentPlacement = (s) => {
    let score = 0;
    const checks = {
      cgpaCutoff: s.cgpa >= 8.5,
      hasGithub: Boolean(s.githubUsername && s.githubUsername.trim()),
      hasLeetcode: Boolean(s.leetcodeHandle && s.leetcodeHandle.trim()),
      hasPortfolio: Boolean(s.portfolioUrl && s.portfolioUrl.trim()),
      skillDepth: (s.skills || []).length >= 3,
      safeAttendance: s.attendance >= 75,
    };

    // CGPA weight (max 40)
    if (s.cgpa >= 9.5) score += 40;
    else if (s.cgpa >= 9.0) score += 36;
    else if (s.cgpa >= 8.5) score += 30;
    else if (s.cgpa >= 7.5) score += 20;
    else score += 10;

    // GitHub presence (max 25)
    if (checks.hasGithub) score += 25;

    // LeetCode presence (max 20)
    if (checks.hasLeetcode) score += 20;

    // Portfolio & Skill Depth (max 15)
    if (checks.hasPortfolio) score += 5;
    if (checks.skillDepth) score += 10;

    let tier = 'Skill Accelerator';
    let tierColor = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10';
    let packageRange = '4 - 7 LPA';

    if (score >= 85 && checks.cgpaCutoff && checks.hasGithub) {
      tier = 'Tier-1 Super Dream';
      tierColor = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30 font-extrabold';
      packageRange = '20 - 45+ LPA';
    } else if (score >= 70 && checks.cgpaCutoff) {
      tier = 'Tier-1 Dream';
      tierColor = 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30 font-bold';
      packageRange = '10 - 20 LPA';
    } else if (score >= 50) {
      tier = 'Core Engineering';
      tierColor = 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold';
      packageRange = '7 - 12 LPA';
    }

    return {
      score,
      tier,
      tierColor,
      packageRange,
      checks,
    };
  };

  const processedStudents = students.map((s) => ({
    ...s,
    placement: evaluateStudentPlacement(s),
  }));

  const superDreamCandidates = processedStudents.filter(
    (s) => s.placement.tier === 'Tier-1 Super Dream'
  );
  const openSourceContributors = processedStudents.filter(
    (s) => s.placement.checks.hasGithub
  );
  const highCgpaMissingGithub = processedStudents.filter(
    (s) => s.cgpa >= 8.5 && !s.placement.checks.hasGithub
  );

  const filteredStudents = processedStudents.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.githubUsername || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'super-dream') return s.placement.tier === 'Tier-1 Super Dream';
    if (activeFilter === 'open-source') return s.placement.checks.hasGithub;
    if (activeFilter === 'missing-github') return s.cgpa >= 8.5 && !s.placement.checks.hasGithub;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Placement Intelligence Banner */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl bg-white dark:bg-slate-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>RVCE Tier-1 Campus Placement Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Placement Readiness &amp; <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">Developer Telemetry Radar</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Autonomous recruiter ranking correlating verified CGPA with GitHub commits, LeetCode handles, and multi-skill depth. Designed for Tier-1 Super Dream campus drives.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 text-center">
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                Super Dream
              </span>
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
                <AnimatedCounter to={superDreamCandidates.length} />
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-semibold mt-0.5">
                20+ LPA Pool
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 text-center">
              <span className="text-[10px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider block">
                Open Source
              </span>
              <span className="text-2xl font-black text-purple-700 dark:text-purple-300">
                <AnimatedCounter to={openSourceContributors.length} />
              </span>
              <span className="text-[10px] text-purple-700 dark:text-purple-400 block font-semibold mt-0.5">
                GitHub Linked
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 text-center">
              <span className="text-[10px] font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider block">
                Missing Repo
              </span>
              <span className="text-2xl font-black text-rose-700 dark:text-rose-300">
                <AnimatedCounter to={highCgpaMissingGithub.length} />
              </span>
              <span className="text-[10px] text-rose-700 dark:text-rose-400 block font-semibold mt-0.5">
                CGPA &ge; 8.5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Ribbon: Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-400'
            }`}
          >
            All Candidates ({processedStudents.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('super-dream')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'super-dream'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tier-1 Super Dream ({superDreamCandidates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('open-source')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'open-source'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-500/30'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Open Source Contributors ({openSourceContributors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('missing-github')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'missing-github'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-500/30'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Needs GitHub Profile ({highCgpaMissingGithub.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, USN, skill, or GitHub..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xs"
          />
        </div>

      </div>

      {/* Main Placement Candidate Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl bg-white dark:bg-slate-950/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="py-4 px-4">Student &amp; USN</th>
                <th className="py-4 px-3">Dept &amp; Sem</th>
                <th className="py-4 px-3">Academic Index</th>
                <th className="py-4 px-4">Placement Readiness Tier</th>
                <th className="py-4 px-4">Developer Profiles &amp; Portfolios</th>
                <th className="py-4 px-4">Verified Tech Stack</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">No candidates meet active placement criteria</p>
                    <p className="text-xs text-slate-500 mt-1">Try switching filters or adjusting search parameters.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const { score, tier, tierColor, packageRange, checks } = s.placement;
                  const riskIndicator = !checks.cgpaCutoff 
                    ? 'border-l-4 border-l-amber-400' 
                    : checks.hasGithub 
                    ? 'border-l-4 border-l-emerald-500' 
                    : 'border-l-4 border-l-rose-500';

                  return (
                    <tr 
                      key={s._id} 
                      className={`transition-colors ${
                        idx % 2 === 0 ? 'bg-white dark:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-900/10'
                      } hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${riskIndicator}`}
                    >
                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                            alt={s.name}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 object-cover flex-shrink-0"
                          />
                          <div>
                            <span 
                              onClick={() => openDetailModal(s)}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer block text-sm"
                            >
                              {s.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-semibold">{s.usn}</span>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Sem */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{s.branch}</span>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium">Semester {s.semester}</span>
                      </td>

                      {/* Academic Index */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-base font-black ${s.cgpa >= 9.0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                            {s.cgpa.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">/ 10</span>
                        </div>
                        <span className={`text-[10px] font-bold ${checks.cgpaCutoff ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {checks.cgpaCutoff ? '✓ Meets Tier-1 Cutoff' : 'Below 8.5 Cutoff'}
                        </span>
                      </td>

                      {/* Placement Readiness Tier */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${tierColor}`}>
                              {tier}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                              {score}%
                            </span>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="w-36 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                score >= 85 
                                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                  : score >= 70
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>

                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                            Est. Band: <strong className="text-slate-800 dark:text-slate-200 font-bold">{packageRange}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Developer Profiles Launcher */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1.5">
                          {/* GitHub Launcher */}
                          {checks.hasGithub ? (
                            <a
                              href={`https://github.com/${s.githubUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 hover:text-black font-mono text-[11px] transition-colors w-fit group dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-white/10 dark:text-slate-200 dark:hover:text-white shadow-xs"
                            >
                              <Github className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform" />
                              <span>@{s.githubUsername}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                              <AlertCircle className="w-3.5 h-3.5" /> No GitHub Linked
                            </span>
                          )}

                          {/* LeetCode / Portfolio */}
                          <div className="flex items-center gap-2 text-[10px]">
                            {checks.hasLeetcode && (
                              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-mono font-medium">
                                <Code2 className="w-3.5 h-3.5" />
                                {s.leetcodeHandle}
                              </span>
                            )}
                            {checks.hasPortfolio && (
                              <a
                                href={s.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                              >
                                <Globe className="w-3 h-3" />
                                Portfolio
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Verified Tech Stack */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(s.skills || []).slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="bg-indigo-50/80 text-indigo-700 border border-indigo-200/60 font-medium text-xs px-2.5 py-1 rounded-md dark:bg-slate-800/80 dark:text-indigo-300 dark:border-white/10"
                            >
                              {skill}
                            </span>
                          ))}
                          {(s.skills || []).length > 3 && (
                            <span className="bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs px-2 py-0.5 rounded-md dark:bg-slate-800 dark:text-slate-400 dark:border-white/5">
                              +{(s.skills || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetailModal(s)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 transition-colors shadow-xs"
                            title="Inspect Candidate Dossier"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/90 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400 gap-2">
          <span>Placement Season Assessment: RVCE Autonomous Batch 2024-2026</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> High-Confidence Placement Telemetry
          </span>
        </div>
      </div>

    </div>
  );
}
