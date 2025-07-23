/**
 * Adaptive Navigation System
 * Handles morphing navigation between horizontal and vertical layouts
 */

class AdaptiveNavigation {
    constructor() {
        this.nav = document.getElementById('navigation');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.indicator = document.querySelector('.nav-indicator');
        
        this.currentSection = 'home';
        this.isCompact = false;
        this.isSidebar = false;
        this.scrollThreshold = 100;
        this.sidebarThreshold = 300;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateIndicator();
        this.updateActiveSection();
        
        // Set initial mode based on screen size
        if (window.innerWidth <= 768) {
            this.setMobileMode();
        } else {
            this.handleScroll(); // Initial check
        }
    }
    
    setupEventListeners() {
        // Scroll handling
        window.addEventListener('scroll', this.debounce(() => {
            this.handleScroll();
            this.updateActiveSection();
        }, 10));
        
        // Navigation click handling
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                console.log('Nav link clicked:', targetSection); // Debug
                this.navigateToSection(targetSection);
            });
        });
        
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            }
        });
        
        // Window resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleKeyboardNavigation(e);
            }
        });
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Don't change navigation state on mobile
        if (window.innerWidth <= 768) {
            return;
        }
        
        // Determine navigation state based on scroll position
        if (scrollY > this.sidebarThreshold && window.innerWidth > 1024) {
            this.setSidebarMode();
        } else if (scrollY > this.scrollThreshold) {
            this.setCompactMode();
        } else {
            this.setNormalMode();
        }
    }
    
    handleResize() {
        // Reset to appropriate mode based on screen size
        if (window.innerWidth <= 768) {
            this.setMobileMode();
        } else {
            this.nav.classList.remove('mobile');
            this.handleScroll();
        }
        
        this.updateIndicator();
    }
    
    setMobileMode() {
        this.nav.classList.add('mobile');
        this.nav.classList.remove('compact', 'sidebar');
        this.isCompact = false;
        this.isSidebar = false;
    }
    
    setNormalMode() {
        if (!this.isCompact && !this.isSidebar) return;
        
        this.nav.classList.remove('compact', 'sidebar');
        this.isCompact = false;
        this.isSidebar = false;
        
        // Animate back to normal
        gsap.to(this.nav, {
            duration: 0.4,
            ease: "back.out(1.7)",
            onComplete: () => {
                this.updateIndicator();
            }
        });
    }
    
    setCompactMode() {
        if (this.isCompact || this.isSidebar) return;
        
        this.nav.classList.add('compact');
        this.nav.classList.remove('sidebar');
        this.isCompact = true;
        this.isSidebar = false;
        
        // Animate to compact
        gsap.to(this.nav, {
            duration: 0.4,
            ease: "back.out(1.7)",
            onComplete: () => {
                this.updateIndicator();
            }
        });
    }
    
    setSidebarMode() {
        if (this.isSidebar) return;
        
        this.nav.classList.add('sidebar');
        this.nav.classList.remove('compact');
        this.isSidebar = true;
        this.isCompact = false;
        
        // Animate to sidebar
        gsap.to(this.nav, {
            duration: 0.4,
            ease: "back.out(1.7)",
            onComplete: () => {
                this.updateIndicator();
            }
        });
    }
    
    updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        let activeSection = 'home';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.id;
            }
        });
        
        if (activeSection !== this.currentSection) {
            this.setActiveSection(activeSection);
        }
    }
    
    setActiveSection(sectionId) {
        this.currentSection = sectionId;
        
        // Update active link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
                
                // Add color accent
                const color = link.getAttribute('data-color');
                link.style.setProperty('--accent-color', color);
            }
        });
        
        this.updateIndicator();
        this.updateTheme(sectionId);
    }
    
    updateIndicator() {
        if (this.isSidebar || window.innerWidth <= 768) return; // No indicator in sidebar mode or mobile
        
        const activeLink = document.querySelector('.nav-link.active');
        if (!activeLink) return;
        
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = this.navMenu.getBoundingClientRect();
        
        const left = linkRect.left - navRect.left;
        const width = linkRect.width;
        
        if (typeof gsap !== 'undefined' && gsap.to) {
            gsap.to(this.indicator, {
                duration: 0.3,
                left: left,
                width: width,
                ease: "power2.out"
            });
        } else {
            // Fallback for when GSAP is not available
            this.indicator.style.left = left + 'px';
            this.indicator.style.width = width + 'px';
        }
        
        // Update indicator color
        const color = activeLink.getAttribute('data-color');
        this.indicator.style.background = `linear-gradient(90deg, ${color}, ${color}aa)`;
    }
    
    updateTheme(sectionId) {
        // Update CSS custom properties based on active section
        const sectionColors = {
            home: '#3B82F6',
            projects: '#10B981',
            writing: '#F59E0B',
            contact: '#8B5CF6'
        };
        
        const color = sectionColors[sectionId] || '#3B82F6';
        document.documentElement.style.setProperty('--color-primary', color);
        
        // Update scroll progress color
        const scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
            scrollProgress.style.background = `linear-gradient(90deg, ${color}, ${color}aa)`;
        }
    }
    
    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;
        
        this.setActiveSection(sectionId);
        this.smoothScrollTo(targetSection);
    }
    
    smoothScrollTo(element) {
        const isMobile = window.innerWidth <= 768;
        const navHeight = isMobile ? 70 : (this.isSidebar ? 20 : 80);
        const offsetTop = element.offsetTop - navHeight;
        
        console.log('Scrolling to:', element.id, 'offsetTop:', offsetTop); // Debug
        
        // Use native smooth scroll for better compatibility
        try {
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        } catch (e) {
            // Fallback for older browsers
            window.scrollTo(0, offsetTop);
        }
    }
    
    handleKeyboardNavigation(e) {
        const focusedElement = document.activeElement;
        const currentIndex = Array.from(this.navLinks).indexOf(focusedElement);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        
        if (e.shiftKey) {
            // Previous link
            nextIndex = currentIndex > 0 ? currentIndex - 1 : this.navLinks.length - 1;
        } else {
            // Next link
            nextIndex = currentIndex < this.navLinks.length - 1 ? currentIndex + 1 : 0;
        }
        
        e.preventDefault();
        this.navLinks[nextIndex].focus();
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public API methods
    goToSection(sectionId) {
        this.navigateToSection(sectionId);
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
    
    getNavigationState() {
        return {
            isCompact: this.isCompact,
            isSidebar: this.isSidebar,
            currentSection: this.currentSection
        };
    }
}

/**
 * Scroll Progress Indicator
 */
class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scrollProgress');
        this.init();
    }
    
    init() {
        if (!this.progressBar) return;
        
        window.addEventListener('scroll', this.debounce(() => {
            this.updateProgress();
        }, 10));
    }
    
    updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        this.progressBar.style.width = scrolled + '%';
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

