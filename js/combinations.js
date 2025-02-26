// If there's an import like this, change it:
// import * as THREE from 'three';
// or
// import something from 'three';

// To this:
import { THREE } from './module.js';

// Define possible combinations and their results
const COMBINATIONS = [
    {
        inputs: ['deuterium', 'proton'],
        output: 'helium-3',
        description: 'Nuclear fusion of deuterium and a proton creates helium-3'
    },
    {
        inputs: ['hydrogen', 'hydrogen'],
        output: 'hydrogen-gas',
        description: 'Two hydrogen atoms form hydrogen gas (H₂)'
    },
    {
        inputs: ['proton', 'electron'],
        output: 'hydrogen',
        description: 'A proton and electron combine to form a hydrogen atom'
    },
    {
        inputs: ['hydrogen', 'neutron'],
        output: 'deuterium',
        description: 'Adding a neutron to hydrogen creates deuterium'
    },
    // Add more combinations
];

// Function to check if a combination exists
function checkCombination(elementIds) {
    // Sort the IDs to ensure consistent matching regardless of order
    const sortedIds = [...elementIds].sort();
    
    for (const combo of COMBINATIONS) {
        const comboInputs = [...combo.inputs].sort();
        
        // Check if arrays match
        if (sortedIds.length === comboInputs.length && 
            sortedIds.every((id, index) => id === comboInputs[index])) {
            return combo;
        }
    }
    
    return null; // No matching combination found
}

export { COMBINATIONS, checkCombination }; 