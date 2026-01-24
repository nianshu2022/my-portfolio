# Production stage
FROM nginx:alpine

# Copy built static files from local 'out' directory
# (Must run 'npm run build' locally first)
COPY out /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
