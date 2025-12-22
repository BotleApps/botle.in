/**
 * Botle Landing Page - Main JavaScript
 * Features: Theme toggle, scroll animations, smooth scrolling
 */

// ========================================
// Theme Management
// ========================================

class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    getInitialTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    init() {
        // Apply initial theme
        this.applyTheme(this.theme);

        // Add event listener to toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
}

// ========================================
// Scroll Animations
// ========================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        // Create Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve after animation
                    // this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all elements with data-animation attribute
        this.observeElements();
    }

    observeElements() {
        const animatedElements = document.querySelectorAll('[data-animation]');
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// ========================================
// Smooth Scroll
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle all anchor links with smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Only prevent default if it's a valid ID selector
                if (href !== '#' && href !== '#!') {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
}

// ========================================
// Footer Year Auto-Update
// ========================================

function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ========================================
// Parallax Effect for Hero
// ========================================

class ParallaxEffect {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.bottleAnimation = document.querySelector('.bottle-animation');
        this.init();
    }

    init() {
        if (!this.heroSection || !this.bottleAnimation) return;

        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.handleScroll());
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const heroHeight = this.heroSection.offsetHeight;

        if (scrolled < heroHeight) {
            const opacity = 1 - (scrolled / heroHeight);
            const translateY = scrolled * 0.5;
            
            this.heroSection.style.opacity = opacity;
            if (this.bottleAnimation) {
                this.bottleAnimation.style.transform = `translateY(${translateY}px)`;
            }
        }
    }
}

// ========================================
// Add Keyboard Navigation Enhancements
// ========================================

class KeyboardNavigation {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard support for card interactions
        const cards = document.querySelectorAll('.tool-card');
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const primaryLink = card.querySelector('.tool-link-primary');
                    if (primaryLink) {
                        e.preventDefault();
                        primaryLink.click();
                    }
                }
            });
        });
    }
}

// ========================================
// Performance Optimization
// ========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images if any are added later
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            this.lazyLoadFallback();
        }
    }

    lazyLoadFallback() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ========================================
// Analytics & Tracking (Optional)
// ========================================

class Analytics {
    constructor() {
        this.trackEvents();
    }

    trackEvents() {
        // Track CTA clicks
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.logEvent('CTA Click', { location: 'Hero' });
            });
        });

        // Track tool card interactions
        const toolLinks = document.querySelectorAll('.tool-link');
        toolLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const card = link.closest('.tool-card');
                const toolName = card?.querySelector('.tool-name')?.textContent;
                const linkType = link.classList.contains('tool-link-primary') ? 'Repository' : 'App';
                
                this.logEvent('Tool Link Click', {
                    tool: toolName,
                    type: linkType
                });
            });
        });

        // Track theme changes
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                this.logEvent('Theme Toggle', { theme: currentTheme });
            });
        }
    }

    logEvent(eventName, data = {}) {
        // Console log for development
        console.log(`[Analytics] ${eventName}:`, data);
        
        // Here you would integrate with your analytics service
        // Example: gtag('event', eventName, data);
        // Example: plausible(eventName, { props: data });
    }
}

// ========================================
// Initialize Application
// ========================================

function initializeApp() {
    // Update copyright year
    updateCopyrightYear();

    // Initialize theme management
    new ThemeManager();

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize smooth scrolling
    new SmoothScroll();

    // Initialize parallax effect
    new ParallaxEffect();

    // Initialize keyboard navigation
    new KeyboardNavigation();

    // Initialize performance optimizations
    new PerformanceOptimizer();

    // Initialize analytics (optional)
    new Analytics();

    // Log initialization
    console.log('🍾 Botle landing page initialized successfully!');
}

// ========================================
// Load Event
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ========================================
// Export for testing (if needed)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        ScrollAnimations,
        SmoothScroll,
        ParallaxEffect,
        KeyboardNavigation,
        PerformanceOptimizer,
        Analytics
    };
}
