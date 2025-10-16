# Use a small and secure base image
FROM nginx:alpine

# Copy your website files into the NGINX default serving directory
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY images/ /usr/share/nginx/html/images/

# Expose port 8080 because Cloud Run expects the container to listen on $PORT (default 8080)
# NGINX by default listens on port 80, so we remap it at runtime.
EXPOSE 8080

# Replace the default nginx.conf so it listens on 8080 instead of 80
RUN sed -i 's/listen\s\+80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Run nginx in foreground (so Cloud Run can keep the container alive)
CMD ["nginx", "-g", "daemon off;"]