// ===== SISTEMA DE PROYECTOS CON UNIVERSO COMPLETO - ACTUALIZADO =====

class ProjectsUniverseBackground {
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
        console.log('🌌 Universo de proyectos inicializado');
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'projects-universe-container';
        this.container.innerHTML = `
            <div class="projects-stars-layer layer-1"></div>
            <div class="projects-stars-layer layer-2"></div>
            <div class="projects-stars-layer layer-3"></div>
        `;

        // Insertar en la sección de proyectos
        const projectsSection = document.querySelector('.projects-section');
        if (projectsSection) {
            projectsSection.insertBefore(this.container, projectsSection.firstChild);
        }
    }

    generateStars() {
        const layers = this.container.querySelectorAll('.projects-stars-layer');
        const starCounts = [70, 50, 35]; // Cantidades optimizadas para proyectos
        const starSizes = ['small', 'medium', 'large'];

        layers.forEach((layer, layerIndex) => {
            for (let i = 0; i < starCounts[layerIndex]; i++) {
                const star = document.createElement('div');
                star.className = `projects-star ${starSizes[Math.floor(Math.random() * starSizes.length)]}`;

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
        const layer = this.container.querySelector('.projects-stars-layer.layer-2');
        const asteroidCount = 10;
        const asteroidSizes = ['small', 'medium', 'large'];

        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = document.createElement('div');
            asteroid.className = `projects-asteroid ${asteroidSizes[Math.floor(Math.random() * asteroidSizes.length)]}`;

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
            { class: 'projects-nebula projects-nebula-1' },
            { class: 'projects-nebula projects-nebula-2' },
            { class: 'projects-nebula projects-nebula-3' }
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
        console.log('🌌 Universo de proyectos destruido');
    }

    toggleMobileOptimization() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Hide some stars and asteroids for performance on mobile
            this.stars.forEach((star, index) => {
                star.element.style.display = (index % 2 === 0) ? 'none' : 'block';
            });

            this.asteroids.forEach((asteroid, index) => {
                asteroid.element.style.display = (index % 3 === 0) ? 'none' : 'block';
            });
        } else {
            // Show all for desktop
            this.stars.forEach(star => {
                star.element.style.display = 'block';
            });

            this.asteroids.forEach(asteroid => {
                asteroid.element.style.display = 'block';
            });
        }
    }
}

class ProjectsPage {
    constructor() {
        this.currentLang = 'es';
        this.isAudioPlaying = false;
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.projectCards = [];
        this.universeBackground = null;
        this.currentFilter = 'all';
        this.isFilterAnimating = false;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0; // Detect touch devices

        this.translations = {
            es: {
                title: "PROYECTOS",
                subtitle: "TRABAJOS Y CREACIONES DESTACADAS",
                filters: {
                    all: "Todos",
                    web: "Web",
                    mobile: "Mobile",
                    fullstack: "Full Stack",
                    design: "Diseño"
                }
            },
            en: {
                title: "PROJECTS",
                subtitle: "FEATURED WORKS AND CREATIONS",
                filters: {
                    all: "All",
                    web: "Web",
                    mobile: "Mobile",
                    fullstack: "Full Stack",
                    design: "Design"
                }
            }
        };

        this.init();
    }

    init() {
        this.initializeUniverse();
        this.setupEventListeners();
        this.initializeProjectCards();
        this.setupAnimations();
        this.setupIntersectionObserver();
        this.toggleMobileOptimizedCardEffects(); // Apply initial optimization
    }

    // INICIALIZAR EL FONDO DEL UNIVERSO COMPLETO
    initializeUniverse() {
        setTimeout(() => {
            this.universeBackground = new ProjectsUniverseBackground();
            // Call mobile optimization immediately after universe initialization
            this.universeBackground.toggleMobileOptimization();
            console.log('🌌 Universo de proyectos inicializado completamente');
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
            if (e.key === 'Escape' && !document.querySelector('.project-modal.active')) {
                this.goBack();
            }
        });

        // Filtros de proyectos
        this.setupFilterButtons();

        // Efectos de hover en las tarjetas (SIN CLICK - eso lo maneja el modal)
        this.setupCardEffects();

        // Listen for resize to re-apply mobile optimizations
        window.addEventListener('resize', () => {
            this.toggleMobileOptimizedCardEffects();
            if (this.universeBackground) {
                this.universeBackground.toggleMobileOptimization();
            }
        });
    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isFilterAnimating) return;

