/**
 * PASTELERÍA MIL SABORES - NAVEGACIÓN SPA
 * Sistema de navegación de página única
 */

// ===============================
// INICIALIZACIÓN DE NAVEGACIÓN
// ===============================

// Inicializa el sistema de navegación SPA: enlaces, historial y menú móvil
function inicializarNavegacion() {
    console.log('🚀 Inicializando sistema de navegación...');

    // Configura todos los enlaces del menú y secciones
    configurarEnlacesNavegacion();

    // Habilita la navegación usando el historial del navegador (atrás/adelante)
    window.addEventListener('popstate', (e) => {
        const seccion = e.state?.seccion || 'home';
        navegarA(seccion, false); // Navega sin agregar al historial
    });

    // Configura el funcionamiento del menú móvil
    configurarMenuMovil();

    console.log('✅ Sistema de navegación inicializado');
}

// Configura los listeners para los enlaces del menú y los botones de navegación
function configurarEnlacesNavegacion() {
    // Define los selectores de cada sección principal
    const enlaces = [
        { selector: '[data-section="home"]', seccion: 'home' },
        { selector: '[data-section="productos"]', seccion: 'productos' },
        { selector: '[data-section="registro"]', seccion: 'registro' },
        { selector: '[data-section="login"]', seccion: 'login' },
        { selector: '[data-section="carrito"]', seccion: 'carrito' },
        { selector: '[data-section="contacto"]', seccion: 'contacto' },
        { selector: '[data-section="blog"]', seccion: 'blog' }
    ];

    // Para cada enlace, agrega el evento click para navegar a la sección indicada
    enlaces.forEach(({ selector, seccion }) => {
        document.querySelectorAll(selector).forEach(elemento => {
            elemento.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🔄 Navegando a: ${seccion}`);
                navegarA(seccion); // Llama a la función principal de navegación
            });
        });
    });

    // Botón específico del carrito, si existe (acceso rápido)
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🛒 Navegando al carrito');
            navegarA('carrito');
        });
    }

    console.log('🔗 Enlaces de navegación configurados');
}

// Navega a la sección especificada y actualiza la interfaz y el historial
function navegarA(seccion, pushState = true) {
    console.log(`🎯 Navegando a sección: ${seccion}`);

    // Verifica que el elemento de la sección exista en el DOM
    const seccionEl = document.getElementById(seccion);
    if (!seccionEl) {
        console.error(`❌ Sección no encontrada: ${seccion}`);
        return;
    }

    // Oculta todas las secciones
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Muestra únicamente la sección pedida
    seccionEl.classList.add('active');
    appState.seccionActual = seccion;

    // Actualiza el enlace activo en el menú
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === seccion) {
            link.classList.add('active');
        }
    });

    // Si corresponde, agrega la navegación al historial del navegador
    if (pushState) {
        history.pushState({ seccion }, '', `#${seccion}`);
    }

    // Cierra el menú móvil si estaba abierto
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }

    // Ejecuta la lógica asociada a cada sección (cargar datos, vistas, etc)
    setTimeout(() => {
        ejecutarLogicaSeccion(seccion);
    }, 50);

    console.log(`✅ Navegación completada a: ${seccion}`);
}

// Ejecuta la lógica especial al entrar en cada sección
function ejecutarLogicaSeccion(seccion) {
    switch (seccion) {
        case 'home':
            cargarProductosDestacados();
            break;
        case 'productos':
            cargarProductos();
            break;
        case 'carrito':
            actualizarVistaCarrito();
            break;
        case 'blog':
            cargarBlog();
            break;
        case 'login':
            configurarFormularioLogin();
            break;
        case 'registro':
            configurarFormularioRegistro();
            break;
    }
}

// ===============================
// MENU MÓVIL
// ===============================

// Configura la interacción del menú móvil (abrir/cerrar en dispositivos pequeños)
function configurarMenuMovil() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        // Alterna la visibilidad del menú móvil al tocar el botón toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cierra el menú al hacer click fuera de él
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}
