// 3D setup using Three.js
let scene, camera, renderer, sun, earth, moon, jupiter, earthOrbit, moonOrbit, jupiterOrbit, systemOrbit;
let play = false; // Toggle animation
let speed = 0.01; // Default speed for orbit
let movementSpeed = 0; // Movement speed of Sun for forward/backward

function init() {
    // Create a scene
    scene = new THREE.Scene();

    // Set up a perspective camera
    camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 2000);
    camera.position.set(0, 200, 400); // Adjusted camera position to capture both Earth and Jupiter
    camera.lookAt(0, 0, 0);

    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600);
    document.getElementById('canvasContainer').appendChild(renderer.domElement);

    // Create Sun with Linear Gradient
    let sunGeometry = new THREE.SphereGeometry(50, 32, 32);

    // Custom Shader for Gradient Material
    let sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color1: { type: 'vec3', value: new THREE.Color(0xffff00) }, // Yellow
            color2: { type: 'vec3', value: new THREE.Color(0xffa500) }  // Orange
        },
        vertexShader: `
            varying vec3 vUv; 
            void main() {
                vUv = position; // Pass the vertex position to fragment shader
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec3 vUv;
            void main() {
                // Calculate the gradient factor based on the Y position of the Sun
                float factor = (vUv.y + 50.0) / 100.0;
                gl_FragColor = vec4(mix(color1, color2, factor), 1.0);
            }
        `
    });

    // Create the Sun Mesh with Gradient Material
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create Earth
    let earthGeometry = new THREE.SphereGeometry(20, 32, 32);
    let earthMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // Create Moon
    let moonGeometry = new THREE.SphereGeometry(10, 32, 32);
    let moonMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Create Moon Orbit Group
    moonOrbit = new THREE.Group();
    moonOrbit.position.set(50, 0, 0); // Initial Moon position relative to Earth
    moonOrbit.add(moon); // Add Moon to the orbit group

    // Add Moon Orbit to Earth
    earth.add(moonOrbit);

    // Create Earth Orbit Group (Earth + Moon system)
    earthOrbit = new THREE.Group();
    earthOrbit.position.set(100, 0, 0); // Initial Earth position
    earthOrbit.add(earth); // Add Earth (with Moon orbit) to the Earth orbit group

    // Create System Orbit Group (Earth-Moon system orbiting around the Sun)
    systemOrbit = new THREE.Group();
    systemOrbit.add(earthOrbit); // Add Earth and Moon system to the system orbit

    // Add the System Orbit to the Scene (System orbits the Sun)
    scene.add(systemOrbit);

    // Create Jupiter
    let jupiterGeometry = new THREE.SphereGeometry(21, 21, 21); // Jupiter is larger than Earth
    let jupiterMaterial = new THREE.MeshLambertMaterial({ color: 0xd4a017 }); // Light brown color for Jupiter
    jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

    // Create Jupiter Orbit Group
    jupiterOrbit = new THREE.Group();
    jupiterOrbit.position.set(0, 0, 175); // Initial position for Jupiter (twice Earth's radius, along Z-axis)
    jupiterOrbit.add(jupiter); // Add Jupiter to its orbit group

    // Rotate Jupiter's orbit so it moves in the XZ plane (perpendicular to Earth's orbit)
    jupiterOrbit.rotation.x = Math.PI / 2;

    // Add Jupiter orbit to the scene (Jupiter orbits the Sun)
    scene.add(jupiterOrbit);

    // Create Light (Sunlight)
    let light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 0, 0); // Light is emitted from the Sun
    scene.add(light);

    // Ambient light
    let ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Start the animation loop
    animate();
}

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth and Moon if play is enabled
    if (play) {
        systemOrbit.rotation.y += speed; // Earth-Moon system orbits around the Sun (horizontal orbit)
        earthOrbit.rotation.y += speed * 1.5; // Moon orbits around the Earth
        jupiterOrbit.rotation.z += speed * 0.5; // Jupiter orbits the Sun in the XZ plane (vertical orbit)
    }

    // Move the Sun along with the planets horizontally based on speed
    sun.position.x += movementSpeed;
    systemOrbit.position.x += movementSpeed; // Move Earth and Moon system along with Sun
    jupiterOrbit.position.x += movementSpeed; // Move Jupiter along with Sun

    renderer.render(scene, camera);
}

// Button Controls
document.getElementById('playButton').addEventListener('click', () => {
    play = !play; // Toggle play/pause
});

let forwardInterval, backwardInterval;

// Move Sun forward (right to left) when forward button is pressed
document.getElementById('forwardButton').addEventListener('mousedown', () => {
    forwardInterval = setInterval(() => {
        movementSpeed = -sun.speed; // Move left with speed
    }, 10);
});
document.getElementById('forwardButton').addEventListener('mouseup', () => {
    clearInterval(forwardInterval); // Stop movement
    movementSpeed = 0;
});

// Move Sun backward (left to right) when backward button is pressed
document.getElementById('backwardButton').addEventListener('mousedown', () => {
    backwardInterval = setInterval(() => {
        movementSpeed = sun.speed; // Move right with speed
    }, 10);
});
document.getElementById('backwardButton').addEventListener('mouseup', () => {
    clearInterval(backwardInterval); // Stop movement
    movementSpeed = 0;
});

// Slider to control speed (from 0x to 3x)
document.getElementById('speedSlider').addEventListener('input', (event) => {
    let sliderValue = event.target.value;
    sun.speed = sliderValue * 0.1; // Adjust sun's speed for forward/backward movement
    speed = sliderValue * 0.01; // Adjust rotational speed for Earth, Moon, and Jupiter
});

// Initialize the 3D scene
init();
