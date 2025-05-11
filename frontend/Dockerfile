# Etapa 1: Build de la aplicación
FROM node:20 AS builder

WORKDIR /app/frontend

# Copiar archivos de manifiesto de paquete
COPY package.json ./
# Copiar package-lock.json si existe, si no, npm install aún funcionará pero es menos determinista
COPY package-lock.json* ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm install

# Copiar el resto del código de la aplicación frontend
COPY . .

# Construir la aplicación Next.js para producción
RUN npm run build

# Etapa 2: Servir la aplicación (Producción)
FROM node:20-alpine

WORKDIR /app/frontend

# Copiar package.json y package-lock.json desde la etapa de builder
COPY --from=builder /app/frontend/package.json ./
COPY --from=builder /app/frontend/package-lock.json* ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar los artefactos de build de la aplicación desde la etapa de builder
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public

# Exponer el puerto en el que corre la aplicación Next.js
EXPOSE 3000

# Variables de entorno para producción (Next.js necesita saber que es producción)
ENV NODE_ENV=production
# El hostname 0.0.0.0 es necesario para que sea accesible desde fuera del contenedor
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar la aplicación
CMD ["npm", "start", "--", "-H", "0.0.0.0"] 