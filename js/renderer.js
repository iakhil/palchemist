// Import Three.js and OrbitControls using ES modules
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// With this single import
import { THREE, OrbitControls } from './module.js';

// Handle Three.js rendering and 3D objects
class GameRenderer {
    constructor() {
        console.log("Creating renderer...");
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x121212); // Dark background
        
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
        
        const sceneContainer = document.getElementById('scene-container');
        if (!sceneContainer) {
            console.error("Scene container not found!");
            return;
        }
        
        sceneContainer.appendChild(this.renderer.domElement);
        console.log("Renderer added to DOM");
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Set up camera position
        this.camera.position.z = 5;
        
        // Use the imported OrbitControls class
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // Store references to element meshes
        this.elementMeshes = {};
        
        // Start the render loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        console.log("GameRenderer initialization complete");
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
    }
    
    createElementMesh(element) {
        let geometry, material;
        
        // Create geometry based on element type
        switch(element.model) {
            case 'sphere':
            default:
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
        }
        
        // Create material with element color
        material = new THREE.MeshStandardMaterial({
            color: element.color,
            metalness: 0.3,
            roughness: 0.4,
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        this.elementMeshes[element.id] = mesh;
        
        return mesh;
    }
    
    displayElement(element, position) {
        const mesh = this.createElementMesh(element);
        mesh.position.set(position.x, position.y, position.z);
        this.scene.add(mesh);
        return mesh;
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update any animations or physics here
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    clearScene() {
        // Remove all element meshes from the scene
        for (const id in this.elementMeshes) {
            this.scene.remove(this.elementMeshes[id]);
        }
        this.elementMeshes = {};
    }
}

// Export the class so it can be imported elsewhere
export { GameRenderer }; 