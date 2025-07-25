// ===== SISTEMA DE PANTALLA DE CARGA =====

class LoadingScreen {
    constructor() {
        this.progress = 0;
        this.loadingScreen = null;
        this.progressRing = null;
        this.progressText = null;
        this.loadingMessage = null;
        this.isLoading = true;
        this.loadingMessages = [
            'Inicializando universo...',
            'Creando estrellas...',
            'Configurando asteroides...',
            'Ajustando nebulosas...',
            'Sincronizando elementos...',
            'Optimizando experiencia...',
            'Preparando interfaz...',
            'Cargando recursos...',
            'Finalizando detalles...',
            'Casi listo...'
        ];
        this.currentMessageIndex = 0;
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.createLoadingScreen();
        this.createParticles();
        this.startLoading();
    }
    
    createLoadingScreen() {
        // Crear el contenedor principal
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        
        // HTML de la pantalla de carga
        this.loadingScreen.innerHTML = `
            <!-- Efecto de resplandor de fondo -->
            <div class="loading-glow"></div>
            
            <!-- Partículas flotantes -->
            <div class="loading-particles"></div>
            
            <!-- Contenido principal -->
            <div class="loading-content">
                <h1 class="loading-title">GAEL ZÁRATE</h1>
                <p class="loading-subtitle">CARGANDO EXPERIENCIA</p>
                
                <!-- Barra de progreso circular -->
                <div class="progress-container">
                    <svg class="progress-ring" width="120" height="120">
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#a855f7"/>
                                <stop offset="50%" stop-color="#D8A7D8"/>
                                <stop offset="100%" stop-color="#e879f9"/>
                            </linearGradient>
                        </defs>
                        <circle class="progress-ring-bg" cx="60" cy="60" r="54"/>
                        <circle class="progress-ring-fill" cx="60" cy="60" r="54"/>
                    </svg>
                    <div class="progress-text">0%</div>
                </div>
                
                <!-- Mensaje de carga -->
                <div class="loading-message">Inicializando universo...</div>
            </div>
        `;
        
        // Insertar al principio del body
        document.body.insertBefore(this.loadingScreen, document.body.firstChild);
        
        // Obtener referencias a elementos
        this.progressRing = this.loadingScreen.querySelector('.progress-ring-fill');
        this.progressText = this.loadingScreen.querySelector('.progress-text');
        this.loadingMessage = this.loadingScreen.querySelector('.loading-message');
        this.particleContainer = this.loadingScreen.querySelector('.loading-particles');
    }
    
    createParticles() {
        const particleCount = window.innerWidth <= 768 ? 15 : 25;
        const sizes = ['small', 'medium', 'large'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `loading-particle ${sizes[Math.floor(Math.random() * sizes.length)]}`;
            
            // Posición aleatoria
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            
            this.particleContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    startLoading() {
        // Simular carga progresiva
        const loadingSteps = [
            { progress: 10, duration: 300 },
            { progress: 25, duration: 500 },
            { progress: 40, duration: 400 },
            { progress: 55, duration: 600 },
            { progress: 70, duration: 450 },
            { progress: 85, duration: 400 },
            { progress: 95, duration: 300 },
            { progress: 100, duration: 200 }
        ];
        
        let currentStep = 0;
        
        const executeStep = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];
                
                setTimeout(() => {
                    this.updateProgress(step.progress);
                    this.updateMessage();
                    currentStep++;
                    executeStep();
                }, step.duration);
            } else {
                // Terminar carga
                setTimeout(() => {
                    this.finishLoading();
                }, 500);
            }
        };
        
        executeStep();
    }
    
    updateProgress(newProgress) {
        this.progress = newProgress;
        
        // Actualizar barra circular
        const circumference = 2 * Math.PI * 54; // radio = 54
        const offset = circumference - (this.progress / 100) * circumference;
        
        if (this.progressRing) {
            this.progressRing.style.strokeDashoffset = offset;
        }
        
        // Actualizar texto del porcentaje
        if (this.progressText) {
            this.progressText.textContent = Math.round(this.progress) + '%';
        }
    }
    
    updateMessage() {
        if (this.currentMessageIndex < this.loadingMessages.length - 1) {
            this.currentMessageIndex++;
        }
        
        if (this.loadingMessage) {
            // Efecto de fade para cambiar el mensaje
            this.loadingMessage.style.opacity = '0';
            
            setTimeout(() => {
                this.loadingMessage.textContent = this.loadingMessages[this.currentMessageIndex];
                this.loadingMessage.style.opacity = '0.7';
            }, 250);
        }
    }
    
    finishLoading() {
        this.isLoading = false;
        
        // Agregar clase para ocultar la pantalla
        this.loadingScreen.classList.add('hidden');
        
        // Esperar a que termine la transición y luego eliminar del DOM
        setTimeout(() => {
            if (this.loadingScreen && this.loadingScreen.parentNode) {
                this.loadingScreen.parentNode.removeChild(this.loadingScreen);
            }
            
            // Disparar evento personalizado cuando termine la carga
            document.dispatchEvent(new CustomEvent('loadingComplete'));
            
            // Inicializar el universo si no se ha hecho ya
            this.initializeMainContent();
        }, 800);
    }
    
    initializeMainContent() {
        // Asegurarse de que el universo se inicialice después de la carga
        if (window.UniverseBackground && !window.universeBackground) {
            setTimeout(() => {
                window.universeBackground = new window.UniverseBackground();
            }, 200);
        }
        
        // Inicializar cualquier otro contenido necesario
        document.body.style.overflow = 'hidden'; // Restaurar el overflow del body
    }
    
    // Método para forzar el fin de la carga (útil para desarrollo)
    forceFinish() {
        this.updateProgress(100);
        setTimeout(() => {
            this.finishLoading();
        }, 300);
    }
    
    // Método para pausar/reanudar animaciones en dispositivos móviles
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reducir partículas en móviles
            this.particles.forEach((particle, index) => {
                if (index % 2 === 0) {
                    particle.style.display = 'none';
                }
            });
        }
    }
}

// Variables globales
let loadingScreenInstance;

// Inicializar la pantalla de carga antes de que se cargue todo
(function() {
    // Prevenir scroll durante la carga
    document.body.style.overflow = 'hidden';
    
    // Crear instancia de loading screen inmediatamente
    loadingScreenInstance = new LoadingScreen();
    
    // Optimizar para móviles
    if (window.innerWidth <= 768) {
        loadingScreenInstance.optimizeForMobile();
    }
})();

// Listener para cuando termine la carga
document.addEventListener('loadingComplete', function() {
    console.log('🚀 Carga completada - Universo inicializado');
});

// Optimizar en cambio de orientación
window.addEventListener('resize', function() {
    if (loadingScreenInstance && loadingScreenInstance.isLoading) {
        loadingScreenInstance.optimizeForMobile();
    }
});

// Exportar para uso global
window.LoadingScreen = LoadingScreen;