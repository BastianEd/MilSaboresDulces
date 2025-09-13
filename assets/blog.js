/**
 * PASTELERÍA MIL SABORES - BLOG
 * Funciones para manejo del blog y artículos
 */

// ===============================
// CARGA Y VISUALIZACIÓN DEL BLOG
// ===============================

// Inicializa el blog cargando la grilla de artículos y configurando filtros
function cargarBlog() {
    actualizarGridBlog();
    configurarFiltrosBlog();
}

// Configura los botones de filtro por categoría
function configurarFiltrosBlog() {
    document.querySelectorAll('.blog-categories .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Quitar estado activo de todos los botones
            document.querySelectorAll('.blog-categories .filter-btn').forEach(b =>
                b.classList.remove('active')
            );
            // Activar solo el botón actual
            btn.classList.add('active');

            // Guardar la categoría seleccionada en estado global y actualizar grilla
            appState.blogCategoriaActual = btn.getAttribute('data-category');
            actualizarGridBlog();
        });
    });
}

// Actualiza la grilla de artículos según el filtro aplicado
function actualizarGridBlog() {
    const container = document.getElementById('blog-grid');
    if (!container) return;

    let articulos = BLOG_ARTICULOS;

    // Si la categoría no es "all", filtra los artículos
    if (appState.blogCategoriaActual !== 'all') {
        articulos = articulos.filter(articulo =>
            articulo.categoria === appState.blogCategoriaActual
        );
    }

    // Renderiza cada tarjeta de artículo en el contenedor
    container.innerHTML = articulos.map(articulo =>
        crearTarjetaBlog(articulo)
    ).join('');
}

// ===============================
// CREACIÓN DE TARJETAS DE BLOG
// ===============================

// Genera la tarjeta HTML de cada artículo en la grilla
function crearTarjetaBlog(articulo) {
    return `
        <article class="blog-card">
            <div class="blog-image">
                <span class="blog-emoji">${articulo.imagen}</span>
                <div class="blog-category">${capitalizarPalabra(articulo.categoria)}</div>
            </div>
            <div class="blog-content">
                <h3 class="blog-title">${articulo.titulo}</h3>
                <p class="blog-excerpt">${truncarTexto(articulo.contenido, 120)}</p>
                <div class="blog-meta">
                    <span class="blog-author">
                        <i class="fas fa-user"></i> ${articulo.autor}
                    </span>
                    <span class="blog-date">
                        <i class="fas fa-calendar"></i> ${formatearFecha(articulo.fecha)}
                    </span>
                </div>
                <button class="btn-primary" onclick="verArticulo(${articulo.id})">
                    <i class="fas fa-book-open"></i> Leer más
                </button>
            </div>
        </article>
    `;
}

// ===============================
// MODAL DE ARTÍCULO COMPLETO
// ===============================

// Muestra un artículo en un modal con todo el detalle
function verArticulo(id) {
    const articulo = BLOG_ARTICULOS.find(a => a.id === id);
    if (!articulo) return;

    // Plantilla con todo el detalle del artículo
    const modalContent = `
        <div class="blog-detail">
            <div class="blog-detail-header">
                <h1>${articulo.titulo}</h1>
                <div class="blog-detail-meta">
                    <span class="blog-detail-category">${capitalizarPalabra(articulo.categoria)}</span>
                    <span class="blog-detail-author">
                        <i class="fas fa-user"></i> ${articulo.autor}
                    </span>
                    <span class="blog-detail-date">
                        <i class="fas fa-calendar"></i> ${formatearFecha(articulo.fecha)}
                    </span>
                </div>
            </div>
            <div class="blog-detail-image">
                <span class="blog-detail-emoji">${articulo.imagen}</span>
            </div>
            <div class="blog-detail-content">
                <p class="blog-intro">${articulo.contenido}</p>
                
                ${generarContenidoAdicional(articulo)}
                
                <div class="blog-detail-actions">
                    <button class="btn-secondary" onclick="compartirArticulo(${articulo.id})">
                        <i class="fas fa-share"></i> Compartir
                    </button>
                    <button class="btn-primary" onclick="navegarA('productos'); cerrarModal(this);">
                        <i class="fas fa-shopping-cart"></i> Ver Productos
                    </button>
                </div>
                
                <div class="blog-navigation">
                    ${generarNavegacionArticulos(id)}
                </div>
            </div>
        </div>
    `;

    crearModal(modalContent);
}

// ===============================
// CONTENIDO ADICIONAL POR CATEGORÍA
// ===============================

// Decide qué tipo de contenido adicional mostrar según la categoría
function generarContenidoAdicional(articulo) {
    switch (articulo.categoria) {
        case 'recetas':
            return generarRecetaCompleta(articulo);
        case 'tips':
            return generarTipsAdicionales(articulo);
        case 'historia':
            return generarDatosHistoricos(articulo);
        case 'eventos':
            return generarDetallesEvento(articulo);
        default:
            return '';
    }
}

