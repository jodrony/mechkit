import React from 'react';
import {
  Calculator,
  FlaskConical,
  Hammer,
  BookOpen,
  HelpCircle,
  Calendar,
  ChevronRight,
  Scale,
  Clock,
  CheckCircle2,
  Share2,
  FileText,
  ArrowRight,
  Search
} from 'lucide-react';
import type { ActiveTab } from '../App';
import { CountdownTimer } from '../components/CountdownTimer';
import { useToast } from '../components/Toast';

interface HomeProps {
  onNavigate: (tab: ActiveTab | string, toolId?: string) => void;
  onOpenCreator?: () => void;
  onShare?: () => void;
  onOpenSearch?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenCreator, onShare, onOpenSearch }) => {
  const { showToast } = useToast();

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    const shareUrl = window.location.href;
    const shareData = {
      title: 'MechKit v0.3 — Diploma ME Sem 3 Portal',
      text: 'Access WBSCTE Sem 3 Lab Reports, Viva Prep, and 2018-2026 PYQs:',
      url: shareUrl
    };

    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast('Link copied to clipboard! Share it in your WhatsApp group.');
    } catch {
      showToast('Unable to auto-copy. App URL: ' + window.location.origin);
    }
  };

  // 2x2 Core High-Priority Modules
  const coreModules = [
    {
      id: 'resources' as ActiveTab,
      title: 'PYQ Archive',
      badge: '2018–2026 PYQs',
      tag: 'Official Papers',
      icon: FileText,
      accentBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
      borderHover: 'hover:border-blue-500/60 dark:hover:border-blue-500/60',
    },
    {
      id: 'labs' as ActiveTab,
      title: 'Lab Companion',
      badge: '4 Lab Subjects',
      tag: 'Reports & Manuals',
      icon: FlaskConical,
      accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
      borderHover: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/60',
    },
    {
      id: 'formulas' as ActiveTab,
      title: 'Formula Deck',
      badge: '40+ Formulas',
      tag: 'Curated Equations',
      icon: BookOpen,
      accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
      borderHover: 'hover:border-purple-500/60 dark:hover:border-purple-500/60',
    },
    {
      id: 'resources' as ActiveTab,
      title: 'Routine & Syllabus',
      badge: '2026–2027 Schedule',
      tag: 'Official WBSCTE',
      icon: Calendar,
      accentBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50',
      borderHover: 'hover:border-cyan-500/60 dark:hover:border-cyan-500/60',
    },
  ];

  // Secondary Tools (Compact Scannable Grid)
  const secondaryTools = [
    {
      id: 'calculators' as ActiveTab,
      title: 'Calculators',
      count: '8 Tools',
      icon: Calculator,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'viva' as ActiveTab,
      title: 'Viva Center',
      count: 'Boilers & Practice',
      icon: HelpCircle,
      color: 'text-rose-500 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      id: 'workshop' as ActiveTab,
      title: 'Workshop Reference',
      count: '6 Topics',
      icon: Hammer,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'utilities' as ActiveTab,
      title: 'Engineering Utilities',
      count: '12 Tools',
      icon: Scale,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-5">
      {/* 1. Header: MechKit Logo + WBSCTE Mechanical Engineering + Instant Search */}
      <div className="flex flex-col gap-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
              <span className="font-mono font-black text-base">MK</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                MechKit
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20">
                  v0.3
                </span>
              </h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                WBSCTE Mechanical Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button
              id="btn-share-mechkit"
              type="button"
              onClick={handleShare}
              title="Share MechKit v0.3"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-bold text-orange-500 dark:text-orange-400 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              id="btn-creator-hero-pill"
              type="button"
              onClick={onOpenCreator}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 hover:border-orange-500 text-xs text-slate-300 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Built by Rony Biswas</span>
              <span className="text-orange-400 font-semibold">ME &apos;25</span>
            </button>
          </div>
        </div>

        {/* Instant Search Bar */}
        <button
          id="btn-hero-search"
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-100/90 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 hover:border-orange-500/50 text-slate-400 dark:text-neutral-400 text-xs sm:text-sm cursor-pointer transition-colors shadow-2xs group text-left"
        >
          <Search aria-hidden="true" className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
          <span className="flex-1 font-medium text-slate-500 dark:text-neutral-400 truncate">
            Search PYQs, lab manuals, formulas, calculators...
          </span>
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-slate-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 2. Official Academic Countdown & Milestones Card */}
      <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Official Academic Timeline
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-mech-blue shrink-0" />
              <span>Board Exam Target: Jan 5, 2027</span>
            </h3>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              Theory Target
            </span>
          </div>
        </div>

        {/* Live Countdown Timer Digits Display */}
        <CountdownTimer />

        {/* Milestones List */}
        <div className="pt-1 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-blue-500/10 text-mech-blue dark:text-blue-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase">
                  Internal Exam
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Second Internal Assessment: By Dec 10, 2026
                </p>
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase">
                  Board Theory
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Theoretical Board Exams: Tentative Jan 5, 2027
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Modules: 2x2 Quick-Access Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Core Modules
          </span>
          <span className="text-[10px] font-mono text-slate-400">Tap to open</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
          {coreModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.title}
                type="button"
                onClick={() => onNavigate(module.id)}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800/80 ${module.borderHover} shadow-xs hover:shadow-md transition-all text-left cursor-pointer group active:scale-[0.99]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${module.accentBg} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                        {module.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{module.badge}</span>
                      <span>•</span>
                      <span>{module.tag}</span>
                    </div>
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30 transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Secondary Tools: Compact Scannable Row / Grid */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5 block">
          Tools &amp; Practice
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {secondaryTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onNavigate(tool.id)}
                className="flex flex-col justify-between p-3 rounded-2xl bg-white dark:bg-neutral-900/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-700 shadow-xs hover:shadow-sm transition-all text-left cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${tool.bg} ${tool.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {tool.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {tool.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

