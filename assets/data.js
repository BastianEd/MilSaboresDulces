/**
 * PASTELERÍA MIL SABORES - DATOS DE LA APLICACIÓN
 * Contiene todas las constantes y datos estáticos
 */

// Lista de productos disponibles en la pastelería
// Cada producto tiene: código, nombre, categoría, precio, descripción, imagen y si es destacado
const PRODUCTOS = [
    {
        codigo: "TC001",
        nombre: "Torta Cuadrada de Chocolate",
        categoria: "Tortas Cuadradas",
        precio: 45000,
        descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
        imagen: "./assets/img/TortaCuadradaDeChocolate.webp",
        destacado: true // Se usa para resaltar en la tienda
    },
    {
        codigo: "TC002",
        nombre: "Torta Cuadrada de Frutas",
        categoria: "Tortas Cuadradas",
        precio: 50000,
        descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.",
        imagen: "./assets/img/TortaCuadradaDeFrutas.jpg"
    },
    {
        codigo: "TT001",
        nombre: "Torta Circular de Vainilla",
        categoria: "Tortas Circulares",
        precio: 40000,
        descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.",
        imagen: "./assets/img/TortaCircularDeVainilla.png",
        destacado: true
    },
    {
        codigo: "TT002",
        nombre: "Torta Circular de Manjar",
        categoria: "Tortas Circulares",
        precio: 42000,
        descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.",
        imagen: "./assets/img/TortaCircularDeManjar.png"
    },
    {
        codigo: "PI001",
        nombre: "Mousse de Chocolate",
        categoria: "Postres Individuales",
        precio: 5000,
        descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.",
        imagen: "./assets/img/MousseDeChocolate.jpg",
        destacado: true
    },
    {
        codigo: "PI002",
        nombre: "Tiramisú Clásico",
        categoria: "Postres Individuales",
        precio: 5500,
        descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.",
        imagen: "./assets/img/TiramisuClasico.webp"
    },
    {
        codigo: "PSA001",
        nombre: "Torta Sin Azúcar de Naranja",
        categoria: "Productos Sin Azúcar",
        precio: 48000,
        descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.",
        imagen: "./assets/img/TortaSinAzucarDeNaranja.jpg"
    },
    {
        codigo: "PSA002",
        nombre: "Cheesecake Sin Azúcar",
        categoria: "Productos Sin Azúcar",
        precio: 47000,
        descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.",
        imagen: "./assets/img/CheesecakeSinAzucar.jpg"
    },
    {
        codigo: "PT001",
        nombre: "Empanada de Manzana",
        categoria: "Pastelería Tradicional",
        precio: 3000,
        descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.",
        imagen: "./assets/img/EmpanadaDeManzana.jpg"
    },
    {
        codigo: "PT002",
        nombre: "Tarta de Santiago",
        categoria: "Pastelería Tradicional",
        precio: 6000,
        descripcion: "Tradicional tarta española hecha con almendras, azúcar, y huevos, una delicia para los amantes de los postres clásicos.",
        imagen: "./assets/img/TartaDeSantiago.webp"
    },
    {
        codigo: "PG001",
        nombre: "Brownie Sin Gluten",
        categoria: "Productos Sin Gluten",
        precio: 4000,
        descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.",
        imagen: "./assets/img/BrownieSinGluten.jpeg"
    },
    {
        codigo: "PG002",
        nombre: "Pan Sin Gluten",
        categoria: "Productos Sin Gluten",
        precio: 3500,
        descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.",
        imagen: "./assets/img/PanSinGluten.webp"
    },
    {
        codigo: "PV001",
        nombre: "Torta Vegana de Chocolate",
        categoria: "Productos Vegana",
        precio: 50000,
        descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.",
        imagen: "./assets/img/TortaVeganaDeChocolate.png"
    },
    {
        codigo: "PV002",
        nombre: "Galletas Veganas de Avena",
        categoria: "Productos Vegana",
        precio: 4500,
        descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.",
        imagen: "./assets/img/GalletasVeganasDeAvena.jpg"
    },
    {
        codigo: "TE001",
        nombre: "Torta Especial de Cumpleaños",
        categoria: "Tortas Especiales",
        precio: 55000,
        descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.",
        imagen: "./assets/img/TortaEspecialDeCumpleaños.jpg",
        destacado: true
    },
    {
        codigo: "TE002",
        nombre: "Torta Especial de Boda",
        categoria: "Tortas Especiales",
        precio: 60000,
        descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.",
        imagen: "./assets/img/TortaEspecialDeBoda.webp"
    }
];

