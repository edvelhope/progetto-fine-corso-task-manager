# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taskline - a full-stack task manager application. Users register/login and manage their own tasks with priority, deadlines, and status tracking. The app is in Italian (UI labels, task statuses).

## Architecture

- **Frontend:** Vue 3 + TypeScript + Vite (in `frontend/`)
- **Backend:** Node.js + Express (in `backend/`)
- **Database:** PostgreSQL (Supabase-hosted; README mentions MySQL but the active codebase uses PostgreSQL via `pg`)
- **Auth:** JWT tokens (1h expiry), bcrypt password hashing. Token stored in localStorage, sent as `Authorization: Bearer <token>`.
- **Deployment:** Frontend on Netlify, backend on Render

### Frontend Structure

- Entry point: `frontend/src/main.ts`
- Router: `frontend/src/router/index.ts` — three routes: `/` (auth-required home), `/login`, `/register`
- Auth state: `frontend/src/stores/auth.ts` — reactive refs (not Pinia), persisted in localStorage
- Task model: `frontend/src/model/task.ts` — `Task` interface and `TaskStatus` enum
- Views: `HomeView.vue` (authenticated, contains AddTask + TaskList), `Login.vue`, `Register.vue`
- Components: `TaskList.vue` (table with sorting), `TaskItem.vue` (row with inline edit/delete), `AddTask.vue`, `ModeToggle.vue` (dark/light theme)
- Path alias: `@/*` maps to `./src/*`

### Backend Structure

- Single entry point: `backend/server-sql.js` (Express app, ~180 lines)
- DB connection: `backend/db.js` (PostgreSQL pool via `pg`)
- All API routes defined inline in server-sql.js

### API Endpoints

All task endpoints require JWT Bearer token in Authorization header.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | Register (email, password) |
| POST | `/api/login` | Login (returns JWT) |
| GET | `/api/task` | Get authenticated user's tasks |
| POST | `/api/task` | Create task |
| PUT | `/api/task/:id` | Update task (owner only) |
| DELETE | `/api/task/:id` | Delete task (owner only) |

### Database Schema

Two tables: `users` (id, email, password) and `tasks` (id, title, description, status, deadline, priority, user_id, created_at, updated_at). Task status enum: `'da fare'`, `'in corso'`, `'completata'`. Priority enum: `'Alta'`, `'Media'`, `'Bassa'`. See `init-db.sql` for full schema.

## Common Commands

### Frontend (`cd frontend`)

```bash
npm run dev          # Start Vite dev server
npm run build        # Type-check (vue-tsc) + production build
npm run build-only   # Vite build without type-check
npm run type-check   # TypeScript validation only (vue-tsc --build)
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting (src/)
```

### Backend (`cd backend`)

```bash
node server-sql.js   # Start server (port 8080 or $PORT)
```

### Docker (PostgreSQL)

```bash
docker-compose up    # Start PostgreSQL 15 container
```

## Code Style

- Prettier: no semicolons, single quotes, 100 char print width
- EditorConfig: 2-space indent, UTF-8, LF line endings
- Vue components use `<script setup lang="ts">` with Composition API

## Environment Variables

- **Frontend:** `VITE_API_URL` — backend API base URL (in `frontend/.env`)
- **Backend:** `DATABASE_URL`, `JWT_SECRET` (see `backend/.env.example`)
