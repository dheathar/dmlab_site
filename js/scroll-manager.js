/**
 * Horizontal Scroll Manager
 * Handles smooth horizontal scrolling with mouse wheel support
 * Inspired by datalab.to scroll mechanics
 */

class HorizontalScrollManager {
    constructor() {
        this.scrollContainer = document.getElementById('scrollContainer');
        this.scrollContent = document.getElementById('scrollContent');
        this.scrollProgressBar = document.getElementById('scrollProgressBar');
        this.panels = document.querySelectorAll('.panel');

        this.currentScroll = 0;
        this.targetScroll = 0;
        this.ease = 0.075;
        this.isScrolling = false;
        this.rafId = null;

        this.init();
    }

    init() {
        if (!this.scrollContainer) return;

        // Mouse wheel horizontal scroll
        this.scrollContainer.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });

        // Touch swipe support
        this.handleTouchEvents();

        // Keyboard navigation
        this.handleKeyboardNavigation();

        // Update progress bar on scroll
        this.scrollContainer.addEventListener('scroll', this.updateProgress.bind(this));

        // Create navigation dots
        this.createNavigationDots();

        // Initialize scroll position
        this.updateProgress();

        // Smooth scroll animation (optional momentum-based scrolling)
        // Uncomment if you want momentum scrolling like datalab.to
        // this.startSmoothScroll();
    }

    handleWheel(e) {
        // Only handle horizontal scrolling on desktop
        if (window.innerWidth <= 768) return;

        e.preventDefault();

        // Convert vertical wheel to horizontal scroll
        const delta = e.deltaY || e.deltaX;
        this.scrollContainer.scrollLeft += delta;
    }

    handleTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let scrollStartLeft = 0;

        this.scrollContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            scrollStartLeft = this.scrollContainer.scrollLeft;
        }, { passive: true });

        this.scrollContainer.addEventListener('touchmove', (e) => {
            if (window.innerWidth <= 768) return; // Let native scroll handle mobile

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchStartX - touchX;
            const deltaY = touchStartY - touchY;

            // Only handle if horizontal swipe is dominant
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.scrollContainer.scrollLeft = scrollStartLeft + deltaX;
            }
        }, { passive: true });
    }

    handleKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (window.innerWidth <= 768) return;

            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    this.scrollToNextPanel();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.scrollToPreviousPanel();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.scrollToPanel(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.scrollToPanel(this.panels.length - 1);
                    break;
            }
        });
    }

    getCurrentPanelIndex() {
        const scrollLeft = this.scrollContainer.scrollLeft;
        const panelWidth = window.innerWidth;
        return Math.round(scrollLeft / panelWidth);
    }

    scrollToPanel(index) {
        if (index < 0 || index >= this.panels.length) return;

        const panelWidth = window.innerWidth;
        this.scrollContainer.scrollTo({
            left: index * panelWidth,
            behavior: 'smooth'
        });
    }

    scrollToNextPanel() {
        const currentIndex = this.getCurrentPanelIndex();
        this.scrollToPanel(currentIndex + 1);
    }

    scrollToPreviousPanel() {
        const currentIndex = this.getCurrentPanelIndex();
        this.scrollToPanel(currentIndex - 1);
    }

    updateProgress() {
        const scrollWidth = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
        const scrollLeft = this.scrollContainer.scrollLeft;
        const progress = (scrollLeft / scrollWidth) * 100;

        if (this.scrollProgressBar) {
            this.scrollProgressBar.style.width = `${progress}%`;
        }

        // Update active navigation dot
        this.updateActiveDot();
    }

    createNavigationDots() {
        if (window.innerWidth <= 768) return;

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'scroll-dots';

        const panelLabels = ['Home', 'About Us', 'Partners', 'Research', 'Projects', 'Team', 'Publications', 'Contact'];

        this.panels.forEach((panel, index) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot';
            dot.setAttribute('data-label', panelLabels[index] || `Section ${index + 1}`);
            dot.addEventListener('click', () => this.scrollToPanel(index));
            dotsContainer.appendChild(dot);
        });

        document.body.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.scroll-dot');
    }

    updateActiveDot() {
        if (!this.dots || window.innerWidth <= 768) return;

        const currentIndex = this.getCurrentPanelIndex();
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update sidebar active link
        this.updateSidebarActiveLink(currentIndex);
    }

    updateSidebarActiveLink(index) {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        if (!sidebarLinks.length) return;

        sidebarLinks.forEach((link, i) => {
            link.classList.toggle('active', i === index);
        });
    }

    // Optional: Momentum-based smooth scrolling (like datalab.to)
    startSmoothScroll() {
        const smoothScroll = () => {
            this.currentScroll += (this.targetScroll - this.currentScroll) * this.ease;

            if (Math.abs(this.targetScroll - this.currentScroll) > 0.5) {
                this.scrollContainer.scrollLeft = this.currentScroll;
                this.rafId = requestAnimationFrame(smoothScroll);
            } else {
                this.currentScroll = this.targetScroll;
                this.scrollContainer.scrollLeft = this.currentScroll;
                cancelAnimationFrame(this.rafId);
            }
        };

        this.scrollContainer.addEventListener('wheel', (e) => {
            if (window.innerWidth <= 768) return;

            e.preventDefault();
            this.targetScroll += e.deltaY;
            this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth));

            if (!this.rafId) {
                this.rafId = requestAnimationFrame(smoothScroll);
            }
        }, { passive: false });
    }

    // Clean up
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const scrollManager = new HorizontalScrollManager();

    // Add scroll hint that fades out after first scroll
    const scrollHint = document.createElement('div');
    scrollHint.className = 'scroll-hint';
    scrollHint.textContent = 'Scroll to explore';
    document.body.appendChild(scrollHint);

    let hasScrolled = false;
    const scrollContainer = document.getElementById('scrollContainer');

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            if (!hasScrolled && scrollContainer.scrollLeft > 50) {
                hasScrolled = true;
                scrollHint.classList.add('hidden');
                setTimeout(() => scrollHint.remove(), 500);
            }
        }, { once: false });
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            scrollManager.updateProgress();
        }, 250);
    });
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HorizontalScrollManager;
}