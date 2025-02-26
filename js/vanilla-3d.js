// 3D visualization for Palchemist
class ElementVisualizer {
    constructor() {
        // Initialize Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x121218);
        
        // Set up camera
        this.camera = new THREE.PerspectiveCamera(
            60, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 15;
        
        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(
            document.getElementById('scene-container').clientWidth,
            document.getElementById('scene-container').clientHeight
        );
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Add orbital controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        
        // Track active meshes
        this.meshes = [];
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        console.log("3D visualizer initialized");
    }
    
    // Relative atomic sizes based on atomic radii (in picometers)
    // Scaled for visualization purposes
    getAtomicRadius(elementId) {
        const scaleMultiplier = 1.0;
        const atomicRadii = {
            hydrogen: 0.5,
            helium: 0.3,
            lithium: 1.2,
            beryllium: 0.9,
            boron: 0.8,
            carbon: 0.7,
            nitrogen: 0.65,
            oxygen: 0.6,
            fluorine: 0.5,
            neon: 0.4,
            sodium: 1.8,
            chlorine: 1.0,
            proton: 0.2,
            electron: 0.1,
            neutron: 0.2,
            'hydrogen-gas': 0.8,
            'helium-3': 0.35,
            deuterium: 0.5,
            water: 0.9,
            'oxygen-gas': 0.9,
            'nitrogen-gas': 0.9,
            'carbon-dioxide': 1.0,
            methane: 1.1,
            ammonia: 1.0,
            salt: 1.2,
            'hydrogen-fluoride': 0.7,
            'lithium-hydride': 1.0,
            'beryllium-hydride': 1.1
        };
        
        return (atomicRadii[elementId] || 0.7) * scaleMultiplier;
    }
    
    getCompoundGeometry(elementId) {
        // Create special geometries for compounds
        switch(elementId) {
            case 'water':
                const waterGroup = new THREE.Group();
                
                // Oxygen
                const oGeometry = new THREE.SphereGeometry(0.6, 32, 32);
                const oMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0D0D, metalness: 0.3, roughness: 0.4 });
                const oxygen = new THREE.Mesh(oGeometry, oMaterial);
                
                // Hydrogens
                const hGeometry = new THREE.SphereGeometry(0.3, 32, 32);
                const hMaterial = new THREE.MeshStandardMaterial({ color: 0x88FF88, metalness: 0.3, roughness: 0.4 });
                
                const h1 = new THREE.Mesh(hGeometry, hMaterial);
                h1.position.set(-0.5, 0.4, 0);
                
                const h2 = new THREE.Mesh(hGeometry, hMaterial);
                h2.position.set(0.5, 0.4, 0);
                
                waterGroup.add(oxygen);
                waterGroup.add(h1);
                waterGroup.add(h2);
                
                return waterGroup;
                
            case 'carbon-dioxide':
                const co2Group = new THREE.Group();
                
                // Carbon
                const cGeometry = new THREE.SphereGeometry(0.6, 32, 32);
                const cMaterial = new THREE.MeshStandardMaterial({ color: 0x909090, metalness: 0.3, roughness: 0.4 });
                const carbon = new THREE.Mesh(cGeometry, cMaterial);
                
                // Oxygens
                const o2Geometry = new THREE.SphereGeometry(0.5, 32, 32);
                const o2Material = new THREE.MeshStandardMaterial({ color: 0xFF0D0D, metalness: 0.3, roughness: 0.4 });
                
                const o1 = new THREE.Mesh(o2Geometry, o2Material);
                o1.position.set(-1, 0, 0);
                
                const o2 = new THREE.Mesh(o2Geometry, o2Material);
                o2.position.set(1, 0, 0);
                
                co2Group.add(carbon);
                co2Group.add(o1);
                co2Group.add(o2);
                
                return co2Group;
                
            case 'methane':
                const methaneGroup = new THREE.Group();
                
                // Carbon
                const cmGeometry = new THREE.SphereGeometry(0.6, 32, 32);
                const cmMaterial = new THREE.MeshStandardMaterial({ color: 0x909090, metalness: 0.3, roughness: 0.4 });
                const carbonM = new THREE.Mesh(cmGeometry, cmMaterial);
                
                // Hydrogens in tetrahedral arrangement
                const hmGeometry = new THREE.SphereGeometry(0.3, 32, 32);
                const hmMaterial = new THREE.MeshStandardMaterial({ color: 0x88FF88, metalness: 0.3, roughness: 0.4 });
                
                const tetrahedralPositions = [
                    new THREE.Vector3(0.6, 0.6, 0.6),
                    new THREE.Vector3(-0.6, 0.6, -0.6),
                    new THREE.Vector3(0.6, -0.6, -0.6),
                    new THREE.Vector3(-0.6, -0.6, 0.6)
                ];
                
                tetrahedralPositions.forEach(pos => {
                    const h = new THREE.Mesh(hmGeometry, hmMaterial);
                    h.position.copy(pos);
                    methaneGroup.add(h);
                });
                
                methaneGroup.add(carbonM);
                
                return methaneGroup;
                
            default:
                return null;
        }
    }
    
    createElementMesh(element) {
        let mesh;
        const color = element.color;
        
        // Check if it's a compound that needs special geometry
        const compoundGeometry = this.getCompoundGeometry(element.id);
        
        if (compoundGeometry) {
            mesh = compoundGeometry;
        } else {
            // Create a regular sphere for simple elements
            const radius = this.getAtomicRadius(element.id);
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: color,
                metalness: 0.3,
                roughness: 0.4
            });
            
            mesh = new THREE.Mesh(geometry, material);
            
            // Add element symbol as text for single atoms
            if (element.category !== 'compound') {
                // We'll skip adding 3D text for simplicity, but could add it here
            }
        }
        
        return mesh;
    }
    
    displayElements(elements) {
        // Clear previous elements
        this.clearScene();
        
        // Position elements in a row
        const spacing = 3;
        const startX = -((elements.length - 1) * spacing) / 2;
        
        elements.forEach((elementId, index) => {
            const element = ELEMENTS[elementId];
            if (!element) return;
            
            const mesh = this.createElementMesh(element);
            mesh.position.x = startX + index * spacing;
            
            this.scene.add(mesh);
            this.meshes.push(mesh);
        });
    }
    
    displayResult(resultElement) {
        // Clear the scene
        this.clearScene();
        
        // Show the result element prominently
        const mesh = this.createElementMesh(resultElement);
        mesh.scale.set(1.5, 1.5, 1.5);
        
        // Add some rotation animation
        mesh.userData.rotate = true;
        
        this.scene.add(mesh);
        this.meshes.push(mesh);
    }
    
    clearScene() {
        // Remove all meshes
        for (const mesh of this.meshes) {
            this.scene.remove(mesh);
        }
        this.meshes = [];
    }
    
    onWindowResize() {
        const container = document.getElementById('scene-container');
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update controls
        this.controls.update();
        
        // Rotate elements with rotate flag
        for (const mesh of this.meshes) {
            if (mesh.userData.rotate) {
                mesh.rotation.y += 0.01;
                mesh.rotation.x += 0.005;
            }
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Create global instance
const elementVisualizer = new ElementVisualizer(); 