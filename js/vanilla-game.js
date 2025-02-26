// Main game logic
class PalchemistGame {
    constructor() {
        console.log("Game initializing...");
        
        this.selectedElements = [];
        this.discoveredElements = new Set([
            'hydrogen', 'proton', 'electron', 'neutron', 
            'oxygen', 'carbon', 'nitrogen', 'uranium'  // Starting elements
        ]); 
        
        this.initUI();
        
        // Add a hint message
        const resultDisplay = document.getElementById('result-display');
        resultDisplay.innerHTML = `
            <h3>Welcome to Palchemist!</h3>
            <p>Try combining elements. Hint: Uranium has some interesting radioactive properties!</p>
        `;
        
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
            
            const elementInfo = document.createElement('div');
            elementInfo.className = 'element-info';
            elementInfo.textContent = element.name;
            
            elementDiv.addEventListener('click', () => this.selectElement(element));
            
            // Add tooltip with category
            elementDiv.title = `${element.name} (${element.category})`;
            
            elementContainer.appendChild(elementDiv);
            elementContainer.appendChild(elementInfo);
            elementsPanel.appendChild(elementContainer);
        });
    }
    
    selectElement(element) {
        console.log(`Selected element: ${element.name}`);
        
        // Add the element to the workspace area
        const workspace = document.getElementById('workspace');
        
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
        elementDiv.title = `${element.name} (${element.category})`;
        
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
            resultElementDiv.title = `${resultElement.name} (${resultElement.category})`;
            
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