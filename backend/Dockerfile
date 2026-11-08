FROM node:20-alpine

WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./

RUN npm ci --only=production

# Copy source files
COPY . .

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "server.js"]
