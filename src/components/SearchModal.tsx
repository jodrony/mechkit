import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Calculator, FlaskConical, Hammer, BookOpen, HelpCircle, Download, ArrowRight, Scale, Calendar, Clock } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  view: string;
  description: string;
  icon: any;
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
    { id: 'c-rpm', title: 'Spindle Speed (RPM) Calculator', category: 'Calculator', view: 'calculators', description: 'N = 1000V / (π D) with lathe gear RPM snap', icon: Calculator },
    { id: 'c-cs', title: 'Cutting Speed (V) Calculator', category: 'Calculator', view: 'calculators', description: 'V = π D N / 1000 surface velocity', icon: Calculator },
    { id: 'c-stress', title: 'Direct Stress (σ) Calculator', category: 'Calculator', view: 'calculators', description: 'σ = P / A for solid/hollow round and rect bars', icon: Calculator },
    { id: 'c-strain', title: 'Strain & Hooke (ε) Calculator', category: 'Calculator', view: 'calculators', description: 'ε = ΔL / L and σ = E · ε', icon: Calculator },
    { id: 'c-mtime', title: 'Machining Time (T) Calculator', category: 'Calculator', view: 'calculators', description: 'T = (L + A + O) / (f · N) for lathe turning', icon: Calculator },
    { id: 'c-shear', title: 'Shear Stress (τ) Calculator', category: 'Calculator', view: 'calculators', description: 'Single and double shear for pins & rivets', icon: Calculator },
    { id: 'c-torque', title: 'Shaft Torque & Power Calculator', category: 'Calculator', view: 'calculators', description: 'P = 2πNT / 60000 and τ = 16T / (π d³)', icon: Calculator },
    { id: 'c-thermal', title: 'Thermal Expansion Calculator', category: 'Calculator', view: 'calculators', description: 'ΔL = L · α · ΔT and thermal stress check', icon: Calculator },

    // Engineering Utilities
    { id: 'u-univ', title: 'Universal SI Unit Converter', category: 'Utilities', view: 'utilities', description: 'Convert length, pressure, torque, power, temp, angle, speed, force, energy', icon: Scale },
    { id: 'u-density', title: 'Density / Mass / Volume Calculator', category: 'Utilities', view: 'utilities', description: 'ρ = m / V with engineering material presets', icon: Scale },
    { id: 'u-weight', title: 'Material Stock Weight Calculator', category: 'Utilities', view: 'utilities', description: 'Round bar, flat plate, pipe, hex bar stock mass and unit weight', icon: Scale },
    { id: 'u-conv', title: 'Individual Unit Converters (10 Types)', category: 'Utilities', view: 'utilities', description: 'Pressure, area, volume, mass, force, speed, power, energy, angle, temp', icon: Scale },

    // Lab
    { id: 'l-boiler1', title: 'Lancashire Boiler Lab Manual (exp1_tl.pdf)', category: 'Thermal Lab', view: 'labs', description: 'Two-flue horizontal internally fired fire-tube boiler construction & mountings', icon: FlaskConical },
    { id: 'l-boiler2', title: 'Cochran Boiler Lab Manual (exp2_tl.pdf)', category: 'Thermal Lab', view: 'labs', description: 'Vertical multi-tubular fire-tube boiler with hemispherical crown', icon: FlaskConical },
    { id: 'l-boiler3', title: 'Babcock & Wilcox Boiler Manual (exp3_tl.pdf)', category: 'Thermal Lab', view: 'labs', description: 'High-pressure inclined water-tube boiler with superheater', icon: FlaskConical },
    { id: 'l-utm', title: 'Materials Testing: UTM Tensile Test (MEPC 211)', category: 'Materials Lab', view: 'labs', description: 'Stress-strain diagram, yield point, UTS, elongation (pending upload)', icon: FlaskConical },
    { id: 'l-mfg', title: 'Manufacturing Practice (MEPC 213)', category: 'Mfg Lab', view: 'labs', description: 'Lathe step turning, taper turning, knurling, shaper, milling (pending upload)', icon: FlaskConical },
    { id: 'l-drawing', title: 'Drawing Practice (MEPC 217)', category: 'Drawing Lab', view: 'labs', description: 'Machine drawing, orthographic sections, limits & fits, CAD (pending upload)', icon: FlaskConical },

    // Workshop
    { id: 'w-lathe', title: 'Lathe Practice & ASA Tool Geometry', category: 'Workshop', view: 'workshop', description: '7-element ASA signature: αb - αs - θe - θs - Ce - Cs - R', icon: Hammer },
    { id: 'w-milling', title: 'Up-Milling vs Down-Milling & Indexing', category: 'Workshop', view: 'workshop', description: 'Dividing head simple indexing formula M = 40 / N', icon: Hammer },
    { id: 'w-shaper', title: 'Shaper Quick Return Ratio (QRR)', category: 'Workshop', view: 'workshop', description: 'Crank & slotted lever mechanism kinematics', icon: Hammer },
    { id: 'w-welding', title: 'Oxy-Acetylene Flame Types & Welding Defects', category: 'Workshop', view: 'workshop', description: 'Neutral, oxidizing, and carburizing flames', icon: Hammer },
    { id: 'w-foundry', title: 'Pattern Allowances in Casting', category: 'Workshop', view: 'workshop', description: 'Shrinkage, draft, machining, and shake allowances', icon: Hammer },
    { id: 'w-fitting', title: 'Tap Drill Size & Bench Fitting Practice', category: 'Workshop', view: 'workshop', description: 'TDS = D - P and 118° twist drill point angle', icon: Hammer },

    // Formulas
    { id: 'f-torsion', title: 'Torsion Equation (T/J = τ/R = Gθ/L)', category: 'Formula', view: 'formulas', description: 'Polar moment of inertia and shaft twist', icon: BookOpen },
    { id: 'f-bending', title: 'Pure Bending Equation (M/I = σ/y = E/R)', category: 'Formula', view: 'formulas', description: 'Beam flexural stress and section modulus', icon: BookOpen },
    { id: 'f-poisson', title: "Poisson's Ratio & Volumetric Strain", category: 'Formula', view: 'formulas', description: 'ν = lateral strain / linear strain', icon: BookOpen },
    { id: 'f-carnot', title: 'Carnot & Otto Cycle Efficiencies', category: 'Formula', view: 'formulas', description: 'Air-standard thermodynamic cycle formulas', icon: BookOpen },

    // Viva
    { id: 'v-all', title: 'Viva Oral Exam Question Bank (5 Subjects)', category: 'Viva Center', view: 'viva', description: 'SOM, Thermal-I, Mfg-I, Materials, Drawing oral exam preparation', icon: HelpCircle },

    // Resources Hub
    { id: 'r-calendar', title: 'Official Academic Calendar (2026–2027)', category: 'Academic', view: 'resources', description: 'WBSCTVESD official semester dates, internals, practicals, board exams PDF', icon: Calendar },
    { id: 'r-syllabus', title: 'WBSCTVESD Diploma ME Sem 3 Official Syllabus (Revised 2022)', category: 'Academic', view: 'resources', description: 'Full 1000 marks scheme, 5 theory subjects, 4 practical labs', icon: BookOpen },
    { id: 'r-routine-college', title: 'Official College Routine (Sem 3 ME)', category: 'Academic', view: 'resources', description: 'Weekly 3rd semester class & lab timetable with faculty allocations', icon: Clock },
    { id: 'r-routine-simple', title: 'Simplified Student Routine (Sem 3 ME)', category: 'Academic', view: 'resources', description: 'High-contrast mobile-friendly weekly student routine', icon: Clock },
    { id: 'r-univ-template', title: 'Universal Assignment & Lab Record Kit', category: 'Academic', view: 'resources', description: 'Universal front cover, title page, and blank index sheet (Print Ready)', icon: Download },
    { id: 'r-front-index', title: 'Thermal Engineering-I Lab Report Kit (Front & Index Sheet)', category: 'Resources', view: 'resources', description: 'Printable A4 cover, title sheet & index table for MEPC 215', icon: Download },
    { id: 'r-pyq', title: 'Previous Year Question Papers & Mega Bundle (2017–2026)', category: 'Resources', view: 'resources', description: 'SOM, Thermal-I, Mfg-I, Materials, Drawing PYQ master archives & session papers', icon: HelpCircle },
  ];

  const filteredItems = useMemo(() => {
    if (!query.trim()) return searchIndex.slice(0, 8);
    const q = query.toLowerCase();
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
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
