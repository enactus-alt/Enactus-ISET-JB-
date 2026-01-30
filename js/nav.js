/**
 * Navigation & Sidebar Logic
 * Handles mobile menu toggling, outside clicks, and smooth scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create overlay element
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Optional: prevent background scrolling
    }

    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }

    // Toggle button click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close when clicking overlay
    overlay.addEventListener('click', closeMenu);

    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside (fallback)
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
});
