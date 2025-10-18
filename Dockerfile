# Dockerfile
FROM node:20-slim
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src/ ./src
EXPOSE 8080
CMD ["node", "src/index.js"]
