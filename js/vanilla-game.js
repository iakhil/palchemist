// Main game logic
class PalchemistGame {
    constructor() {
        console.log("Game initializing...");
        
        this.selectedElements = [];
        this.discoveredElements = new Set([
            'hydrogen', 'proton', 'electron', 'neutron', 
            'oxygen', 'carbon', 'nitrogen', 'uranium', 
            // Add some more starter elements for nuclear reactions
            'gold', 'silver', 'mercury', 'radium', 'iron',
            'gamma-ray', 'alpha-particle', 'tritium', 'deuterium',
            'boron', 'beryllium', 'radon', 'xenon', 'krypton'
        ]); 
        
        this.initUI();
        
        // Add a hint message
        const resultDisplay = document.getElementById('result-display');
        resultDisplay.innerHTML = `
            <h3>Welcome to Palchemist!</h3>
            <p>Try combining elements. Hint: Uranium has some interesting radioactive properties! Try mixing neutrons with other elements.</p>
        `;
        
        console.log("Game initialization complete");
    }
    
    initUI() {
        const elementsPanel = document.getElementById('elements-panel');
        const workspace = document.getElementById('workspace');
        const resultDisplay = document.getElementById('result-display');
        
        // Create a dedicated container for workspace elements
        const workspaceElementsContainer = document.createElement('div');
        workspaceElementsContainer.id = 'workspace-elements';
        workspaceElementsContainer.className = 'workspace-elements-container';
        workspace.appendChild(workspaceElementsContainer);
        
        // Create a container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        // Add combine button to button container
        const combineButton = document.createElement('button');
        combineButton.textContent = 'Combine';
        combineButton.addEventListener('click', () => this.combineElements());
        buttonContainer.appendChild(combineButton);
        
        // Add clear button to button container
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', () => this.clearWorkspace());
        buttonContainer.appendChild(clearButton);
        
        // Add button container to workspace
        workspace.appendChild(buttonContainer);
        
        // Populate elements panel with discovered elements
        this.updateElementsPanel();
    }
    
    updateElementsPanel() {
        const elementsPanel = document.getElementById('elements-panel');
        elementsPanel.innerHTML = '';
        
        // Convert Set to Array and sort by element name
        const sortedElements = Array.from(this.discoveredElements)
            .map(id => ELEMENTS[id])
            .filter(element => element) // Filter out any undefined elements
            .sort((a, b) => a.name.localeCompare(b.name));
        
        sortedElements.forEach(element => {
            const elementContainer = document.createElement('div');
            elementContainer.style.display = 'inline-block';
            elementContainer.style.margin = '5px';
            elementContainer.className = 'appear';
            
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            if (element.category === 'particle') {
                elementDiv.classList.add('particle');
            }
            if (element.category === 'radioactive' || element.category === 'radiation') {
                elementDiv.classList.add('radioactive');
            }
            elementDiv.style.backgroundColor = element.getColorString();
            elementDiv.textContent = element.symbol;
            elementDiv.dataset.id = element.id;
            
            // Add atomic number if available
            if (element.atomicNumber !== null) {
                const atomicNumber = document.createElement('div');
                atomicNumber.className = 'atomic-number';
                atomicNumber.textContent = element.atomicNumber;
                elementDiv.appendChild(atomicNumber);
            }
            
            // Add atomic mass if available
            if (element.atomicMass !== null) {
                const atomicMass = document.createElement('div');
                atomicMass.className = 'atomic-mass';
                atomicMass.textContent = element.atomicMass;
                elementDiv.appendChild(atomicMass);
            }
            
            const elementInfo = document.createElement('div');
            elementInfo.className = 'element-info';
            elementInfo.textContent = element.name;
            
            elementDiv.addEventListener('click', () => this.selectElement(element));
            
            // Add tooltip with category and atomic details
            let tooltipText = `${element.name} (${element.category})`;
            if (element.atomicNumber !== null) {
                tooltipText += `, Atomic #: ${element.atomicNumber}`;
            }
            if (element.atomicMass !== null) {
                tooltipText += `, Mass: ${element.atomicMass}`;
            }
            elementDiv.title = tooltipText;
            
            elementContainer.appendChild(elementDiv);
            elementContainer.appendChild(elementInfo);
            elementsPanel.appendChild(elementContainer);
        });
    }
    
