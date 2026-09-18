import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Search,
  Clock,
  Share2,
  ArrowRight,
  ArrowLeft,
  FolderArchive,
  FileText,
  ExternalLink,
  X,
  ChevronRight,
  Layers,
  HelpCircle,
  ChevronDown,
  Lock,
  FlaskConical,
  FileCheck2,
  SlidersHorizontal,
} from 'lucide-react';
import type { ActiveTab } from '../App';
import { useToast } from '../components/Toast';

// Direct Feature Component Imports for Live Functional Preview
import { Calculators } from './Calculators';
import { FormulaLibrary } from './FormulaLibrary';
import { LabCompanion } from './LabCompanion';
import { VivaCenter } from './VivaCenter';
import { ResourcesHub } from './ResourcesHub';
import { Utilities } from './Utilities';

export interface DesignTestProps {
  onNavigate?: (tab: ActiveTab | string, toolId?: string) => void;
  onOpenSearch?: () => void;
  onOpenCreator?: () => void;
  onShare?: () => void;
  onViewPdf?: (url: string, title: string) => void;
}

export type PreviewTab =
  | 'dashboard'
  | 'calculators'
  | 'labs'
  | 'formulas'
  | 'viva'
  | 'resources'
  | 'utilities';

interface ResourceItem {
  id: string;
  title: string;
  category: 'syllabus' | 'calendar' | 'pyq' | 'manual' | 'tool';
  categoryLabel: string;
  fileSize?: string;
  url?: string;
  isExternal?: boolean;
}

const TARGET_EXAM_DATE = new Date('2027-01-05T00:00:00').getTime();

