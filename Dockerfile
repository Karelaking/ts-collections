# Multi-stage build for ts-collections
# Stage 1: Development environment
FROM node:22-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Expose port for development server (if needed)
EXPOSE 3000

# Default command for development
CMD ["pnpm", "dev"]

# Stage 2: Build stage
FROM development AS builder

# Build the project
RUN pnpm run build

# Stage 3: Production environment
FROM node:22-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port if needed for production
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('fs').readFileSync('./dist/index.js')" || exit 1

# Default command for production
CMD ["node", "dist/index.js"]
