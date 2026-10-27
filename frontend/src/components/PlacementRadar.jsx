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
    let tierColor = 'text-slate-400 bg-slate-800 border-white/10';
    let packageRange = '4 - 7 LPA';

    if (score >= 85 && checks.cgpaCutoff && checks.hasGithub) {
      tier = 'Tier-1 Super Dream';
      tierColor = 'badge-super-dream font-extrabold';
      packageRange = '20 - 45+ LPA';
    } else if (score >= 70 && checks.cgpaCutoff) {
      tier = 'Tier-1 Dream';
      tierColor = 'badge-tier1 font-bold';
      packageRange = '10 - 20 LPA';
    } else if (score >= 50) {
      tier = 'Core Engineering';
      tierColor = 'badge-safe font-semibold';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Tier-1 Placement Eligible */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Tier-1 Super Dream
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              20+ LPA Ready
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black text-amber-400">
              <AnimatedCounter value={superDreamCandidates.length} />
            </h3>
            <span className="text-xs text-slate-400">Students</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
            <span>Criteria:</span>
            <span className="text-amber-300 font-semibold">CGPA &ge; 8.5 + GitHub + LeetCode</span>
          </div>
        </div>

        {/* Card 2: Open Source Footprint */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-purple-400" /> Open Source Coders
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              GitHub Active
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black text-purple-400">
              <AnimatedCounter value={openSourceContributors.length} />
            </h3>
            <span className="text-xs text-slate-400">Verified Profiles</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
            <span>Adoption Rate:</span>
            <span className="text-purple-300 font-semibold">
              {students.length ? Math.round((openSourceContributors.length / students.length) * 100) : 0}% of cohort
            </span>
          </div>
        </div>

        {/* Card 3: Proctor Action Alert */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" /> Missing Portfolios
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
              High CGPA &ge; 8.5
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black text-rose-400">
              <AnimatedCounter value={highCgpaMissingGithub.length} />
            </h3>
            <span className="text-xs text-slate-400">Needs GitHub</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
            <span>Intervention:</span>
            <span className="text-rose-300 font-semibold">Advise Git onboarding</span>
          </div>
        </div>

        {/* Card 4: Top Companies Visiting RVCE */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" /> Tier-1 Campus Hiring
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
              RVCE Placements
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black text-blue-400">
              ₹54.2 <span className="text-base font-bold text-slate-400">LPA</span>
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/5 text-[11px] text-slate-400 flex justify-between">
            <span>Target Recruiters:</span>
            <span className="text-blue-300 font-semibold truncate max-w-[140px]">Google &bull; Atlassian &bull; Cisco</span>
          </div>
        </div>

      </div>

      {/* Roster Controls: Search & Tabs */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            All Candidates ({processedStudents.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('super-dream')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'super-dream'
                ? 'bg-amber-600 text-white shadow-glow-amber'
                : 'bg-slate-900/80 text-slate-400 hover:text-amber-300 border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tier-1 Super Dream ({superDreamCandidates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('open-source')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'open-source'
                ? 'bg-purple-600 text-white shadow-glow-indigo'
                : 'bg-slate-900/80 text-slate-400 hover:text-purple-300 border border-white/5'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-purple-400" />
            <span>Open Source Contributors ({openSourceContributors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('missing-github')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === 'missing-github'
                ? 'bg-rose-600 text-white shadow-glow-rose'
                : 'bg-slate-900/80 text-slate-400 hover:text-rose-300 border border-white/5'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
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
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs text-slate-200 placeholder:text-slate-500"
          />
        </div>

      </div>

      {/* Main Placement Candidate Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-white/5">
              <tr>
                <th className="py-4 px-4">Student & USN</th>
                <th className="py-4 px-3">Dept & Sem</th>
                <th className="py-4 px-3">Academic Index</th>
                <th className="py-4 px-4">Placement Readiness Tier</th>
                <th className="py-4 px-4">Developer Profiles & Portfolios</th>
                <th className="py-4 px-4">Verified Tech Stack</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    <p className="text-sm font-semibold text-white">No candidates meet active placement criteria</p>
                    <p className="text-xs text-slate-500 mt-1">Try switching filters or adjusting search parameters.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const { score, tier, tierColor, packageRange, checks } = s.placement;

                  return (
                    <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.name}`}
                            alt={s.name}
                            className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 object-cover"
                          />
                          <div>
                            <span 
                              onClick={() => openDetailModal(s)}
                              className="font-bold text-white hover:text-blue-400 cursor-pointer block text-sm"
                            >
                              {s.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400 font-semibold">{s.usn}</span>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Sem */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-200">{s.branch}</span>
                        <span className="text-slate-400 block text-[11px]">Semester {s.semester}</span>
                      </td>

                      {/* Academic Index */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-base font-extrabold ${s.cgpa >= 9.0 ? 'text-amber-400' : 'text-white'}`}>
                            {s.cgpa.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500">/ 10</span>
                        </div>
                        <span className={`text-[10px] font-semibold ${checks.cgpaCutoff ? 'text-emerald-400' : 'text-slate-500'}`}>
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
                            <span className="font-mono text-xs font-bold text-slate-300">
                              {score}%
                            </span>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="w-36 h-1.5 rounded-full bg-slate-800 overflow-hidden">
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

                          <span className="text-[10px] text-slate-400 block">
                            Est. Band: <strong className="text-slate-200">{packageRange}</strong>
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
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 hover:text-white font-mono text-[11px] transition-colors w-fit group"
                            >
                              <Github className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
                              <span>@{s.githubUsername}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400/80">
                              <AlertCircle className="w-3 h-3" /> No GitHub Linked
                            </span>
                          )}

                          {/* LeetCode / Portfolio */}
                          <div className="flex items-center gap-2 text-[10px]">
                            {checks.hasLeetcode && (
                              <span className="inline-flex items-center gap-1 text-amber-400 font-mono">
                                <Code2 className="w-3 h-3 text-amber-400" />
                                {s.leetcodeHandle}
                              </span>
                            )}
                            {checks.hasPortfolio && (
                              <a
                                href={s.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-blue-400 hover:underline"
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
                          {(s.skills || []).slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/5 text-[10px] text-slate-300 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {(s.skills || []).length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-500">
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
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
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
        <div className="p-4 border-t border-white/5 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>Placement Season Assessment: RVCE Autonomous Batch 2024-2026</span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> High-Confidence Placement Telemetry
          </span>
        </div>
      </div>

    </div>
  );
}
