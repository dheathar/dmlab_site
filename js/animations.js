/**
 * Animations & Visual Effects
 * Handles interactive animations and scroll-triggered effects
 */

class AnimationManager {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.init();
    }

    init() {
        // Intersection Observer for scroll-triggered animations
        this.setupIntersectionObserver();

        // Parallax effects
        this.setupParallaxEffects();

        // Animated counters
        this.setupAnimatedCounters();

        // Card hover effects
        this.setupCardEffects();

        // Navigation effects
        this.setupNavigationEffects();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Trigger counter animation if element has data-count attribute
                    if (entry.target.hasAttribute('data-count')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, this.observerOptions);

        // Observe all panels and cards
        const elementsToObserve = document.querySelectorAll('.panel, .feature-card, .project-card, .team-card, .publication-item');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    setupParallaxEffects() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        const scrollContainer = document.getElementById('scrollContainer');
        if (!scrollContainer) return;

        scrollContainer.addEventListener('scroll', () => {
            const scrollLeft = scrollContainer.scrollLeft;

            // Parallax effect on hero content
            const heroPanel = document.querySelector('.hero-panel');
            if (heroPanel) {
                const heroContent = heroPanel.querySelector('.panel-content');
                if (heroContent) {
                    const offset = scrollLeft * 0.3;
                    heroContent.style.transform = `translateX(-${offset}px)`;
                }
            }

            // Parallax effect on feature cards
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach((card, index) => {
                const speed = 0.05 + (index * 0.02);
                const offset = scrollLeft * speed;
                card.style.transform = `translateY(${offset}px)`;
            });
        });
    }

    setupAnimatedCounters() {
        // For metrics in hero section
        const metricValues = document.querySelectorAll('.metric-value');

        metricValues.forEach((element) => {
            const text = element.textContent;
            const number = parseInt(text);

            if (!isNaN(number) && number > 0) {
                element.setAttribute('data-count', number);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            element.textContent = current + (element.textContent.includes('+') ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = element.getAttribute('data-count') + (element.textContent.includes('+') ? '+' : '');
            }
        };

        requestAnimationFrame(updateCounter);
    }

    setupCardEffects() {
        // 3D tilt effect on cards
        const cards = document.querySelectorAll('.feature-card, .project-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    setupNavigationEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScrollLeft = 0;

        const scrollContainer = document.getElementById('scrollContainer');
        if (!scrollContainer) return;

        scrollContainer.addEventListener('scroll', () => {
            const scrollLeft = scrollContainer.scrollLeft;

            // Add background to navbar when scrolled
            if (scrollLeft > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScrollLeft = scrollLeft;
        });

        // Add active link highlighting
        const navLinks = document.querySelectorAll('.nav-menu a');
        const panels = document.querySelectorAll('.panel');

        scrollContainer.addEventListener('scroll', () => {
            const scrollLeft = scrollContainer.scrollLeft;
            const viewportWidth = window.innerWidth;
            const currentPanelIndex = Math.round(scrollLeft / viewportWidth);

            navLinks.forEach((link, index) => {
                if (index === currentPanelIndex) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
    }

    // Smooth reveal animation for elements
    static revealElement(element, delay = 0) {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            requestAnimationFrame(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, delay);
    }

    // Stagger animation for lists of elements
    static staggerReveal(elements, delayIncrement = 100) {
        elements.forEach((element, index) => {
            AnimationManager.revealElement(element, index * delayIncrement);
        });
    }
}

// Utility: Generate animated gradient background (light theme)
function createAnimatedGradient(element) {
    element.style.background = 'linear-gradient(-45deg, #FFFFFF, #F9FAFB, #F3F4F6, #E5E7EB)';
    element.style.backgroundSize = '400% 400%';
    element.style.animation = 'gradientShift 15s ease infinite';
}

// Add gradient animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .nav-menu a.active {
        color: var(--color-primary);
    }

    .is-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();

    // Apply animated gradient to hero panel
    const heroPanel = document.querySelector('.hero-panel');
    if (heroPanel) {
        createAnimatedGradient(heroPanel);
    }

    // Add loading animation
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn-primary, .btn-secondary, .btn-outline {
            position: relative;
            overflow: hidden;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}