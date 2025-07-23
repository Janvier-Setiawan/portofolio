/**
 * Particle Background System
 * Creates an animated network of connected particles
 */

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.isMouseActive = false;
        
        // Mobile detection
        this.isMobile = window.innerWidth <= 768;
        
        // Configuration (optimized for mobile)
        this.config = {
            particleCount: this.isMobile ? 50 : 100,
            particleSize: { min: 1, max: this.isMobile ? 2 : 3 },
            particleSpeed: { min: 0.05, max: this.isMobile ? 0.15 : 0.25 },
            connectionDistance: this.isMobile ? 80 : 120,
            mouseInteractionDistance: this.isMobile ? 100 : 150,
            colors: {
                particles: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
                connections: 'rgba(59, 130, 246, 0.1)',
                mouseConnections: 'rgba(59, 130, 246, 0.2)'
            },
            fadeDistance: 100,
            glowEffect: !this.isMobile // Disable glow on mobile for performance
        };
        
        this.init();
        this.setupEventListeners();
        this.startAnimation();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed.max,
                vy: (Math.random() - 0.5) * this.config.particleSpeed.max,
                size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
                color: this.config.colors.particles[Math.floor(Math.random() * this.config.colors.particles.length)],
                opacity: Math.random() * 0.5 + 0.3,
                originalOpacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.resizeCanvas();
            this.createParticles();
        });
        
        // Mouse tracking (disabled on mobile for performance)
        if (!this.isMobile) {
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.isMouseActive = true;
            });
            
            document.addEventListener('mouseleave', () => {
                this.isMouseActive = false;
            });
        }
        
        // Pause when tab is not active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx = -particle.vx;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy = -particle.vy;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Mouse interaction (only on desktop)
            if (this.isMouseActive && !this.isMobile) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseInteractionDistance) {
                    const force = (this.config.mouseInteractionDistance - distance) / this.config.mouseInteractionDistance;
                    const forceX = (dx / distance) * force * 0.01;
                    const forceY = (dy / distance) * force * 0.01;
                    
                    particle.vx += forceX;
                    particle.vy += forceY;
                    
                    // Limit velocity
                    const maxVel = this.config.particleSpeed.max * 2;
                    particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
                    particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
                    
                    particle.opacity = Math.min(1, particle.originalOpacity + force * 0.5);
                } else {
                    particle.opacity = particle.originalOpacity;
                    particle.vx *= 0.99;
                    particle.vy *= 0.99;
                }
            } else {
                particle.opacity = particle.originalOpacity;
                particle.vx *= 0.995;
                particle.vy *= 0.995;
            }
            
            // Ensure minimum velocity
            if (Math.abs(particle.vx) < this.config.particleSpeed.min) {
                particle.vx = (Math.random() - 0.5) * this.config.particleSpeed.min * 2;
            }
            if (Math.abs(particle.vy) < this.config.particleSpeed.min) {
                particle.vy = (Math.random() - 0.5) * this.config.particleSpeed.min * 2;
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            
            // Simple particles for mobile, enhanced for desktop
            if (this.config.glowEffect) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = particle.color;
            }
            
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        this.ctx.save();
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particleA = this.particles[i];
                const particleB = this.particles[j];
                
                const dx = particleA.x - particleB.x;
                const dy = particleA.y - particleB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    
                    this.ctx.strokeStyle = this.config.colors.connections;
                    this.ctx.globalAlpha = opacity * 0.5;
                    this.ctx.lineWidth = 1;
                    
                    // Enhanced connection near mouse (desktop only)
                    if (this.isMouseActive && !this.isMobile) {
                        const mouseDistA = Math.sqrt(
                            Math.pow(this.mouse.x - particleA.x, 2) + 
                            Math.pow(this.mouse.y - particleA.y, 2)
                        );
                        const mouseDistB = Math.sqrt(
                            Math.pow(this.mouse.x - particleB.x, 2) + 
                            Math.pow(this.mouse.y - particleB.y, 2)
                        );
                        
                        const minMouseDist = Math.min(mouseDistA, mouseDistB);
                        if (minMouseDist < this.config.mouseInteractionDistance) {
                            const enhancement = 1 - (minMouseDist / this.config.mouseInteractionDistance);
                            this.ctx.strokeStyle = this.config.colors.mouseConnections;
                            this.ctx.globalAlpha = opacity * (0.5 + enhancement * 0.5);
                            this.ctx.lineWidth = 1 + enhancement;
                        }
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particleA.x, particleA.y);
                    this.ctx.lineTo(particleB.x, particleB.y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.restore();
    }
    
    drawMouseConnections() {
        if (!this.isMouseActive || this.isMobile) return;
        
        this.ctx.save();
        
        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseInteractionDistance) {
                const opacity = 1 - (distance / this.config.mouseInteractionDistance);
                
                this.ctx.strokeStyle = this.config.colors.mouseConnections;
                this.ctx.globalAlpha = opacity * 0.3;
                this.ctx.lineWidth = 1;
                
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });
        
        this.ctx.restore();
    }
    
    animate() {
        // Clear canvas with trail effect
        this.ctx.fillStyle = 'rgba(15, 15, 35, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawMouseConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stopAnimation();
    }
}

// Initialize the particle system
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    
    if (canvas) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            const particleSystem = new ParticleSystem(canvas);
            
            // Expose particle system for debugging
            window.particleSystem = particleSystem;
        } else {
            // Fallback for users who prefer reduced motion
            canvas.style.background = 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)';
        }
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem };
}
