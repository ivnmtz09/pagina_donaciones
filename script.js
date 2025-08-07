// Animaciones de entrada cuando los elementos son visibles
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el observer para animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.animationDelay = delay + 'ms';
                    entry.target.classList.add('fade-in');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos que necesitan animación
    const elementsToAnimate = document.querySelectorAll('.school-card, .item-card, .thank-you-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Animación de las barras de progreso
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 1000);

    // Efecto de partículas flotantes (opcional)
    createFloatingElements();

    // Inicializar todos los contadores
    Object.keys(counters).forEach(item => {
        updateDisplay(item);
    });
    
    // Actualizar total inicial
    updateTotal();
    
    // Agregar efecto de hover a las nuevas tarjetas de galería
    document.querySelectorAll('.drawing-frame, .photo-frame').forEach(frame => {
        frame.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(1deg) scale(1.02)';
        });
        
        frame.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg) scale(1)';
        });
    });
});

// Función para crear elementos flotantes decorativos
function createFloatingElements() {
    const container = document.body;
    const elements = ['⭐', '🌟', '✨', '🎈', '🎊'];
    
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
        element.style.position = 'fixed';
        element.style.left = Math.random() * 100 + 'vw';
        element.style.top = Math.random() * 100 + 'vh';
        element.style.fontSize = (Math.random() * 20 + 10) + 'px';
        element.style.opacity = '0.3';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '-1';
        element.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        element.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(element);
        
        // Remover el elemento después de un tiempo para evitar acumulación
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 10000);
    }
}

// Efecto de hover mejorado para las tarjetas
document.querySelectorAll('.item-card, .school-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Función para reiniciar animaciones cuando se hace scroll hacia arriba
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop < lastScrollTop) {
        // Scrolling hacia arriba - reiniciar algunas animaciones
        const visibleElements = document.querySelectorAll('.fade-in');
        visibleElements.forEach(el => {
            if (isElementInViewport(el)) {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }, 10);
            }
        });
    }
    
    lastScrollTop = scrollTop;
});

// Función auxiliar para verificar si un elemento está en el viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Contadores de útiles escolares
const counters = {
    lapiceros: 25,
    lapices: 40,
    cuadernos: 18,
    reglas: 12,
    escuadras: 8,
    tijeras: 15,
    colores: 22,
    calculadoras: 6,
    clips: 50,
    carpetas: 14
};

// Función para actualizar contador
function updateCounter(item, change) {
    counters[item] = Math.max(0, counters[item] + change);
    updateDisplay(item);
    updateTotal();
    
    // Efecto visual
    const card = document.getElementById(`count-${item}`).closest('.item-card');
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
}

// Función para establecer contador manualmente
function setCounter(item, value) {
    const numValue = parseInt(value) || 0;
    counters[item] = Math.max(0, numValue);
    updateDisplay(item);
    updateTotal();
}

// Función para actualizar la visualización
function updateDisplay(item) {
    const countElement = document.getElementById(`count-${item}`);
    const inputElement = document.getElementById(`input-${item}`);
    
    let unit = 'unidades';
    if (item === 'colores') unit = 'cajas';
    
    countElement.textContent = `${counters[item]} ${unit}`;
    inputElement.value = counters[item];
    
    // Actualizar barra de progreso
    const progressBar = countElement.closest('.item-card').querySelector('.progress-fill');
    const maxValues = {
        lapiceros: 50, lapices: 60, cuadernos: 30, reglas: 20,
        escuadras: 15, tijeras: 25, colores: 30, calculadoras: 10,
        clips: 100, carpetas: 20
    };
    
    const percentage = Math.min(100, (counters[item] / maxValues[item]) * 100);
    progressBar.style.width = percentage + '%';
}

// Función para actualizar el total
function updateTotal() {
    const total = Object.values(counters).reduce((sum, count) => sum + count, 0);
    const totalElement = document.getElementById('total-count');
    
    // Animación del contador
    const currentTotal = parseInt(totalElement.textContent) || 0;
    animateNumber(totalElement, currentTotal, total, 500);
}

// Función para animar números
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (difference * progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Función para compartir contenido
function shareContent() {
    const url = window.location.href;
    const title = 'Donaciones Escolares - ¡Ayudando a niños de nuestros colegios!';
    const text = `¡Mira nuestra campaña de donaciones escolares! Hemos recolectado útiles para los colegios Madre Verónica y Eusebio Séptimio Mary. 🎒📚`;
    
    // Intentar usar la API nativa de compartir si está disponible
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            showShareMessage('¡Contenido compartido exitosamente! 🎉');
        }).catch((error) => {
            // Si falla, usar clipboard
            fallbackShare(url);
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        fallbackShare(url);
    }
}

// Función de respaldo para compartir
function fallbackShare(url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showShareMessage('¡Enlace copiado al portapapeles! 📋✨');
        }).catch(() => {
            // Último recurso: seleccionar texto
            showShareMessage('Copia este enlace: ' + url);
        });
    } else {
        // Crear un elemento temporal para copiar
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showShareMessage('¡Enlace copiado al portapapeles! 📋✨');
    }
}

// Función para mostrar mensaje de compartir
function showShareMessage(message) {
    const messageElement = document.getElementById('share-message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

// Función para resetear todos los contadores (útil para demostraciones)
function resetAllCounters() {
    Object.keys(counters).forEach(item => {
        counters[item] = 0;
        updateDisplay(item);
    });
    updateTotal();
}

// Función para cargar datos de ejemplo
function loadSampleData() {
    const sampleData = {
        lapiceros: 25, lapices: 40, cuadernos: 18, reglas: 12,
        escuadras: 8, tijeras: 15, colores: 22, calculadoras: 6,
        clips: 50, carpetas: 14
    };
    
    Object.keys(sampleData).forEach(item => {
        counters[item] = sampleData[item];
        updateDisplay(item);
    });
    updateTotal();
}

// Agregar funciones globales para facilitar el uso
window.resetAllCounters = resetAllCounters;
window.loadSampleData = loadSampleData;
