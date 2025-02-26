// Import Three.js and other modules
import { THREE } from './module.js';
import { GameRenderer } from './renderer.js';
import { ELEMENTS } from './elements.js';
import { checkCombination } from './combinations.js';

console.log("Main.js loading...");

// Main game logic
class PalchemistGame {
    constructor() {
        console.log("Game initializing...");
        
        // Check if elements exist
        if (!document.getElementById('scene-container')) {
            console.error("Scene container not found!");
            return;
        }
        
        try {
            this.renderer = new GameRenderer();
            this.selectedElements = [];
            this.discoveredElements = new Set(['hydrogen', 'proton', 'electron', 'neutron']); // Starting elements
            
            this.initUI();
            console.log("Game initialization complete");
        } catch (error) {
            console.error("Error initializing game:", error);
        }
    }
    
    initUI() {
        const elementsPanel = document.getElementById('elements-panel');
        const workspace = document.getElementById('workspace');
        const resultDisplay = document.getElementById('result-display');
        
        // Populate elements panel with discovered elements
        this.updateElementsPanel();
        
        // Add combine button to workspace
        const combineButton = document.createElement('button');
        combineButton.textContent = 'Combine';
        combineButton.addEventListener('click', () => this.combineElements());
        workspace.appendChild(combineButton);
        
        // Add clear button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', () => this.clearWorkspace());
        workspace.appendChild(clearButton);
    }
    
    updateElementsPanel() {
        const elementsPanel = document.getElementById('elements-panel');
        elementsPanel.innerHTML = '';
        
        this.discoveredElements.forEach(elementId => {
            const element = ELEMENTS[elementId];
            if (!element) return;
            
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            elementDiv.style.backgroundColor = '#' + element.color.toString(16).padStart(6, '0');
            elementDiv.textContent = element.symbol;
            elementDiv.dataset.id = element.id;
            
            elementDiv.addEventListener('click', () => this.selectElement(element));
            
            elementsPanel.appendChild(elementDiv);
        });
    }
    
    selectElement(element) {
        if (this.selectedElements.length < 2) {
            this.selectedElements.push(element);
            
            // Display in 3D
            const position = new THREE.Vector3(
                this.selectedElements.length === 1 ? -1.5 : 1.5, 
                0, 
                0
            );
            this.renderer.displayElement(element, position);
            
            // Update UI
            const workspace = document.getElementById('workspace');
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            elementDiv.style.backgroundColor = '#' + element.color.toString(16).padStart(6, '0');
            elementDiv.textContent = element.symbol;
            workspace.insertBefore(elementDiv, workspace.firstChild);
        }
    }
    
    combineElements() {
        if (this.selectedElements.length < 2) {
            alert('Select at least two elements to combine!');
            return;
        }
        
        const elementIds = this.selectedElements.map(elem => elem.id);
        const combination = checkCombination(elementIds);
        
        const resultDisplay = document.getElementById('result-display');
        
        if (combination) {
            // Successful combination
            const resultElement = ELEMENTS[combination.output];
            
            if (!resultElement) {
                console.error(`Result element "${combination.output}" not defined!`);
                return;
            }
            
            // Add to discovered elements
            this.discoveredElements.add(resultElement.id);
            this.updateElementsPanel();
            
            // Display result
            resultDisplay.innerHTML = '';
            
            const resultElemDiv = document.createElement('div');
            resultElemDiv.className = 'element';
            resultElemDiv.style.backgroundColor = '#' + resultElement.color.toString(16).padStart(6, '0');
            resultElemDiv.textContent = resultElement.symbol;
            
            const resultText = document.createElement('div');
            resultText.textContent = combination.description;
            
            resultDisplay.appendChild(resultElemDiv);
            resultDisplay.appendChild(resultText);
            
            // Show the result in 3D
            this.renderer.clearScene();
            this.renderer.displayElement(resultElement, new THREE.Vector3(0, 0, 0));
        } else {
            // Failed combination
            resultDisplay.textContent = 'These elements cannot be combined.';
            setTimeout(() => {
                this.clearWorkspace();
            }, 2000);
        }
    }
    
    clearWorkspace() {
        const workspace = document.getElementById('workspace');
        const elementDivs = workspace.querySelectorAll('.element');
        elementDivs.forEach(div => div.remove());
        
        this.selectedElements = [];
        this.renderer.clearScene();
        
        document.getElementById('result-display').textContent = '';
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, creating game instance");
    const game = new PalchemistGame();
});

console.log("Main.js loaded"); 