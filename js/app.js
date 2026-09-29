// ═══════════════════════════════════════════════════════════
//   ENACTUS ISET DJERBA — app.js (cleaned, no dependencies)
//
//   1. Helpers
//   2. Navigation (menu, smooth scroll, active link)
//   3. Scroll reveal
//   4. Team cards (touch / keyboard)
//   5. Before / after sliders
//   6. Preloader + hero video
//   7. Boot
// ═══════════════════════════════════════════════════════════

(() => {
    'use strict';

    // ─────────────────────────────────────────────────────────
    // 1. HELPERS
    // ─────────────────────────────────────────────────────────
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    // True on real mouse devices. There, the team cards open with CSS :hover.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    // ─────────────────────────────────────────────────────────
    // 2. NAVIGATION
    // ─────────────────────────────────────────────────────────
    function initNavigation() {
        const nav = $('#premium-nav');
        const hamburger = $('#hamburger');
        const menu = $('#mobile-menu');
        const overlay = $('#mobile-overlay');
        const links = $$('.nav-link, .mobile-link');
        const sections = $$('section[id]');

        const setMenu = (open) => {
            hamburger?.classList.toggle('active', open);
            menu?.classList.toggle('active', open);
            overlay?.classList.toggle('active', open);
            hamburger?.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        };

        hamburger?.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
        overlay?.addEventListener('click', () => setMenu(false));

        // One handler for every in-page link: close the menu, then scroll smoothly.
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const target = document.getElementById(anchor.getAttribute('href').slice(1));
                if (!target) return;

                event.preventDefault();
                setMenu(false);
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setMenu(false);
        });

        // Scroll state: "scrolled" nav + highlighted link (throttled with rAF)
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                nav?.classList.toggle('scrolled', window.scrollY > 50);

                const position = window.scrollY + 150;
                const current = sections.find(
                    (section) => position >= section.offsetTop && position < section.offsetTop + section.offsetHeight
                );

                if (current) {
                    links.forEach((link) => link.classList.toggle('active', link.dataset.section === current.id));
                }

                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ─────────────────────────────────────────────────────────
    // 3. SCROLL REVEAL
    //    One observer for everything: adds/removes `.visible`.
    // ─────────────────────────────────────────────────────────
    function initReveal() {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => entry.target.classList.toggle('visible', entry.isIntersecting)),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        // Staggered entrance: [selector, delay step in seconds]
        [
            ['.mission-card', 0.15],
            ['.team-avatar', 0.1],
            ['.project-item', 0.2],
        ].forEach(([selector, step]) => {
            $$(selector).forEach((el, i) => {
                el.style.transitionDelay = `${i * step}s`;
            });
        });

        $$('.glass-card, .section-title, .project-item, .reveal, .highlight-item, .team-avatar')
            .forEach((el) => observer.observe(el));
    }

    // ─────────────────────────────────────────────────────────
    // 4. TEAM CARDS
    //    Mouse  → pure CSS :hover
    //    Touch  → tap toggles `.is-open` (one card at a time)
    //    Keys   → CSS :focus-visible, Enter/Space toggles on touch devices
    // ─────────────────────────────────────────────────────────
    function initTeam() {
        const cards = $$('.team-avatar');
        if (!cards.length) return;

        let openCard = null;

        const close = () => {
            openCard?.classList.remove('is-open');
            openCard = null;
        };

        const toggle = (card) => {
            const wasOpen = openCard === card;
            close();

            if (!wasOpen) {
                card.classList.add('is-open');
                openCard = card;
            }
        };

        cards.forEach((card) => {
            card.addEventListener('click', () => {
                if (!canHover.matches) toggle(card);
            });

            card.addEventListener('keydown', (event) => {
                if (canHover.matches) return;

                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    toggle(card);
                }
            });
        });

        // Tap anywhere else closes the open card
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.team-avatar')) close();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') close();
        });
    }

    // ─────────────────────────────────────────────────────────
    // 5. BEFORE / AFTER SLIDERS
    // ─────────────────────────────────────────────────────────
    function initCompareSliders() {
        $$('.ba-slider').forEach((slider) => {
            const before = $('.ba-before', slider);
            const handle = $('.ba-handle', slider);
            if (!before || !handle) return; // e.g. the single-image EDUCARE+ slider

            let dragging = false;

            const update = (clientX) => {
                const rect = slider.getBoundingClientRect();
                const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));

                before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
                handle.style.left = `${percent}%`;
            };

            const stop = () => { dragging = false; };

            slider.addEventListener('pointerdown', (event) => {
                dragging = true;
                slider.setPointerCapture(event.pointerId);
                update(event.clientX);
            });

            slider.addEventListener('pointermove', (event) => {
                if (dragging) update(event.clientX);
            });

            slider.addEventListener('pointerup', stop);
            slider.addEventListener('pointercancel', stop);
        });
    }

    // ─────────────────────────────────────────────────────────
    // 6. PRELOADER + HERO VIDEO
    // ─────────────────────────────────────────────────────────
    function initPreloader() {
        const preloader = $('#preloader');
        if (!preloader) return;

        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 800);
    }

    function initHeroVideo() {
        const video = $('#hero-video');
        if (!video) return;

        const show = () => video.classList.add('loaded');

        const tryPlay = () => {
            video.muted = true; // required for autoplay
            // If autoplay is blocked, still reveal the element so the poster image shows
            video.play()?.then(show).catch(show);
        };

        video.addEventListener('play', show, { once: true });

        if (video.readyState >= 3) {
            tryPlay();
        } else {
            video.addEventListener('canplay', tryPlay, { once: true });
        }
    }

    // ─────────────────────────────────────────────────────────
    // 7. BOOT
    // ─────────────────────────────────────────────────────────
    function init() {
        initNavigation();
        initReveal();
        initTeam();
        initCompareSliders();
        initPreloader();
        initHeroVideo();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();