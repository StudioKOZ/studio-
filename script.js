const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.8;
        
        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;
        this.size = Math.random() * 0.8 + 0.2; // Reduced particle size
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        
        // Create varying shades of orange and black
        const colorChoice = Math.random();
        if (colorChoice < 0.6) {
            // Orange shades
            const r = Math.floor(Math.random() * 55) + 200; // 200-255
            const g = Math.floor(Math.random() * 70) + 69;  // 69-139
            const b = 0;
            const alpha = Math.random() * 0.5 + 0.3;
            this.color = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
            // Dark/Black shades
            const shade = Math.floor(Math.random() * 30);
            this.color = `rgba(${shade}, ${shade}, ${shade}, ${Math.random() * 0.4 + 0.1})`;
        }
    }

    update(mouseX, mouseY) {
        // Move towards center
        const dx = canvas.width / 2 - this.x;
        const dy = canvas.height / 2 - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If mouse is near, particles are attracted to cursor
        if (mouseX && mouseY) {
            const mouseDx = mouseX - this.x;
            const mouseDy = mouseY - this.y;
            const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            
            if (mouseDistance < 100) {
                this.x += mouseDx * 0.05;
                this.y += mouseDy * 0.05;
                return;
            }
        }

        if (distance < 100) {
            this.reset();
        } else {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Increase number of particles for better effect
// Increase number of particles to 15000
const particles = Array(15000).fill().map(() => new Particle());

// Mouse tracking
let mouseX = null;
let mouseY = null;
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
canvas.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
});

// Animation loop
function animate() {
    // Create background gradient that matches the reference
    const bgGradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width * 0.6
    );
    bgGradient.addColorStop(0, 'rgb(255, 102, 0)');      // Bright orange center
    bgGradient.addColorStop(0.1, 'rgb(180, 71, 0)');     // Darker orange
    bgGradient.addColorStop(0.3, 'rgb(80, 30, 0)');      // Very dark orange
    bgGradient.addColorStop(0.6, 'rgb(20, 10, 0)');      // Nearly black
    bgGradient.addColorStop(1, 'rgb(0, 0, 0)');          // Pure black

    // Fill background
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add slight fade effect for particle trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate();