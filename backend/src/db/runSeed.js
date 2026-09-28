/**
 * Runs schema.sql then seed.sql against the configured MySQL database.
 * Usage: npm run seed
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    console.log('Running schema.sql ...');
    await connection.query(schema);

    console.log('Running seed.sql ...');
    await connection.query(seed);

    console.log('Database created and seeded successfully.');
    console.log('Demo login password for every seeded account: Password@123');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await connection.end();
  }
}

run();
