const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://localhost:5173", // Permetti richieste dal frontend Vue
  })
);
app.use(express.json()); // Usa il parser JSON integrato di Express

let tasks = [
  {
    id: 1,
    title: "Studiare Vue.js",
    description: "Completare il tutorial di Vue 3",
    completed: false,
  },
  {
    id: 2,
    title: "Implementare API",
    description: "Creare le API REST per il task manager",
    completed: false,
  },
];

// GET lista tasks
app.get("/api/task", (req, res) => {
  res.json(tasks);
});

// POST aggiungi task
app.post("/api/task", (req, res) => {
  const newTask = req.body;
  newTask.id = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  tasks.push(newTask);
  res.json(newTask);
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
