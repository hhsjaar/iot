# Docker Setup for Irrigation Monitoring System

This project includes a complete Docker setup for the irrigation monitoring system with PostgreSQL database and Drizzle ORM integration.

## Services

- **irrigation-app**: Next.js application running on port 3000
- **db**: PostgreSQL database running on port 5432

## Environment Variables

- `DATABASE_URL`: Connection string for PostgreSQL database
- `NEXT_PUBLIC_API_URL`: Public URL for the API

## Database Schema

The system includes the following tables for irrigation monitoring:

- `devices`: Information about irrigation devices
- `sensor_readings`: Sensor data (soil moisture, water level, turbidity, etc.)
- `pump_operations`: Records of pump operations
- `system_config`: System configuration parameters
- `alerts`: System alerts and notifications

## Running the System

1. Make sure Docker and Docker Compose are installed
2. Run `docker-compose up --build` to build and start the services
3. Access the application at http://localhost:3000
4. The irrigation dashboard is available at http://localhost:3000/irrigation

## Development

- The application runs in development mode inside the container
- Code changes are reflected in real-time due to volume mounting
- Database migrations are handled automatically via Drizzle ORM