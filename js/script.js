// Variables globales
let currentLang = 'es';
let isAudioPlaying = false;
let backgroundMusic = document.getElementById('backgroundMusic');

// Variables para el seguimiento del movimiento
let mouseX = 0;
let mouseY = 0;
let isMouseTracking = true;
let isMobile = false;

// Variables para el giroscopio
let deviceOrientation = {
    alpha: 0, // Rotación en Z
    beta: 0,  // Rotación en X (adelante/atrás)
    gamma: 0  // Rotación en Y (izquierda/derecha)
};
let isGyroActive = false;
let gyroSupported = false;

// Traducciones
const translations = {
    es: {
        subtitle: "DISEÑADOR Y DESARROLLADOR DE SOFTWARE",
        skillsBtn: "HABILIDADES",
        projectsBtn: "PROYECTOS"
    },
    en: {
        subtitle: "SOFTWARE DESIGNER AND DEVELOPER",
        skillsBtn: "SKILLS",
        projectsBtn: "PROJECTS"
    }
};

// Control de audio
document.getElementById('audioBtn').addEventListener('click', function() {
    const audioBtn = this;
    const audioIcon = document.getElementById('audioIcon');
    
    if (isAudioPlaying) {
        backgroundMusic.pause();
        audioBtn.classList.add('muted');
        audioIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        isAudioPlaying = false;
    } else {
        backgroundMusic.play().catch(e => {
            console.log('Error al reproducir audio:', e);
        });
        audioBtn.classList.remove('muted');
        audioIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>';
        isAudioPlaying = true;
    }
});

// Control de idioma
document.getElementById('langBtn').addEventListener('click', function() {
    const langText = document.getElementById('langText');
    
    if (currentLang === 'es') {
        currentLang = 'en';
        langText.textContent = 'EN';
    } else {
        currentLang = 'es';
        langText.textContent = 'ES';
    }
    
    updateTexts();
});

// Función para actualizar textos
function updateTexts() {
    const texts = translations[currentLang];
    
    document.getElementById('subtitle').textContent = texts.subtitle;
    document.getElementById('skillsBtn').textContent = texts.skillsBtn;
    document.getElementById('projectsBtn').textContent = texts.projectsBtn;
}

// Navegación
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const section = this.dataset.section;
        console.log('Navegando a:', section);
        navigateToSection(section);
    });
});

// Función para navegar a diferentes secciones
function navigateToSection(section) {
    switch(section) {
        case 'skills':
            document.body.style.opacity = '0.8';
            document.body.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                window.location.href = 'habilidades.html';
            }, 200);
            break;
        case 'projects':
            document.body.style.opacity = '0.8';
            document.body.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                window.location.href = 'proyectos.html';
            }, 200);
            break;
        default:
            console.log('Sección no reconocida:', section);
    }
}

// Función para mostrar notificaciones estilizadas
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: rgba(168, 85, 247, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 1.1rem;
        font-weight: 600;
        text-align: center;
        max-width: 400px;
        transition: all 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translate(-50%, -50%) scale(0)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para cargar la imagen del personaje
function loadCharacterImage(imagePath) {
    const placeholder = document.getElementById('characterPlaceholder');
    const img = placeholder.querySelector('.character-image');
    
    if (img) {
        img.onerror = function() {
            console.log('Error al cargar la imagen del personaje');
            placeholder.innerHTML = 'Error al cargar el personaje';
        };
    }
}

// ===== DETECCIÓN DE DISPOSITIVO MÓVIL =====
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768 && 'ontouchstart' in window);
}

// ===== CONFIGURACIÓN DEL GIROSCOPIO =====

// NUEVA FUNCIÓN para solicitar permisos automáticamente
async function requestGyroPermission() {
    try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
            startGyroListening();
        } else {
            gyroSupported = false;
        }
    } catch (error) {
        console.error('Error al solicitar permisos de giroscopio:', error);
        showNotification('No se pudo activar el movimiento automático.', 'error');
        gyroSupported = false;
    }
}

// FUNCIÓN ACTUALIZADA para inicializar el giroscopio
function initGyroscope() {
    if (window.DeviceOrientationEvent) {
        gyroSupported = true;
        
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            requestGyroPermission();
        } else {
            startGyroListening();
            // Opcional: podrías mostrar una notificación aquí si quieres
            // showNotification('Movimiento 3D activado.', 'success');
        }
    } else {
        console.log('Giroscopio no soportado en este dispositivo');
        gyroSupported = false;
    }
}

// Iniciar escucha del giroscopio
function startGyroListening() {
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    isGyroActive = true;
    console.log('Giroscopio activado');
}

// Manejar eventos de orientación del dispositivo
function handleDeviceOrientation(event) {
    if (!isMobile || !isGyroActive) return;
    
    deviceOrientation.alpha = event.alpha || 0;
    deviceOrientation.beta = event.beta || 0;
    deviceOrientation.gamma = event.gamma || 0;
}

