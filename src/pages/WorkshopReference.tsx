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
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveCategory(t.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === t.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Diagram & Content Slot Container */}
      <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Image className="w-6 h-6" />
        </div>

        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Diagram & notes slot ready for content.
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Technical illustrations, schematics, and reference guidelines for {currentTopic.title} will appear in this module.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <span>Slot ID: WKS-{activeCategory.toUpperCase()} • Structure Ready</span>
        </div>
      </div>

      {/* Structured Outline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Technical Specifications Slot</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Machining tolerances, speed/feed reference tables, and standard tooling parameters ready to populate.
          </p>
          <div className="text-[10px] font-mono text-slate-400">Status: Content slot ready</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Shop Practice Checklist Slot</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Step-by-step machining checks, clamp alignments, and safety clearance verification outline.
          </p>
          <div className="text-[10px] font-mono text-slate-400">Status: Checklist slot ready</div>
        </div>
      </div>
    </div>
  );
};
