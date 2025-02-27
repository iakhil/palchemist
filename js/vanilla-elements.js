// Define the base elements and their properties
class Element {
    constructor(id, name, symbol, category, color, atomicNumber = null, atomicMass = null) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.category = category;
        this.color = color;
        this.atomicNumber = atomicNumber;
        this.atomicMass = atomicMass;
    }
    
    // Get the color as a CSS hex color string
    getColorString() {
        return '#' + this.color.toString(16).padStart(6, '0');
    }
}

// Initial elements library
const ELEMENTS = {
    // Starting elements
    hydrogen: new Element('hydrogen', 'Hydrogen', 'H', 'gas', 0x88FF88, 1, 1),
    deuterium: new Element('deuterium', 'Deuterium', 'D', 'isotope', 0x77EE77),
    proton: new Element('proton', 'Proton', 'p+', 'particle', 0xFF5555),
    electron: new Element('electron', 'Electron', 'e-', 'particle', 0x5555FF),
    neutron: new Element('neutron', 'Neutron', 'n', 'particle', 0xCCCCCC),
    'helium-3': new Element('helium-3', 'Helium-3', 'He-3', 'isotope', 0xFFFF44),
    'hydrogen-gas': new Element('hydrogen-gas', 'Hydrogen Gas', 'H₂', 'gas', 0x99FF99),
    
    // New elements (first 10 of periodic table)
    helium: new Element('helium', 'Helium', 'He', 'noble gas', 0xFFFF66, 2, 4),
    lithium: new Element('lithium', 'Lithium', 'Li', 'alkali metal', 0xCC80FF, 3, 7),
    beryllium: new Element('beryllium', 'Beryllium', 'Be', 'alkaline earth', 0xC2FF00),
    boron: new Element('boron', 'Boron', 'B', 'metalloid', 0xFFB5B5),
    carbon: new Element('carbon', 'Carbon', 'C', 'nonmetal', 0x909090),
    nitrogen: new Element('nitrogen', 'Nitrogen', 'N', 'gas', 0x3050F8),
    oxygen: new Element('oxygen', 'Oxygen', 'O', 'gas', 0xFF0D0D),
    fluorine: new Element('fluorine', 'Fluorine', 'F', 'halogen', 0x90E050),
    neon: new Element('neon', 'Neon', 'Ne', 'noble gas', 0xB3E3F5),
    
    // Common compounds for combinations
    water: new Element('water', 'Water', 'H₂O', 'compound', 0x1E90FF),
    methane: new Element('methane', 'Methane', 'CH₄', 'compound', 0x606060),
    ammonia: new Element('ammonia', 'Ammonia', 'NH₃', 'compound', 0x84A9FF),
    'carbon-dioxide': new Element('carbon-dioxide', 'Carbon Dioxide', 'CO₂', 'compound', 0x778899),
    'oxygen-gas': new Element('oxygen-gas', 'Oxygen Gas', 'O₂', 'gas', 0xFF3030),
    'nitrogen-gas': new Element('nitrogen-gas', 'Nitrogen Gas', 'N₂', 'gas', 0x4169E1),
    salt: new Element('salt', 'Salt', 'NaCl', 'compound', 0xFFFFFF),
    sodium: new Element('sodium', 'Sodium', 'Na', 'alkali metal', 0xAB5CF2),
    chlorine: new Element('chlorine', 'Chlorine', 'Cl', 'halogen', 0x1FF01F),
    'hydrogen-fluoride': new Element('hydrogen-fluoride', 'Hydrogen Fluoride', 'HF', 'compound', 0x90E070),
    'lithium-hydride': new Element('lithium-hydride', 'Lithium Hydride', 'LiH', 'compound', 0xD080FF),
    'beryllium-hydride': new Element('beryllium-hydride', 'Beryllium Hydride', 'BeH₂', 'compound', 0xD2FF30),

    // Radioactive elements
    uranium: new Element('uranium', 'Uranium', 'U', 'radioactive', 0x7CFC00),
    plutonium: new Element('plutonium', 'Plutonium', 'Pu', 'radioactive', 0xFF69B4),
    radium: new Element('radium', 'Radium', 'Ra', 'radioactive', 0xF0E68C),
    thorium: new Element('thorium', 'Thorium', 'Th', 'radioactive', 0x8A2BE2),
    polonium: new Element('polonium', 'Polonium', 'Po', 'radioactive', 0xDA70D6),

    // Nuclear particles and components
    'alpha-particle': new Element('alpha-particle', 'Alpha Particle', 'α', 'radiation', 0xFF4500),
    'beta-particle': new Element('beta-particle', 'Beta Particle', 'β', 'radiation', 0x1E90FF),
    'gamma-ray': new Element('gamma-ray', 'Gamma Ray', 'γ', 'radiation', 0x9370DB),
    'uranium-235': new Element('uranium-235', 'Uranium-235', 'U-235', 'isotope', 0x66CD00),
    'uranium-238': new Element('uranium-238', 'Uranium-238', 'U-238', 'isotope', 0x228B22),
    'plutonium-239': new Element('plutonium-239', 'Plutonium-239', 'Pu-239', 'isotope', 0xDB7093),
    'radon': new Element('radon', 'Radon', 'Rn', 'noble gas', 0xE6E6FA),
    'lead': new Element('lead', 'Lead', 'Pb', 'metal', 0x778899),
    'bismuth': new Element('bismuth', 'Bismuth', 'Bi', 'metal', 0x9932CC),
    'astatine': new Element('astatine', 'Astatine', 'At', 'halogen', 0x00CED1),

    // More radioactive elements
    'californium': new Element('californium', 'Californium', 'Cf', 'radioactive', 0xA3FF00),
    'einsteinium': new Element('einsteinium', 'Einsteinium', 'Es', 'radioactive', 0xFF00FF),
    'fermium': new Element('fermium', 'Fermium', 'Fm', 'radioactive', 0x00FFBB),
    'tritium': new Element('tritium', 'Tritium', 'T', 'isotope', 0x66EE66),
    'deuterium-tritium': new Element('deuterium-tritium', 'Deuterium-Tritium', 'D-T', 'fuel', 0x55DD55),
    'cesium-137': new Element('cesium-137', 'Cesium-137', 'Cs-137', 'radioactive', 0xFFAA00),
    'iodine-131': new Element('iodine-131', 'Iodine-131', 'I-131', 'radioactive', 0x551A8B),
    'strontium-90': new Element('strontium-90', 'Strontium-90', 'Sr-90', 'radioactive', 0xEE82EE),
    'cobalt-60': new Element('cobalt-60', 'Cobalt-60', 'Co-60', 'radioactive', 0x0000CD),

    // Nuclear products and elements
    'positron': new Element('positron', 'Positron', 'e+', 'particle', 0xFF5555),
    'gold': new Element('gold', 'Gold', 'Au', 'metal', 0xFFD700),
    'silver': new Element('silver', 'Silver', 'Ag', 'metal', 0xC0C0C0),
    'mercury': new Element('mercury', 'Mercury', 'Hg', 'metal', 0xB4B4B4),
    'krypton': new Element('krypton', 'Krypton', 'Kr', 'noble gas', 0x5CB8E5),
    'barium': new Element('barium', 'Barium', 'Ba', 'metal', 0x00C957),
    'xenon': new Element('xenon', 'Xenon', 'Xe', 'noble gas', 0x429EB0),
    'americium': new Element('americium', 'Americium', 'Am', 'radioactive', 0xFF5F1F),
    'fusion-energy': new Element('fusion-energy', 'Fusion Energy', '⚡', 'energy', 0xFFFF00),
    'nuclear-isomer': new Element('nuclear-isomer', 'Nuclear Isomer', 'Iso', 'radioactive', 0xFFA07A),
    'iron': new Element('iron', 'Iron', 'Fe', 'metal', 0xBF8040),
    'neptunium': new Element('neptunium', 'Neptunium', 'Np', 'radioactive', 0x0080FF),
    'cadmium': new Element('cadmium', 'Cadmium', 'Cd', 'metal', 0xFFD98F)
}; 