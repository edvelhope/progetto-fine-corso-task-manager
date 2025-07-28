// Configurazione del Database
// Copia questo codice in un nuovo file chiamato "db.js" e inserisci le tue credenziali locali.
// Il file db.js è escluso dal versionamento per motivi di sicurezza.
// NON MODIFICARE QUESTO CODICE

const mysql = require("mysql2");

// Crea il pool di connessioni
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root", // il tuo utente MySQL
  password: "INSERISCI LA TUA PASSWORD", // la tua password MySQL
  database: "todo_db", // il database che userai
});

// Trasforma in promise per usare async/await
const db = pool.promise();

module.exports = db;
