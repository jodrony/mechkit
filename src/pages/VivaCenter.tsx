import React, { useState, useMemo, useEffect } from 'react';
import {
  boilerExperiments,
  type BoilerVivaExperiment,
  type ComponentQuestion
} from '../data/vivaThermalData';
import {
  TestTube2,
  GraduationCap,
  Flame,
  Maximize2,
  X,
  Eye,
  EyeOff,
  Shuffle,
  ChevronRight,
  ChevronLeft,
  Search,
  CheckCircle2,
  Wrench,
  Activity,
  Layers,
  PenTool
} from 'lucide-react';

type VivaMode = 'experiment' | 'semester';
type SubjectCategory = 'som' | 'thermal' | 'mfg' | 'materials' | 'drawing';

interface TheoryVivaItem {
  id: number;
  question: string;
  answer: string;
  topic: string;
  yieldLevel: 'High Yield' | 'Core Concept' | 'Exam Favorite';
}

const semesterVivaData: Record<SubjectCategory, TheoryVivaItem[]> = {
  som: [
    {
      id: 1,
      topic: 'Stress & Strain Basics',
      yieldLevel: 'High Yield',
      question: 'Define Direct Normal Stress and Linear Strain. What is the SI unit of stress?',
      answer: 'Normal Stress (σ = P/A) is the internal resisting force per unit cross-sectional area developed against an axial load (SI unit: N/m² or Pa; 1 MPa = 1 N/mm²). Linear Strain (ε = ΔL/L) is the dimensionless ratio of elongation to original length.',
    },
    {
      id: 2,
      topic: "Hooke's Law",
      yieldLevel: 'Core Concept',
      question: 'State Hooke’s Law and clarify its strict boundary of validity.',
      answer: 'Hooke’s Law states that direct stress is directly proportional to direct strain strictly within the proportional limit of elasticity (σ = E · ε). Beyond the proportional limit, the relationship ceases to be linear even if the material still behaves elastically up to the elastic limit.',
    },
    {
      id: 3,
      topic: "Poisson's Ratio",
      yieldLevel: 'Exam Favorite',
      question: 'What is Poisson’s Ratio? State its practical range for engineering metals.',
      answer: 'Poisson’s ratio (μ or ν) is the ratio of transverse (lateral) strain to axial (longitudinal) strain under uniaxial tensile loading (μ = -ε_lateral / ε_longitudinal). For structural steels and common metals, it ranges strictly between 0.25 and 0.33.',
    },
    {
      id: 4,
      topic: 'Torsion of Shafts',
      yieldLevel: 'High Yield',
      question: 'Why is a hollow shaft stronger and stiffer in torsion than a solid shaft of the exact same weight and material?',
      answer: 'In pure torsion, shear stress varies linearly from zero at the center to maximum at the outer skin. In a hollow shaft, material is distributed away from the neutral axis at larger radii, resulting in a substantially higher Polar Moment of Inertia (J) and Polar Section Modulus (Z_p = J / R).',
    },
    {
      id: 5,
      topic: 'Design Safety',
      yieldLevel: 'Core Concept',
      question: 'Define Factor of Safety (FOS). How is it chosen for ductile vs brittle materials?',
      answer: 'Factor of Safety is the ratio of failure stress to maximum allowable design working stress. For ductile materials (like mild steel), FOS = Yield Stress / Working Stress (typically 1.5–2.5). For brittle materials (like cast iron with uncertain defects), FOS = Ultimate Tensile Stress / Working Stress (typically 3.0–5.0).',
    },
    {
      id: 6,
      topic: 'Thermal Stress',
      yieldLevel: 'Exam Favorite',
      question: 'Under what physical condition does a temperature change cause thermal stress in a body?',
      answer: 'Thermal stress (σ_th = α · ΔT · E) develops ONLY when free thermal expansion or contraction is externally or internally restrained. If a heated bar is completely free to expand, strain occurs without any induced thermal stress.',
    },
    {
      id: 7,
      topic: 'Flexural Bending',
      yieldLevel: 'High Yield',
      question: 'State the simple bending equation and define the neutral axis of a beam.',
      answer: 'The bending equation is M / I = σ_b / y = E / R. The Neutral Axis is the longitudinal layer of the beam cross-section where bending stress and linear strain are exactly zero during transverse flexure.',
    },
    {
      id: 8,
      topic: 'Elastic Moduli Relations',
      yieldLevel: 'Core Concept',
      question: 'Write down the relationship between Young’s Modulus (E), Bulk Modulus (K), and Shear Modulus (G).',
      answer: 'E = (9 · K · G) / (3K + G). Also, E = 2G(1 + μ) and E = 3K(1 - 2μ). Eliminating Poisson’s ratio μ yields the unified expression.',
    },
  ],
  thermal: [
    {
      id: 1,
      topic: 'Thermodynamics Laws',
      yieldLevel: 'High Yield',
      question: 'State the First Law of Thermodynamics for a closed non-flow system.',
      answer: 'Energy cannot be created or destroyed, only transformed. For a closed system undergoing a process, net heat supplied (Q) equals the increase in internal energy (ΔU) plus the boundary work performed (W): Q = ΔU + W.',
    },
    {
      id: 2,
      topic: 'Specific Heats of Gases',
      yieldLevel: 'Exam Favorite',
      question: 'Why is the specific heat of gas at constant pressure (Cp) always greater than that at constant volume (Cv)?',
      answer: 'When heat is added at constant volume, all energy increases internal thermal energy (temperature). At constant pressure, the gas expands against atmospheric resistance, requiring additional heat to perform external boundary work (PΔV). Hence, C_p - C_v = R (Mayer’s Relation).',
    },
    {
      id: 3,
      topic: 'Boiler Mountings vs Accessories',
      yieldLevel: 'High Yield',
      question: 'What is the fundamental difference between a Boiler Mounting and a Boiler Accessory?',
      answer: 'Boiler Mountings (Safety valves, water level indicator, pressure gauge, fusible plug, blow-off cock) are mandatory statutory fittings required for safe operation. Boiler Accessories (Economizer, air preheater, superheater, feed pump) are auxiliary devices fitted to increase overall thermal efficiency.',
    },
    {
      id: 4,
      topic: 'IC Engine Cycles',
      yieldLevel: 'Exam Favorite',
      question: 'For the same compression ratio and heat input, which cycle is more efficient: Otto or Diesel?',
      answer: 'The Otto cycle is more efficient because heat addition occurs instantaneously at constant volume (isochoric), resulting in maximum peak combustion temperature and pressure for a given compression ratio.',
    },
    {
      id: 5,
      topic: 'Properties of Steam',
      yieldLevel: 'Core Concept',
      question: 'Define Dryness Fraction (x) of steam. What is its numerical value for dry saturated steam and saturated water?',
      answer: 'Dryness fraction x = m_v / (m_v + m_w), representing the mass ratio of dry vapor to total wet steam mixture. For saturated boiling liquid water, x = 0; for dry saturated steam with zero suspended moisture, x = 1.0 (100%).',
    },
    {
      id: 6,
      topic: 'Second Law Statements',
      yieldLevel: 'High Yield',
      question: 'State the Kelvin-Planck and Clausius statements of the Second Law of Thermodynamics.',
      answer: 'Kelvin-Planck: It is impossible to construct a heat engine operating in a cycle that produces net work while exchanging heat with only a single thermal reservoir (100% thermal efficiency is impossible). Clausius: It is impossible to transfer heat from a cooler body to a hotter body without external work input.',
    },
    {
      id: 7,
      topic: 'Superheating Advantages',
      yieldLevel: 'Core Concept',
      question: 'What are the two major thermodynamic benefits of superheating steam before entering a turbine?',
      answer: '1. Increases Rankine cycle thermal efficiency by raising the mean temperature of heat addition. 2. Prevents blade erosion and condensation moisture loss by keeping steam dry during expansion through low-pressure turbine stages.',
    },
    {
      id: 8,
      topic: 'Refrigeration COP',
      yieldLevel: 'Exam Favorite',
      question: 'Define Coefficient of Performance (COP). Why is COP of a heat pump greater than a refrigerator by 1?',
      answer: 'COP = Desired Effect / Work Input. For a Refrigerator, COP_ref = Q_L / W. For a Heat Pump, COP_hp = Q_H / W = (Q_L + W) / W = COP_ref + 1.',
    },
  ],
  mfg: [
    {
      id: 1,
      topic: 'Lathe Kinematics',
      yieldLevel: 'High Yield',
      question: 'What are the 3 principal cutting movements required on an engine lathe to generate a cylinder?',
      answer: '1. Primary Cutting Motion: Rotary speed of workpiece held in chuck (RPM). 2. Feed Motion: Longitudinal translation of the cutting tool carriage parallel to lathe axis (mm/rev). 3. Depth of Cut: Perpendicular cross-slide infeed setting chip thickness (mm).',
    },
    {
      id: 2,
      topic: 'Tool Geometry',
      yieldLevel: 'Exam Favorite',
      question: 'Explain the 7 elements of the standard ASA single-point cutting tool signature.',
      answer: 'The 7 elements in order are: Back Rake Angle - Side Rake Angle - End Relief Angle - Side Relief Angle - End Cutting Edge Angle - Side Cutting Edge Angle - Nose Radius (e.g., 8-14-6-6-15-15-0.8 mm).',
    },
    {
      id: 3,
      topic: 'Twist Drill Features',
      yieldLevel: 'High Yield',
      question: 'What is the standard point angle of a twist drill for mild steel, and what is the chisel edge angle?',
      answer: 'Standard point angle is 118° (with 12° to 15° lip relief angle) for general carbon steels. The chisel edge (web bridge) angle is typically 125° to 135° to the cutting lips.',
    },
    {
      id: 4,
      topic: 'Oxy-Acetylene Welding',
      yieldLevel: 'Core Concept',
      question: 'Name the 3 types of oxy-acetylene flames and state their applications.',
      answer: '1. Neutral Flame (1:1 O₂:C₂H₂, 3200°C): Most common, used for mild steel, stainless steel, and copper. 2. Oxidizing Flame (excess O₂, ~3500°C): Hissing inner cone, used for brass and bronze welding. 3. Carburizing/Reducing Flame (excess C₂H₂, ~3000°C): Carbon feather, used for aluminum, nickel, and high-carbon alloy hard-facing.',
    },
    {
      id: 5,
      topic: 'Taper Turning Calculation',
      yieldLevel: 'High Yield',
      question: 'How is the compound rest swivel angle calculated for turning a taper on a lathe?',
      answer: 'tan(α) = (D - d) / (2 · L), where D is the major diameter, d is the minor diameter, and L is the axial length of the tapered segment. The compound rest is swiveled by half the total included cone angle α.',
    },
    {
      id: 6,
      topic: 'Milling Operations',
      yieldLevel: 'Exam Favorite',
      question: 'Differentiate between Up-Milling (Conventional) and Down-Milling (Climb).',
      answer: 'Up-Milling: Cutter rotates opposite to table feed; chip thickness starts at zero and increases to maximum; lifts workpiece upwards; safer on older machines without backlash eliminators. Down-Milling: Cutter rotates in the feed direction; chip starts at maximum and tapers to zero; presses workpiece downward onto table; produces superior surface finish and longer tool life.',
    },
    {
      id: 7,
      topic: 'Dividing Head Indexing',
      yieldLevel: 'Core Concept',
      question: 'Explain simple indexing on a universal dividing head. What is the standard worm gear ratio?',
      answer: 'The standard worm-and-worm-wheel ratio is 40:1 (40 turns of the index crank rotate the work spindle by 1 full revolution). The indexing formula is Index Crank Movement M = 40 / N, where N is the desired number of divisions.',
    },
    {
      id: 8,
      topic: 'Shaper Mechanism',
      yieldLevel: 'Exam Favorite',
      question: 'Why does a shaping machine utilize a quick return mechanism?',
      answer: 'Metal cutting occurs solely during the forward stroke. The backward stroke is an idle return. The crank and slotted lever mechanism drives the return stroke at double speed (QRR ≈ 2:1), drastically minimizing non-productive machine cycle time.',
    },
  ],
  materials: [
    {
      id: 1,
      topic: 'Iron-Carbon Diagram',
      yieldLevel: 'High Yield',
      question: 'What is the Eutectoid reaction in the Iron-Carbon equilibrium phase diagram?',
      answer: 'The eutectoid reaction occurs at 727°C and 0.76% carbon (or 0.8% C), where solid single-phase Austenite (γ-iron, FCC) decomposes isothermally into a lamellar mixture of Ferrite (α-iron, BCC) and Cementite (Fe₃C), known as Pearlite.',
    },
    {
      id: 2,
      topic: 'Heat Treatment',
      yieldLevel: 'High Yield',
      question: 'Why is Tempering always carried out immediately after Quenching in steel hardening?',
      answer: 'Quenching transforms austenite into Martensite, which is extremely hard but dangerously brittle and packed with severe residual thermal stresses. Tempering reheats the steel below the lower critical temperature (727°C) to relieve residual stresses, restore toughness and ductility, and transform martensite into tempered martensite.',
    },
    {
      id: 3,
      topic: 'Crystal Structures',
      yieldLevel: 'Core Concept',
      question: 'Distinguish between BCC and FCC crystal structures with examples of engineering metals.',
      answer: 'Body-Centered Cubic (BCC) has an atomic packing factor (APF) of 0.68 with coordination number 8 (e.g., α-iron, chromium, tungsten; higher yield strength, less ductile at low temp). Face-Centered Cubic (FCC) has an APF of 0.74 with coordination number 12 (e.g., γ-iron, copper, aluminum; more slip systems, high ductility even at cryogenic temperatures).',
    },
    {
      id: 4,
      topic: 'Cast Iron Types',
      yieldLevel: 'Exam Favorite',
      question: 'What causes the superior vibration damping capacity of Gray Cast Iron compared to Ductile Cast Iron?',
      answer: 'Gray cast iron contains graphite in the form of sharp, interconnected flakes that disperse vibrational energy and arrest harmonic resonance through internal friction. In ductile (nodular) cast iron, magnesium/cerium inoculation forces graphite to spheroidize into isolated nodules, yielding high tensile ductility but lower damping.',
    },
    {
      id: 5,
      topic: 'Mechanical Testing',
      yieldLevel: 'High Yield',
      question: 'Differentiate between Brinell and Rockwell Hardness testing methods.',
      answer: 'Brinell Hardness Test uses a 10 mm hardened steel or tungsten carbide ball indenter under a heavy load (typically 3000 kgf) and calculates BHN from the surface area of indentation measured optically. Rockwell Hardness Test measures the net increase in depth of penetration directly under a minor initial load (10 kgf) followed by a major load (e.g., 150 kgf for HRC with a 120° diamond cone indenter).',
    },
    {
      id: 6,
      topic: 'Fatigue & Endurance',
      yieldLevel: 'Exam Favorite',
      question: 'Define Fatigue Failure and Endurance (Fatigue) Limit on an S-N curve.',
      answer: 'Fatigue failure is progressive, localized structural fracture occurring under fluctuating, cyclic stresses well below the material’s static yield strength. The Endurance Limit is the stress amplitude below which a ferrous metal can endure an infinite number of stress cycles (typically > 10⁷ cycles) without failing.',
    },
    {
      id: 7,
      topic: 'Copper Alloys',
      yieldLevel: 'Core Concept',
      question: 'State the principal elemental composition and applications of Brass vs Bronze.',
      answer: 'Brass is an alloy of Copper (Cu) and Zinc (Zn), offering excellent machinability, corrosion resistance, and acoustic properties (used for valves, fittings, cartridge cases). Bronze is an alloy of Copper (Cu) and Tin (Sn) (often with phosphorus, aluminum, or silicon), offering superior sliding wear resistance, high strength, and seawater corrosion resistance (used for journal bearings, marine propellers, worm gears).',
    },
    {
      id: 8,
      topic: 'High-Temperature Behavior',
      yieldLevel: 'Core Concept',
      question: 'Define Creep in metals and name the homologous temperature at which it becomes significant.',
      answer: 'Creep is slow, progressive, time-dependent plastic deformation occurring under constant mechanical stress over prolonged time periods. Creep becomes an engineered concern when operating temperature exceeds the homologous temperature of approximately 0.4 T_m to 0.5 T_m (where T_m is absolute melting temperature in Kelvin), such as in boiler superheater tubes and gas turbine blades.',
    },
  ],
  drawing: [
    {
      id: 1,
      topic: 'Projection Systems',
      yieldLevel: 'High Yield',
      question: 'Explain the fundamental difference between First Angle and Third Angle Projection.',
      answer: 'In First Angle Projection (ISO / Indian Standard IS:962), the object is positioned between the observer and the projection plane; views are inverted (Top view lies below Front view; Left side view lies to the right). In Third Angle Projection, the projection plane lies between the observer and the object; views stay on their natural sides (Top view lies above Front view).',
    },
    {
      id: 2,
      topic: 'Limits & Fits',
      yieldLevel: 'High Yield',
      question: 'Why is the Hole Basis System overwhelmingly preferred over the Shaft Basis System in mechanical engineering manufacture?',
      answer: 'Holes are produced using fixed-dimension cutting tools (drills, reamers, broaches) and inspected with costly plug gauges, making standard hole variation expensive. In contrast, external shaft diameters can be easily machined and adjusted to any desired fit tolerance on standard cylindrical grinders and lathes with single-point tools.',
    },
    {
      id: 3,
      topic: 'Fits Classification',
      yieldLevel: 'Core Concept',
      question: 'Differentiate between Clearance Fit, Transition Fit, and Interference Fit.',
      answer: '1. Clearance Fit: The lower limit of the hole is always greater than or equal to the upper limit of the shaft (positive clearance; e.g., journal bearings). 2. Interference Fit: The upper limit of the hole is smaller than or equal to the lower limit of the shaft (negative clearance; e.g., shrink-fit flywheel rims). 3. Transition Fit: Tolerance zones overlap, permitting either slight clearance or slight interference (e.g., locating dowel pins).',
    },
    {
      id: 4,
      topic: 'Screw Thread Geometry',
      yieldLevel: 'Exam Favorite',
      question: 'State the thread angle for ISO Metric threads and define Pitch vs Lead for multi-start threads.',
      answer: 'The standard ISO Metric thread has an included profile angle of 60° (with crest flat and root rounded). Pitch (P) is the axial distance between corresponding points on adjacent thread contours. Lead (L) is the axial advance of a nut in one full 360° rotation: Lead = Number of Starts (n) × Pitch (P). For a single-start thread, Lead = Pitch.',
    },
    {
      id: 5,
      topic: 'Sectional Views',
      yieldLevel: 'Core Concept',
      question: 'What are the drafting rules for Hatching (Section Lining) according to BIS standards?',
      answer: 'Hatching lines must be thin, continuous lines (Type B) drawn at a 45° angle to the main outline or center line of the section. Adjacent assembled components must be hatched in opposite directions (45° and 135°) or with different line spacing. Solid standard parts such as shafts, bolts, nuts, rivets, keys, and gear teeth are NEVER sectioned longitudinally.',
    },
    {
      id: 6,
      topic: 'Surface Texture Representation',
      yieldLevel: 'High Yield',
      question: 'Explain how Surface Roughness values (Ra) are indicated on an engineering drawing symbol.',
      answer: 'A check-mark triangular symbol is placed on the surface: an open triangle for unspecified machining, a closed inverted triangle with a horizontal bar for material removal by machining, and a circle inside for material removal prohibited. The Roughness Average (Ra in μm) or roughness grade (N1 to N12) is placed directly on top of the horizontal shelf.',
    },
    {
      id: 7,
      topic: 'Assembly Drawings & BOM',
      yieldLevel: 'Core Concept',
      question: 'What is the purpose of a Bill of Materials (BOM) in a mechanical assembly drawing?',
      answer: 'A Bill of Materials (Part List) tabulates all constituent components of an assembly with their assigned item numbers, descriptive part names, required quantities, materials of construction, and standard drawing/procurement specifications, enabling accurate procurement, machining scheduling, and error-free assembly.',
    },
    {
      id: 8,
      topic: 'Geometric Tolerancing (GD&T)',
      yieldLevel: 'Exam Favorite',
      question: 'What does a Feature Control Frame contain in GD&T drawings?',
      answer: 'A Feature Control Frame is a rectangular compartment divided into compartments: 1st compartment displays the geometric characteristic symbol (e.g., parallelism, perpendicularity, position, runout); 2nd compartment contains the total tolerance value (preceded by ⌀ if cylindrical); 3rd and subsequent compartments define the Primary, Secondary, and Tertiary Datum references (e.g., A, B, C).',
    },
  ],
};

