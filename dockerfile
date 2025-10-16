# Use official Node.js runtime
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Expose Cloud Run port
EXPOSE 8080

# Start app
CMD ["node", "index.js"]

