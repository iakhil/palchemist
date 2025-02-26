// Main game logic
class PalchemistGame {
    constructor() {
        console.log("Game initializing...");
        
        this.selectedElements = [];
        this.discoveredElements = new Set([
            'hydrogen', 'proton', 'electron', 'neutron', 
            'oxygen', 'carbon', 'nitrogen'  // Added more starting elements
        ]); 
        
        this.initUI();
        console.log("Game initialization complete");
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
            elementDiv.style.backgroundColor = element.getColorString();
            elementDiv.textContent = element.symbol;
            elementDiv.dataset.id = element.id;
            
            elementDiv.addEventListener('click', () => this.selectElement(element));
            
            elementsPanel.appendChild(elementDiv);
        });
    }
    
    selectElement(element) {
        console.log(`Selected element: ${element.name}`);
        
        // Add the element to the workspace area
        const workspace = document.getElementById('workspace');
        
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element workspace-element';
        elementDiv.style.backgroundColor = element.getColorString();
        elementDiv.textContent = element.symbol;
        elementDiv.dataset.id = element.id;
        
        // Insert before the buttons
        const buttons = workspace.querySelectorAll('button');
        if (buttons.length > 0) {
            workspace.insertBefore(elementDiv, buttons[0]);
        } else {
            workspace.appendChild(elementDiv);
        }
        
        // Add the element to the selected elements array
        this.selectedElements.push(element.id);
    }
    
    combineElements() {
        console.log("Attempting to combine elements:", this.selectedElements);
        
        if (this.selectedElements.length < 2) {
            document.getElementById('result-display').textContent = 'Select at least two elements to combine.';
            return;
        }
        
        const combination = checkCombination(this.selectedElements);
        
        if (combination) {
            const resultElement = ELEMENTS[combination.output];
            
            // Display the result
            const resultDisplay = document.getElementById('result-display');
            resultDisplay.innerHTML = `
                <h3>Success! You created ${resultElement.name}!</h3>
                <p>${combination.description}</p>
                <div class="element" style="background-color: ${resultElement.getColorString()}">
                    ${resultElement.symbol}
                </div>
            `;
            
            // Add the new element to discovered elements if it's not already there
            if (!this.discoveredElements.has(resultElement.id)) {
                this.discoveredElements.add(resultElement.id);
                this.updateElementsPanel();
                
                resultDisplay.innerHTML += '<p><strong>New element discovered!</strong></p>';
            }
            
            // Clear the workspace after a successful combination
            this.clearWorkspace();
            
        } else {
            document.getElementById('result-display').textContent = 'These elements cannot be combined. Try a different combination.';
        }
    }
    
    clearWorkspace() {
        const workspace = document.getElementById('workspace');
        const elementDivs = workspace.querySelectorAll('.workspace-element');
        elementDivs.forEach(div => div.remove());
        
        this.selectedElements = [];
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, creating game instance");
    const game = new PalchemistGame();
});

console.log("Game script loaded"); 