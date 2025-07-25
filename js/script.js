// Variables globales
let currentLang = 'es';
let isAudioPlaying = false;
let backgroundMusic = document.getElementById('backgroundMusic');

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
        // Remover clase active de todos los botones
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        
        // Aquí puedes agregar la lógica para cambiar de sección
        const section = this.dataset.section;
        console.log('Navegando a:', section);
        
        // Placeholder para futuras secciones
        // navigateToSection(section);
    });
});

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

// ===== EFECTO DE SEGUIMIENTO DEL MOUSE =====
let mouseX = 0;
let mouseY = 0;
let isMouseTracking = true;

// Función para suavizar el movimiento
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Seguimiento del movimiento del mouse
document.addEventListener('mousemove', function(e) {
    if (!isMouseTracking) return;
    
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
    
    // Obtener el centro del contenedor de la imagen
    const containerRect = characterContainer.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    
    // Calcular la diferencia entre el mouse y el centro de la imagen
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    
    // Limitar el rango de movimiento (más sutil en móviles)
    const maxMove = window.innerWidth <= 768 ? 15 : 25;
    const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX * 0.035));
    const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY * 0.035));
    
    // Aplicar la transformación suave
    const currentTransform = characterImage.style.transform || 'translate(0px, 0px)';
    const currentX = parseFloat(currentTransform.match(/translateX?\(([^)]+)px\)/) ? currentTransform.match(/translateX?\(([^)]+)px\)/)[1] : 0);
    const currentY = parseFloat(currentTransform.match(/translateY\(([^)]+)px\)/) ? currentTransform.match(/translateY\(([^)]+)px\)/)[1] : 0);
    
    // Suavizar el movimiento
    const smoothX = lerp(currentX, moveX, 0.1);
    const smoothY = lerp(currentY, moveY, 0.1);
    
    // Aplicar la transformación
    characterImage.style.transform = `translate(${smoothX}px, ${smoothY}px)`;
    characterImage.style.transition = 'transform 0.1s ease-out';
    
    requestAnimationFrame(animateCharacterFollow);
}

// Función para pausar/reanudar el seguimiento (opcional)
function toggleMouseTracking() {
    isMouseTracking = !isMouseTracking;
    
    // Si se desactiva, volver a la posición original
    if (!isMouseTracking) {
        const characterImage = document.querySelector('.character-image');
        if (characterImage) {
            characterImage.style.transform = 'translate(0px, 0px)';
        }
    }
}

// Pausar el seguimiento en dispositivos móviles para mejor rendimiento
function handleMobileInteractions() {
    if (window.innerWidth <= 768) {
        isMouseTracking = false;
    } else {
        isMouseTracking = true;
    }
}

// Inicializar el efecto cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    handleMobileInteractions();
    
    // Esperar un poco para que la imagen se cargue completamente
    setTimeout(() => {
        animateCharacterFollow();
    }, 500);
});

// Manejar cambios de orientación y redimensionamiento
window.addEventListener('resize', function() {
    handleMobileInteractions();
});

// Pausar el seguimiento cuando el mouse sale de la ventana
document.addEventListener('mouseleave', function() {
    const characterImage = document.querySelector('.character-image');
    if (characterImage) {
        characterImage.style.transform = 'translate(0px, 0px)';
    }
});

// Reanudar cuando el mouse vuelve a entrar
document.addEventListener('mouseenter', function() {
    if (window.innerWidth > 768) {
        isMouseTracking = true;
    }
});

// Inicializar
loadCharacterImage('assets/images/personaje_inicio.png');