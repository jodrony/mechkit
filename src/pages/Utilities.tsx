import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorShell } from '../components/CalculatorShell';
import { Scale, ArrowRightLeft, Weight, Search, X } from 'lucide-react';
import { matchesMultiField } from '../utils/searchFilter';

const toNum = (val: string | number, fallback = 0): number => {
  if (val === '' || val === null || val === undefined) return fallback;
  const n = Number(val);
  return isNaN(n) ? fallback : n;
};

const isBlank = (val: string | number): boolean => {
  return val === '' || val === null || val === undefined;
};

// Engineering Materials for Density & Stock Weight
const MATERIALS = [
  { name: 'Mild Steel (MS / Fe 410)', density: 7850, badge: '7,850 kg/m³' },
  { name: 'Stainless Steel (SS 304)', density: 7930, badge: '7,930 kg/m³' },
  { name: 'Aluminum (Al 6061-T6)', density: 2700, badge: '2,700 kg/m³' },
  { name: 'Brass (Cu-Zn Alloy)', density: 8500, badge: '8,500 kg/m³' },
  { name: 'Copper (Pure Cu)', density: 8960, badge: '8,960 kg/m³' },
  { name: 'Grey Cast Iron (CI)', density: 7200, badge: '7,200 kg/m³' },
  { name: 'Titanium (Ti Grade 5)', density: 4500, badge: '4,500 kg/m³' },
  { name: 'Structural Bronze', density: 8800, badge: '8,800 kg/m³' },
  { name: 'Polymer (Nylon / PTFE)', density: 1140, badge: '1,140 kg/m³' },
  { name: 'Water (Pure at 4°C)', density: 1000, badge: '1,000 kg/m³' },
];

export type UtilityCategory = 'all' | 'stock' | 'converters';

export interface UtilityToolDef {
  id: string;
  title: string;
  category: 'stock' | 'converters';
  subject: string;
  icon: any;
  units?: string[];
  variables?: string[];
  tags?: string[];
}

const CATEGORY_TABS: { id: UtilityCategory; label: string }[] = [
  { id: 'all', label: 'All Utilities' },
  { id: 'stock', label: 'Physical & Stock' },
  { id: 'converters', label: '10 Unit Converters' },
];

export type ConverterConfig = {
  id: string;
  name: string;
  badge: string;
  units: { label: string; toBase: number }[];
  defaultFrom: string;
  defaultTo: string;
  defaultVal: string | number;
  explanation: string;
  latex: string;
  derivation: string;
  dimensions: string;
  siBase: string;
  equivalences: string;
};

