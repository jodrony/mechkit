import React, { useState } from 'react';
import { Copy, Check, RotateCcw, ArrowLeftRight, HelpCircle, Info, Lightbulb } from 'lucide-react';
import { MathView } from './MathView';

export interface CalculatorUnit {
  label: string;
  factorToBase: number; // Multiply by this to get standard SI / base unit
}

export interface CalculatorOutputUnit {
  label: string;
  factorFromBase: number; // Multiply base unit by this to get target unit
}

export interface CalculatorInputItem {
  id: string;
  label: string;
  symbol?: string;
  value: number | string;
  onChange: (value: string | number) => void;
  units?: CalculatorUnit[];
  currentUnit?: string;
  onUnitChange?: (unit: string) => void;
  placeholder?: string;
  step?: number;
  min?: number;
  max?: number;
  helperText?: string;
  presets?: Array<{ label: string; value: number | string }>;
}

export interface CalculatorOutputItem {
  id: string;
  label: string;
  symbol?: string;
  baseValue: number | null;
  units?: CalculatorOutputUnit[];
  currentUnit?: string;
  onUnitChange?: (unit: string) => void;
  decimals?: number;
  highlight?: boolean;
  subtext?: string;
  status?: 'normal' | 'safe' | 'warning' | 'danger';
}

export interface CalculatorShellProps {
  title: string;
  category: 'Workshop' | 'Strength of Materials' | 'Thermal' | 'Materials' | 'Drawing' | 'General';
  badge?: string;
  description: string;
  formulaLatex: string;
  formulaExplanation?: string;
  siBaseExplanation?: {
    derivation: string;
    dimensions: string;
    baseUnits: string;
    equivalences?: string;
  };
  inputs: CalculatorInputItem[];
  outputs: CalculatorOutputItem[];
  onReset: () => void;
  onSwap?: () => void;
  swapTooltip?: string;
  practicalTips?: string[];
  extraContent?: React.ReactNode;
}