                const category = e.target.dataset.category;
                this.filterProjects(category);

                // Actualizar botón activo
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                this.currentFilter = category;
            });
        });
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
        const title = document.querySelector('.projects-title');
        const subtitle = document.querySelector('.projects-subtitle');

        if (title) title.textContent = texts.title;
        if (subtitle) subtitle.textContent = texts.subtitle;

        // Actualizar filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            const category = btn.dataset.category;
            if (texts.filters[category]) {
                btn.textContent = texts.filters[category];
            }
        });
    }

    initializeProjectCards() {
        this.projectCards = document.querySelectorAll('.project-card');

        // Agregar delay de animación escalonada
        this.projectCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    setupCardEffects() {
        // Only attach hover effects if it's not a touch device
        if (!this.isTouchDevice) {
            this.projectCards.forEach(card => {
                card.addEventListener('mouseenter', (e) => this.onCardHover(e, true));
                card.addEventListener('mouseleave', (e) => this.onCardHover(e, false));
            });
        }
    }

    // New method to toggle hover effects based on device type
    toggleMobileOptimizedCardEffects() {
        const cards = document.querySelectorAll('.project-card');
        if (this.isTouchDevice || window.innerWidth <= 768) {
            cards.forEach(card => {
                card.removeEventListener('mouseenter', (e) => this.onCardHover(e, true));
                card.removeEventListener('mouseleave', (e) => this.onCardHover(e, false));
                // Ensure no lingering hover styles from CSS if applicable
                card.style.transition = 'all 0.2s ease'; // Quicker transitions for mobile
                card.style.boxShadow = 'none'; // Remove persistent shadow
            });
        } else {
            // Re-add effects for desktop
            cards.forEach(card => {
                card.addEventListener('mouseenter', (e) => this.onCardHover(e, true));
                card.addEventListener('mouseleave', (e) => this.onCardHover(e, false));
                card.style.transition = 'all 0.6s ease'; // Original desktop transition
            });
        }
    }

    onCardHover(event, isEntering) {
        const card = event.currentTarget;

        // Prevent hover effects on touch devices
        if (this.isTouchDevice || window.innerWidth <= 768) {
            return;
        }

        if (isEntering) {
            this.createHoverParticles(card);
            this.addRippleEffect(card, event);
        }
    }

    createHoverParticles(card) {
        const rect = card.getBoundingClientRect();
        const particleCount = 6;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #a855f7, #e879f9);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                opacity: 1;
                transform: translate(-50%, -50%);
            `;

            document.body.appendChild(particle);

            // Animar partícula
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 30 + Math.random() * 20;
            const duration = 800 + Math.random() * 400;

            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${-50 + Math.cos(angle) * distance}px, ${-50 + Math.sin(angle) * distance}px) scale(0)`,
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

        const size = Math.max(rect.width, rect.height) * 1.5;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.2), transparent);
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
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => {
            if (card.contains(ripple)) {
                card.removeChild(ripple);
            }
        };
    }

    setupAnimations() {
        // Animación de entrada para las tarjetas con Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observar todas las tarjetas
        this.projectCards.forEach(card => {
            observer.observe(card);
        });
    }

    setupIntersectionObserver() {
        // Observer adicional para efectos avanzados
        const advancedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Apply subtle shadow only on non-touch devices or larger screens
                if (!this.isTouchDevice && window.innerWidth > 768) {
                    if (entry.isIntersecting) {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.1)';
                    } else {
                        entry.target.style.boxShadow = 'none';
                    }
                } else {
                    // Ensure no shadow on mobile
                    entry.target.style.boxShadow = 'none';
                }
            });
        }, {
            threshold: 0.3
        });

        this.projectCards.forEach(card => {
            advancedObserver.observe(card);
        });
    }

    filterProjects(category) {
        if (this.isFilterAnimating) return;

        this.isFilterAnimating = true;

        this.projectCards.forEach((card, index) => {
            const cardCategories = card.dataset.category.split(' ');
            const shouldShow = category === 'all' || cardCategories.includes(category);

            // Delay escalonado para la animación
            setTimeout(() => {
                if (shouldShow) {
                    card.classList.remove('filtered-out');
                    card.classList.add('filtered-in');
                    card.style.display = 'block';
                } else {
                    card.classList.remove('filtered-in');
                    card.classList.add('filtered-out');

                    // Ocultar después de la animación
                    setTimeout(() => {
                        if (card.classList.contains('filtered-out')) {
                            card.style.display = 'none';
                        }
                    }, 400);
                }

                // Liberar el flag de animación después del último elemento
                if (index === this.projectCards.length - 1) {
                    setTimeout(() => {
                        this.isFilterAnimating = false;
                    }, 400);
                }
            }, index * 50);
        });

        // Crear efecto de onda en el filtro seleccionado
        this.createFilterWaveEffect(category);
    }

    createFilterWaveEffect(category) {
        const activeBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (!activeBtn) return;

        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: -1;
        `;

        activeBtn.style.position = 'relative';
        activeBtn.appendChild(wave);

        wave.animate([
            { width: '0px', height: '0px', opacity: 0.8 },
            { width: '100px', height: '100px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            if (activeBtn.contains(wave)) {
                activeBtn.removeChild(wave);
            }
        };
    }

    goBack() {
        // Limpiar el universo antes de salir
        if (this.universeBackground && this.universeBackground.destroy) {
            this.universeBackground.destroy();
        }

        // Efecto de salida antes de redirigir
        const projectsSection = document.getElementById('projectsSection');
        if (projectsSection) {
            projectsSection.style.transform = 'scale(0.95)';
            projectsSection.style.opacity = '0';
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }

    // Método para agregar un nuevo proyecto dinámicamente
    addProject(projectData) {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;

        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.category = projectData.category;

        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${projectData.image}" alt="${projectData.title}" loading="lazy">
            </div>
            <div class="project-content">
                <h3 class="project-title">${projectData.title}</h3>
                <p class="project-description">${projectData.description}</p>
                <div class="project-tech">
                    ${projectData.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        grid.appendChild(projectCard);

        // Agregar efectos al nuevo elemento, but only if not touch
        if (!this.isTouchDevice) {
            projectCard.addEventListener('mouseenter', (e) => this.onCardHover(e, true));
            projectCard.addEventListener('mouseleave', (e) => this.onCardHover(e, false));
        }

        // Animación de entrada
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(30px) scale(0.9)';

        setTimeout(() => {
            projectCard.style.transition = 'all 0.8s ease-out';
            projectCard.classList.add('visible');
        }, 100);

        // Actualizar la lista de tarjetas
        this.projectCards = document.querySelectorAll('.project-card');
    }

    // Método para búsqueda de proyectos
    searchProjects(searchTerm) {
        const term = searchTerm.toLowerCase();

        this.projectCards.forEach(card => {
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const technologies = Array.from(card.querySelectorAll('.tech-tag'))
                .map(tag => tag.textContent.toLowerCase()).join(' ');

            const matches = title.includes(term) ||
                description.includes(term) ||
                technologies.includes(term);

            if (matches) {
                card.classList.remove('filtered-out');
                card.classList.add('filtered-in');
                card.style.display = 'block';
            } else {
                card.classList.remove('filtered-in');
                card.classList.add('filtered-out');
                setTimeout(() => {
                    if (card.classList.contains('filtered-out')) {
                        card.style.display = 'none';
                    }
                }, 400);
            }
        });
    }

    // Método para mostrar todos los proyectos
    showAllProjects() {
        this.projectCards.forEach(card => {
            card.classList.remove('filtered-out');
            card.classList.add('filtered-in');
            card.style.display = 'block';
        });

        // Resetear filtro activo
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
        this.currentFilter = 'all';
    }

    // Método para obtener estadísticas de proyectos
    getProjectStats() {
        const stats = {
            total: this.projectCards.length,
            byCategory: {},
            technologies: {}
        };

        this.projectCards.forEach(card => {
            const categories = card.dataset.category.split(' ');
            const techTags = card.querySelectorAll('.tech-tag');

            // Contar por categoría
            categories.forEach(category => {
                stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            });

            // Contar tecnologías
            techTags.forEach(tag => {
                const tech = tag.textContent;
                stats.technologies[tech] = (stats.technologies[tech] || 0) + 1;
            });
        });

        return stats;
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando página de proyectos con universo completo...');

    // Esperar un poco para que los elementos se rendericen
    setTimeout(() => {
        window.projectsPageInstance = new ProjectsPage();
        console.log('✅ Página de proyectos con universo completo inicializada');
    }, 100);
});

// Limpiar universo al salir de la página
window.addEventListener('beforeunload', function() {
    if (window.projectsPageInstance && window.projectsPageInstance.universeBackground) {
        window.projectsPageInstance.universeBackground.destroy();
    }
});

// Optimización para dispositivos móviles y prevenir scroll horizontal
document.addEventListener('touchmove', function(e) {
    // Only apply this logic on mobile to prevent horizontal scroll if it's the main scroll
    if (window.innerWidth <= 768) {
        const startY = e.touches[0].clientY;
        const startX = e.touches[0].clientX;

        // Use a flag to avoid adding multiple listeners
        if (!e.target.dataset.hasMoveListener) {
            e.target.dataset.hasMoveListener = 'true';
            e.target.addEventListener('touchmove', function handler(moveEvent) {
                const deltaY = Math.abs(moveEvent.touches[0].clientY - startY);
                const deltaX = Math.abs(moveEvent.touches[0].clientX - startX);

                // Prevent default only if horizontal movement is significantly greater than vertical
                if (deltaX > deltaY + 5) { // Added a small threshold
                    moveEvent.preventDefault();
                }
            }, { passive: false });

            // Remove the temporary listener after touch ends
            e.target.addEventListener('touchend', function clearListener() {
                e.target.removeEventListener('touchmove', handler);
                e.target.removeEventListener('touchend', clearListener);
                delete e.target.dataset.hasMoveListener;
            });
        }
    }
}, { passive: false }); // Ensure passive is false for preventDefault to work


// Pausar animaciones cuando la pestaña no está visible
document.addEventListener('visibilitychange', function() {
    if (window.projectsPageInstance && window.projectsPageInstance.universeBackground) {
        const container = window.projectsPageInstance.universeBackground.container;
        if (container) {
            if (document.hidden) {
                container.style.animationPlayState = 'paused';
            } else {
                container.style.animationPlayState = 'running';
            }
        }
    }
});

// Funciones de utilidad global
window.ProjectsUtils = {
    // Función para crear una nueva tarjeta de proyecto
    createProjectCard: function(projectData) {
        if (window.projectsPageInstance) {
            window.projectsPageInstance.addProject(projectData);
        }
    },

    // Función para buscar proyectos
    searchProjects: function(term) {
        if (window.projectsPageInstance) {
            window.projectsPageInstance.searchProjects(term);
        }
    },

    // Función para obtener estadísticas
    getStats: function() {
        if (window.projectsPageInstance) {
            return window.projectsPageInstance.getProjectStats();
        }
        return null;
    },

    // Función para filtrar por categoría
    filterByCategory: function(category) {
        if (window.projectsPageInstance) {
            window.projectsPageInstance.filterProjects(category);
        }
    }
};

// Exportar para uso global
window.ProjectsPage = ProjectsPage;
window.ProjectsUniverseBackground = ProjectsUniverseBackground;

// Funcionalidad adicional: lazy loading de imágenes
document.addEventListener('DOMContentLoaded', function() {
    // Configurar lazy loading para las imágenes de proyectos
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Observar todas las imágenes con data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Manejo de errores de carga de imágenes
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Error cargando imagen:', e.target.src);
        e.target.src = 'assets/images/placeholder-project.jpg'; // Imagen de respaldo
        e.target.alt = 'Imagen no disponible';
    }
}, true);