# Mundo Tinta Backend

Backend para la aplicación Mundo Tinta, una biblioteca/librería virtual.

## Despliegue en Render

Para desplegar este backend en Render, sigue estos pasos:

1. Crea una cuenta en [Render](https://render.com) si aún no tienes una
2. Conecta tu repositorio de GitHub
3. Crea un nuevo "Web Service"
4. Selecciona el repositorio y la rama donde está el código del backend
5. Configura las siguientes opciones:
   - **Name**: mundo-tinta-backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Plan**: Free plan (o el que prefieras)

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en Render:

* `PORT`: 10000 (Render asignará automáticamente un puerto, pero puedes especificar este como fallback)
* `NODE_ENV`: production
* `MONGO_URI`: Tu URI de conexión a MongoDB Atlas
* `JWT_SECRET`: mundotinta-secret-key (o una clave más segura para producción)
* `FRONTEND_URL`: URL de tu frontend en Vercel (ej. https://mundotinta.vercel.app)

## Base de Datos

El backend requiere una base de datos MongoDB. Se recomienda crear una en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), que ofrece un plan gratuito.

## Notas Importantes

* Después de desplegar el backend en Render, necesitarás actualizar la URL de la API en el frontend para que apunte a la URL del backend desplegado.
* El JWT está configurado para usar el secreto "mundotinta-secret-key" e incluir los campos id, name y email.
