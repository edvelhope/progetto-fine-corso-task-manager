const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://localhost:5173", // Permetti richieste dal frontend Vue
  })
);
app.use(express.json()); // Usa il parser JSON integrato di Express

// GET lista tasks
app.get("/api/task", async (req, res) => {
  try {
    console.log("Tentativo di recupero tasks...");
    const [rows] = await db.query("SELECT * FROM tasks");
    console.log("Tasks recuperate:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Errore GET tasks - Dettagli completi:", error);
    console.error("Errore message:", error.message);
    console.error("Errore code:", error.code);
    res.status(500).json({ error: "Errore nel recupero tasks" });
  }
});

// POST aggiungi task
app.post("/api/task", async (req, res) => {
  const { title, description } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO tasks (title, description) VALUES (?, ?)",
      [title, description]
    );
    const newTask = {
      id: result.insertId,
      title,
      description,
    };
    res.json(newTask);
  } catch (error) {
    console.error("Errore POST task", error);
    res.status(500).json({ error: "Errore creazione task" });
  }
});

// PUT modifica task
app.put("/api/task/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    await db.query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
      [title, description, status, id]
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

// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