// Hoisted outside component to prevent massive object reallocation on every keystroke
export const CONVERTER_SPECS: Record<string, ConverterConfig> = {
  conv_press: {
    id: 'conv_press',
    name: 'Pressure & Stress Converter',
    badge: 'M·L⁻¹·T⁻²',
    units: [
      { label: 'Pa (N/m²)', toBase: 1 },
      { label: 'kPa', toBase: 1000 },
      { label: 'MPa (N/mm²)', toBase: 1e6 },
      { label: 'GPa', toBase: 1e9 },
      { label: 'bar', toBase: 1e5 },
      { label: 'mbar', toBase: 100 },
      { label: 'psi (lbf/in²)', toBase: 6894.76 },
      { label: 'ksi', toBase: 6.89476e6 },
      { label: 'atm', toBase: 101325 },
      { label: 'mmHg (Torr)', toBase: 133.322 },
    ],
    defaultFrom: 'MPa (N/mm²)',
    defaultTo: 'bar',
    defaultVal: 200,
    explanation: `• Physical Significance:
Pressure and stress describe normal force distributed per unit area. In fluid mechanics, pressure acts isotropically (Pascal's law). In solid mechanics, stress tensors resolve into normal (tensile/compressive) and shear components.

• Variable Notation:
- p = F / A: Pressure / Stress.
- F: Normal force (N).
- A: Surface area (m²).`,
    latex: 'p = \\frac{F}{A}',
    derivation: '1 Pa = 1 N/m² = (1 kg · m/s²) / m² = 1 kg · m⁻¹ · s⁻²',
    dimensions: '[M¹ · L⁻¹ · T⁻²]',
    siBase: 'kg · m⁻¹ · s⁻² (Pascal)',
    equivalences: '1 MPa = 10 bar = 145.038 psi = 10⁶ Pa = 1 N/mm²',
  },
  conv_area: {
    id: 'conv_area',
    name: 'Cross-Section & Surface Area Converter',
    badge: 'L²',
    units: [
      { label: 'mm²', toBase: 1e-6 },
      { label: 'cm²', toBase: 1e-4 },
      { label: 'm²', toBase: 1 },
      { label: 'in²', toBase: 0.00064516 },
      { label: 'ft²', toBase: 0.092903 },
      { label: 'acres', toBase: 4046.86 },
      { label: 'hectares', toBase: 10000 },
    ],
    defaultFrom: 'cm²',
    defaultTo: 'mm²',
    defaultVal: 25,
    explanation: `• Physical Significance:
Area quantifies 2D geometric surface extension. Essential in calculating load-bearing capacity (σ = P/A), heat transfer surface (Q = h·A·ΔT), and hydraulic cylinder bore force (F = p·A).`,
    latex: 'A = \\int \\int dx \\, dy',
    derivation: '1 m² = (100 cm)² = 10,000 cm² = (1,000 mm)² = 10⁶ mm²',
    dimensions: '[M⁰ · L² · T⁰]',
    siBase: 'm² (square metre)',
    equivalences: '1 m² = 10⁶ mm² = 1,550 in² = 10.7639 ft²',
  },
  conv_vol: {
    id: 'conv_vol',
    name: 'Volume & Capacity Converter',
    badge: 'L³',
    units: [
      { label: 'mm³', toBase: 1e-9 },
      { label: 'cm³ (cc)', toBase: 1e-6 },
      { label: 'm³', toBase: 1 },
      { label: 'Liters', toBase: 1e-3 },
      { label: 'mL', toBase: 1e-6 },
      { label: 'in³', toBase: 1.6387e-5 },
      { label: 'ft³', toBase: 0.0283168 },
      { label: 'gal (US)', toBase: 0.00378541 },
    ],
    defaultFrom: 'Liters',
    defaultTo: 'cm³ (cc)',
    defaultVal: 5,
    explanation: `• Physical Significance:
Volume measures 3-dimensional spatial capacity. Governs engine cylinder displacement (V_d = (π/4)·D²·L_stroke), reservoir hydraulic fluid capacity, and hydrostatic buoyancy.`,
    latex: 'V = \\int \\int \\int dx \\, dy \\, dz',
    derivation: '1 m³ = (10 dm)³ = 1,000 dm³ = 1,000 Liters = 10⁶ cm³',
    dimensions: '[M⁰ · L³ · T⁰]',
    siBase: 'm³ (cubic metre)',
    equivalences: '1 m³ = 1,000 Liters = 61,023.7 in³ = 264.172 gal (US)',
  },
  conv_mass: {
    id: 'conv_mass',
    name: 'Weight & Mass Converter',
    badge: 'M',
    units: [
      { label: 'mg', toBase: 1e-6 },
      { label: 'g', toBase: 1e-3 },
      { label: 'kg', toBase: 1 },
      { label: 'tonne (MT)', toBase: 1000 },
      { label: 'lb', toBase: 0.45359237 },
      { label: 'oz', toBase: 0.0283495 },
      { label: 'ton (US)', toBase: 907.185 },
    ],
    defaultFrom: 'kg',
    defaultTo: 'lb',
    defaultVal: 50,
    explanation: `• Physical Significance:
Mass is an intrinsic measure of matter and inertia (resistance to acceleration: F = m·a). Distinct from gravitational weight, which varies with local gravitational field strength (W = m·g).`,
    latex: 'm = \\int_V \\rho \\, dV',
    derivation: '1 kg = 1,000 g = 10⁶ mg = 0.001 Metric Tonne',
    dimensions: '[M¹ · L⁰ · T⁰]',
    siBase: 'kg (kilogram)',
    equivalences: '1 kg = 2.20462 lb = 35.274 oz = 0.001 tonne',
  },
  conv_temp: {
    id: 'conv_temp',
    name: 'Temperature Converter',
    badge: 'Θ',
    units: [
      { label: '°C', toBase: 1 },
      { label: '°F', toBase: 1 },
      { label: 'K', toBase: 1 },
      { label: '°R', toBase: 1 },
    ],
    defaultFrom: '°C',
    defaultTo: '°F',
    defaultVal: 100,
    explanation: `• Physical Significance:
Temperature measures average microscopic kinetic energy of particles. Thermodynamic heat engine efficiency (Carnot cycle η = 1 - T_L / T_H) strictly requires absolute temperature in Kelvin (K).`,
    latex: 'T_K = T_C + 273.15, \\quad T_F = T_C \\times \\frac{9}{5} + 32',
    derivation: 'Zero Kelvin (0 K) = -273.15 °C = Absolute Zero (zero kinetic enthalpy)',
    dimensions: '[Θ¹]',
    siBase: 'K (Kelvin)',
    equivalences: '0 °C = 273.15 K = 32 °F = 491.67 °R',
  },
  conv_angle: {
    id: 'conv_angle',
    name: 'Angle Converter',
    badge: 'rad',
    units: [
      { label: 'deg (°)', toBase: Math.PI / 180 },
      { label: 'rad', toBase: 1 },
      { label: 'grad', toBase: Math.PI / 200 },
      { label: 'arcmin (′)', toBase: Math.PI / (180 * 60) },
      { label: 'arcsec (″)', toBase: Math.PI / (180 * 3600) },
    ],
    defaultFrom: 'deg (°)',
    defaultTo: 'rad',
    defaultVal: 45,
    explanation: `• Physical Significance:
Planar angle measures circular sector subtended arc length divided by radius. Radian is the natural mathematical angle unit where arc length s = r·θ and angular velocity v = r·ω.`,
    latex: '\\theta_{rad} = \\theta_{deg} \\times \\frac{\\pi}{180}',
    derivation: '1 complete circle = 360° = 2π radians = 400 grad',
    dimensions: '[M⁰ · L⁰ · T⁰] (Dimensionless ratio)',
    siBase: 'rad (radian = m/m)',
    equivalences: '1 rad = 180° / π ≈ 57.2958° = 3,437.75 arcmin',
  },
  conv_speed: {
    id: 'conv_speed',
    name: 'Speed & Velocity Converter',
    badge: 'L·T⁻¹',
    units: [
      { label: 'm/s', toBase: 1 },
      { label: 'km/h', toBase: 1 / 3.6 },
      { label: 'ft/s', toBase: 0.3048 },
      { label: 'ft/min', toBase: 0.3048 / 60 },
      { label: 'mph', toBase: 0.44704 },
      { label: 'knots', toBase: 0.514444 },
    ],
    defaultFrom: 'm/s',
    defaultTo: 'km/h',
    defaultVal: 20,
    explanation: `• Physical Significance:
Velocity is the time rate of change of position. In mechanical engineering, governs fluid pipe flow Reynolds number (Re = ρvD/μ), piston speeds, and machine tool rapid traverse.`,
    latex: 'v = \\frac{ds}{dt}',
    derivation: '1 km/h = (1,000 m) / (3,600 s) = 1/3.6 m/s ≈ 0.2778 m/s',
    dimensions: '[M⁰ · L¹ · T⁻¹]',
    siBase: 'm · s⁻¹ (metre per second)',
    equivalences: '1 m/s = 3.6 km/h = 2.23694 mph = 196.85 ft/min',
  },
  conv_force: {
    id: 'conv_force',
    name: 'Force Converter',
    badge: 'M·L·T⁻²',
    units: [
      { label: 'N', toBase: 1 },
      { label: 'kN', toBase: 1000 },
      { label: 'MN', toBase: 1e6 },
      { label: 'dyn', toBase: 1e-5 },
      { label: 'kgf (kp)', toBase: 9.80665 },
      { label: 'lbf', toBase: 4.448222 },
    ],
    defaultFrom: 'kN',
    defaultTo: 'N',
    defaultVal: 25,
    explanation: `• Physical Significance:
Force is an interaction that accelerates mass according to Newton's second law (F = m·a). Structural design resolves static equilibrium (ΣF = 0) and dynamic cutting tool thrust forces.`,
    latex: 'F = m \\cdot a = \\frac{dp}{dt}',
    derivation: '1 Newton = 1 kg accelerated at 1 m/s² = 1 kg · m · s⁻²',
    dimensions: '[M¹ · L¹ · T⁻²]',
    siBase: 'kg · m · s⁻² (Newton)',
    equivalences: '1 kN = 1,000 N = 101.972 kgf = 224.809 lbf',
  },
  conv_power: {
    id: 'conv_power',
    name: 'Power Converter',
    badge: 'M·L²·T⁻³',
    units: [
      { label: 'W', toBase: 1 },
      { label: 'kW', toBase: 1000 },
      { label: 'MW', toBase: 1e6 },
      { label: 'HP (Metric)', toBase: 735.49875 },
      { label: 'HP (Imperial)', toBase: 745.69987 },
      { label: 'ft·lbf/s', toBase: 1.355818 },
      { label: 'BTU/h', toBase: 0.293071 },
    ],
    defaultFrom: 'kW',
    defaultTo: 'HP (Metric)',
    defaultVal: 15,
    explanation: `• Physical Significance:
Power is the rate of performing work or transferring energy per unit time. Metric Horsepower (PS / CV) is defined as lifting 75 kg against gravity by 1 metre in 1 second (75 × 9.80665 = 735.5 W).`,
    latex: 'P = \\frac{dW}{dt} = F \\cdot v = \\tau \\cdot \\omega',
    derivation: '1 Watt = 1 Joule/second = 1 (N · m) / s = 1 kg · m² · s⁻³',
    dimensions: '[M¹ · L² · T⁻³]',
    siBase: 'kg · m² · s⁻³ (Watt = J/s)',
    equivalences: '1 kW = 1000 W = 1.341 HP (Imperial) = 1.3596 HP (Metric)',
  },
  conv_energy: {
    id: 'conv_energy',
    name: 'Energy & Work Converter',
    badge: 'M·L²·T⁻²',
    units: [
      { label: 'J', toBase: 1 },
      { label: 'kJ', toBase: 1000 },
      { label: 'MJ', toBase: 1e6 },
      { label: 'cal', toBase: 4.184 },
      { label: 'kcal', toBase: 4184 },
      { label: 'Wh', toBase: 3600 },
      { label: 'kWh', toBase: 3.6e6 },
      { label: 'BTU', toBase: 1055.06 },
      { label: 'ft·lbf', toBase: 1.355818 },
    ],
    defaultFrom: 'kJ',
    defaultTo: 'kcal',
    defaultVal: 418.4,
    explanation: `• Physical Significance:
Energy is the capacity to perform mechanical work or transfer heat. According to the First Law of Thermodynamics, energy is conserved across kinetic, potential, internal, and enthalpy states.`,
    latex: 'W = \\int F \\cdot ds, \\quad Q = m \\cdot c_p \\cdot \\Delta T',
    derivation: '1 Joule = 1 N · m = 1 (kg · m/s²) · m = 1 kg · m² · s⁻²',
    dimensions: '[M¹ · L² · T⁻²]',
    siBase: 'kg · m² · s⁻² (Joule)',
    equivalences: '1 kWh = 3.6 × 10⁶ J = 3.6 MJ = 860.42 kcal = 3,412.14 BTU',
  },
};