export interface VivaCenterProps {
  initialMode?: VivaMode;
  initialBoilerId?: string;
}

export const VivaCenter: React.FC<VivaCenterProps> = ({
  initialMode = 'experiment',
  initialBoilerId = 'lancashire',
}) => {
  // Top-Level Two-Tier Mode: 'experiment' (Diagram & Component Quiz) vs 'semester' (Final Theory Flashcards)
  const [vivaMode, setVivaMode] = useState<VivaMode>(initialMode);

  // ====================================================
  // Tier 1: Experiment Component Viva State
  // ====================================================
  const [selectedBoilerId, setSelectedBoilerId] = useState<string>(initialBoilerId);
  const [activeComponentIndex, setActiveComponentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialMode) {
      setVivaMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    if (initialBoilerId) {
      setSelectedBoilerId(initialBoilerId);
      setActiveComponentIndex(0);
    }
  }, [initialBoilerId]);

  // Active boiler experiment data
  const currentBoiler: BoilerVivaExperiment = useMemo(() => {
    return (
      boilerExperiments.find((b) => b.id === selectedBoilerId) ||
      boilerExperiments[0]
    );
  }, [selectedBoilerId]);

  const currentComponent: ComponentQuestion = useMemo(() => {
    const list = currentBoiler.components;
    if (activeComponentIndex >= list.length) return list[0];
    return list[activeComponentIndex];
  }, [currentBoiler, activeComponentIndex]);

  const handleNextComponent = () => {
    setActiveComponentIndex((prev) => (prev + 1) % currentBoiler.components.length);
  };

  const handlePrevComponent = () => {
    setActiveComponentIndex((prev) => (prev - 1 + currentBoiler.components.length) % currentBoiler.components.length);
  };

  const handleRandomComponent = () => {
    const total = currentBoiler.components.length;
    let nextIdx = Math.floor(Math.random() * total);
    if (nextIdx === activeComponentIndex && total > 1) {
      nextIdx = (nextIdx + 1) % total;
    }
    setActiveComponentIndex(nextIdx);
  };

  // ====================================================
  // Tier 2: Semester-End Final Theory Viva State
  // ====================================================
  const [theorySubject, setTheorySubject] = useState<SubjectCategory>('thermal');
  const [theorySearch, setTheorySearch] = useState<string>('');
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [showAllTheory, setShowAllTheory] = useState<boolean>(false);

  const theoryCategories: { id: SubjectCategory; label: string; code: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'som', label: 'Strength of Materials', code: 'MEPC 205', icon: Activity },
    { id: 'thermal', label: 'Thermal Engineering-I', code: 'MEPC 209', icon: Flame },
    { id: 'mfg', label: 'Manufacturing Processes-I', code: 'MEPC 207', icon: Wrench },
    { id: 'materials', label: 'Engg Materials', code: 'MEPC 203', icon: Layers },
    { id: 'drawing', label: 'Engg Drawing', code: 'MEPC 201', icon: PenTool },
  ];

  const filteredTheoryQuestions = useMemo(() => {
    const list = semesterVivaData[theorySubject] || [];
    if (!theorySearch.trim()) return list;
    const q = theorySearch.toLowerCase();
    return list.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q)
    );
  }, [theorySubject, theorySearch]);

  const toggleTheoryReveal = (id: number) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRandomTheory = () => {
    if (filteredTheoryQuestions.length > 0) {
      const randomItem = filteredTheoryQuestions[Math.floor(Math.random() * filteredTheoryQuestions.length)];
      setRevealedAnswers(new Set([randomItem.id]));
      const elem = document.getElementById(`theory-card-${randomItem.id}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const getCategoryBadgeClass = (category: ComponentQuestion['category']) => {
    switch (category) {
      case 'Mounting':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800/80';
      case 'Accessory':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800/80';
      case 'Structural':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800/80';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2.5 sm:px-6 py-3 sm:py-5 space-y-3 sm:space-y-5">
      {/* Top Header & Two-Tier Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-mech-orange">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Oral Viva Examination Center
            </h2>
          </div>
          <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Simulate laboratory oral viva exams: Zero-click component identification and theory flashcards.
          </p>
        </div>

        {/* Top-Level Mode Selector Buttons */}
        <div className="grid grid-cols-2 sm:flex p-1 rounded-2xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 w-full sm:w-auto shrink-0 shadow-2xs">
          <button
            type="button"
            id="btn-mode-experiment"
            onClick={() => setVivaMode('experiment')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              vivaMode === 'experiment'
                ? 'bg-mech-orange text-white shadow-md ring-2 ring-orange-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TestTube2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Diagram Viva</span>
          </button>

          <button
            type="button"
            id="btn-mode-semester"
            onClick={() => setVivaMode('semester')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              vivaMode === 'semester'
                ? 'bg-mech-blue text-white shadow-md ring-2 ring-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">Theory Viva</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TIER 1: EXPERIMENT COMPONENT VIVA (Diagram Oral Exam) */}
      {/* ==================================================== */}
      {vivaMode === 'experiment' && (
        <div className="space-y-2.5 sm:space-y-3.5 animate-fadeIn">
          {/* Top: Boiler Selector Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Boiler Experiment
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-400 dark:text-slate-500">
                Diploma Lab Oral Examination
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
              {boilerExperiments.map((boiler) => {
                const isActive = selectedBoilerId === boiler.id;
                return (
                  <button
                    key={boiler.id}
                    type="button"
                    id={`tab-boiler-${boiler.id}`}
                    onClick={() => {
                      setSelectedBoilerId(boiler.id);
                      setActiveComponentIndex(0);
                    }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer snap-start active:scale-95 ${
                      isActive
                        ? 'bg-mech-orange text-white shadow-md ring-2 ring-orange-500/30'
                        : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>{boiler.title}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {boiler.components.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Body: Mobile Single Column (Zero-Scroll Fit), Desktop/Tablet Split Screen */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 md:gap-5 items-start">
            {/* ==================================================== */}
            {/* LEFT COLUMN: Boiler Diagram Image (Mobile Strictly h-44 sm:h-56) */}
            {/* ==================================================== */}
            <div className="md:col-span-6 md:sticky md:top-20 space-y-2">
              <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-2 sm:p-3 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/10 text-mech-orange border border-orange-200 dark:border-orange-900/40">
                      {currentBoiler.type}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {currentBoiler.title} Diagram
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    title="Open full-screen diagram"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3 text-mech-orange" />
                    <span className="hidden sm:inline">Zoom</span>
                  </button>
                </div>

                {/* Diagram Container: strictly h-44 sm:h-56 on mobile, md:h-[400px] on desktop */}
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative group rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800 p-1.5 flex items-center justify-center h-44 sm:h-56 md:h-[400px] cursor-pointer"
                >
                  <img
                    src={currentBoiler.imageSrc}
                    alt={`${currentBoiler.title} Engineering Diagram`}
                    className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Inline Tap to expand / pinch button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-slate-950/85 hover:bg-slate-900 text-slate-200 border border-slate-700/80 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3 text-mech-orange shrink-0" />
                    <span>Tap to expand / pinch</span>
                  </button>
                </div>

                {/* Concise Summary Line */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono line-clamp-1 px-0.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Summary: </span>
                  {currentBoiler.summary}
                </p>
              </div>
            </div>

            {/* ==================================================== */}
            {/* RIGHT COLUMN: Interactive Zero-Click Oral Viva Card  */}
            {/* ==================================================== */}
            <div className="md:col-span-6 space-y-2">
              <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3 sm:p-4 md:p-5 shadow-xs space-y-3 sm:space-y-4">
                {/* 1. Header: Compact "Jump to Component" select dropdown + progress counter ("Part X of Y") */}
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    Part {activeComponentIndex + 1} of {currentBoiler.components.length}
                  </span>
                  <span className={`hidden sm:inline-block shrink-0 px-2 py-0.5 rounded text-xs font-mono font-bold border ${getCategoryBadgeClass(currentComponent.category)}`}>
                    {currentComponent.category}
                  </span>
                  <select
                    id="component-select-dropdown"
                    value={activeComponentIndex}
                    onChange={(e) => {
                      setActiveComponentIndex(Number(e.target.value));
                    }}
                    className="w-full text-xs sm:text-sm py-1.5 px-2.5 rounded-lg bg-slate-800 border-slate-700 text-slate-200 focus:ring-2 focus:ring-mech-orange focus:outline-none cursor-pointer truncate"
                  >
                    {currentBoiler.components.map((comp, idx) => (
                      <option key={idx} value={idx} className="bg-slate-900 text-slate-200">
                        {String(idx + 1).padStart(2, '0')}. {comp.partName} ({comp.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Title: Bold target part name (e.g. "Component: Chimney") */}
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    Component: <span className="text-mech-orange">{currentComponent.partName}</span>
                  </h3>
                  {/* Question Prompt */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Exam Question: What is the exact function of this component?
                  </p>
                </div>

                {/* 3. Examiner Answer Box (Visible by default in high-contrast orange-bordered container) */}
                <div className="border-2 border-mech-orange bg-orange-500/10 dark:bg-orange-500/15 rounded-xl p-3 sm:p-3.5 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono font-extrabold text-mech-orange uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      Examiner Answer:
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Boiler {currentComponent.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-bold leading-relaxed">
                    "{currentComponent.examinerAnswer || currentComponent.answer}"
                  </p>
                </div>

                {/* 4. Bottom Thumb Bar: [← Previous] [🎲 Random] [Next →] */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    id="btn-prev-part"
                    onClick={handlePrevComponent}
                    className="min-h-[42px] px-2 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                    <span>Previous</span>
                  </button>

                  <button
                    type="button"
                    id="btn-random-part"
                    onClick={handleRandomComponent}
                    className="min-h-[42px] px-2 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Shuffle className="w-3.5 h-3.5 shrink-0" />
                    <span>Random</span>
                  </button>

                  <button
                    type="button"
                    id="btn-next-part"
                    onClick={handleNextComponent}
                    className="min-h-[42px] px-2 py-2 rounded-xl text-xs font-bold bg-mech-blue hover:bg-blue-600 text-white transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lightbox Modal for Full-Screen Diagram Zoom */}
          {isLightboxOpen && (
            <div
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn gpu-accelerated"
              onClick={() => setIsLightboxOpen(false)}
            >
              <div
                className="relative max-w-5xl w-full max-h-[92vh] bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col transform-gpu gpu-accelerated"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Lightbox Header */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-mech-orange" />
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {currentBoiler.title} — High-Resolution Engineering Diagram
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lightbox Image Body */}
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/10 dark:bg-slate-950">
                  <img
                    src={currentBoiler.imageSrc}
                    alt={`${currentBoiler.title} full diagram`}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                  />
                </div>

                {/* Lightbox Footer */}
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{currentBoiler.summary}</span>
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                  >
                    Close (Esc)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TIER 2: SEMESTER-END FINAL THEORY VIVA FLASHCARDS    */}
      {/* ==================================================== */}
      {vivaMode === 'semester' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Subject Category Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Oral Examination Subject
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                Diploma Sem 3 High-Yield Oral Bank
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
              {theoryCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = theorySubject === cat.id;
                const count = (semesterVivaData[cat.id] || []).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    id={`tab-theory-${cat.id}`}
                    onClick={() => {
                      setTheorySubject(cat.id);
                      setRevealedAnswers(new Set());
                      setShowAllTheory(false);
                    }}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer snap-start active:scale-95 ${
                      isActive
                        ? 'bg-mech-blue text-white shadow-md ring-2 ring-blue-500/30'
                        : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar & Batch Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                id="theory-viva-search"
                value={theorySearch}
                onChange={(e) => setTheorySearch(e.target.value)}
                placeholder="Search oral questions (e.g. Hooke, Poisson, First Law, ASA, Abbe)..."
                className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/70 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mech-blue shadow-xs"
              />
              {theorySearch && (
                <button
                  type="button"
                  onClick={() => setTheorySearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                id="btn-theory-show-all"
                onClick={() => {
                  if (showAllTheory) {
                    setShowAllTheory(false);
                    setRevealedAnswers(new Set());
                  } else {
                    setShowAllTheory(true);
                    setRevealedAnswers(new Set(filteredTheoryQuestions.map((q) => q.id)));
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {showAllTheory ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAllTheory ? 'Hide All Answers' : 'Reveal All Answers'}</span>
              </button>

              <button
                type="button"
                id="btn-theory-random"
                onClick={handleRandomTheory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-mech-blue hover:bg-blue-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Next Random Flashcard</span>
              </button>
            </div>
          </div>

          {/* Theory Questions Flashcard Grid */}
          <div className="space-y-3">
            {filteredTheoryQuestions.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No questions match "{theorySearch}" in this subject.
                </p>
                <button
                  type="button"
                  onClick={() => setTheorySearch('')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-mech-blue text-white cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredTheoryQuestions.map((item) => {
                const isRevealed = showAllTheory || revealedAnswers.has(item.id);

                return (
                  <div
                    key={item.id}
                    id={`theory-card-${item.id}`}
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '0 120px' }}
                    className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3 content-visibility-auto"
                  >
                    {/* Card Header Bar */}
                    <div
                      onClick={() => toggleTheoryReveal(item.id)}
                      className="flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-mech-blue dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                            Q{item.id}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.topic}
                          </span>
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {item.yieldLevel}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                          {item.question}
                        </h4>
                      </div>

                      {/* Reveal Toggle Icon */}
                      <button
                        type="button"
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-mech-blue transition-colors shrink-0"
                      >
                        {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Revealed Answer Box */}
                    {isRevealed && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl p-3.5 sm:p-4 border-l-4 border-l-mech-blue space-y-1.5 animate-fadeIn">
                        <span className="text-[11px] font-mono font-bold text-mech-blue uppercase tracking-wider block">
                          Examiner Model Answer:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono font-medium">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VivaCenter;
