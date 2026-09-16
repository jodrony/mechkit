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
                    ? 'bg-mech-orange text-white shadow-md ring-2 ring-orange-500/30'
                    : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
                {cat.id === 'Thermal' && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-orange-500/10 text-mech-orange'
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
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-mech-orange">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Thermal Engineering Lab Manuals
              </h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
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
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 backdrop-blur-sm p-4 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        Exp 0{idx + 1}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {exp.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug">
                      {exp.title}
                    </h4>
                  </div>

                  <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-view-${exp.id}`}
                        type="button"
                        onClick={(e) => handlePdfAction(e, exp.pdfUrl, true, `${exp.title} Manual`)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>Open PDF</span>
                      </button>
                      <a
                        id={`btn-download-${exp.id}`}
                        href={exp.pdfUrl}
                        download={`${exp.id}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handlePdfAction(e, exp.pdfUrl, false, `${exp.title} Manual`)}
                        className="p-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
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
                      className="w-full py-1.5 px-2.5 text-xs font-semibold rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
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

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 backdrop-blur-sm divide-y divide-neutral-100 dark:divide-neutral-800/80 overflow-hidden shadow-xs">
              {/* Front Index Sheet */}
              <div className="py-2.5 px-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Front Index Sheet
                    </h5>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Official Format • MEPC 215
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handlePdfAction(e, '/labs/thermal_front_index.pdf', true, 'Front Index Sheet')}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-500" />
                    <span>View</span>
                  </button>
                  <a
                    href="/labs/thermal_front_index.pdf"
                    download="thermal_front_index.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handlePdfAction(e, '/labs/thermal_front_index.pdf', false, 'Front Index Sheet')}
                    className="p-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                    title="Download Front Index Sheet"
                    aria-label="Download Front Index Sheet"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Universal Assignment Template */}
              <div className="py-2.5 px-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Universal Assignment Template
                    </h5>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Standard Report Cover Sheet • Universal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handlePdfAction(e, '/templates/universal_assignment_lab_master.pdf', true, 'Universal Assignment Template')}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-500" />
                    <span>View</span>
                  </button>
                  <a
                    href="/templates/universal_assignment_lab_master.pdf"
                    download="universal_assignment_lab_master.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handlePdfAction(e, '/templates/universal_assignment_lab_master.pdf', false, 'Universal Assignment Template')}
                    className="p-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
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
        <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 text-mech-blue dark:text-blue-400 flex items-center justify-center">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-mech-blue dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              MEPC 211
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Materials Testing Lab
            </h3>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. MANUFACTURING PRACTICE: Render placeholder        */}
      {/* ==================================================== */}
      {activeLabTab === 'Manufacturing' && (
        <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Wrench className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              MEPC 213
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Manufacturing Practice Lab
            </h3>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. DRAWING PRACTICE: Render placeholder              */}
      {/* ==================================================== */}
      {activeLabTab === 'Drawing' && (
        <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <PenTool className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/50">
              MEPC 217
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Drawing Practice Lab
            </h3>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 bg-slate-900 border-b border-slate-800 shadow-md">
            <span className="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-mech-orange" />
              <span>Lab Manual Viewer</span>
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={activePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in Tab</span>
              </a>
              <a
                href={activePdfUrl}
                download
                className="text-xs text-mech-orange hover:underline px-2 py-1 min-h-[44px] flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline</span>
              </a>
              <button
                id="btn-close-pdf-modal"
                type="button"
                onClick={() => setActivePdfUrl(null)}
                aria-label="Close viewer"
                className="p-1 min-h-[44px] min-w-[44px] text-slate-400 hover:text-white text-lg flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
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