// ===== EFECTO DE SEGUIMIENTO UNIFICADO =====
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Seguimiento del movimiento del mouse (escritorio)
document.addEventListener('mousemove', function(e) {
    if (!isMouseTracking || isMobile) return;
    
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Función de animación para el seguimiento suave
function animateCharacterFollow() {
    const characterImage = document.querySelector('.character-image');
    const characterContainer = document.querySelector('.character-placeholder');
    
    if (!characterImage || !characterContainer) {
        requestAnimationFrame(animateCharacterFollow);
        return;
    }
    
    let moveX = 0;
    let moveY = 0;
    
    if (isMobile && isGyroActive) {
        const maxMove = 30;
        moveX = (deviceOrientation.gamma / 90) * maxMove;
        moveY = (deviceOrientation.beta / 180) * maxMove * 0.5;
        
        moveX = Math.max(-maxMove, Math.min(maxMove, moveX));
        moveY = Math.max(-maxMove * 0.7, Math.min(maxMove * 0.7, moveY));
        
    } else if (!isMobile) {
        const containerRect = characterContainer.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;
        
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        
        const maxMove = 25;
        moveX = Math.max(-maxMove, Math.min(maxMove, deltaX * 0.035));
        moveY = Math.max(-maxMove, Math.min(maxMove, deltaY * 0.035));
    }
    
    const currentTransform = characterImage.style.transform || 'translate(0px, 0px)';
    const currentX = parseFloat(currentTransform.match(/translateX?\(([^)]+)px\)/) ? currentTransform.match(/translateX?\(([^)]+)px\)/)[1] : 0);
    const currentY = parseFloat(currentTransform.match(/translateY\(([^)]+)px\)/) ? currentTransform.match(/translateY\(([^)]+)px\)/)[1] : 0);
    
    const lerpFactor = isMobile ? 0.08 : 0.1;
    const smoothX = lerp(currentX, moveX, lerpFactor);
    const smoothY = lerp(currentY, moveY, lerpFactor);
    
    characterImage.style.transform = `translate(${smoothX}px, ${smoothY}px)`;
    characterImage.style.transition = isMobile ? 'transform 0.15s ease-out' : 'transform 0.1s ease-out';
    
    requestAnimationFrame(animateCharacterFollow);
}

// Función para pausar/reanudar el seguimiento
function toggleMouseTracking() {
    isMouseTracking = !isMouseTracking;
    
    if (!isMouseTracking) {
        const characterImage = document.querySelector('.character-image');
        if (characterImage) {
            characterImage.style.transform = 'translate(0px, 0px)';
        }
    }
}

// Configurar interacciones según el dispositivo
function setupDeviceInteractions() {
    isMobile = isMobileDevice();
    
    if (isMobile) {
        console.log('Dispositivo móvil detectado - Inicializando giroscopio');
        isMouseTracking = false;
        initGyroscope();
    } else {
        console.log('Dispositivo de escritorio detectado - Usando mouse');
        isMouseTracking = true;
        isGyroActive = false;
    }
}

// ===== EFECTOS ADICIONALES PARA NAVEGACIÓN =====
function createNavigationParticles(button) {
    const rect = button.getBoundingClientRect();
    const particleCount = 8;
    
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
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            opacity: 1;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 40 + Math.random() * 20;
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(${-50 + Math.cos(angle) * distance}%, ${-50 + Math.sin(angle) * distance}%) scale(0)`, opacity: 0 }
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

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    setupDeviceInteractions();
    
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            createNavigationParticles(this);
        });
        
        btn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
    
    setTimeout(() => {
        animateCharacterFollow();
    }, 500);
    
    const mainElements = [
        '.main-title',
        '.subtitle', 
        '.social-icons',
        '.character-container',
        '.bottom-bar'
    ];
    
    mainElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.transition = 'all 0.3s ease';
        }
    });
});

// Manejar cambios de orientación y tamaño de ventana
window.addEventListener('resize', function() {
    setupDeviceInteractions();
});

// Optimización de rendimiento
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isMouseTracking = false;
        isGyroActive = false;
        document.body.style.animationPlayState = 'paused';
    } else {
        if (isMobile && gyroSupported) {
            isGyroActive = true;
        } else if (!isMobile) {
            isMouseTracking = true;
        }
        document.body.style.animationPlayState = 'running';
    }
});

// Pausar cuando el mouse sale (solo escritorio)
document.addEventListener('mouseleave', function() {
    if (!isMobile) {
        const characterImage = document.querySelector('.character-image');
        if (characterImage) {
            characterImage.style.transform = 'translate(0px, 0px)';
        }
    }
});

// Reanudar cuando el mouse vuelve (solo escritorio)
document.addEventListener('mouseenter', function() {
    if (!isMobile) {
        isMouseTracking = true;
    }
});

// ===== FUNCIONES DE UTILIDAD GLOBALES =====
function createPageTransition(targetPage) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #a855f7, #1a0a2e);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 40px; height: 40px; border: 3px solid white; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            Cargando...
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        window.location.href = targetPage;
    }, 800);
}

function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Inicializar carga de imagen
loadCharacterImage('assets/images/personaje_inicio.png');

// Exportar funciones para uso global si es necesario
window.MainPageUtils = {
    createPageTransition,
    showNotification,
    toggleMouseTracking,
    respectsReducedMotion,
    setupDeviceInteractions,
    initGyroscope
};