export const calculateConversion = (spec: ConverterConfig, val: string | number, fromUnit: string, toUnit: string): number | null => {
  if (isBlank(val)) return null;
  const num = toNum(val);

  if (spec.id === 'conv_temp') {
    let kelvin = num;
    if (fromUnit === '°C') kelvin = num + 273.15;
    else if (fromUnit === '°F') kelvin = (num - 32) * (5 / 9) + 273.15;
    else if (fromUnit === '°R') kelvin = num * (5 / 9);

    if (toUnit === '°C') return kelvin - 273.15;
    if (toUnit === '°F') return (kelvin - 273.15) * (9 / 5) + 32;
    if (toUnit === '°R') return kelvin * 1.8;
    return kelvin;
  }

  const fMap = spec.units.find((u) => u.label === fromUnit);
  const tMap = spec.units.find((u) => u.label === toUnit);
  if (!fMap || !tMap) return null;

  const baseVal = num * fMap.toBase;
  return baseVal / tMap.toBase;
};

export const UTILITY_TOOLS: UtilityToolDef[] = [
  {
    id: 'density',
    title: 'Density / Mass / Volume',
    category: 'stock',
    subject: 'General',
    icon: Scale,
    units: ['kg/m³', 'kg', 'g', 'tonne', 'lb', 'm³', 'cm³', 'mm³', 'Liters'],
    variables: ['ρ', 'm', 'V'],
    tags: ['density', 'mass', 'volume', 'steel', 'aluminum', 'materials'],
  },
  {
    id: 'stock_weight',
    title: 'Material Stock Weight',
    category: 'stock',
    subject: 'Workshop',
    icon: Weight,
    units: ['kg', 'kg/m', 'mm', 'm', 'g', 'N'],
    variables: ['mass', 'density', 'volume', 'length'],
    tags: ['stock', 'weight', 'mass', 'round bar', 'flat plate', 'pipe', 'hex'],
  },
  {
    id: 'conv_press',
    title: 'Pressure & Stress',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['Pa', 'kPa', 'MPa', 'GPa', 'bar', 'mbar', 'psi', 'ksi', 'atm', 'mmHg', 'Torr'],
    tags: ['pressure', 'stress', 'bar', 'psi', 'pascal'],
  },
  {
    id: 'conv_area',
    title: 'Area Converter',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['mm²', 'cm²', 'm²', 'in²', 'ft²', 'acres', 'hectares'],
    tags: ['area', 'square meter', 'surface area'],
  },
  {
    id: 'conv_vol',
    title: 'Volume Converter',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['mm³', 'cm³', 'm³', 'Liters', 'mL', 'gal', 'in³', 'ft³'],
    tags: ['volume', 'liter', 'cubic meter', 'capacity'],
  },
  {
    id: 'conv_mass',
    title: 'Weight & Mass',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['g', 'kg', 'tonne', 'lb', 'oz', 'mg'],
    tags: ['weight', 'mass', 'kilogram', 'pound', 'gram'],
  },
  {
    id: 'conv_force',
    title: 'Force Converter',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['N', 'kN', 'MN', 'kgf', 'lbf', 'dyne'],
    tags: ['force', 'newton', 'kilonewton', 'pound force'],
  },
  {
    id: 'conv_speed',
    title: 'Speed & Velocity',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['m/s', 'km/h', 'ft/s', 'mph', 'knot'],
    tags: ['speed', 'velocity', 'meters per second'],
  },
  {
    id: 'conv_power',
    title: 'Power Converter',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['W', 'kW', 'MW', 'HP', 'BTU/h'],
    tags: ['power', 'watt', 'kilowatt', 'horsepower'],
  },
  {
    id: 'conv_energy',
    title: 'Energy & Work',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['J', 'kJ', 'MJ', 'cal', 'kcal', 'kWh', 'BTU', 'eV'],
    tags: ['energy', 'work', 'joule', 'calorie', 'kilowatt-hour'],
  },
  {
    id: 'conv_temp',
    title: 'Temperature',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['°C', '°F', 'K', '°R'],
    tags: ['temperature', 'celsius', 'fahrenheit', 'kelvin'],
  },
  {
    id: 'conv_angle',
    title: 'Angle Converter',
    category: 'converters',
    subject: 'General',
    icon: ArrowRightLeft,
    units: ['deg', 'rad', 'grad', 'arcmin', 'arcsec'],
    tags: ['angle', 'degree', 'radian'],
  },
];

