import { gsap } from 'gsap';

export default function initPreloader(onComplete) {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
        if (onComplete) onComplete();
        return;
    }

    // Create preloader content
    preloader.innerHTML = `
        <div class="preloader-content">
            <img src="assets/img/logo.png" alt="Enactus" class="preloader-logo">
            <div class="preloader-text">FUTURE MAKERS</div>
            <div class="preloader-bar">
                <div class="preloader-progress"></div>
            </div>
        </div>
    `;

    // Add preloader bar styles
    const style = document.createElement('style');
    style.textContent = `
        .preloader-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }
        .preloader-bar {
            width: 200px;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
        }
        .preloader-progress {
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #FFC222, #FFD666);
            box-shadow: 0 0 20px #FFC222;
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);

    // Animate progress bar
    const progress = preloader.querySelector('.preloader-progress');

    gsap.to(progress, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
            // Dramatic exit
            gsap.timeline()
                .to(preloader, {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.inOut'
                })
                .to(preloader, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        if (onComplete) onComplete();
                    }
                }, '<0.2');
        }
    });

    console.log('⏳ Preloader started');
}
