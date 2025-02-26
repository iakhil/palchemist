// Define the base elements and their properties
class Element {
    constructor(id, name, symbol, category, color) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.category = category;
        this.color = color;
    }
    
    // Get the color as a CSS hex color string
    getColorString() {
        return '#' + this.color.toString(16).padStart(6, '0');
    }
}

// Initial elements library
const ELEMENTS = {
    // Starting elements
    hydrogen: new Element('hydrogen', 'Hydrogen', 'H', 'gas', 0x88FF88),
    deuterium: new Element('deuterium', 'Deuterium', 'D', 'isotope', 0x77EE77),
    proton: new Element('proton', 'Proton', 'p+', 'particle', 0xFF5555),
    electron: new Element('electron', 'Electron', 'e-', 'particle', 0x5555FF),
    neutron: new Element('neutron', 'Neutron', 'n', 'particle', 0xCCCCCC),
    'helium-3': new Element('helium-3', 'Helium-3', 'He-3', 'isotope', 0xFFFF44),
    'hydrogen-gas': new Element('hydrogen-gas', 'Hydrogen Gas', 'H₂', 'gas', 0x99FF99),
    
    // New elements (first 10 of periodic table)
    helium: new Element('helium', 'Helium', 'He', 'noble gas', 0xFFFF66),
    lithium: new Element('lithium', 'Lithium', 'Li', 'alkali metal', 0xCC80FF),
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
    'beryllium-hydride': new Element('beryllium-hydride', 'Beryllium Hydride', 'BeH₂', 'compound', 0xD2FF30)
}; 