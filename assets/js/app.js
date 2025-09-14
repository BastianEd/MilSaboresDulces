/**
 * PASTELERÍA MIL SABORES - APLICACIÓN PRINCIPAL
 * Sistema integral modular - Archivo principal
 * VERSIÓN FINAL MODULARIZADA
 */

// ===============================
// ESTADO GLOBAL DE LA APLICACIÓN
// ===============================
// Aquí se guarda toda la información de la sesión:
// usuario actual, carrito, sección en la que está el usuario, descuentos, etc.
let appState = {
    usuarioActual: null,             // Usuario que ha iniciado sesión
    usuariosRegistrados: [...USUARIOS_DEMO], // Lista de usuarios válidos (demo)
    carrito: [],                     // Productos añadidos al carrito
    seccionActual: 'home',           // Sección actual (home, productos, blog, etc.)
    categoriaActual: 'all',          // Categoría de productos seleccionada
    blogCategoriaActual: 'all',      // Categoría de blog seleccionada
    busquedaActual: '',              // Texto de búsqueda activa
    descuentos: {                    // Códigos de descuento disponibles
        FELICES50: 0.10,             // 10% de descuento
        mayor50: 0.50,               // 50% de descuento para mayores
        estudianteDuoc: 0.0          // Sin descuento (placeholder)
    }
};

// ===============================
// INICIALIZACIÓN DE LA APLICACIÓN
// ===============================
// Código que se ejecuta cuando la página carga por completo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Pastelería Mil Sabores...');
    console.log('📦 Versión Modularizada - Cargando módulos...');

    try {
        // Pequeño delay para asegurar que todos los scripts se han cargado
        setTimeout(() => {
            // Verificar módulos (sin detener la app si faltan algunos)
            const modulosOK = verificarModulos();

            // Continuar con la inicialización independientemente del resultado
            cargarEstado();              // Carga estado desde localStorage
            inicializarNavegacion();     // Configura navegación tipo SPA
            actualizarInterfazUsuario(); // Actualiza la interfaz según usuario
            actualizarContadorCarrito(); // Actualiza el ícono con el número de productos
            configurarNotificaciones();  // Habilita sistema de notificaciones
            configurarManejoErrores();   // Manejo de errores globales

            // Detecta la sección inicial desde la URL (#hash)
            const seccionInicial = window.location.hash.slice(1) || 'home';
            navegarA(seccionInicial, false);

            console.log('✅ Aplicación inicializada correctamente');
            console.log('🎉 ¡Bienvenido a Pastelería Mil Sabores!');

            // Solo mostrar info de desarrollo si todo está bien
            if (modulosOK) {
                mostrarInfoDesarrollo();
            }

        }, 100); // Delay de 100ms para asegurar carga completa

    } catch (error) {
        console.error('❌ Error crítico al inicializar la aplicación:', error);
        mostrarErrorCritico(error);
    }
});

// ===============================
// VERIFICACIÓN DE MÓDULOS
// ===============================
// Confirma que todos los módulos importantes (productos, login, carrito, etc.) existan
function verificarModulos() {
    console.log('🔍 Iniciando verificación de módulos...');

    const modulosRequeridos = [
        // Datos
        { nombre: 'PRODUCTOS', descripcion: 'Catálogo de productos', tipo: 'variable' },
        { nombre: 'USUARIOS_DEMO', descripcion: 'Usuarios de demostración', tipo: 'variable' },

        // Utilidades
        { nombre: 'formatearPrecio', descripcion: 'Formateo de precios', tipo: 'funcion' },
        { nombre: 'mostrarNotificacion', descripcion: 'Sistema de notificaciones', tipo: 'funcion' },

        // Navegación
        { nombre: 'inicializarNavegacion', descripcion: 'Sistema de navegación SPA', tipo: 'funcion' },
        { nombre: 'navegarA', descripcion: 'Navegación entre secciones', tipo: 'funcion' },

        // Productos
        { nombre: 'cargarProductos', descripcion: 'Sistema de productos', tipo: 'funcion' },
        { nombre: 'crearTarjetaProducto', descripcion: 'Renderizado de productos', tipo: 'funcion' },

        // Carrito
        { nombre: 'agregarAlCarrito', descripcion: 'Gestión del carrito', tipo: 'funcion' },
        { nombre: 'actualizarContadorCarrito', descripcion: 'Contador del carrito', tipo: 'funcion' },

        // Autenticación
        { nombre: 'procesarLogin', descripcion: 'Sistema de login', tipo: 'funcion' },
        { nombre: 'actualizarInterfazUsuario', descripcion: 'Interfaz de usuario', tipo: 'funcion' },

        // Blog
        { nombre: 'cargarBlog', descripcion: 'Sistema de blog', tipo: 'funcion' }
    ];

    const modulosFaltantes = [];
    const modulosEncontrados = [];

    // Verifica si cada módulo existe en window
    modulosRequeridos.forEach(modulo => {
        const existe = typeof window[modulo.nombre] !== 'undefined';

        if (!existe) {
            modulosFaltantes.push(modulo);
            console.warn(`❌ ${modulo.nombre}: ${modulo.descripcion} - NO ENCONTRADO`);
        } else {
            modulosEncontrados.push(modulo);
            console.log(`✅ ${modulo.nombre}: ${modulo.descripcion} - OK`);
        }
    });

    // Reporte de resultados
    console.log(`📊 Verificación completada:`);
    console.log(`   ✅ Módulos cargados: ${modulosEncontrados.length}`);
    console.log(`   ❌ Módulos faltantes: ${modulosFaltantes.length}`);

    // Si faltan módulos críticos, muestra advertencia pero no detiene la app
    if (modulosFaltantes.length > 0) {
        console.warn('⚠️ Módulos faltantes detectados:');
        modulosFaltantes.forEach(modulo => {
            console.warn(`- ${modulo.nombre}: ${modulo.descripcion}`);
        });

        // Solo muestra notificación si hay muchos módulos faltantes (indica problema serio)
        if (modulosFaltantes.length > 5) {
            mostrarNotificacion && mostrarNotificacion(
                'Algunos módulos no se cargaron correctamente. Algunas funciones pueden no estar disponibles.',
                'warning'
            );
        }

        return false; // Indica que hay problemas
    } else {
        console.log('✅ Todos los módulos cargados correctamente');
        return true; // Todo OK
    }
}

