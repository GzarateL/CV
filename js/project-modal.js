// ===== SISTEMA DE MODAL PARA PROYECTOS =====

class ProjectModal {
    constructor() {
        this.isOpen = false;
        this.currentProject = null;
        this.currentSlide = 0;
        this.slides = [];
        this.modal = null;
        this.carousel = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createModal();
        this.setupEventListeners();
        console.log('🎯 Modal de proyectos inicializado');
    }
    
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'project-modal';
        this.modal.innerHTML = `
            <div class="project-modal-content">
                <button class="modal-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
                
                <div class="project-carousel">
                    <div class="carousel-container"></div>
                    
                    <button class="carousel-nav carousel-prev">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    
                    <button class="carousel-nav carousel-next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>
                    
                    <div class="carousel-indicators"></div>
                </div>
                
                <div class="project-modal-info">
                    <h3 class="modal-project-title"></h3>
                    <p class="modal-project-description"></p>
                    <div class="modal-project-tech"></div>
                    <div class="modal-project-links"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        // Referencias a elementos
        this.carousel = this.modal.querySelector('.carousel-container');
        this.indicators = this.modal.querySelector('.carousel-indicators');
        this.prevBtn = this.modal.querySelector('.carousel-prev');
        this.nextBtn = this.modal.querySelector('.carousel-next');
        this.closeBtn = this.modal.querySelector('.modal-close');
    }
    
    setupEventListeners() {
        // Botón de cierre
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Click fuera del modal para cerrar
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Navegación del carrusel
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Teclas del teclado
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
            }
        });
        
        // Touch events para móviles
        this.carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        // Prevenir scroll del body cuando el modal está abierto
        this.modal.addEventListener('wheel', (e) => {
            if (this.isOpen) {
                e.stopPropagation();
            }
        });
    }
    
    open(projectData) {
        this.currentProject = projectData;
        this.isOpen = true;
        this.currentSlide = 0;
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Llenar información del proyecto
        this.fillProjectInfo();
        
        // Crear slides del carrusel
        this.createCarouselSlides();
        
        // Mostrar modal
        this.modal.classList.add('active');
        
        // Analytics
        console.log('📖 Modal abierto para proyecto:', projectData.title);
    }
    
    close() {
        this.isOpen = false;
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        // Ocultar modal
        this.modal.classList.remove('active');
        
        // Limpiar después de la animación
        setTimeout(() => {
            this.cleanup();
        }, 400);
        
        console.log('❌ Modal cerrado');
    }
    
    fillProjectInfo() {
        const { title, description, technologies, links } = this.currentProject;
        
        // Título
        this.modal.querySelector('.modal-project-title').textContent = title;
        
        // Descripción
        this.modal.querySelector('.modal-project-description').textContent = description;
        
        // Tecnologías
        const techContainer = this.modal.querySelector('.modal-project-tech');
        techContainer.innerHTML = '';
        technologies.forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'modal-tech-tag';
            techTag.textContent = tech;
            techContainer.appendChild(techTag);
        });
        
        // Enlaces (si existen)
        const linksContainer = this.modal.querySelector('.modal-project-links');
        linksContainer.innerHTML = '';
        if (links && links.length > 0) {
            links.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.className = 'modal-project-link';
                linkElement.href = link.url;
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
                linkElement.innerHTML = `
                    ${this.getLinkIcon(link.type)}
                    <span>${link.label}</span>
                `;
                linksContainer.appendChild(linkElement);
            });
        }
    }
    
    getLinkIcon(type) {
        const icons = {
            demo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>`,
            github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>`,
            website: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>`
        };
        
        return icons[type] || icons.website;
    }
    
    createCarouselSlides() {
        const { images } = this.currentProject;
        this.slides = images || [];
        
        // Limpiar carrusel
        this.carousel.innerHTML = '';
        this.indicators.innerHTML = '';
        
        if (this.slides.length === 0) {
            // Si no hay imágenes, mostrar placeholder
            this.carousel.innerHTML = `
                <div class="carousel-slide">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);">
                        <span>No hay imágenes disponibles</span>
                    </div>
                </div>
            `;
            return;
        }
        
        // Crear slides
        this.slides.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = image;
            img.alt = `${this.currentProject.title} - Imagen ${index + 1}`;
            img.loading = 'lazy';
            
            // Loading spinner
            const loading = document.createElement('div');
            loading.className = 'carousel-loading';
            slide.appendChild(loading);
            
            // Manejar carga de imagen
            img.onload = () => {
                img.classList.add('loaded');
                if (slide.contains(loading)) {
                    slide.removeChild(loading);
                }
            };
            
            img.onerror = () => {
                if (slide.contains(loading)) {
                    slide.removeChild(loading);
                }
                slide.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);">
                        <span>Error al cargar imagen</span>
                    </div>
                `;
            };
            
            slide.appendChild(img);
            this.carousel.appendChild(slide);
            
            // Crear indicador
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(indicator);
        });
        
        // Actualizar posición inicial
        this.updateCarousel();
        this.updateNavigation();
    }
    
    nextSlide() {
        if (this.slides.length <= 1) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
    }
    
    previousSlide() {
        if (this.slides.length <= 1) return;
        
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        this.currentSlide = index;
        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
    }
    
    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.carousel.style.transform = `translateX(${translateX}%)`;
    }
    
    updateIndicators() {
        const indicators = this.indicators.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    updateNavigation() {
        // Ocultar navegación si solo hay una imagen
        const showNav = this.slides.length > 1;
        this.prevBtn.style.display = showNav ? 'flex' : 'none';
        this.nextBtn.style.display = showNav ? 'flex' : 'none';
        this.indicators.style.display = showNav ? 'flex' : 'none';
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe izquierda -> siguiente
                this.nextSlide();
            } else {
                // Swipe derecha -> anterior
                this.previousSlide();
            }
        }
    }
    
    cleanup() {
        this.carousel.innerHTML = '';
        this.indicators.innerHTML = '';
        this.currentProject = null;
        this.slides = [];
        this.currentSlide = 0;
    }
    
    // Método público para abrir el modal con datos del proyecto
    static openProject(projectElement) {
        const projectData = ProjectModal.extractProjectData(projectElement);
        
        if (!window.projectModalInstance) {
            window.projectModalInstance = new ProjectModal();
        }
        
        window.projectModalInstance.open(projectData);
    }
    
    // Método estático para extraer datos del proyecto desde el DOM
    static extractProjectData(projectElement) {
        const title = projectElement.querySelector('.project-title').textContent;
        const description = projectElement.querySelector('.project-description').textContent;
        
        // Extraer tecnologías
        const techTags = projectElement.querySelectorAll('.tech-tag');
        const technologies = Array.from(techTags).map(tag => tag.textContent);
        
        // Extraer imágenes
        const images = Array.from(projectElement.querySelectorAll('.project-image img'))
            .map(img => img.src)
            .filter(src => src && !src.includes('placeholder'));
        
        // Enlaces de ejemplo (puedes personalizar según tus necesidades)
        const links = [
        ];
        
        return {
            title,
            description,
            technologies,
            images,
            links
        };
    }
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia global del modal
    window.projectModalInstance = new ProjectModal();
    
    // Agregar event listeners a todas las tarjetas de proyecto
    const setupProjectCards = () => {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            // Remover listeners previos si existen
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            // Agregar nuevo listener
            newCard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                ProjectModal.openProject(newCard);
            });
        });
        
        console.log(`🎯 Event listeners agregados a ${projectCards.length} tarjetas de proyecto`);
    };
    
    // Setup inicial
    setupProjectCards();
    
    // Re-setup cuando se filtran proyectos
    const originalFilterProjects = window.projectsPageInstance?.filterProjects;
    if (originalFilterProjects) {
        window.projectsPageInstance.filterProjects = function(category) {
            originalFilterProjects.call(this, category);
            
            // Re-setup después del filtrado
            setTimeout(setupProjectCards, 500);
        };
    }
    
    console.log('✅ Sistema de modal de proyectos inicializado');
});

// Exportar para uso global
window.ProjectModal = ProjectModal;