// Si usas shopify-buy
import ShopifyBuy from 'shopify-buy';
// Importar correctamente el SDK de Shopify
import * as StorefrontAPI from '@shopify/storefront-api-client';

// Configuración de Shopify con logs de depuración
const SHOPIFY_CONFIG = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'mundo-tint.myshopify.dev',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '201f953a3269193dfa2519367b43b092',
  apiVersion: '2023-10',
  // El token privado solo se usa en el servidor
  privateStorefrontToken: process.env.SHOPIFY_PRIVATE_STOREFRONT_TOKEN,
};

console.log('Configuración Shopify:', {
  domain: SHOPIFY_CONFIG.domain,
  tokenPrefix: SHOPIFY_CONFIG.storefrontAccessToken.substring(0, 5) + '...'
});

// Cliente basado en shopify-buy para compatibilidad
let shopifyBuyClient;

// Inicializar el cliente shopify-buy
export function getBuyClient() {
  if (!shopifyBuyClient) {
    try {
      shopifyBuyClient = ShopifyBuy.buildClient({
        domain: SHOPIFY_CONFIG.domain,
        storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
        apiVersion: SHOPIFY_CONFIG.apiVersion
      });
      console.log('Cliente Shopify inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar el cliente Shopify:', error);
      return null;
    }
  }
  return shopifyBuyClient;
}

// Para compatibilidad con código existente
export function getShopifyClient() {
  return getBuyClient();
}

// Obtener todos los libros por género
export async function getBooksByGenre(genre = null) {
  console.log(`Obteniendo libros ${genre ? `del género ${genre}` : 'de todos los géneros'}`);
  
  const client = getShopifyClient();
  if (!client) {
    console.error('Cliente Shopify no disponible');
    return [];
  }
  
  try {
    // Usando shopify-buy en lugar de storefront-api-client
    console.log('Realizando solicitud a Shopify...');
    const products = await client.product.fetchAll();
    console.log(`Obtenidos ${products.length} productos de Shopify`);
    
    // Filtrar por género si se especifica
    let filteredProducts = products;
    if (genre && genre !== 'Todos') {
      console.log(`Filtrando por género: ${genre}`);
      filteredProducts = products.filter(product => {
        const productGenre = product.metafields?.find(m => m.key === "genre")?.value || "";
        return productGenre.toLowerCase().includes(genre.toLowerCase());
      });
      console.log(`Productos filtrados: ${filteredProducts.length}`);
    }

    // Transformar los datos al formato que espera la aplicación
    return filteredProducts.map(product => {
      // Extraer metadatos si están disponibles
      const author = product.metafields?.find(m => m.key === "author")?.value || "Autor desconocido";
      const genre = product.metafields?.find(m => m.key === "genre")?.value || "";

      // Obtener variantes si están disponibles
      const formats = product.variants ? product.variants.map(variant => ({
        type: variant.title.toLowerCase().includes('ebook') ? 'ebook' : 'physical',
        variantId: variant.id,
        price: parseFloat(variant.price)
      })) : [];

      return {
        _id: product.id,
        id: product.id,
        title: product.title,
        author: author,
        description: product.description || '',
        price: parseFloat(product.variants[0]?.price || '0'),
        coverImage: product.images.length > 0 ? product.images[0].src : '/images/covers/default-book-cover.jpg',
        genre: genre,
        handle: product.handle,
        shopifyProductId: product.id,
        formats: formats
      };
    });
  } catch (error) {
    console.error("Error al obtener productos de Shopify:", error);
    // Si estamos en un entorno de desarrollo, devolver datos de fallback para pruebas
    if (process.env.NODE_ENV === 'development') {
      console.log('Devolviendo datos de fallback para desarrollo');
      return getFallbackBooks(genre);
    }
    return [];
  }
}

