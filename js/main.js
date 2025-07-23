/**
 * Main Portfolio JavaScript
 * Handles all interactive features, animations, and user interactions
 */

class PortfolioApp {
    constructor() {
        this.isLoaded = false;
        this.currentTheme = 'dark';
        this.animations = {};
        
        this.init();
    }
    
    init() {
        this.setupGSAP();
        this.showLoadingScreen();
        this.initializeAnimations();
        this.setupInteractions();
        this.initializeScrollReveal();
        this.setupFormHandling();
        this.initializePerformanceOptimizations();
        
        // Mark as loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMLoaded();
        });
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Hide loading screen after content is loaded
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 1000); // Show for at least 1 second
            });
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                duration: 0.8,
                opacity: 0,
                scale: 0.9,
                ease: "power2.out",
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    document.body.classList.add('loaded');
                    this.playEntryAnimations();
                }
            });
        }
    }
    
    setupGSAP() {
        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded');
            return;
        }
        
        // Register GSAP plugins if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        if (typeof ScrollToPlugin !== 'undefined') {
            gsap.registerPlugin(ScrollToPlugin);
        }
        
        // Set GSAP defaults
        gsap.defaults({
            duration: 0.6,
            ease: "power2.out"
        });
        
        // Configure ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.config({
                autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
            });
        }
    }
    
    onDOMLoaded() {
        this.isLoaded = true;
        this.playEntryAnimations();
        this.initializeTypewriter();
    }
    
    initializeAnimations() {
        // Hero animations
        this.animations.hero = gsap.timeline({ paused: true })
            .from('.hero-name', {
                duration: 1,
                y: 100,
                opacity: 0,
                ease: "back.out(1.7)"
            })
            .from('.hero-title', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: "power2.out"
            }, "-=0.5")
            .from('.hero-welcome', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: "power2.out"
            }, "-=0.3")
            .from('.hero-description', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                ease: "power2.out"
            }, "-=0.3")
            .from('.hero-actions .cta-button', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.3")
            .from('.profile-card', {
                duration: 1,
                scale: 0.8,
                opacity: 0,
                ease: "back.out(1.7)"
            }, "-=0.8");
        
        // Section animations with ScrollTrigger
        this.setupScrollTriggerAnimations();
    }
    
    setupScrollTriggerAnimations() {
        // Section headers animation
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                ease: "power2.out"
            });
        });
        
        // Project cards animation
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                duration: 0.8,
                y: 80,
                opacity: 0,
                delay: index * 0.1,
                ease: "back.out(1.7)"
            });
        });
        
        // Article cards animation
        gsap.utils.toArray('.article-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                duration: 0.8,
                x: index % 2 === 0 ? -80 : 80,
                opacity: 0,
                delay: index * 0.2,
                ease: "power2.out"
            });
        });
        
        // Contact section animation
        gsap.from('.contact-item', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            x: -50,
            opacity: 0,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
        
        gsap.from('.contact-form', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            x: 50,
            opacity: 0,
            ease: "power2.out"
        });
        
        // Stats counter animation
        this.setupStatsAnimation();
    }
    
    setupStatsAnimation() {
        gsap.utils.toArray('.stat-number').forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: "top 90%",
                    end: "bottom 10%",
                    toggleActions: "play none none reverse"
                },
                duration: 2,
                textContent: 0,
                snap: { textContent: 1 },
                ease: "power2.out",
                onUpdate: function() {
                    stat.textContent = Math.ceil(this.targets()[0].textContent) + '+';
                }
            });
        });
    }
    
    playEntryAnimations() {
        if (this.animations.hero) {
            this.animations.hero.play();
        }
    }
    
    initializeTypewriter() {
        const typewriterElement = document.querySelector('.cursor-blink');
        if (!typewriterElement) return;
        
        // Enhanced typewriter effect
        gsap.to(typewriterElement, {
            duration: 0.8,
            opacity: 0,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });
    }
    
    setupInteractions() {
        this.setupButtonInteractions();
        this.setupCardInteractions();
        this.setupHoverEffects();
        this.setupKeyboardNavigation();
        this.setupTouchInteractions();
        this.setupFloatingActionButton();
    }
    
    setupButtonInteractions() {
        // Enhanced button animations
        document.querySelectorAll('.cta-button, .project-view, .article-read, .form-submit').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                gsap.to(e.target, {
                    duration: 0.3,
                    scale: 1.05,
                    y: -2,
                    ease: "back.out(1.7)"
                });
            });
            
            button.addEventListener('mouseleave', (e) => {
                gsap.to(e.target, {
                    duration: 0.3,
                    scale: 1,
                    y: 0,
                    ease: "power2.out"
                });
            });
            
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e);
            });
        });
        
        // CTA button actions
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.textContent.includes('View My Work')) {
                    this.scrollToSection('projects');
                } else if (button.textContent.includes('Get In Touch')) {
                    this.scrollToSection('contact');
                }
            });
        });
    }
    
    setupCardInteractions() {
        // Project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.4,
                    y: -10,
                    scale: 1.02,
                    ease: "power2.out"
                });
                
                // Animate tags
                gsap.to(e.currentTarget.querySelectorAll('.tag'), {
                    duration: 0.3,
                    scale: 1.1,
                    stagger: 0.05,
                    ease: "back.out(1.7)"
                });
            });
            
            card.addEventListener('mouseleave', (e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.4,
                    y: 0,
                    scale: 1,
                    ease: "power2.out"
                });
                
                gsap.to(e.currentTarget.querySelectorAll('.tag'), {
                    duration: 0.3,
                    scale: 1,
                    stagger: 0.02,
                    ease: "power2.out"
                });
            });
        });
        
        // Article cards
        document.querySelectorAll('.article-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.3,
                    y: -5,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', (e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.3,
                    y: 0,
                    ease: "power2.out"
                });
            });
        });
    }
    
    setupHoverEffects() {
        // Contact items
        document.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.3,
                    x: 10,
                    ease: "back.out(1.7)"
                });
                
                gsap.to(e.currentTarget.querySelector('.contact-icon'), {
                    duration: 0.3,
                    rotation: 5,
                    scale: 1.1,
                    ease: "back.out(1.7)"
                });
            });
            
            item.addEventListener('mouseleave', (e) => {
                gsap.to(e.currentTarget, {
                    duration: 0.3,
                    x: 0,
                    ease: "power2.out"
                });
                
                gsap.to(e.currentTarget.querySelector('.contact-icon'), {
                    duration: 0.3,
                    rotation: 0,
                    scale: 1,
                    ease: "power2.out"
                });
            });
        });
        
        // Profile card animation
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            profileCard.addEventListener('mouseenter', () => {
                gsap.to(profileCard, {
                    duration: 0.4,
                    y: -10,
                    rotationY: 5,
                    ease: "power2.out"
                });
            });
            
            profileCard.addEventListener('mouseleave', () => {
                gsap.to(profileCard, {
                    duration: 0.4,
                    y: 0,
                    rotationY: 0,
                    ease: "power2.out"
                });
            });
        }
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.scrollToPreviousSection();
                    }
                    break;
                case 'ArrowDown':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.scrollToNextSection();
                    }
                    break;
                case 'Home':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.scrollToSection('home');
                    }
                    break;
                case 'End':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.scrollToSection('contact');
                    }
                    break;
            }
        });
    }
    
    setupTouchInteractions() {
        // Touch gestures for mobile
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const swipeDistance = touchStartY - touchEndY;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe up - next section
                    this.scrollToNextSection();
                } else {
                    // Swipe down - previous section
                    this.scrollToPreviousSection();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    setupFloatingActionButton() {
        const fabContainer = document.getElementById('fabContainer');
        const fabMain = document.getElementById('fabMain');
        const fabOptions = document.querySelectorAll('.fab-option');
        
        if (!fabContainer || !fabMain) return;
        
        let isOpen = false;
        
        // Toggle FAB menu
        fabMain.addEventListener('click', () => {
            isOpen = !isOpen;
            fabContainer.classList.toggle('active', isOpen);
            
            gsap.to(fabMain, {
                duration: 0.3,
                rotation: isOpen ? 45 : 0,
                ease: "back.out(1.7)"
            });
        });
        
        // Handle FAB option clicks
        fabOptions.forEach((option, index) => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                
                // Animate click
                gsap.to(e.currentTarget, {
                    duration: 0.2,
                    scale: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(e.currentTarget, {
                            duration: 0.3,
                            scale: 1,
                            ease: "back.out(1.7)"
                        });
                    }
                });
                
                // Perform action
                this.handleFabAction(action);
                
                // Close menu
                isOpen = false;
                fabContainer.classList.remove('active');
                gsap.to(fabMain, {
                    duration: 0.3,
                    rotation: 0,
                    ease: "back.out(1.7)"
                });
            });
            
            // Stagger animation for options
            gsap.from(option, {
                duration: 0.3,
                scale: 0,
                delay: index * 0.1,
                ease: "back.out(1.7)",
                paused: true
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!fabContainer.contains(e.target) && isOpen) {
                isOpen = false;
                fabContainer.classList.remove('active');
                gsap.to(fabMain, {
                    duration: 0.3,
                    rotation: 0,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        // Show/hide FAB based on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 200) {
                gsap.to(fabContainer, {
                    duration: 0.3,
                    opacity: 1,
                    scale: 1,
                    ease: "back.out(1.7)"
                });
            } else {
                gsap.to(fabContainer, {
                    duration: 0.3,
                    opacity: 0.7,
                    scale: 0.9,
                    ease: "power2.out"
                });
            }
        });
    }
    
    handleFabAction(action) {
        switch(action) {
            case 'top':
                this.scrollToSection('home');
                break;
            case 'contact':
                this.scrollToSection('contact');
                break;
            case 'projects':
                this.scrollToSection('projects');
                break;
        }
    }
    
    initializeScrollReveal() {
        // Generic scroll reveal animation
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        revealElements.forEach(element => {
            const direction = element.getAttribute('data-reveal') || 'up';
            const delay = parseFloat(element.getAttribute('data-delay')) || 0;
            
            let fromVars = { opacity: 0 };
            
            switch(direction) {
                case 'up':
                    fromVars.y = 50;
                    break;
                case 'down':
                    fromVars.y = -50;
                    break;
                case 'left':
                    fromVars.x = -50;
                    break;
                case 'right':
                    fromVars.x = 50;
                    break;
                case 'scale':
                    fromVars.scale = 0.8;
                    break;
            }
            
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                ...fromVars,
                duration: 0.8,
                delay: delay,
                ease: "power2.out"
            });
        });
    }
    
    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e.target);
        });
        
        // Form input animations
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                gsap.to(e.target, {
                    duration: 0.3,
                    scale: 1.02,
                    ease: "power2.out"
                });
            });
            
            input.addEventListener('blur', (e) => {
                gsap.to(e.target, {
                    duration: 0.3,
                    scale: 1,
                    ease: "power2.out"
                });
            });
        });
    }
    
    handleFormSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('.form-submit');
        
        // Animate form submission
        gsap.to(submitButton, {
            duration: 0.3,
            scale: 0.95,
            ease: "power2.out",
            onComplete: () => {
                // Simulate form submission
                this.showNotification('Message sent successfully!', 'success');
                form.reset();
                
                gsap.to(submitButton, {
                    duration: 0.3,
                    scale: 1,
                    ease: "back.out(1.7)"
                });
            }
        });
    }
    
    createRippleEffect(e) {
        const button = e.currentTarget;
        const ripple = button.querySelector('.button-ripple');
        
        if (ripple) {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            gsap.set(ripple, {
                width: size,
                height: size,
                left: x,
                top: y,
                scale: 0,
                opacity: 0.6
            });
            
            gsap.to(ripple, {
                duration: 0.6,
                scale: 1,
                opacity: 0,
                ease: "power2.out"
            });
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            background: type === 'success' ? '#10B981' : '#3B82F6',
            color: 'white',
            borderRadius: '0.5rem',
            zIndex: '10000',
            transform: 'translateX(100%)',
            opacity: '0'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        gsap.to(notification, {
            duration: 0.5,
            x: 0,
            opacity: 1,
            ease: "back.out(1.7)",
            onComplete: () => {
                // Auto remove after 3 seconds
                setTimeout(() => {
                    gsap.to(notification, {
                        duration: 0.3,
                        x: '100%',
                        opacity: 0,
                        ease: "power2.in",
                        onComplete: () => {
                            notification.remove();
                        }
                    });
                }, 3000);
            }
        });
    }
    
    initializePerformanceOptimizations() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        });
    }
    
    // Navigation utilities
    scrollToSection(sectionId) {
        console.log('Scrolling to section:', sectionId); // Debug
        const section = document.getElementById(sectionId);
        if (section) {
            const isMobile = window.innerWidth <= 768;
            const navHeight = isMobile ? 70 : 80;
            const offsetTop = section.offsetTop - navHeight;
            
            console.log('Section found:', section, 'offset:', offsetTop); // Debug
            
            // Always use native smooth scroll for reliability
            try {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } catch (e) {
                console.log('Fallback to instant scroll');
                window.scrollTo(0, offsetTop);
            }
        } else {
            console.error('Section not found:', sectionId); // Debug
        }
    }
    
    scrollToNextSection() {
        const sections = ['home', 'projects', 'writing', 'contact'];
        const current = window.navigation?.adaptive?.getCurrentSection() || 'home';
        const currentIndex = sections.indexOf(current);
        const nextIndex = (currentIndex + 1) % sections.length;
        
        this.scrollToSection(sections[nextIndex]);
    }
    
    scrollToPreviousSection() {
        const sections = ['home', 'projects', 'writing', 'contact'];
        const current = window.navigation?.adaptive?.getCurrentSection() || 'home';
        const currentIndex = sections.indexOf(current);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
        
        this.scrollToSection(sections[prevIndex]);
    }
    
    // Public API
    getAnimations() {
        return this.animations;
    }
    
    refreshScrollTrigger() {
        ScrollTrigger.refresh();
    }
    
    destroy() {
        ScrollTrigger.killAll();
        gsap.killTweensOf("*");
    }
}

// Initialize the portfolio app
document.addEventListener('DOMContentLoaded', () => {
    const portfolioApp = new PortfolioApp();
    
    // Expose for debugging
    window.portfolioApp = portfolioApp;
    
    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Hide any loading indicators
        const loader = document.querySelector('.loader');
        if (loader) {
            gsap.to(loader, {
                duration: 0.5,
                opacity: 0,
                onComplete: () => loader.remove()
            });
        }
    });
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }, 0);
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp };
}
