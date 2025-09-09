/**
 * PASTELERÍA MIL SABORES - NAVEGACIÓN SPA
 * Sistema de navegación de página única
 */

// ===============================
// INICIALIZACIÓN DE NAVEGACIÓN
// ===============================

function inicializarNavegacion() {
    console.log('🚀 Inicializando sistema de navegación...');
    
    // Configurar todos los elementos de navegación
    configurarEnlacesNavegacion();
    
    // Navegación con historial del navegador
    window.addEventListener('popstate', (e) => {
        const seccion = e.state?.seccion || 'home';
        navegarA(seccion, false);
    });
    
    // Configurar menú móvil
    configurarMenuMovil();
    
    console.log('✅ Sistema de navegación inicializado');
}

function configurarEnlacesNavegacion() {
    // Configurar enlaces principales del menú
    const enlaces = [
        { selector: '[data-section="home"]', seccion: 'home' },
        { selector: '[data-section="productos"]', seccion: 'productos' },
        { selector: '[data-section="registro"]', seccion: 'registro' },
        { selector: '[data-section="login"]', seccion: 'login' },
        { selector: '[data-section="carrito"]', seccion: 'carrito' },
        { selector: '[data-section="contacto"]', seccion: 'contacto' },
        { selector: '[data-section="blog"]', seccion: 'blog' }
    ];

    enlaces.forEach(({ selector, seccion }) => {
        document.querySelectorAll(selector).forEach(elemento => {
            elemento.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🔄 Navegando a: ${seccion}`);
                navegarA(seccion);
            });
        });
    });

    // Configurar botón del carrito específicamente
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

function navegarA(seccion, pushState = true) {
    console.log(`🎯 Navegando a sección: ${seccion}`);
    
    // Validar que la sección existe
    const seccionEl = document.getElementById(seccion);
    if (!seccionEl) {
        console.error(`❌ Sección no encontrada: ${seccion}`);
        return;
    }

    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Mostrar sección solicitada
    seccionEl.classList.add('active');
    appState.seccionActual = seccion;

    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === seccion) {
            link.classList.add('active');
        }
    });

    // Agregar al historial si es necesario
    if (pushState) {
        history.pushState({ seccion }, '', `#${seccion}`);
    }

    // Cerrar menú móvil si está abierto
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }

    // Ejecutar lógica específica de la sección
    setTimeout(() => {
        ejecutarLogicaSeccion(seccion);
    }, 50);

    console.log(`✅ Navegación completada a: ${seccion}`);
}

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

function configurarMenuMovil() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}