// Obtener un libro por ID o handle
export async function getBookById(idOrHandle) {
  console.log(`Obteniendo libro con ID/handle: ${idOrHandle}`);
  
  const client = getShopifyClient();
  if (!client) {
    console.error('Cliente Shopify no disponible');
    return null;
  }
  
  try {
    let product;
    
    // Determinar si es un ID o handle
    if (idOrHandle.includes('/')) {
      // Es un ID completo (gid://)
      console.log('Buscando por ID');
      product = await client.product.fetch(idOrHandle);
    } else {
      // Es un handle
      console.log('Buscando por handle');
      product = await client.product.fetchByHandle(idOrHandle);
    }
    
    if (!product) {
      console.log('Producto no encontrado');
      return null;
    }

    console.log('Producto encontrado:', product.title);

    // Extraer metadatos
    const author = product.metafields?.find(m => m.key === "author")?.value || "Autor desconocido";
    const genre = product.metafields?.find(m => m.key === "genre")?.value || "";
    const isbn = product.metafields?.find(m => m.key === "isbn")?.value || "";
    const pageCount = parseInt(product.metafields?.find(m => m.key === "page_count")?.value || "0");

    // Extraer variantes
    const formats = product.variants.map(variant => ({
      type: variant.title.toLowerCase().includes('ebook') ? 'ebook' : 'physical',
      variantId: variant.id,
      price: parseFloat(variant.price)
    }));

    return {
      _id: product.id,
      id: product.id,
      title: product.title,
      author: author,
      description: product.description || '',
      price: parseFloat(product.variants[0]?.price || '0'),
      coverImage: product.images.length > 0 ? product.images[0].src : '/images/covers/default-book-cover.jpg',
      genre: genre,
      isbn: isbn,
      pageCount: pageCount,
      shopifyProductId: product.id,
      formats: formats,
      handle: product.handle
    };
  } catch (error) {
    console.error(`Error al obtener el libro ${idOrHandle}:`, error);
    
    // Si estamos en un entorno de desarrollo, devolver un libro de fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('Devolviendo libro de fallback para desarrollo');
      const fallbackBooks = getFallbackBooks();
      return fallbackBooks.find(book => book.id === idOrHandle) || fallbackBooks[0];
    }
    
    return null;
  }
}

// Obtener URL de checkout
export async function createCheckout(items) {
  console.log('Creando checkout para', items.length, 'items');
  
  const client = getShopifyClient();
  if (!client) {
    console.error('Cliente Shopify no disponible');
    throw new Error("No se pudo conectar con Shopify");
  }
  
  try {
    // Crear un checkout usando shopify-buy
    console.log('Iniciando checkout...');
    const checkout = await client.checkout.create();
    
    // Añadir items al checkout
    console.log('Añadiendo items al checkout...');
    const lineItems = items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity
    }));
    
    // Actualizar el checkout con los items
    const updatedCheckout = await client.checkout.addLineItems(checkout.id, lineItems);
    
    // Devolver la URL del checkout
    console.log('Checkout creado exitosamente');
    return updatedCheckout.webUrl;
  } catch (error) {
    console.error("Error al crear el checkout:", error);
    throw error;
  }
}

// Función para proporcionar libros de fallback durante el desarrollo
function getFallbackBooks(genre = null) {
  console.log('Usando libros de fallback');
  
  const fallbackBooks = [
    {
      _id: 'gid://shopify/Product/1',
      id: 'gid://shopify/Product/1',
      title: 'El Nombre del Viento',
      author: 'Patrick Rothfuss',
      description: 'La historia de Kvothe, un músico convertido en mago, aventurero y asesino.',
      price: 19.99,
      coverImage: '/images/covers/el-nombre-del-viento.jpg',
      genre: 'Fantasía',
      formats: [
        { type: 'physical', variantId: 'gid://shopify/ProductVariant/1', price: 19.99 },
        { type: 'ebook', variantId: 'gid://shopify/ProductVariant/2', price: 12.99 }
      ]
    },
    {
      _id: 'gid://shopify/Product/2',
      id: 'gid://shopify/Product/2',
      title: 'Dune',
      author: 'Frank Herbert',
      description: 'En el inhóspito planeta desértico de Arrakis, la única fuente de la especia melange.',
      price: 22.99,
      coverImage: '/images/covers/dune.jpg',
      genre: 'Ciencia Ficción',
      formats: [
        { type: 'physical', variantId: 'gid://shopify/ProductVariant/3', price: 22.99 },
        { type: 'ebook', variantId: 'gid://shopify/ProductVariant/4', price: 14.99 }
      ]
    },
    {
      _id: 'gid://shopify/Product/3',
      id: 'gid://shopify/Product/3',
      title: 'El Camino de los Reyes',
      author: 'Brandon Sanderson',
      description: 'Primer libro de la saga El Archivo de las Tormentas, una épica de proporciones gigantescas.',
      price: 24.99,
      coverImage: '/images/covers/el-camino-de-los-reyes.jpg',
      genre: 'Fantasía',
      formats: [
        { type: 'physical', variantId: 'gid://shopify/ProductVariant/5', price: 24.99 },
        { type: 'ebook', variantId: 'gid://shopify/ProductVariant/6', price: 15.99 }
      ]
    }
  ];
  
  if (!genre || genre === 'Todos') {
    return fallbackBooks;
  }
  
  return fallbackBooks.filter(book => book.genre === genre);
}

// Resto del código como estaba en el README...