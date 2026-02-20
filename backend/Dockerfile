FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM base AS development
ENV NODE_ENV=development
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY eslint.config.mjs ./
COPY src ./src
COPY tests ./tests

EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache tini curl

ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
