// Flores Amarillas - Script principal con mejoras de UX y accesibilidad
class FloresAmarillasApp {
    constructor() {
        this.audio = document.getElementById('audio');
        this.lyricsContainer = document.querySelector('.lyrics');
        this.flowers = document.querySelectorAll('.flower');
        this.isInitialized = false;
        this.isPlaying = false;
        this.currentLyricIndex = 0;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('Audio element:', this.audio);
        if (!this.audio) {
            console.error('Audio element not found');
            return;
        }
        
        // Esperar a que el audio esté listo
        this.audio.addEventListener('loadedmetadata', () => {
            console.log('Audio loaded successfully');
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
        });
        
        this.setupAccessibility();
        this.setupControls();
        this.setupAnimations();
        this.setupResponsive();
        this.setupKeyboardNavigation();
        
        // Remover clase container después de cargar
        document.body.classList.remove("container");
        
        this.isInitialized = true;
        console.log('Flores Amarillas app initialized');
    }

    setupAccessibility() {
        // Añadir roles ARIA
        if (this.lyricsContainer) {
            this.lyricsContainer.setAttribute('role', 'status');
            this.lyricsContainer.setAttribute('aria-live', 'polite');
        }
        
        // Añadir descripciones a las flores
        this.flowers.forEach((flower, index) => {
            flower.setAttribute('aria-label', `Flor amarilla ${index + 1}`);
            flower.setAttribute('role', 'img');
        });
    }

    setupControls() {
        // Intentar reproducir automáticamente al cargar
        if (this.audio) {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Autoplay started successfully
                    this.isPlaying = true;
                    this.resumeAnimations();
                    console.log('Audio started automatically');
                }).catch(error => {
                    // Autoplay was prevented - show prompt
                    console.warn('Autoplay was prevented. User interaction needed.', error);
                    this.isPlaying = false;
                    this.pauseAnimations();
                    this.showPlayPrompt();
                });
            }
        }
    }

    showPlayPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'play-prompt';
        prompt.innerHTML = `
            <p>❗ Haga click para que arranque la locomotoraaa</p>
            <button onclick="this.parentElement.remove()" class="close-btn">×</button>
        `;
        
        // Hacer que el prompt funcione como botón de control
        prompt.style.cursor = 'pointer';
        prompt.addEventListener('click', () => {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.resumeAnimations();
                prompt.remove();
            }).catch(error => {
                console.error('Error starting playback:', error);
            });
        });
        
        document.body.appendChild(prompt);
    }

    setupAnimations() {
        // Intersection Observer para animaciones al hacer scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            }, { threshold: 0.1 });

            this.flowers.forEach(flower => observer.observe(flower));
        }

        // Aplicar preferencia de movimiento reducido
        const reducedMotion = localStorage.getItem('reducedMotion') === 'true';
        if (reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    }

    setupResponsive() {
        // Ajustar para móviles
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        if (isMobile) {
            this.optimizeForMobile();
        }

        // Escuchar cambios de orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.optimizeForMobile(), 100);
        });
    }

    optimizeForMobile() {
        // Reducir complejidad visual en móviles
        this.flowers.forEach((flower, index) => {
            if (index > 5) { // Mostrar solo 6 flores en móvil
                flower.style.display = 'none';
            }
        });

        // Ajustar volumen
        if (this.audio) {
            this.audio.volume = 0.7;
        }
    }

    setupKeyboardNavigation() {
        // Solo mantener navegación para movimiento reducido y escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.toggleReducedMotion();
            } else if (e.key === 'Escape') {
                // Cerrar cualquier prompt abierto
                const prompts = document.querySelectorAll('.play-prompt');
                prompts.forEach(prompt => prompt.remove());
            }
        });
    }

    pauseAnimations() {
        // Pausar todas las animaciones CSS
        document.body.classList.add('paused');
        
        // Pausar animaciones de flores individuales
        this.flowers.forEach(flower => {
            flower.style.animationPlayState = 'paused';
        });
        
        // Pausar animaciones de hojas y elementos relacionados
        const animatedElements = document.querySelectorAll('.leaf, .flower__grass, .flower__g-front, .flower__g-fr');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
        
        // Pausar animaciones de mariposas
        const butterflyElements = document.querySelectorAll('.borboletas, .borboleta-1, .borboleta-2, .borboleta-oval, .borboleta-radial, .borboleta-gfx, .borboleta-anim, .borboleta-anim::before');
        butterflyElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
        
        // Pausar animaciones de estrellas fugaces
        const shootingStars = document.querySelectorAll('.shooting-star');
        shootingStars.forEach(star => {
            star.style.animationPlayState = 'paused';
        });
        
        // Establecer una variable global para que shooting-stars.js sepa que está pausado
        window.animationsPaused = true;
        
        console.log('Animaciones pausadas');
    }

    resumeAnimations() {
        // Reanudar todas las animaciones CSS
        document.body.classList.remove('paused');
        
        // Reanudar animaciones de flores individuales
        this.flowers.forEach(flower => {
            flower.style.animationPlayState = 'running';
        });
        
        // Reanudar animaciones de hojas y elementos relacionados
        const animatedElements = document.querySelectorAll('.leaf, .flower__grass, .flower__g-front, .flower__g-fr');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
        
        // Reanudar animaciones de mariposas
        const butterflyElements = document.querySelectorAll('.borboletas, .borboleta-1, .borboleta-2, .borboleta-oval, .borboleta-radial, .borboleta-gfx, .borboleta-anim, .borboleta-anim::before');
        butterflyElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
        
        // Reanudar animaciones de estrellas fugaces
        const shootingStars = document.querySelectorAll('.shooting-star');
        shootingStars.forEach(star => {
            star.style.animationPlayState = 'running';
        });
        
        // Establecer una variable global para que shooting-stars.js sepa que no está pausado
        window.animationsPaused = false;
        
        console.log('Animaciones reanudadas');
    }

    // Gestión de memoria
    destroy() {
        // Limpiar event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('orientationchange', this.optimizeForMobile);
        
        this.isInitialized = false;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
const originalOnload = window.onload;
window.onload = () => {
    if (originalOnload) originalOnload();
    
    // Inicializar la app
    window.floresApp = new FloresAmarillasApp();
    
    // Precargar recursos
    const preloadImages = [
        'img/flowers.png'
    ];
    
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Prevenir scroll accidental en móviles
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

// Detectar preferencias del usuario
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.body.classList.add('reduced-motion');
}

// Guardar estado de la aplicación
window.addEventListener('beforeunload', () => {
    if (window.floresApp) {
        localStorage.setItem('floresState', JSON.stringify({
            isPlaying: window.floresApp.isPlaying,
            volume: window.floresApp.audio?.volume || 1,
            reducedMotion: document.body.classList.contains('reduced-motion')
        }));
    }
});
