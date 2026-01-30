import { gsap } from 'gsap';

export default function initTeam() {
    const container = document.getElementById('team-container');
    const avatars = document.querySelectorAll('.team-avatar');

    if (!container || avatars.length === 0) return;

    // ═══════════════════════════════════════════════════════════
    // CONNECTING LINES (CONSTELLATION EFFECT)
    // ═══════════════════════════════════════════════════════════
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
    container.insertBefore(svg, container.firstChild);

    // Create lines pool to reuse elements
    const linesPool = [];
    const maxLines = 50;
    for (let i = 0; i < maxLines; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.style.opacity = '0';
        svg.appendChild(line);
        linesPool.push(line);
    }

    function animateConnections() {
        requestAnimationFrame(animateConnections);

        const positions = [];
        const containerRect = container.getBoundingClientRect();

        // Get current positions (updated by GSAP)
        avatars.forEach(avatar => {
            const rect = avatar.getBoundingClientRect();
            positions.push({
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2
            });
        });

        let lineIdx = 0;

        // Draw lines between nearby avatars
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const dist = Math.hypot(
                    positions[i].x - positions[j].x,
                    positions[i].y - positions[j].y
                );

                if (dist < 350 && lineIdx < maxLines) {
                    const line = linesPool[lineIdx];
                    line.setAttribute('x1', positions[i].x);
                    line.setAttribute('y1', positions[i].y);
                    line.setAttribute('x2', positions[j].x);
                    line.setAttribute('y2', positions[j].y);
                    line.setAttribute('stroke', '#FFC222');
                    line.setAttribute('stroke-width', '1');

                    // Dynamic opacity based on distance
                    line.style.opacity = (1 - dist / 350) * 0.4;

                    lineIdx++;
                }
            }
        }

        // Hide unused lines
        for (let k = lineIdx; k < maxLines; k++) {
            linesPool[k].style.opacity = '0';
        }
    }

    animateConnections();

    // ═══════════════════════════════════════════════════════════
    // FLOATING ANIMATION
    // ═══════════════════════════════════════════════════════════
    avatars.forEach((avatar, index) => {
        gsap.to(avatar, {
            y: 'random(-15, 15)',
            x: 'random(-10, 10)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
        });
    });

    // ═══════════════════════════════════════════════════════════
    // MAGNETIC REPULSION EFFECT
    // ═══════════════════════════════════════════════════════════
    let mouseX = 0;
    let mouseY = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        avatars.forEach(avatar => {
            const avatarRect = avatar.getBoundingClientRect();
            const avatarX = avatarRect.left - rect.left + avatarRect.width / 2;
            const avatarY = avatarRect.top - rect.top + avatarRect.height / 2;

            const dist = Math.hypot(mouseX - avatarX, mouseY - avatarY);
            const maxDist = 150;

            if (dist < maxDist && dist > 0) {
                const angle = Math.atan2(avatarY - mouseY, avatarX - mouseX);
                const force = (maxDist - dist) / maxDist;
                const push = force * 40;

                gsap.to(avatar, {
                    x: `+=${Math.cos(angle) * push * 0.1}`,
                    y: `+=${Math.sin(angle) * push * 0.1}`,
                    duration: 0.3,
                    overwrite: 'auto'
                });
            }
        });
    });

    // ═══════════════════════════════════════════════════════════
    // HOVER EXPANSION
    // ═══════════════════════════════════════════════════════════
    avatars.forEach(avatar => {
        avatar.addEventListener('mouseenter', () => {
            gsap.to(avatar, {
                scale: 1.3,
                zIndex: 100,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });

            // Push others away
            avatars.forEach(other => {
                if (other !== avatar) {
                    gsap.to(other, {
                        scale: 0.9,
                        opacity: 0.5,
                        duration: 0.3
                    });
                }
            });
        });

        avatar.addEventListener('mouseleave', () => {
            gsap.to(avatar, {
                scale: 1,
                zIndex: 1,
                duration: 0.4,
                ease: 'power2.out'
            });

            avatars.forEach(other => {
                gsap.to(other, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.3
                });
            });
        });
    });

    console.log('👥 Team constellation initialized');
}
