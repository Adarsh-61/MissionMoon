import * as THREE from 'three';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const starLight = new THREE.PointLight(0xffaa00, 2, 50); // Simulating a sun
starLight.position.set(0, 0, 0);
scene.add(starLight);


// --- Starfield ---
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;
const posArray = new Float32Array(starsCount * 3);

for(let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100; // Spread stars
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffffff,
});

const starMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starMesh);


// --- Planets ---
const planets = [];
const planetData = {}; // Store data for UI

function createPlanet(size, color, position, name, description) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(position.x, position.y, position.z);

    // Add a glowing aura (simple sprite)
    // For simplicity, we skip complex shaders for now

    scene.add(planet);
    planets.push(planet);

    planetData[planet.uuid] = { name, description };

    return planet;
}

// Sun (Center)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
// Add a point light at the sun
const sunLight = new THREE.PointLight(0xffaa00, 5, 100);
sun.add(sunLight);


// Procedural Planets
createPlanet(0.5, 0x00ffcc, {x: 5, y: 0, z: 0}, "Cyanos", "A frozen world composed of methane ice.");
createPlanet(0.8, 0xff0000, {x: -8, y: 2, z: -5}, "Rubicon", "A volcanic wasteland with active magma flows.");
createPlanet(1.2, 0x0000ff, {x: 10, y: -3, z: 5}, "Aquara", "A water world with deep oceans and massive storms.");
createPlanet(0.4, 0xaaaaaa, {x: -4, y: 4, z: 3}, "Luna Prime", "A rocky moon rich in rare minerals.");


// --- Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        const data = planetData[object.uuid];
        if (data) {
            showPlanetData(data);
        }
    }
});

// UI Logic
const uiPlanetData = document.getElementById('planet-data');
const uiName = document.getElementById('planet-name');
const uiDesc = document.getElementById('planet-desc');
const closeBtn = document.getElementById('close-data');

function showPlanetData(data) {
    uiName.textContent = data.name;
    uiDesc.textContent = data.description;
    uiPlanetData.classList.remove('hidden');
}

closeBtn.addEventListener('click', () => {
    uiPlanetData.classList.add('hidden');
});


// --- Animation Loop ---
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // Rotate stars slowly
    starMesh.rotation.y += 0.0002;

    // Rotate planets and orbit sun
    planets.forEach((planet, index) => {
        planet.rotation.y += 0.01;

        // Simple orbit logic based on initial position index
        const distance = 5 + index * 3;
        const speed = 0.5 / (index + 1);
        const angle = time * speed + (index * 2); // Offset starting angle

        planet.position.x = Math.cos(angle) * distance;
        planet.position.z = Math.sin(angle) * distance;
    });

    // Pulse the sun
    const scale = 1 + Math.sin(time * 2) * 0.05;
    sun.scale.set(scale, scale, scale);

    // Camera movement (slight sway based on mouse)
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// Remove loading screen and show UI
const loadingScreen = document.getElementById('loading-screen');
const uiContainer = document.getElementById('ui-container');

if (loadingScreen) {
    loadingScreen.style.display = 'none';
}
if (uiContainer) {
    uiContainer.classList.remove('hidden');
}