// Categorías disponibles de los productos (se usa para filtros o menús)
const CATEGORIAS = [
    "Tortas Cuadradas",
    "Tortas Circulares",
    "Postres Individuales",
    "Productos Sin Azúcar",
    "Pastelería Tradicional",
    "Productos Sin Gluten",
    "Productos Vegana",
    "Tortas Especiales"
];

// Información de la empresa (usada en páginas de "nosotros" o pie de página)
const EMPRESA = {
    nombre: "Pastelería Mil Sabores",
    eslogan: "Dulces momentos desde 1975",
    aniversario: "50",
    mision: "Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.",
    vision: "Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía."
};

// Blog de la página (secciones de artículos con tips, recetas e historia)
const BLOG_ARTICULOS = [
    {
        id: 1,
        titulo: "Historia de la Repostería Chilena",
        categoria: "historia", // Categoría del artículo
        contenido: "Descubre cómo ha evolucionado la repostería en Chile desde sus orígenes hasta nuestros días. Un viaje por las tradiciones dulces que han marcado nuestra cultura gastronómica.",
        fecha: "2024-01-15",
        autor: "Chef Patricia Morales",
        imagen: "📚" // Se usa como emoji/ícono representativo
    },
    {
        id: 2,
        titulo: "Secretos para el Bizcocho Perfecto",
        categoria: "tips",
        contenido: "Aprende las técnicas profesionales para lograr un bizcocho esponjoso y delicioso cada vez. Tips que han sido guardados por generaciones de reposteros.",
        fecha: "2024-01-20",
        autor: "Maestro Carlos Vega",
        imagen: "🎂"
    },
    {
        id: 3,
        titulo: "Receta Tradicional: Torta de Manjar",
        categoria: "recetas",
        contenido: "La receta familiar que hemos perfeccionado durante 50 años de tradición. Un clásico chileno que nunca pasa de moda.",
        fecha: "2024-02-01",
        autor: "Abuela Rosa Sabores",
        imagen: "📝"
    },
    {
        id: 4,
        titulo: "Celebrando 50 Años de Dulzura",
        categoria: "eventos",
        contenido: "Un recorrido por los momentos más dulces de nuestra historia empresarial. Medio siglo endulzando la vida de las familias chilenas.",
        fecha: "2024-02-14",
        autor: "Familia Mil Sabores",
        imagen: "🎉"
    },
    {
        id: 5,
        titulo: "Técnicas de Decoración con Crema",
        categoria: "tips",
        contenido: "Conviértete en un experto decorando tortas con técnicas profesionales. Desde rosetas básicas hasta diseños elaborados.",
        fecha: "2024-02-20",
        autor: "Chef Andrea Silva",
        imagen: "🌟"
    },
    {
        id: 6,
        titulo: "Brownies Sin Gluten: La Receta Perfecta",
        categoria: "recetas",
        contenido: "Disfruta de deliciosos brownies sin comprometer el sabor ni la textura. Una alternativa perfecta para celíacos.",
        fecha: "2024-03-01",
        autor: "Nutricionista María López",
        imagen: "🍫"
    }
];

// Usuarios de demostración (para pruebas de login o perfiles en la aplicación)
const USUARIOS_DEMO = [
    {
        email: "mayor@gmail.com",
        password: "password123", // Contraseña ficticia de ejemplo
        nombre: "Elena Rodríguez",
        fechaNacimiento: "1960-05-15",
        tipoUsuario: "mayor" // Segmento de usuario (ej: descuentos especiales)
    },
    {
        email: "estudiante@duoc.cl",
        password: "password123",
        nombre: "Diego Muñoz",
        fechaNacimiento: "2002-08-22",
        tipoUsuario: "estudiante_duoc" // Segmento de estudiantes DUOC
    },
    {
        email: "usuario@gmail.com",
        password: "password123",
        nombre: "Carmen Jiménez",
        fechaNacimiento: "1990-12-10",
        tipoUsuario: "regular" // Usuario normal
    }
];
