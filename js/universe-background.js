// ===== SISTEMA DE FONDO DEL UNIVERSO =====

class UniverseBackground {
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
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'universe-container';
        this.container.innerHTML = `
            <div class="stars-layer layer-1"></div>
            <div class="stars-layer layer-2"></div>
            <div class="stars-layer layer-3"></div>
        `;
        
        // Insertar al principio del body
        document.body.insertBefore(this.container, document.body.firstChild);
    }
    
    generateStars() {
        const layers = this.container.querySelectorAll('.stars-layer');
        const starCounts = [80, 60, 40]; // Diferentes cantidades por capa
        const starSizes = ['small', 'medium', 'large'];
        
        layers.forEach((layer, layerIndex) => {
            for (let i = 0; i < starCounts[layerIndex]; i++) {
                const star = document.createElement('div');
                star.className = `star ${starSizes[Math.floor(Math.random() * starSizes.length)]}`;
                
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
        const layer = this.container.querySelector('.stars-layer.layer-2');
        const asteroidCount = 15;
        const asteroidSizes = ['small', 'medium', 'large'];
        
        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = document.createElement('div');
            asteroid.className = `asteroid ${asteroidSizes[Math.floor(Math.random() * asteroidSizes.length)]}`;
            
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
            { class: 'nebula nebula-1' },
            { class: 'nebula nebula-2' },
            { class: 'nebula nebula-3' }
        ];
        
        nebulas.forEach(nebulaConfig => {
            const nebula = document.createElement('div');
            nebula.className = nebulaConfig.class;
            this.container.appendChild(nebula);
        });
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1; // Normalizar entre -1 y 1
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        });
    }
    
    startAnimation() {
        this.animate();
    }
    
    animate() {
        // Animar estrellas con parallax sutil
        this.stars.forEach(star => {
            const parallaxStrength = star.layer * 0.5; // Diferentes velocidades por capa
            const moveX = this.mouseX * parallaxStrength;
            const moveY = this.mouseY * parallaxStrength;
            
            star.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Animar asteroides con movimiento más notorio pero sutil
        this.asteroids.forEach(asteroid => {
            const moveX = this.mouseX * asteroid.speed * 2;
            const moveY = this.mouseY * asteroid.speed * 2;
            
            asteroid.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Método para pausar/reanudar animaciones en dispositivos móviles
    toggleMobileOptimization() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Reducir la cantidad de elementos en móviles
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
            // Mostrar todos los elementos en desktop
            this.stars.forEach(star => {
                star.element.style.display = 'block';
            });
            
            this.asteroids.forEach(asteroid => {
                asteroid.element.style.display = 'block';
            });
        }
    }
    
    // Método para limpiar el universo (útil para desarrollo)
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.isInitialized = false;
    }
}

// Inicializar el fondo del universo cuando se carga la página
let universeBackground;

document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que el DOM esté completamente cargado
    setTimeout(() => {
        universeBackground = new UniverseBackground();
    }, 100);
});

// Optimizar para dispositivos móviles
window.addEventListener('resize', function() {
    if (universeBackground && universeBackground.isInitialized) {
        universeBackground.toggleMobileOptimization();
    }
});

// Pausar animaciones cuando la pestaña no está visible (optimización de rendimiento)
document.addEventListener('visibilitychange', function() {
    if (universeBackground && universeBackground.container) {
        if (document.hidden) {
            universeBackground.container.style.animationPlayState = 'paused';
        } else {
            universeBackground.container.style.animationPlayState = 'running';
        }
    }
});

// Exportar para uso global si es necesario
window.UniverseBackground = UniverseBackground;