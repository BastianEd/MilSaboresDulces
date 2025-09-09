/**
 * PASTELERÍA MIL SABORES - SISTEMA DEL CARRITO
 * Funciones para manejo del carrito de compras
 */

// ===============================
// GESTIÓN DEL CARRITO
// ===============================

function agregarAlCarrito(codigo) {
    const producto = buscarProducto(codigo);
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }

    const itemExistente = appState.carrito.find(item => item.codigo === codigo);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        appState.carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    actualizarContadorCarrito();
    guardarEstado();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

function eliminarDelCarrito(codigo) {
    appState.carrito = appState.carrito.filter(item => item.codigo !== codigo);
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    guardarEstado();
    mostrarNotificacion('Producto eliminado del carrito');
}

function cambiarCantidad(codigo, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(codigo);
        return;
    }

    const item = appState.carrito.find(item => item.codigo === codigo);
    if (item) {
        item.cantidad = nuevaCantidad;
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        guardarEstado();
    }
}

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

function calcularSubtotal() {
    return appState.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function calcularDescuento() {
    const subtotal = calcularSubtotal();
    let descuento = 0;
    let tipoDescuento = '';

    if (appState.usuarioActual) {
        const usuario = appState.usuarioActual;
        
        // Descuento por edad (mayores de 60)
        if (usuario.tipoUsuario === 'mayor' || calcularEdad(usuario.fechaNacimiento) >= 60) {
            descuento = subtotal * appState.descuentos.mayor50;
            tipoDescuento = 'Descuento Adulto Mayor (50%)';
        }
        // Torta gratis en cumpleaños para estudiantes Duoc
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

function calcularTotal() {
    const subtotal = calcularSubtotal();
    const { descuento } = calcularDescuento();
    return subtotal - descuento;
}

// ===============================
// INTERFAZ DEL CARRITO
// ===============================

function actualizarContadorCarrito() {
    const contador = document.querySelector('.cart-count');
    if (contador) {
        const totalItems = appState.carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function actualizarVistaCarrito() {
    const container = document.getElementById('cart-items');
    const resumen = document.getElementById('cart-summary');
    
    if (!container || !resumen) return;

    if (appState.carrito.length === 0) {
        mostrarCarritoVacio(container, resumen);
        return;
    }

    // Renderizar items del carrito
    container.innerHTML = appState.carrito.map(item => crearItemCarrito(item)).join('');

    // Renderizar resumen
    const subtotal = calcularSubtotal();
    const { descuento, tipoDescuento } = calcularDescuento();
    const total = calcularTotal();

    resumen.innerHTML = crearResumenCarrito(subtotal, descuento, tipoDescuento, total);
}

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

function procesarPedido() {
    if (appState.carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'error');
        return;
    }

    const total = calcularTotal();
    const { tipoDescuento } = calcularDescuento();
    
    // Simular procesamiento
    mostrarNotificacion('Procesando pedido...', 'warning');
    
    setTimeout(() => {
        let mensaje = `¡Pedido procesado exitosamente! Total: ${formatearPrecio(total)}`;
        if (tipoDescuento) {
            mensaje += ` (aplicado: ${tipoDescuento})`;
        }

        mostrarNotificacion(mensaje);
        
        // Limpiar carrito
        appState.carrito = [];
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        guardarEstado();

        // Redirigir a home después de unos segundos
        setTimeout(() => {
            navegarA('home');
        }, 2000);
    }, 1500);
}