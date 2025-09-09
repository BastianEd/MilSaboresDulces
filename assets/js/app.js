/**
 * PASTELERÍA MIL SABORES - APLICACIÓN PRINCIPAL
 * Sistema integral modular - Archivo principal
 * VERSIÓN FINAL MODULARIZADA
 */

// ===============================
// ESTADO GLOBAL DE LA APLICACIÓN
// ===============================
let appState = {
    usuarioActual: null,
    usuariosRegistrados: [...USUARIOS_DEMO],
    carrito: [],
    seccionActual: 'home',
    categoriaActual: 'all',
    blogCategoriaActual: 'all',
    busquedaActual: '',
    descuentos: {
        FELICES50: 0.10,
        mayor50: 0.50,
        estudianteDuoc: 0.0
    }
};

// ===============================
// INICIALIZACIÓN DE LA APLICACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Pastelería Mil Sabores...');
    console.log('📦 Versión Modularizada - Todos los módulos cargados');
    
    try {
        // Verificar que todos los módulos estén disponibles
        verificarModulos();
        
        // Cargar estado previo del localStorage
        cargarEstado();
        
        // Inicializar sistema de navegación SPA
        inicializarNavegacion();
        
        // Actualizar interfaz de usuario
        actualizarInterfazUsuario();
        
        // Actualizar contador del carrito
        actualizarContadorCarrito();
        
        // Configurar sistema de notificaciones
        configurarNotificaciones();
        
        // Configurar manejo de errores
        configurarManejoErrores();
        
        // Cargar sección inicial basada en URL hash
        const seccionInicial = window.location.hash.slice(1) || 'home';
        navegarA(seccionInicial, false);
        
        // Mensaje de bienvenida en consola
        console.log('✅ Aplicación inicializada correctamente');
        console.log('🎉 ¡Bienvenido a Pastelería Mil Sabores!');
        
        // Mostrar información de debug en desarrollo
        mostrarInfoDesarrollo();
        
    } catch (error) {
        console.error('❌ Error crítico al inicializar la aplicación:', error);
        mostrarErrorCritico(error);
    }
});

// ===============================
// VERIFICACIÓN DE MÓDULOS
// ===============================
function verificarModulos() {
    const modulosRequeridos = [
        // Datos
        { nombre: 'PRODUCTOS', descripcion: 'Catálogo de productos' },
        { nombre: 'USUARIOS_DEMO', descripcion: 'Usuarios de demostración' },
        
        // Utilidades
        { nombre: 'formatearPrecio', descripcion: 'Formateo de precios' },
        { nombre: 'mostrarNotificacion', descripcion: 'Sistema de notificaciones' },
        
        // Navegación
        { nombre: 'inicializarNavegacion', descripcion: 'Sistema de navegación SPA' },
        { nombre: 'navegarA', descripcion: 'Navegación entre secciones' },
        
        // Productos
        { nombre: 'cargarProductos', descripcion: 'Sistema de productos' },
        { nombre: 'crearTarjetaProducto', descripcion: 'Renderizado de productos' },
        
        // Carrito
        { nombre: 'agregarAlCarrito', descripcion: 'Gestión del carrito' },
        { nombre: 'actualizarContadorCarrito', descripcion: 'Contador del carrito' },
        
        // Autenticación
        { nombre: 'procesarLogin', descripcion: 'Sistema de login' },
        { nombre: 'actualizarInterfazUsuario', descripcion: 'Interfaz de usuario' },
        
        // Blog
        { nombre: 'cargarBlog', descripcion: 'Sistema de blog' }
    ];

    const modulosFaltantes = [];
    
    modulosRequeridos.forEach(modulo => {
        if (typeof window[modulo.nombre] === 'undefined') {
            modulosFaltantes.push(modulo);
        }
    });

    if (modulosFaltantes.length > 0) {
        console.warn('⚠️ Módulos faltantes detectados:');
        modulosFaltantes.forEach(modulo => {
            console.warn(`- ${modulo.nombre}: ${modulo.descripcion}`);
        });
        
        mostrarNotificacion('Algunos módulos no se cargaron correctamente', 'warning');
    } else {
        console.log('✅ Todos los módulos cargados correctamente');
    }
}

// ===============================
// MANEJO DE ERRORES GLOBALES
// ===============================
function configurarManejoErrores() {
    // Errores JavaScript generales
    window.addEventListener('error', function(e) {
        console.error('Error global capturado:', {
            mensaje: e.message,
            archivo: e.filename,
            linea: e.lineno,
            columna: e.colno,
            error: e.error
        });
        
        mostrarNotificacion('Ha ocurrido un error inesperado', 'error');
    });

    // Promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promesa rechazada no manejada:', e.reason);
        e.preventDefault();
        
        mostrarNotificacion('Error en operación asíncrona', 'error');
    });
}

function mostrarErrorCritico(error) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="
            position: fixed; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: #ff4757; 
            color: white; 
            padding: 20px; 
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
        ">
            <h3>🚫 Error Crítico</h3>
            <p>La aplicación no pudo inicializarse correctamente.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <button onclick="location.reload()" style="
                background: white; 
                color: #ff4757; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">
                Reintentar
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
}

