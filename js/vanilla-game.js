// Main game logic
class PalchemistGame {
    constructor() {
        console.log("Game initializing...");
        
        this.username = null;
        this.score = 0;
        this.selectedElements = [];
        this.gameActive = false;
        this.timeLeft = 30;
        this.discoveredElements = new Set([
            'hydrogen', 'proton', 'electron', 'neutron', 
            'oxygen', 'carbon', 'nitrogen', 'uranium', 
            // Add some more starter elements for nuclear reactions
            'gold', 'silver', 'mercury', 'radium', 'iron',
            'gamma-ray', 'alpha-particle', 'tritium', 'deuterium',
            'boron', 'beryllium', 'radon', 'xenon', 'krypton'
        ]); 
        
        // Elements discovered during the current game session
        this.newlyDiscoveredElements = new Set();
        
        // Show username modal first
        this.showUsernameModal().then(() => {
            this.initUI();
            this.updateLeaderboard();
            this.showStartGameModal();
        });
        
        console.log("Game initialization complete");
    }
    
    async showUsernameModal() {
        return new Promise((resolve) => {
            const modal = document.getElementById('username-modal');
            const input = document.getElementById('username-input');
            const submit = document.getElementById('username-submit');

            const handleSubmit = () => {
                const username = input.value.trim();
                if (username && username.length <= 20) {
                    this.username = username;
                    modal.classList.remove('show');
                    resolve();
                }
            };

            submit.addEventListener('click', handleSubmit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSubmit();
            });

            modal.classList.add('show');
            input.focus();
        });
    }

    createModal(title, content, buttons) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        
        let modalHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${title}</h2>
                ${content}
                <div class="modal-buttons">
        `;
        
        // Add buttons
        buttons.forEach(button => {
            modalHTML += `<button id="${button.id}">${button.text}</button>`;
        });
        
        modalHTML += `
                </div>
            </div>
        `;
        
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        // Add close button functionality
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
        
        // Add button event listeners
        buttons.forEach(button => {
            const buttonElement = document.getElementById(button.id);
            buttonElement.addEventListener('click', () => {
                if (button.action) {
                    button.action();
                }
                modal.remove();
            });
        });
        
        return modal;
    }

    showStartGameModal() {
        const content = `
            <p>You have 30 seconds to discover as many elements as possible!</p>
            <p>More complex combinations = More points!</p>
        `;
        
        const buttons = [{
            id: 'start-game',
            text: 'Start Game',
            action: () => this.startGame()
        }];
        
        this.createModal('Ready to Play?', content, buttons);
    }

    startGame() {
        // Remove persistent play again button if it exists
        const persistentButton = document.getElementById('persistent-play-again');
        if (persistentButton) {
            persistentButton.remove();
        }
        
        this.gameActive = true;
        this.score = 0;
        this.timeLeft = 30;
        
        // Reset newly discovered elements for this game session
        this.newlyDiscoveredElements.clear();
        
        // Keep the starter elements the same
        const starterElements = [
            'hydrogen', 'proton', 'electron', 'neutron', 
            'oxygen', 'carbon', 'nitrogen', 'uranium',
            'gold', 'silver', 'mercury', 'radium', 'iron',
            'gamma-ray', 'alpha-particle', 'tritium', 'deuterium',
            'boron', 'beryllium', 'radon', 'xenon', 'krypton'
        ];
        
        // Reset to starter elements
        this.discoveredElements.clear();
        starterElements.forEach(e => this.discoveredElements.add(e));

        // Remove existing timer if there is one
        const existingTimer = document.getElementById('timer-display');
        if (existingTimer) {
            existingTimer.remove();
        }

        // Add timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        timerDisplay.className = 'timer-display';
        
        // Insert timer after the logo to preserve it
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.parentNode.insertBefore(timerDisplay, logoContainer.nextSibling);
        } else {
            document.getElementById('ui-container').prepend(timerDisplay);
        }

        // Start timer
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);

        // Update UI
        this.updateElementsPanel();
        
        // Clear the workspace
        this.clearWorkspace();
        
        // Reset result display
        const resultDisplay = document.getElementById('result-display');
        resultDisplay.innerHTML = `
            <h3>Game Started!</h3>
            <p>Combine elements to earn points. You have 30 seconds!</p>
        `;
    }

    updateTimer() {
        const timerDisplay = document.getElementById('timer-display');
        timerDisplay.textContent = `Time Left: ${this.timeLeft}s`;
        
        if (this.timeLeft <= 0) {
            this.endGame();
        } else {
            this.timeLeft--;
            if (this.timeLeft <= 10) {
                timerDisplay.classList.add('timer-warning');
            }
        }
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.gameActive = false;

        // Calculate final score
        const finalScore = this.score;
        
        // First update the score in Firebase
        this.updateScore(finalScore).then(() => {
            // Then update the leaderboard display
            this.updateLeaderboard().then(() => {
                // Add a persistent play again button to the UI
                this.addPersistentPlayAgainButton();
                
                // Finally show the end game modal
                const content = `
                    <p>Final Score: ${finalScore} points</p>
                    <p>New Elements Discovered: ${this.newlyDiscoveredElements.size}</p>
                `;
                
                const buttons = [{
                    id: 'play-again',
                    text: 'Play Again',
                    action: () => this.startGame()
                }];
                
                this.createModal('Time\'s Up!', content, buttons);
            });
        });
    }

    addPersistentPlayAgainButton() {
        // Remove existing button if there is one
        const existingButton = document.getElementById('persistent-play-again');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Create a persistent play again button
        const playAgainButton = document.createElement('button');
        playAgainButton.id = 'persistent-play-again';
        playAgainButton.className = 'persistent-play-again';
        playAgainButton.textContent = 'Play Again';
        playAgainButton.addEventListener('click', () => this.startGame());
        
        // Add it to the UI container, after the timer display
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay && timerDisplay.parentNode) {
            timerDisplay.parentNode.insertBefore(playAgainButton, timerDisplay.nextSibling);
        } else {
            // Fallback if timer display is not found
            document.getElementById('ui-container').prepend(playAgainButton);
        }
    }

    updateScore(score) {
        // Post score to backend with correct port
        return fetch('https://palchemist.onrender.com/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.username,
                score: score
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update score');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error updating score:', error);
        });
    }

    async updateLeaderboard() {
        try {
            console.log("Fetching leaderboard data...");
            // Use the correct port for the backend server
            const response = await fetch('https://palchemist.onrender.com/api/leaderboard');
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Leaderboard data received:", data);
            
            const leaderboardContent = document.getElementById('leaderboard-content');
            leaderboardContent.innerHTML = '';
            
            // Check if we have leaderboard data
            if (!data.leaderboard || data.leaderboard.length === 0) {
                leaderboardContent.innerHTML = '<p>No scores yet. Be the first to set a high score!</p>';
                return;
            }
            
            // Populate the leaderboard
            data.leaderboard.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.className = `leaderboard-entry ${entry.rank <= 3 ? 'rank-' + entry.rank : ''}`;
                entryDiv.innerHTML = `
                    <span>#${entry.rank} ${entry.username}</span>
                    <span>${entry.score} points</span>
                `;
                leaderboardContent.appendChild(entryDiv);
            });
            
            console.log("Leaderboard updated with", data.leaderboard.length, "entries");
        } catch (error) {
            console.error('Error updating leaderboard:', error);
            
            // Show error message in leaderboard
            const leaderboardContent = document.getElementById('leaderboard-content');
            leaderboardContent.innerHTML = '<p>Error loading leaderboard. Please try again later.</p>';
        }
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
        
        // Add leaderboard toggle functionality
        const leaderboardHeader = document.getElementById('leaderboard-header');
        const leaderboardContent = document.getElementById('leaderboard-content');
        const toggleButton = document.getElementById('toggle-leaderboard');
        
        leaderboardHeader.addEventListener('click', () => {
            leaderboardContent.classList.toggle('collapsed');
            toggleButton.classList.toggle('collapsed');
        });
    }
    
    updateElementsPanel() {
        const elementsPanel = document.getElementById('elements-panel');
        elementsPanel.innerHTML = '';
        
        // Convert Set to Array and sort by element name
        const sortedElements = Array.from(this.discoveredElements)
            .map(id => ELEMENTS[id])
            .filter(element => element); // Filter out any undefined elements
        
        // Create category groups
        const categories = {
            'particle': { title: 'Particles', elements: [] },
            'radiation': { title: 'Radiation', elements: [] },
            'radioactive': { title: 'Radioactive Elements', elements: [] },
            'isotope': { title: 'Isotopes', elements: [] },
            'other': { title: 'Elements', elements: [] }
        };
        
        // Sort elements into categories
        sortedElements.forEach(element => {
            if (element.category === 'particle') {
                categories.particle.elements.push(element);
            } else if (element.category === 'radiation') {
                categories.radiation.elements.push(element);
            } else if (element.category === 'radioactive') {
                categories.radioactive.elements.push(element);
            } else if (element.category === 'isotope') {
                categories.isotope.elements.push(element);
            } else {
                categories.other.elements.push(element);
            }
        });
        
        // Create a container for each category
        Object.values(categories).forEach(category => {
            if (category.elements.length === 0) return; // Skip empty categories
            
            // Create category container
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'element-category';
            
            // Add category title
            const categoryTitle = document.createElement('h4');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category.title;
            categoryContainer.appendChild(categoryTitle);
            
            // Create elements container
            const elementsContainer = document.createElement('div');
            elementsContainer.className = 'category-elements';
            
            // Sort elements by name within category
            category.elements.sort((a, b) => a.name.localeCompare(b.name));
            
            // Add elements to container
            category.elements.forEach(element => {
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
                elementsContainer.appendChild(elementContainer);
            });
            
            categoryContainer.appendChild(elementsContainer);
            elementsPanel.appendChild(categoryContainer);
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
        elementDiv.title = `${element.name} (${element.category})`;
        
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
        if (!this.gameActive) return;

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
            // This is a newly discovered element
            this.discoveredElements.add(resultElement.id);
            this.newlyDiscoveredElements.add(resultElement.id);
            this.updateElementsPanel();
            
            // Calculate points for this combination
            const points = this.calculateScore(combination);
            this.score += points;
            
            resultDisplay.innerHTML += `
                <p><strong>New element discovered!</strong></p>
                <p>+${points} points!</p>
            `;
            
            // Update leaderboard
            this.updateLeaderboard();
            
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

    // Update scoring system
    calculateScore(combination) {
        // Base points for discovery
        let points = 100;
        
        // Bonus points based on number of elements used
        points += combination.inputs.length * 50;
        
        // Bonus for special categories
        const resultElement = ELEMENTS[combination.output];
        if (resultElement.category === 'radioactive') points += 200;
        if (resultElement.category === 'radiation') points += 150;
        if (resultElement.category === 'isotope') points += 100;
        
        return points;
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, creating game instance");
    const game = new PalchemistGame();
});

console.log("Game script loaded"); 