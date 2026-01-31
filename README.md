# Taskline - Task Manager App

Applicazione full-stack per la gestione di task personali con autenticazione utente. Ogni utente registrato può creare, modificare ed eliminare le **proprie task**, con priorità, scadenze e stato.

---

## Tecnologie

- **Frontend:** Vue 3 + TypeScript + Vite, Vue Router
- **Backend:** Node.js + Express 5
- **Database:** PostgreSQL (Supabase)
- **Autenticazione:** JWT (scadenza 1h) + bcrypt
- **Sicurezza:** helmet, express-rate-limit, express-validator
- **Deploy:** Frontend su Netlify, Backend su Render

---

## Requisiti

- Node.js v18+
- NPM
- PostgreSQL (oppure Docker)

---

## 1. Clonazione del progetto

```bash
git clone https://github.com/edvelhope/progetto-fine-corso-task-manager.git
cd progetto-fine-corso-task-manager
```

---

## 2. Configurazione database

### Opzione A: Docker

```bash
docker-compose up
```

### Opzione B: PostgreSQL esistente

Esegui lo script `init-db.sql` sul tuo database:

```sql
CREATE TYPE task_status AS ENUM ('da fare', 'in corso', 'completata');
CREATE TYPE task_priority AS ENUM ('Alta', 'Media', 'Bassa');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status DEFAULT 'da fare',
  deadline DATE,
  priority task_priority DEFAULT 'Media',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_users_email ON users(email);
```

---

## 3. Configurazione variabili d'ambiente

### Backend

Crea il file `backend/.env` partendo dall'esempio:

```bash
cp backend/.env.example backend/.env
```

Variabili richieste:

| Variabile | Descrizione |
|-----------|-------------|
| `DATABASE_URL` | Stringa di connessione PostgreSQL |
| `JWT_SECRET` | Chiave segreta per firmare i token JWT |
| `FRONTEND_URL` | URL del frontend (per CORS) |

Per generare un JWT_SECRET sicuro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend

Crea il file `frontend/.env`:

```
VITE_API_URL=http://localhost:8080
```

---

## 4. Avvio dell'app

### Backend

```bash
cd backend
npm install
node server-sql.js
```

Il server si avvia su `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Il frontend si avvia su `http://localhost:5173`.

---

## API Endpoints

Tutti gli endpoint task richiedono header `Authorization: Bearer <token>`.

| Metodo | Path | Descrizione |
|--------|------|-------------|
| POST | `/api/register` | Registrazione (email, password min 8 caratteri) |
| POST | `/api/login` | Login (restituisce JWT) |
| GET | `/api/task` | Lista task dell'utente (supporta `?page=1&limit=50`) |
| POST | `/api/task` | Crea nuova task |
| PUT | `/api/task/:id` | Modifica task (solo proprietario) |
| DELETE | `/api/task/:id` | Elimina task (solo proprietario) |

### Rate limiting

`/api/login` e `/api/register` sono limitati a 20 richieste ogni 15 minuti per IP.

---

## Comandi utili

### Frontend

```bash
npm run dev          # Server di sviluppo
npm run build        # Type-check + build produzione
npm run type-check   # Solo validazione TypeScript
npm run lint         # ESLint con auto-fix
npm run format       # Formattazione con Prettier
```

### Backend

```bash
node server-sql.js   # Avvia il server (porta 8080 o $PORT)
```
