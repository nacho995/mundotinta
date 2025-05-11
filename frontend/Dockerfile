# 1. Etapa de Dependencias (deps)
FROM node:22-alpine AS deps
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json* ./

# Instalar dependencias (usando npm ci para instalaciones limpias basadas en lockfile)
RUN npm ci

# --------------------------------------------------------------------

# 2. Etapa de Construcción (builder)
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar dependencias desde la etapa 'deps'
COPY --from=deps /app/node_modules ./node_modules
# Copiar el resto del código de la aplicación
COPY . .

# Variables de entorno para la build (si son necesarias)
# ENV NEXT_TELEMETRY_DISABLED 1

# Construir la aplicación Next.js
RUN npm run build

# --------------------------------------------------------------------

# 3. Etapa Final (runner)
FROM node:22-alpine AS runner
WORKDIR /app

# Variables de entorno para producción
ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# Crear usuario no root (recomendado por seguridad)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar artefactos de build necesarios desde la etapa 'builder'
# Necesitamos la carpeta standalone generada gracias a output: 'standalone'
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Necesitamos las carpetas public y .next/static para los assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no root
USER nextjs

# Exponer el puerto en el que corre la aplicación Next.js (por defecto 3000)
EXPOSE 3000

# Variable de entorno para el puerto (opcional, Next.js lo detecta)
ENV PORT 3000

# Comando para iniciar la aplicación
# Node.js ejecutará el servidor desde la carpeta standalone
CMD ["node", "server.js"] 