    selectElement(element) {
        console.log(`Selected element: ${element.name}`);
        
        // Add the element to the workspace elements container
        const workspaceElementsContainer = document.getElementById('workspace-elements');
        
        const elementDiv = document.createElement('div');
        elementDiv.className = 'element workspace-element appear';
        if (element.category === 'particle') {
            elementDiv.classList.add('particle');
        }
        if (element.category === 'radioactive' || element.category === 'radiation') {
            elementDiv.classList.add('radioactive');
        }
        elementDiv.style.backgroundColor = element.getColorString();
        elementDiv.textContent = element.symbol;
        elementDiv.dataset.id = element.id;
        
        // Add atomic number if available
        if (element.atomicNumber !== null) {
            const atomicNumber = document.createElement('div');
            atomicNumber.className = 'atomic-number';
            atomicNumber.textContent = element.atomicNumber;
            elementDiv.appendChild(atomicNumber);
        }
        
        // Add atomic mass if available
        if (element.atomicMass !== null) {
            const atomicMass = document.createElement('div');
            atomicMass.className = 'atomic-mass';
            atomicMass.textContent = element.atomicMass;
            elementDiv.appendChild(atomicMass);
        }
        
        // Add tooltip with category and atomic details
        let tooltipText = `${element.name} (${element.category})`;
        if (element.atomicNumber !== null) {
            tooltipText += `, Atomic #: ${element.atomicNumber}`;
        }
        if (element.atomicMass !== null) {
            tooltipText += `, Mass: ${element.atomicMass}`;
        }
        elementDiv.title = tooltipText;
        
        // Add to the workspace elements container
        workspaceElementsContainer.appendChild(elementDiv);
        
        // Add the element to the selected elements array
        this.selectedElements.push(element.id);
    }
    
    combineElements() {
        console.log("Attempting to combine elements:", this.selectedElements);
        
        // Special case for single radioactive elements that can decay
        if (this.selectedElements.length === 1) {
            const elementId = this.selectedElements[0];
            const element = ELEMENTS[elementId];
            
            if (element.category === 'radioactive') {
                // Check if there's a decay combination for this single element
                const combination = checkCombination([elementId]);
                
                if (combination) {
                    this.processCombination(combination);
                    return;
                }
            }
            
            document.getElementById('result-display').textContent = 'Select at least two elements to combine.';
            return;
        }
        
        if (this.selectedElements.length < 2) {
            document.getElementById('result-display').textContent = 'Select at least two elements to combine.';
            return;
        }
        
        const combination = checkCombination(this.selectedElements);
        
        if (combination) {
            this.processCombination(combination);
        } else {
            document.getElementById('result-display').textContent = 'These elements cannot be combined. Try a different combination.';
        }
    }
    
    processCombination(combination) {
        const resultElement = ELEMENTS[combination.output];
        
        // Display the result
        const resultDisplay = document.getElementById('result-display');
        resultDisplay.innerHTML = `
            <h3>Success! You created ${resultElement.name}!</h3>
            <p>${combination.description}</p>
        `;
        
        // Add visual element
        const resultElementDiv = document.createElement('div');
        resultElementDiv.className = 'element result-element appear';
        if (resultElement.category === 'particle') {
            resultElementDiv.classList.add('particle');
        }
        if (resultElement.category === 'radioactive' || resultElement.category === 'radiation') {
            resultElementDiv.classList.add('radioactive');
        }
        resultElementDiv.style.backgroundColor = resultElement.getColorString();
        resultElementDiv.textContent = resultElement.symbol;
        
        // Add atomic number if available
        if (resultElement.atomicNumber !== null) {
            const atomicNumber = document.createElement('div');
            atomicNumber.className = 'atomic-number';
            atomicNumber.textContent = resultElement.atomicNumber;
            resultElementDiv.appendChild(atomicNumber);
        }
        
        // Add atomic mass if available
        if (resultElement.atomicMass !== null) {
            const atomicMass = document.createElement('div');
            atomicMass.className = 'atomic-mass';
            atomicMass.textContent = resultElement.atomicMass;
            resultElementDiv.appendChild(atomicMass);
        }
        
        // Add tooltip with category and atomic details
        let tooltipText = `${resultElement.name} (${resultElement.category})`;
        if (resultElement.atomicNumber !== null) {
            tooltipText += `, Atomic #: ${resultElement.atomicNumber}`;
        }
        if (resultElement.atomicMass !== null) {
            tooltipText += `, Mass: ${resultElement.atomicMass}`;
        }
        resultElementDiv.title = tooltipText;
        
        resultDisplay.appendChild(resultElementDiv);
        
        // Add the new element to discovered elements if it's not already there
        if (!this.discoveredElements.has(resultElement.id)) {
            this.discoveredElements.add(resultElement.id);
            this.updateElementsPanel();
            
            resultDisplay.innerHTML += '<p><strong>New element discovered!</strong></p>';
            
            // Add back the result element since the innerHTML update removed it
            resultDisplay.appendChild(resultElementDiv);
        }
        
        // Add combination list used
        const inputList = document.createElement('div');
        inputList.className = 'input-list';
        inputList.innerHTML = `<p>Elements used: ${this.selectedElements.map(id => ELEMENTS[id].name).join(' + ')}</p>`;
        resultDisplay.appendChild(inputList);
        
        // Clear the workspace after a successful combination
        this.clearWorkspace();
    }
    
    clearWorkspace() {
        const workspaceElementsContainer = document.getElementById('workspace-elements');
        workspaceElementsContainer.innerHTML = ''; // Clear all elements
        
        this.selectedElements = [];
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, creating game instance");
    const game = new PalchemistGame();
});

console.log("Game script loaded"); 