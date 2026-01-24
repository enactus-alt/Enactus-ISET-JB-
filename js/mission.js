import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function initMission() {
    const cards = document.querySelectorAll('.mission-card');

    if (cards.length === 0) return;

    // ═══════════════════════════════════════════════════════════
    // SCROLL-TRIGGERED FLY-IN ANIMATION
    // ═══════════════════════════════════════════════════════════
    cards.forEach((card, index) => {
        // Different entry directions
        const directions = [
            { x: -100, y: 50, rotation: -5 },
            { x: 0, y: 100, rotation: 0 },
            { x: 100, y: 50, rotation: 5 }
        ];
        const dir = directions[index % 3];

        gsap.fromTo(card,
            {
                x: dir.x,
                y: dir.y,
                opacity: 0,
                rotation: dir.rotation,
                scale: 0.8
            },
            {
                x: 0,
                y: 0,
                opacity: 1,
                rotation: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ═══════════════════════════════════════════════════════════
    // 3D TILT EFFECT ON HOVER
    // ═══════════════════════════════════════════════════════════
    cards.forEach(card => {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        glare.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(255,194,34,0.15), transparent 60%);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 1;
        `;
        card.style.position = 'relative';
        card.appendChild(glare);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            // Move glare with mouse
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,194,34,0.2), transparent 50%)`;
            glare.style.opacity = '1';

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.05,
                boxShadow: '0 35px 70px rgba(0,0,0,0.4), 0 0 40px rgba(255,194,34,0.2)',
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            glare.style.opacity = '0';

            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 0 50px rgba(255,194,34,0.02)',
                duration: 0.6,
                ease: 'power3.out'
            });
        });
    });

    console.log('📦 Mission cards initialized with 3D tilt');
}
