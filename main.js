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
        // Solo vincular los controles existentes del HTML
        this.bindControlEvents();
        
        // Configurar estado inicial e intentar reproducir
        if (this.audio) {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Autoplay started
                    document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">⏸️</span>';
                    this.isPlaying = true;
                    this.resumeAnimations(); // Keep animations running
                }).catch(error => {
                    // Autoplay was prevented.
                    console.warn('Autoplay was prevented. User interaction needed.', error);
                    document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">▶️</span>';
                    this.isPlaying = false;
                    this.pauseAnimations(); // Pause animations since audio is paused
                    this.showPlayPrompt();
                });
            }

            document.getElementById('muteBtn').innerHTML = this.audio.muted ? '<span class="mute-icon">🔇</span>' : '<span class="mute-icon">🔊</span>';
        }
    }

    bindControlEvents() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const muteBtn = document.getElementById('muteBtn');
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }
    }

    togglePlayPause() {
        if (!this.audio) return;

        if (this.isPlaying) {
            this.audio.pause();
            this.pauseAnimations();
            document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">▶️</span>';
        } else {
            this.audio.play().catch(e => {
                console.warn('Autoplay blocked:', e);
                this.showPlayPrompt();
            });
            this.resumeAnimations();
            document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">⏸️</span>';
        }
        
        this.isPlaying = !this.isPlaying;
    }

    toggleMute() {
        if (!this.audio) return;
        
        this.audio.muted = !this.audio.muted;
        document.getElementById('muteBtn').innerHTML = this.audio.muted ? '<span class="mute-icon">🔇</span>' : '<span class="mute-icon">🔊</span>';
    }

    toggleReducedMotion() {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.body.classList.toggle('reduced-motion', !prefersReduced);
        
        // Guardar preferencia
        localStorage.setItem('reducedMotion', !prefersReduced);
    }

    showPlayPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'play-prompt';
        prompt.innerHTML = `
            <p>🎵 Haz clic para comenzar la experiencia musical</p>
            <button onclick="this.parentElement.remove()" class="close-btn">×</button>
        `;
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
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'm':
                case 'M':
                    this.toggleMute();
                    break;
                case 'r':
                    this.toggleReducedMotion();
                    break;
                case 'Escape':
                    // Cerrar cualquier modal/prompt
                    document.querySelectorAll('.play-prompt').forEach(el => el.remove());
                    break;
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
