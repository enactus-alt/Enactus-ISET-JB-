// ═══════════════════════════════════════════════════════════
//   ENACTUS ISET DJERBA — Lightweight App (No Dependencies)
// ═══════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────
    // NAVIGATION
    // ─────────────────────────────────────────────────────────
    function initNavigation() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const nav = document.getElementById('premium-nav');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

        function toggleMobileMenu() {
            const isOpen = hamburger.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = isOpen ? '' : 'hidden';
            hamburger.setAttribute('aria-expanded', !isOpen);
        }

        function closeMobileMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }

        if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
        if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();

                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        setTimeout(() => {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                }
            });
        });

        function handleScroll() {
            if (nav) {
                nav.classList.toggle('scrolled', window.scrollY > 50);
            }
        }

        function updateActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPosition >= top && scrollPosition < top + height) {
                    navLinks.forEach(link => link.classList.remove('active'));

                    document.querySelectorAll(
                        `.nav-link[data-section="${id}"], .mobile-link[data-section="${id}"]`
                    ).forEach(link => link.classList.add('active'));
                }
            });
        }

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });

        handleScroll();
        updateActiveLink();
    }

    // ─────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────
    function initUI() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('visible', entry.isIntersecting);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll(
            '.glass-card, .section-title, .project-item, .reveal, .highlight-item'
        ).forEach(el => observer.observe(el));

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const id = anchor.getAttribute('href').substring(1);
                const target = document.getElementById(id);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ─────────────────────────────────────────────────────────
    // MISSION
    // ─────────────────────────────────────────────────────────
    function initMission() {
        const cards = document.querySelectorAll('.mission-card');
        if (!cards.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('visible', entry.isIntersecting);
            });
        }, { threshold: 0.15 });

        cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.15}s`;
            observer.observe(card);
        });
    }

    // ─────────────────────────────────────────────────────────
    // TEAM
    // ─────────────────────────────────────────────────────────
    function initTeam() {
        const avatars = document.querySelectorAll('.team-avatar');
        if (!avatars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('visible', entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        avatars.forEach((avatar, i) => {
            avatar.style.transitionDelay = `${i * 0.1}s`;
            observer.observe(avatar);
        });
    }

    // ─────────────────────────────────────────────────────────
    // PROJECTS + SLIDER
    // ─────────────────────────────────────────────────────────
    function initProjects() {
        const items = document.querySelectorAll('.project-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('visible', entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        items.forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.2}s`;
            observer.observe(item);
        });

        document.querySelectorAll('.ba-slider').forEach(slider => {
            const handle = slider.querySelector('.ba-handle');
            const before = slider.querySelector('.ba-before');
            if (!handle || !before) return;

            let dragging = false;

            const update = (x) => {
                const rect = slider.getBoundingClientRect();
                let percent = ((x - rect.left) / rect.width) * 100;
                percent = Math.max(0, Math.min(100, percent));

                before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
                handle.style.left = `${percent}%`;
            };

            slider.addEventListener('mousedown', e => {
                dragging = true;
                update(e.clientX);
            });

            window.addEventListener('mousemove', e => {
                if (dragging) update(e.clientX);
            });

            window.addEventListener('mouseup', () => dragging = false);

            slider.addEventListener('touchstart', e => {
                dragging = true;
                update(e.touches[0].clientX);
            }, { passive: true });

            window.addEventListener('touchmove', e => {
                if (dragging) update(e.touches[0].clientX);
            }, { passive: true });

            window.addEventListener('touchend', () => dragging = false);
        });
    }

    // ─────────────────────────────────────────────────────────
    // BOOT
    // ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        initNavigation();
        initUI();
        initMission();
        initTeam();
        initProjects();

        const preloader = document.getElementById('preloader');
        const heroVideo = document.getElementById('hero-video');

        // PRELOADER
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('loaded');
                setTimeout(() => preloader.style.display = 'none', 400);
            }
        }, 800);

        // HERO VIDEO FIX
        if (heroVideo) {
            const tryPlay = () => {
                heroVideo.muted = true;

                const playPromise = heroVideo.play();
                if (playPromise) {
                    playPromise
                        .then(() => heroVideo.classList.add('loaded'))
                        .catch(() => heroVideo.style.display = 'none');
                }
            };

            if (heroVideo.readyState >= 3) {
                tryPlay();
            } else {
                heroVideo.addEventListener('canplay', tryPlay, { once: true });
            }

            heroVideo.addEventListener('play', () => {
                heroVideo.classList.add('loaded');
            }, { once: true });

            heroVideo.addEventListener('ended', () => {
                heroVideo.pause();

                const loader = document.getElementById('video-end-loader');
                if (loader) {
                    loader.style.display = 'flex';

                    setTimeout(() => {
                        loader.classList.add('hidden');

                        setTimeout(() => {
                            loader.style.display = 'none';
                        }, 500);

                    }, 3500);
                }
            });
        }

        console.log('✅ Enactus site ready — optimized version');
    });

})();
