let canvas = document.getElementById('solarCanvas');
let ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let sun = { x: 200, y: 200, radius: 50, color: 'orange', speed: 0 }; // Added 'speed' property
let earth = { x: 300, y: 200, radius: 20, color: 'blue', angle: 0, orbitRadius: 100 };
let moon = { x: 350, y: 200, radius: 10, color: 'gray', angle: 0, orbitRadius: 50 };
let play = false;
let speed = 0.01; // Speed of orbits
let movementSpeed = 0; // Speed of Sun's horizontal movement

let forwardInterval, backwardInterval; // For continuous forward/backward movement

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Sun and move it horizontally based on speed
    sun.x += movementSpeed; // Move sun (and everything else) horizontally
    if (sun.x + sun.radius > canvas.width) sun.x = canvas.width - sun.radius; // Prevent overflow right
    if (sun.x - sun.radius < 0) sun.x = sun.radius; // Prevent overflow left

    ctx.beginPath();
    ctx.arc(sun.x, sun.y, sun.radius, 0, 2 * Math.PI);
    ctx.fillStyle = sun.color;
    ctx.fill();

    // Update Earth position (Earth orbits around the Sun)
    earth.x = sun.x + earth.orbitRadius * Math.cos(earth.angle);
    earth.y = sun.y + earth.orbitRadius * Math.sin(earth.angle);

    // Draw Earth
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, 2 * Math.PI);
    ctx.fillStyle = earth.color;
    ctx.fill();

    // Update Moon position (Moon orbits around the Earth)
    moon.x = earth.x + moon.orbitRadius * Math.cos(moon.angle);
    moon.y = earth.y + moon.orbitRadius * Math.sin(moon.angle);

    // Draw Moon
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius, 0, 2 * Math.PI);
    ctx.fillStyle = moon.color;
    ctx.fill();

    // Update angles if play is active
    if (play) {
        earth.angle += speed; // Earth spins around the Sun
        moon.angle += speed * 3; // Moon spins faster around the Earth
    }

    // Call the draw function repeatedly for animation
    requestAnimationFrame(draw);
}

// Function to move the Sun to the left (for Forward button)
function moveSunForward() {
    movementSpeed = sun.speed; // Use the slider-defined speed for forward movement
}

// Function to move the Sun to the right (for Backward button)
function moveSunBackward() {
    movementSpeed = -sun.speed; // Use the slider-defined speed for backward movement
}

// Play Button toggle: Starts/stops the movement of Earth and Moon
document.getElementById('playButton').addEventListener('click', () => {
    play = !play; // Toggle play state
});

// Continuous Forward movement when Forward button is kept clicked
document.getElementById('forwardButton').addEventListener('mousedown', () => {
    forwardInterval = setInterval(moveSunForward, 10); // Move forward continuously
});
document.getElementById('forwardButton').addEventListener('mouseup', () => {
    clearInterval(forwardInterval); // Stop moving when button is released
    movementSpeed = 0; // Stop horizontal movement
});

// Continuous Backward movement when Backward button is kept clicked
document.getElementById('backwardButton').addEventListener('mousedown', () => {
    backwardInterval = setInterval(moveSunBackward, 10); // Move backward continuously
});
document.getElementById('backwardButton').addEventListener('mouseup', () => {
    clearInterval(backwardInterval); // Stop moving when button is released
    movementSpeed = 0; // Stop horizontal movement
});

// Speed Slider: Adjusts the movement speed of the Sun (and Earth/Moon system)
document.getElementById('speedSlider').addEventListener('input', (event) => {
    let sliderValue = event.target.value; // Get the slider value (0 to 3)
    sun.speed = sliderValue * 0.1; // Adjust speed scaling factor (0x to 3x)
});

// Start the animation loop
draw();
