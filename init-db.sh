#!/bin/bash
# Initialize the database schema for irrigation system

echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Run database migrations using Drizzle
npx drizzle-kit push:pg

echo "Database setup complete!"

# Start the Next.js application
npm run dev