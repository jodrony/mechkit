import React, { useState, useEffect } from 'react';
import {
  Calculator,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Search,
  Clock,
  Share2,
  Activity,
  ArrowRight,
  Zap,
  FolderArchive,
  FileText,
  ExternalLink,
  X,
  ChevronRight
} from 'lucide-react';
import type { ActiveTab } from '../App';
import { CountdownTimer } from '../components/CountdownTimer';
import { useToast } from '../components/Toast';

interface DashboardProps {
  onNavigate: (tab: ActiveTab | string, toolId?: string) => void;
  onOpenSearch?: () => void;
  onOpenCreator?: () => void;
  onShare?: () => void;
  onViewPdf?: (url: string, title: string) => void;
}

interface ResourceItem {
  id: string;
  title: string;
  category: 'syllabus' | 'calendar' | 'pyq' | 'manual' | 'tool';
  categoryLabel: string;
  fileSize?: string;
  url?: string;
  isExternal?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenCreator,
  onShare,
  onViewPdf,
}) => {
  const { showToast } = useToast();

  // Core Simulation State
  const [coreMode, setCoreMode] = useState<'nominal' | 'boost' | 'overdrive'>('boost');
  const [coreAngle, setCoreAngle] = useState<number>(0);
  const [simLatency, setSimLatency] = useState<number>(0.38);
  const [simThroughput, setSimThroughput] = useState<number>(3120);

  // Resources Drawer State
  const [isResourcesDrawerOpen, setIsResourcesDrawerOpen] = useState<boolean>(false);
  const [activeResourceFilter, setActiveResourceFilter] = useState<string>('all');

  // Smooth turbine animation
  useEffect(() => {
    const speed = coreMode === 'overdrive' ? 3.5 : coreMode === 'boost' ? 1.2 : 0.6;
    const interval = setInterval(() => {
      setCoreAngle((prev) => (prev + speed) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [coreMode]);

  // Subtle telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * 0.04;
      const baseLat = coreMode === 'overdrive' ? 0.22 : coreMode === 'boost' ? 0.38 : 0.62;
      setSimLatency(Number(Math.max(0.18, baseLat + jitter).toFixed(2)));

      const baseTp = coreMode === 'overdrive' ? 4620 : coreMode === 'boost' ? 3120 : 1580;
      setSimThroughput(Math.round(baseTp + (Math.random() - 0.5) * 80));
    }, 2000);
    return () => clearInterval(interval);
  }, [coreMode]);

  const handleShareClick = () => {
    if (onShare) {
      onShare();
      return;
    }
    navigator.clipboard?.writeText(window.location.origin);
    showToast('Portal URL copied to clipboard');
  };

  // High-value WBSCTE Resources
  const resourcesList: ResourceItem[] = [
    {
      id: 'dme-syllabus',
      title: 'WBSCTE DME 3rd Semester Official Syllabus',
      category: 'syllabus',
      categoryLabel: 'Curriculum',
      fileSize: '1.4 MB PDF',
      url: '/syllabus/DME_3rd_Semester_Syllabus.pdf',
    },
    {
      id: 'academic-calendar',
      title: 'Academic Calendar 2026–2027 (Exam Dates)',
      category: 'calendar',
      categoryLabel: 'Schedule',
      fileSize: '680 KB PDF',
      url: '/academic/academic_calendar_2026_2027.pdf',
    },
    {
      id: 'college-routine',
      title: 'Sem 3 Class & Lab Weekly Routine',
      category: 'calendar',
      categoryLabel: 'Routine',
      fileSize: '420 KB PDF',
      url: '/routine/simplified_routine_sem3.pdf',
    },
    {
      id: 'som-pyq',
      title: 'Strength of Materials 2018–2026 PYQ Master',
      category: 'pyq',
      categoryLabel: 'Official PYQ',
      fileSize: '4.8 MB PDF',
      url: '/pyq/som_pyq_all.pdf',
    },
    {
      id: 'thermal-pyq',
      title: 'Thermal Engineering-I 2018–2026 PYQ Master',
      category: 'pyq',
      categoryLabel: 'Official PYQ',
      fileSize: '5.2 MB PDF',
      url: '/pyq/thermal_pyq_all.pdf',
    },
    {
      id: 'thermal-exp1',
      title: 'Thermal Lab Manual: Exp 1 Observation Sheet',
      category: 'manual',
      categoryLabel: 'Lab Manual',
      fileSize: '890 KB PDF',
      url: '/labs/exp1_tl.pdf',
    },
    {
      id: 'lab-master',
      title: 'Universal Mechanical Lab Assignment Template',
      category: 'manual',
      categoryLabel: 'Template',
      fileSize: '340 KB PDF',
      url: '/templates/universal_assignment_lab_master.pdf',
    },
    {
      id: 'wbscte-portal',
      title: 'WBSCTE Official Council Examination Portal',
      category: 'tool',
      categoryLabel: 'External',
      url: 'https://webscte.co.in/',
      isExternal: true,
    },
    {
      id: 'matweb',
      title: 'MatWeb Materials Engineering Density & Yield DB',
      category: 'tool',
      categoryLabel: 'External',
      url: 'https://www.matweb.com/',
      isExternal: true,
    },
  ];

  const filteredResources = activeResourceFilter === 'all'
    ? resourcesList
    : resourcesList.filter((r) => r.category === activeResourceFilter);

  const handleResourceClick = (res: ResourceItem) => {
    if (res.isExternal && res.url) {
      window.open(res.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (res.url) {
      if (onViewPdf) {
        onViewPdf(res.url, res.title);
      } else {
        window.open(res.url, '_blank');
      }
    }
  };

  return (
    <div className="relative min-h-[92vh] w-full overflow-hidden bg-[#03140F] text-slate-100 font-sans flex flex-col justify-between selection:bg-[#05DF8E]/30 selection:text-white">

      {/* ─────────────────────────────────────────────────────────────
          1. CINEMATIC STAGE LIGHTING (Refined Subtle Radial Gradients)
         ───────────────────────────────────────────────────────────── */}

      {/* Primary Ambient Stage Light (Centered Behind 3D Core) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/12 via-emerald-950/25 to-transparent blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Secondary Warm Studio Glow */}
      <div className="absolute -bottom-28 -right-28 w-[550px] h-[550px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/8 via-emerald-950/20 to-transparent blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Clean Architectural Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          2. SLEEK GLASSMORPHIC HEADER BAR
         ───────────────────────────────────────────────────────────── */}
      <header className="relative z-30 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-5 pb-2">
        <div className="backdrop-blur-md bg-white/[0.04] border border-white/10 rounded-full px-5 py-2.5 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
              MK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-semibold text-sm tracking-tight text-white">
                  MechKit <span className="font-light text-slate-400">Pro</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'calculators', label: 'Calculators' },
              { id: 'formulas', label: 'Formulas' },
              { id: 'labs', label: 'Lab Companion' },
              { id: 'viva', label: 'Viva Prep' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-sans text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2">
            {/* Resources Drawer Button */}
            <button
              id="btn-resources-drawer"
              type="button"
              onClick={() => setIsResourcesDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-sans text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Open Resources Drawer"
            >
              <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Resources</span>
              <span className="text-[10px] font-mono px-1 rounded-full bg-white/10 text-slate-300">
                {resourcesList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={handleShareClick}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {onOpenCreator && (
              <button
                type="button"
                onClick={onOpenCreator}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-slate-300 transition-all"
              >
                <span>Rony ME &apos;25</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. SPATIAL HERO & FOCAL POINT STAGE
         ───────────────────────────────────────────────────────────── */}
      <main className="relative z-20 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col justify-center">

        <div className="relative w-full min-h-[580px] sm:min-h-[620px] flex items-center justify-center">

          {/* ═══════════════════════════════════════════════════════════
              CENTRAL 3D FOCAL ELEMENT: PRECISION SPINDLE CORE
             ═══════════════════════════════════════════════════════════ */}
          <div className="relative z-10 flex flex-col items-center justify-center select-none py-6">
            
            {/* Ambient Lighting Dome */}
            <div className="absolute w-80 h-80 rounded-full bg-emerald-500/15 blur-[90px] pointer-events-none" />

            {/* Rotating Rotor Assembly */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              
              {/* Outer Frosted Ring */}
              <div
                className="absolute inset-0 rounded-full border border-white/10"
                style={{
                  transform: `rotate(${coreAngle * 0.25}deg)`,
                  transition: 'transform 0.05s linear',
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>

              {/* Middle Dashed Ring */}
              <div
                className="absolute inset-5 rounded-full border border-dashed border-white/[0.12]"
                style={{
                  transform: `rotate(-${coreAngle * 0.5}deg)`,
                  transition: 'transform 0.05s linear',
                }}
              />

              {/* Turbine Vane SVG Assembly */}
              <svg
                viewBox="0 0 200 200"
                className="w-48 h-48 sm:w-60 sm:h-60"
                style={{
                  transform: `rotate(${coreAngle}deg)`,
                  transition: 'transform 0.05s linear',
                }}
              >
                <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="8 6" />

                {/* Titanium Curved Vanes */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <path
                    key={i}
                    d="M 100 100 Q 125 75 145 60 A 90 90 0 0 1 155 72 Q 128 88 100 100 Z"
                    fill="url(#titanium-blade)"
                    fillOpacity="0.4"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.7"
                    transform={`rotate(${angle} 100 100)`}
                  />
                ))}

                <defs>
                  <linearGradient id="titanium-blade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#05DF8E" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Specular Spindle Hub */}
              <div className="absolute w-32 h-32 rounded-full backdrop-blur-xl bg-[#061D15]/80 border border-white/15 flex flex-col items-center justify-center text-center p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-medium">
                  SPINDLE SPEED
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums my-0.5">
                  {coreMode === 'overdrive' ? '3,600' : coreMode === 'boost' ? '1,800' : '600'}
                </span>
                <span className="font-sans text-[11px] text-slate-400 font-medium">
                  RPM • Calibrated
                </span>
              </div>
            </div>

            {/* Clean Sans Mode Selector */}
            <div className="mt-5 flex items-center gap-1.5 p-1 rounded-full backdrop-blur-md bg-white/[0.04] border border-white/10">
              {[
                { id: 'nominal', label: 'Idle' },
                { id: 'boost', label: 'Optimal' },
                { id: 'overdrive', label: 'Peak' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setCoreMode(mode.id as any)}
                  className={`px-3.5 py-1 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                    coreMode === mode.id
                      ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SATELLITE 1: TOP-LEFT (Performance Telemetry)
             ═══════════════════════════════════════════════════════════ */}
          <div className="w-full md:w-72 md:absolute md:top-4 md:left-2 lg:left-6 z-20 mt-6 md:mt-0">
            <div className="relative backdrop-blur-md bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300">
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-sans font-medium text-xs uppercase tracking-wider text-slate-300">
                    Engine Latency
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-mono text-4xl font-bold tracking-tight text-white tabular-nums">
                  {simLatency}
                </span>
                <span className="font-sans text-xs text-slate-400 font-medium">ms response</span>
              </div>

              {/* Throughput metrics */}
              <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans text-slate-400">Throughput</span>
                  <span className="font-mono font-semibold text-white tabular-nums">{simThroughput} ops/s</span>
                </div>
                <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((simThroughput / 4800) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SATELLITE 2: TOP-RIGHT (Academic Timeline)
             ═══════════════════════════════════════════════════════════ */}
          <div className="w-full md:w-80 md:absolute md:top-4 md:right-2 lg:right-6 z-20 mt-4 md:mt-0">
            <div className="relative backdrop-blur-md bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300">
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-sans font-medium text-xs uppercase tracking-wider text-slate-300">
                    Academic Target
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  Jan 05, 2027
                </span>
              </div>

              <p className="font-sans text-xs text-slate-400 mb-2">
                WBSCTE 3rd Semester Board Examination
              </p>

              {/* Countdown Digits */}
              <div className="py-1">
                <CountdownTimer />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/[0.06] text-xs font-sans">
                <div>
                  <span className="text-slate-400 block text-[11px]">2nd Internal</span>
                  <span className="text-white font-medium">Dec 10, 2026</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Pass Criteria</span>
                  <span className="text-emerald-400 font-medium">40% Minimum</span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SATELLITE 3: BOTTOM-LEFT (Core Navigation Directory)
             ═══════════════════════════════════════════════════════════ */}
          <div className="w-full md:w-80 md:absolute md:bottom-2 md:left-2 lg:left-6 z-20 mt-4 md:mt-0">
            <div className="relative backdrop-blur-md bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
              
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-sans font-medium text-xs uppercase tracking-wider text-slate-300">
                  Engineering Suite
                </h3>
                <span className="font-mono text-[10px] text-slate-400">
                  4 Modules
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'resources', label: 'PYQ Archive', sub: '2018–2026', icon: BookOpen },
                  { id: 'labs', label: 'Lab Companion', sub: 'Manuals', icon: FlaskConical },
                  { id: 'formulas', label: 'Formula Deck', sub: '40+ Cards', icon: Calculator },
                  { id: 'viva', label: 'Viva Center', sub: 'Practice Q&A', icon: HelpCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className="flex flex-col p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/15 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-105 transition-transform" />
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <span className="font-sans font-medium text-xs text-white">
                        {item.label}
                      </span>
                      <span className="font-sans text-[10px] text-slate-400">
                        {item.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              SATELLITE 4: BOTTOM-RIGHT (Compliance & Specs)
             ═══════════════════════════════════════════════════════════ */}
          <div className="w-full md:w-72 md:absolute md:bottom-2 md:right-2 lg:right-6 z-20 mt-4 md:mt-0">
            <div className="relative backdrop-blur-md bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-4 sm:p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
              
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-sans font-medium text-xs uppercase tracking-wider text-slate-300">
                  Syllabus Coverage
                </h3>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-sans text-xs text-slate-400">Topic Completion</span>
                    <span className="font-mono text-sm font-bold text-white tabular-nums">98.4%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '98.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-sans text-xs text-slate-400">Safety Factor (Re)</span>
                    <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">1.65 Optimal</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500/60 h-full rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-white/[0.06] text-[11px] font-sans text-slate-400">
                  <span>9 Year Archive (2018–26)</span>
                  <span className="text-white font-medium">Offline First</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          4. FLOATING DOCK ACTION BAR
         ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-30 max-w-xl mx-auto w-full px-4 pb-6 pt-2">
        <div className="backdrop-blur-md bg-white/[0.04] border border-white/10 rounded-full p-1.5 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          
          {/* Instant Search Bar Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex-1 flex items-center gap-2.5 px-4 py-2 rounded-full hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all text-xs font-sans cursor-pointer text-left"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Search PYQs, formulas, calculators...</span>
            <kbd className="hidden sm:inline text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Quick Launch CTA */}
          <button
            type="button"
            onClick={() => onNavigate('calculators')}
            className="px-4 py-2 rounded-full bg-[#05DF8E] hover:bg-[#10F09C] text-[#021B13] font-sans font-semibold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Launch Tools</span>
          </button>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          5. SLIDE-OUT GLASS RESOURCES ARCHIVE DRAWER
         ───────────────────────────────────────────────────────────── */}
      {/* Floating Edge Trigger Tab */}
      <button
        type="button"
        onClick={() => setIsResourcesDrawerOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 px-2.5 py-4 rounded-l-2xl backdrop-blur-xl bg-white/[0.06] hover:bg-white/[0.12] border-l border-y border-white/10 text-slate-300 hover:text-white transition-all shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex flex-col items-center gap-2 cursor-pointer group"
        title="Open Resources Drawer"
      >
        <FolderArchive className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 [writing-mode:vertical-rl] rotate-180">
          Resources
        </span>
      </button>

      {/* Drawer Overlay Backdrop */}
      {isResourcesDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsResourcesDrawerOpen(false)}
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] backdrop-blur-2xl bg-[#061D15]/95 border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out flex flex-col ${
          isResourcesDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-sans font-semibold text-sm text-white">
                Resources Archive
              </h2>
              <p className="font-sans text-xs text-slate-400">
                Official WBSCTE Syllabi, Papers &amp; Tools
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsResourcesDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'syllabus', label: 'Syllabus' },
            { id: 'calendar', label: 'Calendar' },
            { id: 'pyq', label: 'PYQs' },
            { id: 'manual', label: 'Manuals' },
            { id: 'tool', label: 'External' },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveResourceFilter(filter.id)}
              className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                activeResourceFilter === filter.id
                  ? 'bg-emerald-400 text-[#021B13] font-semibold shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Scrollable Resource List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              onClick={() => handleResourceClick(res)}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/15 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-start gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0 mt-0.5">
                  {res.isExternal ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-sans font-medium text-xs text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                    {res.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      {res.categoryLabel}
                    </span>
                    {res.fileSize && (
                      <span className="font-mono text-[10px] text-slate-500">
                        {res.fileSize}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors shrink-0">
                {res.isExternal ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.01]">
          <button
            type="button"
            onClick={() => {
              setIsResourcesDrawerOpen(false);
              onNavigate('resources');
            }}
            className="w-full py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-sans font-medium text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Full Resources Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
