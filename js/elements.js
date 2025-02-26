import { THREE } from './module.js';

// Define the base elements and their properties
class Element {
    constructor(id, name, symbol, category, color, model) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.category = category;
        this.color = color;
        this.model = model || 'sphere'; // Default 3D model type
    }
}

// Initial elements library
const ELEMENTS = {
    hydrogen: new Element('hydrogen', 'Hydrogen', 'H', 'gas', 0x88FF88),
    deuterium: new Element('deuterium', 'Deuterium', 'D', 'isotope', 0x77EE77),
    proton: new Element('proton', 'Proton', 'p+', 'particle', 0xFF5555),
    electron: new Element('electron', 'Electron', 'e-', 'particle', 0x5555FF),
    neutron: new Element('neutron', 'Neutron', 'n', 'particle', 0xCCCCCC),
    // Additional elements for combinations to work
    'helium-3': new Element('helium-3', 'Helium-3', 'He-3', 'isotope', 0xFFFF44),
    'hydrogen-gas': new Element('hydrogen-gas', 'Hydrogen Gas', 'H₂', 'gas', 0x99FF99),
};

export { ELEMENTS, Element }; 