export const CalculatorShell: React.FC<CalculatorShellProps> = ({
  title,
  category,
  badge,
  description,
  formulaLatex,
  formulaExplanation,
  siBaseExplanation,
  inputs,
  outputs,
  onReset,
  onSwap,
  swapTooltip = 'Swap calculation target (⇄)',
  practicalTips = [],
  extraContent,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [educationalTab, setEducationalTab] = useState<'explanation' | 'si'>('explanation');

  const handleCopy = (output: CalculatorOutputItem, displayVal: string) => {
    const textToCopy = `${output.label} (${output.symbol || ''}): ${displayVal} ${output.currentUnit || ''}`.trim();
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(output.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Workshop':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Strength of Materials':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Thermal':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'Materials':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Drawing':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/[0.08] bg-slate-50/60 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(category)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {category}
            </span>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                {badge}
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Interactive Tool
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{description}</p>
      </div>

      {/* Main Grid: On desktop it's 2 columns (Inputs/Outputs on Left, Explanations on Right).
          On mobile it's strictly: 1. Inputs -> 2. Action Bar -> 3. Output -> 4. Secondary Controls -> 5. Explanation */}
      <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column (Mobile: Items 1 to 4) */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          
          {/* 1. Primary Inputs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Primary Inputs
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Live Sync</span>
            </div>

            <div className="space-y-3.5">
              {inputs.map((inp) => (
                <div key={inp.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor={inp.id} className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      {inp.symbol && (
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <MathView math={inp.symbol} displayMode={false} />:
                        </span>
                      )}
                      <span>{inp.label}</span>
                    </label>
                    {inp.helperText && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {inp.helperText}
                      </span>
                    )}
                  </div>

                  <div className="relative flex rounded-xl shadow-xs">
                    <input
                      type="number"
                      id={inp.id}
                      value={inp.value === null || inp.value === undefined ? '' : inp.value}
                      onChange={(e) => inp.onChange(e.target.value)}
                      placeholder={inp.placeholder || '0'}
                      step={inp.step || 'any'}
                      min={inp.min}
                      max={inp.max}
                      className="block w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-3.5 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono text-base transition-all"
                    />
                    {inp.units && inp.units.length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                        <select
                          aria-label={`${inp.label} unit`}
                          value={inp.currentUnit || inp.units[0].label}
                          onChange={(e) => inp.onUnitChange?.(e.target.value)}
                          className="h-9 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-zinc-800 py-0 pl-2.5 pr-7 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          {inp.units.map((u) => (
                            <option key={u.label} value={u.label}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Preset quick buttons if provided */}
                  {inp.presets && inp.presets.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 self-center">Presets:</span>
                      {inp.presets.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => inp.onChange(p.value)}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 font-mono transition-colors cursor-pointer active:scale-95"
                        >
                          {p.label} ({p.value})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Action Bar (Ergonomic, min 44x44px touch targets directly under inputs) */}
          <div className="flex items-center gap-2.5 pt-1">
            {onSwap && (
              <button
                type="button"
                onClick={onSwap}
                title={swapTooltip}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs font-sans"
              >
                <ArrowLeftRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Swap Units ⇄</span>
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              title="Clear all fields to blank"
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs font-sans"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Clear / Reset</span>
            </button>
          </div>

          {/* 3. Calculated Output (Prominent result card with emerald glow) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
                2. Calculated Output
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Result
              </span>
            </div>

            <div className="space-y-3">
              {outputs.map((out) => {
                let displayVal = '—';
                if (out.baseValue !== null && !isNaN(out.baseValue) && isFinite(out.baseValue)) {
                  let factor = 1;
                  if (out.units && out.currentUnit) {
                    const match = out.units.find((u) => u.label === out.currentUnit);
                    if (match) factor = match.factorFromBase;
                  }
                  const calculated = out.baseValue * factor;
                  const decimals = out.decimals !== undefined ? out.decimals : 2;
                  displayVal = calculated.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: decimals,
                  });
                }

                return (
                  <div
                    key={out.id}
                    className="p-5 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06] shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide font-sans">
                        {out.symbol && (
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                            <MathView math={out.symbol} displayMode={false} />:
                          </span>
                        )}
                        <span>{out.label}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {out.units && out.units.length > 0 && (
                          <select
                            aria-label={`${out.label} target unit`}
                            value={out.currentUnit || out.units[0].label}
                            onChange={(e) => out.onUnitChange?.(e.target.value)}
                            className="h-8 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-800 py-0 pl-2.5 pr-7 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs font-mono"
                          >
                            {out.units.map((u) => (
                              <option key={u.label} value={u.label}>
                                {u.label}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(out, displayVal)}
                          title="Copy result to clipboard"
                          className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                        >
                          {copiedId === out.id ? (
                            <Check className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2.5 pt-1">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums">
                        {displayVal}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {out.currentUnit || ''}
                      </span>
                    </div>

                    {out.subtext && (
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-2.5 pt-2.5 border-t border-emerald-500/20 dark:border-emerald-500/20 font-sans">
                        {out.subtext}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Secondary Controls (Material Presets, standard lookup tables - MUST appear below output) */}
          {extraContent && (
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
                3. Secondary Controls & Parameters
              </span>
              <div className="p-3.5 bg-slate-50/80 dark:bg-zinc-900/50 rounded-xl border border-slate-200 dark:border-white/10">
                {extraContent}
              </div>
            </div>
          )}
        </div>

        {/* Right Column on Desktop / Bottom on Mobile: Item 5 (Deep Explanation, SI Analysis, & Practical Tips) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Formula Strip & Educational Tab Toggles */}
          <div className="p-4 bg-slate-100/80 dark:bg-zinc-900/60 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Governing Equation
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEducationalTab('explanation')}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-sans active:scale-95 ${
                    educationalTab === 'explanation'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Theory & Notation
                </button>
                {siBaseExplanation && (
                  <button
                    type="button"
                    onClick={() => setEducationalTab('si')}
                    className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-sans active:scale-95 ${
                      educationalTab === 'si'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    SI Analysis
                  </button>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-zinc-950/80 rounded-xl border border-slate-200 dark:border-white/10 text-center shadow-2xs font-mono">
              <MathView math={formulaLatex} displayMode={true} />
            </div>
          </div>

          {/* Educational Tab 1: Detailed Mechanical Engineering Explanation */}
          {educationalTab === 'explanation' && (
            <div className="p-5 sm:p-6 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-sans">
                <Info className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Mechanical Engineering Significance & Failure Context
                </h4>
              </div>

              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {formulaExplanation || 'Calculates the target parameter using standard mechanical engineering kinematic and kinetic relations.'}
              </div>
            </div>
          )}

          {/* Educational Tab 2: Rigorous SI Analysis & Base Unit Breakdown */}
          {educationalTab === 'si' && siBaseExplanation && (
            <div className="p-5 sm:p-6 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-sans">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  SI Dimensional Analysis & Base Unit Breakdown
                </h4>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50/70 dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/10">
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold tracking-wider">
                    Step-by-Step Derivation
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed font-mono">
                    {siBaseExplanation.derivation}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50/70 dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/10">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold tracking-wider">
                      Dimensional Formula
                    </div>
                    <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {siBaseExplanation.dimensions}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50/70 dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/10">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold tracking-wider">
                      Fundamental SI Base Units
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100 mt-1">
                      {siBaseExplanation.baseUnits}
                    </div>
                  </div>
                </div>

                {siBaseExplanation.equivalences && (
                  <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                    <strong>Equivalences:</strong> {siBaseExplanation.equivalences}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Practical Shop / Lab Tips */}
          {practicalTips.length > 0 && (
            <div className="p-4 bg-amber-500/10 dark:bg-amber-500/10 rounded-2xl border border-amber-500/20 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 font-sans">
                <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Shop / Lab Practical Guidance</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1 text-xs leading-relaxed font-sans">
                {practicalTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
