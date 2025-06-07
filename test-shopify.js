// test-shopify.js
const ShopifyBuy = require('shopify-buy');

// Leer las variables de entorno desde la línea de comandos
const domain = process.argv[2] || 'tu-tienda.myshopify.com';
const token = process.argv[3] || 'tu-token-aqui';

console.log(`Probando conexión a Shopify con:`);
console.log(`- Dominio: ${domain}`);
console.log(`- Token: ${token.substring(0, 5)}...${token.substring(token.length - 5)}`);

// Crear cliente de Shopify
const client = ShopifyBuy.buildClient({
  domain: domain,
  storefrontAccessToken: token
});

// Intentar obtener todos los productos
console.log('Intentando obtener productos...');
client.product.fetchAll()
  .then(products => {
    console.log(`✅ Conexión exitosa! Se encontraron ${products.length} productos.`);
    if (products.length > 0) {
      console.log('\nPrimer producto:');
      console.log(`- ID: ${products[0].id}`);
      console.log(`- Título: ${products[0].title}`);
      console.log(`- Tipo: ${products[0].productType}`);
    }
  })
  .catch(error => {
    console.error('❌ Error al conectar con Shopify:');
    console.error(error);
  }); 