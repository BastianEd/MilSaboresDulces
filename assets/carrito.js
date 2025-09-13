/**
 * PASTELERÍA MIL SABORES - SISTEMA DEL CARRITO
 * Funciones para manejo del carrito de compras
 */

// ===============================
// GESTIÓN DEL CARRITO
// ===============================

// Agrega un producto al carrito por su código
function agregarAlCarrito(codigo) {
    const producto = buscarProducto(codigo);
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }

    // Busca si el producto ya está en el carrito
    const itemExistente = appState.carrito.find(item => item.codigo === codigo);

    if (itemExistente) {
        // Si ya existe, aumenta la cantidad
        itemExistente.cantidad++;
    } else {
        // Si no existe, agrega como nuevo con cantidad 1
        appState.carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    // Actualiza contador, guarda estado y muestra notificación
    actualizarContadorCarrito();
    guardarEstado();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

// Elimina un producto del carrito usando su código
function eliminarDelCarrito(codigo) {
    appState.carrito = appState.carrito.filter(item => item.codigo !== codigo);
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    guardarEstado();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Cambia la cantidad de un producto en el carrito
function cambiarCantidad(codigo, nuevaCantidad) {
    // Si la cantidad es menor o igual a cero, elimina el producto
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(codigo);
        return;
    }

    // Modifica la cantidad si existe ese producto en el carrito
    const item = appState.carrito.find(item => item.codigo === codigo);
    if (item) {
        item.cantidad = nuevaCantidad;
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        guardarEstado();
    }
}

// Vacía completamente el carrito
function vaciarCarrito() {
    appState.carrito = [];
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    guardarEstado();
    mostrarNotificacion('Carrito vaciado');
}

// ===============================
// CÁLCULOS DEL CARRITO
// ===============================

// Calcula el subtotal sumando el precio por cantidad de cada ítem
function calcularSubtotal() {
    return appState.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Calcula el descuento posible según usuario y reglas
function calcularDescuento() {
    const subtotal = calcularSubtotal();
    let descuento = 0;
    let tipoDescuento = '';

    if (appState.usuarioActual) {
        const usuario = appState.usuarioActual;

        // Descuento especial para mayores de 60 años (o tipo usuario mayor)
        if (usuario.tipoUsuario === 'mayor' || calcularEdad(usuario.fechaNacimiento) >= 60) {
            descuento = subtotal * appState.descuentos.mayor50;
            tipoDescuento = 'Descuento Adulto Mayor (50%)';
        }
        // Torta gratis para estudiantes Duoc en su cumpleaños
        else if (usuario.tipoUsuario === 'estudiante_duoc' && esCumpleanos(usuario.fechaNacimiento)) {
            const tortaMasCara = Math.max(...appState.carrito
                .filter(item => buscarProducto(item.codigo).categoria.includes('Torta'))
                .map(item => item.precio));

            if (tortaMasCara > 0) {
                descuento = tortaMasCara;
                tipoDescuento = 'Torta Gratis Cumpleaños Duoc';
            }
        }
    }

    return { descuento, tipoDescuento };
}

// Calcula el total restando el descuento al subtotal
function calcularTotal() {
    const subtotal = calcularSubtotal();
    const { descuento } = calcularDescuento();
    return subtotal - descuento;
}

// ===============================
// INTERFAZ DEL CARRITO
// ===============================

// Actualiza el contador visual del carrito
function actualizarContadorCarrito() {
    const contador = document.querySelector('.cart-count');
    if (contador) {
        const totalItems = appState.carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Renderiza la vista completa del carrito y el resumen
function actualizarVistaCarrito() {
    const container = document.getElementById('cart-items');
    const resumen = document.getElementById('cart-summary');

    if (!container || !resumen) return;

    // Si el carrito está vacío, muestra el mensaje correspondiente
    if (appState.carrito.length === 0) {
        mostrarCarritoVacio(container, resumen);
        return;
    }

    // Muestra cada producto en el carrito
    container.innerHTML = appState.carrito.map(item => crearItemCarrito(item)).join('');

    // Muestra el resumen con subtotal, descuentos y total
    const subtotal = calcularSubtotal();
    const { descuento, tipoDescuento } = calcularDescuento();
    const total = calcularTotal();

    resumen.innerHTML = crearResumenCarrito(subtotal, descuento, tipoDescuento, total);
}

// Genera el HTML de un producto en el carrito
function crearItemCarrito(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.imagen}" 
                     alt="${item.nombre}"
                     onload="this.nextElementSibling.style.display='none'"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="product-fallback" style="display: none;">🧁</div>
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.nombre}</h4>
                <div class="cart-item-price">${formatearPrecio(item.precio)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="cambiarCantidad('${item.codigo}', ${item.cantidad - 1})" 
                            ${item.cantidad <= 1 ? 'title="Eliminar producto"' : ''}>
                        ${item.cantidad <= 1 ? '<i class="fas fa-trash"></i>' : '-'}
                    </button>
                    <span class="quantity-display">${item.cantidad}</span>
                    <button class="quantity-btn" onclick="cambiarCantidad('${item.codigo}', ${item.cantidad + 1})">
                        +
                    </button>
                    <button class="remove-item" onclick="eliminarDelCarrito('${item.codigo}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Genera el resumen de compra (subtotal, descuentos, total, acciones)
function crearResumenCarrito(subtotal, descuento, tipoDescuento, total) {
    return `
        <div class="summary-card">
            <h3>Resumen del Pedido</h3>
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>${formatearPrecio(subtotal)}</span>
            </div>
            ${descuento > 0 ? `
                <div class="summary-line discount">
                    <span>${tipoDescuento}:</span>
                    <span>-${formatearPrecio(descuento)}</span>
                </div>
            ` : ''}
            <div class="summary-line total">
                <span>Total:</span>
                <span>${formatearPrecio(total)}</span>
            </div>
            ${!appState.usuarioActual ? `
                <div class="discount-info">
                    <p><strong>¡Registrate para obtener descuentos!</strong></p>
                    <ul>
                        <li>🎂 Torta gratis en tu cumpleaños (estudiantes Duoc)</li>
                        <li>👴 50% descuento (mayores de 60 años)</li>
                        <li>🎉 Descuentos especiales con códigos</li>
                    </ul>
                </div>
            ` : ''}
            <div class="cart-actions">
                <button class="btn-secondary full-width" onclick="vaciarCarrito()">
                    <i class="fas fa-trash"></i> Vaciar Carrito
                </button>
                <button class="btn-primary full-width" onclick="procesarPedido()">
                    <i class="fas fa-credit-card"></i> Proceder al Pago
                </button>
            </div>
        </div>
    `;
}

// Muestra el estado vacío del carrito
function mostrarCarritoVacio(container, resumen) {
    container.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Tu carrito está vacío</h3>
            <p>¡Agrega algunos productos deliciosos!</p>
            <button class="btn-primary" onclick="navegarA('productos')">
                <i class="fas fa-store"></i> Ver Productos
            </button>
        </div>
    `;
    resumen.innerHTML = '';
}

// ===============================
// PROCESAMIENTO DEL PEDIDO
// ===============================

// Procesa el pedido y muestra notificaciones de resultado
function procesarPedido() {
    if (appState.carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }

    const total = calcularTotal();
    const { tipoDescuento } = calcularDescuento();

    // Simula el procesamiento y muestra un mensaje
    mostrarNotificacion('Procesando pedido...', 'warning');

    setTimeout(() => {
        let mensaje = `¡Pedido procesado exitosamente! Total: ${formatearPrecio(total)}`;
        if (tipoDescuento) {
            mensaje += ` (aplicado: ${tipoDescuento})`;
        }

        mostrarNotificacion(mensaje);

        // Vacía el carrito después de procesar
        appState.carrito = [];
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        guardarEstado();

        // Redirige a la página principal tras unos segundos
        setTimeout(() => {
            navegarA('home');
        }, 2000);
    }, 1500);
}
