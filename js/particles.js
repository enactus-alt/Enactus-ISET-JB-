import * as THREE from 'three';

export default function initParticles() {
    // Detect mobile for performance optimization
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Create canvas for background particles
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-bg';
    canvas.setAttribute('aria-hidden', 'true'); // Accessibility: decorative element
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile // Disable antialiasing on mobile for performance
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));

    // REDUCED particles on mobile for performance
    const particlesCount = isMobile ? 500 : 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    const goldColor = new THREE.Color(0xFFC222);
    const whiteColor = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < particlesCount; i++) {
        // Spread particles in a large sphere
        const radius = 50 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Mix of gold and white particles
        const mixColor = Math.random() > 0.3 ? goldColor : whiteColor;
        colors[i * 3] = mixColor.r;
        colors[i * 3 + 1] = mixColor.g;
        colors[i * 3 + 2] = mixColor.b;

        // Random sizes
        sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for glowing particles
    const material = new THREE.PointsMaterial({
        size: isMobile ? 3 : 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add some larger "star" particles (fewer on mobile)
    const starsCount = isMobile ? 30 : 100;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
        starsPositions[i * 3] = (Math.random() - 0.5) * 200;
        starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 4,
        color: 0xFFC222,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 80;

    // Mouse tracking (disabled on mobile for performance)
    let mouseX = 0;
    let mouseY = 0;

    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
    }

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Slow rotation
        particles.rotation.y = elapsed * 0.05;
        particles.rotation.x = elapsed * 0.02;

        stars.rotation.y = -elapsed * 0.03;
        stars.rotation.x = elapsed * 0.01;

        // Mouse influence (desktop only)
        if (!isMobile) {
            particles.rotation.y += mouseX * 0.0005;
            particles.rotation.x += mouseY * 0.0005;
        }

        // Gentle breathing
        particles.position.y = Math.sin(elapsed * 0.3) * 2;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log(`✨ Particles initialized: ${particlesCount} particles (${isMobile ? 'mobile' : 'desktop'} mode)`);
}
