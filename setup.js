// WARNING: This file contains a hardcoded connection string for one-time local database setup.
// DO NOT COMMIT THIS FILE WITH THE HARDCODED STRING TO VERSION CONTROL.
// DELETE THIS FILE IMMEDIATELY AFTER SUCCESSFUL EXECUTION.

import { createPool } from '@vercel/postgres';

// Hardcoded connection string from user's provided data
const POSTGRES_URL = "postgresql://neondb_owner:npg_v4KjAFngbyd2@ep-spring-cell-a1ks31r4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function setupDatabase() {
  const client = createPool({ connectionString: POSTGRES_URL });

  try {
    // Create the votes table
    await client.sql`
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        nominee VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('"votes" table created successfully.');

    // Create the settings table
    await client.sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value VARCHAR(255) NOT NULL
      );
    `;
    console.log('"settings" table created successfully.');

    // Insert the initial voting status if it doesn't exist
    await client.sql`
      INSERT INTO settings (key, value)
      VALUES ('voting_status', 'closed')
      ON CONFLICT (key) DO NOTHING;
    `;
    console.log('Initial voting status set to "closed".');

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // End the pool connection and exit the process
    await client.end();
    process.exit();
  }
}

setupDatabase();
