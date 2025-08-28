const { Pool } = require('pg');

// Crea il pool di connessioni per Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

// Verifica la connessione
pool.connect((err, client, release) => {
  if (err) {
    console.error('Errore di connessione al database:', err.stack);
  } else {
    console.log('Connesso a Supabase PostgreSQL');
    release();
  }
});

module.exports = pool;