/**
 * Mobile Navigation Handler
 */
class MobileNavigation {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }
    
    init() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.handleMobileLayout();
        });
        
        this.handleMobileLayout();
    }
    
    handleMobileLayout() {
        const nav = document.getElementById('navigation');
        
        if (this.isMobile) {
            nav.classList.add('mobile');
            nav.classList.remove('compact', 'sidebar');
        } else {
            nav.classList.remove('mobile');
        }
    }
}

/**
 * Intersection Observer for section detection
 */
class SectionObserver {
    constructor(navigation) {
        this.navigation = navigation;
        this.init();
    }
    
    init() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.navigation.setActiveSection(entry.target.id);
                }
            });
        }, options);
        
        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            this.observer.observe(section);
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Initialize navigation system
document.addEventListener('DOMContentLoaded', () => {
    // Initialize adaptive navigation
    const adaptiveNav = new AdaptiveNavigation();
    
    // Initialize scroll progress
    const scrollProgress = new ScrollProgress();
    
    // Initialize mobile navigation
    const mobileNav = new MobileNavigation();
    
    // Initialize section observer (alternative to scroll-based detection)
    const sectionObserver = new SectionObserver(adaptiveNav);
    
    // Expose for debugging
    window.navigation = {
        adaptive: adaptiveNav,
        scrollProgress: scrollProgress,
        mobile: mobileNav,
        observer: sectionObserver
    };
    
    // Add smooth reveal animations to navigation
    gsap.from('.nav-item', {
        duration: 0.8,
        y: -20,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.2
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        AdaptiveNavigation, 
        ScrollProgress, 
        MobileNavigation, 
        SectionObserver 
    };
}
