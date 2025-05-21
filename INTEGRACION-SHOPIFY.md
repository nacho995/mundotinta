# Integración de MundoTinta con Shopify

Este documento explica cómo se ha implementado la integración de MundoTinta con Shopify y los pasos que debes seguir para completarla.

## Prerrequisitos

1. **Cuenta de Shopify**: Debes tener una cuenta en Shopify. Ya has iniciado con la tienda en mundo-tint.myshopify.dev.

2. **Canal de ventas Hydrogen**: Es necesario instalar el canal de ventas Hydrogen desde la tienda de aplicaciones de Shopify:
   - Visita: https://apps.shopify.com/hydrogen
   - Instala la aplicación en tu tienda
   - Sigue las instrucciones de configuración

## Estructura de la integración

La integración se ha realizado con los siguientes componentes:

1. **API de Storefront**: Se utiliza `@shopify/storefront-api-client` para comunicarse con la API de Shopify.

2. **Configuración de Shopify**: El archivo `frontend/src/config/shopify.js` contiene todas las funciones necesarias para obtener productos y crear checkouts.

3. **Hook personalizado**: El hook `useGoogleBooks` ha sido modificado para obtener libros de Shopify en lugar de Google Books.

4. **Contexto del carrito**: Se ha actualizado para integrarse con Shopify y crear checkouts.

## Configuración del entorno

1. **Variables de entorno**: Crea un archivo `.env.local` en el directorio `frontend` con el siguiente contenido:

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=mundo-tint.myshopify.dev
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=201f953a3269193dfa2519367b43b092
SHOPIFY_PRIVATE_STOREFRONT_TOKEN=tu_token_privado_aqui
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

2. **Tokens de API de Storefront**:
   
   Shopify proporciona dos tipos de tokens para la API Storefront:
   
   - **Token público** (201f953a3269193dfa2519367b43b092): 
     - Se usa para operaciones del lado del cliente
     - Seguro para incluir en código frontend
     - Tiene permisos limitados por seguridad
   
   - **Token privado** (shpat_ad79...): 
     - SOLO para operaciones del lado del servidor (rutas /api, Server Components)
     - NUNCA debe incluirse en código del lado del cliente
     - Tiene más permisos y es sensible
     - Debe mantenerse seguro y no publicarse

   El archivo `config/shopify.js` está configurado para usar automáticamente el token correcto según el contexto.

## Configuración de productos en Shopify

1. **Crear colecciones**:
   - Crea una colección llamada "ciencia-ficcion" para libros de ciencia ficción
   - Crea una colección llamada "fantasia" para libros de fantasía

2. **Metadatos personalizados**:
   Para cada producto, configura los siguientes metadatos:
   - Autor (metafield namespace: "custom", key: "author", tipo: texto)
   - Género (metafield namespace: "custom", key: "genre", tipo: texto)
   - ISBN (metafield namespace: "custom", key: "isbn", tipo: texto)
   - Número de páginas (metafield namespace: "custom", key: "page_count", tipo: número entero)

3. **Variantes de producto**:
   Configura cada libro con dos variantes:
   - Formato: Físico
   - Formato: Ebook (con un precio aproximadamente 20% menor)

## Importación de datos

1. **Exportar datos actuales**:
   Se ha creado un script para exportar los datos de muestra a un formato CSV compatible con Shopify:
   ```
   node scripts/export-to-shopify.js
   ```

2. **Importar a Shopify**:
   - Ve a Productos > Importar en el panel de administración de Shopify
   - Sube el archivo generado `shopify-import.csv`
   - Sigue las instrucciones para completar la importación

## Seguridad con los tokens de API

Para mantener seguros tus tokens de API, sigue estas prácticas:

1. **Token público**: Se puede usar en componentes de cliente, pero limita su uso a:
   - Consultas de productos
   - Creación de checkout
   - Operaciones de solo lectura

2. **Token privado**: Debe usarse SOLO en:
   - Rutas API de Next.js (`app/api/...`)
   - Componentes de servidor de Next.js o en funciones `server-action`
   - Nunca en componentes de cliente

3. **Si necesitas permisos elevados desde el cliente**:
   - Crea un endpoint de API en tu backend que use el token privado
   - Llama a ese endpoint desde el cliente en lugar de usar directamente la API de Shopify

## Verificación de la integración

Para verificar que la integración funciona correctamente:

1. **Comprobar obtención de productos**:
   - Visita la página de biblioteca para ver si los libros se cargan correctamente
   - Verifica que se muestren los detalles como autor, género y precio

2. **Comprobar proceso de compra**:
   - Añade un libro al carrito
   - Ve al carrito y haz clic en "Comprar"
   - Deberías ser redirigido al checkout de Shopify con los productos correctos

## Solución de problemas

Si la integración no funciona correctamente, verifica:

1. **Token de API**: Asegúrate de que los tokens público y privado son correctos.

2. **Estructura de productos**: Verifica que tus productos en Shopify tienen configurados correctamente los metadatos y variantes.

3. **Consola de desarrollador**: Revisa los mensajes de error en la consola del navegador.

## Mantenimiento

Para mantener la integración funcionando correctamente:

1. **Actualizaciones de productos**: Al añadir nuevos libros, asegúrate de seguir la misma estructura de metadatos y variantes.

2. **Actualizaciones de la API**: Si Shopify actualiza su API, es posible que debas actualizar la versión en `config/shopify.js`.

3. **Rotación de tokens**: Si necesitas rotar los tokens por seguridad, actualiza ambos en el panel de Shopify y en tu archivo `.env.local`.

---

Para cualquier duda o problema, ponte en contacto con el desarrollador. 