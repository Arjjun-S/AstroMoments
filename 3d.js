import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

// === Scene ===
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
loader.load('images/sky_background.jpg', texture => {
  scene.background = texture;
});

// === Camera ===
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 0, 50);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Lights ===
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.6);
scene.add(hemiLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 2000);
sunLight.castShadow = true;
scene.add(sunLight);

// === Sun ===
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(30, 32, 32),
  new THREE.MeshBasicMaterial({
    map: loader.load('images/sun.jpg'),
    emissive: 0xffff00,
    emissiveIntensity: 1
  })
);
scene.add(sun);

// === Planets Data ===
const realPlanetsData = [
  { name: 'Mercury', texture: 'images/mercury.jpg', size: 5, distance: 50, speed: 0.02 },
  { name: 'Venus', texture: 'images/venus.jpg', size: 10, distance: 80, speed: 0.015 },
  { name: 'Earth', texture: 'images/earth.jpg', size: 10, distance: 110, speed: 0.01 },
  { name: 'Mars', texture: 'images/mars.jpg', size: 8, distance: 140, speed: 0.008 },
  { name: 'Jupiter', texture: 'images/jupiter.jpg', size: 25, distance: 200, speed: 0.005 },
  { name: 'Saturn', texture: 'images/saturn.jpg', size: 20, distance: 260, speed: 0.003 },
  { name: 'Uranus', texture: 'images/uranus.jpg', size: 15, distance: 310, speed: 0.002 },
  { name: 'Neptune', texture: 'images/neptune.jpg', size: 15, distance: 350, speed: 0.0015 },
];

// === Fictional Planets ===
const fictionalPlanetsData = [
  { name: 'Ceres', texture: 'images/ceres.jpg', size: 6, distance: 180, speed: 0.006 },
  { name: 'Makemake', texture: 'images/makemake.jpg', size: 7, distance: 390, speed: 0.001 },
  { name: 'Eris', texture: 'images/eris.jpg', size: 8, distance: 420, speed: 0.0008 },
  { name: 'Earth-night', texture: 'images/earth_night.jpg', size: 10, distance: 110, speed: 0.01 },
];

// === Planets Creation ===
const planets = [];

function createPlanet(data, isFictional = false) {
  loader.load(data.texture, texture => {
    let geometry = new THREE.SphereGeometry(data.size, 32, 32);

    // Oval shape for Haumea
    if (data.name === 'Haumea') {
      geometry = new THREE.SphereGeometry(data.size, 32, 32);
      geometry.scale(1.2, 0.8, 1);
    }

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.3,
      roughness: 0.7,
      emissive: ['Moon', 'Earth-night'].includes(data.name) ? new THREE.Color(0x444444) : 0x000000,
      emissiveIntensity: ['Moon', 'Earth-night'].includes(data.name) ? 0.5 : 0
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Orbit
    if (!isFictional || data.name === 'Earth-night') {
      const orbit = new THREE.RingGeometry(data.distance - 0.5, data.distance + 0.5, 64);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const orbitMesh = new THREE.Mesh(orbit, orbitMat);
      orbitMesh.rotation.x = Math.PI / 2;
      scene.add(orbitMesh);
      data.orbitMesh = orbitMesh;
    }

    // Saturn's ring
    if (data.name === 'Saturn') {
      const ringGeo = new THREE.RingGeometry(data.size + 5, data.size + 12, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        map: loader.load('images/saturn_ring.png'),
        side: THREE.DoubleSide,
        transparent: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      mesh.add(ring);
    }

    // Haumea's ring
    if (data.name === 'Haumea') {
  const ringGeo = new THREE.RingGeometry(data.size + 2, data.size + 5, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    map: loader.load('images/haumea_ring.png'),
    side: THREE.DoubleSide,
    transparent: true
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  mesh.add(ring);
}

    data.mesh = mesh;
    data.angle = 0;

    planets.push(data);
  });
}

// Add real planets for "All"
realPlanetsData.forEach(data => createPlanet(data));

// Add fictional planets for single focus only
const haumeaData = { name: 'Haumea', texture: 'images/haumea.jpg', size: 9, distance: 370, speed: 0.001 };
createPlanet(haumeaData, true);
fictionalPlanetsData.forEach(data => createPlanet(data, true));

// === Moon ===
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({
    map: loader.load('images/moon.jpg'),
    metalness: 0.3,
    roughness: 0.7,
    emissive: new THREE.Color(0x555555),
    emissiveIntensity: 0.5
  })
);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

// === Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Focus logic ===
window.focusOn = function (name) {
  hemiLight.intensity = 1;
  sunLight.intensity = 0;
  sunLight.position.set(0, 0, 0);

  sun.visible = false;
  moon.visible = false;

  planets.forEach(p => {
    if (p.mesh) p.mesh.visible = false;
    if (p.orbitMesh) p.orbitMesh.visible = false;
  });

  if (name === 'Moon') {
    moon.visible = true;
    moon.position.set(0, 0, 0);
    camera.position.set(0, 0, 30);
  } else if (name === 'Sun') {
    sun.visible = true;
    camera.position.set(0, 0, 80);
  } else if (name === 'All') {
    hemiLight.intensity = 0.6;
    sunLight.intensity = 2;
    sun.visible = true;

    planets.forEach(p => {
      const isFictional = ['Ceres', 'Haumea', 'Makemake', 'Eris', 'Earth-night'].includes(p.name);
      if (!isFictional) {
        if (p.mesh) p.mesh.visible = true;
        if (p.orbitMesh) p.orbitMesh.visible = true;
      }
    });

    moon.visible = true;
    camera.position.set(0, 200, 500);
  } else {
    const planet = planets.find(p => p.name === name);
    if (planet && planet.mesh) {
      planet.mesh.visible = true;
      planet.mesh.position.set(0, 0, 0);
    }
    camera.position.set(0, 0, 50);
  }
};

// === Animation ===
function animate() {
  requestAnimationFrame(animate);

  planets.forEach(p => {
    if (p.mesh && p.name !== 'Haumea') {
      p.angle += p.speed;
      if (sunLight.intensity > 0 && p.distance) {
        p.mesh.position.x = Math.cos(p.angle) * p.distance;
        p.mesh.position.z = Math.sin(p.angle) * p.distance;
      }
      p.mesh.rotation.y += 0.01;
    }
  });

  sun.rotation.y += 0.005;

  const earth = planets.find(p => p.name === 'Earth');
  if (earth && earth.mesh && sunLight.intensity > 0) {
    const moonAngle = Date.now() * 0.001;
    moon.position.x = earth.mesh.position.x + Math.cos(moonAngle) * 15;
    moon.position.z = earth.mesh.position.z + Math.sin(moonAngle) * 15;
  }
  moon.rotation.y += 0.02;

  controls.update();
  renderer.render(scene, camera);
}

// === Start ===
focusOn('Earth');
animate();
