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
// Tool Details Modal
// ========================================

class ToolModal {
    constructor() {
        this.modal = document.getElementById('tool-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalActions = document.getElementById('modal-actions');
        this.closeBtn = document.getElementById('modal-close');
        this.init();
    }

    init() {
        if (!this.modal) return;

        // Bind close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        // Bind all view details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.open(e.currentTarget));
        });
    }

    open(button) {
        const toolName = button.dataset.tool;
        const github = button.dataset.github;
        const demo = button.dataset.demo;
        const download = button.dataset.download;

        // Set modal title
        this.modalTitle.textContent = toolName;

        // Build action buttons
        let actionsHTML = '';

        // GitHub/View Code button (always present)
        if (github) {
            actionsHTML += `
                <a href="${github}" class="modal-action-btn primary" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                </a>
            `;
        }

        // Live Demo button
        if (demo) {
            actionsHTML += `
                <a href="${demo}" class="modal-action-btn" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                    Live Demo
                </a>
            `;
        }

        // Download button (for extensions)
        if (download) {
            actionsHTML += `
                <a href="${download}" class="modal-action-btn" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download
                </a>
            `;
        }

        this.modalActions.innerHTML = actionsHTML;

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first action for accessibility
        const firstAction = this.modalActions.querySelector('a');
        if (firstAction) {
            setTimeout(() => firstAction.focus(), 100);
        }
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
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
                    const detailsBtn = card.querySelector('.view-details-btn');
                    if (detailsBtn) {
                        e.preventDefault();
                        detailsBtn.click();
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
    
    new ToolModal();
    new KeyboardNavigation();
    new Analytics();

    console.log('Botle - Open source tools for everyone!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
