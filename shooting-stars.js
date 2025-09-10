document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.shooting-star');

    // Inicializar la variable global de pausa si no existe
    if (typeof window.animationsPaused === 'undefined') {
        window.animationsPaused = false;
    }

    // Función para iniciar la animación de estrellas fugaces
    const shootStars = () => {
        // No iniciar nuevas animaciones si las animaciones están pausadas
        if (window.animationsPaused) {
            return;
        }

        const numStars = Math.floor(Math.random() * 3) + 1; // 1, 2, o 3 estrellas
        const availableStars = Array.from(stars).filter(star => !star.classList.contains('shooting'));

        for (let i = 0; i < Math.min(numStars, availableStars.length); i++) {
            const star = availableStars[i];
            setTimeout(() => {
                // Verificar nuevamente si las animaciones están pausadas antes de iniciar
                if (!window.animationsPaused) {
                    star.classList.add('shooting');
                    
                    // Cuando termina la animación, quitamos la clase
                    star.addEventListener('animationend', () => {
                        star.classList.remove('shooting');
                    }, { once: true });
                }
            }, i * 800); // Espaciamos las estrellas en un grupo
        }
    };

    // Ejecutamos la función inmediatamente para ver estrellas al cargar
    shootStars();
    
    // Y luego cada 15 segundos
    setInterval(shootStars, 15000);
});