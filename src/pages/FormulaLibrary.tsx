import React, { useState, useMemo, useEffect } from 'react';
import { MathView } from '../components/MathView';
import { formulasData, type FormulaItem } from '../data/formulasData';
import { matchesMultiField } from '../utils/searchFilter';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Calculator,
  ArrowRight,
  BookOpen,
  Activity,
  Flame,
  Wrench,
  Compass,
  CheckCircle2,
  ChevronsUpDown,
  Hash
} from 'lucide-react';

export type FormulaCategory = 'All' | 'SOM' | 'Thermal' | 'Workshop' | 'Mechanics';

export interface FormulaLibraryProps {
  onNavigate?: (tab: string, toolId?: string, elementId?: string) => void;
}

export const FormulaLibrary: React.FC<FormulaLibraryProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<FormulaCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['som_1'])); // default first one expanded

  // Exact Location Anchoring: Listen for window.location.hash and select active category/expanded state
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const cleanHash = hash.replace(/^#/, '');
      let formulaId = cleanHash
        .replace(/^f-/, '')
        .replace(/^item-/, '')
        .replace(/^formula-card-/, '')
        .replace(/^formula-/, '');
      if (cleanHash === 'bernoulli-equation' || cleanHash === 'bernoulli') {
        formulaId = 'bernoulli';
      }

      if (formulaId) {
        setExpandedIds((prev) => new Set(prev).add(formulaId));
      }

      // If activeCategory is not 'All', auto-select category if needed to make the element visible
      const targetFormula = formulasData.find((f) => f.id === formulaId);
      if (targetFormula && activeCategory !== 'All' && targetFormula.category !== activeCategory) {
        setActiveCategory('All');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [activeCategory]);

  // Component-Level Auto-Scroll: Robust React-lifecycle scrolling on mount and hash changes
  useEffect(() => {
    const scrollOnHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Use requestAnimationFrame to ensure the map loop has painted the DOM
        requestAnimationFrame(() => {
          const formulaId = hash
            .replace(/^f-/, '')
            .replace(/^item-/, '')
            .replace(/^formula-card-/, '')
            .replace(/^formula-/, '');

          const element =
            document.getElementById(hash) ||
            document.getElementById(`item-${hash}`) ||
            document.getElementById(`item-${formulaId}`) ||
            document.getElementById(`f-${formulaId}`) ||
            document.getElementById(`formula-${formulaId}`) ||
            document.getElementById(`formula-card-${formulaId}`) ||
            (hash.includes('bernoulli') ? document.getElementById('item-bernoulli') : null);

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
  }, [activeCategory, expandedIds]);

  const categoryConfigs: {
    id: FormulaCategory;
    label: string;
    count: number;
    subject: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
  }[] = [
    { id: 'All', label: 'All', count: 40, subject: 'All Sem 3 Subjects', icon: BookOpen, colorClass: 'text-slate-600 dark:text-slate-300' },
    { id: 'SOM', label: 'SOM', count: 15, subject: 'Strength of Materials', icon: Activity, colorClass: 'text-blue-500' },
    { id: 'Thermal', label: 'Thermal', count: 10, subject: 'Thermal Engineering-I', icon: Flame, colorClass: 'text-orange-500' },
    { id: 'Workshop', label: 'Workshop', count: 10, subject: 'Machine Tools & Machining', icon: Wrench, colorClass: 'text-emerald-500' },
    { id: 'Mechanics', label: 'Mechanics', count: 5, subject: 'Engineering Mechanics', icon: Compass, colorClass: 'text-purple-500' },
  ];

  // Category & instant search filter
  const filteredFormulas = useMemo(() => {
    let list = formulasData;

    if (activeCategory !== 'All') {
      list = list.filter((f) => f.category === activeCategory);
    }

    if (searchQuery.trim()) {
      list = list.filter((f) =>
        matchesMultiField(
          {
            ...f,
            units: f.siUnits,
            subject: f.category,
          },
          searchQuery
        )
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (expandedIds.size === filteredFormulas.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredFormulas.map((f) => f.id)));
    }
  };

  const getCategoryBadgeColor = (cat: FormulaItem['category']) => {
    switch (cat) {
      case 'SOM':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';
      case 'Thermal':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/40';
      case 'Workshop':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40';
      case 'Mechanics':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans">
              Formula Reference Library
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExpandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
            <span>{expandedIds.size === filteredFormulas.length && filteredFormulas.length > 0 ? 'Collapse All' : 'Expand All'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs with Count Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Select Category
          </span>
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
            {filteredFormulas.length} of {formulasData.length} Formulas Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x">
          {categoryConfigs.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                id={`tab-category-${cat.id.toLowerCase()}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer snap-start active:scale-95 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm ring-1 ring-emerald-500/50'
                    : 'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          id="formula-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search formulas by name, symbol (σ, E, Q, MRR), unit (MPa, kW, RPM), or application..."
          className="w-full pl-10 pr-10 py-2.5 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Formulas List (Card Accordion Architecture) */}
      <div className="space-y-4">
        {filteredFormulas.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 font-sans">
              No matching formulas found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-sans">
              No formulas matched your search "{searchQuery}" under the {activeCategory} category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFormulas.map((formula, index) => {
            const isExpanded = expandedIds.has(formula.id);

            return (
              <div
                key={formula.id}
                id={`item-${formula.id}`}
                className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div id={`f-${formula.id}`}>
                  <div id={`formula-${formula.id}`}>
                    <div id={formula.id}>
                      {formula.id === 'bernoulli' && <div id="bernoulli-equation" />}
                    </div>
                  </div>
                </div>
                {/* Collapsed State Header: Clickable Card Bar */}
                <div
                  onClick={() => toggleExpand(formula.id)}
                  className="py-2.5 sm:py-3 px-3.5 sm:px-4 cursor-pointer select-none hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Index Badge */}
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                          <Hash className="w-2.5 h-2.5" />
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Category Chip */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getCategoryBadgeColor(
                            formula.category
                          )}`}
                        >
                          {formula.category}
                        </span>

                        {/* Interactive Tool Pill */}
                        {formula.relatedCalculatorId && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <Calculator className="w-3 h-3" />
                            Interactive Tool
                          </span>
                        )}
                      </div>

                      {/* Formula Title */}
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate font-sans">
                        {formula.title}
                      </h3>
                    </div>

                    {/* Right side: KaTeX equation snippet + Expansion toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Formula Equation Box */}
                      <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 max-w-[260px] sm:max-w-xs overflow-x-auto scrollbar-none">
                        <MathView math={formula.formulaLatex} displayMode={false} className="text-sm font-semibold" />
                      </div>

                      {/* Expansion Chevron */}
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 transition-transform duration-200">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded State: Full Pedagogical Breakdown */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-white/10 p-4 sm:p-6 bg-slate-50/40 dark:bg-white/[0.01] space-y-5 animate-fadeIn">
                    {/* 1. Definition & Principle */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Definition & Engineering Principle
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6 font-sans">
                        {formula.definition}
                      </p>
                    </div>

                    {/* 2. Display KaTeX Equation */}
                    <div className="p-4 rounded-xl bg-white/80 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 text-center overflow-x-auto">
                      <span className="text-[11px] font-mono text-slate-400 block mb-1 text-left">
                        Governing Equation:
                      </span>
                      <div className="py-2 font-mono">
                        <MathView math={formula.formulaLatex} displayMode={true} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white" />
                      </div>
                    </div>

                    {/* 3. Variable Legend Table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Variable Legend
                      </h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/70">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 font-mono font-bold">
                              <th className="py-2.5 px-3 sm:px-4 w-28">Symbol</th>
                              <th className="py-2.5 px-3 sm:px-4 font-sans">Meaning / Parameter</th>
                              <th className="py-2.5 px-3 sm:px-4 w-36 font-mono">Standard Unit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06] font-medium">
                            {formula.variables.map((v, vIdx) => (
                              <tr key={vIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                                <td className="py-2 px-3 sm:px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  <MathView math={v.symbol} displayMode={false} />
                                </td>
                                <td className="py-2 px-3 sm:px-4 text-slate-700 dark:text-slate-300 font-sans">
                                  {v.meaning}
                                </td>
                                <td className="py-2 px-3 sm:px-4 font-mono text-slate-500 dark:text-slate-400">
                                  {v.unit}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 4. SI Unit Breakdown */}
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 text-xs">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        SI Units:
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-mono">
                        {formula.siUnits}
                      </span>
                    </div>

                    {/* 5. Solved Example Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-300/80 dark:border-amber-800/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                          <CheckCircle2 className="w-4 h-4" />
                          Diploma Solved Numerical Example
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Step-by-step
                        </span>
                      </div>

                      {/* Problem Statement */}
                      <div className="p-3 rounded-lg bg-white/80 dark:bg-zinc-950/70 border border-amber-300/60 dark:border-amber-900/40">
                        <span className="text-[11px] font-mono font-bold text-slate-400 block mb-1">
                          PROBLEM STATEMENT
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium font-sans">
                          {formula.solvedExample.problem}
                        </p>
                      </div>

                      {/* Given Data List */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                          GIVEN DATA:
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-0.5 pl-1 font-mono">
                          {formula.solvedExample.given.map((g, gIdx) => (
                            <li key={gIdx}>{g}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Step-by-Step Calculation */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                          CALCULATION STEPS:
                        </span>
                        <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-1">
                          {formula.solvedExample.steps.map((step, sIdx) => (
                            <li key={sIdx} className="leading-relaxed font-sans">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Final Answer in Bold Emerald */}
                      <div className="pt-2 border-t border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400">
                          Final Calculated Answer:
                        </span>
                        <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                          {formula.solvedExample.answer}
                        </span>
                      </div>
                    </div>

                    {/* 6. Launch Calculator Button (if relatedCalculatorId exists) */}
                    {formula.relatedCalculatorId && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          id={`btn-launch-calc-${formula.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) {
                              onNavigate('calculators', formula.relatedCalculatorId);
                            }
                          }}
                          className="min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 font-sans"
                        >
                          <Calculator className="w-4 h-4" />
                          <span>Launch Interactive Calculator</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FormulaLibrary;
