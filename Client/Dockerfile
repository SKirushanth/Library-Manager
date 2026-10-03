# ── Build Stage ──
FROM node:22-alpine AS build
WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 300000 \
    && npm ci

# Copy sources and build SPA
COPY . .
RUN npm run build

# ── Serve Stage with Nginx ──
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]