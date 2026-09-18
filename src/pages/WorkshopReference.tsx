import React, { useState } from 'react';
import { Image, FileText, CheckCircle2 } from 'lucide-react';

export const WorkshopReference: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<
    'parts' | 'operations' | 'angles' | 'measuring' | 'welding' | 'safety'
  >('parts');

  const topics = [
    { id: 'parts', label: 'Lathe Parts', title: 'Center Lathe Nomenclature & Sub-Assemblies' },
    { id: 'operations', label: 'Lathe Operations', title: 'Turning, Facing, Knurling & Threading' },
    { id: 'angles', label: 'Tool Angles', title: 'Single-Point Cutting Tool Signature (ASA)' },
    { id: 'measuring', label: 'Measuring Tools', title: 'Vernier, Micrometer & Dial Gauges' },
    { id: 'welding', label: 'Welding', title: 'SMAW Arc, Gas Flames & Joint Preparation' },
    { id: 'safety', label: 'Safety', title: 'Workshop Safety Protocols & PPE Rules' },
  ];

  const currentTopic = topics.find((t) => t.id === activeCategory) || topics[0];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-white/10">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveCategory(t.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
              activeCategory === t.id
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
                : 'bg-white/80 dark:bg-zinc-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Diagram & Content Slot Container */}
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <Image className="w-6 h-6" />
        </div>

        <div className="max-w-md mx-auto">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-sans">
            {currentTopic.title}
          </h3>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Slot ID: WKS-{activeCategory.toUpperCase()} • Structure Ready</span>
        </div>
      </div>

      {/* Structured Outline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-sans">Technical Specifications Slot</h4>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">Ready</span>
        </div>

        <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-sans">Shop Practice Checklist Slot</h4>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">Ready</span>
        </div>
      </div>
    </div>
  );
};
