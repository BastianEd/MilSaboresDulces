/**
 * PASTELERÍA MIL SABORES - UTILIDADES Y HELPERS
 * Funciones utilitarias compartidas por toda la aplicación
 */

// ===============================
// FORMATEO Y VALIDACIONES
// ===============================

function formatearPrecio(precio) {
    return `$${precio.toLocaleString('es-CL')}`;
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function validarEmail(email) {
    const dominiosPermitidos = ['gmail.com', 'duoc.cl', 'profesor.duoc.cl'];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regex.test(email)) return false;
    
    const dominio = email.split('@')[1];
    return dominiosPermitidos.includes(dominio);
}

function determinarTipoUsuario(email) {
    if (email.endsWith('@duoc.cl') || email.endsWith('@profesor.duoc.cl')) {
        return 'estudiante_duoc';
    }
    return 'regular';
}

function esCumpleanos(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    
    return (
        hoy.getMonth() === nacimiento.getMonth() &&
        hoy.getDate() === nacimiento.getDate()
    );
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===============================
// NOTIFICACIONES
// ===============================

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');
    
    if (!notification || !messageEl) return;
    
    messageEl.textContent = mensaje;
    notification.className = `notification show ${tipo}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function configurarNotificaciones() {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const closeBtn = document.getElementById('notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
        });
    }
}

// ===============================
// ALMACENAMIENTO LOCAL
// ===============================

function guardarEstado() {
    try {
        localStorage.setItem('milSaboresState', JSON.stringify({
            usuarioActual: appState.usuarioActual,
            usuariosRegistrados: appState.usuariosRegistrados,
            carrito: appState.carrito
        }));
    } catch (error) {
        console.warn('No se pudo guardar en localStorage:', error);
    }
}

function cargarEstado() {
    try {
        const estadoGuardado = localStorage.getItem('milSaboresState');
        if (estadoGuardado) {
            const estado = JSON.parse(estadoGuardado);
            appState.usuarioActual = estado.usuarioActual || null;
            appState.usuariosRegistrados = [...USUARIOS_DEMO, ...(estado.usuariosRegistrados || [])];
            appState.carrito = estado.carrito || [];
        }
    } catch (error) {
        console.warn('No se pudo cargar desde localStorage:', error);
    }
}

// ===============================
// VALIDACIÓN DE FORMULARIOS
// ===============================

function validarFormulario(formulario) {
    const inputs = formulario.querySelectorAll('input[required], select[required]');
    let esValido = true;
    
    inputs.forEach(input => {
        const errorEl = input.parentNode.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
        
        if (!input.value.trim()) {
            mostrarErrorCampo(input, 'Este campo es requerido');
            esValido = false;
        } else if (input.type === 'email' && !validarEmail(input.value)) {
            mostrarErrorCampo(input, 'Email debe ser @gmail.com, @duoc.cl o @profesor.duoc.cl');
            esValido = false;
        }
    });
    
    return esValido;
}

function mostrarErrorCampo(input, mensaje) {
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = mensaje;
    input.parentNode.appendChild(errorEl);
    input.focus();
}

function limpiarErrores(formulario) {
    const errores = formulario.querySelectorAll('.error-message');
    errores.forEach(error => error.remove());
}

// ===============================
// UTILIDADES PARA MODALES
// ===============================

function crearModal(contenido) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="cerrarModal(this)">&times;</button>
            <div class="modal-body">
                ${contenido}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function cerrarModal(elemento) {
    const modal = elemento.closest('.modal');
    if (modal) {
        modal.remove();
    }
}

// ===============================
// UTILIDADES DE CONTACTO
// ===============================

function enviarMensajeContacto() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const nombre = document.getElementById('contact-nombre').value;
    const email = document.getElementById('contact-email').value;
    const mensaje = document.getElementById('contact-mensaje').value;
    
    if (!nombre || !email || !mensaje) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarNotificacion('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Simular envío de mensaje
    mostrarNotificacion('¡Mensaje enviado correctamente! Te contactaremos pronto.');
    form.reset();
}

// ===============================
// UTILIDADES DE DESARROLLO
// ===============================

function reiniciarAplicacion() {
    if (confirm('¿Estás seguro de que quieres reiniciar todos los datos?')) {
        localStorage.removeItem('milSaboresState');
        location.reload();
    }
}

function exportarDatos() {
    const datos = {
        carrito: appState.carrito,
        usuario: appState.usuarioActual,
        fecha: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], {
        type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mil-sabores-backup.json';
    a.click();
    
    URL.revokeObjectURL(url);
    mostrarNotificacion('Datos exportados correctamente');
}