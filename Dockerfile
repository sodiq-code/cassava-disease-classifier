# 🌿 CassavaDoc Mobile App - Docker Development Environment
FROM node:18.17.0-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    bash \
    curl \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set environment variables
ENV NODE_ENV=development
ENV EXPO_CLI_VERSION=6.3.10
ENV EAS_CLI_VERSION=latest

# Install global packages
RUN npm install -g \
    @expo/cli@$EXPO_CLI_VERSION \
    eas-cli@$EAS_CLI_VERSION \
    && npm cache clean --force

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false \
    && npm cache clean --force

# Copy app source
COPY . .

# Fix Expo dependencies
RUN npx expo install --fix

# Expose ports
EXPOSE 19000 19001 19002

# Create startup script
RUN echo '#!/bin/bash\necho "🌿 Starting CassavaDoc in Docker"\nexpo start --clear' > /app/start.sh \
    && chmod +x /app/start.sh

# Start command
CMD ["/app/start.sh"]