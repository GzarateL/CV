// ===== SISTEMA DE HABILIDADES CON UNIVERSO COMPLETO =====

class SkillsUniverseBackground {
    constructor() {
        this.container = null;
        this.stars = [];
        this.asteroids = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.generateStars();
        this.generateAsteroids();
        this.createNebulas();
        this.setupMouseTracking();
        this.startAnimation();
        this.isInitialized = true;
        console.log('🌌 Universo de habilidades inicializado');
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'skills-universe-container';
        this.container.innerHTML = `
            <div class="skills-stars-layer layer-1"></div>
            <div class="skills-stars-layer layer-2"></div>
            <div class="skills-stars-layer layer-3"></div>
        `;
        
        // Insertar en la sección de habilidades
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            skillsSection.insertBefore(this.container, skillsSection.firstChild);
        }
    }
    
    generateStars() {
        const layers = this.container.querySelectorAll('.skills-stars-layer');
        const starCounts = [60, 45, 30]; // Cantidades optimizadas para habilidades
        const starSizes = ['small', 'medium', 'large'];
        
        layers.forEach((layer, layerIndex) => {
            for (let i = 0; i < starCounts[layerIndex]; i++) {
                const star = document.createElement('div');
                star.className = `skills-star ${starSizes[Math.floor(Math.random() * starSizes.length)]}`;
                
                // Posición aleatoria
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                
                // Delay aleatorio para la animación
                star.style.animationDelay = Math.random() * 3 + 's';
                
                layer.appendChild(star);
                this.stars.push({
                    element: star,
                    baseX: parseFloat(star.style.left),
                    baseY: parseFloat(star.style.top),
                    layer: layerIndex + 1
                });
            }
        });
    }
    
    generateAsteroids() {
        const layer = this.container.querySelector('.skills-stars-layer.layer-2');
        const asteroidCount = 12;
        const asteroidSizes = ['small', 'medium', 'large'];
        
        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = document.createElement('div');
            asteroid.className = `skills-asteroid ${asteroidSizes[Math.floor(Math.random() * asteroidSizes.length)]}`;
            
            // Posición aleatoria
            asteroid.style.left = Math.random() * 100 + '%';
            asteroid.style.top = Math.random() * 100 + '%';
            
            // Delay aleatorio para la animación
            asteroid.style.animationDelay = Math.random() * 8 + 's';
            
            layer.appendChild(asteroid);
            this.asteroids.push({
                element: asteroid,
                baseX: parseFloat(asteroid.style.left),
                baseY: parseFloat(asteroid.style.top),
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    createNebulas() {
        const nebulas = [
            { class: 'skills-nebula skills-nebula-1' },
            { class: 'skills-nebula skills-nebula-2' },
            { class: 'skills-nebula skills-nebula-3' }
        ];
        
        nebulas.forEach(nebulaConfig => {
            const nebula = document.createElement('div');
            nebula.className = nebulaConfig.class;
            this.container.appendChild(nebula);
        });
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }
    
    startAnimation() {
        this.animate();
    }
    
    animate() {
        // Animar estrellas con parallax sutil
        this.stars.forEach(star => {
            const parallaxStrength = star.layer * 0.3;
            const moveX = this.mouseX * parallaxStrength;
            const moveY = this.mouseY * parallaxStrength;
            
            star.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Animar asteroides
        this.asteroids.forEach(asteroid => {
            const moveX = this.mouseX * asteroid.speed * 1.5;
            const moveY = this.mouseY * asteroid.speed * 1.5;
            
            asteroid.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.isInitialized = false;
        console.log('🌌 Universo de habilidades destruido');
    }
    
    toggleMobileOptimization() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.stars.forEach((star, index) => {
                if (index % 2 === 0) {
                    star.element.style.display = 'none';
                }
            });
            
            this.asteroids.forEach((asteroid, index) => {
                if (index % 3 === 0) {
                    asteroid.element.style.display = 'none';
                }
            });
        } else {
            this.stars.forEach(star => {
                star.element.style.display = 'block';
            });
            
            this.asteroids.forEach(asteroid => {
                asteroid.element.style.display = 'block';
            });
        }
    }
}

class SkillsPage {
    constructor() {
        this.currentLang = 'es';
        this.isAudioPlaying = false;
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.skillCards = [];
        this.universeBackground = null;
        
        this.translations = {
            es: {
                title: "HABILIDADES",
                subtitle: "TECNOLOGÍAS QUE DOMINO",
                basicLevel: "Básico"
            },
            en: {
                title: "SKILLS",
                subtitle: "TECHNOLOGIES I MASTER",
                basicLevel: "Basic"
            }
        };
        
        this.init();
    }
    
    init() {
        this.initializeUniverse();
        this.setupEventListeners();
        this.initializeSkillCards();
        this.setupAnimations();
    }
    
    // INICIALIZAR EL FONDO DEL UNIVERSO COMPLETO
    initializeUniverse() {
        setTimeout(() => {
            this.universeBackground = new SkillsUniverseBackground();
            console.log('🌌 Universo de habilidades inicializado completamente');
        }, 300);
    }
    
    setupEventListeners() {
        // Control de audio
        const audioBtn = document.getElementById('audioBtn');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => this.toggleAudio());
        }
        
        // Control de idioma
        const langBtn = document.getElementById('langBtn');
        if (langBtn) {
            langBtn.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Botón de regreso
        const backButton = document.getElementById('backToMain');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
        }
        
        // Tecla ESC para regresar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.goBack();
            }
        });
        
        // Efectos de hover en las tarjetas
        this.setupCardEffects();
    }
    
    toggleAudio() {
        const audioBtn = document.getElementById('audioBtn');
        const audioIcon = document.getElementById('audioIcon');
        
        if (this.isAudioPlaying) {
            this.backgroundMusic.pause();
            audioBtn.classList.add('muted');
            audioIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
            this.isAudioPlaying = false;
        } else {
            this.backgroundMusic.play().catch(e => {
                console.log('Error al reproducir audio:', e);
            });
            audioBtn.classList.remove('muted');
            audioIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';
            this.isAudioPlaying = true;
        }
    }
    
    toggleLanguage() {
        const langText = document.getElementById('langText');
        
        if (this.currentLang === 'es') {
            this.currentLang = 'en';
            langText.textContent = 'EN';
        } else {
            this.currentLang = 'es';
            langText.textContent = 'ES';
        }
        
        this.updateTexts();
    }
    
    updateTexts() {
        const texts = this.translations[this.currentLang];
        
        // Actualizar título y subtítulo
        const title = document.querySelector('.skills-title');
        const subtitle = document.querySelector('.skills-subtitle');
        
        if (title) title.textContent = texts.title;
        if (subtitle) subtitle.textContent = texts.subtitle;
        
        // Actualizar niveles básicos
        const basicLevels = document.querySelectorAll('.skill-level');
        basicLevels.forEach(level => {
            level.textContent = texts.basicLevel;
        });
    }
    
    initializeSkillCards() {
        this.skillCards = document.querySelectorAll('.skill-card');
        
        // Agregar delay de animación escalonada
        this.skillCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
        });
    }
    
    setupCardEffects() {
        this.skillCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.onCardHover(e, true));
            card.addEventListener('mouseleave', (e) => this.onCardHover(e, false));
            card.addEventListener('click', (e) => this.onCardClick(e));
        });
    }
    
    onCardHover(event, isEntering) {
        const card = event.currentTarget;
        
        if (isEntering) {
            this.createHoverParticles(card);
            this.addRippleEffect(card, event);
        }
    }
    
    onCardClick(event) {
        const card = event.currentTarget;
        const techName = card.dataset.tech;
        
        // Crear efecto de click
        this.createClickEffect(card, event);
        
        // Log para debug
        console.log(`Clicked on: ${techName}`);
    }
    
    createHoverParticles(card) {
        const rect = card.getBoundingClientRect();
        const particleCount = 4;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: #a855f7;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width/2}px;
                top: ${rect.top + rect.height/2}px;
                opacity: 1;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(particle);
            
            // Animar partícula
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 25 + Math.random() * 15;
            const duration = 600 + Math.random() * 300;
            
            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${-50 + Math.cos(angle) * distance}%, ${-50 + Math.sin(angle) * distance}%) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'ease-out'
            }).onfinish = () => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            };
        }
    }
    
    addRippleEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(168, 85, 247, 0.3);
            border-radius: 50%;
            transform: scale(0);
            pointer-events: none;
            z-index: 0;
        `;
        
        card.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            if (card.contains(ripple)) {
                card.removeChild(ripple);
            }
        };
    }
    
    createClickEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const clickEffect = document.createElement('div');
        
        clickEffect.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            left: ${event.clientX - 10}px;
            top: ${event.clientY - 10}px;
            background: radial-gradient(circle, #a855f7, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1001;
            transform: scale(0);
        `;
        
        document.body.appendChild(clickEffect);
        
        clickEffect.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(3)', opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-out'
        }).onfinish = () => {
            if (document.body.contains(clickEffect)) {
                document.body.removeChild(clickEffect);
            }
        };
    }
    
    setupAnimations() {
        // Animación de entrada para las tarjetas con Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observar todas las tarjetas
        this.skillCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    goBack() {
        // Limpiar el universo antes de salir
        if (this.universeBackground && this.universeBackground.destroy) {
            this.universeBackground.destroy();
        }
        
        // Efecto de salida antes de redirigir
        const skillsSection = document.getElementById('skillsSection');
        if (skillsSection) {
            skillsSection.style.transform = 'scale(0.95)';
            skillsSection.style.opacity = '0';
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }
    
    // Método para agregar una nueva habilidad dinámicamente
    addSkill(techName, displayName, isBasic = false) {
        const container = document.querySelector('.skills-grid-container');
        if (!container) return;
        
        const skillCard = document.createElement('div');
        skillCard.className = `skill-card ${isBasic ? 'masomenos' : ''}`;
        skillCard.dataset.tech = techName;
        
        skillCard.innerHTML = `
            <span class="skill-name">${displayName}</span>
            ${isBasic ? `<span class="skill-level">${this.translations[this.currentLang].basicLevel}</span>` : ''}
        `;
        
        container.appendChild(skillCard);
        
        // Agregar efectos al nuevo elemento
        skillCard.addEventListener('mouseenter', (e) => this.onCardHover(e, true));
        skillCard.addEventListener('mouseleave', (e) => this.onCardHover(e, false));
        skillCard.addEventListener('click', (e) => this.onCardClick(e));
        
        // Animación de entrada
        skillCard.style.opacity = '0';
        skillCard.style.transform = 'translateY(30px) scale(0.9)';
        
        setTimeout(() => {
            skillCard.style.transition = 'all 0.8s ease-out';
            skillCard.style.opacity = '1';
            skillCard.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
    
    // Método para filtrar habilidades por categoría
    filterSkills(category) {
        const categories = {
            frontend: ['html', 'css', 'typescript', 'react', 'nextjs'],
            backend: ['nodejs', 'python', 'php', 'laravel'],
            database: ['mongodb', 'mysql'],
            mobile: ['flutter', 'kotlin', 'swift'],
            tools: ['git', 'github', 'fork', 'vscode', 'androidstudio', 'xampp', 'postman'],
            devops: ['docker', 'aws'],
            design: ['figma'],
            iot: ['arduino']
        };
        
        this.skillCards.forEach(card => {
            const tech = card.dataset.tech;
            const shouldShow = category === 'all' || categories[category]?.includes(tech);
            
            if (shouldShow) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
    
    // Método para búsqueda de habilidades
    searchSkills(searchTerm) {
        const term = searchTerm.toLowerCase();
        
        this.skillCards.forEach(card => {
            const skillName = card.querySelector('.skill-name').textContent.toLowerCase();
            const matches = skillName.includes(term);
            
            if (matches) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
    
    // Método para mostrar todas las habilidades
    showAllSkills() {
        this.skillCards.forEach(card => {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando página de habilidades con universo completo...');
    
    // Esperar un poco para que los elementos se rendericen
    setTimeout(() => {
        window.skillsPageInstance = new SkillsPage();
        console.log('✅ Página de habilidades con universo completo inicializada');
    }, 100);
});

// Limpiar universo al salir de la página
window.addEventListener('beforeunload', function() {
    if (window.skillsPageInstance && window.skillsPageInstance.universeBackground) {
        window.skillsPageInstance.universeBackground.destroy();
    }
});

// Optimización para dispositivos móviles
window.addEventListener('resize', function() {
    // Reducir efectos en pantallas pequeñas para mejor rendimiento
    if (window.innerWidth <= 768 && window.skillsPageInstance) {
        const cards = document.querySelectorAll('.skill-card');
        cards.forEach(card => {
            card.style.transition = 'all 0.2s ease';
        });
        
        // Optimizar universo en móviles
        if (window.skillsPageInstance.universeBackground) {
            window.skillsPageInstance.universeBackground.toggleMobileOptimization();
        }
    }
});

// CORREGIDO: Manejo mejorado del scroll en móviles
document.addEventListener('touchmove', function(e) {
    if (window.innerWidth <= 768) {
        const target = e.target.closest('.skills-section');
        if (target) {
            // Solo permitir scroll vertical, prevenir problemas de scroll horizontal
            // Ya no bloqueamos el evento, permitimos el scroll natural
            return;
        }
    }
}, { passive: true });

// Pausar animaciones cuando la pestaña no está visible
document.addEventListener('visibilitychange', function() {
    if (window.skillsPageInstance && window.skillsPageInstance.universeBackground) {
        const container = window.skillsPageInstance.universeBackground.container;
        if (container) {
            if (document.hidden) {
                container.style.animationPlayState = 'paused';
            } else {
                container.style.animationPlayState = 'running';
            }
        }
    }
});

// Exportar para uso global
window.SkillsPage = SkillsPage;
window.SkillsUniverseBackground = SkillsUniverseBackground;