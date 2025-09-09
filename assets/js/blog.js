/**
 * PASTELERÍA MIL SABORES - BLOG
 * Funciones para manejo del blog y artículos
 */

// ===============================
// CARGA Y VISUALIZACIÓN DEL BLOG
// ===============================

function cargarBlog() {
    actualizarGridBlog();
    configurarFiltrosBlog();
}

function configurarFiltrosBlog() {
    document.querySelectorAll('.blog-categories .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Actualizar botón activo
            document.querySelectorAll('.blog-categories .filter-btn').forEach(b => 
                b.classList.remove('active')
            );
            btn.classList.add('active');

            // Aplicar filtro
            appState.blogCategoriaActual = btn.getAttribute('data-category');
            actualizarGridBlog();
        });
    });
}

function actualizarGridBlog() {
    const container = document.getElementById('blog-grid');
    if (!container) return;

    let articulos = BLOG_ARTICULOS;

    if (appState.blogCategoriaActual !== 'all') {
        articulos = articulos.filter(articulo => 
            articulo.categoria === appState.blogCategoriaActual
        );
    }

    container.innerHTML = articulos.map(articulo => 
        crearTarjetaBlog(articulo)
    ).join('');
}

// ===============================
// CREACIÓN DE TARJETAS DE BLOG
// ===============================

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

function verArticulo(id) {
    const articulo = BLOG_ARTICULOS.find(a => a.id === id);
    if (!articulo) return;

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

function generarRecetaCompleta(articulo) {
    const recetas = {
        3: {
            ingredientes: [
                '3 tazas de harina todo uso',
                '1 taza de azúcar granulada',
                '4 huevos grandes',
                '1 taza de manjar casero',
                '1/2 taza de mantequilla sin sal',
                '1 cucharadita de polvo de hornear',
                '1/2 taza de leche tibia',
                'Nueces picadas al gusto',
                'Pizca de sal'
            ],
            preparacion: [
                'Precalentar el horno a 180°C y engrasar un molde redondo',
                'Tamizar la harina con el polvo de hornear y la sal',
                'Batir huevos con azúcar hasta obtener una mezcla blanquecina',
                'Derretir la mantequilla y dejar entibiar',
                'Incorporar la mantequilla a la mezcla de huevos',
                'Agregar la harina alternando con la leche, mezclando suavemente',
                'Verter en el molde y hornear por 25-30 minutos',
                'Dejar enfriar completamente antes de desmoldar',
                'Cortar por la mitad y rellenar con manjar generosamente',
                'Decorar con nueces picadas y un toque de manjar por encima'
            ],
            tips: [
                'Todos los ingredientes deben estar a temperatura ambiente',
                'No batas en exceso la masa para evitar que el bizcocho quede duro',
                'Prueba la cocción con un palillo, debe salir limpio',
                'El manjar casero le da un sabor más auténtico que el comercial'
            ]
        },
        6: {
            ingredientes: [
                '2 tazas de harina sin gluten',
                '1/2 taza de cacao en polvo',
                '1 taza de azúcar morena',
                '3 huevos grandes',
                '1/2 taza de aceite vegetal',
                '1 cucharadita de esencia de vainilla',
                '1/2 taza de chips de chocolate sin gluten',
                '1/4 cucharadita de sal'
            ],
            preparacion: [
                'Precalentar horno a 175°C',
                'Mezclar ingredientes secos en un bowl',
                'En otro bowl, batir huevos, aceite y vainilla',
                'Combinar ambas mezclas hasta integrar',
                'Agregar chips de chocolate',
                'Verter en molde engrasado',
                'Hornear 20-25 minutos',
                'Dejar enfriar antes de cortar'
            ],
            tips: [
                'Usa harina certificada sin gluten',
                'No hornees en exceso para mantener la humedad',
                'Guarda en recipiente hermético hasta 5 días'
            ]
        }
    };

    const receta = recetas[articulo.id];
    if (!receta) return '<p><em>Receta completa disponible próximamente...</em></p>';

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

function generarTipsAdicionales(articulo) {
    const tips = {
        2: {
            titulo: 'Técnicas Profesionales para Bizcochos',
            consejos: [
                'Usa ingredientes a temperatura ambiente para mejor incorporación',
                'No abras el horno los primeros 20 minutos para evitar que se baje',
                'Tamiza siempre la harina para obtener mejor textura',
                'El batido en exceso desarrolla el gluten y endurece el bizcocho',
                'Prueba la cocción con un palillo en el centro'
            ]
        },
        5: {
            titulo: 'Técnicas de Decoración Profesional',
            consejos: [
                'Usa boquillas de diferentes tamaños para variedad',
                'Practica la presión constante para líneas uniformes',
                'Mantén la crema bien fría para mejor consistencia',
                'Gira el plato, no la manga, para hacer rosetas',
                'Practica primero sobre papel antes del producto final'
            ]
        }
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

function generarNavegacionArticulos(idActual) {
    const indiceActual = BLOG_ARTICULOS.findIndex(a => a.id === idActual);
    let navegacion = '<div class="articulos-relacionados">';
    
    if (indiceActual > 0) {
        const anterior = BLOG_ARTICULOS[indiceActual - 1];
        navegacion += `
            <button class="btn-nav-blog anterior" onclick="verArticulo(${anterior.id})">
                <i class="fas fa-chevron-left"></i> ${anterior.titulo}
            </button>
        `;
    }
    
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

function compartirArticulo(id) {
    const articulo = BLOG_ARTICULOS.find(a => a.id === id);
    if (!articulo) return;

    if (navigator.share) {
        navigator.share({
            title: articulo.titulo,
            text: articulo.contenido,
            url: `${window.location.href}#blog-${id}`
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copiar al portapapeles
        const texto = `${articulo.titulo}\n\n${articulo.contenido}\n\n${window.location.href}#blog-${id}`;
        navigator.clipboard.writeText(texto).then(() => {
            mostrarNotificacion('Artículo copiado al portapapeles');
        }).catch(() => {
            mostrarNotificacion('No se pudo copiar el artículo', 'error');
        });
    }
}

function truncarTexto(texto, limite) {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
}

function capitalizarPalabra(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}