import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function initProjects() {
    // ═══════════════════════════════════════════════════════════
    // PARALLAX SCROLL EFFECT
    // ═══════════════════════════════════════════════════════════
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach(item => {
        const slider = item.querySelector('.ba-slider');
        const info = item.querySelector('.project-info');

        if (slider) {
            gsap.to(slider, {
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        }

        if (info) {
            gsap.to(info, {
                y: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: item,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        }
    });

    // ═══════════════════════════════════════════════════════════
    // BEFORE/AFTER SLIDER - ENHANCED
    // ═══════════════════════════════════════════════════════════
    const sliders = document.querySelectorAll('.ba-slider');

    sliders.forEach(slider => {
        const handle = slider.querySelector('.ba-handle');
        const beforeImg = slider.querySelector('.ba-before');

        if (!handle || !beforeImg) return;

        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let percent = ((x - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));

            gsap.to(beforeImg, {
                clipPath: `inset(0 ${100 - percent}% 0 0)`,
                duration: 0.1,
                ease: 'power2.out'
            });

            gsap.to(handle, {
                left: `${percent}%`,
                duration: 0.1,
                ease: 'power2.out'
            });
        };

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateSlider(e.clientX);
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch support
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        });

        window.addEventListener('touchmove', (e) => {
            if (isDragging) {
                updateSlider(e.touches[0].clientX);
            }
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Hover effect on handle
        slider.addEventListener('mouseenter', () => {
            gsap.to(handle, {
                scale: 1.1,
                duration: 0.3
            });
        });

        slider.addEventListener('mouseleave', () => {
            gsap.to(handle, {
                scale: 1,
                duration: 0.3
            });
        });
    });

    // ═══════════════════════════════════════════════════════════
    // ENTRY ANIMATION
    // ═══════════════════════════════════════════════════════════
    projectItems.forEach((item, index) => {
        gsap.fromTo(item,
            {
                x: index % 2 === 0 ? -100 : 100,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ═══════════════════════════════════════════════════════════
    // 3D TILT HOLOGRAPHIC EFFECT
    // ═══════════════════════════════════════════════════════════
    projectItems.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                transformPerspective: 1000,
                rotationX: rotateX,
                rotationY: rotateY,
                scale: 1.02,
                duration: 0.4,
                ease: 'power2.out'
            });

            // Shine effect
            // We can assume a .shine element exists or add it dynamically if we want advanced effects
            // For now, simpler tilt is sufficient for "Holographic" feel combined with CSS border glow
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.7,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    console.log('📊 Projects section initialized with 3D Tilt');
}
