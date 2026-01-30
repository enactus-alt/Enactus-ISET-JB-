import * as THREE from 'three';

export default function initHero() {
    const container = document.getElementById('globe-container');
    if (!container) return;

    // Mobile detection for performance optimization
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile, // Disable antialiasing on mobile
        powerPreference: isMobile ? 'low-power' : 'high-performance',
        preserveDrawingBuffer: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Ensure transparent background
    container.appendChild(renderer.domElement);

    // ═══════════════════════════════════════════════════════════
    // DIGITAL BIOSPHERE - COMPLEX GEOMETRY
    // ═══════════════════════════════════════════════════════════

    // 1. Core Glowing Sphere
    const coreGeometry = new THREE.IcosahedronGeometry(10, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFC222,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreSphere);

    // 2. The Tech Shell (Voronoi-like effect)
    const shellGeometry = new THREE.IcosahedronGeometry(15, 1);
    const shellMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFD666,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    scene.add(shell);

    // 3. Floating Data Particles (Orbiting)
    const particlesCount = 200;
    const particlesGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particlesCount);
        const theta = Math.sqrt(particlesCount * Math.PI) * phi;

        const r = 18 + Math.random() * 5;
        particlePositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        particlePositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }

    particlesGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
        color: 0xFFC222,
        size: 0.15,
        transparent: true,
        opacity: 0.6
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particleSystem);

    // 4. Orbital Rings (The "Saturn" effect)
    const ringGeo = new THREE.TorusGeometry(22, 0.1, 2, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFC222, transparent: true, opacity: 0.2 });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2;
    orbitRing.rotation.y = -Math.PI / 8;
    scene.add(orbitRing);

    const ringGeo2 = new THREE.TorusGeometry(26, 0.05, 2, 100);
    const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat);
    orbitRing2.rotation.x = Math.PI / 1.8;
    orbitRing2.rotation.y = Math.PI / 6;
    scene.add(orbitRing2);

    // ═══════════════════════════════════════════════════════════
    // LOGO FLOATING INSIDE THE GLOBE
    // ═══════════════════════════════════════════════════════════
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
        'assets/img/logo.png',
        (texture) => {
            // Add slight glow filter to texture
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            const logoSize = 6;
            const logoGeometry = new THREE.PlaneGeometry(logoSize, logoSize); // Plane matches image better
            const logoMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide,
                depthTest: false // Always visible inside
            });

            const logo = new THREE.Mesh(logoGeometry, logoMaterial);
            logo.renderOrder = 1; // Force render on top of inner wires
            scene.add(logo);

            // Floating Animation
            logo.userData.animate = (time) => {
                logo.position.y = Math.sin(time * 1.5) * 0.5;
                logo.rotation.y = Math.sin(time * 0.5) * 0.1;
            };

            window.logoMesh = logo;
        }
    );

    camera.position.z = 35;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Animate
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Rotate Group
        coreSphere.rotation.y += 0.005;
        coreSphere.rotation.x += 0.002;

        shell.rotation.y -= 0.003;
        shell.rotation.x -= 0.001;

        particleSystem.rotation.y += 0.002;

        // Interactive tilt
        scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
        scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

        // Animate Rings
        orbitRing.rotation.z += 0.002;
        orbitRing2.rotation.z -= 0.003;

        // Logo Animation
        if (window.logoMesh && window.logoMesh.userData.animate) {
            window.logoMesh.userData.animate(time);
        }

        // Pulse Effect
        const scale = 1 + Math.sin(time * 1.5) * 0.03;
        coreSphere.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    console.log(`🌍 Digital Biosphere Initialized (${isMobile ? 'mobile' : 'desktop'} mode)`);
}
