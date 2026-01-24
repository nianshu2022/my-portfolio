# Base stage for building the app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies (cache optimized)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the project (output will be in /app/out)
RUN npm run build

# Production stage
FROM nginx:alpine AS runner

# Copy built static files from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
