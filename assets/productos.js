/**
 * PASTELERÍA MIL SABORES - SISTEMA DE PRODUCTOS
 * Funciones para manejo de productos y catálogo
 */

// ===============================
// CARGA Y VISUALIZACIÓN DE PRODUCTOS
// ===============================

// Carga y muestra los productos destacados en la página principal
function cargarProductosDestacados() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    // Filtra los productos que tienen la propiedad destacado en true
    const productosDestacados = PRODUCTOS.filter(p => p.destacado);
    container.innerHTML = productosDestacados.map(producto =>
        crearTarjetaProducto(producto)
    ).join('');
}

// Carga todos los productos, filtros y búsqueda en el catálogo
function cargarProductos() {
    actualizarGridProductos();
    configurarFiltrosProductos();
    configurarBusquedaProductos();
}

// Actualiza y renderiza la grilla de productos según categoría y búsqueda
function actualizarGridProductos() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    let productos = PRODUCTOS;

    // Aplica filtro de categoría si no es 'all'
    if (appState.categoriaActual !== 'all') {
        productos = productos.filter(p => p.categoria === appState.categoriaActual);
    }

    // Aplica filtro de término de búsqueda en nombre
    if (appState.busquedaActual && appState.busquedaActual.trim() !== '') {
        const termino = appState.busquedaActual.trim().toLowerCase();
        productos = productos.filter(p =>
            p.nombre.toLowerCase().includes(termino)
        );
    }

    // Renderiza todas las tarjetas en el contenedor de grilla
    container.innerHTML = productos.map(producto =>
        crearTarjetaProducto(producto)
    ).join('');
}

// ===============================
// FUNCIÓN PARA CREAR TARJETA DE PRODUCTO
// ===============================

// Genera el HTML de cada producto en la grilla y destacado
function crearTarjetaProducto(producto) {
    return `
        <div class="product-card" data-code="${producto.codigo}">
            <div class="product-image">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}"
                     class="product-img"
                     loading="lazy"
                     onload="this.parentNode.querySelector('.product-fallback').style.display='none'"
                     onerror="manejarErrorImagen(this)">
                <div class="product-fallback">
                    <span class="fallback-icon"></span>
                </div>
                <div class="product-category">${producto.categoria}</div>
            </div>
            <div class="product-info">
                <h4 class="product-name">${producto.nombre}</h4>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-price">${formatearPrecio(producto.precio)}</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="agregarAlCarrito('${producto.codigo}')">
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>
                    <button class="btn-view-product" onclick="verProducto('${producto.codigo}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===============================
// MANEJO DE ERRORES DE IMÁGENES
// ===============================

// Oculta imagen rota y muestra ícono de producto alternativo si falla la carga
function manejarErrorImagen(img) {
    img.style.display = 'none';
    const fallback = img.parentNode.querySelector('.product-fallback');
    if (fallback) {
        fallback.style.display = 'flex';
    }
}

// ===============================
// CONFIGURACIÓN DE FILTROS Y BÚSQUEDA
// ===============================

// Configura el campo de búsqueda y su listener
function configurarBusquedaProductos() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    // Inicializa el campo de búsqueda con el valor actual del estado
    searchInput.value = appState.busquedaActual;

    // Cada vez que se escribe, actualiza la búsqueda y la grilla
    searchInput.addEventListener('input', (e) => {
        appState.busquedaActual = e.target.value.toLowerCase();
        actualizarGridProductos();
    });
}

// Configura los botones de filtro de categoría y su comportamiento
function configurarFiltrosProductos() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Quita el estado activo a todos los botones y lo agrega al actual
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Actualiza el estado y la grilla según la categoría elegida
            appState.categoriaActual = btn.getAttribute('data-category');
            actualizarGridProductos();
        });
    });
}

// ===============================
// MODAL DE DETALLE DEL PRODUCTO
// ===============================

// Muestra el detalle completo de un producto en un modal
function verProducto(codigo) {
    const producto = PRODUCTOS.find(p => p.codigo === codigo);
    if (!producto) return;

    // Estructura HTML del modal con toda la info del producto
    const modalContent = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}"
                     onload="this.nextElementSibling.style.display='none'"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="product-fallback" style="display: none;">
                    <span class="fallback-icon"></span>
                </div>
            </div>
            <div class="product-detail-info">
                <div class="product-detail-badges">
                    <span class="product-detail-category">${producto.categoria}</span>
                    ${producto.destacado ? '<span class="product-detail-featured"><b> - Destacado</b></span>' : ''}
                </div>
                <h2>${producto.nombre}</h2>
                <p class="product-detail-description">${producto.descripcion}</p>
                <div class="product-detail-price">${formatearPrecio(producto.precio)}</div>
                <div class="product-detail-actions">
                    <button class="btn-primary full-width" onclick="agregarAlCarrito('${producto.codigo}'); cerrarModal(this);">
                        <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                    </button>
                    <div class="product-detail-meta">
                        <small>Código: ${producto.codigo}</small>
                    </div>
                </div>
            </div>
        </div>
    `;

    crearModal(modalContent);
}

// ===============================
// UTILIDADES DE PRODUCTOS
// ===============================

// Busca y retorna el producto por su código
function buscarProducto(codigo) {
    return PRODUCTOS.find(p => p.codigo === codigo);
}

// Devuelve todos los productos de una categoría dada
function obtenerProductosPorCategoria(categoria) {
    return PRODUCTOS.filter(p => p.categoria === categoria);
}

// Devuelve todos los productos destacados
function obtenerProductosDestacados() {
    return PRODUCTOS.filter(p => p.destacado);
}

// Busca productos por nombre o descripción que incluyan el término
function buscarProductosPorNombre(termino) {
    const terminoLower = termino.toLowerCase();
    return PRODUCTOS.filter(p =>
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.descripcion.toLowerCase().includes(terminoLower)
    );
}
