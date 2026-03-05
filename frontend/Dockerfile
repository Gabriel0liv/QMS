# Use Node.js for development
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite port
EXPOSE 5173

# Run Vite with --host to allow external access
CMD ["npm", "run", "dev"]
