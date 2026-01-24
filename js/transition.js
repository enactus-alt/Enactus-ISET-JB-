import { gsap } from 'gsap';

export default function initTransitions() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Create transition overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: linear-gradient(135deg, #050505, #0a0a0a);
                    z-index: 99999;
                    transform: scaleY(0);
                    transform-origin: bottom;
                    pointer-events: none;
                `;

                // Add gold line accent
                const line = document.createElement('div');
                line.style.cssText = `
                    position: absolute;
                    top: 50%; left: 0;
                    width: 0; height: 2px;
                    background: linear-gradient(90deg, transparent, #FFC222, transparent);
                    box-shadow: 0 0 30px #FFC222;
                `;
                overlay.appendChild(line);
                document.body.appendChild(overlay);

                const tl = gsap.timeline();

                tl.to(overlay, {
                    scaleY: 1,
                    duration: 0.5,
                    ease: 'power3.inOut',
                    transformOrigin: 'bottom'
                })
                    .to(line, {
                        width: '100%',
                        duration: 0.3,
                        ease: 'power2.out'
                    }, '-=0.2')
                    .add(() => {
                        targetSection.scrollIntoView({ behavior: 'instant' });
                    })
                    .to(line, {
                        opacity: 0,
                        duration: 0.2
                    })
                    .to(overlay, {
                        scaleY: 0,
                        duration: 0.5,
                        ease: 'power3.inOut',
                        transformOrigin: 'top',
                        onComplete: () => {
                            overlay.remove();
                        }
                    });
            }
        });
    });

    console.log('🚀 Transitions initialized');
}
