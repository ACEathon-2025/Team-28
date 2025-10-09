// This file connects your Node.js app to PostgreSQL
//===

// Import the PostgreSQL library
const { Pool } = require('pg');

// Import dotenv to read .env file
require('dotenv').config();

// Create a connection pool (think of it as a phone line to the database)
const pool = new Pool({
  user: process.env.DB_USER,           // Username: postgres
  host: process.env.DB_HOST,           // Where? localhost
  database: process.env.DB_NAME,       // Which database? foodbridge
  password: process.env.DB_PASSWORD,   // Your password
  port: process.env.DB_PORT,           // Port: 5432
});

// When connected successfully, show message
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

// If connection fails, show error
pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

// Helper function to run queries easily
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Export so other files can use it
module.exports = {
  pool,
  query
};
