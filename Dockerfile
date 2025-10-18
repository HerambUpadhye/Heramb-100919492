# Dockerfile
FROM node:20-slim

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy your app code (src folder and any static files you need)
COPY src/ ./src
# If you have an index.html at repo root or a public folder, copy it too:
# COPY index.html ./index.html
# COPY public/ ./public

# Cloud Run listens on $PORT (defaults to 8080)
EXPOSE 8080

# Start your server from src/index.js
CMD ["node", "src/index.js"]
