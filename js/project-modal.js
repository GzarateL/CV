// ===== SISTEMA DE MODAL MEJORADO CON SOPORTE PARA VIDEO =====

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
        this.currentVideo = null; // Para controlar videos
        
        this.init();
    }
    
    init() {
        this.createModal();
        this.setupEventListeners();
        console.log('🎯 Modal de proyectos mejorado inicializado');
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
                case ' ': // Espacio para pausar/reproducir video
                    if (this.currentVideo) {
                        e.preventDefault();
                        this.toggleVideoPlayback();
                    }
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
        
        // Pausar video si está reproduciéndose
        if (this.currentVideo) {
            this.currentVideo.pause();
            this.currentVideo = null;
        }
        
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
    
    // ===== MÉTODO MEJORADO PARA CREAR SLIDES =====
    createCarouselSlides() {
        const { media } = this.currentProject;
        this.slides = media || [];
        
        // Limpiar carrusel
        this.carousel.innerHTML = '';
        this.indicators.innerHTML = '';
        
        if (this.slides.length === 0) {
            // Si no hay medios, mostrar placeholder
            this.carousel.innerHTML = `
                <div class="carousel-slide">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);">
                        <span>No hay contenido multimedia disponible</span>
                    </div>
                </div>
            `;
            return;
        }
        
        // Crear slides
        this.slides.forEach((mediaItem, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            // Determinar el tipo de medio
            const isVideo = mediaItem.type === 'video' || this.isVideoFile(mediaItem.src);
            const src = mediaItem.src;
            const alt = mediaItem.alt || `${this.currentProject.title} - Media ${index + 1}`;
            const fitType = mediaItem.fit || 'contain';
            
            // Agregar clase de ajuste
            slide.classList.add(`fit-${fitType}`);
            
            // Loading spinner
            const loading = document.createElement('div');
            loading.className = 'carousel-loading';
            slide.appendChild(loading);
            
            // Indicador de tipo de media
            const mediaIndicator = document.createElement('div');
            mediaIndicator.className = `media-indicator ${isVideo ? 'video' : 'image'}`;
            mediaIndicator.innerHTML = isVideo ? 
                `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg> Video` : 
                `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg> Imagen`;
            slide.appendChild(mediaIndicator);
            
            if (isVideo) {
                const video = document.createElement('video');
                video.src = src;
                video.alt = alt;
                video.muted = true; // Sin sonido como solicitaste
                video.loop = true;
                video.preload = 'metadata';
                video.playsInline = true;
                
                // Agregar atributos adicionales para mejor compatibilidad
                video.setAttribute('webkit-playsinline', 'true');
                video.setAttribute('playsinline', 'true');
                
                // Manejar carga de video
                video.onloadedmetadata = () => {
                    video.classList.add('loaded');
                    if (slide.contains(loading)) {
                        slide.removeChild(loading);
                    }
                    
                    // Auto-reproducir si es el slide actual
                    if (index === this.currentSlide) {
                        setTimeout(() => this.playCurrentVideo(), 100);
                    }
                };
                
                video.onerror = () => {
                    if (slide.contains(loading)) {
                        slide.removeChild(loading);
                    }
                    if (slide.contains(mediaIndicator)) {
                        slide.removeChild(mediaIndicator);
                    }
                    slide.innerHTML = `
                        <div class="media-indicator error">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Error
                        </div>
                        <div class="error-message">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            </svg>
                            <span>Error al cargar video</span>
                            <small>Verifica que el archivo exista en: ${src}</small>
                        </div>
                    `;
                };
                
                slide.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = src;
                img.alt = alt;
                img.loading = 'lazy';
                
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
                    if (slide.contains(mediaIndicator)) {
                        slide.removeChild(mediaIndicator);
                    }
                    slide.innerHTML = `
                        <div class="media-indicator error">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Error
                        </div>
                        <div class="error-message">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                            </svg>
                            <span>Error al cargar imagen</span>
                            <small>Verifica que el archivo exista en: ${src}</small>
                        </div>
                    `;
                };
                
                slide.appendChild(img);
            }
            
            this.carousel.appendChild(slide);
            
            // Crear indicador
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.title = isVideo ? 'Video' : 'Imagen';
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(indicator);
        });
        
        // Actualizar posición inicial
        this.updateCarousel();
        this.updateNavigation();
        
        // Auto-reproducir video si el primer slide es un video
        setTimeout(() => this.playCurrentVideo(), 500);
    }
    
    isVideoFile(src) {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
        return videoExtensions.some(ext => src.toLowerCase().includes(ext));
    }
    
    playCurrentVideo() {
        // Pausar video anterior
        if (this.currentVideo) {
            this.currentVideo.pause();
        }
        
        // Encontrar y reproducir video actual
        const currentSlideElement = this.carousel.children[this.currentSlide];
        if (currentSlideElement) {
            const video = currentSlideElement.querySelector('video');
            if (video) {
                this.currentVideo = video;
                video.currentTime = 0; // Reiniciar desde el inicio
                video.play().catch(e => {
                    console.log('Error al reproducir video:', e);
                });
            } else {
                this.currentVideo = null;
            }
        }
    }
    
    toggleVideoPlayback() {
        if (this.currentVideo) {
            if (this.currentVideo.paused) {
                this.currentVideo.play();
            } else {
                this.currentVideo.pause();
            }
        }
    }
    
    nextSlide() {
        if (this.slides.length <= 1) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
        this.playCurrentVideo(); // Auto-reproducir video del nuevo slide
    }
    
    previousSlide() {
        if (this.slides.length <= 1) return;
        
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
        this.playCurrentVideo(); // Auto-reproducir video del nuevo slide
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        this.currentSlide = index;
        this.updateCarousel();
        this.updateIndicators();
        this.updateNavigation();
        this.playCurrentVideo(); // Auto-reproducir video del nuevo slide
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
        // Ocultar navegación si solo hay un elemento
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
        // Pausar video
        if (this.currentVideo) {
            this.currentVideo.pause();
            this.currentVideo = null;
        }
        
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
    
    // ===== ACTUALIZACIÓN DEL MÉTODO extractProjectData =====
    static extractProjectData(projectElement) {
        const title = projectElement.querySelector('.project-title').textContent;
        const description = projectElement.querySelector('.project-description').textContent;
        
        // Extraer tecnologías
        const techTags = projectElement.querySelectorAll('.tech-tag');
        const technologies = Array.from(techTags).map(tag => tag.textContent);
        
        // Extraer todas las imágenes y videos del HTML
        const allImages = Array.from(projectElement.querySelectorAll('.project-image img'));
        const allVideos = Array.from(projectElement.querySelectorAll('.project-image video'));
        
        const media = [];
        
        // Agregar imágenes
        allImages.forEach((img, index) => {
            if (img.src && !img.src.includes('placeholder')) {
                media.push({
                    src: img.src,
                    alt: img.alt || `${title} - Imagen ${index + 1}`,
                    fit: img.dataset.fit || 'contain',
                    type: 'image'
                });
            }
        });
        
        // Agregar videos
        allVideos.forEach((video, index) => {
            const source = video.querySelector('source');
            const videoSrc = video.dataset.src || (source ? source.src : video.src);
            
            if (videoSrc) {
                media.push({
                    src: videoSrc,
                    alt: video.alt || `${title} - Video ${index + 1}`,
                    fit: video.dataset.fit || 'contain',
                    type: 'video'
                });
            }
        });
        
        // Enlaces de ejemplo (puedes personalizar según tus necesidades)
        const links = [];
        
        return {
            title,
            description,
            technologies,
            media, // Ahora incluye tanto imágenes como videos del HTML
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
    
    console.log('✅ Sistema de modal de proyectos mejorado inicializado');
});

// Exportar para uso global
window.ProjectModal = ProjectModal;