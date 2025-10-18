# Use an LTS Node
FROM node:20-slim

# Improve runtime behavior
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app (NOTE: copies root, not src/)
COPY . .

# Cloud Run expects the app to listen on $PORT (defaults to 8080)
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]