const calculateTimeRemaining = () => {
  const diff = Math.max(0, TARGET_EXAM_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

export const DesignTest: React.FC<DesignTestProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenCreator,
  onShare,
  onViewPdf,
}) => {
  const { showToast } = useToast();

  // Unified Single-Source Active Tab State synced with URL query params
  const [activeTab, setActiveTab] = useState<PreviewTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tab');
      if (
        t &&
        [
          'dashboard',
          'calculators',
          'utilities',
          'labs',
          'formulas',
          'viva',
          'resources',
        ].includes(t)
      ) {
        return t as PreviewTab;
      }
    }
    return 'dashboard';
  });
  const [activeSubTool, setActiveSubTool] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tool') || undefined;
    }
    return undefined;
  });

  const handleTabChange = (tab: PreviewTab, toolId?: string) => {
    setActiveTab(tab);
    if (toolId) {
      setActiveSubTool(toolId);
    }
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (tab === 'dashboard') {
        searchParams.delete('tab');
      } else {
        searchParams.set('tab', tab);
      }
      if (toolId) {
        searchParams.set('tool', toolId);
      } else {
        searchParams.delete('tool');
      }
      const qs = searchParams.toString();
      const newUrl = qs ? `/test?${qs}` : '/test';
      window.history.pushState({ tab, toolId }, '', newUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab as PreviewTab);
        if (e.state.toolId) setActiveSubTool(e.state.toolId);
      } else {
        const params = new URLSearchParams(window.location.search);
        const t = params.get('tab');
        if (
          t &&
          [
            'dashboard',
            'calculators',
            'utilities',
            'labs',
            'formulas',
            'viva',
            'resources',
          ].includes(t)
        ) {
          setActiveTab(t as PreviewTab);
        } else {
          setActiveTab('dashboard');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Collapsible Roadmap Drawer Toggle
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Resources Drawer State
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Countdown Ticker
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining);

  // Exam countdown ticker
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Hotkey Support (⌘K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (onOpenSearch) onOpenSearch();
      } else if (e.key === 'Escape') {
        setIsResourcesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  // In-shell navigation handler to preserve the new skin across child routes
  const handleInternalNavigate = (tab: ActiveTab | string, toolId?: string) => {
    const validTabs: PreviewTab[] = [
      'dashboard',
      'calculators',
      'utilities',
      'labs',
      'formulas',
      'viva',
      'resources',
    ];
    const normalizedTab = tab === 'downloads' ? 'resources' : tab;
    if (validTabs.includes(normalizedTab as PreviewTab)) {
      handleTabChange(normalizedTab as PreviewTab, toolId);
    } else if (onNavigate) {
      onNavigate(tab, toolId);
    }
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
      return;
    }
    navigator.clipboard?.writeText(window.location.origin + '/test');
    showToast('Portal link copied to clipboard', 'success');
  };

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
      title: 'Academic Calendar 2026–2027 (Exam Dates & Internals)',
      category: 'calendar',
      categoryLabel: 'Schedule',
      fileSize: '680 KB PDF',
      url: '/academic/academic_calendar_2026_2027.pdf',
    },
    {
      id: 'college-routine',
      title: 'Sem 3 Class & Lab Weekly Master Schedule',
      category: 'calendar',
      categoryLabel: 'Routine',
      fileSize: '420 KB PDF',
      url: '/routine/simplified_routine_sem3.pdf',
    },
    {
      id: 'som-pyq',
      title: 'Strength of Materials 2018–2026 PYQ Master Archive',
      category: 'pyq',
      categoryLabel: 'Official PYQ',
      fileSize: '4.8 MB PDF',
      url: '/pyq/som_pyq_all.pdf',
    },
    {
      id: 'thermal-pyq',
      title: 'Thermal Engineering-I 2018–2026 PYQ Master Archive',
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
      title: 'WBSCTE Council Official Exam Portal',
      category: 'tool',
      categoryLabel: 'External',
      url: 'https://webscte.co.in/',
      isExternal: true,
    },
    {
      id: 'matweb',
      title: 'MatWeb Materials Density & Yield DB',
      category: 'tool',
      categoryLabel: 'External',
      url: 'https://www.matweb.com/',
      isExternal: true,
    },
  ];

  const filteredResources = resourcesList.filter((r) => {
    const matchesCategory = activeFilter === 'all' || r.category === activeFilter;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Primary Data-Populated Modules Grid (for HUD)
  const primaryModules = [
    {
      id: 'calculators',
      title: 'Solvers & Calculators',
      desc: '12 active solvers: Lathe RPM, cutting speed, gear trains',
      icon: Calculator,
      metric: '12 Solvers',
      badge: 'Active',
      action: () => handleTabChange('calculators'),
    },
    {
      id: 'formulas',
      title: 'Formula Library',
      desc: '48 verified LaTeX cards: SOM, Thermo, Fluid Mechanics',
      icon: Layers,
      metric: '48 Cards',
      badge: 'Active',
      action: () => handleTabChange('formulas'),
    },
    {
      id: 'pyq-vault',
      title: 'PYQ & Document Vault',
      desc: '2018–2026 Board papers, DME 3rd Sem syllabus PDFs',
      icon: FolderArchive,
      metric: '9 PDFs',
      badge: 'Verified',
      action: () => setIsResourcesOpen(true),
    },
    {
      id: 'viva',
      title: 'Viva Defense Center',
      desc: '120+ oral defense Q&A, boiler tests, flashcards',
      icon: HelpCircle,
      metric: '120+ Q&A',
      badge: 'Study Ready',
      action: () => handleTabChange('viva'),
    },
  ];

  // Inactive / Placeholder Modules
  const inactiveModules = [
    {
      title: 'Workshop Reference',
      desc: 'Fit & tolerance charts, limits, and allowances database',
      status: 'Coming Soon',
    },
    {
      title: 'Lab Observation Companion',
      desc: 'Digital reading logbook and observation data tables',
      status: 'Coming Soon',
    },
    {
      title: 'CAD Viewer & Geometry',
      desc: '3D STEP and STL component interactive wireframes',
      status: 'In Development',
    },
  ];

  return (
    <div className="bg-[#06090e] relative overflow-x-hidden min-h-screen text-slate-100 font-sans pb-32 select-none selection:bg-emerald-500/20">

      {/* ─────────────────────────────────────────────────────────────
          1. ATMOSPHERE & BACKGROUND DEPTH (Strictly pointer-events-none)
         ───────────────────────────────────────────────────────────── */}
      {/* Ambient radial light source behind the upper half */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Subtle fine grid overlay */}
      <div className="bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none absolute inset-0 -z-10" />

      {/* Top subtle gradient vignette */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-emerald-500/[0.03] via-transparent to-transparent pointer-events-none -z-10" />

      {/* ─────────────────────────────────────────────────────────────
          2. CONCISE BRANDING & UNIFIED TOP NAVIGATION
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-3 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          {/* Real Concise Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs tracking-tight shadow-sm shrink-0">
              MK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  MechKit <span className="text-emerald-400">v0.3</span>
                </h1>
              </div>
              <p className="text-2xs font-mono uppercase tracking-widest text-slate-400">
                WBSCTE Mechanical Engineering
              </p>
            </div>
          </div>

          {/* Action Chips */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button
              type="button"
              onClick={handleShareClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Share Portal"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share</span>
            </button>

            {onOpenCreator && (
              <button
                id="btn-creator-chip"
                type="button"
                onClick={onOpenCreator}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 text-xs text-slate-200 transition-all active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Built by Rony Biswas</span>
                <span className="text-emerald-400 font-mono text-[11px]">ME &apos;25</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. DYNAMIC CONTENT RENDERING
             - When activeTab === 'dashboard': Render Functional Engineering HUD
             - When activeTab !== 'dashboard': Render Live Feature Component
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' ? (
        <main className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-1 pb-8 space-y-4">

          {/* Section: Status Pills + Functional Progress Hub (Semester Mastery / Exam Readiness) */}
          <section className="flex flex-col items-center justify-center pt-2 pb-2 relative z-20">
            {/* Status Pills */}
            <div className="w-full max-w-sm flex items-center justify-between px-1 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs text-slate-300 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400 uppercase tracking-wider">Kinematics</span>
                <span className="font-mono text-emerald-400 font-semibold">BOOST</span>
              </div>

              <button
                type="button"
                onClick={() => setIsResourcesOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-2xs text-slate-300 font-sans transition-all cursor-pointer active:scale-95"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-400 uppercase tracking-wider">Vault</span>
                <span className="font-mono text-white font-semibold">9 PDFs</span>
              </button>
            </div>

            {/* High-Density SVG Circular Progress Ring: Semester Mastery / Exam Readiness */}
            <div className="group relative w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center select-none my-1">
              {/* Smooth ambient emerald backlight */}
              <div className="absolute inset-2 bg-emerald-500/10 blur-[80px] pointer-events-none rounded-full" />

              {/* High-Density Precision SVG Arc */}
              <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none -rotate-90 transform">
                <defs>
                  <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>

                {/* Outer Decorative Tick Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="100"
                    y1="5"
                    x2="100"
                    y2="10"
                    stroke={deg % 90 === 0 ? '#10B981' : 'rgba(255, 255, 255, 0.25)'}
                    strokeWidth={deg % 90 === 0 ? '1.5' : '1'}
                    transform={`rotate(${deg} 100 100)`}
                  />
                ))}

                {/* Background Track Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="8"
                />

                {/* Active 78% Progress Arc (Circumference 490.1, 78% filled = 107.8 offset) */}
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  fill="none"
                  stroke="url(#readiness-gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="490.1"
                  strokeDashoffset="107.8"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                />

                {/* Inner Caliper Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="64"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1"
                  strokeDasharray="1 5"
                />
              </svg>

              {/* Center Metrics Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-semibold mb-0.5">
                  Semester Mastery
                </span>
                <div className="flex items-baseline justify-center gap-0.5 my-0.5">
                  <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
                    78
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-emerald-400">
                    %
                  </span>
                </div>
                <span className="text-3xs font-mono uppercase tracking-wider text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mt-0.5">
                  WBSCTE Sem 3 Core
                </span>
              </div>
            </div>

            {/* Micro-Stats Underneath */}
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-300 font-sans flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-white font-semibold">14</span>
                <span className="text-slate-400">Formulas Cached</span>
              </div>
              <span className="text-white/20 text-xs">•</span>
              <button
                type="button"
                onClick={() => setIsResourcesOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-2xs text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="font-mono text-white font-semibold">9</span>
                <span className="text-slate-400">PYQ Vault PDFs Active</span>
              </button>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────
              4. LOWER SECTION: RICH DATA-DRIVEN HERO CARDS
                 (Card A: Finals Countdown + Card B: Resource Vault)
             ───────────────────────────────────────────────────────────── */}
          <section id="hero-cards" className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-20">
            {/* Card A: WBSCTE Finals Countdown */}
            <div
              onClick={() => setIsResourcesOpen(true)}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/10 p-4 shadow-sm hover:border-white/20 hover:bg-zinc-900/70 transition-all cursor-pointer active:scale-95"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white tracking-tight font-sans">
                      WBSCTE Finals
                    </h3>
                    <p className="text-2xs text-slate-400 font-sans">Official Council Schedule</p>
                  </div>
                </div>

                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-medium">
                  Jan 05, 2027
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-bold text-white tabular-nums tracking-tight">
                    {timeLeft.days}
                  </span>
                  <span className="text-xs text-slate-400 font-sans font-medium">Days remaining</span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Live h:m:s sub-ticker */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-2xs text-slate-400 font-mono">
                <span>{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span>
                <span className="text-emerald-400/90 font-sans">Audit Ready</span>
              </div>
            </div>

            {/* Card B: High-Value Resource Vault (Connected to Live PDF Viewer & Hub) */}
            <div
              onClick={() => {
                setActiveTab('resources');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/10 p-4 shadow-sm hover:border-white/20 hover:bg-zinc-900/70 transition-all cursor-pointer active:scale-95"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:text-rose-300 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white tracking-tight font-sans">
                      Resource Vault
                    </h3>
                    <p className="text-2xs text-slate-400 font-sans">Verified PDF Master Archive</p>
                  </div>
                </div>

                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-mono bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 font-medium">
                  3 New Syllabi
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-3xl font-bold text-white tabular-nums tracking-tight">
                      {resourcesList.length}
                    </span>
                    <span className="text-xs text-slate-400 font-sans font-medium">Documents Indexed</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-sans group-hover:text-emerald-300 transition-colors">
                  <span>Browse Vault</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Quick-Access File Manager Chips (Direct PDF.js Viewer Launchers) */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResourceClick(resourcesList[0]);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-3xs text-slate-300 font-mono transition-colors cursor-pointer"
                  title="Open WBSCTE DME 3rd Sem Syllabus PDF"
                >
                  <FileCheck2 className="w-3 h-3 text-rose-400" />
                  <span>DME Sem 3</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResourceClick(resourcesList[3]);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-3xs text-slate-300 font-mono transition-colors cursor-pointer"
                  title="Open SOM 2018–2026 PYQs PDF"
                >
                  <FileCheck2 className="w-3 h-3 text-cyan-400" />
                  <span>SOM '18–'26</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResourceClick(resourcesList[4]);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-3xs text-slate-300 font-mono transition-colors cursor-pointer"
                  title="Open Thermal Engineering-I PYQs PDF"
                >
                  <FileCheck2 className="w-3 h-3 text-emerald-400" />
                  <span>Thermal PYQ</span>
                </button>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────
              5. PRIMARY ACTIVE ENGINEERING MODULES
             ───────────────────────────────────────────────────────────── */}
          <section id="primary-tools" className="space-y-2 relative z-20">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold text-white tracking-wider uppercase">
                Primary Engineering Tools
              </h2>
              <span className="text-2xs text-slate-400 font-sans">Active &amp; Populated</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              {primaryModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={mod.action}
                    className="min-h-[96px] p-3.5 sm:p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/70 border border-white/10 hover:border-white/20 transition-all text-left cursor-pointer group flex flex-col justify-between active:scale-95 shadow-sm"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 group-hover:text-emerald-400 transition-colors">
                        {mod.metric}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                        {mod.title}
                      </h3>
                      <p className="text-2xs text-slate-400 line-clamp-1 mt-0.5 font-sans">
                        {mod.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────
              6. QUICK REFERENCE TOOL CHIPS
             ───────────────────────────────────────────────────────────── */}
          <section className="backdrop-blur-md bg-zinc-900/40 border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 relative z-20">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-300 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-300 font-medium">Quick Reference</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('utilities');
                  setActiveSubTool('conv_press');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all cursor-pointer active:scale-95"
              >
                Unit Converter
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('resources')}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-slate-200 hover:text-white whitespace-nowrap transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <FolderArchive className="w-3.5 h-3.5 text-emerald-400" />
                <span>PYQs (2018–26)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-slate-400 hover:text-slate-300 whitespace-nowrap transition-all cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <span>More Modules</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────────
              7. DEPRIORITIZED / INACTIVE MODULES (Future-Proofed Collapsible)
             ───────────────────────────────────────────────────────────── */}
          {isMoreOpen && (
            <section className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-2.5 transition-all relative z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">Roadmap &amp; Inactive Modules</span>
                </div>
                <span className="text-3xs text-slate-500 font-mono">STAGED FOR V3.2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {inactiveModules.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] opacity-50 cursor-not-allowed flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">{item.title}</span>
                        <span className="text-3xs font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-500 mt-1 font-sans line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      ) : (
        /* Real Feature Component in New Dark Glassmorphic Shell */
        <div className="relative z-20 max-w-6xl mx-auto w-full px-2 sm:px-6 py-2 pb-28 text-slate-100 min-h-[calc(100vh-160px)]">
          {/* Sub-Header Navigation Strip inside dark shell */}
          <div className="flex items-center justify-between backdrop-blur-md bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-2.5 mb-4 shadow-sm">
            <button
              type="button"
              onClick={() => handleTabChange('dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                {activeTab === 'calculators' && 'Module 2: Calculators'}
                {activeTab === 'utilities' && 'Module 3: Utilities'}
                {activeTab === 'labs' && 'Module 4: Lab Companion'}
                {activeTab === 'formulas' && 'Module 6: Formula Library'}
                {activeTab === 'viva' && 'Module 7: Viva Defense'}
                {activeTab === 'resources' && 'Module 7: Resources Vault'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Ingested Component View */}
          <div className="rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-xs p-1 sm:p-3 overflow-hidden">
            {activeTab === 'calculators' && <Calculators initialToolId={activeSubTool} />}
            {activeTab === 'utilities' && <Utilities initialToolId={activeSubTool} />}
            {activeTab === 'labs' && <LabCompanion onNavigate={handleInternalNavigate} onViewPdf={onViewPdf} />}
            {activeTab === 'formulas' && <FormulaLibrary onNavigate={handleInternalNavigate} />}
            {activeTab === 'viva' && <VivaCenter />}
            {activeTab === 'resources' && <ResourcesHub onViewPdf={onViewPdf} />}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. LIVE-CONNECTED FROSTED BOTTOM NAVIGATION DOCK
             (Strict Sequence: 1. Calculator, 2. Lab, 3. Search, 4. Formula, 5. Resource)
         ───────────────────────────────────────────────────────────── */}
      <nav
        aria-label="Bottom Navigation Dock"
        className="fixed bottom-0 inset-x-0 z-50 bg-zinc-950/85 backdrop-blur-xl border-t border-white/10 px-4 sm:px-6 py-2 pb-6 flex justify-around items-center max-w-lg mx-auto md:rounded-t-2xl shadow-2xl"
      >
        {/* 1. Calculator */}
        <button
          type="button"
          onClick={() => handleTabChange('calculators')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 ${
            activeTab === 'calculators'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Calculator"
        >
          <Calculator className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Calculator</span>
          {activeTab === 'calculators' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* 2. Lab */}
        <button
          type="button"
          onClick={() => handleTabChange('labs')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 ${
            activeTab === 'labs'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Lab"
        >
          <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Lab</span>
          {activeTab === 'labs' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* 3. Search (Central Prominent Button: Triggers Live SearchModal Palette) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-12 h-12 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center active:scale-90 transition-all cursor-pointer shrink-0 mx-2 group"
          aria-label="Action Search"
          title="Open Search Palette (⌘K)"
        >
          <Search className="w-5 h-5 transition-transform group-hover:scale-110 text-emerald-300" />
          <span className="sr-only">Search</span>
        </button>

        {/* 4. Formula */}
        <button
          type="button"
          onClick={() => handleTabChange('formulas')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 ${
            activeTab === 'formulas'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Formula"
        >
          <Layers className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Formula</span>
          {activeTab === 'formulas' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* 5. Resource */}
        <button
          type="button"
          onClick={() => handleTabChange('resources')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group relative active:scale-95 ${
            activeTab === 'resources'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Resource"
        >
          <FolderArchive className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Resource</span>
          <span className={`absolute top-2 right-2 sm:right-4 w-1.5 h-1.5 rounded-full ${
            activeTab === 'resources' ? 'bg-emerald-400 ring-2 ring-emerald-400/30' : 'bg-emerald-400/80'
          }`} />
          {activeTab === 'resources' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          5. INTEGRATED RESOURCES BOTTOM SHEET / DRAWER (Vault)
         ───────────────────────────────────────────────────────────── */}
      {isResourcesOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto"
          onClick={() => setIsResourcesOpen(false)}
        />
      )}

      <div
        className={`fixed z-50 transition-all duration-300 ease-out flex flex-col
          inset-x-0 bottom-0 max-h-[82vh] rounded-t-3xl backdrop-blur-2xl bg-zinc-950/95 border-t border-white/[0.12] shadow-2xl
          md:inset-y-0 md:right-0 md:left-auto md:w-[420px] md:max-h-none md:rounded-none md:border-t-0 md:border-l md:border-white/[0.1]
          ${isResourcesOpen ? 'translate-y-0 md:translate-x-0 pointer-events-auto opacity-100 visible' : 'translate-y-full md:translate-x-full pointer-events-none opacity-0 invisible'}
        `}
      >
        {/* Mobile Swipe / Drag Pip */}
        <div className="md:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-white/25" />
        </div>

        {/* Drawer Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-white">Engineering Vault</h3>
              <p className="text-2xs text-slate-400 font-sans">Official DME Syllabus &amp; PYQ Archives</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsResourcesOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95"
            aria-label="Close Vault"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Field */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search syllabus, papers, manuals..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'syllabus', label: 'Syllabus' },
            { id: 'pyq', label: 'PYQs' },
            { id: 'manual', label: 'Manuals' },
            { id: 'calendar', label: 'Calendar' },
            { id: 'tool', label: 'External' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-sans whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                activeFilter === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Document List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              onClick={() => handleResourceClick(res)}
              className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer flex items-center justify-between group active:scale-95"
            >
              <div className="flex items-start gap-3 min-w-0 pr-2">
                <div className="p-2 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0 mt-0.5">
                  {res.isExternal ? <ExternalLink className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-xs text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                    {res.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xs text-slate-400 font-sans">{res.categoryLabel}</span>
                    {res.fileSize && <span className="font-mono text-3xs text-slate-500">{res.fileSize}</span>}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>

        {/* Full Hub Link in Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              setIsResourcesOpen(false);
              setActiveTab('resources');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Open Dedicated Resources Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default DesignTest;
