# Use official Node.js runtime as a base image
FROM node:20-slim

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all application code
COPY . .

# Expose Cloud Run–compatible port
EXPOSE 8080

# Start the Node.js app
CMD ["node", "index.js"]
