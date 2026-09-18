import React, { useState, useEffect } from 'react';
import {
  Flame,
  FileText,
  Download,
  UploadCloud,
  Clock,
  CheckCircle2,
  Wrench,
  Activity,
  FileSpreadsheet,
  GraduationCap,
  PenTool,
  ExternalLink,
  Eye,
  X
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { isPdfAvailable } from '../utils/pdfRegistry';

export type LabTab = 'MaterialsTesting' | 'Thermal' | 'Manufacturing' | 'Drawing';

export interface LabCompanionProps {
  initialTab?: LabTab;
  onNavigate?: (tab: string, toolId?: string) => void;
  onViewPdf?: (url: string, title: string) => void;
}

export const LabCompanion: React.FC<LabCompanionProps> = ({
  initialTab = 'Thermal',
  onNavigate,
  onViewPdf
}) => {
  const { showToast } = useToast();
  const [activeLabTab, setActiveLabTab] = useState<LabTab>(initialTab);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);

  const handlePdfAction = (e: React.MouseEvent, url: string, isView: boolean, title: string) => {
    if (!isPdfAvailable(url)) {
      e.preventDefault();
      showToast('📄 Archive in progress — This paper will be available shortly.');
      return;
    }
    if (isView) {
      e.preventDefault();
      if (onViewPdf) {
        onViewPdf(url, title);
      } else {
        setActivePdfUrl(url);
      }
    }
  };

  // Close active in-app PDF preview on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePdfUrl) {
        setActivePdfUrl(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePdfUrl]);

  // Exact Location Anchoring: Listen for window.location.hash and auto-select tab + scroll
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const cleanHash = hash.replace(/^#/, '');

      if (
        cleanHash.startsWith('l-boiler') ||
        cleanHash.startsWith('tl-') ||
        cleanHash.startsWith('item-tl-') ||
        ['lancashire', 'cochran', 'babcock', 'thermal'].includes(cleanHash)
      ) {
        setActiveLabTab('Thermal');
      } else if (cleanHash.includes('materialstesting') || cleanHash === 'l-utm' || cleanHash === 'item-utm') {
        setActiveLabTab('MaterialsTesting');
      } else if (cleanHash.includes('manufacturing') || cleanHash === 'l-mfg' || cleanHash === 'item-mfg') {
        setActiveLabTab('Manufacturing');
      } else if (cleanHash.includes('drawing') || cleanHash === 'l-drawing' || cleanHash === 'item-drawing') {
        setActiveLabTab('Drawing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Component-Level Auto-Scroll: Robust React-lifecycle scrolling on mount and hash changes
  useEffect(() => {
    const scrollOnHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Use requestAnimationFrame to ensure the map loop has painted the DOM
        requestAnimationFrame(() => {
          const element =
            document.getElementById(hash) ||
            document.getElementById(`item-${hash}`) ||
            document.getElementById(hash.replace(/^item-/, ''));

          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('target-highlight');
            setTimeout(() => element.classList.remove('target-highlight'), 2500);
          }
        });
      }
    };

    scrollOnHash();
    window.addEventListener('hashchange', scrollOnHash);
    return () => window.removeEventListener('hashchange', scrollOnHash);
  }, [activeLabTab]);

  const labCategories: { id: LabTab; label: string; code: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'MaterialsTesting', label: 'Materials Testing Lab', code: 'MEPC 211', icon: Activity },
    { id: 'Thermal', label: 'Thermal Engg-I Lab', code: 'MEPC 215', icon: Flame },
    { id: 'Manufacturing', label: 'Manufacturing Practice', code: 'MEPC 213', icon: Wrench },
    { id: 'Drawing', label: 'Drawing Practice', code: 'MEPC 217', icon: PenTool },
  ];

  const thermalExperiments = [
    {
      id: 'tl-1',
      boilerId: 'lancashire',
      number: 'Experiment 01',
      title: 'Lancashire Boiler',
      pdfUrl: '/labs/exp1_tl.pdf',
      badge: 'Low / Medium Pressure',
    },
    {
      id: 'tl-2',
      boilerId: 'cochran',
      number: 'Experiment 02',
      title: 'Cochran Boiler',
      pdfUrl: '/labs/exp2_tl.pdf',
      badge: 'Vertical Portable',
    },
    {
      id: 'tl-3',
      boilerId: 'babcock',
      number: 'Experiment 03',
      title: 'Babcock & Wilcox Boiler',
      pdfUrl: '/labs/exp3_tl.pdf',
      badge: 'High Pressure Water-Tube',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6">
      {/* Sub-Navigation Menu for the 4 Lab Categories with Prominent Orange Active Highlight */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Lab Subject
          </span>
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
            Sem 3 Laboratory Companion
          </span>
        </div>

        <nav aria-label="Lab categories" className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x">
          {labCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeLabTab === cat.id;
            return (
              <button
                key={cat.id}
                id={`lab-tab-${cat.id.toLowerCase()}`}
                type="button"
                onClick={() => setActiveLabTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer snap-start active:scale-95 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm ring-1 ring-emerald-500/50'
                    : 'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
                {cat.id === 'Thermal' && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    3 PDFs
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ==================================================== */}
      {/* 1. THERMAL LAB: Report Kit, Viva Shortcut & Manuals  */}
      {/* ==================================================== */}
      {activeLabTab === 'Thermal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white font-sans">
                Thermal Engineering Lab Manuals
              </h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              3 Manuals Available
            </span>
          </div>

          {/* Primary Tier: Core Experiments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Experiments
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                3 Manuals Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {thermalExperiments.map((exp, idx) => (
                <div
                  key={exp.id}
                  id={`item-${exp.id}`}
                  className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md p-4 shadow-sm hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div id={`l-boiler${idx + 1}`}>
                    <div id={exp.id} />
                    <div id={`item-l-boiler${idx + 1}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Exp 0{idx + 1}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {exp.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug font-sans">
                      {exp.title}
                    </h4>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-view-${exp.id}`}
                        type="button"
                        onClick={(e) => handlePdfAction(e, exp.pdfUrl, true, `${exp.title} Manual`)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs font-sans"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Open PDF</span>
                      </button>
                      <a
                        id={`btn-download-${exp.id}`}
                        href={exp.pdfUrl}
                        download={`${exp.id}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handlePdfAction(e, exp.pdfUrl, false, `${exp.title} Manual`)}
                        className="p-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs"
                        title="Download PDF"
                        aria-label={`Download ${exp.title} PDF`}
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>

                    <button
                      id={`btn-viva-${exp.id}`}
                      type="button"
                      onClick={() => onNavigate?.('viva', exp.boilerId)}
                      title={`Practice ${exp.title} Viva`}
                      className="w-full py-1.5 px-2.5 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 font-sans"
                    >
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span>Practice Boiler Viva</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Tier: Index & Templates */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Index &amp; Templates
              </span>
              <span className="text-xs font-mono text-slate-400">Official Standards</span>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md divide-y divide-slate-100 dark:divide-white/5 overflow-hidden shadow-sm">
              {/* Front Index Sheet */}
              <div className="py-3 px-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      Front Index Sheet
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Official Format • MEPC 215
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handlePdfAction(e, '/labs/thermal_front_index.pdf', true, 'Front Index Sheet')}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>View</span>
                  </button>
                  <a
                    href="/labs/thermal_front_index.pdf"
                    download="thermal_front_index.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handlePdfAction(e, '/labs/thermal_front_index.pdf', false, 'Front Index Sheet')}
                    className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-sm"
                    title="Download Front Index Sheet"
                    aria-label="Download Front Index Sheet"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Universal Assignment Template */}
              <div className="py-3 px-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      Universal Assignment Template
                    </h5>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Standard Report Cover Sheet • Universal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handlePdfAction(e, '/templates/universal_assignment_lab_master.pdf', true, 'Universal Assignment Template')}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>View</span>
                  </button>
                  <a
                    href="/templates/universal_assignment_lab_master.pdf"
                    download="universal_assignment_lab_master.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handlePdfAction(e, '/templates/universal_assignment_lab_master.pdf', false, 'Universal Assignment Template')}
                    className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-sm"
                    title="Download Universal Assignment Template"
                    aria-label="Download Universal Assignment Template"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. MATERIALS TESTING LAB: Render placeholder         */}
      {/* ==================================================== */}
      {activeLabTab === 'MaterialsTesting' && (
        <div id="item-utm" className="relative overflow-hidden p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-center space-y-4 shadow-sm">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div id="l-utm" />
          <div id="item-l-utm" />
          <div className="relative z-10 w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="relative z-10 space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              MEPC 211
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Materials Testing Lab
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tensile testing, hardness verification, and impact charpy/izod analysis modules.
            </p>
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. MANUFACTURING PRACTICE: Render placeholder        */}
      {/* ==================================================== */}
      {activeLabTab === 'Manufacturing' && (
        <div id="item-mfg" className="relative overflow-hidden p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-center space-y-4 shadow-sm">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div id="l-mfg" />
          <div id="item-l-mfg" />
          <div className="relative z-10 w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-inner">
            <Wrench className="w-7 h-7" />
          </div>

          <div className="relative z-10 space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              MEPC 213
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Manufacturing Practice Lab
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lathe operations, milling setup, shaping, and precision machining safety guidelines.
            </p>
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. DRAWING PRACTICE: Render placeholder              */}
      {/* ==================================================== */}
      {activeLabTab === 'Drawing' && (
        <div id="item-drawing" className="relative overflow-hidden p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-center space-y-4 shadow-sm">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div id="l-drawing" />
          <div id="item-l-drawing" />
          <div className="relative z-10 w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-inner">
            <PenTool className="w-7 h-7" />
          </div>

          <div className="relative z-10 space-y-2 max-w-md mx-auto">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              MEPC 217
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Drawing Practice Lab
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assembly drawings, geometric dimensioning and tolerancing (GD&T), and isometric projections.
            </p>
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending</span>
          </div>
        </div>
      )}

      {/* In-App Embedded PDF Viewer Modal */}
      {activePdfUrl && (
        <div
          id="lab-pdf-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Lab Manual Viewer"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col animate-in fade-in duration-200 transform-gpu gpu-accelerated"
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 bg-zinc-900/95 border-b border-white/10 shadow-md backdrop-blur-md">
            <span className="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Lab Manual Viewer</span>
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={activePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in Tab</span>
              </a>
              <a
                href={activePdfUrl}
                download
                className="text-xs text-emerald-400 hover:text-emerald-300 px-3 py-1.5 min-h-[44px] flex items-center gap-1.5 font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline</span>
              </a>
              <button
                id="btn-close-pdf-modal"
                type="button"
                onClick={() => setActivePdfUrl(null)}
                aria-label="Close viewer"
                className="p-1 min-h-[44px] min-w-[44px] text-slate-400 hover:text-white text-lg flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <iframe
            src={`${activePdfUrl}#toolbar=0`}
            className="w-full h-full border-none bg-slate-950"
            title="Lab Manual Viewer"
          />
        </div>
      )}
    </div>
  );
};
