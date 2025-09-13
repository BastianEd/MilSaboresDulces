/**
 * PASTELERÍA MIL SABORES - AUTENTICACIÓN
 * Funciones para manejo de usuarios, login y registro
 */

// ===============================
// CONFIGURACIÓN DE FORMULARIOS
// ===============================

function configurarFormularioLogin() {
    const form = document.getElementById('login-form');
    if (!form) return; // Si no existe el formulario, no hace nada

    // Captura el evento submit y llama al login
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el refresh
        procesarLogin();
    });
}

function configurarFormularioRegistro() {
    const form = document.getElementById('registro-form');
    if (!form) return;

    // Captura el evento submit y llama al registro
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        procesarRegistro();
    });
}

// ===============================
// PROCESO DE LOGIN
// ===============================

function procesarLogin() {
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;

    // Validación de campos vacíos
    if (!email || !password) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }

    // Buscar usuario con ese email y contraseña
    const usuario = appState.usuariosRegistrados.find(u =>
        u.email === email && u.password === password
    );

    if (usuario) {
        // Guardar sesión activa
        appState.usuarioActual = usuario;
        actualizarInterfazUsuario();
        guardarEstado();

        // Mensaje personalizado según el tipo de usuario
        let mensaje = `¡Bienvenido ${usuario.nombre}!`;
        if (usuario.tipoUsuario === 'mayor') {
            mensaje += ' 🎉 Tienes 50% de descuento disponible.';
        } else if (usuario.tipoUsuario === 'estudiante_duoc') {
            if (esCumpleanos(usuario.fechaNacimiento)) {
                mensaje += ' 🎂 ¡Feliz cumpleaños! Tienes una torta gratis.';
            } else {
                mensaje += ' 📚 Torta gratis en tu cumpleaños.';
            }
        }

        mostrarNotificacion(mensaje);
        navegarA('home'); // Redirige al home
    } else {
        // Error de credenciales
        mostrarNotificacion('Email o contraseña incorrectos', 'error');

        // Limpia solo el campo contraseña
        document.getElementById('login-password').value = '';
    }
}

// ===============================
// PROCESO DE REGISTRO
// ===============================

function procesarRegistro() {
    const form = document.getElementById('registro-form');

    // Limpia mensajes de error previos
    limpiarErrores(form);

    // Si falla la validación general, no continúa
    if (!validarFormulario(form)) {
        return;
    }

    // Obtener valores del formulario
    const email = document.getElementById('registro-email')?.value;
    const password = document.getElementById('registro-password')?.value;
    const confirmPassword = document.getElementById('registro-confirm-password')?.value;
    const nombre = document.getElementById('registro-nombre')?.value;
    const fechaNacimiento = document.getElementById('registro-fecha')?.value;

    // Validaciones adicionales
    if (password !== confirmPassword) {
        mostrarErrorCampo(document.getElementById('registro-confirm-password'), 'Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        mostrarErrorCampo(document.getElementById('registro-password'), 'La contraseña debe tener al menos 6 caracteres');
        return;
    }

    // Verifica que no exista otro usuario con el mismo email
    if (appState.usuariosRegistrados.find(u => u.email === email)) {
        mostrarNotificacion('Este email ya está registrado', 'error');
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        email,
        password,
        nombre,
        fechaNacimiento,
        tipoUsuario: determinarTipoUsuario(email) // Por defecto asigna tipo según reglas
    };

    // Guardar en el estado global
    appState.usuariosRegistrados.push(nuevoUsuario);
    appState.usuarioActual = nuevoUsuario;

    actualizarInterfazUsuario();
    guardarEstado();

    // Mensaje de éxito
    let mensaje = `¡Registro exitoso! Bienvenido ${nombre}`;

    // Informar beneficios según el tipo de usuario
    if (nuevoUsuario.tipoUsuario === 'estudiante_duoc') {
        mensaje += ' 📚 Como estudiante Duoc, tendrás torta gratis en tu cumpleaños.';
    } else if (calcularEdad(fechaNacimiento) >= 60) {
        // Si el usuario es mayor de 60 años, actualiza el tipo
        nuevoUsuario.tipoUsuario = 'mayor';
        mensaje += ' 🎉 Como adulto mayor, tienes 50% de descuento en todos los productos.';
    }

    mostrarNotificacion(mensaje);
    navegarA('home');
}

// ===============================
// GESTIÓN DE SESIÓN
// ===============================

function cerrarSesion() {
    // Confirmación antes de cerrar sesión
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        appState.usuarioActual = null;
        actualizarInterfazUsuario();
        guardarEstado();
        mostrarNotificacion('Sesión cerrada correctamente');
        navegarA('home');
    }
}

function actualizarInterfazUsuario() {
    const userInfo = document.querySelector('.user-info');
    const navActions = document.querySelector('.nav-actions');

    if (!navActions) return;

    if (appState.usuarioActual) {
        // Usuario logueado
        if (userInfo) {
            const usuario = appState.usuarioActual;
            let iconoUsuario = '👤';

            // Iconos personalizados por tipo de usuario
            if (usuario.tipoUsuario === 'mayor') {
                iconoUsuario = '👴';
            } else if (usuario.tipoUsuario === 'estudiante_duoc') {
                iconoUsuario = '📚';
            }

            // Renderiza el mensaje y botón de logout
            userInfo.innerHTML = `
                <span class="user-welcome">
                    ${iconoUsuario} Hola, ${usuario.nombre}
                </span>
                <button class="btn-logout" onclick="cerrarSesion()">
                    <i class="fas fa-sign-out-alt"></i> Salir
                </button>
            `;
            userInfo.style.display = 'flex';
        }

        // Oculta enlaces de login/registro
        document.querySelectorAll('[data-section="login"], [data-section="registro"]').forEach(link => {
            link.style.display = 'none';
        });
    } else {
        // Usuario no logueado
        if (userInfo) {
            userInfo.style.display = 'none';
        }

        // Muestra enlaces de login/registro
        document.querySelectorAll('[data-section="login"], [data-section="registro"]').forEach(link => {
            link.style.display = 'block';
        });
    }
}

// ===============================
// UTILIDADES DE USUARIO
// ===============================

function obtenerTipoUsuarioDescripcion(tipoUsuario) {
    const descripciones = {
        'mayor': 'Adulto Mayor - 50% descuento',
        'estudiante_duoc': 'Estudiante Duoc - Torta gratis en cumpleaños',
        'regular': 'Usuario Regular'
    };

    return descripciones[tipoUsuario] || 'Usuario Regular';
}

function validarEdadMinima(fechaNacimiento) {
    const edad = calcularEdad(fechaNacimiento);
    return edad >= 13; // Edad mínima de registro permitida
}
