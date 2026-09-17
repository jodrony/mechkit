export interface FormulaItem {
  id: string;
  category: 'SOM' | 'Thermal' | 'Workshop' | 'Mechanics';
  title: string;
  definition: string;
  formulaLatex: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  siUnits: string;
  solvedExample: {
    problem: string;
    given: string[];
    steps: string[];
    answer: string;
  };
  relatedCalculatorId?: string;
}

export const formulasData: FormulaItem[] = [
  // ====================================================
  // STRENGTH OF MATERIALS (SOM) - 15 FORMULAS
  // ====================================================
  {
    id: 'som_1',
    category: 'SOM',
    title: 'Direct Normal Stress',
    definition: 'Direct normal stress is the internal resisting force per unit cross-sectional area developed inside a structural member subjected to an axial tensile or compressive load perpendicular to the section.',
    formulaLatex: '\\sigma = \\frac{P}{A}',
    variables: [
      { symbol: 'P', meaning: 'Axial tensile or compressive load', unit: 'N (Newtons)' },
      { symbol: 'A', meaning: 'Cross-sectional area resisting load', unit: 'm²' },
      { symbol: '\\sigma', meaning: 'Normal stress', unit: 'N/m² (Pa or MPa)' },
    ],
    siUnits: 'N/m² (Pa) • 1 MPa = 10⁶ N/m² = 1 N/mm²',
    solvedExample: {
      problem: 'A mild steel tie rod of cross-sectional area 0.002 m² is subjected to an axial tensile pull of 50 kN. Calculate the direct normal stress induced in the rod.',
      given: [
        'Axial Tensile Load (P) = 50 kN = 50 × 10³ N',
        'Cross-sectional Area (A) = 0.002 m² = 2000 mm²',
      ],
      steps: [
        'Apply the direct normal stress equation: σ = P / A',
        'Substitute: σ = (50 × 10³ N) / (0.002 m²) = 25 × 10⁶ N/m²',
        'Convert to engineering units: 25 × 10⁶ Pa = 25 MPa (or 25 N/mm²)',
      ],
      answer: '25 MPa',
    },
    relatedCalculatorId: 'calc_stress',
  },
  {
    id: 'som_2',
    category: 'SOM',
    title: 'Direct Linear Strain',
    definition: 'Linear strain is the ratio of deformation (elongation or contraction in length) to the original gauge length of a body subjected to axial force.',
    formulaLatex: '\\epsilon = \\frac{\\Delta L}{L}',
    variables: [
      { symbol: '\\Delta L', meaning: 'Change in length / elongation', unit: 'mm or m' },
      { symbol: 'L', meaning: 'Original gauge length', unit: 'mm or m' },
      { symbol: '\\epsilon', meaning: 'Direct linear strain', unit: 'Dimensionless (Unitless)' },
    ],
    siUnits: 'Dimensionless (m/m or mm/mm) • Often expressed in microstrain (με = 10⁻⁶)',
    solvedExample: {
      problem: 'A standard cylindrical test specimen of gauge length 200 mm elongates by 0.4 mm when subjected to an axial tensile pull. Determine the direct linear strain.',
      given: [
        'Original Gauge Length (L) = 200 mm',
        'Elongation (ΔL) = 0.4 mm',
      ],
      steps: [
        'Apply the linear strain formula: ε = ΔL / L',
        'Substitute given values: ε = 0.4 mm / 200 mm = 0.002',
        'Express as dimensionless value: ε = 0.002 (or 2000 με)',
      ],
      answer: '0.002 (Unitless)',
    },
    relatedCalculatorId: 'calc_strain',
  },
  {
    id: 'som_3',
    category: 'SOM',
    title: "Young's Modulus (Hooke's Law)",
    definition: "Hooke's Law states that within the proportional elastic limit of an isotropic material, direct stress is directly proportional to direct strain. Young's Modulus (E) is the constant of proportionality representing material stiffness.",
    formulaLatex: 'E = \\frac{\\sigma}{\\epsilon}',
    variables: [
      { symbol: '\\sigma', meaning: 'Direct normal stress', unit: 'N/m² (Pa or MPa)' },
      { symbol: '\\epsilon', meaning: 'Direct linear strain', unit: 'Dimensionless' },
      { symbol: 'E', meaning: "Modulus of Elasticity (Young's Modulus)", unit: 'N/m² (Pa or GPa)' },
    ],
    siUnits: 'N/m² (Pa) • 1 GPa = 10⁹ Pa = 10³ N/mm²',
    solvedExample: {
      problem: "In an elastic tensile test of an alloy steel bar, an axial stress of 150 MPa produces an axial strain of 0.00075. Determine the Young's Modulus of the alloy.",
      given: [
        'Direct Tensile Stress (σ) = 150 MPa = 150 × 10⁶ N/m²',
        'Linear Strain (ε) = 0.00075 (Dimensionless)',
      ],
      steps: [
        "Apply Hooke's Law relation: E = σ / ε",
        'Substitute: E = (150 × 10⁶ N/m²) / 0.00075 = 200 × 10⁹ N/m²',
        'Convert to standard gigapascals: 200 × 10⁹ Pa = 200 GPa',
      ],
      answer: '200 GPa',
    },
    relatedCalculatorId: 'calc_strain',
  },
  {
    id: 'som_4',
    category: 'SOM',
    title: 'Shear Stress',
    definition: 'Shear stress is the tangential internal resisting force developed per unit area of a cross-section resisting a parallel transverse cutting or sliding force.',
    formulaLatex: '\\tau = \\frac{P_s}{A_s}',
    variables: [
      { symbol: 'P_s', meaning: 'Transverse shear force', unit: 'N (Newtons)' },
      { symbol: 'A_s', meaning: 'Resisting shear cross-sectional area', unit: 'm² or mm²' },
      { symbol: '\\tau', meaning: 'Shear stress', unit: 'N/m² (Pa or MPa)' },
    ],
    siUnits: 'N/m² (Pa) • 1 MPa = 1 N/mm²',
    solvedExample: {
      problem: 'A single lap joint connects two plates using a steel rivet of diameter 20 mm. If the joint transmits a tensile shear load of 18.85 kN, calculate the average shear stress induced in the rivet section.',
      given: [
        'Shear Force (P_s) = 18.85 kN = 18,850 N',
        'Rivet Diameter (d) = 20 mm',
        'Resisting Area (A_s) = (π / 4) × d² = (π / 4) × (20)² = 314.16 mm² = 3.1416 × 10⁻⁴ m²',
      ],
      steps: [
        'Apply shear stress equation: τ = P_s / A_s',
        'Substitute: τ = 18,850 N / (3.1416 × 10⁻⁴ m²) = 60 × 10⁶ N/m²',
        'Convert to MPa: τ = 60 MPa (or 60 N/mm²)',
      ],
      answer: '60 MPa',
    },
  },
  {
    id: 'som_5',
    category: 'SOM',
    title: 'Shear Modulus (Modulus of Rigidity)',
    definition: 'Modulus of Rigidity (G) is the ratio of transverse shear stress to the corresponding shear strain (angular distortion) within the elastic proportional limit.',
    formulaLatex: 'G = \\frac{\\tau}{\\gamma}',
    variables: [
      { symbol: '\\tau', meaning: 'Shear stress', unit: 'N/m² (Pa or MPa)' },
      { symbol: '\\gamma', meaning: 'Shear strain (angular distortion)', unit: 'rad (Radians)' },
      { symbol: 'G', meaning: 'Modulus of Rigidity (Shear Modulus)', unit: 'N/m² (Pa or GPa)' },
    ],
    siUnits: 'N/m² (Pa) • Typically 75 to 85 GPa for structural steels',
    solvedExample: {
      problem: 'A rectangular element in a structural shear web is subjected to a pure shear stress of 80 MPa. If the resulting shear strain is measured to be 0.001 radians, calculate the Modulus of Rigidity G.',
      given: [
        'Shear Stress (τ) = 80 MPa = 80 × 10⁶ Pa',
        'Shear Strain (γ) = 0.001 rad',
      ],
      steps: [
        'Apply the rigidity modulus definition: G = τ / γ',
        'Substitute: G = (80 × 10⁶ Pa) / (0.001 rad) = 80 × 10⁹ Pa',
        'Convert to gigapascals: 80 × 10⁹ Pa = 80 GPa',
      ],
      answer: '80 GPa',
    },
  },
  {
    id: 'som_6',
    category: 'SOM',
    title: "Poisson's Ratio",
    definition: "Poisson's ratio (μ or ν) is the absolute ratio of transverse (lateral) strain to the axial (longitudinal) strain within the elastic range under uniaxial loading.",
    formulaLatex: '\\mu = \\frac{\\epsilon_{\\text{lateral}}}{\\epsilon_{\\text{longitudinal}}}',
    variables: [
      { symbol: '\\epsilon_{\\text{lateral}}', meaning: 'Lateral strain (change in diameter / initial diameter)', unit: 'Dimensionless' },
      { symbol: '\\epsilon_{\\text{longitudinal}}', meaning: 'Longitudinal strain (elongation / initial length)', unit: 'Dimensionless' },
      { symbol: '\\mu', meaning: "Poisson's ratio", unit: 'Dimensionless (typically 0.25 - 0.33 for metals)' },
    ],
    siUnits: 'Dimensionless (Unitless scalar ratio)',
    solvedExample: {
      problem: 'A steel bar of 25 mm diameter and 250 mm gauge length is pulled axially. The elongation observed is 0.125 mm, while the diameter contracts by 0.0035 mm. Find Poisson’s ratio.',
      given: [
        'Original Length (L) = 250 mm, Elongation (ΔL) = 0.125 mm',
        'Original Diameter (d) = 25 mm, Contraction (Δd) = 0.0035 mm',
        'Longitudinal Strain (ε_long) = 0.125 / 250 = 0.0005',
        'Lateral Strain (ε_lat) = 0.0035 / 25 = 0.00014',
      ],
      steps: [
        "Apply Poisson's ratio formula: μ = ε_lateral / ε_longitudinal",
        'Substitute values: μ = 0.00014 / 0.0005 = 0.28',
      ],
      answer: '0.28',
    },
  },
  {
    id: 'som_7',
    category: 'SOM',
    title: 'Volumetric Strain of Rectangular Bar',
    definition: 'Volumetric strain is the fractional change in volume of a body subjected to stress. For a rectangular bar under triaxial normal loading, it equals the algebraic sum of the three orthogonal linear strains.',
    formulaLatex: '\\epsilon_v = \\epsilon_x + \\epsilon_y + \\epsilon_z',
    variables: [
      { symbol: '\\epsilon_x', meaning: 'Linear strain along x-axis', unit: 'Dimensionless' },
      { symbol: '\\epsilon_y', meaning: 'Linear strain along y-axis', unit: 'Dimensionless' },
      { symbol: '\\epsilon_z', meaning: 'Linear strain along z-axis', unit: 'Dimensionless' },
      { symbol: '\\epsilon_v', meaning: 'Volumetric strain (ΔV / V)', unit: 'Dimensionless' },
    ],
    siUnits: 'Dimensionless (m³/m³ or % volumetric dilation)',
    solvedExample: {
      problem: 'A metallic prismatic block is subjected to triaxial loading resulting in principal strains of ε_x = +0.0004, ε_y = -0.00012, and ε_z = -0.00012. Determine the volumetric strain and the percentage volume change.',
      given: [
        'Strain along x-axis (ε_x) = +0.0004 (Tensile)',
        'Strain along y-axis (ε_y) = -0.00012 (Compressive)',
        'Strain along z-axis (ε_z) = -0.00012 (Compressive)',
      ],
      steps: [
        'Apply volumetric strain summation: ε_v = ε_x + ε_y + ε_z',
        'Substitute: ε_v = 0.0004 + (-0.00012) + (-0.00012) = +0.00016',
        'Calculate percentage change: % ΔV = 0.00016 × 100% = +0.016%',
      ],
      answer: '0.00016 (+0.016%)',
    },
  },
  {
    id: 'som_8',
    category: 'SOM',
    title: 'Bulk Modulus Relationship',
    definition: 'Bulk Modulus (K) measures the resistance of a material to uniform hydrostatic compression. It is related to Young’s Modulus (E) and Poisson’s Ratio (μ) by the generalized Hooke’s law for uniform triaxial stress.',
    formulaLatex: 'K = \\frac{E}{3(1 - 2\\mu)}',
    variables: [
      { symbol: 'E', meaning: "Young's Modulus of Elasticity", unit: 'N/m² (Pa or GPa)' },
      { symbol: '\\mu', meaning: "Poisson's Ratio", unit: 'Dimensionless' },
      { symbol: 'K', meaning: 'Bulk Modulus of Elasticity', unit: 'N/m² (Pa or GPa)' },
    ],
    siUnits: 'N/m² (Pa or GPa)',
    solvedExample: {
      problem: "An alloy steel shaft has a Young's Modulus E = 210 GPa and Poisson's ratio μ = 0.30. Calculate the Bulk Modulus K of the alloy.",
      given: [
        'Young’s Modulus (E) = 210 GPa = 210 × 10⁹ Pa',
        'Poisson’s Ratio (μ) = 0.30',
      ],
      steps: [
        'Apply elastic constant relation: K = E / [3(1 - 2μ)]',
        'Evaluate denominator bracket: 1 - 2(0.30) = 1 - 0.60 = 0.40',
        'Compute: K = 210 / (3 × 0.40) = 210 / 1.20 = 175 GPa',
      ],
      answer: '175 GPa',
    },
  },
  {
    id: 'som_9',
    category: 'SOM',
    title: 'Relation between E, G, and K',
    definition: 'The fundamental elasticity interrelationship connecting Young’s Modulus (E), Bulk Modulus (K), and Shear Modulus (G) for homogeneous, isotropic elastic materials.',
    formulaLatex: 'E = \\frac{9KG}{3K + G}',
    variables: [
      { symbol: 'K', meaning: 'Bulk Modulus', unit: 'N/m² (Pa or GPa)' },
      { symbol: 'G', meaning: 'Shear Modulus (Modulus of Rigidity)', unit: 'N/m² (Pa or GPa)' },
      { symbol: 'E', meaning: "Young's Modulus", unit: 'N/m² (Pa or GPa)' },
    ],
    siUnits: 'N/m² (Pa or GPa)',
    solvedExample: {
      problem: 'For an isotropic metallic alloy, the Bulk Modulus is K = 140 GPa and the Shear Modulus is G = 84 GPa. Calculate its Young’s Modulus E using the combined moduli relation.',
      given: [
        'Bulk Modulus (K) = 140 GPa',
        'Shear Modulus (G) = 84 GPa',
      ],
      steps: [
        'Apply combined relation: E = (9 · K · G) / (3K + G)',
        'Compute numerator: 9 × 140 × 84 = 105,840 GPa²',
        'Compute denominator: 3(140) + 84 = 420 + 84 = 504 GPa',
        'Divide: E = 105,840 / 504 = 210 GPa',
      ],
      answer: '210 GPa',
    },
  },
  {
    id: 'som_10',
    category: 'SOM',
    title: 'Thermal Stress (Fully Restrained)',
    definition: 'When a structural member undergoes temperature change but its free thermal expansion or contraction is completely prevented by rigid supports, an internal thermal stress is generated.',
    formulaLatex: '\\sigma_{\\text{th}} = \\alpha \\cdot \\Delta T \\cdot E',
    variables: [
      { symbol: '\\alpha', meaning: 'Coefficient of linear thermal expansion', unit: '/°C or /K' },
      { symbol: '\\Delta T', meaning: 'Temperature rise or drop (T₂ - T₁)', unit: '°C or K' },
      { symbol: 'E', meaning: "Young's Modulus of the material", unit: 'N/m² (Pa or GPa)' },
      { symbol: '\\sigma_{\\text{th}}', meaning: 'Induced thermal stress', unit: 'N/m² (Pa or MPa)' },
    ],
    siUnits: 'N/m² (Pa) • 1 MPa = 10⁶ N/m²',
    solvedExample: {
      problem: 'A continuously welded steel railway rail (E = 200 GPa, α = 12 × 10⁻⁶ /°C) is laid without expansion gaps at 20°C. In summer, the rail reaches 65°C. Calculate the compressive thermal stress induced if ends are rigidly constrained.',
      given: [
        'Thermal Expansion Coeff (α) = 12 × 10⁻⁶ /°C',
        'Temperature Rise (ΔT) = 65°C - 20°C = 45°C',
        'Young’s Modulus (E) = 200 GPa = 200 × 10⁹ Pa',
      ],
      steps: [
        'Apply thermal stress formula: σ_th = α · ΔT · E',
        'Substitute: σ_th = (12 × 10⁻⁶) × 45 × (200 × 10⁹ Pa) = 108 × 10⁶ Pa',
        'Convert to MPa: σ_th = 108 MPa (Compressive)',
      ],
      answer: '108 MPa (Compressive)',
    },
  },
  {
    id: 'som_11',
    category: 'SOM',
    title: 'Polar Moment of Inertia for Solid Shaft',
    definition: 'The polar moment of inertia (J) of a circular cross-section is the second polar moment of area about the polar axis perpendicular to the plane of the section, representing torsional resistance.',
    formulaLatex: 'J = \\frac{\\pi \\cdot d^4}{32}',
    variables: [
      { symbol: 'd', meaning: 'Shaft diameter', unit: 'm or mm' },
      { symbol: 'J', meaning: 'Polar moment of inertia', unit: 'm⁴ or mm⁴' },
    ],
    siUnits: 'm⁴ (Base SI) • Commonly calculated in mm⁴ (1 mm⁴ = 10⁻¹² m⁴)',
    solvedExample: {
      problem: 'Calculate the polar moment of inertia J for a solid circular steel shaft of diameter d = 50 mm.',
      given: [
        'Shaft Diameter (d) = 50 mm = 0.05 m',
      ],
      steps: [
        'Apply the circular polar moment of inertia formula: J = (π · d⁴) / 32',
        'Compute d⁴: (50)⁴ = 6,250,000 mm⁴ = 6.25 × 10⁶ mm⁴',
        'Multiply and divide: J = (π × 6.25 × 10⁶) / 32 ≈ 613,592 mm⁴ ≈ 6.136 × 10⁵ mm⁴',
        'Convert to SI: 6.136 × 10⁵ × 10⁻¹² = 6.136 × 10⁻⁷ m⁴',
      ],
      answer: '6.136 × 10⁵ mm⁴ (6.136 × 10⁻⁷ m⁴)',
    },
  },
  {
    id: 'som_12',
    category: 'SOM',
    title: 'Torsional Formula',
    definition: 'The torsion formula governs circular shafts subjected to pure twisting, relating torque, polar moment of inertia, shear stress at radial distance r, and torsional stiffness.',
    formulaLatex: '\\frac{T}{J} = \\frac{\\tau}{r} = \\frac{G \\cdot \\theta}{L}',
    variables: [
      { symbol: 'T', meaning: 'Applied twisting moment / torque', unit: 'N·m' },
      { symbol: 'J', meaning: 'Polar moment of inertia', unit: 'm⁴' },
      { symbol: '\\tau', meaning: 'Shear stress at radius r', unit: 'N/m² (Pa)' },
      { symbol: 'r', meaning: 'Radial distance from axis (max = d / 2)', unit: 'm' },
      { symbol: 'G', meaning: 'Modulus of rigidity', unit: 'Pa' },
      { symbol: '\\theta', meaning: 'Angle of twist', unit: 'rad' },
      { symbol: 'L', meaning: 'Length of shaft', unit: 'm' },
    ],
    siUnits: 'T in N·m • τ in Pa • θ in rad',
    solvedExample: {
      problem: 'A solid circular shaft has outer radius r = 30 mm (0.03 m) and polar moment of inertia J = 1.272 × 10⁻⁶ m⁴. If the maximum permissible shear stress is τ_max = 50 MPa, find the torque capacity T.',
      given: [
        'Outer Radius (r) = 30 mm = 0.03 m',
        'Polar Moment of Inertia (J) = 1.272 × 10⁻⁶ m⁴',
        'Max Permissible Shear Stress (τ) = 50 MPa = 50 × 10⁶ Pa',
      ],
      steps: [
        'Rearrange the torsion formula: T = (τ · J) / r',
        'Substitute: T = (50 × 10⁶ Pa × 1.272 × 10⁻⁶ m⁴) / 0.03 m',
        'Multiply numerator: 63.6 N·m²',
        'Divide: T = 63.6 / 0.03 = 2120 N·m = 2.12 kN·m',
      ],
      answer: '2120 N·m (2.12 kN·m)',
    },
    relatedCalculatorId: 'calc_torque',
  },
  {
    id: 'som_13',
    category: 'SOM',
    title: 'Flexural Bending Formula',
    definition: 'The Euler-Bernoulli simple bending equation governs straight beams under pure transverse flexure, relating bending moment, section moment of inertia, fiber bending stress, and curvature.',
    formulaLatex: '\\frac{M}{I} = \\frac{\\sigma_b}{y} = \\frac{E}{R}',
    variables: [
      { symbol: 'M', meaning: 'Resisting bending moment', unit: 'N·m' },
      { symbol: 'I', meaning: 'Moment of inertia about neutral axis', unit: 'm⁴' },
      { symbol: '\\sigma_b', meaning: 'Bending stress at distance y from neutral axis', unit: 'N/m² (Pa)' },
      { symbol: 'y', meaning: 'Distance of fiber from neutral axis', unit: 'm' },
      { symbol: 'E', meaning: "Young's Modulus", unit: 'Pa' },
      { symbol: 'R', meaning: 'Radius of curvature of bent neutral surface', unit: 'm' },
    ],
    siUnits: 'M in N·m • σ_b in Pa • I in m⁴',
    solvedExample: {
      problem: 'A simply supported steel beam experiences a maximum bending moment of M = 24 kN·m. The cross section has I = 4.8 × 10⁻⁵ m⁴ and extreme fiber distance y = 100 mm (0.1 m). Calculate the maximum bending stress σ_b.',
      given: [
        'Bending Moment (M) = 24 kN·m = 24,000 N·m',
        'Moment of Inertia (I) = 4.8 × 10⁻⁵ m⁴',
        'Extreme Fiber Distance (y) = 100 mm = 0.1 m',
      ],
      steps: [
        'Rearrange bending equation: σ_b = (M · y) / I',
        'Substitute: σ_b = (24,000 N·m × 0.1 m) / (4.8 × 10⁻⁵ m⁴)',
        'Compute: σ_b = 2400 / (4.8 × 10⁻⁵) = 50 × 10⁶ Pa',
        'Convert to MPa: σ_b = 50 MPa',
      ],
      answer: '50 MPa',
    },
  },
  {
    id: 'som_14',
    category: 'SOM',
    title: 'Moment of Inertia (Rectangular Section)',
    definition: 'The second moment of area of a rectangular section about its horizontal centroidal neutral axis (x-x axis), measuring the beam section’s resistance to flexural bending.',
    formulaLatex: 'I_{xx} = \\frac{b \\cdot d^3}{12}',
    variables: [
      { symbol: 'b', meaning: 'Width of the rectangular cross section', unit: 'mm or m' },
      { symbol: 'd', meaning: 'Depth of the rectangular cross section', unit: 'mm or m' },
      { symbol: 'I_{xx}', meaning: 'Second moment of area about centroidal x-x axis', unit: 'mm⁴ or m⁴' },
    ],
    siUnits: 'm⁴ (Base SI) • 1 m⁴ = 10¹² mm⁴',
    solvedExample: {
      problem: 'Determine the centroidal moment of inertia I_xx for a rectangular timber beam joist of width b = 100 mm and overall depth d = 200 mm.',
      given: [
        'Width (b) = 100 mm',
        'Depth (d) = 200 mm',
      ],
      steps: [
        'Apply rectangular moment of inertia formula: I_xx = (b · d³) / 12',
        'Compute d³: (200)³ = 8,000,000 mm³',
        'Multiply by b: 100 × 8,000,000 = 800,000,000 mm⁴',
        'Divide by 12: I_xx = 800 × 10⁶ / 12 ≈ 6.667 × 10⁷ mm⁴ = 6.667 × 10⁻⁵ m⁴',
      ],
      answer: '6.667 × 10⁷ mm⁴ (6.667 × 10⁻⁵ m⁴)',
    },
    relatedCalculatorId: 'calc_moi',
  },
  {
    id: 'som_15',
    category: 'SOM',
    title: 'Section Modulus for Rectangle',
    definition: 'Section modulus (Z) is the geometric property of a structural beam section defined as the ratio of moment of inertia to extreme fiber distance (Z = I / y_max), directly governing its moment carrying capacity.',
    formulaLatex: 'Z = \\frac{b \\cdot d^2}{6}',
    variables: [
      { symbol: 'b', meaning: 'Width of rectangular cross section', unit: 'mm or m' },
      { symbol: 'd', meaning: 'Depth of rectangular cross section', unit: 'mm or m' },
      { symbol: 'Z', meaning: 'Elastic section modulus', unit: 'mm³ or m³' },
    ],
    siUnits: 'm³ (Base SI) • Commonly expressed in mm³ or cm³ (1 mm³ = 10⁻⁹ m³)',
    solvedExample: {
      problem: 'Calculate the elastic section modulus Z of a rectangular beam having width b = 120 mm and depth d = 240 mm.',
      given: [
        'Width (b) = 120 mm',
        'Depth (d) = 240 mm',
      ],
      steps: [
        'Apply rectangular section modulus equation: Z = (b · d²) / 6',
        'Calculate d²: (240)² = 57,600 mm²',
        'Multiply and divide: Z = (120 × 57,600) / 6 = 20 × 57,600 = 1,152,000 mm³',
        'Express in cubic meters: Z = 1.152 × 10⁶ mm³ = 1.152 × 10⁻³ m³',
      ],
      answer: '1.152 × 10⁶ mm³ (1.152 × 10⁻³ m³)',
    },
  },

  // ====================================================
  // THERMAL ENGINEERING (Thermal) - 10 FORMULAS
  // ====================================================
  {
    id: 'therm_16',
    category: 'Thermal',
    title: 'Characteristic Gas Equation',
    definition: 'The ideal gas law relating absolute pressure, volume, mass, characteristic gas constant, and absolute temperature for a given quantity of ideal or permanent gas.',
    formulaLatex: 'P \\cdot V = m \\cdot R \\cdot T',
    variables: [
      { symbol: 'P', meaning: 'Absolute pressure of the gas', unit: 'N/m² (Pa)' },
      { symbol: 'V', meaning: 'Volume occupied by the gas', unit: 'm³' },
      { symbol: 'm', meaning: 'Mass of the gas', unit: 'kg' },
      { symbol: 'R', meaning: 'Characteristic gas constant (R = R_u / M)', unit: 'J/(kg·K)' },
      { symbol: 'T', meaning: 'Absolute thermodynamic temperature', unit: 'K (Kelvin)' },
    ],
    siUnits: 'P (Pa), V (m³), m (kg), R (J/kg·K), T (K)',
    solvedExample: {
      problem: 'A rigid pressure vessel of volume 0.5 m³ contains nitrogen gas at an absolute pressure of 400 kPa and temperature 27°C (300.15 K). If the gas constant for Nitrogen is R = 296.8 J/(kg·K), calculate the mass of nitrogen inside.',
      given: [
        'Absolute Pressure (P) = 400 kPa = 400,000 Pa',
        'Volume (V) = 0.5 m³',
        'Absolute Temperature (T) = 27 + 273.15 = 300.15 K',
        'Gas Constant (R) = 296.8 J/(kg·K)',
      ],
      steps: [
        'Rearrange ideal gas equation: m = (P · V) / (R · T)',
        'Compute numerator: 400,000 × 0.5 = 200,000 N·m (J)',
        'Compute denominator: 296.8 × 300.15 ≈ 89,084.5 J/kg',
        'Divide: m = 200,000 / 89,084.5 ≈ 2.245 kg',
      ],
      answer: '2.245 kg',
    },
  },
  {
    id: 'therm_17',
    category: 'Thermal',
    title: 'First Law of Thermodynamics (Non-Flow System)',
    definition: 'The principle of conservation of energy applied to a closed non-flow system, stating that heat transferred to the system equals the sum of increase in internal energy and work done by the system on surroundings.',
    formulaLatex: 'Q = \\Delta U + W',
    variables: [
      { symbol: 'Q', meaning: 'Heat transferred across the system boundary', unit: 'Joules (J or kJ)' },
      { symbol: '\\Delta U', meaning: 'Change in internal energy (U₂ - U₁)', unit: 'Joules (J or kJ)' },
      { symbol: 'W', meaning: 'Boundary work done by the system', unit: 'Joules (J or kJ)' },
    ],
    siUnits: 'Joules (J) • 1 kJ = 1000 J',
    solvedExample: {
      problem: 'A gas trapped inside a cylinder fitted with a frictionless piston absorbs 150 kJ of heat from an external flame while expanding and doing 95 kJ of mechanical work on the piston. Determine the change in internal energy ΔU.',
      given: [
        'Heat added (Q) = +150 kJ',
        'Work done by gas (W) = +95 kJ',
      ],
      steps: [
        'Apply the First Law of Thermodynamics: Q = ΔU + W',
        'Rearrange to solve for internal energy: ΔU = Q - W',
        'Substitute values: ΔU = 150 kJ - 95 kJ = +55 kJ',
        'A positive ΔU indicates an increase in the internal thermal energy of the gas.',
      ],
      answer: '+55 kJ',
    },
  },
  {
    id: 'therm_18',
    category: 'Thermal',
    title: 'Internal Energy Change',
    definition: "By Joule's Law, the internal energy of an ideal gas depends solely on its absolute temperature. For any thermodynamic process, change in internal energy equals the mass times constant volume specific heat times temperature difference.",
    formulaLatex: '\\Delta U = m \\cdot c_v \\cdot (T_2 - T_1)',
    variables: [
      { symbol: 'm', meaning: 'Mass of the working gas', unit: 'kg' },
      { symbol: 'c_v', meaning: 'Specific heat capacity at constant volume', unit: 'J/(kg·K) or kJ/(kg·K)' },
      { symbol: 'T_1', meaning: 'Initial absolute temperature', unit: 'K' },
      { symbol: 'T_2', meaning: 'Final absolute temperature', unit: 'K' },
      { symbol: '\\Delta U', meaning: 'Change in internal energy', unit: 'J or kJ' },
    ],
    siUnits: 'Joules (J or kJ)',
    solvedExample: {
      problem: 'A mass of 2 kg of air (c_v = 718 J/(kg·K)) is heated in a rigid sealed tank from 25°C (298 K) to 125°C (398 K). Calculate the change in internal energy of the air.',
      given: [
        'Mass (m) = 2 kg',
        'Specific Heat (c_v) = 718 J/(kg·K)',
        'Temperature Rise (ΔT) = 125 - 25 = 100 K (or °C)',
      ],
      steps: [
        'Apply the internal energy equation: ΔU = m · c_v · (T₂ - T₁)',
        'Substitute: ΔU = 2 kg × 718 J/(kg·K) × 100 K = 143,600 J',
        'Convert to kJ: 143,600 J = 143.6 kJ',
      ],
      answer: '143.6 kJ',
    },
  },
  {
    id: 'therm_19',
    category: 'Thermal',
    title: 'Enthalpy / Constant Pressure Heat',
    definition: 'Enthalpy (H = U + PV) represents total heat content. For an ideal gas undergoing a constant pressure (isobaric) process, the heat transferred across system boundaries is directly equal to the change in enthalpy.',
    formulaLatex: 'Q_p = \\Delta H = m \\cdot c_p \\cdot (T_2 - T_1)',
    variables: [
      { symbol: 'm', meaning: 'Mass of gas', unit: 'kg' },
      { symbol: 'c_p', meaning: 'Specific heat capacity at constant pressure', unit: 'J/(kg·K) or kJ/(kg·K)' },
      { symbol: 'T_2 - T_1', meaning: 'Temperature difference (ΔT)', unit: 'K or °C' },
      { symbol: 'Q_p', meaning: 'Isobaric heat supplied / enthalpy change (ΔH)', unit: 'J or kJ' },
    ],
    siUnits: 'Joules (J or kJ)',
    solvedExample: {
      problem: 'Air of mass 1.5 kg is heated at a steady constant pressure of 101.3 kPa from 30°C to 180°C. If c_p = 1005 J/(kg·K), calculate the total heat added and enthalpy change.',
      given: [
        'Mass (m) = 1.5 kg',
        'Specific Heat at constant pressure (c_p) = 1005 J/(kg·K)',
        'Temperature Change (ΔT) = 180°C - 30°C = 150 K',
      ],
      steps: [
        'Apply constant pressure enthalpy relation: Q_p = ΔH = m · c_p · ΔT',
        'Substitute: Q_p = 1.5 kg × 1005 J/(kg·K) × 150 K = 226,125 J',
        'Convert to kJ: 226,125 J = 226.125 kJ',
      ],
      answer: '226.125 kJ',
    },
  },
  {
    id: 'therm_20',
    category: 'Thermal',
    title: "Mayer's Relation",
    definition: "Mayer's equation establishes that for an ideal gas, the specific heat at constant pressure exceeds the specific heat at constant volume by the characteristic gas constant R, representing external boundary expansion work.",
    formulaLatex: 'c_p - c_v = R',
    variables: [
      { symbol: 'c_p', meaning: 'Specific heat at constant pressure', unit: 'J/(kg·K) or kJ/(kg·K)' },
      { symbol: 'c_v', meaning: 'Specific heat at constant volume', unit: 'J/(kg·K) or kJ/(kg·K)' },
      { symbol: 'R', meaning: 'Characteristic gas constant', unit: 'J/(kg·K) or kJ/(kg·K)' },
    ],
    siUnits: 'J/(kg·K) or kJ/(kg·K)',
    solvedExample: {
      problem: 'For dry atmospheric air, c_p = 1.005 kJ/(kg·K) and c_v = 0.718 kJ/(kg·K). Verify Mayer’s relation and determine the characteristic gas constant R of air.',
      given: [
        'c_p = 1.005 kJ/(kg·K)',
        'c_v = 0.718 kJ/(kg·K)',
      ],
      steps: [
        "Apply Mayer's equation: R = c_p - c_v",
        'Subtract: R = 1.005 kJ/(kg·K) - 0.718 kJ/(kg·K) = 0.287 kJ/(kg·K)',
        'Convert to standard SI: 0.287 kJ/(kg·K) × 1000 = 287 J/(kg·K)',
      ],
      answer: '0.287 kJ/(kg·K) [287 J/(kg·K)]',
    },
  },
  {
    id: 'therm_21',
    category: 'Thermal',
    title: 'Adiabatic Ratio (Specific Heat Ratio)',
    definition: 'The adiabatic ratio (γ or k) is the dimensionless ratio of constant pressure specific heat to constant volume specific heat, governing reversible adiabatic (isentropic) thermodynamic state changes.',
    formulaLatex: '\\gamma = \\frac{c_p}{c_v}',
    variables: [
      { symbol: 'c_p', meaning: 'Specific heat at constant pressure', unit: 'J/(kg·K)' },
      { symbol: 'c_v', meaning: 'Specific heat at constant volume', unit: 'J/(kg·K)' },
      { symbol: '\\gamma', meaning: 'Ratio of specific heats (isentropic index)', unit: 'Dimensionless (≈ 1.4 for diatomic gases)' },
    ],
    siUnits: 'Dimensionless (Unitless scalar ratio)',
    solvedExample: {
      problem: 'An ideal diatomic gas has specific heats c_p = 1005 J/(kg·K) and c_v = 718 J/(kg·K). Determine its specific heat ratio γ.',
      given: [
        'c_p = 1005 J/(kg·K)',
        'c_v = 718 J/(kg·K)',
      ],
      steps: [
        'Apply the adiabatic ratio formula: γ = c_p / c_v',
        'Substitute values: γ = 1005 / 718 ≈ 1.3997 ≈ 1.40',
        'This verifies the theoretical value of 1.40 for diatomic gases like Air/Nitrogen.',
      ],
      answer: '1.40',
    },
  },
  {
    id: 'therm_22',
    category: 'Thermal',
    title: 'Isothermal Work Done',
    definition: 'The boundary work done during a reversible isothermal (constant temperature, T = const, P·V = C) expansion or compression process of an ideal gas.',
    formulaLatex: 'W = P_1 \\cdot V_1 \\cdot \\ln\\left(\\frac{V_2}{V_1}\\right)',
    variables: [
      { symbol: 'P_1', meaning: 'Initial absolute pressure', unit: 'N/m² (Pa)' },
      { symbol: 'V_1', meaning: 'Initial volume', unit: 'm³' },
      { symbol: 'V_2', meaning: 'Final volume', unit: 'm³' },
      { symbol: 'W', meaning: 'Isothermal work done', unit: 'Joules (J or kJ)' },
    ],
    siUnits: 'Joules (J or kJ)',
    solvedExample: {
      problem: 'An ideal gas initially at P_1 = 200 kPa occupies V_1 = 0.08 m³. It expands isothermally to a final volume V_2 = 0.24 m³. Calculate the work done by the gas.',
      given: [
        'Initial Pressure (P_1) = 200 kPa = 200,000 Pa',
        'Initial Volume (V_1) = 0.08 m³',
        'Final Volume (V_2) = 0.24 m³',
      ],
      steps: [
        'Compute expansion ratio: V_2 / V_1 = 0.24 / 0.08 = 3.0',
        'Natural logarithm: ln(3.0) ≈ 1.0986',
        'Apply isothermal work equation: W = P_1 · V_1 · ln(V_2 / V_1)',
        'Substitute: W = 200,000 × 0.08 × 1.0986 = 16,000 × 1.0986 = 17,578 J = 17.58 kJ',
      ],
      answer: '17.58 kJ',
    },
  },
  {
    id: 'therm_23',
    category: 'Thermal',
    title: 'Polytropic Process Work Done',
    definition: 'The mechanical boundary work done during a reversible polytropic process following the general pressure-volume relationship P·Vⁿ = Constant, where n is the polytropic exponent.',
    formulaLatex: 'W = \\frac{P_1 V_1 - P_2 V_2}{n - 1}',
    variables: [
      { symbol: 'P_1, P_2', meaning: 'Initial and final absolute pressures', unit: 'Pa or kPa' },
      { symbol: 'V_1, V_2', meaning: 'Initial and final volumes', unit: 'm³' },
      { symbol: 'n', meaning: 'Polytropic index (1 < n < γ)', unit: 'Dimensionless' },
      { symbol: 'W', meaning: 'Polytropic work done', unit: 'Joules (J or kJ)' },
    ],
    siUnits: 'Joules (J or kJ)',
    solvedExample: {
      problem: 'Air in an engine cylinder expands polytropically with index n = 1.30 from P_1 = 600 kPa, V_1 = 0.05 m³ to P_2 = 120 kPa, V_2 = 0.173 m³. Calculate the work done during expansion.',
      given: [
        'P_1 = 600 kPa, V_1 = 0.05 m³',
        'P_2 = 120 kPa, V_2 = 0.173 m³',
        'Polytropic Index (n) = 1.30',
      ],
      steps: [
        'Compute initial state product: P_1 · V_1 = 600 × 0.05 = 30 kJ',
        'Compute final state product: P_2 · V_2 = 120 × 0.173 = 20.76 kJ',
        'Numerator difference: 30 - 20.76 = 9.24 kJ',
        'Denominator: n - 1 = 1.30 - 1 = 0.30',
        'Work done: W = 9.24 / 0.30 = 30.8 kJ',
      ],
      answer: '30.8 kJ',
    },
  },
  {
    id: 'therm_24',
    category: 'Thermal',
    title: 'Air Standard Efficiency of Otto Cycle',
    definition: 'The ideal theoretical thermal efficiency of the constant-volume four-stroke spark-ignition internal combustion engine cycle, depending solely on the compression ratio r and specific heat ratio γ.',
    formulaLatex: '\\eta_{\\text{Otto}} = 1 - \\frac{1}{r^{(\\gamma - 1)}}',
    variables: [
      { symbol: 'r', meaning: 'Compression ratio (Total cylinder volume / Clearance volume = V₁ / V₂)', unit: 'Dimensionless' },
      { symbol: '\\gamma', meaning: 'Ratio of specific heats (1.4 for standard air)', unit: 'Dimensionless' },
      { symbol: '\\eta_{\\text{Otto}}', meaning: 'Air-standard thermal efficiency', unit: 'Dimensionless or %' },
    ],
    siUnits: 'Dimensionless (expressed as %)',
    solvedExample: {
      problem: 'A petrol engine operating on an ideal four-stroke Otto cycle has a cylinder compression ratio of r = 8.0. Taking γ = 1.4 for air, determine the air-standard efficiency.',
      given: [
        'Compression Ratio (r) = 8.0',
        'Specific heat ratio (γ) = 1.4 (γ - 1 = 0.4)',
      ],
      steps: [
        'Apply Otto efficiency formula: η_Otto = 1 - [1 / (r^(γ - 1))]',
        'Compute r^(γ - 1): 8^(0.4) = (2³)^0.4 = 2^1.2 ≈ 2.2974',
        'Invert: 1 / 2.2974 ≈ 0.4353',
        'Subtract from 1: η = 1 - 0.4353 = 0.5647 = 56.47% (approx 56.5%)',
      ],
      answer: '56.5%',
    },
  },
  {
    id: 'therm_25',
    category: 'Thermal',
    title: 'Steam Dryness Fraction',
    definition: 'The dryness fraction (or quality of steam, x) represents the ratio of the mass of pure dry saturated steam vapor to the total mass of the wet steam mixture containing liquid droplets in suspension.',
    formulaLatex: 'x = \\frac{m_v}{m_w + m_v}',
    variables: [
      { symbol: 'm_v', meaning: 'Mass of dry saturated vapor', unit: 'kg' },
      { symbol: 'm_w', meaning: 'Mass of entrained liquid water droplets', unit: 'kg' },
      { symbol: 'x', meaning: 'Dryness fraction / steam quality (0 ≤ x ≤ 1)', unit: 'Dimensionless' },
    ],
    siUnits: 'Dimensionless (often expressed as decimal or %)',
    solvedExample: {
      problem: 'A steam separating calorimeter extracts a 2.0 kg sample of wet steam from a boiler pipeline. Analysis shows 1.8 kg of dry condensed steam and 0.2 kg of entrained moisture collected. Calculate the dryness fraction x.',
      given: [
        'Mass of Dry Steam (m_v) = 1.8 kg',
        'Mass of Entrained Water (m_w) = 0.2 kg',
      ],
      steps: [
        'Total mass of steam sample: m = m_w + m_v = 0.2 + 1.8 = 2.0 kg',
        'Apply dryness fraction formula: x = m_v / (m_w + m_v)',
        'Substitute: x = 1.8 / 2.0 = 0.90 (or 90% dry steam)',
      ],
      answer: '0.90 (90%)',
    },
  },

  // ====================================================
  // WORKSHOP & MACHINING (Workshop) - 10 FORMULAS
  // ====================================================
  {
    id: 'work_26',
    category: 'Workshop',
    title: 'Spindle Speed (RPM)',
    definition: 'The rotational speed at which a machine tool spindle must turn a workpiece or cutter to achieve the specified linear surface cutting velocity.',
    formulaLatex: 'N = \\frac{1000 \\cdot V}{\\pi \\cdot D}',
    variables: [
      { symbol: 'V', meaning: 'Recommended cutting speed', unit: 'm/min' },
      { symbol: 'D', meaning: 'Diameter of cylindrical job or revolving cutter', unit: 'mm' },
      { symbol: 'N', meaning: 'Spindle rotational speed', unit: 'RPM (rev/min)' },
    ],
    siUnits: 'rev/min (RPM)',
    solvedExample: {
      problem: 'A mild steel shaft of diameter D = 40 mm is to be turned on an engine lathe with an HSS tool at a recommended cutting speed of V = 25 m/min. Determine the required spindle rotational speed.',
      given: [
        'Workpiece Diameter (D) = 40 mm',
        'Cutting Speed (V) = 25 m/min',
      ],
      steps: [
        'Apply spindle speed formula: N = (1000 · V) / (π · D)',
        'Numerator: 1000 × 25 = 25,000',
        'Denominator: π × 40 ≈ 125.66 mm',
        'Divide: N = 25,000 / 125.66 ≈ 198.94 RPM',
      ],
      answer: '198.9 RPM',
    },
    relatedCalculatorId: 'calc_rpm',
  },
  {
    id: 'work_27',
    category: 'Workshop',
    title: 'Cutting Speed',
    definition: 'The linear peripheral surface speed at which the workpiece surface travels past the cutting edge of a stationary cutting tool (or tool tooth travels past the workpiece).',
    formulaLatex: 'V = \\frac{\\pi \\cdot D \\cdot N}{1000}',
    variables: [
      { symbol: 'D', meaning: 'Workpiece or cutter diameter', unit: 'mm' },
      { symbol: 'N', meaning: 'Rotational speed of spindle', unit: 'RPM' },
      { symbol: 'V', meaning: 'Surface cutting speed', unit: 'm/min' },
    ],
    siUnits: 'm/min (Standard workshop SI) • 1 m/min = 1/60 m/s',
    solvedExample: {
      problem: 'A cylindrical brass bar of diameter D = 50 mm is revolving in a lathe chuck at N = 400 RPM. Calculate the peripheral surface cutting speed V.',
      given: [
        'Workpiece Diameter (D) = 50 mm',
        'Spindle Speed (N) = 400 RPM',
      ],
      steps: [
        'Apply cutting speed formula: V = (π · D · N) / 1000',
        'Substitute values: V = (π × 50 × 400) / 1000',
        'Compute: V = (π × 20,000) / 1000 = 20 π ≈ 62.83 m/min',
      ],
      answer: '62.83 m/min',
    },
    relatedCalculatorId: 'calc_cutspeed',
  },
  {
    id: 'work_28',
    category: 'Workshop',
    title: 'Feed Rate in Turning',
    definition: 'The linear velocity of the machine tool carriage moving parallel to the lathe bed axis, computed from the feed per revolution and spindle RPM.',
    formulaLatex: 'f_m = f \\cdot N',
    variables: [
      { symbol: 'f', meaning: 'Longitudinal feed per revolution', unit: 'mm/rev' },
      { symbol: 'N', meaning: 'Spindle rotational speed', unit: 'RPM (rev/min)' },
      { symbol: 'f_m', meaning: 'Linear carriage / table feed rate', unit: 'mm/min' },
    ],
    siUnits: 'mm/min',
    solvedExample: {
      problem: 'A lathe carriage lead screw gears provide a longitudinal feed of f = 0.20 mm/rev while turning an alloy shaft at N = 350 RPM. Calculate the linear carriage feed rate f_m.',
      given: [
        'Feed per rev (f) = 0.20 mm/rev',
        'Spindle Speed (N) = 350 RPM',
      ],
      steps: [
        'Apply feed rate relation: f_m = f · N',
        'Substitute: f_m = 0.20 mm/rev × 350 rev/min = 70 mm/min',
      ],
      answer: '70 mm/min',
    },
    relatedCalculatorId: 'calc_feed',
  },
  {
    id: 'work_29',
    category: 'Workshop',
    title: 'Machining Time for Turning',
    definition: 'The total time required for a lathe cutting tool to complete a single longitudinal turning pass over a workpiece of length L, including entry approach and exit overtravel allowances.',
    formulaLatex: 'T_m = \\frac{L + e}{f \\cdot N}',
    variables: [
      { symbol: 'L', meaning: 'Length of workpiece to be turned', unit: 'mm' },
      { symbol: 'e', meaning: 'Tool approach and overrun travel allowance', unit: 'mm' },
      { symbol: 'f', meaning: 'Feed per spindle revolution', unit: 'mm/rev' },
      { symbol: 'N', meaning: 'Spindle rotational speed', unit: 'RPM' },
      { symbol: 'T_m', meaning: 'Machining time per pass', unit: 'minutes (min)' },
    ],
    siUnits: 'minutes (min) • Multiply by 60 for seconds',
    solvedExample: {
      problem: 'A shaft of length L = 180 mm is turned on a lathe in one pass. The tool approach and overrun allowance is e = 10 mm. If the feed is 0.25 mm/rev and spindle speed is 200 RPM, calculate the required machining time.',
      given: [
        'Job Length (L) = 180 mm, Allowance (e) = 10 mm → Total Length = 190 mm',
        'Feed (f) = 0.25 mm/rev',
        'Spindle Speed (N) = 200 RPM',
      ],
      steps: [
        'Compute linear feed rate: f · N = 0.25 × 200 = 50 mm/min',
        'Apply machining time formula: T_m = (L + e) / (f · N)',
        'Substitute: T_m = 190 mm / (50 mm/min) = 3.8 minutes',
        'Convert fractional minutes: 0.8 × 60 s = 48 seconds → 3 min 48 s',
      ],
      answer: '3.8 minutes (3 min 48 s)',
    },
  },
  {
    id: 'work_30',
    category: 'Workshop',
    title: 'Taper Turning Half Angle',
    definition: 'The angle through which the compound rest of an engine lathe must be swiveled from the centerline to generate a specified conical taper over length L.',
    formulaLatex: '\\tan(\\alpha) = \\frac{D - d}{2 \\cdot L}',
    variables: [
      { symbol: 'D', meaning: 'Major diameter of taper', unit: 'mm' },
      { symbol: 'd', meaning: 'Minor diameter of taper', unit: 'mm' },
      { symbol: 'L', meaning: 'Axial length of the tapered portion', unit: 'mm' },
      { symbol: '\\alpha', meaning: 'Compound rest swivel angle (half taper angle)', unit: 'degrees (°)' },
    ],
    siUnits: 'degrees (°) • Often converted to degrees and minutes',
    solvedExample: {
      problem: 'A machinist must turn a conical taper having a major diameter D = 48 mm, minor diameter d = 36 mm, over an axial length of L = 80 mm. Determine the compound rest swivel angle α.',
      given: [
        'Major Diameter (D) = 48 mm',
        'Minor Diameter (d) = 36 mm',
        'Taper Length (L) = 80 mm',
      ],
      steps: [
        'Calculate diameter difference: D - d = 48 - 36 = 12 mm',
        'Apply tangent half-angle equation: tan(α) = (D - d) / (2 · L)',
        'Substitute: tan(α) = 12 / (2 × 80) = 12 / 160 = 0.075',
        'Calculate arctan: α = arctan(0.075) ≈ 4.289° ≈ 4° 17′',
      ],
      answer: '4.29° (4° 17′)',
    },
  },
  {
    id: 'work_31',
    category: 'Workshop',
    title: 'Metal Removal Rate (MRR)',
    definition: 'The volume of chip material sheared and removed from the workpiece per unit cutting time during turning, milling, or shaping operations.',
    formulaLatex: '\\text{MRR} = 1000 \\cdot V \\cdot f \\cdot d_c',
    variables: [
      { symbol: 'V', meaning: 'Cutting speed', unit: 'm/min' },
      { symbol: 'f', meaning: 'Feed rate per revolution', unit: 'mm/rev' },
      { symbol: 'd_c', meaning: 'Radial depth of cut', unit: 'mm' },
      { symbol: '\\text{MRR}', meaning: 'Volumetric metal removal rate', unit: 'mm³/min' },
    ],
    siUnits: 'mm³/min • 1 cm³/min = 1000 mm³/min',
    solvedExample: {
      problem: 'During a rough turning operation on a carbon steel shaft, the cutting speed is V = 40 m/min, feed is f = 0.30 mm/rev, and depth of cut is d_c = 2.5 mm. Calculate the volumetric MRR in mm³/min and cm³/min.',
      given: [
        'Cutting Speed (V) = 40 m/min',
        'Feed (f) = 0.30 mm/rev',
        'Depth of Cut (d_c) = 2.5 mm',
      ],
      steps: [
        'Apply MRR equation: MRR = 1000 · V · f · d_c',
        'Substitute values: MRR = 1000 × 40 × 0.30 × 2.5',
        'Compute: MRR = 1000 × 30 = 30,000 mm³/min',
        'Convert to cm³/min: 30,000 / 1000 = 30 cm³/min',
      ],
      answer: '30,000 mm³/min (30 cm³/min)',
    },
  },
  {
    id: 'work_32',
    category: 'Workshop',
    title: 'Drilling Machining Time',
    definition: 'The time required for a standard twist drill to drill a through-hole of depth L in a plate, accounting for the conical tip approach height (0.3 · D for a 118° point angle).',
    formulaLatex: 'T_d = \\frac{L + 0.3 \\cdot D}{f \\cdot N}',
    variables: [
      { symbol: 'L', meaning: 'Thickness of plate / hole depth', unit: 'mm' },
      { symbol: 'D', meaning: 'Drill bit diameter', unit: 'mm' },
      { symbol: 'f', meaning: 'Feed per spindle revolution', unit: 'mm/rev' },
      { symbol: 'N', meaning: 'Drill spindle rotational speed', unit: 'RPM' },
      { symbol: 'T_d', meaning: 'Drilling time', unit: 'minutes (min)' },
    ],
    siUnits: 'minutes (min)',
    solvedExample: {
      problem: 'A through-hole is to be drilled in a 40 mm thick mild steel plate using a standard 20 mm twist drill (118° point angle). The drill rotates at N = 300 RPM with feed f = 0.20 mm/rev. Determine the drilling time.',
      given: [
        'Plate Thickness (L) = 40 mm',
        'Drill Diameter (D) = 20 mm → Cone tip height = 0.3 × 20 = 6 mm',
        'Feed (f) = 0.20 mm/rev',
        'Spindle Speed (N) = 300 RPM',
      ],
      steps: [
        'Calculate total drill travel: L + 0.3 · D = 40 + 6 = 46 mm',
        'Calculate penetration rate: f · N = 0.20 × 300 = 60 mm/min',
        'Apply drilling time formula: T_d = 46 / 60 ≈ 0.767 minutes',
        'Convert to seconds: 0.767 × 60 ≈ 46 seconds',
      ],
      answer: '0.767 minutes (46 seconds)',
    },
  },
  {
    id: 'work_33',
    category: 'Workshop',
    title: 'Planer Quick Return Ratio',
    definition: 'In shaper and planer quick return mechanisms, the ratio of the duration of the forward working cutting stroke to the idle rapid return stroke, reflecting machine tool productivity.',
    formulaLatex: 'm = \\frac{\\text{Cutting Time}}{\\text{Return Time}} = \\frac{\\alpha}{\\beta}',
    variables: [
      { symbol: '\\alpha', meaning: 'Crank rotation angle during cutting stroke (> 180°)', unit: 'degrees (°)' },
      { symbol: '\\beta', meaning: 'Crank rotation angle during return stroke (< 180°)', unit: 'degrees (°)' },
      { symbol: 'm', meaning: 'Quick Return Ratio (QRR)', unit: 'Dimensionless (typically 1.5 to 2.0)' },
    ],
    siUnits: 'Dimensionless (Ratio: 1)',
    solvedExample: {
      problem: 'In a crank and slotted lever shaper mechanism, the bull gear crank rotates through α = 240° during the forward cutting stroke and β = 120° during the rapid return stroke. Calculate the quick return ratio m.',
      given: [
        'Cutting Stroke Angle (α) = 240°',
        'Return Stroke Angle (β) = 360° - 240° = 120°',
      ],
      steps: [
        'Apply quick return ratio definition: m = α / β',
        'Substitute values: m = 240° / 120° = 2.0',
        'This represents a 2:1 cutting-to-return stroke duration ratio.',
      ],
      answer: '2.0 (2:1 Ratio)',
    },
  },
  {
    id: 'work_34',
    category: 'Workshop',
    title: 'Milling Feed per Tooth',
    definition: 'The undeformed chip thickness or distance the workpiece table advances into the milling cutter during the engagement of a single cutter tooth.',
    formulaLatex: 'f_z = \\frac{f_m}{z \\cdot N}',
    variables: [
      { symbol: 'f_m', meaning: 'Milling machine table feed rate', unit: 'mm/min' },
      { symbol: 'z', meaning: 'Number of cutting teeth / flutes on milling cutter', unit: 'Integer count' },
      { symbol: 'N', meaning: 'Cutter rotational speed', unit: 'RPM' },
      { symbol: 'f_z', meaning: 'Feed per tooth (chip load)', unit: 'mm/tooth' },
    ],
    siUnits: 'mm/tooth',
    solvedExample: {
      problem: 'A 6-tooth carbide face milling cutter (z = 6) operates at N = 500 RPM. The milling machine table feed is set to f_m = 240 mm/min. Determine the feed per tooth (chip load) f_z.',
      given: [
        'Table Feed Rate (f_m) = 240 mm/min',
        'Number of Teeth (z) = 6',
        'Spindle Speed (N) = 500 RPM',
      ],
      steps: [
        'Compute total tooth engagements per min: z · N = 6 × 500 = 3000 teeth/min',
        'Apply feed per tooth formula: f_z = f_m / (z · N)',
        'Substitute values: f_z = 240 / 3000 = 0.08 mm/tooth',
      ],
      answer: '0.08 mm/tooth',
    },
  },
  {
    id: 'work_35',
    category: 'Workshop',
    title: 'Grinding Wheel Surface Speed',
    definition: 'The tangential surface speed at the periphery of an abrasive grinding wheel, which must be strictly maintained within wheel manufacturer safety limits to prevent catastrophic burst failure.',
    formulaLatex: 'V_g = \\frac{\\pi \\cdot D_w \\cdot N_w}{60000}',
    variables: [
      { symbol: 'D_w', meaning: 'Grinding wheel outer diameter', unit: 'mm' },
      { symbol: 'N_w', meaning: 'Grinding wheel spindle speed', unit: 'RPM' },
      { symbol: 'V_g', meaning: 'Peripheral surface speed', unit: 'm/s' },
    ],
    siUnits: 'm/s (Meters per second)',
    solvedExample: {
      problem: 'A vitrified bonded surface grinding wheel of outer diameter D_w = 250 mm rotates at N_w = 2400 RPM. Calculate its peripheral surface velocity V_g in m/s and verify it does not exceed the safe limit of 33 m/s.',
      given: [
        'Wheel Diameter (D_w) = 250 mm',
        'Spindle Speed (N_w) = 2400 RPM',
      ],
      steps: [
        'Apply surface velocity formula: V_g = (π · D_w · N_w) / 60,000',
        'Compute numerator: π × 250 × 2400 = 600,000 π',
        'Divide: V_g = (600,000 π) / 60,000 = 10 π ≈ 31.42 m/s',
        'Safety check: 31.42 m/s < 33 m/s safe rating (Operation is within safe parameters).',
      ],
      answer: '31.42 m/s (Within Safe Limit)',
    },
  },

  // ====================================================
  // ENGINEERING MECHANICS (Mechanics) - 5 FORMULAS
  // ====================================================
  {
    id: 'mech_36',
    category: 'Mechanics',
    title: "Lami's Theorem",
    definition: 'States that if three coplanar, concurrent forces acting at a point are in static equilibrium, each force magnitude is directly proportional to the sine of the angle between the other two forces.',
    formulaLatex: '\\frac{P}{\\sin(\\alpha)} = \\frac{Q}{\\sin(\\beta)} = \\frac{R}{\\sin(\\gamma)}',
    variables: [
      { symbol: 'P, Q, R', meaning: 'Three coplanar concurrent forces in static equilibrium', unit: 'N or kN' },
      { symbol: '\\alpha', meaning: 'Angle between forces Q and R', unit: 'degrees (°)' },
      { symbol: '\\beta', meaning: 'Angle between forces P and R', unit: 'degrees (°)' },
      { symbol: '\\gamma', meaning: 'Angle between forces P and Q', unit: 'degrees (°)' },
    ],
    siUnits: 'Newtons (N)',
    solvedExample: {
      problem: 'Three concurrent coplanar forces P, Q, and R = 100 N hold a mechanical bracket in equilibrium. The angles opposite to P, Q, and R are α = 120°, β = 150°, and γ = 90°. Determine the required magnitudes of forces P and Q.',
      given: [
        'Known Force (R) = 100 N',
        'Opposite Angles: α = 120°, β = 150°, γ = 90° (sin 90° = 1.0)',
      ],
      steps: [
        "Apply Lami's Theorem: P / sin(120°) = Q / sin(150°) = 100 / sin(90°)",
        'Solve for P: P = 100 × sin(120°) = 100 × (√3 / 2) ≈ 100 × 0.8660 = 86.6 N',
        'Solve for Q: Q = 100 × sin(150°) = 100 × 0.500 = 50.0 N',
      ],
      answer: 'P = 86.6 N, Q = 50.0 N',
    },
  },
  {
    id: 'mech_37',
    category: 'Mechanics',
    title: 'Limiting Friction Force',
    definition: "By Coulomb's laws of dry friction, the maximum static resisting friction force (limiting friction) developed between two contacting surfaces just on the verge of impending motion is directly proportional to the normal reaction.",
    formulaLatex: 'F_s = \\mu_s \\cdot R_N',
    variables: [
      { symbol: '\\mu_s', meaning: 'Coefficient of static friction between contacting materials', unit: 'Dimensionless' },
      { symbol: 'R_N', meaning: 'Normal reaction force perpendicular to contact interface', unit: 'N (Newtons)' },
      { symbol: 'F_s', meaning: 'Maximum limiting static friction force', unit: 'N (Newtons)' },
    ],
    siUnits: 'Newtons (N)',
    solvedExample: {
      problem: 'A cast iron machine guide block weighing 500 N rests on a horizontal steel machine bed (Normal reaction R_N = 500 N). If the static friction coefficient is μ_s = 0.35, find the minimum horizontal force required to cause impending motion.',
      given: [
        'Normal Reaction (R_N) = 500 N',
        'Static Friction Coefficient (μ_s) = 0.35',
      ],
      steps: [
        'Apply limiting friction formula: F_s = μ_s · R_N',
        'Substitute values: F_s = 0.35 × 500 N = 175 N',
        'A horizontal force exceeding 175 N will initiate motion.',
      ],
      answer: '175 N',
    },
  },
  {
    id: 'mech_38',
    category: 'Mechanics',
    title: 'Triangular Area Centroid',
    definition: 'The perpendicular distance of the center of area (centroid) of any plane triangle from its base equals one-third of its total altitude (h).',
    formulaLatex: 'y_c = \\frac{h}{3}',
    variables: [
      { symbol: 'h', meaning: 'Perpendicular height / altitude of the triangle', unit: 'mm or m' },
      { symbol: 'y_c', meaning: 'Distance of centroid from base along altitude', unit: 'mm or m' },
    ],
    siUnits: 'mm or m',
    solvedExample: {
      problem: 'A right-angled triangular machine bracket web has a base b = 150 mm and perpendicular vertical height h = 90 mm. Determine the centroidal distance y_c from the base.',
      given: [
        'Height (h) = 90 mm',
        'Base (b) = 150 mm',
      ],
      steps: [
        'Apply centroid formula for triangle: y_c = h / 3',
        'Substitute: y_c = 90 mm / 3 = 30 mm',
        'Note: Centroid distance from the apex vertex = 2h / 3 = 60 mm.',
      ],
      answer: '30 mm from base',
    },
  },
  {
    id: 'mech_39',
    category: 'Mechanics',
    title: 'Power Transmitted by Torque',
    definition: 'The rate of mechanical work delivered by a rotating machine shaft or prime mover revolving at N RPM under a steady transmitted twisting moment T.',
    formulaLatex: 'P = \\frac{2 \\cdot \\pi \\cdot N \\cdot T}{60000}',
    variables: [
      { symbol: 'N', meaning: 'Rotational speed of shaft', unit: 'RPM (rev/min)' },
      { symbol: 'T', meaning: 'Transmitted torque', unit: 'N·m' },
      { symbol: 'P', meaning: 'Transmitted mechanical power', unit: 'kW (Kilowatts)' },
    ],
    siUnits: 'Kilowatts (kW) • Multiply by 1000 for Watts (W = N·m/s = J/s)',
    solvedExample: {
      problem: 'An electric drive motor operates at N = 1440 RPM and transmits a uniform torque of T = 165.8 N·m to an industrial centrifugal pump. Calculate the output power P in kW.',
      given: [
        'Shaft Speed (N) = 1440 RPM',
        'Torque (T) = 165.8 N·m',
      ],
      steps: [
        'Apply power formula: P = (2 · π · N · T) / 60,000',
        'Compute numerator: 2 × π × 1440 × 165.8 ≈ 1,500,000 W = 1500 kW·s/min',
        'Divide: P = 1,500,000 / 60,000 = 25.0 kW',
      ],
      answer: '25.0 kW',
    },
    relatedCalculatorId: 'calc_power',
  },
  {
    id: 'mech_40',
    category: 'Mechanics',
    title: 'Rotational Kinetic Energy',
    definition: 'The kinetic energy possessed by a body rotating about a fixed centroidal axis with angular velocity ω, proportional to its mass moment of inertia I.',
    formulaLatex: '\\text{KE}_{\\text{rot}} = \\frac{1}{2} \\cdot I \\cdot \\omega^2',
    variables: [
      { symbol: 'I', meaning: 'Mass moment of inertia about axis of rotation', unit: 'kg·m²' },
      { symbol: '\\omega', meaning: 'Angular velocity (ω = 2πN / 60)', unit: 'rad/s' },
      { symbol: '\\text{KE}_{\\text{rot}}', meaning: 'Rotational kinetic energy', unit: 'Joules (J or kJ)' },
    ],
    siUnits: 'Joules (J) • 1 kJ = 1000 J = 1000 N·m',
    solvedExample: {
      problem: 'A heavy cast iron engine flywheel has a mass moment of inertia I = 40 kg·m². When running at a steady speed of N = 600 RPM, calculate its angular velocity ω and stored kinetic energy in kJ.',
      given: [
        'Mass Moment of Inertia (I) = 40 kg·m²',
        'Flywheel Speed (N) = 600 RPM',
      ],
      steps: [
        'Compute angular velocity: ω = (2 · π · N) / 60 = (2 · π · 600) / 60 = 20 π ≈ 62.832 rad/s',
        'Square angular velocity: ω² = (62.832)² ≈ 3947.84 rad²/s²',
        'Apply rotational KE equation: KE = 0.5 · I · ω²',
        'Substitute: KE = 0.5 × 40 × 3947.84 = 20 × 3947.84 = 78,956.8 J ≈ 78.96 kJ',
      ],
      answer: '78.96 kJ (78,957 J)',
    },
  },
  {
    id: 'bernoulli',
    category: 'Mechanics',
    title: "Bernoulli's Theorem & Conservation of Fluid Energy",
    definition: 'For steady, incompressible, frictionless streamline flow of an ideal fluid, the total mechanical energy consisting of pressure head, velocity head, and elevation head remains constant along a streamline.',
    formulaLatex: '\\frac{P}{\\rho g} + \\frac{v^2}{2g} + z = \\text{Constant}',
    variables: [
      { symbol: 'P / (\\rho g)', meaning: 'Pressure head of fluid', unit: 'm of fluid column' },
      { symbol: 'v^2 / (2g)', meaning: 'Velocity (kinetic) head', unit: 'm' },
      { symbol: 'z', meaning: 'Potential (datum / elevation) head', unit: 'm' },
      { symbol: 'g', meaning: 'Acceleration due to gravity', unit: '9.81 m/s²' },
    ],
    siUnits: 'Metres (m) of fluid head • Energy per unit weight (N·m/N = m)',
    solvedExample: {
      problem: 'Water flows through a tapered pipe where at section 1 the pressure head is 25 m, velocity is 3 m/s, and elevation is 6 m above datum. Calculate the total fluid head.',
      given: [
        'Pressure Head (P / ρg) = 25 m',
        'Flow Velocity (v) = 3 m/s',
        'Elevation Head (z) = 6 m',
        'Gravitational Acceleration (g) = 9.81 m/s²',
      ],
      steps: [
        'Calculate velocity head: v² / (2g) = 3² / (2 × 9.81) = 9 / 19.62 = 0.459 m',
        'Apply Bernoulli total head formula: H = P/(ρg) + v²/(2g) + z',
        'Substitute all values: H = 25 + 0.459 + 6 = 31.459 m',
      ],
      answer: '31.46 m',
    },
  },
];