// ===============================
// MANEJO DE ERRORES GLOBALES
// ===============================
// Captura errores de JavaScript y promesas rechazadas
function configurarManejoErrores() {
    window.addEventListener('error', function(e) {
        console.error('Error global capturado:', e);
        mostrarNotificacion('Ha ocurrido un error inesperado', 'error');
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promesa rechazada no manejada:', e.reason);
        e.preventDefault();
        mostrarNotificacion('Error en operación asíncrona', 'error');
    });
}

// Muestra mensaje de error crítico en pantalla si la app no arranca
function mostrarErrorCritico(error) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #ff4757; color: white; padding: 20px; border-radius: 10px;
                    text-align: center; z-index: 10000;">
            <h3>🚫 Error Crítico</h3>
            <p>La aplicación no pudo inicializarse correctamente.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <button onclick="location.reload()" style="background: white; color: #ff4757;
                    border: none; padding: 10px 20px; border-radius: 5px;
                    cursor: pointer; margin-top: 10px;">
                Reintentar
            </button>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

// ===============================
// INFORMACIÓN DE DESARROLLO
// ===============================
// Herramientas disponibles solo en localhost/github para pruebas y debug
function mostrarInfoDesarrollo() {
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('github.io')) {

        // Se exponen funciones debug para la consola
        window.debugApp = {
            estado: () => { console.log(appState); return appState; },
            productos: () => { console.log(PRODUCTOS); return PRODUCTOS; },
            usuarios: () => { console.log(appState.usuariosRegistrados); return appState.usuariosRegistrados; },
            carrito: () => { console.log(appState.carrito); return appState.carrito; },
            reiniciar: () => { localStorage.removeItem('milSaboresState'); location.reload(); },
            exportar: () => { /* Exporta el estado como JSON */ },
            simularUsuario: (tipoUsuario) => { /* Simula login de un usuario demo */ },
            ayuda: () => { console.log("Lista de comandos debug disponibles"); }
        };

        console.log('🔧 MODO DESARROLLO ACTIVADO');
        console.log('📋 Escribe "debugApp.ayuda()" para ver herramientas disponibles');
    }
}

// ===============================
// FUNCIONES DE UTILIDAD GLOBAL
// ===============================

// Muestra información de la empresa en un modal
function mostrarInfoEmpresa() {
    const modal = crearModal(`
        <div class="empresa-info-modal">
            <h2>🧁 ${EMPRESA.nombre}</h2>
            <p class="eslogan"><em>${EMPRESA.eslogan}</em></p>
            
            <div class="info-grid">
                <div><h3>📅 Aniversario</h3><p>${EMPRESA.aniversario} años</p></div>
                <div><h3>🎯 Misión</h3><p>${EMPRESA.mision}</p></div>
                <div><h3>🚀 Visión</h3><p>${EMPRESA.vision}</p></div>
            </div>
            
            <div class="estadisticas">
                <h3>📊 Estadísticas</h3>
                <div class="stats-grid">
                    <div><strong>${PRODUCTOS.length}</strong><span>Productos</span></div>
                    <div><strong>${CATEGORIAS.length}</strong><span>Categorías</span></div>
                    <div><strong>${BLOG_ARTICULOS.length}</strong><span>Artículos</span></div>
                    <div><strong>${appState.usuariosRegistrados.length}</strong><span>Usuarios</span></div>
                </div>
            </div>
        </div>
    `);
}

// Verifica el estado de salud de la aplicación (checks básicos)
function verificarSaludApp() {
    const checks = [
        { nombre: 'Estado Global', check: () => typeof appState !== 'undefined' },
        { nombre: 'Productos Cargados', check: () => PRODUCTOS && PRODUCTOS.length > 0 },
        { nombre: 'Navegación Activa', check: () => typeof navegarA === 'function' },
        { nombre: 'Carrito Funcional', check: () => typeof agregarAlCarrito === 'function' },
        { nombre: 'Usuarios Demo', check: () => USUARIOS_DEMO && USUARIOS_DEMO.length > 0 },
        { nombre: 'LocalStorage', check: () => { try { localStorage.setItem('test','test'); localStorage.removeItem('test'); return true; } catch (e) { return false; } } }
    ];

    console.table(checks.map(c => ({ ...c, estado: c.check() })));
}

// ===============================
// DIAGNÓSTICO DE CARGA DE SCRIPTS
// ===============================
function diagnosticarScripts() {
    console.log('🔍 DIAGNÓSTICO DE SCRIPTS:');

    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script, index) => {
        console.log(`${index + 1}. ${script.src}`);
        console.log(`   - Cargado: ${script.readyState || 'unknown'}`);
    });

    // Verificar que el orden sea correcto
    const ordenEsperado = [
        'data.js',
        'utils.js',
        'navigation.js',
        'productos.js',
        'carrito.js',
        'auth.js',
        'blog.js',
        'app.js'
    ];

    console.log('📋 Orden de carga esperado:', ordenEsperado);
}

// Expone funciones útiles a nivel global para usarlas en consola
// Exponer función de diagnóstico para debug
window.diagnosticarScripts = diagnosticarScripts;
