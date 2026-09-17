import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Calculator, FlaskConical, Hammer, BookOpen, HelpCircle, Download, ArrowRight, Scale, Calendar, Clock, FileText } from 'lucide-react';
import { matchesMultiField } from '../utils/searchFilter';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  view: string;
  description: string;
  icon: any;
  year?: string | number;
  tags?: string[];
  badges?: string[];
  units?: string[];
  variables?: string[];
  subject?: string;
  fileUrl?: string;
  filename?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
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

  // Index items
  const searchIndex: SearchItem[] = [
    // Calculators
    {
      id: 'c-rpm',
      title: 'Spindle Speed (RPM) Calculator',
      category: 'Calculator',
      subject: 'Workshop',
      view: 'calculators',
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
      description: 'P = 2πNT / 60000 and τ = 16T / (π d³)',
      icon: Calculator,
      tags: ['torque', 'power', 'shaft diameter', 'polar modulus'],
      units: ['N·m', 'kW', 'W', 'RPM', 'HP', 'MPa'],
      variables: ['P', 'N', 'T', 'd', 'τ'],
    },
    {
      id: 'c-thermal',
      title: 'Thermal Expansion Calculator',
      category: 'Calculator',
      subject: 'Thermal',
      view: 'calculators',
      description: 'ΔL = L · α · ΔT and thermal stress check',
      icon: Calculator,
      tags: ['thermal expansion', 'linear expansivity', 'thermal stress'],
      units: ['mm', 'm', '°C', 'K', '1/K', 'MPa'],
      variables: ['ΔL', 'L', 'α', 'ΔT', 'σ_th'],
    },

    // Engineering Utilities
    {
      id: 'u-univ',
      title: 'Universal SI Unit Converter',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
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
      description: 'Round bar, flat plate, pipe, hex bar stock mass and unit weight',
      icon: Scale,
      tags: ['stock weight', 'steel mass', 'round bar', 'pipe weight', 'hex bar', 'plate'],
      units: ['kg', 'kg/m', 'mm', 'm', 'g'],
      variables: ['mass', 'density', 'volume', 'length'],
    },
    {
      id: 'u-conv',
      title: 'Individual Unit Converters (10 Types)',
      category: 'Utilities',
      subject: 'General',
      view: 'utilities',
      description: 'Pressure, area, volume, mass, force, speed, power, energy, angle, temp',
      icon: Scale,
      tags: ['unit converter', 'pressure', 'area', 'volume', 'mass', 'force', 'speed', 'power', 'energy', 'angle', 'temperature'],
      units: ['Pa', 'bar', 'psi', 'MPa', 'm²', 'cm²', 'mm²', 'm³', 'Liters', 'g', 'kg', 'tonne', 'lb', 'N', 'kN', 'm/s', 'km/h', 'W', 'kW', 'HP', 'J', 'kJ', 'rad', 'deg', '°C', '°F', 'K'],
    },

    // Lab
    { id: 'l-boiler1', title: 'Lancashire Boiler Lab Manual (exp1_tl.pdf)', category: 'Thermal Lab', subject: 'Thermal-I', view: 'labs', description: 'Lancashire Boiler Lab Manual PDF', icon: FlaskConical, fileUrl: '/labs/exp1_tl.pdf', filename: 'exp1_tl.pdf', tags: ['boiler', 'thermal lab', 'manual', 'exp 1'] },
    { id: 'l-boiler2', title: 'Cochran Boiler Lab Manual (exp2_tl.pdf)', category: 'Thermal Lab', subject: 'Thermal-I', view: 'labs', description: 'Cochran Boiler Lab Manual PDF', icon: FlaskConical, fileUrl: '/labs/exp2_tl.pdf', filename: 'exp2_tl.pdf', tags: ['boiler', 'thermal lab', 'manual', 'exp 2'] },
    { id: 'l-boiler3', title: 'Babcock & Wilcox Boiler Manual (exp3_tl.pdf)', category: 'Thermal Lab', subject: 'Thermal-I', view: 'labs', description: 'Babcock & Wilcox Boiler Manual PDF', icon: FlaskConical, fileUrl: '/labs/exp3_tl.pdf', filename: 'exp3_tl.pdf', tags: ['boiler', 'water tube', 'thermal lab', 'manual', 'exp 3'] },
    { id: 'l-utm', title: 'Materials Testing: UTM Tensile Test (MEPC 211)', category: 'Materials Lab', subject: 'Materials', view: 'labs', description: 'Materials Testing Lab Manual', icon: FlaskConical, tags: ['utm', 'tensile test', 'mepc 211', 'stress strain curve'] },
    { id: 'l-mfg', title: 'Manufacturing Practice (MEPC 213)', category: 'Mfg Lab', subject: 'Manufacturing', view: 'labs', description: 'Manufacturing Practice Manual', icon: FlaskConical, tags: ['mfg lab', 'mepc 213', 'lathe', 'shaping'] },
    { id: 'l-drawing', title: 'Drawing Practice (MEPC 217)', category: 'Drawing Lab', subject: 'Drawing', view: 'labs', description: 'Drawing Practice Manual', icon: FlaskConical, tags: ['drawing lab', 'mepc 217', 'cad', 'projection'] },

    // Workshop
    { id: 'w-lathe', title: 'Lathe Practice & ASA Tool Geometry', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', description: '7-element ASA signature: αb - αs - θe - θs - Ce - Cs - R', icon: Hammer, tags: ['asa tool signature', 'lathe', 'rake angle', 'relief angle'] },
    { id: 'w-milling', title: 'Up-Milling vs Down-Milling & Indexing', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', description: 'Dividing head simple indexing formula M = 40 / N', icon: Hammer, tags: ['milling', 'dividing head', 'indexing', 'climb milling'] },
    { id: 'w-shaper', title: 'Shaper Quick Return Ratio (QRR)', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', description: 'Crank & slotted lever mechanism kinematics', icon: Hammer, tags: ['shaper', 'qrr', 'quick return', 'stroke'] },
    { id: 'w-welding', title: 'Oxy-Acetylene Flame Types & Welding Defects', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', description: 'Neutral, oxidizing, and carburizing flames', icon: Hammer, tags: ['welding', 'flame', 'gas welding', 'defects'] },
    { id: 'w-foundry', title: 'Pattern Allowances in Casting', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', description: 'Shrinkage, draft, machining, and shake allowances', icon: Hammer, tags: ['casting', 'pattern allowances', 'foundry', 'shrinkage'] },
    { id: 'w-fitting', title: 'Tap Drill Size & Bench Fitting Practice', category: 'Workshop', subject: 'Manufacturing', view: 'workshop', description: 'TDS = D - P and 118° twist drill point angle', icon: Hammer, tags: ['fitting', 'tap drill size', 'tds', 'threads'] },

    // Formulas
    { id: 'f-torsion', title: 'Torsion Equation (T/J = τ/R = Gθ/L)', category: 'Formula', subject: 'SOM', view: 'formulas', description: 'Polar moment of inertia and shaft twist', icon: BookOpen, tags: ['torsion', 'polar moment', 'shear stress', 'shaft twist'], units: ['N·m', 'mm⁴', 'MPa', 'rad', 'GPa'] },
    { id: 'f-bending', title: 'Pure Bending Equation (M/I = σ/y = E/R)', category: 'Formula', subject: 'SOM', view: 'formulas', description: 'Beam flexural stress and section modulus', icon: BookOpen, tags: ['bending', 'flexure', 'beam stress', 'moment of inertia'], units: ['N·m', 'mm⁴', 'MPa', 'GPa'] },
    { id: 'f-poisson', title: "Poisson's Ratio & Volumetric Strain", category: 'Formula', subject: 'SOM', view: 'formulas', description: 'ν = lateral strain / linear strain', icon: BookOpen, tags: ['poissons ratio', 'volumetric strain', 'bulk modulus'], units: ['dimensionless'] },
    { id: 'f-carnot', title: 'Carnot & Otto Cycle Efficiencies', category: 'Formula', subject: 'Thermal', view: 'formulas', description: 'Air-standard thermodynamic cycle formulas', icon: BookOpen, tags: ['carnot cycle', 'otto cycle', 'thermal efficiency'], units: ['%', 'K'] },

    // Viva
    { id: 'v-all', title: 'Viva Oral Exam Question Bank (5 Subjects)', category: 'Viva Center', subject: 'All Subjects', view: 'viva', description: 'SOM, Thermal-I, Mfg-I, Materials, Drawing oral exam preparation', icon: HelpCircle, tags: ['viva', 'oral exam', 'questions', 'interview', 'som', 'thermal', 'mfg'] },

    // Resources Hub
    { id: 'r-calendar', title: 'Official Academic Calendar (2026–2027)', category: 'Academic', subject: 'WBSCTE', view: 'resources', description: 'Official Academic Calendar PDF', icon: Calendar, year: '2026-2027', tags: ['calendar', 'academic timeline', 'exam dates', '2026', '2027'] },
    { id: 'r-syllabus', title: 'WBSCTVESD Diploma ME Sem 3 Official Syllabus (Revised 2022)', category: 'Academic', subject: 'WBSCTE', view: 'resources', description: 'Official ME Sem 3 Syllabus PDF', icon: BookOpen, year: '2022', tags: ['syllabus', 'curriculum', 'diploma me', '2022'] },
    { id: 'r-routine-college', title: 'Official College Routine (Sem 3 ME)', category: 'Academic', subject: 'WBSCTE', view: 'resources', description: 'Official College Timetable PDF', icon: Clock, year: '2026', tags: ['routine', 'timetable', 'college schedule'] },
    { id: 'r-routine-simple', title: 'Simplified Student Routine (Sem 3 ME)', category: 'Academic', subject: 'WBSCTE', view: 'resources', description: 'Student Routine Timetable PDF', icon: Clock, year: '2026', tags: ['routine', 'simplified timetable', 'student view'] },
    { id: 'r-univ-template', title: 'Universal Assignment & Lab Record Kit', category: 'Academic', subject: 'WBSCTE', view: 'resources', description: 'Universal Lab & Assignment Kit PDF', icon: Download, tags: ['assignment template', 'lab record kit', 'front page'] },
    { id: 'r-front-index', title: 'Thermal Engineering-I Lab Report Kit (Front & Index Sheet)', category: 'Resources', subject: 'Thermal-I', view: 'resources', description: 'Thermal Lab Report Kit MEPC 215 PDF', icon: Download, fileUrl: '/labs/thermal_front_index.pdf', filename: 'thermal_front_index.pdf', tags: ['thermal lab kit', 'mepc 215', 'index sheet', 'front page'] },
    { id: 'r-pyq', title: 'Previous Year Question Papers & Mega Bundle (2017–2026)', category: 'Resources', subject: 'All Subjects', view: 'resources', description: 'PYQ Archives & Complete Mega Bundle', icon: HelpCircle, year: '2017–2026', fileUrl: '/pyq/sem3_pyq_master_all.pdf', tags: ['pyq', 'previous year question', '2017', '2018', '2019', '2021', '2022', '2023', '2024', '2026', 'som', 'thermal', 'mfg', 'materials', 'drawing'] },
    { id: 'pyq-som', title: 'Strength of Materials (SOM) PYQ Papers (2018–2026)', category: 'PYQ Archive', subject: 'SOM', view: 'resources', description: 'Official SOM exam papers (2018, 2021, 2022, 2023, 2024 Jan/Dec, 2026)', icon: FileText, year: '2018–2026', fileUrl: '/pyq/som_pyq_all.pdf', tags: ['som', 'mepc 205', 'strength of materials', 'pyq', '2018', '2021', '2022', '2023', '2024', '2026'] },
    { id: 'pyq-thermal', title: 'Thermal Engineering-I PYQ Papers (2018–2026)', category: 'PYQ Archive', subject: 'Thermal-I', view: 'resources', description: 'Official Thermal-I exam papers (2018, 2019, 2021, 2022, 2023, 2024 Jan/Dec, 2026)', icon: FileText, year: '2018–2026', fileUrl: '/pyq/thermal_pyq_all.pdf', tags: ['thermal', 'mepc 209', 'thermal engineering', 'pyq', '2018', '2019', '2021', '2022', '2023', '2024', '2026'] },
    { id: 'pyq-mfg', title: 'Manufacturing Processes-I PYQ Papers (2017–2026)', category: 'PYQ Archive', subject: 'Mfg Processes-I', view: 'resources', description: 'Official Mfg-I exam papers (2017, 2018, 2019, 2021, 2022, 2023, 2024 Jan/Dec, 2026)', icon: FileText, year: '2017–2026', fileUrl: '/pyq/mfg1_pyq_all.pdf', tags: ['mfg', 'mepc 207', 'manufacturing processes', 'pyq', '2017', '2018', '2019', '2021', '2022', '2023', '2024', '2026'] },
    { id: 'pyq-materials', title: 'Mechanical Engineering Materials PYQ Papers (2018–2026)', category: 'PYQ Archive', subject: 'Materials', view: 'resources', description: 'Official Materials exam papers (2018, 2019, 2022, 2023, 2024 Jan/Dec, 2026)', icon: FileText, year: '2018–2026', fileUrl: '/pyq/materials_pyq_all.pdf', tags: ['materials', 'mepc 203', 'materials', 'pyq', '2018', '2019', '2022', '2023', '2024', '2026'] },
    { id: 'pyq-drawing', title: 'Mechanical Engineering Drawing PYQ Master Archive', category: 'PYQ Archive', subject: 'Drawing', view: 'resources', description: 'Official Mechanical Engineering Drawing exam question papers MEPC 201', icon: FileText, year: '2022–2026', fileUrl: '/pyq/drawing_pyq_all.pdf', tags: ['drawing', 'mepc 201', 'engineering drawing', 'pyq'] },
  ];

  const filteredItems = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 8);
    return searchIndex.filter((item) => matchesMultiField(item, query));
  }, [query, searchIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 search-modal gpu-accelerated">
      <div className="w-full max-w-2xl bg-white dark:bg-mech-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn transform-gpu gpu-accelerated">
        {/* Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators, formulas, lab guides, or viva questions..."
            className="w-full h-14 pl-3 pr-10 text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-mech-blue dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-mech-blue dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-mech-blue transition-all" />
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching tools or formulas found for "{query}".
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Navigate with click or Enter</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
