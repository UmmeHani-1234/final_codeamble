FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production || npm install --production

# Copy source
COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "index.js"]
