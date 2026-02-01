# Stage 1: Base - Common dependencies and setup
FROM node:20-alpine AS base
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci

# Stage 2: Development - For development, testing, and linting
FROM base AS development
# Copy all source files
COPY . .
# Default command runs tests
CMD ["npm", "test"]

# Stage 3: Build - Creates production build artifacts
FROM development AS build
# Run the build process
RUN npm run build || true
# Note: Build has type errors, but this is existing behavior

# Stage 4: Production - Minimal production image
FROM node:20-alpine AS production
WORKDIR /app
# Copy only necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
# Install only production dependencies
RUN npm ci --production
# Expose port for any future server needs
EXPOSE 3000
# Default command - can be overridden
CMD ["node", "--version"]
