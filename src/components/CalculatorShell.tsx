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
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Strength of Materials':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Thermal':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      case 'Materials':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      case 'Drawing':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-mech-card border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900/40 dark:via-mech-card dark:to-slate-900/40">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(category)}`}>
              {category}
            </span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-mech-orange/10 text-mech-orange dark:bg-orange-950/50 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
                {badge}
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Interactive Tool
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
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
                        <span className="font-mono text-mech-blue dark:text-blue-400 font-bold">
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
                      className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-mech-blue focus:outline-none focus:ring-2 focus:ring-mech-blue/20 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 font-mono text-base transition-colors"
                    />
                    {inp.units && inp.units.length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                        <select
                          aria-label={`${inp.label} unit`}
                          value={inp.currentUnit || inp.units[0].label}
                          onChange={(e) => inp.onUnitChange?.(e.target.value)}
                          className="h-9 rounded-lg border-0 bg-slate-100 dark:bg-slate-800 py-0 pl-2.5 pr-7 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-inset focus:ring-mech-blue cursor-pointer"
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
                          className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono transition-colors cursor-pointer"
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
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-mech-blue dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
              >
                <ArrowLeftRight className="w-4 h-4 text-mech-blue dark:text-blue-400" />
                <span>Swap Units ⇄</span>
              </button>
            )}
            <button
              type="button"
              onClick={onReset}
              title="Clear all fields to blank"
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Clear / Reset</span>
            </button>
          </div>

          {/* 3. Calculated Output (Highly prominent result card) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Calculated Output
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
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
                    className="p-5 rounded-2xl border-2 bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border-blue-300/90 dark:border-blue-700/80 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                        {out.symbol && (
                          <span className="font-mono text-mech-blue dark:text-blue-400 font-extrabold text-sm">
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
                            className="h-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-0 pl-2.5 pr-7 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-mech-blue cursor-pointer shadow-2xs"
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
                          className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-2xs"
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
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                        {displayVal}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-mech-blue dark:text-blue-400">
                        {out.currentUnit || ''}
                      </span>
                    </div>

                    {out.subtext && (
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-2.5 pt-2.5 border-t border-blue-200/70 dark:border-slate-800">
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
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Secondary Controls & Parameters
              </span>
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                {extraContent}
              </div>
            </div>
          )}
        </div>

        {/* Right Column on Desktop / Bottom on Mobile: Item 5 (Deep Explanation, SI Analysis, & Practical Tips) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Formula Strip & Educational Tab Toggles */}
          <div className="p-4 bg-slate-100/90 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Governing Equation
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEducationalTab('explanation')}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    educationalTab === 'explanation'
                      ? 'bg-mech-blue text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Theory & Notation
                </button>
                {siBaseExplanation && (
                  <button
                    type="button"
                    onClick={() => setEducationalTab('si')}
                    className={`min-h-[36px] px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      educationalTab === 'si'
                        ? 'bg-mech-blue text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    SI Analysis
                  </button>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-2xs">
              <MathView math={formulaLatex} displayMode={true} />
            </div>
          </div>

          {/* Educational Tab 1: Detailed Mechanical Engineering Explanation */}
          {educationalTab === 'explanation' && (
            <div className="p-5 sm:p-6 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2 text-mech-blue dark:text-blue-400">
                <Info className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Mechanical Engineering Significance & Failure Context
                </h4>
              </div>

              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                {formulaExplanation || 'Calculates the target parameter using standard mechanical engineering kinematic and kinetic relations.'}
              </div>
            </div>
          )}

          {/* Educational Tab 2: Rigorous SI Analysis & Base Unit Breakdown */}
          {educationalTab === 'si' && siBaseExplanation && (
            <div className="p-5 sm:p-6 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  SI Dimensional Analysis & Base Unit Breakdown
                </h4>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold tracking-wider">
                    Step-by-Step Derivation
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed font-mono">
                    {siBaseExplanation.derivation}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold tracking-wider">
                      Dimensional Formula
                    </div>
                    <div className="text-base font-mono font-bold text-mech-blue dark:text-blue-400 mt-1">
                      {siBaseExplanation.dimensions}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold tracking-wider">
                      Fundamental SI Base Units
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100 mt-1">
                      {siBaseExplanation.baseUnits}
                    </div>
                  </div>
                </div>

                {siBaseExplanation.equivalences && (
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300 font-mono">
                    <strong>Equivalences:</strong> {siBaseExplanation.equivalences}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Practical Shop / Lab Tips */}
          {practicalTips.length > 0 && (
            <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Shop / Lab Practical Guidance</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1 text-xs leading-relaxed">
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
