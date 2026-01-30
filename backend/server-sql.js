require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, param, validationResult } = require("express-validator");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 8080;

// Security headers
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 20,
  message: { error: "Troppi tentativi, riprova tra 15 minuti" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const offset = (page - 1) * limit;

    const countResult = await db.query(
      "SELECT COUNT(*) FROM tasks WHERE user_id = $1",
      [req.user.id]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(
      "SELECT id, title, description, status, deadline, priority, created_at, updated_at FROM tasks WHERE user_id = $1 ORDER BY id ASC LIMIT $2 OFFSET $3",
      [req.user.id, limit, offset]
    );

    res.json({
      tasks: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Errore GET tasks", error);
    res.status(500).json({ error: "Errore nel recupero tasks" });
  }
});

// POST aggiungi task collegata a user
app.post("/api/task", authenticate, [
  body("title").trim().notEmpty().withMessage("Il titolo è obbligatorio").isLength({ max: 255 }).withMessage("Titolo troppo lungo"),
  body("description").optional({ values: "falsy" }).trim().isLength({ max: 2000 }).withMessage("Descrizione troppo lunga"),
  body("priority").optional().isIn(["Alta", "Media", "Bassa"]).withMessage("Priorità non valida"),
  body("status").optional().isIn(["da fare", "in corso", "completata"]).withMessage("Stato non valido"),
  body("deadline").optional({ values: "falsy" }).isISO8601().withMessage("Data scadenza non valida"),
], validate, async (req, res) => {
  const { title, description, deadline, priority, status } = req.body;
  const userId = req.user.id;

  const taskStatus = status || "da fare";

  try {
    const result = await db.query(
      "INSERT INTO tasks (title, description, deadline, priority, status, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, status, deadline, priority, created_at, updated_at",
      [title, description || null, deadline || null, priority || "Media", taskStatus, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Errore POST task", error);
    res.status(500).json({ error: "Errore creazione task" });
  }
});

// PUT modifica task
app.put("/api/task/:id", authenticate, [
  param("id").isInt().withMessage("ID non valido"),
  body("title").trim().notEmpty().withMessage("Il titolo è obbligatorio").isLength({ max: 255 }).withMessage("Titolo troppo lungo"),
  body("description").optional({ values: "falsy" }).trim().isLength({ max: 2000 }).withMessage("Descrizione troppo lunga"),
  body("priority").optional().isIn(["Alta", "Media", "Bassa"]).withMessage("Priorità non valida"),
  body("status").optional().isIn(["da fare", "in corso", "completata"]).withMessage("Stato non valido"),
  body("deadline").optional({ values: "falsy" }).isISO8601().withMessage("Data scadenza non valida"),
], validate, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, deadline, priority } = req.body;

  try {
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
app.delete("/api/task/:id", authenticate, [
  param("id").isInt().withMessage("ID non valido"),
], validate, async (req, res) => {
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
app.post("/api/login", authLimiter, [
  body("email").isEmail().withMessage("Email non valida").normalizeEmail(),
  body("password").notEmpty().withMessage("Password obbligatoria"),
], validate, async (req, res) => {
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
app.post("/api/register", authLimiter, [
  body("email").isEmail().withMessage("Email non valida").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("La password deve avere almeno 8 caratteri"),
], validate, async (req, res) => {
  const { email, password } = req.body;

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
