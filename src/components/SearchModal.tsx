import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Calculator,
  FlaskConical,
  Hammer,
  BookOpen,
  HelpCircle,
  Download,
  ArrowRight,
  Scale,
  Calendar,
  Clock,
  FileText,
  Flame
} from 'lucide-react';
import { matchesMultiField } from '../utils/searchFilter';
import { formulasData } from '../data/formulasData';
import { boilerExperiments } from '../data/vivaThermalData';

export interface SearchItem {
  id: string;
  title: string;
  category: string;
  view: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  year?: string | number;
  tags?: string[];
  badges?: string[];
  units?: string[];
  variables?: string[];
  subject?: string;
  fileUrl?: string;
  filename?: string;
  url?: string;
  link?: string;
  pageNumber?: number;
  elementId?: string;
  toolId?: string;
  boilerId?: string;
  partName?: string;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, toolId?: string, elementId?: string) => void;
  onViewPdf?: (url: string, title: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onViewPdf: _onViewPdf,
}) => {
  const [query, setQuery] = useState('');

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Index items with exact location anchoring (pageNumber for PDFs, elementId for UI components)
  const searchIndex: SearchItem[] = [
    // Calculators (Exact UI Location Anchoring via elementId)
    {
      id: 'c-rpm',
      title: 'Spindle Speed (RPM) Calculator',
      category: 'Calculator',
      subject: 'Workshop',
      view: 'calculators',
      toolId: 'rpm',
      elementId: 'calc-rpm',
      description: 'N = 1000V / (π D) with lathe gear RPM snap',
      icon: Calculator,
      tags: ['speed', 'spindle', 'lathe', 'turning', 'gear'],
      units: ['RPM', 'm/min', 'mm', 'ft/min', 'mm/s'],
      variables: ['N', 'V', 'D'],
    },
    {
      id: 'c-cs',
      title: 'Cutting Speed (V) Calculator',
      category: 'Calculator',
      subject: 'Workshop',
      view: 'calculators',
      toolId: 'cs',
      elementId: 'calc-cs',
      description: 'V = π D N / 1000 surface velocity',
      icon: Calculator,
      tags: ['cutting speed', 'surface velocity', 'machining'],
      units: ['m/min', 'm/s', 'mm', 'RPM'],
      variables: ['V', 'D', 'N'],
    },
    {
      id: 'c-stress',
      title: 'Direct Stress (σ) Calculator',
      category: 'Calculator',
      subject: 'SOM',
      view: 'calculators',
      toolId: 'stress',
      elementId: 'calc-stress',
      description: 'σ = P / A for solid/hollow round and rect bars',
      icon: Calculator,
      tags: ['direct stress', 'normal stress', 'axial load', 'tension', 'compression'],
      units: ['MPa', 'N/mm²', 'Pa', 'N', 'kN', 'mm²', 'm²'],
      variables: ['σ', 'P', 'A'],
    },
    {
      id: 'c-strain',
      title: 'Strain & Hooke (ε) Calculator',
      category: 'Calculator',
      subject: 'SOM',
      view: 'calculators',
      toolId: 'strain',
      elementId: 'calc-strain',
      description: 'ε = ΔL / L and σ = E · ε',
      icon: Calculator,
      tags: ['strain', 'hookes law', 'youngs modulus', 'elongation', 'deformation'],
      units: ['mm', 'm', 'MPa', 'GPa'],
      variables: ['ε', 'ΔL', 'L', 'E', 'σ'],
    },
    {
      id: 'c-mtime',
      title: 'Machining Time (T) Calculator',
      category: 'Calculator',
      subject: 'Workshop',
      view: 'calculators',
      toolId: 'feed',
      elementId: 'calc-feed',
      description: 'T = (L + A + O) / (f · N) for lathe turning',
      icon: Calculator,
      tags: ['machining time', 'feed rate', 'lathe pass'],
      units: ['min', 'mm', 'mm/rev', 'RPM'],
      variables: ['T', 'L', 'f', 'N'],
    },
    {
      id: 'c-shear',
      title: 'Shear Stress (τ) Calculator',
      category: 'Calculator',
      subject: 'SOM',
      view: 'calculators',
      toolId: 'stress',
      elementId: 'calc-stress',
      description: 'Single and double shear for pins & rivets',
      icon: Calculator,
      tags: ['shear stress', 'rivet', 'pin', 'clevis'],
      units: ['MPa', 'N/mm²', 'kN', 'N', 'mm²'],
      variables: ['τ', 'P', 'A', 'd'],
    },
    {
      id: 'c-torque',
      title: 'Shaft Torque & Power Calculator',
      category: 'Calculator',
      subject: 'Workshop',
      view: 'calculators',
      toolId: 'torque',
      elementId: 'calc-torque',
      description: 'P = 2πNT / 60000 and τ = 16T / (π d³)',
      icon: Calculator,
      tags: ['torque', 'power', 'shaft diameter', 'polar modulus'],
      units: ['N·m', 'kW', 'W', 'RPM', 'HP', 'MPa'],
      variables: ['P', 'N', 'T', 'd', 'τ'],
    },
    {
      id: 'c-power',
      title: 'Power from Torque Calculator',
      category: 'Calculator',
      subject: 'Workshop',
      view: 'calculators',
      toolId: 'power',
      elementId: 'calc-power',
      description: 'P = 2πNT / 60000 motor power calculation',
      icon: Calculator,
      tags: ['power', 'motor', 'torque', 'watt', 'kw', 'hp'],
      units: ['kW', 'W', 'N·m', 'RPM', 'HP'],
      variables: ['P', 'T', 'N'],
    },
    {
      id: 'c-moi',
      title: 'Moment of Inertia (I & Z) Calculator',
      category: 'Calculator',
      subject: 'SOM',
      view: 'calculators',
      toolId: 'moi',
      elementId: 'calc-moi',
      description: 'Second moment of area for rectangles, circles, hollow sections',
      icon: Calculator,
      tags: ['moment of inertia', 'section modulus', 'beam', 'bending'],
      units: ['mm⁴', 'm⁴', 'mm³'],
      variables: ['I_x', 'I_y', 'Z'],
    },
    {
      id: 'c-thermal',
      title: 'Thermal Expansion & Converter Calculator',
      category: 'Calculator',
      subject: 'Thermal',
      view: 'calculators',
      toolId: 'converter',
      elementId: 'calc-converter',
      description: 'Universal SI and thermal units conversion',
      icon: Calculator,
      tags: ['thermal expansion', 'linear expansivity', 'temperature', 'si units'],
      units: ['mm', 'm', '°C', 'K', '1/K', 'MPa', 'g', 'kg'],
      variables: ['ΔL', 'L', 'α', 'ΔT'],
    },

    // Engineering Utilities (Exact UI Location Anchoring via elementId)
    {
      id: 'u-univ',
      title: 'Universal SI Unit Converter',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'conv_press',
      elementId: 'utility-conv_press',
      description: 'Convert length, pressure, torque, power, temp, angle, speed, force, energy',
      icon: Scale,
      tags: ['si converter', 'metric', 'imperial', 'units'],
      units: ['m', 'mm', 'in', 'ft', 'Pa', 'bar', 'psi', 'MPa', 'N', 'kN', 'lbf', 'kgf', 'N·m', 'W', 'kW', 'HP', 'm/s', 'km/h', '°C', '°F', 'K', 'J', 'kJ', 'rad', 'deg'],
    },
    {
      id: 'u-density',
      title: 'Density / Mass / Volume Calculator',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'density',
      elementId: 'utility-density',
      description: 'ρ = m / V with engineering material presets',
      icon: Scale,
      tags: ['density', 'mass', 'volume', 'specific weight', 'steel', 'aluminum'],
      units: ['kg/m³', 'kg', 'g', 'tonne', 'lb', 'm³', 'cm³', 'mm³', 'Liters'],
      variables: ['ρ', 'm', 'V'],
    },
    {
      id: 'u-weight',
      title: 'Material Stock Weight Calculator',
      category: 'Utilities',
      subject: 'Workshop',
      view: 'utilities',
      toolId: 'stock_weight',
      elementId: 'utility-stock_weight',
      description: 'Round bar, flat plate, pipe, hex bar stock mass and unit weight',
      icon: Scale,
      tags: ['stock weight', 'steel mass', 'round bar', 'pipe weight', 'hex bar', 'plate'],
      units: ['kg', 'kg/m', 'mm', 'm', 'g'],
      variables: ['mass', 'density', 'volume', 'length'],
    },
    {
      id: 'u-conv-press',
      title: 'Pressure & Stress Converter (11 Units)',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'conv_press',
      elementId: 'utility-conv_press',
      description: 'Pa, kPa, MPa, GPa, bar, mbar, psi, ksi, atm, mmHg, Torr',
      icon: Scale,
      tags: ['pressure converter', 'stress', 'bar', 'psi', 'pascal', 'mpa'],
      units: ['Pa', 'kPa', 'MPa', 'GPa', 'bar', 'mbar', 'psi', 'ksi', 'atm', 'mmHg', 'Torr'],
    },
    {
      id: 'u-conv-mass',
      title: 'Weight & Mass Converter (g, kg, lb, tonne)',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'conv_mass',
      elementId: 'utility-conv_mass',
      description: 'Convert kilograms, grams, tonnes, pounds, ounces, milligrams',
      icon: Scale,
      tags: ['weight converter', 'mass converter', 'kg to g', 'kilogram', 'gram', 'pound', 'lb'],
      units: ['g', 'kg', 'tonne', 'lb', 'oz', 'mg'],
    },
    {
      id: 'u-conv-force',
      title: 'Force Converter (N, kN, kgf, lbf)',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'conv_force',
      elementId: 'utility-conv_force',
      description: 'Convert Newton, kilonewton, kgf, pound-force, dyne',
      icon: Scale,
      tags: ['force converter', 'newton', 'kilonewton', 'kgf', 'lbf'],
      units: ['N', 'kN', 'MN', 'kgf', 'lbf', 'dyne'],
    },
    {
      id: 'u-conv-energy',
      title: 'Energy & Work Converter (J, kJ, cal, kWh)',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'conv_energy',
      elementId: 'utility-conv_energy',
      description: 'Convert Joule, kilojoule, calorie, kilowatt-hour, BTU',
      icon: Scale,
      tags: ['energy converter', 'work', 'joule', 'calorie', 'kwh'],
      units: ['J', 'kJ', 'MJ', 'cal', 'kcal', 'kWh', 'BTU', 'eV'],
    },
    {
      id: 'u-conv-power',
      title: 'Power Converter (W, kW, HP)',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'conv_power',
      elementId: 'utility-conv_power',
      description: 'Convert Watt, kilowatt, megawatt, horsepower, BTU/h',
      icon: Scale,
      tags: ['power converter', 'watt', 'kw', 'hp', 'horsepower'],
      units: ['W', 'kW', 'MW', 'HP', 'BTU/h'],
    },
    {
      id: 'u-conv',
      title: 'Individual Unit Converters (10 Types)',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      toolId: 'conv_press',
      elementId: 'utility-conv_press',
      description: 'Pressure, area, volume, mass, force, speed, power, energy, angle, temp',
      icon: Scale,
      tags: ['unit converter', 'pressure', 'area', 'volume', 'mass', 'force', 'speed', 'power', 'energy', 'angle', 'temperature'],
      units: ['Pa', 'bar', 'psi', 'MPa', 'm²', 'cm²', 'mm²', 'm³', 'Liters', 'g', 'kg', 'tonne', 'lb', 'N', 'kN', 'm/s', 'km/h', 'W', 'kW', 'HP', 'J', 'kJ', 'rad', 'deg', '°C', '°F', 'K'],
    },

    // Lab Manuals (Exact In-App Navigation to Thermal Lab Companion)
    {
      id: 'l-boiler1',
      title: 'Lancashire Boiler Lab Manual (exp1_tl.pdf)',
      category: 'Thermal Lab',
      subject: 'Thermal-I',
      view: 'labs',
      toolId: 'tl-1',
      elementId: 'l-boiler1',
      description: 'Lancashire Boiler Lab Manual & Experiment Guide',
      icon: FlaskConical,
      tags: ['boiler', 'thermal lab', 'manual', 'exp 1', 'lancashire', 'exp1_tl.pdf'],
    },
    {
      id: 'l-boiler2',
      title: 'Cochran Boiler Lab Manual (exp2_tl.pdf)',
      category: 'Thermal Lab',
      subject: 'Thermal-I',
      view: 'labs',
      toolId: 'tl-2',
      elementId: 'l-boiler2',
      description: 'Cochran Boiler Lab Manual & Experiment Guide',
      icon: FlaskConical,
      tags: ['boiler', 'thermal lab', 'manual', 'exp 2', 'cochran', 'exp2_tl.pdf'],
    },
    {
      id: 'l-boiler3',
      title: 'Babcock & Wilcox Boiler Manual (exp3_tl.pdf)',
      category: 'Thermal Lab',
      subject: 'Thermal-I',
      view: 'labs',
      toolId: 'tl-3',
      elementId: 'l-boiler3',
      description: 'Babcock & Wilcox Boiler Manual & Experiment Guide',
      icon: FlaskConical,
      tags: ['boiler', 'water tube', 'thermal lab', 'manual', 'exp 3', 'babcock', 'exp3_tl.pdf'],
    },
    {
      id: 'l-utm',
      title: 'Materials Testing: UTM Tensile Test (MEPC 211)',
      category: 'Materials Lab',
      subject: 'Materials',
      view: 'labs',
      elementId: 'lab-tab-materialstesting',
      description: 'Materials Testing Lab Manual & Procedures',
      icon: FlaskConical,
      tags: ['utm', 'tensile test', 'mepc 211', 'stress strain curve'],
    },
    {
      id: 'l-mfg',
      title: 'Manufacturing Practice (MEPC 213)',
      category: 'Mfg Lab',
      subject: 'Manufacturing',
      view: 'labs',
      elementId: 'lab-tab-manufacturing',
      description: 'Manufacturing Practice Manual & Machine Operation',
      icon: FlaskConical,
      tags: ['mfg lab', 'mepc 213', 'lathe', 'shaping'],
    },
    {
      id: 'l-drawing',
      title: 'Drawing Practice (MEPC 217)',
      category: 'Drawing Lab',
      subject: 'Drawing',
      view: 'labs',
      elementId: 'lab-tab-drawing',
      description: 'Mechanical Engineering Drawing Practice Manual MEPC 217',
      icon: FlaskConical,
      tags: ['drawing lab', 'mepc 217', 'cad', 'projection'],
    },

    // Workshop Reference
    { id: 'w-lathe', title: 'Lathe Practice & ASA Tool Geometry', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', elementId: 'workshop-lathe', description: '7-element ASA signature: αb - αs - θe - θs - Ce - Cs - R', icon: Hammer, tags: ['asa tool signature', 'lathe', 'rake angle', 'relief angle'] },
    { id: 'w-milling', title: 'Up-Milling vs Down-Milling & Indexing', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', elementId: 'workshop-milling', description: 'Dividing head simple indexing formula M = 40 / N', icon: Hammer, tags: ['milling', 'dividing head', 'indexing', 'climb milling'] },
    { id: 'w-shaper', title: 'Shaper Quick Return Ratio (QRR)', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', elementId: 'workshop-shaper', description: 'Crank & slotted lever mechanism kinematics', icon: Hammer, tags: ['shaper', 'qrr', 'quick return', 'stroke'] },
    { id: 'w-welding', title: 'Oxy-Acetylene Flame Types & Welding Defects', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', elementId: 'workshop-welding', description: 'Neutral, oxidizing, and carburizing flames', icon: Hammer, tags: ['welding', 'flame', 'gas welding', 'defects'] },
    { id: 'w-foundry', title: 'Pattern Allowances in Casting', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', elementId: 'workshop-foundry', description: 'Shrinkage, draft, machining, and shake allowances', icon: Hammer, tags: ['casting', 'pattern allowances', 'foundry', 'shrinkage'] },
    { id: 'w-fitting', title: 'Tap Drill Size & Bench Fitting Practice', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', elementId: 'workshop-fitting', description: 'TDS = D - P and 118° twist drill point angle', icon: Hammer, tags: ['fitting', 'tap drill size', 'tds', 'threads'] },

    // Formulas (Exact UI Location Anchoring via elementId)
    ...formulasData.map((f) => ({
      id: `f-${f.id}`,
      title: `${f.title} (${f.formulaLatex})`,
      category: 'Formula',
      subject: f.category,
      view: 'formulas',
      toolId: f.id,
      elementId: f.id === 'bernoulli' ? 'bernoulli-equation' : `item-${f.id}`,
      description: f.definition,
      icon: BookOpen,
      tags: [f.title.toLowerCase(), f.category.toLowerCase(), f.id, ...(f.variables?.map((v) => v.meaning.toLowerCase()) || [])],
      units: [f.siUnits],
      variables: f.variables?.map((v) => v.symbol) || [],
    })),

    // Boiler Component Viva Questions (Exact Location Anchoring)
    ...boilerExperiments.flatMap((b) =>
      b.components.map((c) => {
        const slug = c.partName.replace(/\s+/g, '-').toLowerCase();
        return {
          id: `viva-comp-${b.id}-${slug}`,
          partName: c.partName,
          title: `${c.partName} (${b.title})`,
          category: 'Viva Question',
          subject: 'Thermal-I',
          view: 'viva',
          boilerId: b.id,
          elementId: slug,
          description: `${c.question} — ${c.examinerAnswer || c.answer}`,
          icon: Flame,
          tags: [
            c.partName.toLowerCase(),
            slug,
            b.title.toLowerCase(),
            c.category.toLowerCase(),
            'boiler component',
            'viva',
            'oral exam',
          ],
        };
      })
    ),

    // Viva Center (Exact UI Location Anchoring via elementId & boilerId)
    {
      id: 'v-babcock',
      title: 'Babcock & Wilcox Boiler Viva & Diagram',
      category: 'Viva Center',
      subject: 'Thermal-I',
      view: 'viva',
      boilerId: 'babcock',
      elementId: 'boiler-babcock',
      description: 'High-pressure water-tube boiler cut-section & viva questions',
      icon: Flame,
      tags: ['babcock', 'boiler', 'viva', 'water tube', 'thermal'],
    },
    {
      id: 'v-lancashire',
      title: 'Lancashire Boiler Viva & Diagram',
      category: 'Viva Center',
      subject: 'Thermal-I',
      view: 'viva',
      boilerId: 'lancashire',
      elementId: 'boiler-lancashire',
      description: 'Horizontal fire-tube boiler cut-section & viva questions',
      icon: Flame,
      tags: ['lancashire', 'boiler', 'viva', 'fire tube', 'thermal'],
    },
    {
      id: 'v-cochran',
      title: 'Cochran Boiler Viva & Diagram',
      category: 'Viva Center',
      subject: 'Thermal-I',
      view: 'viva',
      boilerId: 'cochran',
      elementId: 'boiler-cochran',
      description: 'Vertical multi-tubular boiler cut-section & viva questions',
      icon: Flame,
      tags: ['cochran', 'boiler', 'viva', 'vertical boiler', 'thermal'],
    },
    {
      id: 'v-all',
      title: 'Viva Oral Exam Question Bank (5 Subjects)',
      category: 'Viva Center',
      subject: 'All Subjects',
      view: 'viva',
      toolId: 'theory',
      boilerId: 'babcock',
      elementId: 'theory-card-1',
      description: 'SOM, Thermal-I, Mfg-I, Materials, Drawing oral exam preparation',
      icon: HelpCircle,
      tags: ['viva', 'oral exam', 'questions', 'interview', 'som', 'thermal', 'mfg'],
    },

    // Resources Hub & Academic Files (In-App Navigation)
    {
      id: 'r-calendar',
      title: 'Official Academic Calendar (2026–2027)',
      category: 'Academic',
      subject: 'WBSCTE',
      view: 'resources',
      elementId: 'r-calendar',
      description: 'Official Academic Calendar for 2026–2027 session',
      icon: Calendar,
      year: '2026-2027',
      tags: ['calendar', 'academic timeline', 'exam dates', '2026', '2027'],
    },
    {
      id: 'r-syllabus',
      title: 'WBSCTVESD Diploma ME Sem 3 Official Syllabus (Revised 2022)',
      category: 'Academic',
      subject: 'WBSCTE',
      view: 'resources',
      elementId: 'r-syllabus',
      description: 'Official ME Sem 3 Syllabus (Revised 2022)',
      icon: BookOpen,
      year: '2022',
      tags: ['syllabus', 'curriculum', 'diploma me', '2022'],
    },
    {
      id: 'r-routine-college',
      title: 'Official College Routine (Sem 3 ME)',
      category: 'Academic',
      subject: 'WBSCTE',
      view: 'resources',
      elementId: 'r-routine-college',
      description: 'Official College Timetable (Sem 3 ME)',
      icon: Clock,
      year: '2026',
      tags: ['routine', 'timetable', 'college schedule'],
    },
    {
      id: 'r-routine-simple',
      title: 'Simplified Student Routine (Sem 3 ME)',
      category: 'Academic',
      subject: 'WBSCTE',
      view: 'resources',
      elementId: 'r-routine-simple',
      description: 'Simplified Student Routine Timetable (Sem 3 ME)',
      icon: Clock,
      year: '2026',
      tags: ['routine', 'simplified timetable', 'student view'],
    },
    {
      id: 'r-univ-template',
      title: 'Universal Assignment & Lab Record Kit',
      category: 'Academic',
      subject: 'WBSCTE',
      view: 'resources',
      elementId: 'r-univ-template',
      description: 'Universal Assignment & Lab Record Kit',
      icon: Download,
      tags: ['assignment template', 'lab record kit', 'front page'],
    },
    {
      id: 'r-front-index',
      title: 'Thermal Engineering-I Lab Report Kit (Front & Index Sheet)',
      category: 'Resources',
      subject: 'Thermal-I',
      view: 'resources',
      elementId: 'r-front-index',
      description: 'Thermal Lab Report Kit MEPC 215 Front & Index Sheet',
      icon: Download,
      tags: ['thermal lab kit', 'mepc 215', 'index sheet', 'front page'],
    },
    {
      id: 'r-pyq',
      title: 'Previous Year Question Papers & Mega Bundle (2017–2026)',
      category: 'PYQ Archive',
      subject: 'All Subjects',
      view: 'resources',
      elementId: 'pyq-mega-bundle',
      description: 'PYQ Archives & Complete Mega Bundle (2017–2026)',
      icon: HelpCircle,
      year: '2017–2026',
      fileUrl: '/pyq/sem3_pyq_master_all.pdf',
      url: '/pyq/sem3_pyq_master_all.pdf',
      pageNumber: 1,
      tags: ['pyq', 'previous year question', '2017', '2018', '2019', '2021', '2022', '2023', '2024', '2026', 'som', 'thermal', 'mfg', 'materials', 'drawing'],
    },
    {
      id: 'pyq-som',
      title: 'Strength of Materials (SOM) PYQ Papers (2018–2026)',
      category: 'PYQ Archive',
      subject: 'SOM',
      view: 'resources',
      description: 'Official SOM exam papers (2018, 2021, 2022, 2023, 2024 Jan/Dec, 2026)',
      icon: FileText,
      year: '2018–2026',
      fileUrl: '/pyq/som_pyq_all.pdf',
      url: '/pyq/som_pyq_all.pdf',
      pageNumber: 1,
      tags: ['som', 'mepc 205', 'strength of materials', 'pyq', '2018', '2021', '2022', '2023', '2024', '2026'],
    },
    {
      id: 'pyq-thermal',
      title: 'Thermal Engineering-I PYQ Papers (2018–2026)',
      category: 'PYQ Archive',
      subject: 'Thermal-I',
      view: 'resources',
      description: 'Official Thermal-I exam papers (2018, 2019, 2021, 2022, 2023, 2024 Jan/Dec, 2026)',
      icon: FileText,
      year: '2018–2026',
      fileUrl: '/pyq/thermal_pyq_all.pdf',
      url: '/pyq/thermal_pyq_all.pdf',
      pageNumber: 1,
      tags: ['thermal', 'mepc 209', 'thermal engineering', 'pyq', '2018', '2019', '2021', '2022', '2023', '2024', '2026'],
    },
    {
      id: 'pyq-mfg',
      title: 'Manufacturing Processes-I PYQ Papers (2017–2026)',
      category: 'PYQ Archive',
      subject: 'Mfg Processes-I',
      view: 'resources',
      description: 'Official Mfg-I exam papers (2017, 2018, 2019, 2021, 2022, 2023, 2024 Jan/Dec, 2026)',
      icon: FileText,
      year: '2017–2026',
      fileUrl: '/pyq/mfg1_pyq_all.pdf',
      url: '/pyq/mfg1_pyq_all.pdf',
      pageNumber: 1,
      tags: ['mfg', 'mepc 207', 'manufacturing processes', 'pyq', '2017', '2018', '2019', '2021', '2022', '2023', '2024', '2026'],
    },
    {
      id: 'pyq-materials',
      title: 'Mechanical Engineering Materials PYQ Papers (2018–2026)',
      category: 'PYQ Archive',
      subject: 'Materials',
      view: 'resources',
      description: 'Official Materials exam papers (2018, 2019, 2022, 2023, 2024 Jan/Dec, 2026)',
      icon: FileText,
      year: '2018–2026',
      fileUrl: '/pyq/materials_pyq_all.pdf',
      url: '/pyq/materials_pyq_all.pdf',
      pageNumber: 1,
      tags: ['materials', 'mepc 203', 'materials', 'pyq', '2018', '2019', '2022', '2023', '2024', '2026'],
    },
    {
      id: 'pyq-drawing',
      title: 'Mechanical Engineering Drawing PYQ Master Archive',
      category: 'PYQ Archive',
      subject: 'Drawing',
      view: 'resources',
      description: 'Official Mechanical Engineering Drawing exam question papers MEPC 201',
      icon: FileText,
      year: '2022–2026',
      fileUrl: '/pyq/drawing_pyq_all.pdf',
      url: '/pyq/drawing_pyq_all.pdf',
      pageNumber: 1,
      tags: ['drawing', 'mepc 201', 'engineering drawing', 'pyq'],
    },
    // Individual 2024 Session Papers with precise page number targeting
    {
      id: 'pyq-som-2024-jan',
      title: 'SOM 2024 (Jan) Question Paper',
      category: 'PYQ Paper',
      subject: 'SOM',
      view: 'resources',
      description: 'Strength of Materials Jan 2024 session official question paper PDF',
      icon: FileText,
      year: '2024',
      fileUrl: '/pyq/som_2024_jan.pdf',
      url: '/pyq/som_2024_jan.pdf',
      pageNumber: 1,
      filename: 'som_2024_jan.pdf',
      tags: ['som', '2024', 'jan', 'pyq', 'strength of materials'],
    },
    {
      id: 'pyq-som-2024-dec',
      title: 'SOM 2024 (Dec) Question Paper',
      category: 'PYQ Paper',
      subject: 'SOM',
      view: 'resources',
      description: 'Strength of Materials Dec 2024 session official question paper PDF',
      icon: FileText,
      year: '2024',
      fileUrl: '/pyq/som_2024_dec.pdf',
      url: '/pyq/som_2024_dec.pdf',
      pageNumber: 1,
      filename: 'som_2024_dec.pdf',
      tags: ['som', '2024', 'dec', 'pyq', 'strength of materials'],
    },
    {
      id: 'pyq-thermal-2024-jan',
      title: 'Thermal-I 2024 (Jan) Question Paper',
      category: 'PYQ Paper',
      subject: 'Thermal-I',
      view: 'resources',
      description: 'Thermal Engineering-I Jan 2024 session official question paper PDF',
      icon: FileText,
      year: '2024',
      fileUrl: '/pyq/thermal_2024_jan.pdf',
      url: '/pyq/thermal_2024_jan.pdf',
      pageNumber: 1,
      filename: 'thermal_2024_jan.pdf',
      tags: ['thermal', '2024', 'jan', 'pyq', 'thermal engineering'],
    },
    {
      id: 'pyq-thermal-2024-dec',
      title: 'Thermal-I 2024 (Dec) Question Paper',
      category: 'PYQ Paper',
      subject: 'Thermal-I',
      view: 'resources',
      description: 'Thermal Engineering-I Dec 2024 session official question paper PDF',
      icon: FileText,
      year: '2024',
      fileUrl: '/pyq/thermal_2024_dec.pdf',
      url: '/pyq/thermal_2024_dec.pdf',
      pageNumber: 1,
      filename: 'thermal_2024_dec.pdf',
      tags: ['thermal', '2024', 'dec', 'pyq', 'thermal engineering'],
    },
  ];

  const filteredItems = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 8);
    return searchIndex.filter((item) => matchesMultiField(item, query));
  }, [query, searchIndex]);

  const handleItemClick = (item: SearchItem) => {
    // 1. Close the search modal immediately upon click
    onClose();

    // 2. Force In-App Navigation (No window.open, no direct PDF opening from search):
    // When a search result is clicked, set the active tab state to the correct view.
    // Update the URL hash with the target element ID (e.g., window.history.pushState(null, '', '#pyq-som')).
    let targetTab = item.view || 'dashboard';
    let targetToolId: string | undefined = item.toolId;
    let targetElementId: string =
      item.elementId || item.id || (item.partName ? `item-${item.partName.replace(/\s+/g, '-').toLowerCase()}` : '');

    if (
      item.view === 'resources' ||
      item.view === 'downloads' ||
      item.category === 'PYQ Archive' ||
      item.category === 'PYQ Paper' ||
      item.id.startsWith('pyq-') ||
      item.id.startsWith('pyq') ||
      item.id.startsWith('r-')
    ) {
      targetTab = 'resources';
      targetToolId = undefined;
      targetElementId = item.elementId || item.id;
    } else if (item.view === 'viva' || item.category.includes('Viva') || item.boilerId) {
      targetTab = 'viva';
      targetToolId = item.boilerId || item.toolId || 'babcock';
      const compSlug = item.partName
        ? item.partName.replace(/\s+/g, '-').toLowerCase()
        : (item.elementId || item.id).replace(/^item-/, '');
      targetElementId = `item-${compSlug}`;
    } else if (item.view === 'formulas' || item.category === 'Formula') {
      targetTab = 'formulas';
      const fId = item.toolId || item.id.replace(/^f-/, '');
      targetToolId = fId;
      targetElementId = `item-${fId}`;
    } else if (item.view === 'utilities' || item.category === 'Utilities') {
      targetTab = 'utilities';
      targetToolId = item.toolId || 'density';
      targetElementId = `item-${targetToolId}`;
    } else if (item.view === 'labs' || item.category.includes('Lab')) {
      targetTab = 'labs';
      targetToolId = item.toolId;
      targetElementId = `item-${item.toolId || item.id.replace(/^l-/, '')}`;
    } else if (item.view === 'calculators' || item.category === 'Calculator') {
      targetTab = 'calculators';
      targetToolId = item.toolId || 'rpm';
      targetElementId = `item-${targetToolId}`;
    }

    // Update the URL hash with the target element ID (e.g., window.history.pushState(null, '', '#pyq-som'))
    const cleanId = targetElementId.replace(/^#/, '');
    if (cleanId) {
      const hashStr = `#${cleanId}`;
      window.history.pushState(null, '', hashStr);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }

    // Set the active tab state to the correct view
    onNavigate(targetTab, targetToolId, cleanId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 search-modal gpu-accelerated">
      <div className="w-full max-w-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 transform-gpu gpu-accelerated">
        {/* Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-white/10">
          <Search className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators, formulas, lab guides, or viva questions..."
            className="w-full h-14 pl-3 pr-10 text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2.5 space-y-1.5">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = item.icon || HelpCircle;
              const isPyq =
                item.view === 'resources' ||
                item.view === 'downloads' ||
                item.category === 'PYQ Archive' ||
                item.category === 'PYQ Paper' ||
                item.id.startsWith('pyq-') ||
                item.id.startsWith('pyq') ||
                item.id === 'r-pyq';
              const isTool = item.view === 'calculators' || item.view === 'utilities';
              const isViva = item.view === 'viva' || Boolean(item.boilerId) || item.category.includes('Viva');
              const isFormula = item.view === 'formulas' || item.category === 'Formula';
              const isLab = item.view === 'labs' || item.category.includes('Lab');

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/60 hover:bg-emerald-500/[0.04] dark:hover:bg-emerald-500/[0.08] hover:border-emerald-500/40 dark:hover:border-emerald-500/40 cursor-pointer transition-all duration-150 active:scale-[0.99] group shadow-xs text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:scale-105 transition-all shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right-Hand Direct Action Indicator */}
                  {isPyq && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      <span className="hidden sm:inline">View in Archive</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                  {isViva && !isPyq && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      <span className="hidden sm:inline">Practice Viva</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                  {isFormula && !isPyq && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/20 shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      <span className="hidden sm:inline">View Formula</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                  {isLab && !isPyq && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      <span className="hidden sm:inline">View Lab</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                  {isTool && !isPyq && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/20 shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      <span className="hidden sm:inline">Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                  {!isPyq && !isTool && !isViva && !isFormula && !isLab && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      <span className="hidden sm:inline">View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching tools, papers, or formulas found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-slate-50 dark:bg-zinc-950/60 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Click to jump directly to anchored in-app component</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
