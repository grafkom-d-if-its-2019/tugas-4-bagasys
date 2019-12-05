let camera, scene, renderer, cube;

// Init scene
scene = new THREE.Scene();

// Init camera (PerspectiveCamera)
camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Init renderer
renderer = new THREE.WebGLRenderer({ antialias: true });

// Set size (whole window)
renderer.setSize(window.innerWidth, window.innerHeight);

// Render to canvas element
document.body.appendChild(renderer.domElement);
