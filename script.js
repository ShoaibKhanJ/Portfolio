// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Check for saved theme preference or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update canvas color variables smoothly based on theme
    particleColor = newTheme === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(124, 58, 237, 0.3)';
    lineColor = newTheme === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(124, 58, 237, 0.1)';
});

// Sticky Navbar with Blur Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animations using Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
revealElements.forEach(el => revealObserver.observe(el));


// Custom Cursor Glow Tracking
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
    // Request animation frame for smooth tracking
    requestAnimationFrame(() => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });
});


// Animated Canvas Background (Premium Particle/Wave Effect mimicking the vibe)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let particleColor = root.getAttribute('data-theme') === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(124, 58, 237, 0.3)';
let lineColor = root.getAttribute('data-theme') === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(124, 58, 237, 0.1)';

function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Adjust particle count based on screen size for performance
    const particleCount = Math.floor((width * height) / 15000);
    particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            phase: Math.random() * Math.PI * 2 // For wave motion
        });
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Mouse interaction variables
    const mouseX = parseFloat(cursorGlow.style.left) || width / 2;
    const mouseY = parseFloat(cursorGlow.style.top) || height / 2;

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // Add subtle wave motion
        p.y += Math.sin(p.phase) * 0.3;
        p.phase += 0.02;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1 - (distance / 120);
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
        
        // Interactive connection to mouse
        let dxMouse = p.x - mouseX;
        let dyMouse = p.y - mouseY;
        let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < 150) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1 - (distMouse / 150);
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
            
            // Subtle repel effect
            p.x += dxMouse * 0.01;
            p.y += dyMouse * 0.01;
        }
    }
    requestAnimationFrame(animateCanvas);
}

// Initialize and handle resize
window.addEventListener('resize', initCanvas);
initCanvas();
animateCanvas();