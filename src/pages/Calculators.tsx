import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CalculatorShell } from '../components/CalculatorShell';
import { ArrowRightLeft, Copy, Check, RotateCcw, Search, X } from 'lucide-react';
import { matchesMultiField } from '../utils/searchFilter';

export type CalculatorCategory = 'all' | 'workshop' | 'som' | 'utilities';

export interface CalculatorToolDef {
  id: string;
  title: string;
  category: 'workshop' | 'som' | 'utilities';
  formula: string;
  units?: string[];
  variables?: string[];
  tags?: string[];
  subject?: string;
}

const CATEGORY_TABS: { id: CalculatorCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'som', label: 'SOM' },
  { id: 'utilities', label: 'Utilities' },
];

const STANDARD_LATHE_RPMS = [45, 71, 112, 160, 224, 315, 450, 710, 1000, 1400, 2000];

const CONVERSION_FACTORS: Record<string, Record<string, number>> = {
  length: { mm: 0.001, cm: 0.01, m: 1, inch: 0.0254, ft: 0.3048 },
  pressure: { Pa: 1, kPa: 1000, 'MPa (N/mm²)': 1e6, GPa: 1e9, bar: 1e5, psi: 6894.76 },
  force: { N: 1, kN: 1000, kgf: 9.80665, lbf: 4.44822 },
  torque: { 'N·m': 1, 'kN·m': 1000, 'N·mm': 0.001, 'lbf·ft': 1.35582 },
  power: { W: 1, kW: 1000, 'HP (Metric)': 735.499, 'HP (Imperial)': 745.7 },
};

const CALCULATOR_TOOLS: CalculatorToolDef[] = [
  {
    id: 'rpm',
    title: 'Spindle RPM',
    category: 'workshop',
    subject: 'Workshop',
    formula: 'N = 1000V / (πD)',
    units: ['RPM', 'm/min', 'mm', 'ft/min', 'mm/s'],
    variables: ['N', 'V', 'D'],
    tags: ['spindle', 'speed', 'lathe', 'turning', 'gear'],
  },
  {
    id: 'cs',
    title: 'Cutting Speed',
    category: 'workshop',
    subject: 'Workshop',
    formula: 'V = πDN / 1000',
    units: ['m/min', 'm/s', 'mm', 'RPM'],
    variables: ['V', 'D', 'N'],
    tags: ['cutting speed', 'surface speed', 'velocity'],
  },
  {
    id: 'feed',
    title: 'Feed Rate',
    category: 'workshop',
    subject: 'Workshop',
    formula: 'f_m = f_t · z · N',
    units: ['mm/min', 'mm/tooth', 'RPM'],
    variables: ['f_m', 'f_t', 'z', 'N'],
    tags: ['feed rate', 'table feed', 'milling', 'teeth'],
  },
  {
    id: 'torque',
    title: 'Torque from Power',
    category: 'workshop',
    subject: 'Workshop',
    formula: 'T = 60000P / (2πN)',
    units: ['N·m', 'kW', 'RPM', 'W'],
    variables: ['T', 'P', 'N'],
    tags: ['torque', 'shaft', 'power', 'motor'],
  },
  {
    id: 'power',
    title: 'Power from Torque',
    category: 'workshop',
    subject: 'Workshop',
    formula: 'P = 2πNT / 60000',
    units: ['kW', 'W', 'N·m', 'RPM', 'HP'],
    variables: ['P', 'T', 'N'],
    tags: ['power', 'motor', 'torque'],
  },
  {
    id: 'stress',
    title: 'Direct Stress',
    category: 'som',
    subject: 'SOM',
    formula: 'σ = P / A',
    units: ['MPa', 'N/mm²', 'Pa', 'N', 'kN', 'mm²', 'm²'],
    variables: ['σ', 'P', 'A'],
    tags: ['direct stress', 'normal stress', 'axial load', 'tension', 'compression'],
  },
  {
    id: 'strain',
    title: 'Strain & Hooke',
    category: 'som',
    subject: 'SOM',
    formula: 'ε = ΔL / L',
    units: ['mm', 'm', 'MPa', 'GPa'],
    variables: ['ε', 'ΔL', 'L', 'E', 'σ'],
    tags: ['strain', 'hookes law', 'youngs modulus', 'elongation'],
  },
  {
    id: 'moi',
    title: 'Moment of Inertia',
    category: 'som',
    subject: 'SOM',
    formula: 'I_x, I_y, Z',
    units: ['mm⁴', 'm⁴', 'mm³'],
    variables: ['I_x', 'I_y', 'Z'],
    tags: ['moment of inertia', 'section modulus', 'beam bending'],
  },
  {
    id: 'converter',
    title: 'Universal SI Converter',
    category: 'utilities',
    subject: 'Utilities',
    formula: 'SI / Metric / Imperial',
    units: ['mm', 'm', 'g', 'kg', 'Pa', 'kPa', 'MPa', 'GPa', 'bar', 'psi', 'N', 'kN', 'kgf', 'lbf', 'N·m', 'W', 'kW', 'HP', '°C', '°F', 'K'],
    tags: ['converter', 'si', 'units', 'pressure', 'force', 'torque', 'power', 'mass', 'weight'],
  },
];

const TOOL_MAP: Record<string, { toolId: string; category: CalculatorCategory }> = {
  calc_rpm: { toolId: 'rpm', category: 'workshop' },
  rpm: { toolId: 'rpm', category: 'workshop' },
  'c-rpm': { toolId: 'rpm', category: 'workshop' },
  calc_cutspeed: { toolId: 'cs', category: 'workshop' },
  cs: { toolId: 'cs', category: 'workshop' },
  'c-cs': { toolId: 'cs', category: 'workshop' },
  calc_feed: { toolId: 'feed', category: 'workshop' },
  feed: { toolId: 'feed', category: 'workshop' },
  'c-feed': { toolId: 'feed', category: 'workshop' },
  'c-mtime': { toolId: 'feed', category: 'workshop' },
  calc_torque: { toolId: 'torque', category: 'workshop' },
  torque: { toolId: 'torque', category: 'workshop' },
  'c-torque': { toolId: 'torque', category: 'workshop' },
  calc_power: { toolId: 'power', category: 'workshop' },
  power: { toolId: 'power', category: 'workshop' },
  'c-power': { toolId: 'power', category: 'workshop' },
  calc_stress: { toolId: 'stress', category: 'som' },
  stress: { toolId: 'stress', category: 'som' },
  'c-stress': { toolId: 'stress', category: 'som' },
  'c-shear': { toolId: 'stress', category: 'som' },
  calc_strain: { toolId: 'strain', category: 'som' },
  strain: { toolId: 'strain', category: 'som' },
  'c-strain': { toolId: 'strain', category: 'som' },
  calc_moi: { toolId: 'moi', category: 'som' },
  moi: { toolId: 'moi', category: 'som' },
  'c-moi': { toolId: 'moi', category: 'som' },
  converter: { toolId: 'converter', category: 'utilities' },
  'c-converter': { toolId: 'converter', category: 'utilities' },
  'c-thermal': { toolId: 'converter', category: 'utilities' },
};

const toNum = (val: string | number, fallback = 0): number => {
  if (val === '' || val === null || val === undefined) return fallback;
  const n = Number(val);
  return isNaN(n) ? fallback : n;
};

const isBlank = (val: string | number): boolean => {
  return val === '' || val === null || val === undefined;
};

export interface CalculatorsProps {
  initialToolId?: string;
}

export const Calculators: React.FC<CalculatorsProps> = ({ initialToolId }) => {
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory>(() => {
    if (initialToolId && TOOL_MAP[initialToolId]) {
      return TOOL_MAP[initialToolId].category;
    }
    return 'all';
  });
  const [activeToolId, setActiveToolId] = useState<string>(() => {
    if (initialToolId && TOOL_MAP[initialToolId]) {
      return TOOL_MAP[initialToolId].toolId;
    }
    return 'rpm';
  });

  useEffect(() => {
    if (initialToolId && TOOL_MAP[initialToolId]) {
      setActiveToolId(TOOL_MAP[initialToolId].toolId);
      setActiveCategory(TOOL_MAP[initialToolId].category);
    }
  }, [initialToolId]);

  // Exact Location Anchoring: Listen for window.location.hash and select active tool
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const cleanHash = hash.replace(/^#/, '');

      const matchedKey = Object.keys(TOOL_MAP).find(
        (key) =>
          cleanHash === key ||
          cleanHash === `item-${key}` ||
          cleanHash === `calc-${key}` ||
          cleanHash === `c-${key}`
      );
      if (matchedKey) {
        const resolved = TOOL_MAP[matchedKey];
        setActiveToolId(resolved.toolId);
        setActiveCategory(resolved.category);
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
            document.getElementById(`calc-${hash}`) ||
            document.getElementById(hash.replace(/^item-/, '')) ||
            document.getElementById(hash.replace(/^calc-/, '')) ||
            document.getElementById(`item-${activeToolId}`) ||
            document.getElementById(`calc-${activeToolId}`);

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
  }, [activeToolId]);

  // ====================================================
  // 1. Spindle Speed (RPM)
  // ====================================================
  const [rpmCuttingSpeed, setRpmCuttingSpeed] = useState<string | number>(30); // m/min
  const [rpmDiameter, setRpmDiameter] = useState<string | number>(25); // mm
  const [rpmSpeedUnit, setRpmSpeedUnit] = useState<string>('m/min');
  const [rpmDiaUnit, setRpmDiaUnit] = useState<string>('mm');

  const getSpeedInMMin = () => {
    const v = toNum(rpmCuttingSpeed, 0);
    if (rpmSpeedUnit === 'ft/min') return v * 0.3048;
    if (rpmSpeedUnit === 'mm/s') return (v * 60) / 1000;
    return v;
  };
  const getDiaInMM = () => {
    const d = toNum(rpmDiameter, 0);
    if (rpmDiaUnit === 'cm') return d * 10;
    if (rpmDiaUnit === 'inch') return d * 25.4;
    return d;
  };
  const computedRPM = (!isBlank(rpmDiameter) && !isBlank(rpmCuttingSpeed) && getDiaInMM() > 0 && getSpeedInMMin() > 0)
    ? (1000 * getSpeedInMMin()) / (Math.PI * getDiaInMM())
    : null;
  const nearestLatheRPM = computedRPM !== null
    ? STANDARD_LATHE_RPMS.reduce((prev, curr) =>
        Math.abs(curr - computedRPM) < Math.abs(prev - computedRPM) ? curr : prev
      )
    : null;

  // ====================================================
  // 2. Cutting Speed (V)
  // ====================================================
  const [csDiameter, setCsDiameter] = useState<string | number>(25);
  const [csRpm, setCsRpm] = useState<string | number>(382);
  const [csDiaUnit, setCsDiaUnit] = useState<string>('mm');
  const computedCS = (!isBlank(csDiameter) && !isBlank(csRpm) && toNum(csDiameter) > 0 && toNum(csRpm) > 0)
    ? (Math.PI * (csDiaUnit === 'inch' ? toNum(csDiameter) * 25.4 : toNum(csDiameter)) * toNum(csRpm)) / 1000
    : null;

  // ====================================================
  // 3. Feed Rate (Milling/Turning Table Feed)
  // ====================================================
  const [feedPerTooth, setFeedPerTooth] = useState<string | number>(0.1); // mm/tooth
  const [numTeeth, setNumTeeth] = useState<string | number>(4); // teeth
  const [feedRpm, setFeedRpm] = useState<string | number>(600); // RPM
  const computedFeedRate = (!isBlank(feedPerTooth) && !isBlank(numTeeth) && !isBlank(feedRpm))
    ? toNum(feedPerTooth) * toNum(numTeeth) * toNum(feedRpm)
    : null; // mm/min

  // ====================================================
  // 4. Torque from Power
  // ====================================================
  const [torquePowerKw, setTorquePowerKw] = useState<string | number>(7.5); // kW
  const [torqueRpm, setTorqueRpm] = useState<string | number>(1440); // RPM
  const computedTorqueNm = (!isBlank(torquePowerKw) && !isBlank(torqueRpm) && toNum(torqueRpm) > 0)
    ? (toNum(torquePowerKw) * 60000) / (2 * Math.PI * toNum(torqueRpm))
    : null;

  // ====================================================
  // 5. Power from Torque
  // ====================================================
  const [powerTorqueNm, setPowerTorqueNm] = useState<string | number>(50); // N·m
  const [powerRpm, setPowerRpm] = useState<string | number>(1440); // RPM
  const computedPowerKw = (!isBlank(powerTorqueNm) && !isBlank(powerRpm))
    ? (2 * Math.PI * toNum(powerRpm) * toNum(powerTorqueNm)) / 60000
    : null;

  // ====================================================
  // 6. Direct Stress (P/A)
  // ====================================================
  const [stressLoad, setStressLoad] = useState<string | number>(40); // kN
  const [stressLoadUnit, setStressLoadUnit] = useState<string>('kN');
  const [stressGeom, setStressGeom] = useState<'round' | 'rect' | 'direct'>('round');
  const [stressDia, setStressDia] = useState<string | number>(20); // mm
  const [stressWidth, setStressWidth] = useState<string | number>(30); // mm
  const [stressThick, setStressThick] = useState<string | number>(10); // mm
  const [stressDirectArea, setStressDirectArea] = useState<string | number>(314.16); // mm²

  const computedStressArea =
    stressGeom === 'round'
      ? (!isBlank(stressDia) ? (Math.PI * Math.pow(toNum(stressDia), 2)) / 4 : 0)
      : stressGeom === 'rect'
      ? (!isBlank(stressWidth) && !isBlank(stressThick) ? toNum(stressWidth) * toNum(stressThick) : 0)
      : toNum(stressDirectArea);
  const loadInN = stressLoadUnit === 'kN' ? toNum(stressLoad) * 1000 : toNum(stressLoad);
  const computedStressMPa = (!isBlank(stressLoad) && computedStressArea > 0)
    ? loadInN / computedStressArea
    : null;

  // ====================================================
  // 7. Strain (ΔL/L)
  // ====================================================
  const [strainDeltaL, setStrainDeltaL] = useState<string | number>(0.06); // mm
  const [strainOrigL, setStrainOrigL] = useState<string | number>(200); // mm
  const [strainModulusE, setStrainModulusE] = useState<string | number>(200); // GPa
  const computedStrainVal = (!isBlank(strainDeltaL) && !isBlank(strainOrigL) && toNum(strainOrigL) > 0)
    ? toNum(strainDeltaL) / toNum(strainOrigL)
    : null;
  const computedStressFromStrain = (computedStrainVal !== null && !isBlank(strainModulusE))
    ? computedStrainVal * (toNum(strainModulusE) * 1000)
    : null;

  // ====================================================
  // 8. Moment of Inertia (I)
  // ====================================================
  const [moiShape, setMoiShape] = useState<'rect' | 'circ'>('rect');
  const [moiWidth, setMoiWidth] = useState<string | number>(50); // mm (b)
  const [moiDepth, setMoiDepth] = useState<string | number>(100); // mm (d)
  const [moiDia, setMoiDia] = useState<string | number>(50); // mm (d)

  const computedMoiIx = moiShape === 'rect'
    ? (!isBlank(moiWidth) && !isBlank(moiDepth) ? (toNum(moiWidth) * Math.pow(toNum(moiDepth), 3)) / 12 : null)
    : (!isBlank(moiDia) ? (Math.PI * Math.pow(toNum(moiDia), 4)) / 64 : null);
  const computedMoiIy = moiShape === 'rect'
    ? (!isBlank(moiWidth) && !isBlank(moiDepth) ? (toNum(moiDepth) * Math.pow(toNum(moiWidth), 3)) / 12 : null)
    : (!isBlank(moiDia) ? (Math.PI * Math.pow(toNum(moiDia), 4)) / 64 : null);
  const computedSectionModulus = moiShape === 'rect'
    ? (!isBlank(moiWidth) && !isBlank(moiDepth) ? (toNum(moiWidth) * Math.pow(toNum(moiDepth), 2)) / 6 : null)
    : (!isBlank(moiDia) ? (Math.PI * Math.pow(toNum(moiDia), 3)) / 32 : null);

  // ====================================================
  // 9. Universal SI Unit Converter
  // ====================================================
  const [convType, setConvType] = useState<'length' | 'pressure' | 'force' | 'torque' | 'power' | 'temp'>('pressure');
  const [convVal, setConvVal] = useState<string | number>(100);
  const [convFrom, setConvFrom] = useState<string>('MPa (N/mm²)');
  const [convTo, setConvTo] = useState<string>('bar');
  const [convCopied, setConvCopied] = useState<boolean>(false);

  // Convert unit to base SI, then to target
  const convertUnits = (val: number, type: string, from: string, to: string): number => {
    if (type === 'temp') {
      let kelvin = val;
      if (from === '°C') kelvin = val + 273.15;
      if (from === '°F') kelvin = (val - 32) * (5 / 9) + 273.15;
      if (to === '°C') return kelvin - 273.15;
      if (to === '°F') return (kelvin - 273.15) * (9 / 5) + 32;
      return kelvin;
    }
    const fMap = CONVERSION_FACTORS[type] || {};
    const base = val * (fMap[from] || 1);
    return base / (fMap[to] || 1);
  };

  const computedConv = !isBlank(convVal) ? convertUnits(toNum(convVal), convType, convFrom, convTo) : null;

  const handleSwapConv = () => {
    if (computedConv !== null) {
      setConvVal(Number(computedConv.toFixed(4)));
    }
    const prevFrom = convFrom;
    setConvFrom(convTo);
    setConvTo(prevFrom);
  };

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyConv = () => {
    if (computedConv !== null) {
      navigator.clipboard.writeText(`${computedConv} ${convTo}`);
      setConvCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setConvCopied(false), 2000);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = useMemo(() => {
    return CALCULATOR_TOOLS.filter((t) => {
      const categoryMatch = activeCategory === 'all' || t.category === activeCategory;
      if (!categoryMatch) return false;
      return matchesMultiField(t, searchQuery);
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Category Tabs & Multi-Field Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/50 dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/10 overflow-x-auto shrink-0">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                const first = CALCULATOR_TOOLS.find((t) => cat.id === 'all' || t.category === cat.id);
                if (first) setActiveToolId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56 flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, units..."
              className="w-full py-1.5 pl-8 pr-7 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500 shrink-0">
            {filteredTools.length} Tools
          </span>
        </div>
      </div>

      {/* Tool Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filteredTools.map((t) => (
          <button
            key={t.id}
            type="button"
            id={`chip-${t.id}`}
            onClick={() => setActiveToolId(t.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer active:scale-95 ${
              activeToolId === t.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold shadow-xs'
                : 'bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-emerald-500/40'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div id={`item-${activeToolId}`} key={activeToolId}>
        <div id={`calc-${activeToolId}`}>
          <div id={`c-${activeToolId}`}>
            <div id={activeToolId} />
            {activeToolId === 'stress' && <div id="calc-stress" />}
            {activeToolId === 'stress' && <div id="c-shear" />}
            {activeToolId === 'feed' && <div id="calc-feed" />}
            {activeToolId === 'feed' && <div id="c-mtime" />}
            {activeToolId === 'converter' && <div id="calc-converter" />}
            {activeToolId === 'converter' && <div id="c-thermal" />}
            {activeToolId === 'rpm' && <div id="calc-rpm" />}
            {activeToolId === 'cs' && <div id="calc-cs" />}
            {activeToolId === 'torque' && <div id="calc-torque" />}
            {activeToolId === 'power' && <div id="calc-power" />}
            {activeToolId === 'strain' && <div id="calc-strain" />}
            {activeToolId === 'moi' && <div id="calc-moi" />}
            {/* 1. Spindle RPM Calculator */}
        {activeToolId === 'rpm' && (
        <CalculatorShell
          title="Spindle Speed (RPM) Calculator"
          category="Workshop"
          badge="N = 1000V / πD"
          description="Calculates lathe chuck or milling arbor rotational velocity to match recommended workpiece cutting speeds."
          formulaLatex="N = \frac{1000 \cdot V}{\pi \cdot D}"
          formulaExplanation={`• Physical Significance:
Spindle rotational speed (N) establishes the correct linear tangential velocity at the cutting zone. Governed by Taylor's Tool Life equation (V · T^n = C), excessive spindle RPM generates extreme friction and thermal degradation (>800°C), causing rapid flank wear and edge breakdown. Running below optimal RPM promotes built-up edge (BUE), poor surface finish, and chatter.

• Machine Gearbox Snapping:
Conventional machine tool headstocks (all-geared lathes) use discrete stepped gearboxes arranged in geometric progression (step ratio φ ≈ 1.26 or 1.41). Machinists calculate N and snap down to the nearest lower available speed step to safeguard tool life.

• Variable Notation:
- N: Spindle rotational frequency (RPM or rev/min).
- V: Linear surface cutting velocity (m/min).
- D: Workpiece or cutter turning diameter (mm).
- 1000: Conversion constant converting millimetres to standard metres.
- π: Archimedes ratio (≈ 3.14159) relating diameter to circumferential perimeter.`}
          siBaseExplanation={{
            derivation: 'N = (1000 [mm/m] · V [m/min]) / (π · D [mm]) = [rev/min]',
            dimensions: '[M⁰ · L⁰ · T⁻¹]',
            baseUnits: 's⁻¹ (reciprocal second)',
            equivalences: '1 RPM = 1/60 Hz = 0.01667 s⁻¹ = 0.10472 rad/s',
          }}
          inputs={[
            {
              id: 'rpm-v',
              label: 'Cutting Speed (V)',
              symbol: 'V',
              value: rpmCuttingSpeed,
              onChange: (v) => setRpmCuttingSpeed(v),
              currentUnit: rpmSpeedUnit,
              onUnitChange: setRpmSpeedUnit,
              units: [
                { label: 'm/min', factorToBase: 1 },
                { label: 'ft/min', factorToBase: 0.3048 },
              ],
              presets: [
                { label: 'Mild Steel HSS (30)', value: 30 },
                { label: 'Alum Carbide (120)', value: 120 },
                { label: 'Cast Iron (22)', value: 22 },
              ],
            },
            {
              id: 'rpm-d',
              label: 'Workpiece / Tool Diameter (D)',
              symbol: 'D',
              value: rpmDiameter,
              onChange: (v) => setRpmDiameter(v),
              currentUnit: rpmDiaUnit,
              onUnitChange: setRpmDiaUnit,
              units: [
                { label: 'mm', factorToBase: 1 },
                { label: 'inch', factorToBase: 25.4 },
              ],
            },
          ]}
          outputs={[
            {
              id: 'rpm-out',
              label: 'Spindle Speed',
              symbol: 'N',
              baseValue: computedRPM,
              currentUnit: 'RPM',
              decimals: 1,
              highlight: true,
              subtext: nearestLatheRPM ? `Nearest standard lathe step: ${nearestLatheRPM} RPM (snapped down to avoid tool overheating)` : undefined,
            },
          ]}
          onReset={() => {
            setRpmCuttingSpeed('');
            setRpmDiameter('');
          }}
          onSwap={() => {
            if (computedRPM !== null) {
              setCsRpm(Number(computedRPM.toFixed(1)));
            }
            setCsDiameter(rpmDiameter);
            setCsDiaUnit(rpmDiaUnit);
            setActiveToolId('cs');
          }}
          swapTooltip="Swap to Cutting Speed with calculated RPM (⇄)"
          practicalTips={[
            'Always snap down to the nearest lower gear lever step when machining tough or work-hardening alloys.',
            'For carbide tooling, cutting speed can generally be 3× to 5× higher than standard High-Speed Steel (HSS).',
          ]}
        />
      )}

      {/* 2. Cutting Speed Calculator */}
      {activeToolId === 'cs' && (
        <CalculatorShell
          title="Cutting Speed (V) Calculator"
          category="Workshop"
          badge="V = πDN / 1000"
          description="Evaluates tangential peripheral cutting velocity from measured spindle RPM and diameter."
          formulaLatex="V = \frac{\pi \cdot D \cdot N}{1000}"
          formulaExplanation={`• Physical Significance:
Cutting speed (V) is the instantaneous linear peripheral velocity at which the workpiece material passes the cutting edge. It is the single most critical variable dictating shearing strain rate and cutting temperature in Merchant's circle analysis.

• High-Speed Machining Context:
Exceeding recommended cutting speed causes thermal softening of High-Speed Steel (HSS tempering limit ≈ 600°C) and accelerates diffusion wear in cemented tungsten carbides.

• Variable Notation:
- V: Surface cutting speed (m/min).
- D: Turning diameter of the workpiece or milling cutter (mm).
- N: Spindle rotational speed (RPM).
- 1000: Factor converting millimetres to metres.`}
          siBaseExplanation={{
            derivation: 'V = (π · D [mm] · N [1/min]) / 1000 [mm/m] = [m/min]',
            dimensions: '[M⁰ · L¹ · T⁻¹]',
            baseUnits: 'm · s⁻¹ (metre per second)',
            equivalences: '1 m/min = 0.01667 m/s = 3.28084 ft/min',
          }}
          inputs={[
            {
              id: 'cs-d',
              label: 'Diameter (D)',
              symbol: 'D',
              value: csDiameter,
              onChange: (v) => setCsDiameter(v),
              currentUnit: csDiaUnit,
              onUnitChange: setCsDiaUnit,
              units: [{ label: 'mm', factorToBase: 1 }, { label: 'inch', factorToBase: 25.4 }],
            },
            {
              id: 'cs-n',
              label: 'Spindle RPM (N)',
              symbol: 'N',
              value: csRpm,
              onChange: (v) => setCsRpm(v),
              units: [{ label: 'RPM', factorToBase: 1 }],
            },
          ]}
          outputs={[
            {
              id: 'cs-out',
              label: 'Cutting Speed',
              symbol: 'V',
              baseValue: computedCS,
              currentUnit: 'm/min',
              units: [{ label: 'm/min', factorFromBase: 1 }, { label: 'ft/min', factorFromBase: 3.28084 }],
              decimals: 2,
              highlight: true,
            },
          ]}
          onReset={() => {
            setCsDiameter('');
            setCsRpm('');
          }}
          onSwap={() => {
            if (computedCS !== null) {
              setRpmCuttingSpeed(Number(computedCS.toFixed(2)));
              setRpmSpeedUnit('m/min');
            }
            setRpmDiameter(csDiameter);
            setRpmDiaUnit(csDiaUnit);
            setActiveToolId('rpm');
          }}
          swapTooltip="Swap to Spindle RPM with calculated Cutting Speed (⇄)"
          practicalTips={[
            'As workpiece diameter decreases during multiple roughing passes on a lathe, increase RPM to maintain constant cutting speed.',
          ]}
        />
      )}

      {/* 3. Feed Rate Calculator */}
      {activeToolId === 'feed' && (
        <CalculatorShell
          title="Milling Table Feed Rate (f_m)"
          category="Workshop"
          badge="f_m = f_t · z · N"
          description="Computes linear table advance speed for milling cutters based on tooth chip load."
          formulaLatex="f_m = f_t \times z \times N"
          formulaExplanation={`• Physical Significance:
Table feed rate (f_m) sets the linear speed at which the worktable advances material into the rotating milling cutter. It directly establishes undeformed chip thickness (chip load h_max ≈ f_t) and cutting forces.

• Mechanical Implications:
If feed per tooth (f_t) is set too low (<0.02 mm), the cutter edge rubs and burnishes rather than shearing, inducing severe work hardening. If f_t is too high, cutting forces exceed tooth yield strength, causing catastrophic chipping or spindle stalling.

• Variable Notation:
- f_m: Linear table feed rate (mm/min).
- f_t: Feed per tooth or individual chip load (mm/tooth).
- z: Total number of active cutting teeth / flutes on the cutter.
- N: Spindle rotational frequency (RPM).`}
          siBaseExplanation={{
            derivation: 'f_m = f_t [mm/tooth] · z [teeth/rev] · N [rev/min] = [mm/min]',
            dimensions: '[M⁰ · L¹ · T⁻¹]',
            baseUnits: 'm · s⁻¹ (metre per second)',
            equivalences: '1 mm/min = 1.6667 × 10⁻⁵ m/s = 0.03937 in/min',
          }}
          inputs={[
            {
              id: 'feed-ft',
              label: 'Feed per Tooth (f_t)',
              symbol: 'f_t',
              value: feedPerTooth,
              onChange: (v) => setFeedPerTooth(v),
              units: [{ label: 'mm/tooth', factorToBase: 1 }],
              step: 0.02,
              presets: [
                { label: 'Finishing (0.05)', value: 0.05 },
                { label: 'Medium (0.10)', value: 0.10 },
                { label: 'Roughing (0.20)', value: 0.20 },
              ],
            },
            {
              id: 'feed-z',
              label: 'Number of Teeth / Flutes (z)',
              symbol: 'z',
              value: numTeeth,
              onChange: (v) => setNumTeeth(v),
              units: [{ label: 'teeth', factorToBase: 1 }],
              step: 1,
            },
            {
              id: 'feed-n',
              label: 'Cutter Spindle Speed (N)',
              symbol: 'N',
              value: feedRpm,
              onChange: (v) => setFeedRpm(v),
              units: [{ label: 'RPM', factorToBase: 1 }],
              step: 50,
            },
          ]}
          outputs={[
            {
              id: 'feed-out',
              label: 'Table Feed Rate',
              symbol: 'f_m',
              baseValue: computedFeedRate,
              currentUnit: 'mm/min',
              units: [{ label: 'mm/min', factorFromBase: 1 }, { label: 'm/min', factorFromBase: 0.001 }],
              decimals: 1,
              highlight: true,
            },
          ]}
          onReset={() => {
            setFeedPerTooth('');
            setNumTeeth('');
            setFeedRpm('');
          }}
          practicalTips={[
            'Use 2-flute end mills for aluminum slots for maximum chip clearance; use 4-flute end mills for steel profiling for higher rigidity.',
          ]}
        />
      )}

      {/* 4. Torque from Power */}
      {activeToolId === 'torque' && (
        <CalculatorShell
          title="Torque from Power & Speed"
          category="Workshop"
          badge="T = 60000P / 2πN"
          description="Calculates torsional moment transmitted by rotating motor shafts and machine spindles."
          formulaLatex="T = \frac{P \cdot 60000}{2 \pi N}"
          formulaExplanation={`• Physical Significance:
Torque (T) is the rotational twisting moment transmitted by drive shafts, gears, and machine tool spindles. In electric drive systems, electric induction motors operate in a constant-torque regime below base speed, and a constant-power regime above base speed (where T ∝ P/N).

• Engineering Design Context:
Shaft diameters are sized against maximum torsional shear stress (τ_max = 16T / πd³ for solid shafts). Heavy turning and large-diameter hole drilling demand maximum torque at low RPM, mandating geared speed reduction.

• Variable Notation:
- T: Shaft torsional moment (N·m).
- P: Transmitted mechanical power (kW).
- N: Shaft rotational speed (RPM).
- ω = 2πN / 60: Angular velocity (rad/s).`}
          siBaseExplanation={{
            derivation: 'T = P [kW · 1000 W/kW] / ω [rad/s] = [J/s] / [1/s] = [N · m]',
            dimensions: '[M¹ · L² · T⁻²]',
            baseUnits: 'kg · m² · s⁻²',
            equivalences: '1 N·m = 1 J = 0.73756 lbf·ft = 1000 N·mm',
          }}
          inputs={[
            {
              id: 't-p',
              label: 'Transmitted Power (P)',
              symbol: 'P',
              value: torquePowerKw,
              onChange: (v) => setTorquePowerKw(v),
              units: [{ label: 'kW', factorToBase: 1 }],
            },
            {
              id: 't-n',
              label: 'Shaft Speed (N)',
              symbol: 'N',
              value: torqueRpm,
              onChange: (v) => setTorqueRpm(v),
              units: [{ label: 'RPM', factorToBase: 1 }],
            },
          ]}
          outputs={[
            {
              id: 't-out',
              label: 'Torque',
              symbol: 'T',
              baseValue: computedTorqueNm,
              currentUnit: 'N·m',
              units: [{ label: 'N·m', factorFromBase: 1 }, { label: 'kN·m', factorFromBase: 0.001 }, { label: 'lbf·ft', factorFromBase: 0.73756 }],
              decimals: 2,
              highlight: true,
            },
          ]}
          onReset={() => {
            setTorquePowerKw('');
            setTorqueRpm('');
          }}
          onSwap={() => {
            if (computedTorqueNm !== null) {
              setPowerTorqueNm(Number(computedTorqueNm.toFixed(2)));
            }
            setPowerRpm(torqueRpm);
            setActiveToolId('power');
          }}
          swapTooltip="Swap to Power from Torque (⇄)"
        />
      )}

      {/* 5. Power from Torque */}
      {activeToolId === 'power' && (
        <CalculatorShell
          title="Power from Torque & Speed"
          category="Workshop"
          badge="P = 2πNT / 60000"
          description="Computes instantaneous mechanical output power from shaft torque and speed."
          formulaLatex="P = \frac{2 \pi N T}{60000}"
          formulaExplanation={`• Physical Significance:
Mechanical power (P) is the rate at which rotational work is performed. Sizing machine tool prime movers requires verifying that motor rated power exceeds cutting power plus transmission friction losses (η_mech ≈ 0.75 - 0.85).

• Variable Notation:
- P: Output mechanical power (kW).
- T: Shaft torque (N·m).
- N: Rotational velocity (RPM).
- 60000: Constant converting minutes to seconds and Watts to kilowatts.`}
          siBaseExplanation={{
            derivation: 'P = T [N·m] · ω [rad/s] / 1000 = [W] / 1000 = [kW]',
            dimensions: '[M¹ · L² · T⁻³]',
            baseUnits: 'kg · m² · s⁻³ (Watt = J/s)',
            equivalences: '1 kW = 1000 W = 1.34102 HP (Imperial) = 1.35962 HP (Metric)',
          }}
          inputs={[
            {
              id: 'p-t',
              label: 'Shaft Torque (T)',
              symbol: 'T',
              value: powerTorqueNm,
              onChange: (v) => setPowerTorqueNm(v),
              units: [{ label: 'N·m', factorToBase: 1 }],
            },
            {
              id: 'p-n',
              label: 'Rotational Speed (N)',
              symbol: 'N',
              value: powerRpm,
              onChange: (v) => setPowerRpm(v),
              units: [{ label: 'RPM', factorToBase: 1 }],
            },
          ]}
          outputs={[
            {
              id: 'p-out',
              label: 'Power',
              symbol: 'P',
              baseValue: computedPowerKw,
              currentUnit: 'kW',
              units: [{ label: 'kW', factorFromBase: 1 }, { label: 'HP', factorFromBase: 1.34102 }],
              decimals: 2,
              highlight: true,
            },
          ]}
          onReset={() => {
            setPowerTorqueNm('');
            setPowerRpm('');
          }}
          onSwap={() => {
            if (computedPowerKw !== null) {
              setTorquePowerKw(Number(computedPowerKw.toFixed(2)));
            }
            setTorqueRpm(powerRpm);
            setActiveToolId('torque');
          }}
          swapTooltip="Swap to Torque from Power (⇄)"
        />
      )}

      {/* 6. Direct Stress */}
      {activeToolId === 'stress' && (
        <CalculatorShell
          title="Direct Normal Stress (σ = P/A)"
          category="Strength of Materials"
          badge="σ = P / A"
          description="Computes axial tensile or compressive stress across prismatic sections."
          formulaLatex="\sigma = \frac{P}{A}"
          formulaExplanation={`• Physical Significance:
Direct normal stress (σ) is the internal resisting force per unit cross-sectional area developed inside a structural member subjected to axial tension or compression. 

• Saint-Venant's Principle & Failure Criteria:
Beyond a distance equal to the largest cross-sectional dimension from load application, normal stress distributes uniformly. Structural design requires keeping stress below the allowable limit (σ_allow = σ_yield / Factor of Safety). Under pure tension, ductile steels yield along 45° maximum shear planes (Tresca / Von Mises yield criteria). Under compression, slender members must be verified for Euler buckling before reaching yield stress.

• Variable Notation:
- σ: Direct axial stress (MPa or N/mm²).
- P: Axial external load (N or kN).
- A: Net cross-sectional area perpendicular to the force axis (mm²).`}
          siBaseExplanation={{
            derivation: 'σ = P [N] / A [m²] = [N/m²] = [Pa] = 10⁻⁶ [MPa]',
            dimensions: '[M¹ · L⁻¹ · T⁻²]',
            baseUnits: 'kg · m⁻¹ · s⁻²',
            equivalences: '1 MPa = 1 N/mm² = 10⁶ N/m² = 10 bar = 145.038 psi',
          }}
          inputs={[
            {
              id: 's-p',
              label: 'Axial Load (P)',
              symbol: 'P',
              value: stressLoad,
              onChange: (v) => setStressLoad(v),
              currentUnit: stressLoadUnit,
              onUnitChange: setStressLoadUnit,
              units: [{ label: 'kN', factorToBase: 1000 }, { label: 'N', factorToBase: 1 }],
            },
            ...(stressGeom === 'round'
              ? [
                  {
                    id: 's-d',
                    label: 'Diameter (d)',
                    symbol: 'd',
                    value: stressDia,
                    onChange: (v: string | number) => setStressDia(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]
              : stressGeom === 'rect'
              ? [
                  {
                    id: 's-w',
                    label: 'Width (b)',
                    symbol: 'b',
                    value: stressWidth,
                    onChange: (v: string | number) => setStressWidth(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                  {
                    id: 's-t',
                    label: 'Thickness (t)',
                    symbol: 't',
                    value: stressThick,
                    onChange: (v: string | number) => setStressThick(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]
              : [
                  {
                    id: 's-area',
                    label: 'Direct Area (A)',
                    symbol: 'A',
                    value: stressDirectArea,
                    onChange: (v: string | number) => setStressDirectArea(v),
                    units: [{ label: 'mm²', factorToBase: 1 }],
                  },
                ]),
          ]}
          extraContent={
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Cross-Section Profile:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'round', label: 'Solid Round Bar' },
                  { id: 'rect', label: 'Rectangular Bar' },
                  { id: 'direct', label: 'Direct Area Value' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setStressGeom(g.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                      stressGeom === g.id
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          }
          outputs={[
            {
              id: 's-out',
              label: 'Direct Stress',
              symbol: '\\sigma',
              baseValue: computedStressMPa,
              currentUnit: 'MPa (N/mm²)',
              units: [{ label: 'MPa (N/mm²)', factorFromBase: 1 }, { label: 'kPa', factorFromBase: 1000 }, { label: 'bar', factorFromBase: 10 }],
              decimals: 2,
              highlight: true,
              subtext: computedStressArea > 0 ? `Calculated Area: ${computedStressArea.toFixed(2)} mm²` : undefined,
            },
          ]}
          onReset={() => {
            setStressLoad('');
            setStressDia('');
            setStressWidth('');
            setStressThick('');
            setStressDirectArea('');
          }}
        />
      )}

      {/* 7. Strain & Hooke */}
      {activeToolId === 'strain' && (
        <CalculatorShell
          title="Strain & Hooke's Law (ε & σ)"
          category="Strength of Materials"
          badge="ε = ΔL / L"
          description="Computes axial linear strain and Hooke's law induced elastic stress."
          formulaLatex="\epsilon = \frac{\Delta L}{L}, \quad \sigma = E \cdot \epsilon"
          formulaExplanation={`• Physical Significance:
Engineering strain (ε) is a dimensionless measure of deformation expressing elongation relative to original gauge length. Hooke's Law establishes that within the proportional elastic limit, normal stress is directly proportional to strain via Young's Modulus of Elasticity (E).

• Atomic Stiffness & Elastic Limit:
Young's Modulus is an intrinsic fundamental material property dictated by interatomic metallic bonding forces (Mild Steel: 200–210 GPa, Aluminum: 69–71 GPa). Beyond the yield point (σ_y), plastic dislocation slip occurs, rendering Hooke's linear equation invalid.

• Variable Notation:
- ε: Linear longitudinal strain (dimensionless, mm/mm).
- ΔL: Total axial extension or contraction (mm).
- L: Initial gauge length (mm).
- E: Modulus of Elasticity / Young's Modulus (GPa).
- σ: Resulting elastic normal stress (MPa).`}
          siBaseExplanation={{
            derivation: 'ε = ΔL [m] / L [m] = [1] (Dimensionless ratio); σ = E · ε = [Pa]',
            dimensions: 'Strain: [M⁰ · L⁰ · T⁰]; Stress/Modulus: [M¹ · L⁻¹ · T⁻²]',
            baseUnits: 'Strain: Dimensionless; Modulus E: kg · m⁻¹ · s⁻²',
            equivalences: '1 GPa = 1000 MPa = 10⁹ N/m² = 10⁹ Pa',
          }}
          inputs={[
            {
              id: 'st-dl',
              label: 'Elongation (ΔL)',
              symbol: '\\Delta L',
              value: strainDeltaL,
              onChange: (v) => setStrainDeltaL(v),
              units: [{ label: 'mm', factorToBase: 1 }, { label: 'µm', factorToBase: 0.001 }],
            },
            {
              id: 'st-l',
              label: 'Original Gauge Length (L)',
              symbol: 'L',
              value: strainOrigL,
              onChange: (v) => setStrainOrigL(v),
              units: [{ label: 'mm', factorToBase: 1 }],
            },
            {
              id: 'st-e',
              label: "Young's Modulus (E)",
              symbol: 'E',
              value: strainModulusE,
              onChange: (v) => setStrainModulusE(v),
              units: [{ label: 'GPa', factorToBase: 1 }],
              presets: [
                { label: 'Structural Steel (200 GPa)', value: 200 },
                { label: 'Aluminum 6061 (70 GPa)', value: 70 },
                { label: 'Brass (100 GPa)', value: 100 },
              ],
            },
          ]}
          outputs={[
            {
              id: 'st-out-strain',
              label: 'Linear Strain',
              symbol: '\\epsilon',
              baseValue: computedStrainVal,
              decimals: 6,
              highlight: true,
            },
            {
              id: 'st-out-stress',
              label: 'Induced Elastic Stress',
              symbol: '\\sigma',
              baseValue: computedStressFromStrain,
              currentUnit: 'MPa',
              decimals: 2,
            },
          ]}
          onReset={() => {
            setStrainDeltaL('');
            setStrainOrigL('');
            setStrainModulusE('');
          }}
        />
      )}

      {/* 8. Moment of Inertia */}
      {activeToolId === 'moi' && (
        <CalculatorShell
          title="Moment of Inertia & Section Modulus (I & Z)"
          category="Strength of Materials"
          badge="I_x, I_y, Z"
          description="Evaluates second moment of area and elastic section modulus for beam flexure."
          formulaLatex={
            moiShape === 'rect'
              ? 'I_x = \\frac{b \\cdot d^3}{12}, \\quad Z_x = \\frac{b \\cdot d^2}{6}'
              : 'I_x = \\frac{\\pi \\cdot d^4}{64}, \\quad Z_x = \\frac{\\pi \\cdot d^3}{32}'
          }
          formulaExplanation={`• Physical Significance:
Second moment of area (I) quantifies a beam cross-section's geometric resistance to bending deflection under applied moments. Section modulus (Z = I / y_max) directly relates applied bending moment (M) to maximum extreme-fiber tensile and compressive stress via Euler-Bernoulli beam theory: σ = M / Z.

• Structural Geometry Efficiency:
Because depth (d) is cubed in the rectangular formula (I_x = b·d³ / 12), doubling depth increases bending rigidity 8-fold while only doubling cross-sectional mass. This fundamental mechanical principle explains the design of structural I-beams, hollow structural sections (HSS), and machine beds.

• Variable Notation:
- I_x, I_y: Second moments of area about centroidal x and y axes (mm⁴).
- Z_x: Elastic section modulus about x-axis (mm³).
- b: Base width (mm).
- d: Section depth or circle diameter (mm).`}
          siBaseExplanation={{
            derivation: 'I = ∫ y² dA = [mm²] · [mm²] = [mm⁴] = 10⁻¹² [m⁴]; Z = I / y = [mm³]',
            dimensions: 'I: [M⁰ · L⁴ · T⁰]; Section Modulus Z: [M⁰ · L³ · T⁰]',
            baseUnits: 'I: m⁴; Z: m³',
            equivalences: '1 m⁴ = 10¹² mm⁴; 1 m³ = 10⁹ mm³',
          }}
          inputs={
            moiShape === 'rect'
              ? [
                  {
                    id: 'moi-b',
                    label: 'Base Width (b)',
                    symbol: 'b',
                    value: moiWidth,
                    onChange: (v) => setMoiWidth(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                  {
                    id: 'moi-d',
                    label: 'Depth (d)',
                    symbol: 'd',
                    value: moiDepth,
                    onChange: (v) => setMoiDepth(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]
              : [
                  {
                    id: 'moi-dia',
                    label: 'Diameter (d)',
                    symbol: 'd',
                    value: moiDia,
                    onChange: (v) => setMoiDia(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]
          }
          extraContent={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMoiShape('rect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer active:scale-95 transition-all ${
                  moiShape === 'rect'
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-white/10'
                }`}
              >
                Rectangular Section
              </button>
              <button
                type="button"
                onClick={() => setMoiShape('circ')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer active:scale-95 transition-all ${
                  moiShape === 'circ'
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-white/10'
                }`}
              >
                Circular Section
              </button>
            </div>
          }
          outputs={[
            {
              id: 'moi-ix',
              label: 'Moment of Inertia (I_x)',
              symbol: 'I_x',
              baseValue: computedMoiIx,
              currentUnit: 'mm⁴',
              decimals: 0,
              highlight: true,
            },
            {
              id: 'moi-iy',
              label: 'Moment of Inertia (I_y)',
              symbol: 'I_y',
              baseValue: computedMoiIy,
              currentUnit: 'mm⁴',
              decimals: 0,
            },
            {
              id: 'moi-zx',
              label: 'Section Modulus (Z_x)',
              symbol: 'Z_x',
              baseValue: computedSectionModulus,
              currentUnit: 'mm³',
              decimals: 0,
            },
          ]}
          onReset={() => {
            setMoiWidth('');
            setMoiDepth('');
            setMoiDia('');
          }}
        />
      )}

      {/* 9. Universal SI Unit Converter */}
      {activeToolId === 'converter' && (
        <div className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Universal Engineering Unit Converter</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSwapConv}
                title="Swap values and units (⇄)"
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Swap ⇄</span>
              </button>
              <button
                type="button"
                onClick={() => setConvVal('')}
                title="Clear input"
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Unit Type Selectors */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'pressure', label: 'Pressure / Stress' },
              { id: 'length', label: 'Length' },
              { id: 'force', label: 'Force' },
              { id: 'torque', label: 'Torque' },
              { id: 'power', label: 'Power' },
              { id: 'temp', label: 'Temperature' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setConvType(t.id as any);
                  const defMap: Record<string, [string, string]> = {
                    pressure: ['MPa (N/mm²)', 'bar'],
                    length: ['mm', 'inch'],
                    force: ['kN', 'N'],
                    torque: ['N·m', 'lbf·ft'],
                    power: ['kW', 'HP (Metric)'],
                    temp: ['°C', 'K'],
                  };
                  setConvFrom(defMap[t.id][0]);
                  setConvTo(defMap[t.id][1]);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                  convType === t.id
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
                    : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Conversion Input / Output Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-zinc-950/50 rounded-xl border border-slate-200 dark:border-white/10 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">From Input Value &amp; Unit</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={convVal}
                  onChange={(e) => setConvVal(e.target.value)}
                  placeholder="Enter value..."
                  className="flex-1 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-3.5 py-2 text-base font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={convFrom}
                  onChange={(e) => setConvFrom(e.target.value)}
                  className="rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {convType === 'pressure' && ['Pa', 'kPa', 'MPa (N/mm²)', 'GPa', 'bar', 'psi'].map((u) => <option key={u} value={u}>{u}</option>)}
                  {convType === 'length' && ['mm', 'cm', 'm', 'inch', 'ft'].map((u) => <option key={u} value={u}>{u}</option>)}
                  {convType === 'force' && ['N', 'kN', 'kgf', 'lbf'].map((u) => <option key={u} value={u}>{u}</option>)}
                  {convType === 'torque' && ['N·m', 'kN·m', 'N·mm', 'lbf·ft'].map((u) => <option key={u} value={u}>{u}</option>)}
                  {convType === 'power' && ['W', 'kW', 'HP (Metric)', 'HP (Imperial)'].map((u) => <option key={u} value={u}>{u}</option>)}
                  {convType === 'temp' && ['°C', '°F', 'K'].map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/[0.03] dark:bg-zinc-950/50 rounded-xl border border-emerald-500/20 dark:border-white/10 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Target Output Unit</label>
                  <div className="flex items-center gap-1">
                    <select
                      value={convTo}
                      onChange={(e) => setConvTo(e.target.value)}
                      className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-2xs"
                    >
                      {convType === 'pressure' && ['Pa', 'kPa', 'MPa (N/mm²)', 'GPa', 'bar', 'psi'].map((u) => <option key={u} value={u}>{u}</option>)}
                      {convType === 'length' && ['mm', 'cm', 'm', 'inch', 'ft'].map((u) => <option key={u} value={u}>{u}</option>)}
                      {convType === 'force' && ['N', 'kN', 'kgf', 'lbf'].map((u) => <option key={u} value={u}>{u}</option>)}
                      {convType === 'torque' && ['N·m', 'kN·m', 'N·mm', 'lbf·ft'].map((u) => <option key={u} value={u}>{u}</option>)}
                      {convType === 'power' && ['W', 'kW', 'HP (Metric)', 'HP (Imperial)'].map((u) => <option key={u} value={u}>{u}</option>)}
                      {convType === 'temp' && ['°C', '°F', 'K'].map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={handleCopyConv}
                      title="Copy result"
                      className="min-h-[44px] min-w-[44px] rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {convCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {computedConv !== null
                      ? computedConv.toLocaleString(undefined, { maximumFractionDigits: 4 })
                      : '—'}
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-500 dark:text-slate-400">{convTo}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-blue-100 dark:border-slate-800 flex justify-between">
                <span>Direct SI Conversion</span>
                <span>Swap ⇄ transfers both values & units</span>
              </div>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};
