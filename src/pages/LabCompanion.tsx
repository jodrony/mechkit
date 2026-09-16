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
  Sparkles,
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
      type: 'Fire-Tube • Horizontal • Internally Fired',
      description: 'Study of construction, flue gas path, mountings (dead weight safety valve, water level indicator) and accessories of two-flue internal furnace boiler.',
      pdfUrl: '/labs/exp1_tl.pdf',
      badge: 'Low / Medium Pressure',
    },
    {
      id: 'tl-2',
      boilerId: 'cochran',
      number: 'Experiment 02',
      title: 'Cochran Boiler',
      type: 'Fire-Tube • Vertical • Multi-Tubular',
      description: 'Study of vertical multi-tubular boiler with hemispherical crown, firebrick lined combustion chamber, and horizontal smoke tubes.',
      pdfUrl: '/labs/exp2_tl.pdf',
      badge: 'Vertical Portable',
    },
    {
      id: 'tl-3',
      boilerId: 'babcock',
      number: 'Experiment 03',
      title: 'Babcock & Wilcox Boiler',
      type: 'Water-Tube • Longitudinal Drum • Externally Fired',
      description: 'Study of high-pressure inclined water tubes, mud box, uptake/downtake headers, superheater tubes, and baffle plates for steam generation.',
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
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Thermal Engineering Lab Manuals
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Boiler study experiments with full diagrams, specifications, and viva questions.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              3 Manuals Available
            </span>
          </div>

          {/* Quick-Access Header Action & Utility Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* A. Thermal Lab Report Kit */}
            <div className="bg-white dark:bg-[#1e293b] border border-amber-300/80 dark:border-amber-700/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Gayeshpur Govt. Polytechnic / Official Format
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">MEPC 215</span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </span>
                  <span>Thermal Engineering-I Lab Report Kit</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Front, title, and blank index sheet specifically formatted for MEPC 215 Thermal Lab submissions.
                </p>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-stretch gap-2">
                <button
                  id="btn-view-front-index"
                  type="button"
                  onClick={(e) => handlePdfAction(e, '/labs/thermal_front_index.pdf', true, 'Thermal Engineering-I Lab Report Kit')}
                  className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Eye className="w-4 h-4 text-mech-orange shrink-0" />
                  <span>View</span>
                </button>
                <a
                  id="btn-download-front-index"
                  href="/labs/thermal_front_index.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="thermal_front_index.pdf"
                  onClick={(e) => handlePdfAction(e, '/labs/thermal_front_index.pdf', false, 'Thermal Engineering-I Lab Report Kit')}
                  className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold bg-mech-orange hover:bg-orange-600 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* B. Universal Lab Report Cover Sheet (Pending Upload) */}
            <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    All Semester Labs
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">Universal Format</span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span>Universal Lab Report Cover Sheet</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  General lab cover sheet template for Materials Testing, Manufacturing Practice, and Drawing submissions.
                </p>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-stretch gap-2">
                <button
                  id="btn-view-universal-lab-kit"
                  type="button"
                  onClick={(e) => handlePdfAction(e, '/templates/universal_assignment_lab_master.pdf', true, 'Universal Lab Report Cover Sheet')}
                  className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Eye className="w-4 h-4 text-mech-orange shrink-0" />
                  <span>View</span>
                </button>
                <a
                  id="btn-download-universal-lab-kit"
                  href="/templates/universal_assignment_lab_master.pdf"
                  download="universal_assignment_lab_master.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handlePdfAction(e, '/templates/universal_assignment_lab_master.pdf', false, 'Universal Lab Report Cover Sheet')}
                  className="flex-1 min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-bold bg-mech-orange hover:bg-orange-600 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* C. Direct Viva Practice Shortcut */}
            <div className="bg-white dark:bg-[#1e293b] border border-blue-300/80 dark:border-blue-700/60 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                    Boiler Component Quiz
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">Viva Center</span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-500/10 text-mech-blue dark:text-blue-400">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                  <span>Thermal Component Viva</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Zero-click oral exam practice on 54 labeled boiler parts with examiner recall answers.
                </p>
              </div>

              <div className="pt-1">
                <button
                  id="btn-launch-thermal-viva"
                  type="button"
                  onClick={() => onNavigate?.('viva', 'lancashire')}
                  className="w-full min-h-[42px] px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-mech-blue hover:bg-blue-600 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                  <span>Launch Boiler Viva →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Boiler Experiment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {thermalExperiments.map((exp) => (
              <div
                key={exp.id}
                className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-mech-orange uppercase tracking-wider">
                      {exp.number}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {exp.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-mech-blue transition-colors">
                    {exp.title}
                  </h4>

                  <span className="inline-block text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
                    {exp.type}
                  </span>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <button
                      id={`btn-view-${exp.id}`}
                      type="button"
                      onClick={(e) => handlePdfAction(e, exp.pdfUrl, true, `${exp.title} Manual`)}
                      className="flex-1 min-h-[44px] px-3 py-2 text-xs sm:text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>View</span>
                    </button>
                    <a
                      id={`btn-download-${exp.id}`}
                      href={exp.pdfUrl}
                      download={`${exp.id}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handlePdfAction(e, exp.pdfUrl, false, `${exp.title} Manual`)}
                      className="flex-1 min-h-[44px] px-3 py-2 text-xs sm:text-sm font-medium rounded-xl bg-mech-orange hover:bg-orange-600 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download</span>
                    </a>
                  </div>

                  <button
                    id={`btn-viva-${exp.id}`}
                    type="button"
                    onClick={() => onNavigate?.('viva', exp.boilerId)}
                    title={`Practice ${exp.title} Viva`}
                    className="w-full min-h-[44px] px-4 py-2 text-xs sm:text-sm font-medium rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-mech-orange border border-orange-300 dark:border-orange-800/80 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>Practice Viva</span>
                  </button>
                </div>
              </div>
            ))}
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

          <div className="space-y-1.5 max-w-md mx-auto">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-mech-blue dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 mb-1">
              MEPC 211
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Materials Testing Lab
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              PDF upload pending for UTM Tensile Test on Mild Steel, Izod & Charpy Impact Toughness, and Brinell/Rockwell Hardness observation manuals.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending • Structure slot ready</span>
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

          <div className="space-y-1.5 max-w-md mx-auto">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 mb-1">
              MEPC 213
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Manufacturing Practice Lab
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              PDF upload pending for Lathe Step Turning, Taper Turning by Compound Rest, Knurling, Shaper machine mechanisms, and Milling job procedures.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending • Structure slot ready</span>
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

          <div className="space-y-1.5 max-w-md mx-auto">
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/50 mb-1">
              MEPC 217
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Drawing Practice Lab
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              PDF upload pending for Machine Drawing, Orthographic & Sectional Views, Limits & Fits, Assembly Drawings, and CAD practice sheets.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>PDF upload pending • Structure slot ready</span>
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