const UTILITY_TOOL_MAP: Record<string, { toolId: string; category: UtilityCategory }> = {
  density: { toolId: 'density', category: 'stock' },
  'u-density': { toolId: 'density', category: 'stock' },
  stock_weight: { toolId: 'stock_weight', category: 'stock' },
  'u-weight': { toolId: 'stock_weight', category: 'stock' },
  conv_press: { toolId: 'conv_press', category: 'converters' },
  'u-conv-press': { toolId: 'conv_press', category: 'converters' },
  conv_area: { toolId: 'conv_area', category: 'converters' },
  'u-conv-area': { toolId: 'conv_area', category: 'converters' },
  conv_vol: { toolId: 'conv_vol', category: 'converters' },
  'u-conv-vol': { toolId: 'conv_vol', category: 'converters' },
  conv_mass: { toolId: 'conv_mass', category: 'converters' },
  'u-conv-mass': { toolId: 'conv_mass', category: 'converters' },
  conv_force: { toolId: 'conv_force', category: 'converters' },
  'u-conv-force': { toolId: 'conv_force', category: 'converters' },
  conv_speed: { toolId: 'conv_speed', category: 'converters' },
  'u-conv-speed': { toolId: 'conv_speed', category: 'converters' },
  conv_power: { toolId: 'conv_power', category: 'converters' },
  'u-conv-power': { toolId: 'conv_power', category: 'converters' },
  conv_energy: { toolId: 'conv_energy', category: 'converters' },
  'u-conv-energy': { toolId: 'conv_energy', category: 'converters' },
  conv_temp: { toolId: 'conv_temp', category: 'converters' },
  'u-conv-temp': { toolId: 'conv_temp', category: 'converters' },
  conv_angle: { toolId: 'conv_angle', category: 'converters' },
  'u-conv-angle': { toolId: 'conv_angle', category: 'converters' },
  'u-univ': { toolId: 'conv_press', category: 'converters' },
  'u-conv': { toolId: 'conv_press', category: 'converters' },
};

export interface UtilitiesProps {
  initialToolId?: string;
}

