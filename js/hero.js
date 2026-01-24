import * as THREE from 'three';

export default function initHero() {
    const container = document.getElementById('globe-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create a dramatic wireframe globe
    const globeGeometry = new THREE.IcosahedronGeometry(15, 3);
    const globeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFC222,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Inner glowing sphere
    const innerGeometry = new THREE.SphereGeometry(14, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFC222,
        transparent: true,
        opacity: 0.05
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerSphere);

    // ═══════════════════════════════════════════════════════════
    // LOGO FLOATING INSIDE THE GLOBE - WITH ERROR HANDLING
    // ═══════════════════════════════════════════════════════════
    const textureLoader = new THREE.TextureLoader();

    // Load texture with error handling
    textureLoader.load(
        'assets/img/logo.png',
        // Success callback
        (texture) => {
            const logoSize = 8;
            const logoGeometry = new THREE.CircleGeometry(logoSize / 2, 64);
            const logoMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });

            const logo = new THREE.Mesh(logoGeometry, logoMaterial);
            logo.position.set(0, 0, 0);
            scene.add(logo);

            // Swimming animation for logo
            logo.userData.animate = () => {
                const time = Date.now() * 0.001;
                logo.position.x = Math.sin(time * 0.5) * 3;
                logo.position.y = Math.sin(time * 0.7) * 2;
                logo.position.z = Math.cos(time * 0.3) * 3;
                logo.rotation.y = Math.sin(time * 0.2) * 0.3;
                logo.rotation.x = Math.cos(time * 0.3) * 0.2;
            };

            window.logoMesh = logo;
            console.log('✅ Logo texture loaded successfully');
        },
        // Progress callback
        undefined,
        // Error callback - FALLBACK
        (error) => {
            console.warn('⚠️ Logo texture failed to load, using fallback:', error);

            // Create a fallback golden circle with "E" text
            const fallbackGeometry = new THREE.CircleGeometry(4, 64);
            const fallbackMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFC222,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });

            const fallbackLogo = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
            fallbackLogo.position.set(0, 0, 0);
            scene.add(fallbackLogo);

            // Swimming animation
            fallbackLogo.userData.animate = () => {
                const time = Date.now() * 0.001;
                fallbackLogo.position.x = Math.sin(time * 0.5) * 3;
                fallbackLogo.position.y = Math.sin(time * 0.7) * 2;
                fallbackLogo.position.z = Math.cos(time * 0.3) * 3;
                fallbackLogo.rotation.y = Math.sin(time * 0.2) * 0.3;
            };

            window.logoMesh = fallbackLogo;
        }
    );

    // Outer rings
    const ring1Geometry = new THREE.RingGeometry(18, 18.2, 64);
    const ring1Material = new THREE.MeshBasicMaterial({
        color: 0xFFC222,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
        new THREE.RingGeometry(22, 22.1, 64),
        new THREE.MeshBasicMaterial({
            color: 0xFFC222,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        })
    );
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // Particle points around globe
    const dotsCount = 500;
    const dotsGeometry = new THREE.BufferGeometry();
    const dotsPositions = new Float32Array(dotsCount * 3);

    for (let i = 0; i < dotsCount; i++) {
        const radius = 16 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        dotsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        dotsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        dotsPositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    dotsGeometry.setAttribute('position', new THREE.BufferAttribute(dotsPositions, 3));

    const dotsMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xFFC222,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const dots = new THREE.Points(dotsGeometry, dotsMaterial);
    scene.add(dots);

    camera.position.z = 40;

    // Mouse tracking for interactive rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Smooth mouse following
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Rotate elements
        globe.rotation.y = elapsed * 0.1 + targetX * 0.5;
        globe.rotation.x = targetY * 0.3;

        innerSphere.rotation.y = elapsed * 0.05;

        ring1.rotation.z = elapsed * 0.2;
        ring2.rotation.z = -elapsed * 0.15;

        dots.rotation.y = elapsed * 0.08 + targetX * 0.3;
        dots.rotation.x = targetY * 0.2;

        // Animate logo swimming
        if (window.logoMesh && window.logoMesh.userData.animate) {
            window.logoMesh.userData.animate();
        }

        // Breathing effect
        const breathe = Math.sin(elapsed * 0.5) * 0.1 + 1;
        globe.scale.set(breathe, breathe, breathe);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log('🌍 Hero globe initialized with error handling');
}
