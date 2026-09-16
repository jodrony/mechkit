import React from 'react';
import {
  Calculator,
  FlaskConical,
  Hammer,
  BookOpen,
  HelpCircle,
  FolderArchive,
  Calendar,
  ChevronRight,
  Scale,
  Clock,
  CheckCircle2,
  Share2
} from 'lucide-react';
import type { ActiveTab } from '../App';
import { CountdownTimer } from '../components/CountdownTimer';
import { useToast } from '../components/Toast';

interface HomeProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenCreator?: () => void;
  onShare?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenCreator, onShare }) => {
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

    // Attempt native share if supported and in secure context (works automatically on production HTTPS)
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Robust fallback for HTTP / Localhost preview:
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Older mobile fallback using textarea
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
      // Trigger a visible toast banner at the top or bottom of the screen
      showToast('Link copied to clipboard! Share it in your WhatsApp group.');
    } catch (err) {
      showToast('Unable to auto-copy. App URL: ' + window.location.origin);
    }
  };

  const cards: {
    id: ActiveTab;
    title: string;
    subtitle: string;
    count: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badgeColor: string;
  }[] = [
    {
      id: 'calculators',
      title: 'Calculators',
      subtitle: 'Workshop, SOM, Kinematics',
      count: '8 Tools',
      icon: Calculator,
      accentColor: 'text-blue-500 dark:text-blue-400',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    },
    {
      id: 'utilities',
      title: 'Engineering Utilities',
      subtitle: 'Universal SI, Density, Stock Weights',
      count: '12 Tools',
      icon: Scale,
      accentColor: 'text-indigo-500 dark:text-indigo-400',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50',
    },
    {
      id: 'labs',
      title: 'Lab Companion',
      subtitle: 'Materials, Thermal, Mfg, Drawing',
      count: '4 Labs',
      icon: FlaskConical,
      accentColor: 'text-emerald-500 dark:text-emerald-400',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    },
    {
      id: 'workshop',
      title: 'Workshop Reference',
      subtitle: 'Lathe, Welding, Safety',
      count: '6 Topics',
      icon: Hammer,
      accentColor: 'text-amber-500 dark:text-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    },
    {
      id: 'formulas',
      title: 'Formula Library',
      subtitle: 'Curated Equations',
      count: '40 Formulas',
      icon: BookOpen,
      accentColor: 'text-purple-500 dark:text-purple-400',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50',
    },
    {
      id: 'viva',
      title: 'Viva Center',
      subtitle: 'Oral Exam Practice',
      count: '5 Subjects',
      icon: HelpCircle,
      accentColor: 'text-rose-500 dark:text-rose-400',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
    },
    {
      id: 'resources',
      title: 'Resources Hub',
      subtitle: 'Curriculum, Lab Kit, PYQs',
      count: '3 Sections',
      icon: FolderArchive,
      accentColor: 'text-cyan-500 dark:text-cyan-400',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-5">
      {/* 1. Official Status Bar Chip & Creator Hero Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 shadow-2xs gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-mech-orange shrink-0" />
          <span>WBSCTE Sem 3 • Board Exam Target: Jan 5, 2027</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            id="btn-share-mechkit"
            type="button"
            onClick={handleShare}
            title="Share MechKit v0.3"
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-bold text-mech-orange transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share MechKit</span>
          </button>
          <button
            id="btn-creator-hero-pill"
            type="button"
            onClick={onOpenCreator}
            className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full bg-slate-800/80 border border-slate-700/80 hover:border-mech-orange text-xs text-slate-300 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-mech-orange animate-pulse" />
            <span>Built by Rony Biswas</span>
            <span className="text-mech-orange font-semibold">ME &apos;25</span>
          </button>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/10 text-mech-orange border border-orange-200 dark:border-orange-900/60 shrink-0 hidden md:inline-block">
            Official WBSCTVESD 2026-27
          </span>
        </div>
      </div>

      {/* 2. Official Academic Countdown & Milestones Card */}
      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Official Academic Timeline
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-mech-blue shrink-0" />
              <span>Board Exam Target: Jan 5, 2027</span>
            </h3>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              Theory Commencement Target
            </span>
          </div>
        </div>

        {/* Live Countdown Timer Digits Display (Isolated Component to prevent parent re-renders) */}
        <CountdownTimer />

        {/* Milestones List */}
        <div className="pt-2 space-y-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Academic Calendar Milestones:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
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

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block uppercase">
                  Board Theory
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Theoretical Board Examinations: Tentative Start Jan 5, 2027
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tap Cards Grid (2-column on mobile, 3-column on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onNavigate(card.id)}
              className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 hover:border-mech-blue/60 dark:hover:border-mech-blue/60 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer group active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2 rounded-xl ${card.badgeColor} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-mech-blue dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {card.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/40 text-[11px]">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {card.count}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-mech-blue transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
