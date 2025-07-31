const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://localhost:5173", // Permetti richieste dal frontend Vue
  })
);
app.use(express.json()); // Usa il parser JSON integrato di Express

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "segretissimo"); // cambia con una chiave più sicura
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

// GET lista tasks con autenticazione
app.get("/api/task", authenticate, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks WHERE user_id = ?", [
      req.user.id,
    ]);
    res.json(rows);
  } catch (error) {
    console.error("Errore GET tasks", error);
    res.status(500).json({ error: "Errore nel recupero tasks" });
  }
});

// POST aggiungi task collegata a user
app.post("/api/task", authenticate, async (req, res) => {
  const { title, description, deadline, priority } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, deadline, priority, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, deadline, priority, userId]
    );

    const newTask = {
      id: result.insertId,
      title,
      description,
      deadline,
      priority,
    };

    res.json(newTask);
  } catch (error) {
    console.error("Errore POST task", error);
    res.status(500).json({ error: "Errore creazione task" });
  }
});

// PUT modifica task — MODIFICATO per gestire due_date
app.put("/api/task/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status, deadline, priority } = req.body; // aggiunto dueDate

  try {
    await db.query(
      "UPDATE tasks SET title = ?, description = ?, status = ?, deadline = ?, priority = ? WHERE id = ?", // modificata query
      [title, description, status, deadline, priority, id] // passato dueDate
    );
    res.json({ message: "Task aggiornata" });
  } catch (error) {
    console.error("Errore UPDATE task", error);
    res.status(500).json({ error: "Errore aggiornamento task" });
  }
});

// DELETE elimina task
app.delete("/api/task/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task non trovata" });
    }

    res.json({ message: "Task eliminata con successo" });
  } catch (error) {
    console.error("Errore DELETE task", error);
    res.status(500).json({ error: "Errore durante l'eliminazione della task" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ error: "Utente non trovato" });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Password errata" });

    const token = jwt.sign({ id: user.id, email: user.email }, "segretissimo", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Errore login", error);
    res.status(500).json({ error: "Errore durante il login" });
  }
});

// POST per regisgtrazione nuovi utenti
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e password obbligatorie" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);
    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (err) {
    console.error("Errore registrazione:", err);
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Email già registrata" });
    } else {
      res.status(500).json({ error: "Errore del server" });
    }
  }
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "segretissimo"); // cambia con una chiave più sicura
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
