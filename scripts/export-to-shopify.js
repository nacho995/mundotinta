const fs = require('fs');
const path = require('path');

// Importar libros de ejemplo (reemplazar con tu fuente de datos real)
const sampleBooks = [
  {
    _id: '1',
    title: 'El Nombre del Viento',
    author: 'Patrick Rothfuss',
    description: 'La legendaria historia de Kvothe, un músico y mago.',
    price: 19.99,
    coverImage: '/images/covers/el-nombre-del-viento.jpg',
    genre: 'Fantasía',
    stock: 10
  },
  {
    _id: '2',
    title: 'Cien Años de Soledad',
    author: 'Gabriel García Márquez',
    description: 'La saga de la familia Buendía en el mítico pueblo de Macondo.',
    price: 15.50,
    coverImage: '/images/covers/cien-anos-de-soledad.jpg',
    genre: 'Realismo Mágico',
    stock: 5
  },
  {
    _id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'En el lejano planeta desértico Arrakis, la única fuente de la especia melange.',
    price: 22.00,
    coverImage: '/images/covers/dune.jpg',
    genre: 'Ciencia Ficción',
    stock: 12
  },
  {
    _id: '4',
    title: '1984',
    author: 'George Orwell',
    description: 'Una sombría visión de un futuro totalitario donde el Gran Hermano todo lo ve.',
    price: 12.75,
    coverImage: '/images/covers/1984.jpg',
    genre: 'Distopía',
    stock: 8
  }
];

// Crear CSV para importación a Shopify
function createShopifyCSV(books) {
  // Cabeceras del CSV de Shopify
  const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
    'Option1 Name', 'Option1 Value', 'Variant Price', 'Variant Compare At Price',
    'Image Src', 'Image Position', 'Image Alt Text', 'Metafield: custom.author [single_line_text_field]',
    'Metafield: custom.genre [single_line_text_field]', 'Metafield: custom.page_count [number_integer]'
  ].join(',');

  // Filas de datos
  const rows = books.map(book => {
    // Crear un handle amigable para URLs
    const handle = book.title.toLowerCase()
      .replace(/[^\w\sáéíóúüñ]/g, '')
      .replace(/\s+/g, '-')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    // Determinar colección para etiquetas
    const tags = book.genre === 'Ciencia Ficción' ? 'Ciencia Ficción, colección-ciencia-ficcion' : 
                 book.genre === 'Fantasía' ? 'Fantasía, colección-fantasia' : book.genre;
    
    // Crear fila de datos
    return [
      handle,                                  // Handle
      book.title,                              // Title
      book.description,                        // Body (HTML)
      'Editorial MundoTinta',                  // Vendor
      'Libro',                                 // Type
      tags,                                    // Tags
      'TRUE',                                  // Published
      'Formato',                               // Option1 Name
      'Físico',                                // Option1 Value
      book.price,                              // Variant Price
      '',                                      // Variant Compare At Price
      book.coverImage.replace(/^\//, 'https://mundo-tinta.com/'), // Image Src
      '1',                                     // Image Position
      `Portada de ${book.title}`,              // Image Alt Text
      book.author,                             // Metafield: custom.author
      book.genre,                              // Metafield: custom.genre
      '300'                                    // Metafield: custom.page_count
    ].map(value => `"${value}"`).join(',');
  });

  // Añadir variantes de ebook para cada libro
  const ebookRows = books.map(book => {
    const handle = book.title.toLowerCase()
      .replace(/[^\w\sáéíóúüñ]/g, '')
      .replace(/\s+/g, '-')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    // Precio del ebook (20% menos que el físico)
    const ebookPrice = (book.price * 0.8).toFixed(2);
    
    return [
      handle,                                  // Handle
      '',                                      // Title
      '',                                      // Body (HTML)
      '',                                      // Vendor
      '',                                      // Type
      '',                                      // Tags
      'TRUE',                                  // Published
      'Formato',                               // Option1 Name
      'Ebook',                                 // Option1 Value
      ebookPrice,                              // Variant Price
      '',                                      // Variant Compare At Price
      '',                                      // Image Src
      '',                                      // Image Position
      '',                                      // Image Alt Text
      '',                                      // Metafield: custom.author
      '',                                      // Metafield: custom.genre
      ''                                       // Metafield: custom.page_count
    ].map(value => `"${value}"`).join(',');
  });

  // Combinar todo
  return [headers, ...rows, ...ebookRows].join('\n');
}

// Ejecutar la exportación
const csvContent = createShopifyCSV(sampleBooks);
const outputPath = path.join(__dirname, '../shopify-import.csv');

fs.writeFileSync(outputPath, csvContent);
console.log(`CSV de Shopify generado en: ${outputPath}`); 