export const Utilities: React.FC<UtilitiesProps> = ({ initialToolId }) => {
  const [activeCategory, setActiveCategory] = useState<UtilityCategory>(() => {
    if (initialToolId && UTILITY_TOOL_MAP[initialToolId]) {
      return UTILITY_TOOL_MAP[initialToolId].category;
    }
    return 'all';
  });
  const [activeToolId, setActiveToolId] = useState<string>(() => {
    if (initialToolId && UTILITY_TOOL_MAP[initialToolId]) {
      return UTILITY_TOOL_MAP[initialToolId].toolId;
    }
    return 'density';
  });

  useEffect(() => {
    if (initialToolId) {
      const resolved = UTILITY_TOOL_MAP[initialToolId];
      if (resolved) {
        setActiveToolId(resolved.toolId);
        setActiveCategory(resolved.category);
      } else {
        setActiveToolId(initialToolId);
      }
    }
  }, [initialToolId]);

  // Exact Location Anchoring: Listen for window.location.hash and select active tool
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const cleanHash = hash.replace(/^#/, '');

      // Check if hash matches a utility tool (e.g. density, stock_weight, conv_press, etc.)
      const matchedKey = Object.keys(UTILITY_TOOL_MAP).find(
        (key) =>
          cleanHash === key ||
          cleanHash === `item-${key}` ||
          cleanHash === `utility-${key}` ||
          cleanHash === `u-${key}`
      );
      if (matchedKey) {
        const resolved = UTILITY_TOOL_MAP[matchedKey];
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
            document.getElementById(`utility-${hash}`) ||
            document.getElementById(`u-${hash}`) ||
            document.getElementById(hash.replace(/^item-/, '')) ||
            document.getElementById(hash.replace(/^utility-/, '')) ||
            document.getElementById(`item-${activeToolId}`) ||
            document.getElementById(`utility-${activeToolId}`);

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
  // 1. Density / Mass / Volume Calculator
  // ====================================================
  const [densityMode, setDensityMode] = useState<'mass' | 'volume' | 'density'>('mass');
  const [rhoVal, setRhoVal] = useState<string | number>(7850); // kg/m³
  const [massVal, setMassVal] = useState<string | number>(15.7); // kg
  const [volVal, setVolVal] = useState<string | number>(0.002); // m³
  const [volUnit, setVolUnit] = useState<string>('m³');
  const [massUnit, setMassUnit] = useState<string>('kg');

  const getVolInM3 = () => {
    const v = toNum(volVal, 0);
    if (volUnit === 'cm³') return v * 1e-6;
    if (volUnit === 'mm³') return v * 1e-9;
    if (volUnit === 'Liters') return v * 1e-3;
    return v;
  };

  const getMassInKg = () => {
    const m = toNum(massVal, 0);
    if (massUnit === 'g') return m * 1e-3;
    if (massUnit === 'tonne') return m * 1000;
    if (massUnit === 'lb') return m * 0.453592;
    return m;
  };

  const computedTarget = () => {
    if (densityMode === 'mass') {
      if (isBlank(rhoVal) || isBlank(volVal)) return null;
      return toNum(rhoVal) * getVolInM3(); // kg
    }
    if (densityMode === 'volume') {
      if (isBlank(massVal) || isBlank(rhoVal) || toNum(rhoVal) <= 0) return null;
      return getMassInKg() / toNum(rhoVal); // m³
    }
    // solve for density
    const vM3 = getVolInM3();
    if (isBlank(massVal) || isBlank(volVal) || vM3 <= 0) return null;
    return getMassInKg() / vM3; // kg/m³
  };

  const computedDensityOut = computedTarget();

  // ====================================================
  // 2. Material Stock Weight Calculator
  // ====================================================
  const [stockProfile, setStockProfile] = useState<'round' | 'flat' | 'pipe' | 'hex'>('round');
  const [selectedMatIdx, setSelectedMatIdx] = useState<number>(0);
  const [stockDia, setStockDia] = useState<string | number>(50); // mm
  const [stockLength, setStockLength] = useState<string | number>(1000); // mm
  const [stockWidth, setStockWidth] = useState<string | number>(100); // mm
  const [stockThick, setStockThick] = useState<string | number>(20); // mm
  const [stockOuterDia, setStockOuterDia] = useState<string | number>(60); // mm
  const [stockWallThick, setStockWallThick] = useState<string | number>(5); // mm
  const [stockHexAfl, setStockHexAfl] = useState<string | number>(32); // mm across flats

  const matDensity = MATERIALS[selectedMatIdx].density; // kg/m³

  const computeStockVolumeM3 = () => {
    const L_m = toNum(stockLength, 0) / 1000;
    if (L_m <= 0) return 0;

    if (stockProfile === 'round') {
      const d_m = toNum(stockDia, 0) / 1000;
      return (Math.PI * Math.pow(d_m, 2) / 4) * L_m;
    }
    if (stockProfile === 'flat') {
      const w_m = toNum(stockWidth, 0) / 1000;
      const t_m = toNum(stockThick, 0) / 1000;
      return w_m * t_m * L_m;
    }
    if (stockProfile === 'pipe') {
      const do_m = toNum(stockOuterDia, 0) / 1000;
      const wt_m = toNum(stockWallThick, 0) / 1000;
      const di_m = Math.max(0, do_m - 2 * wt_m);
      return (Math.PI * (Math.pow(do_m, 2) - Math.pow(di_m, 2)) / 4) * L_m;
    }
    if (stockProfile === 'hex') {
      const s_m = toNum(stockHexAfl, 0) / 1000;
      const area = (Math.sqrt(3) / 2) * Math.pow(s_m, 2);
      return area * L_m;
    }
    return 0;
  };

  const stockVolumeM3 = computeStockVolumeM3();
  const stockMassKg = stockVolumeM3 > 0 ? stockVolumeM3 * matDensity : null;
  const stockWeightN = stockMassKg !== null ? stockMassKg * 9.80665 : null;
  const stockWeightPerMeter = (stockMassKg !== null && toNum(stockLength) > 0)
    ? (stockMassKg / (toNum(stockLength) / 1000))
    : null;

  // ====================================================
  // 3-12. Dedicated Unit Converters (10 Types)
  // ====================================================

  const [convStates, setConvStates] = useState<Record<string, { val: string | number; from: string; to: string }>>(() => {
    const init: Record<string, { val: string | number; from: string; to: string }> = {};
    Object.keys(CONVERTER_SPECS).forEach((key) => {
      const spec = CONVERTER_SPECS[key];
      init[key] = {
        val: spec.defaultVal,
        from: spec.defaultFrom,
        to: spec.defaultTo,
      };
    });
    return init;
  });

  const getConvState = (id: string) => {
    return convStates[id] || {
      val: CONVERTER_SPECS[id].defaultVal,
      from: CONVERTER_SPECS[id].defaultFrom,
      to: CONVERTER_SPECS[id].defaultTo,
    };
  };

  const updateConvState = (id: string, patch: Partial<{ val: string | number; from: string; to: string }>) => {
    setConvStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = useMemo(() => {
    return UTILITY_TOOLS.filter((t) => {
      const categoryMatch = activeCategory === 'all' || t.category === activeCategory;
      if (!categoryMatch) return false;
      return matchesMultiField(t, searchQuery);
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Category Tabs & Multi-Field Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-white/[0.04] rounded-xl border border-slate-200 dark:border-white/10 overflow-x-auto shrink-0">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                const first = UTILITY_TOOLS.find((t) => cat.id === 'all' || t.category === cat.id);
                if (first) setActiveToolId(first.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
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
              placeholder="Search utilities, units..."
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
          <span className="text-xs font-mono font-bold text-slate-500 shrink-0">
            {filteredTools.length} Utilities
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
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-500 shadow-sm ring-1 ring-emerald-400/30 font-bold'
                : 'bg-white/80 dark:bg-zinc-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* 1. Density / Mass / Volume */}
      {activeToolId === 'density' && (
        <div id="item-density">
          <div id="utility-density">
            <div id="u-density">
              <div id="density" />
              <CalculatorShell
          title="Density / Mass / Volume Calculator"
          category="General"
          badge="ρ = m / V"
          description="Solves for mass, volume, or material bulk density with verified engineering alloy standards."
          formulaLatex={
            densityMode === 'mass'
              ? 'm = \\rho \\times V'
              : densityMode === 'volume'
              ? 'V = \\frac{m}{\\rho}'
              : '\\rho = \\frac{m}{V}'
          }
          formulaExplanation={`• Physical Significance:
Mass density (ρ) measures the degree of atomic compactness in solid crystalline lattices or fluid phases. In mechanical design, material density directly dictates component weight, rotational inertia (I = m·r²), and natural vibrational frequencies (ω_n = √(k/m)).

• Porosity & Castings:
Wrought steels attain theoretical density (≈7,850 kg/m³), whereas sand castings can exhibit micro-porosity (reducing density by 1–3%).

• Variable Notation:
- m: Component mass (kg).
- V: Displaced volume (m³).
- ρ: Material mass density (kg/m³).`}
          siBaseExplanation={{
            derivation: 'ρ = m [kg] / V [m³] = [kg/m³]',
            dimensions: '[M¹ · L⁻³ · T⁰]',
            baseUnits: 'kg · m⁻³ (kilogram per cubic metre)',
            equivalences: '1000 kg/m³ = 1 g/cm³ = 1 kg/L = 62.428 lb/ft³',
          }}
          extraContent={
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Calculation Target:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'mass', label: 'Solve Mass (m = ρ · V)' },
                    { id: 'volume', label: 'Solve Volume (V = m / ρ)' },
                    { id: 'density', label: 'Solve Density (ρ = m / V)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDensityMode(m.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                        densityMode === m.id
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material density quick presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Material Presets (ρ):</span>
                <div className="flex flex-wrap gap-1.5">
                  {MATERIALS.map((mat) => (
                    <button
                      key={mat.name}
                      type="button"
                      onClick={() => setRhoVal(mat.density)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono font-medium border transition-colors cursor-pointer active:scale-95 ${
                        toNum(rhoVal) === mat.density
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                      }`}
                    >
                      {mat.name.split(' (')[0]} ({mat.density})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          inputs={[
            ...(densityMode !== 'density'
              ? [
                  {
                    id: 'rho-input',
                    label: 'Material Density (ρ)',
                    symbol: '\\rho',
                    value: rhoVal,
                    onChange: (v: string | number) => setRhoVal(v),
                    units: [{ label: 'kg/m³', factorToBase: 1 }, { label: 'g/cm³', factorToBase: 1000 }],
                  },
                ]
              : []),
            ...(densityMode !== 'mass'
              ? [
                  {
                    id: 'mass-input',
                    label: 'Component Mass (m)',
                    symbol: 'm',
                    value: massVal,
                    onChange: (v: string | number) => setMassVal(v),
                    currentUnit: massUnit,
                    onUnitChange: setMassUnit,
                    units: [
                      { label: 'kg', factorToBase: 1 },
                      { label: 'g', factorToBase: 1e-3 },
                      { label: 'tonne', factorToBase: 1000 },
                      { label: 'lb', factorToBase: 0.453592 },
                    ],
                  },
                ]
              : []),
            ...(densityMode !== 'volume'
              ? [
                  {
                    id: 'vol-input',
                    label: 'Volume (V)',
                    symbol: 'V',
                    value: volVal,
                    onChange: (v: string | number) => setVolVal(v),
                    currentUnit: volUnit,
                    onUnitChange: setVolUnit,
                    units: [
                      { label: 'm³', factorToBase: 1 },
                      { label: 'Liters', factorToBase: 1e-3 },
                      { label: 'cm³', factorToBase: 1e-6 },
                      { label: 'mm³', factorToBase: 1e-9 },
                    ],
                  },
                ]
              : []),
          ]}
          outputs={[
            {
              id: 'density-out',
              label:
                densityMode === 'mass'
                  ? 'Calculated Mass'
                  : densityMode === 'volume'
                  ? 'Calculated Volume'
                  : 'Calculated Density',
              symbol: densityMode === 'mass' ? 'm' : densityMode === 'volume' ? 'V' : '\\rho',
              baseValue: computedDensityOut,
              currentUnit: densityMode === 'mass' ? 'kg' : densityMode === 'volume' ? 'm³' : 'kg/m³',
              units:
                densityMode === 'mass'
                  ? [
                      { label: 'kg', factorFromBase: 1 },
                      { label: 'g', factorFromBase: 1000 },
                      { label: 'lb', factorFromBase: 2.20462 },
                      { label: 'tonne', factorFromBase: 0.001 },
                    ]
                  : densityMode === 'volume'
                  ? [
                      { label: 'm³', factorFromBase: 1 },
                      { label: 'Liters', factorFromBase: 1000 },
                      { label: 'cm³', factorFromBase: 1e6 },
                    ]
                  : [
                      { label: 'kg/m³', factorFromBase: 1 },
                      { label: 'g/cm³', factorFromBase: 0.001 },
                    ],
              decimals: 4,
              highlight: true,
            },
          ]}
          onReset={() => {
            setRhoVal('');
            setMassVal('');
            setVolVal('');
          }}
          onSwap={() => {
            if (densityMode === 'mass') setDensityMode('volume');
            else if (densityMode === 'volume') setDensityMode('density');
            else setDensityMode('mass');
          }}
          swapTooltip="Cycle calculation target (Mass ⇄ Volume ⇄ Density)"
          practicalTips={[
            'Mild steel weighs roughly 7.85 kg per litre of solid volume.',
            'Aluminum is approximately 1/3 the weight of steel (2,700 vs 7,850 kg/m³).',
          ]}
        />
            </div>
          </div>
        </div>
      )}

      {/* 2. Material Stock Weight Calculator */}
      {activeToolId === 'stock_weight' && (
        <div id="item-stock_weight">
          <div id="utility-stock_weight">
            <div id="u-weight">
              <div id="stock_weight" />
              <CalculatorShell
          title="Material Stock Weight & Bill of Materials (BOM)"
          category="General"
          badge="Stock Profiles"
          description="Calculates total raw mass, gravitational force, and unit weight per metre for commercial stock profiles."
          formulaLatex={
            stockProfile === 'round'
              ? 'm = \\rho \\times \\frac{\\pi d^2}{4} \\times L'
              : stockProfile === 'flat'
              ? 'm = \\rho \\times (w \\times t) \\times L'
              : stockProfile === 'pipe'
              ? 'm = \\rho \\times \\frac{\\pi (D_o^2 - D_i^2)}{4} \\times L'
              : 'm = \\rho \\times \\left(\\frac{\\sqrt{3}}{2} s^2\\right) \\times L'
          }
          formulaExplanation={`• Physical Significance:
Calculates gross material procurement mass and structural self-weight for standard mill bar stock profiles. Crucial for manufacturing process planning, material cost estimation, and crane lifting capacity verification.

• Kerf & Cut Allowances:
In workshop sawing, each cut consumes 2.5–3.5 mm of length (saw kerf). Always add 5–10 mm extra stock length per workpiece for facing operations on the lathe.

• Variable Notation:
- m: Stock piece mass (kg).
- ρ: Alloy mass density (kg/m³).
- L: Bar stock cut length (mm).
- d: Round diameter, w: width, t: thickness, s: hex width across flats (mm).`}
          siBaseExplanation={{
            derivation: 'Weight Force = m [kg] · g [9.80665 m/s²] = [N] = 10⁻³ [kN]',
            dimensions: 'Mass: [M¹ · L⁰ · T⁰]; Weight Force: [M¹ · L¹ · T⁻²]',
            baseUnits: 'Mass: kg; Weight Force: kg · m · s⁻² (N)',
            equivalences: '1 kg mass weighs 9.807 N = 2.2046 lbf on Earth surface',
          }}
          extraContent={
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Profile Geometry:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'round', label: 'Solid Round Bar' },
                    { id: 'flat', label: 'Flat Bar / Plate' },
                    { id: 'pipe', label: 'Hollow Pipe / Tube' },
                    { id: 'hex', label: 'Hexagonal Bar' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setStockProfile(p.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                        stockProfile === p.id
                          ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-400/30 font-bold'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans">Alloy Selection:</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {MATERIALS[selectedMatIdx].badge}
                  </span>
                </div>
                <select
                  value={selectedMatIdx}
                  onChange={(e) => setSelectedMatIdx(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  {MATERIALS.map((mat, idx) => (
                    <option key={mat.name} value={idx}>
                      {mat.name} ({mat.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
          inputs={[
            ...(stockProfile === 'round'
              ? [
                  {
                    id: 'stk-dia',
                    label: 'Diameter (d)',
                    symbol: 'd',
                    value: stockDia,
                    onChange: (v: string | number) => setStockDia(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]
              : stockProfile === 'flat'
              ? [
                  {
                    id: 'stk-w',
                    label: 'Width (w)',
                    symbol: 'w',
                    value: stockWidth,
                    onChange: (v: string | number) => setStockWidth(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                  {
                    id: 'stk-t',
                    label: 'Thickness (t)',
                    symbol: 't',
                    value: stockThick,
                    onChange: (v: string | number) => setStockThick(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]
              : stockProfile === 'pipe'
              ? [
                  {
                    id: 'stk-do',
                    label: 'Outer Diameter (D_o)',
                    symbol: 'D_o',
                    value: stockOuterDia,
                    onChange: (v: string | number) => setStockOuterDia(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                  {
                    id: 'stk-wt',
                    label: 'Wall Thickness (t)',
                    symbol: 't',
                    value: stockWallThick,
                    onChange: (v: string | number) => setStockWallThick(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]
              : [
                  {
                    id: 'stk-hex',
                    label: 'Across Flats Width (s)',
                    symbol: 's',
                    value: stockHexAfl,
                    onChange: (v: string | number) => setStockHexAfl(v),
                    units: [{ label: 'mm', factorToBase: 1 }],
                  },
                ]),
            {
              id: 'stk-len',
              label: 'Stock Cut Length (L)',
              symbol: 'L',
              value: stockLength,
              onChange: (v: string | number) => setStockLength(v),
              units: [{ label: 'mm', factorToBase: 1 }],
            },
          ]}
          outputs={[
            {
              id: 'stk-out-mass',
              label: 'Total Piece Mass',
              symbol: 'm',
              baseValue: stockMassKg,
              currentUnit: 'kg',
              units: [
                { label: 'kg', factorFromBase: 1 },
                { label: 'g', factorFromBase: 1000 },
                { label: 'lb', factorFromBase: 2.20462 },
                { label: 'tonne', factorFromBase: 0.001 },
              ],
              decimals: 2,
              highlight: true,
            },
            {
              id: 'stk-out-force',
              label: 'Weight Force (Gravity)',
              symbol: 'W',
              baseValue: stockWeightN,
              currentUnit: 'N',
              units: [
                { label: 'N', factorFromBase: 1 },
                { label: 'kN', factorFromBase: 0.001 },
                { label: 'lbf', factorFromBase: 0.224809 },
              ],
              decimals: 2,
            },
            {
              id: 'stk-out-lin',
              label: 'Unit Weight per Metre',
              symbol: 'w/L',
              baseValue: stockWeightPerMeter,
              currentUnit: 'kg/m',
              units: [
                { label: 'kg/m', factorFromBase: 1 },
                { label: 'lb/ft', factorFromBase: 0.671969 },
              ],
              decimals: 3,
            },
          ]}
          onReset={() => {
            setStockDia('');
            setStockWidth('');
            setStockThick('');
            setStockOuterDia('');
            setStockWallThick('');
            setStockHexAfl('');
            setStockLength('');
          }}
          practicalTips={[
            'For quick steel round bar checks in the shop: Weight (kg/m) ≈ D² / 162 (with D in mm).',
            'Hot rolled commercial bar stock carries mill rolling tolerance (+/- 3% on diameter/weight).',
          ]}
        />
            </div>
          </div>
        </div>
      )}

      {/* 3-12. Individual Converters */}
      {CONVERTER_SPECS[activeToolId] && (() => {
        const spec = CONVERTER_SPECS[activeToolId];
        const state = getConvState(spec.id);
        const computed = calculateConversion(spec, state.val, state.from, state.to);

        return (
          <div id={`item-${spec.id}`} key={spec.id}>
            <div id={`utility-${spec.id}`}>
              <div id={`u-${spec.id}`}>
                <div id={spec.id} />
                {spec.id === 'conv_press' && (
                  <>
                    <div id="u-univ" />
                    <div id="u-conv" />
                    <div id="item-univ" />
                    <div id="item-conv" />
                  </>
                )}
                {spec.id === 'conv_mass' && <div id="item-conv-mass" />}
                {spec.id === 'conv_force' && <div id="item-conv-force" />}
                {spec.id === 'conv_energy' && <div id="item-conv-energy" />}
                {spec.id === 'conv_power' && <div id="item-conv-power" />}
                <CalculatorShell
              key={spec.id}
            title={spec.name}
            category="General"
            badge={spec.badge}
            description={`Textbook-grade engineering unit conversion for ${spec.name.toLowerCase()} with fundamental SI breakdown.`}
            formulaLatex={spec.latex}
            formulaExplanation={spec.explanation}
            siBaseExplanation={{
              derivation: spec.derivation,
              dimensions: spec.dimensions,
              baseUnits: spec.siBase,
              equivalences: spec.equivalences,
            }}
            inputs={[
              {
                id: `${spec.id}-input`,
                label: `Input Value (${state.from})`,
                symbol: 'Val_{in}',
                value: state.val,
                onChange: (v: string | number) => updateConvState(spec.id, { val: v }),
                currentUnit: state.from,
                onUnitChange: (u) => updateConvState(spec.id, { from: u }),
                units: spec.units.map((u) => ({ label: u.label, factorToBase: u.toBase })),
              },
            ]}
            outputs={[
              {
                id: `${spec.id}-output`,
                label: `Converted Result (${state.to})`,
                symbol: 'Val_{out}',
                baseValue: computed,
                currentUnit: state.to,
                units: spec.units.map((u) => ({ label: u.label, factorFromBase: 1 })),
                onUnitChange: (u) => updateConvState(spec.id, { to: u }),
                decimals: 4,
                highlight: true,
                subtext: `1 ${state.from} = ${(
                  (calculateConversion(spec, 1, state.from, state.to) || 0)
                ).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${state.to}`,
              },
            ]}
            onReset={() => {
              updateConvState(spec.id, { val: '' });
            }}
            onSwap={() => {
              const newFrom = state.to;
              const newTo = state.from;
              const newVal = computed !== null ? Number(computed.toFixed(4)) : '';
              updateConvState(spec.id, {
                val: newVal,
                from: newFrom,
                to: newTo,
              });
            }}
            swapTooltip={`Swap values and units (${state.from} ⇄ ${state.to})`}
          />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
