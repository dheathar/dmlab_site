/**
 * Dark Mode Theme Toggle
 * Handles theme switching with localStorage persistence
 */

class ThemeToggle {
    constructor() {
        this.theme = this.getStoredTheme() || 'light';
        this.init();
    }

    init() {
        // Apply saved theme immediately
        this.applyTheme(this.theme);

        // Create toggle button
        this.createToggleButton();

        // Listen for system theme preference changes
        this.watchSystemTheme();
    }

    getStoredTheme() {
        return localStorage.getItem('dm-lab-theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('dm-lab-theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        this.setStoredTheme(theme);
        this.updateToggleButton();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    createToggleButton() {
        const toggle = document.createElement('div');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('aria-label', 'Toggle dark mode');

        toggle.innerHTML = `
            <div class="theme-toggle-btn light-btn" data-theme="light">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            </div>
            <div class="theme-toggle-btn dark-btn" data-theme="dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </div>
        `;

        toggle.addEventListener('click', (e) => {
            const btn = e.target.closest('.theme-toggle-btn');
            if (btn) {
                const targetTheme = btn.getAttribute('data-theme');
                if (targetTheme !== this.theme) {
                    this.applyTheme(targetTheme);
                }
            }
        });

        // Append to sidebar footer if it exists, otherwise to body
        const sidebarFooter = document.querySelector('.sidebar-footer');
        if (sidebarFooter) {
            sidebarFooter.appendChild(toggle);
        } else {
            document.body.appendChild(toggle);
        }

        this.toggleElement = toggle;
        this.updateToggleButton();
    }

    updateToggleButton() {
        if (!this.toggleElement) return;

        const lightBtn = this.toggleElement.querySelector('.light-btn');
        const darkBtn = this.toggleElement.querySelector('.dark-btn');

        if (this.theme === 'light') {
            lightBtn.classList.add('active');
            darkBtn.classList.remove('active');
        } else {
            darkBtn.classList.add('active');
            lightBtn.classList.remove('active');
        }
    }

    watchSystemTheme() {
        // Only watch if user hasn't explicitly set a preference
        if (!this.getStoredTheme()) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e) => {
                const systemTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(systemTheme);
            };

            // Modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else if (mediaQuery.addListener) {
                // Safari < 14
                mediaQuery.addListener(handleChange);
            }

            // Apply system theme initially if no stored preference
            if (mediaQuery.matches) {
                this.applyTheme('dark');
            }
        }
    }
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeToggle();
    });
} else {
    new ThemeToggle();
}
