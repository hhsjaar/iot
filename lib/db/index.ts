import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Create the drizzle instance
export const db = drizzle(pool);

// Export the pool as well in case we need direct access
export { pool };