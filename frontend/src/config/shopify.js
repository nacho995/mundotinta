// Si usas shopify-buy
import ShopifyBuy from 'shopify-buy';
// Importar correctamente el SDK de Shopify
import * as StorefrontAPI from '@shopify/storefront-api-client';

// Configuración de Shopify
const SHOPIFY_CONFIG = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'mundo-tint.myshopify.dev',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '201f953a3269193dfa2519367b43b092',
  apiVersion: '2023-10',
  // El token privado solo se usa en el servidor
  privateStorefrontToken: process.env.SHOPIFY_PRIVATE_STOREFRONT_TOKEN,
};

// Cliente basado en shopify-buy para compatibilidad
let shopifyBuyClient;

// Inicializar el cliente shopify-buy
export function getBuyClient() {
  if (!shopifyBuyClient) {
    shopifyBuyClient = ShopifyBuy.buildClient({
      domain: SHOPIFY_CONFIG.domain,
      storefrontAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
      apiVersion: SHOPIFY_CONFIG.apiVersion
    });
  }
  return shopifyBuyClient;
}

// Para compatibilidad con código existente
export function getShopifyClient() {
  return getBuyClient();
}

// Obtener todos los libros por género
export async function getBooksByGenre(genre = null) {
  const client = getShopifyClient();
  
  try {
    // Usando shopify-buy en lugar de storefront-api-client
    let products;
    
    if (genre) {
      // Intentar buscar por colección si hay género
      const collectionQuery = genre === 'Ciencia Ficción' ? 'ciencia-ficcion' : 
                             genre === 'Fantasía' ? 'fantasia' : genre;
      
      try {
        // Primero intentar obtener la colección por handle
        const collections = await client.collection.fetchByHandle(collectionQuery);
        if (collections) {
          products = await client.collection.fetchWithProducts(collections.id, {productsFirst: 20});
          products = products.products;
        }
      } catch (error) {
        console.log(`No se encontró colección para ${genre}, buscando productos...`);
        // Si no hay colección, buscar por palabra clave
        products = await client.product.fetchAll();
        // Filtrar por género si es posible
        products = products.filter(p => {
          const productGenre = p.metafields?.find(m => m.key === "genre")?.value;
          return productGenre && productGenre.toLowerCase().includes(genre.toLowerCase());
        });
      }
    } else {
      // Si no hay género, obtener todos los productos
      products = await client.product.fetchAll();
    }

    // Transformar los datos al formato que espera tu aplicación
    return products.map(product => {
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
        coverImage: product.images.length > 0 ? product.images[0].src : null,
        genre: genre,
        handle: product.handle,
        shopifyProductId: product.id,
        formats: formats
      };
    });
  } catch (error) {
    console.error("Error al obtener productos de Shopify:", error);
    return [];
  }
}

// Obtener un libro por ID o handle
export async function getBookById(idOrHandle) {
  const client = getShopifyClient();
  
  try {
    let product;
    
    // Determinar si es un ID o handle
    if (idOrHandle.includes('/')) {
      // Es un ID completo (gid://)
      product = await client.product.fetch(idOrHandle);
    } else {
      // Es un handle
      product = await client.product.fetchByHandle(idOrHandle);
    }
    
    if (!product) return null;

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
      coverImage: product.images.length > 0 ? product.images[0].src : null,
      genre: genre,
      isbn: isbn,
      pageCount: pageCount,
      shopifyProductId: product.id,
      formats: formats,
      handle: product.handle
    };
  } catch (error) {
    console.error(`Error al obtener el libro ${idOrHandle}:`, error);
    return null;
  }
}

// Obtener URL de checkout
export async function createCheckout(items) {
  const client = getShopifyClient();
  
  try {
    // Crear un checkout usando shopify-buy
    const checkout = await client.checkout.create();
    
    // Añadir items al checkout
    const lineItems = items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity
    }));
    
    // Actualizar el checkout con los items
    const updatedCheckout = await client.checkout.addLineItems(checkout.id, lineItems);
    
    // Devolver la URL del checkout
    return updatedCheckout.webUrl;
  } catch (error) {
    console.error("Error al crear el checkout:", error);
    throw error;
  }
}

// Resto del código como estaba en el README...