// Genera la receta completa (ingredientes, preparación y tips)
function generarRecetaCompleta(articulo) {
    // Recetas predefinidas para ciertos artículos
    const recetas = {
        3: { /* receta id 3 ... */ },
        6: { /* receta id 6 ... */ }
    };

    const receta = recetas[articulo.id];
    if (!receta) return '<p><em>Receta completa disponible próximamente...</em></p>';

    // Renderiza listas de ingredientes, preparación y tips
    return `
        <div class="receta-completa">
            <h3><i class="fas fa-list"></i> Ingredientes:</h3>
            <ul class="ingredientes-lista">
                ${receta.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            
            <h3><i class="fas fa-clipboard-list"></i> Preparación:</h3>
            <ol class="preparacion-lista">
                ${receta.preparacion.map(paso => `<li>${paso}</li>`).join('')}
            </ol>
            
            ${receta.tips ? `
                <h3><i class="fas fa-lightbulb"></i> Tips del Chef:</h3>
                <ul class="tips-lista">
                    ${receta.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `;
}

// Genera tips extra de decoración o técnicas
function generarTipsAdicionales(articulo) {
    const tips = {
        2: { /* tips id 2 */ },
        5: { /* tips id 5 */ }
    };

    const tipsArticulo = tips[articulo.id];
    if (!tipsArticulo) return '';

    return `
        <div class="tips-adicionales">
            <h3><i class="fas fa-star"></i> ${tipsArticulo.titulo}</h3>
            <ul class="tips-lista">
                ${tipsArticulo.consejos.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Genera contenido histórico en formato línea de tiempo
function generarDatosHistoricos(articulo) {
    if (articulo.id === 1) {
        return `
            <div class="datos-historicos">
                <h3><i class="fas fa-history"></i> Hitos Históricos</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <strong>1800s</strong> - Llegada de técnicas europeas a Chile
                    </div>
                    <div class="timeline-item">
                        <strong>1900s</strong> - Desarrollo del manjar chileno
                    </div>
                    <div class="timeline-item">
                        <strong>1950s</strong> - Popularización de la torta tres leches
                    </div>
                    <div class="timeline-item">
                        <strong>1975</strong> - Fundación de Pastelería Mil Sabores
                    </div>
                </div>
            </div>
        `;
    }
    return '';
}

// Genera la descripción de eventos memorables
function generarDetallesEvento(articulo) {
    if (articulo.id === 4) {
        return `
            <div class="detalles-evento">
                <h3><i class="fas fa-birthday-cake"></i> Momentos Memorables</h3>
                <div class="eventos-grid">
                    <div class="evento-item">
                        <h4>1995 - Récord Guinness</h4>
                        <p>Torta más grande de Chile con 500kg</p>
                    </div>
                    <div class="evento-item">
                        <h4>2000 - Primera Sede</h4>
                        <p>Apertura en Providencia</p>
                    </div>
                    <div class="evento-item">
                        <h4>2015 - Tienda Online</h4>
                        <p>Lanzamiento del e-commerce</p>
                    </div>
                </div>
            </div>
        `;
    }
    return '';
}

// ===============================
// NAVEGACIÓN ENTRE ARTÍCULOS
// ===============================

// Permite navegar al artículo anterior y siguiente desde el modal
function generarNavegacionArticulos(idActual) {
    const indiceActual = BLOG_ARTICULOS.findIndex(a => a.id === idActual);
    let navegacion = '<div class="articulos-relacionados">';

    // Botón al artículo anterior
    if (indiceActual > 0) {
        const anterior = BLOG_ARTICULOS[indiceActual - 1];
        navegacion += `
            <button class="btn-nav-blog anterior" onclick="verArticulo(${anterior.id})">
                <i class="fas fa-chevron-left"></i> ${anterior.titulo}
            </button>
        `;
    }

    // Botón al artículo siguiente
    if (indiceActual < BLOG_ARTICULOS.length - 1) {
        const siguiente = BLOG_ARTICULOS[indiceActual + 1];
        navegacion += `
            <button class="btn-nav-blog siguiente" onclick="verArticulo(${siguiente.id})">
                ${siguiente.titulo} <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    navegacion += '</div>';
    return navegacion;
}

// ===============================
// UTILIDADES DEL BLOG
// ===============================

// Comparte artículo usando el API de compartir o copiando al portapapeles
function compartirArticulo(id) {
    const articulo = BLOG_ARTICULOS.find(a => a.id === id);
    if (!articulo) return;

    if (navigator.share) {
        // Si el navegador soporta navigator.share
        navigator.share({
            title: articulo.titulo,
            text: articulo.contenido,
            url: `${window.location.href}#blog-${id}`
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Si no, copia al portapapeles como fallback
        const texto = `${articulo.titulo}\n\n${articulo.contenido}\n\n${window.location.href}#blog-${id}`;
        navigator.clipboard.writeText(texto).then(() => {
            mostrarNotificacion('Artículo copiado al portapapeles');
        }).catch(() => {
            mostrarNotificacion('No se pudo copiar el artículo', 'error');
        });
    }
}

// Trunca el texto a un límite de caracteres
function truncarTexto(texto, limite) {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
}

// Capitaliza la primera letra de una palabra
function capitalizarPalabra(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}
