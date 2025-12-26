/**
 * Botle Landing Page - Enhanced JavaScript
 * Modern animations, theme management, and interactive features
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
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    init() {
        this.applyTheme(this.theme);
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

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
        if (window.particleSystem) {
            window.particleSystem.updateColors();
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
}

// ========================================
// Particle System (Lightweight)
// ========================================

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.particleCount = 30;
        this.animationId = null;
        this.init();
    }

    init() {
        const container = document.getElementById('particles');
        if (!container) return;

        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.particleSystem = this;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    getColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            primary: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)',
            secondary: isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)',
            tertiary: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.1)'
        };
    }

    createParticles() {
        this.particles = [];
        const colors = this.getColors();
        const colorArray = [colors.primary, colors.secondary, colors.tertiary];

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                color: colorArray[Math.floor(Math.random() * colorArray.length)],
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    updateColors() {
        const colors = this.getColors();
        const colorArray = [colors.primary, colors.secondary, colors.tertiary];
        this.particles.forEach(p => {
            p.color = colorArray[Math.floor(Math.random() * colorArray.length)];
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
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
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                }
            });
        }, this.observerOptions);

        this.observeElements();
    }

    observeElements() {
        document.querySelectorAll('[data-animation]').forEach(el => this.observer.observe(el));
    }
}

// ========================================
// Navbar Scroll Effect
// ========================================

class NavbarScroll {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.scrollThreshold = 50;
        this.init();
    }

    init() {
        if (!this.navbar) return;
        window.addEventListener('scroll', () => requestAnimationFrame(() => this.handleScroll()));
        this.handleScroll();
    }

    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
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
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href !== '#!') {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                }
            });
        });
    }
}

// ========================================
// Counter Animation
// ========================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.animated = new Set();
        this.init();
    }

    init() {
        if (!this.counters.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animated.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(target * easeOut);
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        requestAnimationFrame(updateCounter);
    }
}

// ========================================
// Magnetic Buttons
// ========================================

class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-button');
        this.init();
    }

    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.handleMouseMove(e, button));
            button.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, button));
        });
    }

    handleMouseMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        button.style.transform = 'translateY(-2px) translate(' + (x * 0.1) + 'px, ' + (y * 0.1) + 'px)';
    }

    handleMouseLeave(e, button) {
        button.style.transform = '';
    }
}

// ========================================
// Card Tilt Effect
// ========================================

class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.tool-card, .feature-card');
        this.init();
    }

    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.innerWidth < 1024) return;
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    }

    handleMouseLeave(e, card) {
        card.style.transform = '';
    }
}

// ========================================
// Footer Year
// ========================================

function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
}

// ========================================
// Keyboard Navigation
// ========================================

class KeyboardNavigation {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.tool-card').forEach(card => {
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
// Analytics
// ========================================

class Analytics {
    constructor() {
        this.trackEvents();
    }

    trackEvents() {
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', () => {
                this.logEvent('CTA Click', { text: button.textContent.trim() });
            });
        });

        document.querySelectorAll('.tool-link').forEach(link => {
            link.addEventListener('click', () => {
                const card = link.closest('.tool-card');
                const toolName = card ? card.querySelector('.tool-name') : null;
                this.logEvent('Tool Link Click', { tool: toolName ? toolName.textContent : 'Unknown' });
            });
        });
    }

    logEvent(eventName, data) {
        console.log('[Analytics] ' + eventName + ':', data);
    }
}

// ========================================
// Initialize Application
// ========================================

function initializeApp() {
    updateCopyrightYear();
    new ThemeManager();
    new NavbarScroll();
    new SmoothScroll();
    new ScrollAnimations();
    new CounterAnimation();
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        new ParticleSystem();
        new MagneticButtons();
        new CardTilt();
    }
    
    new KeyboardNavigation();
    new Analytics();

    console.log('Botle - Open source tools for everyone!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
