import { gsap } from 'gsap';

// EmailJS Configuration - Free tier: 200 emails/month
// Sign up at https://www.emailjs.com/ and get your keys
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your template ID

export default function initContact() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (!form) return;

    // ═══════════════════════════════════════════════════════════
    // INPUT ANIMATIONS
    // ═══════════════════════════════════════════════════════════
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        const line = input.parentElement.querySelector('.input-line');

        // Create floating label effect
        const placeholder = input.getAttribute('placeholder');
        input.setAttribute('placeholder', '');

        const label = document.createElement('label');
        label.textContent = placeholder;
        label.style.cssText = `
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            pointer-events: none;
            font-size: 1.1rem;
        `;
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(label);

        // Add ARIA label for accessibility
        input.setAttribute('aria-label', placeholder);

        input.addEventListener('focus', () => {
            gsap.to(label, {
                y: -35,
                scale: 0.8,
                color: '#FFC222',
                duration: 0.3,
                ease: 'power2.out'
            });

            if (line) {
                gsap.to(line, {
                    width: '100%',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });

        input.addEventListener('blur', () => {
            if (input.value === '') {
                gsap.to(label, {
                    y: 0,
                    scale: 1,
                    color: 'rgba(255,255,255,0.3)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            if (line && input.value === '') {
                gsap.to(line, {
                    width: '0%',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });

        // Check if already has value (browser autofill)
        if (input.value !== '') {
            gsap.set(label, { y: -35, scale: 0.8, color: '#FFC222' });
            if (line) gsap.set(line, { width: '100%' });
        }
    });

    // ═══════════════════════════════════════════════════════════
    // FORM VALIDATION
    // ═══════════════════════════════════════════════════════════
    function validateForm() {
        const name = form.querySelector('input[type="text"]');
        const email = form.querySelector('input[type="email"]');
        const message = form.querySelector('textarea');

        let isValid = true;
        let errorMessage = '';

        if (!name.value.trim()) {
            errorMessage = 'Please enter your name';
            isValid = false;
            name.focus();
        } else if (!email.value.trim() || !email.value.includes('@')) {
            errorMessage = 'Please enter a valid email';
            isValid = false;
            email.focus();
        } else if (!message.value.trim() || message.value.length < 10) {
            errorMessage = 'Please enter a message (at least 10 characters)';
            isValid = false;
            message.focus();
        }

        if (!isValid) {
            showNotification(errorMessage, 'error');
        }

        return isValid;
    }

    // ═══════════════════════════════════════════════════════════
    // NOTIFICATION SYSTEM
    // ═══════════════════════════════════════════════════════════
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelector('.form-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'form-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1rem;
            z-index: 10000;
            backdrop-filter: blur(10px);
            ${type === 'success'
                ? 'background: rgba(0, 200, 100, 0.2); border: 1px solid rgba(0, 200, 100, 0.5); color: #00ff88;'
                : 'background: rgba(255, 50, 50, 0.2); border: 1px solid rgba(255, 50, 50, 0.5); color: #ff6666;'
            }
        `;
        document.body.appendChild(notification);

        gsap.fromTo(notification,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 }
        );

        setTimeout(() => {
            gsap.to(notification, {
                y: -20,
                opacity: 0,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        }, 4000);
    }

    // ═══════════════════════════════════════════════════════════
    // FORM SUBMISSION
    // ═══════════════════════════════════════════════════════════
    if (submitBtn) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate first
            if (!validateForm()) return;

            const btnText = submitBtn.querySelector('span:first-child');
            const plane = submitBtn.querySelector('.plane-icon');

            // Disable button
            submitBtn.disabled = true;

            // Get form data
            const formData = {
                name: form.querySelector('input[type="text"]').value,
                email: form.querySelector('input[type="email"]').value,
                message: form.querySelector('textarea').value
            };

            const tl = gsap.timeline();

            // Plane flies away animation
            tl.to(plane, {
                x: 200,
                y: -100,
                rotation: 45,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.in'
            })
                .to(submitBtn, {
                    scale: 0.95,
                    duration: 0.1
                });

            try {
                // Check if EmailJS is configured
                if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
                    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                } else {
                    // Demo mode - just simulate success
                    console.log('📧 Form submitted (demo mode):', formData);
                    showNotification('Message received! (Demo mode - configure EmailJS for production)', 'success');
                }

                // Success animation
                tl.to(submitBtn, {
                    scale: 1.05,
                    boxShadow: '0 0 60px rgba(0, 200, 100, 0.5)',
                    duration: 0.2
                })
                    .to(btnText, {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: () => {
                            btnText.textContent = '✓ Sent!';
                        }
                    })
                    .to(btnText, {
                        opacity: 1,
                        duration: 0.3
                    });

            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Failed to send message. Please try again.', 'error');

                // Error animation
                gsap.to(submitBtn, {
                    boxShadow: '0 0 40px rgba(255, 50, 50, 0.5)',
                    duration: 0.3
                });
            }

            // Reset after delay
            setTimeout(() => {
                form.reset();
                inputs.forEach(input => {
                    const label = input.parentElement.querySelector('label');
                    const line = input.parentElement.querySelector('.input-line');
                    gsap.to(label, { y: 0, scale: 1, color: 'rgba(255,255,255,0.3)' });
                    if (line) gsap.to(line, { width: '0%' });
                });

                btnText.textContent = 'Send Message';
                gsap.set(plane, { x: 0, y: 0, rotation: 0, opacity: 1 });
                gsap.to(submitBtn, { scale: 1, boxShadow: 'none' });
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    console.log('📧 Contact form initialized with validation');
}
