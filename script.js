// Animaciones de entrada cuando los elementos son visibles
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupMobileMenu();
});

function initializeApp() {
    // Configurar observador para animaciones
    setupAnimationObserver();
    
    // Generar tarjetas de donaciones
    generateDonationCards();
    
    // Actualizar displays iniciales
    updateAllDisplays();
    
    // Configurar efectos adicionales
    setupAdditionalEffects();
    
    // Si es página admin, configurar estadísticas
    if (isAdminPage) {
        updateStats();
    }
    
    // Crear elementos flotantes decorativos
    createFloatingElements();
    
    // Configurar smooth scrolling para navegación
    setupSmoothScrolling();
}

function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupAnimationObserver() {
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

    // Observar elementos que necesitan animación
    const elementsToAnimate = document.querySelectorAll('.school-card, .item-card, .thank-you-card, .mission-container, .importance-container, .info-card, .stats-container, .contact-info-section, .credits-section');
    elementsToAnimate.forEach((el, idx) => {
        el.style.opacity = 0;
        el.style.animationDelay = (idx * 120) + 'ms';
        observer.observe(el);
    });
}

function generateDonationCards() {
    if (isAdminPage) {
        // Generar lista vertical para admin
        const list = document.getElementById('admin-donations-list');
        if (!list) return;
        list.innerHTML = '';
        Object.entries(schoolSupplies).forEach(([key, supply], index) => {
            const li = document.createElement('li');
            li.className = 'donation-list-item';
            li.innerHTML = `
                <img src="img/${supply.image}" alt="${supply.name}" class="list-item-image" onerror="this.style.display='none';">
                <span class="list-item-name">${supply.name}</span>
                <div class="counter-controls">
                    <button class="counter-btn" onclick="updateCounter('${key}', -1)"><i class="fas fa-minus"></i></button>
                    <input type="number" id="input-${key}" min="0" value="${counters[key]}" onchange="setCounter('${key}', this.value)">
                    <button class="counter-btn" onclick="updateCounter('${key}', 1)"><i class="fas fa-plus"></i></button>
                </div>
            `;
            list.appendChild(li);
        });
    } else {
        // Página pública: grid de tarjetas
        const grid = document.getElementById('donations-grid');
        if (!grid) return;
        grid.innerHTML = '';
        Object.entries(schoolSupplies).forEach(([key, supply], index) => {
            const card = createDonationCard(key, supply, index);
            grid.appendChild(card);
        });
    }
}

function createDonationCard(key, supply, index) {
    const card = document.createElement('div');
    card.className = 'item-card fade-in';
    card.setAttribute('data-delay', index * 200);
    
    const imageElement = `<img src="img/${supply.image}" alt="${supply.name}" class="item-image" onerror="this.style.display='none';">`;
    
    const controlsElement = isAdminPage ? 
        `<div class="counter-controls">
            <button class="counter-btn" onclick="updateCounter('${key}', -1)">
                <i class="fas fa-minus"></i>
            </button>
            <input type="number" id="input-${key}" min="0" value="${counters[key]}" onchange="setCounter('${key}', this.value)">
            <button class="counter-btn" onclick="updateCounter('${key}', 1)">
                <i class="fas fa-plus"></i>
            </button>
        </div>` : '';
    
    card.innerHTML = `
        ${imageElement}
        <h4>${supply.name}</h4>
        <div class="quantity" id="count-${key}">${counters[key]} ${supply.unit}</div>
        ${controlsElement}
        <div class="progress-bar">
            <div class="progress-fill" id="progress-${key}"></div>
        </div>
    `;
    
    return card;
}