// ===============================
// INFORMACIÓN DE DESARROLLO
// ===============================
function mostrarInfoDesarrollo() {
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('github.io')) {

        // Funciones de desarrollo disponibles globalmente
        window.debugApp = {
            estado: () => {
                console.log('📊 Estado actual de la aplicación:', appState);
                return appState;
            },
            productos: () => {
                console.log('🧁 Catálogo de productos:', PRODUCTOS);
                return PRODUCTOS;
            },
            usuarios: () => {
                console.log('👥 Usuarios registrados:', appState.usuariosRegistrados);
                return appState.usuariosRegistrados;
            },
            carrito: () => {
                console.log('🛒 Contenido del carrito:', appState.carrito);
                return appState.carrito;
            },
            reiniciar: () => {
                if (confirm('¿Reiniciar toda la aplicación? Se perderán todos los datos.')) {
                    localStorage.removeItem('milSaboresState');
                    location.reload();
                }
            },
            exportar: () => {
                const datos = {
                    timestamp: new Date().toISOString(),
                    estado: appState,
                    productos: PRODUCTOS,
                    version: '2.0.0-modular'
                };

                const blob = new Blob([JSON.stringify(datos, null, 2)], {
                    type: 'application/json'
                });

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `mil-sabores-estado-${new Date().toISOString().split('T')[0]}.json`;
                a.click();

                URL.revokeObjectURL(url);
                mostrarNotificacion('Estado exportado correctamente');
            },
            simularUsuario: (tipoUsuario) => {
                const usuarios = {
                    'mayor': appState.usuariosRegistrados.find(u => u.tipoUsuario === 'mayor'),
                    'estudiante': appState.usuariosRegistrados.find(u => u.tipoUsuario === 'estudiante_duoc'),
                    'regular': appState.usuariosRegistrados.find(u => u.tipoUsuario === 'regular')
                };

                const usuario = usuarios[tipoUsuario];
                if (usuario) {
                    appState.usuarioActual = usuario;
                    actualizarInterfazUsuario();
                    mostrarNotificacion(`Simulando usuario: ${usuario.nombre} (${tipoUsuario})`);
                }
            },
            ayuda: () => {
                console.log(`
🔧 HERRAMIENTAS DE DESARROLLO DISPONIBLES:
                
debugApp.estado()         - Ver estado completo de la aplicación
debugApp.productos()      - Ver catálogo de productos
debugApp.usuarios()       - Ver usuarios registrados
debugApp.carrito()        - Ver contenido del carrito
debugApp.reiniciar()      - Reiniciar aplicación completa
debugApp.exportar()       - Exportar estado como JSON
debugApp.simularUsuario() - Simular login de diferentes tipos de usuario
  • debugApp.simularUsuario('mayor')
  • debugApp.simularUsuario('estudiante') 
  • debugApp.simularUsuario('regular')

Ejemplo de uso:
debugApp.estado()   // Ver estado actual
debugApp.exportar() // Crear backup
                `);
            }
        };

        console.log('🔧 MODO DESARROLLO ACTIVADO');
        console.log('📋 Escribe "debugApp.ayuda()" para ver herramientas disponibles');
        console.log('🎯 Estado inicial:', appState);
    }
}

// ===============================
// FUNCIONES DE UTILIDAD GLOBAL
// ===============================

// Función para mostrar información de la empresa
function mostrarInfoEmpresa() {
    const modal = crearModal(`
        <div class="empresa-info-modal">
            <h2>🧁 ${EMPRESA.nombre}</h2>
            <p class="eslogan"><em>${EMPRESA.eslogan}</em></p>
            
            <div class="info-grid">
                <div class="info-item">
                    <h3>📅 Aniversario</h3>
                    <p>${EMPRESA.aniversario} años de tradición</p>
                </div>
                
                <div class="info-item">
                    <h3>🎯 Nuestra Misión</h3>
                    <p>${EMPRESA.mision}</p>
                </div>
                
                <div class="info-item">
                    <h3>🚀 Nuestra Visión</h3>
                    <p>${EMPRESA.vision}</p>
                </div>
            </div>
            
            <div class="estadisticas">
                <h3>📊 Estadísticas</h3>
                <div class="stats-grid">
                    <div class="stat">
                        <strong>${PRODUCTOS.length}</strong>
                        <span>Productos</span>
                    </div>
                    <div class="stat">
                        <strong>${CATEGORIAS.length}</strong>
                        <span>Categorías</span>
                    </div>
                    <div class="stat">
                        <strong>${BLOG_ARTICULOS.length}</strong>
                        <span>Artículos</span>
                    </div>
                    <div class="stat">
                        <strong>${appState.usuariosRegistrados.length}</strong>
                        <span>Usuarios</span>
                    </div>
                </div>
            </div>
        </div>
    `);
}

// Función para verificar el estado de salud de la aplicación
function verificarSaludApp() {
    const checks = [
        { nombre: 'Estado Global', check: () => typeof appState !== 'undefined' },
        { nombre: 'Productos Cargados', check: () => PRODUCTOS && PRODUCTOS.length > 0 },
        { nombre: 'Navegación Activa', check: () => typeof navegarA === 'function' },
        { nombre: 'Carrito Funcional', check: () => typeof agregarAlCarrito === 'function' },
        { nombre: 'Usuarios Demo', check: () => USUARIOS_DEMO && USUARIOS_DEMO.length > 0 },
        { nombre: 'LocalStorage', check: () => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        }}
    ];
    
    const resultados = checks.map(check => ({
        ...check,
        estado: check.check()
    }));
    
    console.table(resultados);
    
    const problemas = resultados.filter(r => !r.estado);
    if (problemas.length === 0) {
        console.log('✅ Todos los sistemas funcionando correctamente');
        return true;
    } else {
        console.warn('⚠️ Problemas detectados:', problemas.map(p => p.nombre));
        return false;
    }
}

// Exponer funciones útiles globalmente
window.mostrarInfoEmpresa = mostrarInfoEmpresa;
window.verificarSaludApp = verificarSaludApp;