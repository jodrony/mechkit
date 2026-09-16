export interface ComponentQuestion {
  partName: string;
  question: string;
  examinerAnswer: string;
  answer: string;
  category: 'Mounting' | 'Accessory' | 'Structural';
}

export interface BoilerVivaExperiment {
  id: string;
  title: string;
  imageSrc: string;
  type: 'Fire Tube' | 'Water Tube';
  summary: string;
  components: ComponentQuestion[];
}

export const boilerExperiments: BoilerVivaExperiment[] = [
  // ====================================================
  // 1. LANCASHIRE BOILER (14 Labeled Components)
  // ====================================================
  {
    id: 'lancashire',
    title: 'Lancashire Boiler',
    imageSrc: '/viva/lancashire.png',
    type: 'Fire Tube',
    summary: 'Horizontal, stationary, two-flue internal fire-tube boiler with brickwork setting.',
    components: [
      {
        partName: 'Safety valve',
        question: 'What is the exact function of Safety valve?',
        examinerAnswer: 'Releases excess steam into the atmosphere when pressure exceeds safe working limits to prevent explosions.',
        answer: 'Releases excess steam into the atmosphere when pressure exceeds safe working limits to prevent explosions.',
        category: 'Mounting',
      },
      {
        partName: 'Steampipe',
        question: 'What is the exact function of Steampipe?',
        examinerAnswer: 'Conveys saturated or superheated steam from the boiler drum to the engine or turbine.',
        answer: 'Conveys saturated or superheated steam from the boiler drum to the engine or turbine.',
        category: 'Structural',
      },
      {
        partName: 'Manhole',
        question: 'What is the exact function of Manhole?',
        examinerAnswer: 'Provides entry for an inspector or technician to clean and inspect the internal shell.',
        answer: 'Provides entry for an inspector or technician to clean and inspect the internal shell.',
        category: 'Structural',
      },
      {
        partName: 'Low water alarm',
        question: 'What is the exact function of Low water alarm?',
        examinerAnswer: 'Sounds a loud warning whistle when water drops below the safe minimum level to prevent crown overheating.',
        answer: 'Sounds a loud warning whistle when water drops below the safe minimum level to prevent crown overheating.',
        category: 'Mounting',
      },
      {
        partName: 'Damper chain',
        question: 'What is the exact function of Damper chain?',
        examinerAnswer: 'Allows the operator from the front of the boiler to raise or lower the dampers to regulate draught.',
        answer: 'Allows the operator from the front of the boiler to raise or lower the dampers to regulate draught.',
        category: 'Structural',
      },
      {
        partName: 'Furnace tubes',
        question: 'What is the exact function of Furnace tubes?',
        examinerAnswer: 'Two longitudinal internal tubes that contain the fire grates and carry hot combustion gases.',
        answer: 'Two longitudinal internal tubes that contain the fire grates and carry hot combustion gases.',
        category: 'Structural',
      },
      {
        partName: 'Boiler shell',
        question: 'What is the exact function of Boiler shell?',
        examinerAnswer: 'Outer cylindrical pressure vessel containing the water and steam.',
        answer: 'Outer cylindrical pressure vessel containing the water and steam.',
        category: 'Structural',
      },
      {
        partName: 'Grate',
        question: 'What is the exact function of Grate?',
        examinerAnswer: 'Platform made of cast iron bars supporting the burning solid fuel bed.',
        answer: 'Platform made of cast iron bars supporting the burning solid fuel bed.',
        category: 'Structural',
      },
      {
        partName: 'Fire hole',
        question: 'What is the exact function of Fire hole?',
        examinerAnswer: 'Opening through which coal is hand-shoveled into the furnace.',
        answer: 'Opening through which coal is hand-shoveled into the furnace.',
        category: 'Structural',
      },
      {
        partName: 'Blow off cock',
        question: 'What is the exact function of Blow off cock?',
        examinerAnswer: 'Removes settled mud, silt, and scale from the bottom of the shell and drains the boiler for maintenance.',
        answer: 'Removes settled mud, silt, and scale from the bottom of the shell and drains the boiler for maintenance.',
        category: 'Mounting',
      },
      {
        partName: 'Bottom flue',
        question: 'What is the exact function of Bottom flue?',
        examinerAnswer: 'Brickwork chamber running beneath the shell carrying hot gases from rear to front.',
        answer: 'Brickwork chamber running beneath the shell carrying hot gases from rear to front.',
        category: 'Structural',
      },
      {
        partName: 'Main flue',
        question: 'What is the exact function of Main flue?',
        examinerAnswer: 'Collector duct that gathers flue gases from the side flues and channels them directly to the chimney.',
        answer: 'Collector duct that gathers flue gases from the side flues and channels them directly to the chimney.',
        category: 'Structural',
      },
      {
        partName: 'Side flue',
        question: 'What is the exact function of Side flue?',
        examinerAnswer: 'Twin brick channels running along the outer sides of the shell directing gases back toward the main flue and chimney.',
        answer: 'Twin brick channels running along the outer sides of the shell directing gases back toward the main flue and chimney.',
        category: 'Structural',
      },
      {
        partName: 'Damper',
        question: 'What is the exact function of Damper?',
        examinerAnswer: 'Sliding door at the exit of each side flue used to control the airflow and draught through the furnace.',
        answer: 'Sliding door at the exit of each side flue used to control the airflow and draught through the furnace.',
        category: 'Structural',
      },
    ],
  },

  // ====================================================
  // 2. COCHRAN BOILER (22 Labeled Components)
  // ====================================================
  {
    id: 'cochran',
    title: 'Cochran Boiler',
    imageSrc: '/viva/cochran.jpg',
    type: 'Fire Tube',
    summary: 'Vertical, multi-tubular fire-tube boiler with hemispherical crown and horizontal smoke tubes.',
    components: [
      {
        partName: 'Pressure Gauge',
        question: 'What is the exact function of Pressure Gauge?',
        examinerAnswer: 'Measures and displays the internal steam pressure inside the boiler shell.',
        answer: 'Measures and displays the internal steam pressure inside the boiler shell.',
        category: 'Mounting',
      },
      {
        partName: 'Safety valve',
        question: 'What is the exact function of Safety valve?',
        examinerAnswer: 'Automatically discharges steam when internal pressure exceeds the design limit.',
        answer: 'Automatically discharges steam when internal pressure exceeds the design limit.',
        category: 'Mounting',
      },
      {
        partName: 'Stop valve',
        question: 'What is the exact function of Stop valve?',
        examinerAnswer: 'Controls and shuts off the supply of steam from the boiler to the delivery pipeline.',
        answer: 'Controls and shuts off the supply of steam from the boiler to the delivery pipeline.',
        category: 'Mounting',
      },
      {
        partName: 'Man hole',
        question: 'What is the exact function of Man hole?',
        examinerAnswer: 'Allows physical entry into the shell for periodic inspection, cleaning, and tube repairs.',
        answer: 'Allows physical entry into the shell for periodic inspection, cleaning, and tube repairs.',
        category: 'Structural',
      },
      {
        partName: 'External shell',
        question: 'What is the exact function of External shell?',
        examinerAnswer: 'Vertical cylindrical shell with a hemispherical top that houses the water, steam, and fire tubes.',
        answer: 'Vertical cylindrical shell with a hemispherical top that houses the water, steam, and fire tubes.',
        category: 'Structural',
      },
      {
        partName: 'Anti-priming pipe',
        question: 'What is the exact function of Anti-priming pipe?',
        examinerAnswer: 'Traps and separates suspended liquid water droplets from outgoing dry steam.',
        answer: 'Traps and separates suspended liquid water droplets from outgoing dry steam.',
        category: 'Accessory',
      },
      {
        partName: 'Chimney',
        question: 'What is the exact function of Chimney?',
        examinerAnswer: 'Creates natural draught for air intake and exhausts waste combustion gases high into the atmosphere.',
        answer: 'Creates natural draught for air intake and exhausts waste combustion gases high into the atmosphere.',
        category: 'Structural',
      },
      {
        partName: 'Water level gauge',
        question: 'What is the exact function of Water level gauge?',
        examinerAnswer: 'Glass indicator showing the actual operating water level inside the boiler.',
        answer: 'Glass indicator showing the actual operating water level inside the boiler.',
        category: 'Mounting',
      },
      {
        partName: 'Fusible plug',
        question: 'What is the exact function of Fusible plug?',
        examinerAnswer: 'Safety device that melts to flood and extinguish the firebox if the water level falls dangerously low.',
        answer: 'Safety device that melts to flood and extinguish the firebox if the water level falls dangerously low.',
        category: 'Mounting',
      },
      {
        partName: 'Combustion chamber',
        question: 'What is the exact function of Combustion chamber?',
        examinerAnswer: 'Firebrick-lined chamber that deflects hot gases from the flue pipe into the fire tubes.',
        answer: 'Firebrick-lined chamber that deflects hot gases from the flue pipe into the fire tubes.',
        category: 'Structural',
      },
      {
        partName: 'Fire brick lining',
        question: 'What is the exact function of Fire brick lining?',
        examinerAnswer: 'Refractory wall inside the combustion chamber protecting the outer shell from direct flame impingement.',
        answer: 'Refractory wall inside the combustion chamber protecting the outer shell from direct flame impingement.',
        category: 'Structural',
      },
      {
        partName: 'Flue pipe',
        question: 'What is the exact function of Flue pipe?',
        examinerAnswer: 'Short passage conveying burning flue gases from the firebox dome into the combustion chamber.',
        answer: 'Short passage conveying burning flue gases from the firebox dome into the combustion chamber.',
        category: 'Structural',
      },
      {
        partName: 'Feed check valve',
        question: 'What is the exact function of Feed check valve?',
        examinerAnswer: 'Admits high-pressure feedwater into the boiler while preventing backflow when the feed pump stops.',
        answer: 'Admits high-pressure feedwater into the boiler while preventing backflow when the feed pump stops.',
        category: 'Mounting',
      },
      {
        partName: 'Blow off cock',
        question: 'What is the exact function of Blow off cock?',
        examinerAnswer: 'Drains sediments, sludge, and mud collected at the lower base of the boiler shell.',
        answer: 'Drains sediments, sludge, and mud collected at the lower base of the boiler shell.',
        category: 'Mounting',
      },
      {
        partName: 'Smoke box',
        question: 'What is the exact function of Smoke box?',
        examinerAnswer: 'Chamber at the exit of the fire tubes that collects spent gases before they enter the chimney.',
        answer: 'Chamber at the exit of the fire tubes that collects spent gases before they enter the chimney.',
        category: 'Structural',
      },
      {
        partName: 'Fire tube',
        question: 'What is the exact function of Fire tube?',
        examinerAnswer: 'Bank of horizontal tubes through which hot flue gases pass to transfer heat into the surrounding water.',
        answer: 'Bank of horizontal tubes through which hot flue gases pass to transfer heat into the surrounding water.',
        category: 'Structural',
      },
      {
        partName: 'Smoke box door',
        question: 'What is the exact function of Smoke box door?',
        examinerAnswer: 'Hinged door providing easy access to clean soot and deposits from inside the fire tubes.',
        answer: 'Hinged door providing easy access to clean soot and deposits from inside the fire tubes.',
        category: 'Structural',
      },
      {
        partName: 'Fire hole',
        question: 'What is the exact function of Fire hole?',
        examinerAnswer: 'Doorway used by the technician to feed fuel onto the grate.',
        answer: 'Doorway used by the technician to feed fuel onto the grate.',
        category: 'Structural',
      },
      {
        partName: 'Crown',
        question: 'What is the exact function of Crown?',
        examinerAnswer: 'Hemispherical dome forming the roof of the firebox, offering high resistance to intense flame temperatures.',
        answer: 'Hemispherical dome forming the roof of the firebox, offering high resistance to intense flame temperatures.',
        category: 'Structural',
      },
      {
        partName: 'Fire box',
        question: 'What is the exact function of Fire box?',
        examinerAnswer: 'Combustion chamber directly above the grate where primary fuel burning takes place.',
        answer: 'Combustion chamber directly above the grate where primary fuel burning takes place.',
        category: 'Structural',
      },
      {
        partName: 'Grate',
        question: 'What is the exact function of Grate?',
        examinerAnswer: 'Slotted cast-iron floor supporting the solid fuel and admitting primary combustion air from beneath.',
        answer: 'Slotted cast-iron floor supporting the solid fuel and admitting primary combustion air from beneath.',
        category: 'Structural',
      },
      {
        partName: 'Ash pit',
        question: 'What is the exact function of Ash pit?',
        examinerAnswer: 'Bottom chamber beneath the grate collecting burnt ashes and clinker.',
        answer: 'Bottom chamber beneath the grate collecting burnt ashes and clinker.',
        category: 'Structural',
      },
    ],
  },

  // ====================================================
  // 3. BABCOCK & WILCOX BOILER (18 Labeled Components)
  // ====================================================
  {
    id: 'babcock',
    title: 'Babcock & Wilcox Boiler',
    imageSrc: '/viva/babcock.png',
    type: 'Water Tube',
    summary: 'High-pressure, horizontal water-tube boiler with inclined water tubes and natural convective circulation.',
    components: [
      {
        partName: 'Pressure Gauge',
        question: 'What is the exact function of Pressure Gauge?',
        examinerAnswer: 'Indicates the steam pressure within the main drum to ensure safe operating conditions.',
        answer: 'Indicates the steam pressure within the main drum to ensure safe operating conditions.',
        category: 'Mounting',
      },
      {
        partName: 'Safety Valve',
        question: 'What is the exact function of Safety Valve?',
        examinerAnswer: 'Blows off steam automatically when the drum pressure reaches dangerous limits.',
        answer: 'Blows off steam automatically when the drum pressure reaches dangerous limits.',
        category: 'Mounting',
      },
      {
        partName: 'Antipriming Pipe',
        question: 'What is the exact function of Antipriming Pipe?',
        examinerAnswer: 'Internal baffle tube that extracts moisture droplets from steam exiting the stop valve.',
        answer: 'Internal baffle tube that extracts moisture droplets from steam exiting the stop valve.',
        category: 'Accessory',
      },
      {
        partName: 'Stop Valve',
        question: 'What is the exact function of Stop Valve?',
        examinerAnswer: 'Regulates the flow of superheated steam exiting the boiler plant to external machinery.',
        answer: 'Regulates the flow of superheated steam exiting the boiler plant to external machinery.',
        category: 'Mounting',
      },
      {
        partName: 'Drum',
        question: 'What is the exact function of Drum?',
        examinerAnswer: 'Longitudinal horizontal cylinder that acts as a reservoir for feedwater and separates steam from water.',
        answer: 'Longitudinal horizontal cylinder that acts as a reservoir for feedwater and separates steam from water.',
        category: 'Structural',
      },
      {
        partName: 'Steam',
        question: 'What is the exact role of the Steam Space?',
        examinerAnswer: 'Upper space in the drum where dry saturated steam collects before feeding the superheater.',
        answer: 'Upper space in the drum where dry saturated steam collects before feeding the superheater.',
        category: 'Structural',
      },
      {
        partName: 'Water',
        question: 'What is the exact role of the Water Space?',
        examinerAnswer: 'Lower volume of the drum maintaining continuous natural circulation through the inclined tubes.',
        answer: 'Lower volume of the drum maintaining continuous natural circulation through the inclined tubes.',
        category: 'Structural',
      },
      {
        partName: 'Water Level Indicator',
        question: 'What is the exact function of Water Level Indicator?',
        examinerAnswer: 'Shows the water boundary in the drum to prevent tube dry-out or priming.',
        answer: 'Shows the water boundary in the drum to prevent tube dry-out or priming.',
        category: 'Mounting',
      },
      {
        partName: 'Feed Check Valve',
        question: 'What is the exact function of Feed Check Valve?',
        examinerAnswer: 'Non-return valve that admits pressurized feedwater into the drum.',
        answer: 'Non-return valve that admits pressurized feedwater into the drum.',
        category: 'Mounting',
      },
      {
        partName: 'Uptake Header',
        question: 'What is the exact function of Uptake Header?',
        examinerAnswer: 'Front vertical header that collects the heated water-steam mixture from inclined tubes and returns it to the drum.',
        answer: 'Front vertical header that collects the heated water-steam mixture from inclined tubes and returns it to the drum.',
        category: 'Structural',
      },
      {
        partName: 'Baffle Plates',
        question: 'What is the exact function of Baffle Plates?',
        examinerAnswer: 'Firebrick partitions that direct combustion gases across the inclined tubes in a 3-pass zig-zag path.',
        answer: 'Firebrick partitions that direct combustion gases across the inclined tubes in a 3-pass zig-zag path.',
        category: 'Structural',
      },
      {
        partName: 'Superheater Tubes',
        question: 'What is the exact function of Superheater Tubes?',
        examinerAnswer: 'U-bend tube bank placed above the water tubes to raise steam temperature above its saturation point.',
        answer: 'U-bend tube bank placed above the water tubes to raise steam temperature above its saturation point.',
        category: 'Accessory',
      },
      {
        partName: 'Water Tubes',
        question: 'What is the exact function of Water Tubes?',
        examinerAnswer: '15-degree inclined tubes where water flows internally while absorbing heat from external flue gases.',
        answer: '15-degree inclined tubes where water flows internally while absorbing heat from external flue gases.',
        category: 'Structural',
      },
      {
        partName: 'Downtake Header',
        question: 'What is the exact function of Downtake Header?',
        examinerAnswer: 'Rear vertical header directing cold, dense water from the drum down into the water tubes.',
        answer: 'Rear vertical header directing cold, dense water from the drum down into the water tubes.',
        category: 'Structural',
      },
      {
        partName: 'Mud Collector',
        question: 'What is the exact function of Mud Collector?',
        examinerAnswer: 'Low-point cylindrical trap beneath the downtake header that collects scale and precipitate for blow-down.',
        answer: 'Low-point cylindrical trap beneath the downtake header that collects scale and precipitate for blow-down.',
        category: 'Mounting',
      },
      {
        partName: 'Fire Door',
        question: 'What is the exact function of Fire Door?',
        examinerAnswer: 'Access door used to feed coal and inspect the combustion bed.',
        answer: 'Access door used to feed coal and inspect the combustion bed.',
        category: 'Structural',
      },
      {
        partName: 'Grate',
        question: 'What is the exact function of Grate?',
        examinerAnswer: 'Moving or stationary grate platform supporting fuel combustion directly under the uptake header.',
        answer: 'Moving or stationary grate platform supporting fuel combustion directly under the uptake header.',
        category: 'Structural',
      },
      {
        partName: 'Doors (Soot/Cleanout Doors)',
        question: 'What is the exact function of Doors (Soot/Cleanout Doors)?',
        examinerAnswer: 'Access doors in brickwork used for soot blowing and cleaning the exterior of the water tubes.',
        answer: 'Access doors in brickwork used for soot blowing and cleaning the exterior of the water tubes.',
        category: 'Structural',
      },
    ],
  },
];
