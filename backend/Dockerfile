# ============================================
# Stage 1: Base image with dependencies
# ============================================
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .

# ============================================
# Stage 2: Development (hot-reload with tsx)
# ============================================
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ============================================
# Stage 3: Build the TypeScript source
# ============================================
FROM base AS build
RUN npm run build

# ============================================
# Stage 4: Production-optimized image
# ============================================
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=build /app/dist ./dist

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health/liveness || exit 1

CMD ["node", "dist/server.js"]
