import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase, 
  Database, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Github, 
  Code2, 
  Cpu, 
  Layers, 
  ExternalLink,
  BookOpen,
  Award,
  Zap,
  TrendingUp,
  Stethoscope,
  XCircle,
  Building,
  Sun,
  Moon
} from 'lucide-react';
import NetworkCanvas from './NetworkCanvas';
import AnimatedCounter from './AnimatedCounter';
import { useStudentContext } from '../context/StudentContext';

export default function LandingPage({ onLaunchApp }) {
  const { students, analytics, theme, toggleTheme } = useStudentContext();

  const totalCount = analytics?.summary?.totalStudents || students.length || 100;
  const avgCgpa = analytics?.summary?.avgCgpa || 8.42;
  const safeAttCount = students.filter((s) => s.attendance >= 85).length || 42;
  const superDreamCount = students.filter((s) => s.cgpa >= 8.5 && s.githubUsername).length || 24;

  const scrollToRegulations = () => {
    const el = document.getElementById('vtu-regulations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const techStack = [
    { name: 'React 18', tag: 'UI Library', color: 'text-cyan-600 dark:text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
    { name: 'Node.js', tag: 'Runtime', color: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { name: 'Express.js', tag: 'REST API', color: 'text-slate-700 dark:text-slate-300 border-slate-500/20 bg-slate-500/10' },
    { name: 'MongoDB Compass', tag: 'Document DB', color: 'text-green-600 dark:text-green-400 border-green-500/20 bg-green-500/10' },
    { name: 'Tailwind CSS', tag: 'Design System', color: 'text-sky-600 dark:text-sky-400 border-sky-500/20 bg-sky-500/10' },
    { name: 'HTML5 Canvas 3D Mesh', tag: 'Hardware Accelerated', color: 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/10' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500/20">
      
      {/* Top Showcase Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-glow-blue">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white font-sans">
                  RVCE <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">STUDENT IQ</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Institutional OS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                R.V. College of Engineering &bull; Autonomous VTU
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={scrollToRegulations}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              VTU Regulations
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            <button
              type="button"
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-glow-blue transition-all duration-200 active:scale-95"
            >
              <span>Launch Management OS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Landing Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {/* Hero Section with Embedded Interactive 3D Canvas */}
        <section className="relative overflow-hidden glass-card rounded-3xl p-8 sm:p-14 border border-slate-200 dark:border-white/[0.08] shadow-2xl">
          <NetworkCanvas className="pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Next-Gen Autonomous Academic Governance Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              RVCE Student Intelligence <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                &amp; Academic Lifecycle OS
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              Autonomous VTU attendance risk forecasting, CIE exam clearance simulation, and Tier-1 open-source placement readiness telemetry. Powered by high-speed MongoDB aggregation pipelines and 100-student procedural telemetry.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onLaunchApp}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-glow-blue transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <span>Launch Management OS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={scrollToRegulations}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all border border-slate-200 dark:border-white/10"
              >
                <span>View VTU Regulatory Criteria</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Overlay */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Active Cohort</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                <AnimatedCounter value={totalCount} />+
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Batches 2022 – 2025</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Campus CGPA Index</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                <AnimatedCounter value={avgCgpa} decimals={2} />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Institutional Average</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">SEE Distinction Zone</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                <AnimatedCounter value={safeAttCount} />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">&ge; 85% Presence</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Tier-1 Placement Ready</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                <AnimatedCounter value={superDreamCount} />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Super Dream (20+ LPA)</span>
            </div>
          </div>
        </section>

        {/* Live Tech Architecture Badge Strip */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Platform Architecture &amp; Engineering Stack
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">100% Client/Server Synchronized</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="glass-card rounded-2xl p-3 border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 flex flex-col justify-between"
              >
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border w-fit ${tech.color}`}>
                  {tech.tag}
                </span>
                <span className="font-bold text-slate-800 dark:text-white text-xs mt-2 block">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Four Core Engines of Institutional Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Designed specifically for autonomous engineering colleges managing accreditation, VTU exams, and placement seasons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Feature 1: Autonomous Exam Clearance Shield */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold badge-nsar">
                  65% Condonation Rule
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Autonomous Exam Clearance Shield
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Automated deficit calculator enforcing RVCE Semester End Exam policies. Dynamically tags students as <strong className="text-emerald-600 dark:text-emerald-400">Eligible for SEE</strong> (&ge;75%), <strong className="text-amber-600 dark:text-amber-400">Medical Condonation Required</strong> (65-74.9%), or <strong className="text-rose-600 dark:text-rose-400">Detained (NSAR)</strong> (&lt;65%).
              </p>
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Instant Proctoring Advisory Notice Generator</span>
              </div>
            </div>

            {/* Feature 2: Placement & Open-Source Radar */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold badge-tier1">
                  Tier-1 Super Dream
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Placement &amp; Open-Source Radar
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Evaluates student portfolios against campus recruiting cutoffs for top tech firms. Synthesizes CGPA &ge; 8.5, active GitHub repositories, and LeetCode problem-solving ratings into a real-time readiness index.
              </p>
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-1.5">
                <Github className="w-4 h-4" />
                <span>Direct GitHub Profile Launcher &amp; Portfolio Telemetry</span>
              </div>
            </div>

            {/* Feature 3: Real-Time Aggregation Engine */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                  Dual-Engine Architecture
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Real-Time Aggregation Pipeline
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                High-performance MongoDB aggregation pipeline computing branch-wise CGPA performance, semester score curves, and attendance risk distributions with zero-latency in-memory fallback.
              </p>
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Interactive Department Performance Matrix</span>
              </div>
            </div>

            {/* Feature 4: Audit & Bulk Ingest Portability */}
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-white/[0.08] relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold badge-safe">
                  CSV &amp; JSON Engine
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Audit &amp; Bulk Ingest Portability
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Institutional-grade batch ingestion supporting both 1RV and 1RZ prefixes. One-click export to CSV spreadsheets formatted for VTU reporting, alongside JSON schemas and bulk soft-delete recovery.
              </p>
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>One-Click Full Roster Export &amp; JSON Import Modal</span>
              </div>
            </div>

          </div>
        </section>

        {/* VTU Regulatory Criteria Section */}
        <section id="vtu-regulations" className="space-y-6 pt-6">
          <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-white/[0.08] space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  RVCE Autonomous Academic Regulations &sect; 4.0
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Criteria for Semester End Examination (SEE) Eligibility &amp; Condonation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                    &ge; 75% Attendance
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    Compliant
                  </span>
                </div>
                <p className="text-emerald-950 dark:text-emerald-200/90 leading-relaxed font-medium">
                  Candidate earns unconditional eligibility to write Semester End Examinations. If attendance is &ge; 85%, candidate qualifies for Dean's Academic Merit honors.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 dark:text-amber-300 text-sm">
                    65% - 74.9% Attendance
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    Conditional
                  </span>
                </div>
                <p className="text-amber-950 dark:text-amber-200/90 leading-relaxed font-medium">
                  Barred from SEE unless condonation is sanctioned on genuine medical grounds by the Principal, supported by authentic government hospital records and proctor recommendation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 dark:text-rose-300 text-sm">
                    &lt; 65% Attendance (NSAR)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300">
                    Detained
                  </span>
                </div>
                <p className="text-rose-950 dark:text-rose-200/90 leading-relaxed font-medium">
                  Non-Satisfactory Attendance Requirement. Strictly barred from writing SEE. Cannot be condoned under any circumstances. Student must re-register for the course in subsequent semesters.
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>Authority: Academic Council &bull; R.V. College of Engineering, Bengaluru</span>
              <button
                type="button"
                onClick={onLaunchApp}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold flex items-center gap-1"
              >
                <span>Launch Operational Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Global Academic Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-white/[0.08] glass-panel py-6 bg-white/70 dark:bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-300">
              R.V. College of Engineering (RVCE)
            </span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span>Autonomous Institution Affiliated to VTU, Belagavi</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLaunchApp}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Access Management OS &rarr;
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