// Función para crear elementos flotantes decorativos
function createFloatingElements() {
    const container = document.body;
    // Reemplazando emojis con iconos de Font Awesome
    const elements = [
        '<i class="fas fa-star"></i>',
        '<i class="fas fa-lightbulb"></i>',
        '<i class="fas fa-gift"></i>',
        '<i class="fas fa-pencil-alt"></i>',
        '<i class="fas fa-book"></i>',
        '<i class="fas fa-ruler"></i>',
        '<i class="fas fa-calculator"></i>',
        '<i class="fas fa-paperclip"></i>'
    ];
    
    for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
        element.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            font-size: ${Math.random() * 15 + 10}px;
            opacity: 0.2;
            pointer-events: none;
            z-index: -1;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            color: var(--accent-yellow); /* Make icons yellow */
        `;
        
        container.appendChild(element);
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 15000);
    }
}

// Configuración de útiles escolares
const schoolSupplies = {
    lapiceros: { name: 'Lapiceros', unit: 'unidades', max: 50, image: 'lapicero.png' },
    lapices: { name: 'Lápices', unit: 'unidades', max: 60, image: 'lapiz.png' },
    cuadernos: { name: 'Cuadernos', unit: 'unidades', max: 30, image: 'cuadernos.png' },
    reglas: { name: 'Reglas', unit: 'unidades', max: 20, image: 'reglas.png' },
    escuadras: { name: 'Escuadras', unit: 'unidades', max: 15, image: 'escuadras.png' },
    tijeras: { name: 'Tijeras', unit: 'unidades', max: 25, image: 'tijeras.png' },
    colores: { name: 'Colores', unit: 'cajas', max: 30, image: 'colores.png' },
    calculadoras: { name: 'Calculadoras', unit: 'unidades', max: 10, image: 'calculadoras.png' },
    clips: { name: 'Clips', unit: 'unidades', max: 100, image: 'clips.png' },
    carpetas: { name: 'Carpetas', unit: 'unidades', max: 20, image: 'carpetas.png' },
    grapas: { name: 'Grapas', unit: 'cajas', max: 25, image: 'grapadoras.png' },
    borradores: { name: 'Borradores', unit: 'unidades', max: 40, image: 'borrador.png' },
    agendas: { name: 'Agendas', unit: 'unidades', max: 20, image: 'agendas.png' },
    chinches: { name: 'Chinches', unit: 'unidades', max: 80, image: 'chinches.png' },
    sacapuntas: { name: 'Sacapuntas', unit: 'unidades', max: 30, image: 'sacapuntas.png' }
};

// Sistema de almacenamiento local
class DonationStorage {
    static STORAGE_KEY = 'school_donations_data';
    
    static save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }
    
    static load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : this.getDefaultData();
        } catch (error) {
            console.error('Error loading data:', error);
            return this.getDefaultData();
        }
    }
    
    static getDefaultData() {
        const defaultData = {};
        Object.keys(schoolSupplies).forEach(key => {
            defaultData[key] = 0;
        });
        return defaultData;
    }
    
    static reset() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error resetting data:', error);
            return false;
        }
    }
}

// Contadores globales
let counters = DonationStorage.load();
let isAdminPage = document.body.classList.contains('admin-page');

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
                    el.style.animation = 'zoomInFade 0.8s ease-out forwards'; // Usar la nueva animación
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

function updateCounter(item, change) {
    if (!isAdminPage) return; // Solo admin puede modificar
    
    counters[item] = Math.max(0, counters[item] + change);
    saveAndUpdate(item);
    
    // Efecto visual
    const card = document.getElementById(`count-${item}`).closest('.item-card');
    if (card) { // Check if card exists (it won't on admin page for list items)
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }
}

function setCounter(item, value) {
    if (!isAdminPage) return; // Solo admin puede modificar
    
    const numValue = parseInt(value) || 0;
    counters[item] = Math.max(0, numValue);
    saveAndUpdate(item);
}

function saveAndUpdate(item) {
    // Guardar en localStorage
    DonationStorage.save(counters);
    
    // Actualizar displays
    updateDisplay(item);
    updateTotal();
    
    if (isAdminPage) {
        updateStats();
    }
}

function updateDisplay(item) {
    const supply = schoolSupplies[item];
    const countElement = document.getElementById(`count-${item}`);
    const inputElement = document.getElementById(`input-${item}`);
    const progressElement = document.getElementById(`progress-${item}`);
    
    if (countElement) {
        countElement.textContent = `${counters[item]} ${supply.unit}`;
    }
    
    if (inputElement) {
        inputElement.value = counters[item];
    }
    
    if (progressElement) {
        const percentage = Math.min(100, (counters[item] / supply.max) * 100);
        progressElement.style.width = percentage + '%';
    }
}

function updateAllDisplays() {
    Object.keys(schoolSupplies).forEach(item => {
        updateDisplay(item);
    });
    updateTotal();
}

function updateTotal() {
    const total = Object.values(counters).reduce((sum, count) => sum + count, 0);
    const totalElement = document.getElementById('total-count');
    
    if (totalElement) {
        const currentTotal = parseInt(totalElement.textContent) || 0;
        animateNumber(totalElement, currentTotal, total, 500);
    }
}

function updateStats() {
    if (!isAdminPage) return;
    
    const total = Object.values(counters).reduce((sum, count) => sum + count, 0);
    const itemsWithDonations = Object.values(counters).filter(count => count > 0).length;
    const totalMax = Object.values(schoolSupplies).reduce((sum, supply) => sum + supply.max, 0);
    const progressPercentage = Math.round((total / totalMax) * 100);
    const estimatedBeneficiaries = Math.floor(total / 10); // Estimación: 1 niño por cada 10 útiles
    
    // Actualizar elementos de estadísticas
    updateStatElement('stat-items', itemsWithDonations);
    updateStatElement('stat-total', total);
    updateStatElement('stat-progress', progressPercentage + '%');
    updateStatElement('stat-beneficiaries', estimatedBeneficiaries);
}

function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        const currentValue = parseInt(element.textContent) || 0;
        if (typeof value === 'string' && value.includes('%')) {
            element.textContent = value;
        } else {
            animateNumber(element, currentValue, value, 300);
        }
    }
}

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

function resetAllCounters() {
    if (!isAdminPage) return;
    
    if (confirm('¿Estás seguro de que quieres resetear todos los contadores a 0?')) {
        Object.keys(counters).forEach(item => {
            counters[item] = 0;
        });
        
        DonationStorage.save(counters);
        updateAllDisplays();
        
        if (isAdminPage) {
            updateStats();
        }
        
        // Mostrar mensaje de confirmación
        showNotification('✅ Todos los contadores han sido reseteados', 'success');
    }
}

function shareContent() {
    const url = window.location.origin + '/index.html';
    const title = 'Donaciones Escolares - I.E. Eusebio Séptimo María';
    const text = `¡Mira nuestra campaña de donaciones escolares! Hemos recolectado útiles para ayudar a niños de escasos recursos. 🎒📚`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            showShareMessage('¡Contenido compartido exitosamente! 🎉');
        }).catch(() => {
            fallbackShare(url);
        });
    } else {
        fallbackShare(url);
    }
}

function fallbackShare(url) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showShareMessage('¡Enlace copiado al portapapeles! 📋✨');
        }).catch(() => {
            showShareMessage('Copia este enlace: ' + url);
        });
    } else {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showShareMessage('¡Enlace copiado al portapapeles! 📋✨');
    }
}

function showShareMessage(message) {
    const messageElement = document.getElementById('share-message');
    if (messageElement) {
        messageElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function setupAdditionalEffects() {
    // Efectos hover para tarjetas
    document.querySelectorAll('.item-card, .school-card, .mission-card, .importance-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.style.transform.includes('scale')) {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Recargar datos cada 2 segundos si no es admin (para sincronización en tiempo real)
if (!isAdminPage) {
    setInterval(() => {
        const newData = DonationStorage.load();
        let hasChanges = false;
        Object.keys(newData).forEach(key => {
            if (counters[key] !== newData[key]) {
                hasChanges = true;
                counters[key] = newData[key];
            }
        });
        if (hasChanges) {
            updateAllDisplays();
        }
    }, 2000);

    // Escuchar cambios en localStorage desde otras pestañas
    window.addEventListener('storage', (event) => {
        if (event.key === DonationStorage.STORAGE_KEY) {
            const newData = DonationStorage.load();
            let hasChanges = false;
            Object.keys(newData).forEach(key => {
                if (counters[key] !== newData[key]) {
                    hasChanges = true;
                    counters[key] = newData[key];
                }
            });
            if (hasChanges) {
                updateAllDisplays();
            }
        }
    });
}
