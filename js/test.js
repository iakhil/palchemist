import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

console.log("Three.js test starting...");

// Add a simple HTML element to confirm the script is running
const debugElement = document.createElement('div');
debugElement.textContent = 'Three.js is initializing...';
debugElement.style.position = 'absolute';
debugElement.style.top = '10px';
debugElement.style.left = '10px';
debugElement.style.color = 'white';
debugElement.style.zIndex = '1000';
document.body.appendChild(debugElement);

// Set background color to confirm page is loading
document.body.style.backgroundColor = 'blue';

try {
    // Create a simple scene
    const scene = new THREE.Scene();
    console.log("Scene created:", scene);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    console.log("Camera created:", camera);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    console.log("Renderer created:", renderer);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    console.log("Renderer added to DOM");
    
    // Add a simple cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    console.log("Cube added to scene");
    
    camera.position.z = 5;
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
    debugElement.textContent = 'Animation running!';
    console.log("Animation started");
} catch (error) {
    console.error("Error in Three.js setup:", error);
    debugElement.textContent = 'Error: ' + error.message;
} 