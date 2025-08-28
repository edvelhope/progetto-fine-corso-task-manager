require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // DEBUG: verifica che venga letta
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Permetti richieste dal frontend Vue
    credentials: true,
  })
);
app.use(express.json()); // Usa il parser JSON integrato di Express

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

// GET lista tasks con autenticazione
app.get("/api/task", authenticate, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, description, status, deadline, priority, created_at, updated_at FROM tasks WHERE user_id = $1",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Errore GET tasks", error);
    res.status(500).json({ error: "Errore nel recupero tasks" });
  }
});

// POST aggiungi task collegata a user
app.post("/api/task", authenticate, async (req, res) => {
  const { title, description, deadline, priority, status } = req.body;
  const userId = req.user.id;

  // Imposta lo stato di default se non fornito
  const taskStatus = status || "da fare";

  try {
    const result = await db.query(
      "INSERT INTO tasks (title, description, deadline, priority, status, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, status, deadline, priority, created_at, updated_at",
      [title, description, deadline, priority, taskStatus, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Errore POST task", error);
    res.status(500).json({ error: "Errore creazione task" });
  }
});

// PUT modifica task
app.put("/api/task/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, deadline, priority } = req.body;

  try {
    // Aggiorna anche il campo updated_at
    const result = await db.query(
      `UPDATE tasks
       SET title = $1, description = $2, status = $3, deadline = $4, priority = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING id, title, description, status, deadline, priority, created_at, updated_at`,
      [title, description, status, deadline, priority, id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task non trovata" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Errore UPDATE task", error);
    res.status(500).json({ error: "Errore aggiornamento task" });
  }
});

// DELETE elimina task
app.delete("/api/task/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task non trovata" });
    }

    res.json({ message: "Task eliminata con successo" });
  } catch (error) {
    console.error("Errore DELETE task", error);
    res.status(500).json({ error: "Errore durante l'eliminazione della task" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Utente non trovato" });

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Password errata" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error("Errore login", error);
    res.status(500).json({ error: "Errore durante il login" });
  }
});

// REGISTRAZIONE
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e password obbligatorie" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "Utente registrato con successo",
      userId: result.rows[0].id,
    });
  } catch (err) {
    console.error("Errore registrazione:", err);
    if (err.code === "23505") {
      // Codice errore per violazione unique constraint in PostgreSQL
      res.status(409).json({ error: "Email già registrata" });
    } else {
      res.status(500).json({ error: "Errore del server" });
    }
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
