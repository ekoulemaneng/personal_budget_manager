export const PORT = 3000;

 // Import Client from 'pg';
import { Pool } from 'pg';

// Create a new Pool instance
export const pool = new Pool({
    connectionString: process.env.DB_URL
});