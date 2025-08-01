GRUPPO 3

Ida Cerchiara

Alessio cardi

Edoardo De Rosa

# ✅ Task Manager App (Vue 3 + Node.js + MySQL)

Questa è una semplice applicazione di gestione task con autenticazione utente. Ogni utente registrato può accedere, aggiungere/modificare/eliminare solo le **proprie task**, con priorità, scadenze e stato.

---

## 🛠 Tecnologie

- **Frontend:** Vue 3 + TypeScript, Vue Router
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Altro:** bcrypt, JWT, fetch API

---

## ⚙️ Requisiti

- Node.js v18+
- MySQL
- NPM

---

## 🔧 1. Clonazione del progetto

```bash
git clone https://github.com/tuo-utente/nome-repo.git
cd nome-repo○
```

---

## 🔧 2. Configurazione database

CREATE DATABASE IF NOT EXISTS todo_db;

CREATE TABLE tasks (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('da fare', 'in corso', 'completata') DEFAULT 'da fare',
  deadline DATE,
  priority ENUM('Alta', 'Media', 'Bassa') DEFAULT 'media',
  user_id INT,
  PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 119
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 9
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;


Crea un file db.js nella cartella backend, con le istruzioni in db.example.js.

---

## 🔧 3. Avvio dell'App

cd backend
npm install
node server-sql.js

cd frontend
npm install
npm run dev




