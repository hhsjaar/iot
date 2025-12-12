# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy the rest of the application code
COPY . .

# Make the init script executable
COPY init-db.sh /init-db.sh
RUN chmod +x /init-db.sh

# Set environment to disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Expose port
EXPOSE 3000

# Set the hostname to allow external connections
ENV HOSTNAME=0.0.0.0

# Command to run the initialization and application
CMD ["/init-db.sh"]