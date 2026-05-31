# Full-Stack Portfolio (Imesh)

[![GitHub stars](https://img.shields.io/github/stars/Imesh-Bandar/Imesh-Bandara-Protfolio?style=flat-square)](https://github.com/Imesh-Bandar/Imesh-Bandara-Protfolio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Imesh-Bandar/Imesh-Bandara-Protfolio?style=flat-square)](https://github.com/Imesh-Bandar/Imesh-Bandara-Protfolio/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Imesh-Bandar/Imesh-Bandara-Protfolio?style=flat-square)](https://github.com/Imesh-Bandar/Imesh-Bandara-Protfolio/issues)
[![License](https://img.shields.io/github/license/Imesh-Bandar/Imesh-Bandara-Protfolio?style=flat-square)](https://github.com/Imesh-Bandar/Imesh-Bandara-Protfolio/blob/main/LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/Imesh-Bandar/Imesh-Bandara-Protfolio?style=flat-square)](https://github.com/Imesh-Bandar/Imesh-Bandara-Protfolio/commits/main)
[![Repo size](https://img.shields.io/github/repo-size/Imesh-Bandar/Imesh-Bandara-Protfolio?style=flat-square)](https://github.com/Imesh-Bandar/Imesh-Bandara-Protfolio)

## Overview

This repository implements a production-capable portfolio application containing:

- A backend API built with Node.js + Express and MongoDB (Mongoose)
- A frontend SPA built with Angular + TypeScript

It includes an admin UI to manage content (About, Projects, Skills, Tools, Education, Experience, SDLC phases, Feedback and Contact info) and a secure login for administrative actions.

## Table of contents

- Features
- Quick start
- Development
- Build & deploy
- Folder structure
- Environment variables
- Troubleshooting
- License

## Features

- REST API for portfolio data (About, Projects, Skills, Tools, Education, Experience, Feedback, Contact, Resume, SDLC)
- File uploads stored in `backend/uploads` and served as static assets
- Admin dashboard for editing and uploading content
- Environment-driven configuration for both frontend and backend

## Quick start (local)

1. Backend

```bash
cd backend
npm install
# create a local backend/.env (see backend/.env.example)
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
# copy frontend/.env.example to frontend/.env and edit values if needed
npm start
# frontend served at http://localhost:4200
```

## Development workflow

- Frontend env values live in `frontend/.env` and are synced into `src/environments/*.ts` by `scripts/sync-env.mjs` before `start` and `build`.
- Backend uses `dotenv` and reads `backend/.env`.
- Use Postman or an HTTP client to exercise API routes during development.

## Build & deploy

- Build the frontend for production:

```bash
cd frontend
npm run build
```

- Deploy options:
  - Serve static files from a CDN or static host (upload `frontend/dist/frontend`).
  - Or serve built files from the backend (copy `dist` into `backend/public` and configure Express static serving).

## Folder structure (concise)

- `backend/`
  - `config/` — DB connect (e.g. `db.js`)
  - `middleware/` — `auth.js` reads JWT from `Authorization` header and verifies `process.env.JWT_SECRET`
  - `models/` — Mongoose schemas: `About`, `Project`, `Skill`, `Tool`, `Education`, `Experience`, `Feedback`, `Contact`, `Resume`, `Sdlc`
  - `routes/` — Route modules mounted under `/api/*` (see `server.js` for mount points)
  - `uploads/` — file storage for images and signatures (served at `/uploads`)
  - `server.js` — Express app entry

- `frontend/`
  - `src/app/core/` — core services (`api.service.ts`, `auth.service.ts`, `toast.service.ts`), interceptors, and guards
  - `src/app/pages/` — page components (portfolio, admin pages, login)
  - `src/app/shared/` — small reusable components and widgets
  - `src/environments/` — generated environment files (from `frontend/.env`)
  - `scripts/sync-env.mjs` — sync `.env` ➜ Angular environment files

## Environment variables

- `backend/.env` (example in `backend/.env.example`) contains `MONGODB_URI`, `PORT`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGIN`.
- `frontend/.env` (example in `frontend/.env.example`) contains `API_BASE_URL`, `ASSET_BASE_URL`, `PROD_API_BASE_URL`, `PROD_ASSET_BASE_URL`.

## Security & git

- `.env` files must not be committed. Example templates are provided and `.gitignore` has been updated to exclude them.
- If secrets were previously committed, rotate them immediately and consider removing them from git history with BFG.

## Troubleshooting

- Images not loading: verify `ASSET_BASE_URL` points to your backend and files exist under `backend/uploads`.
- CORS errors: add your frontend origin to `CORS_ORIGIN` in `backend/.env` (comma-separated allowed origins).

## Contributing

If you want to contribute, open an issue first to discuss changes. Fork the repo, create a feature branch, and send a PR.

## License

This project is provided under the terms of the repository license (see `LICENSE` in repo root).

---

If you want, I can also:

- Add an API reference section that enumerates all `/api/*` endpoints and the expected request/response shapes (I can generate this automatically from the route files),
- Create a tiny `deploy.sh` script to build the frontend and copy it into `backend/public`.

## Technologies

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NPM](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Folder structure (what's where)

- `backend/` — Express API server
  - `config/` — DB connection and configuration helpers (e.g. `db.js`).
  - `middleware/` — auth and other request middleware (e.g. `auth.js`).
  - `models/` — Mongoose schemas for About, Project, Skill, Feedback, etc.
  - `routes/` — Express route handlers for each resource (`/api/about`, `/api/projects`, ...).
  - `uploads/` — static directory served at `/uploads` for uploaded images and signatures.
  - `server.js` — app entrypoint, CORS, global error handler and route wiring.

- `frontend/` — Angular single-page app
  - `src/environments/` — generated `environment.ts` / `environment.prod.ts` (created from `frontend/.env`).
  - `src/app/core/` — core services and singletons (`api.service.ts`, `auth.service.ts`, interceptors, guards).
  - `src/app/pages/` — page components (portfolio, admin pages, login).
  - `src/app/shared/` — small shared components/widgets used across pages.
  - `public/` — static assets copied to the build (favicon, static images used at compile time).
  - `scripts/sync-env.mjs` — syncs `frontend/.env` into Angular environment files before build/start.

- Root files
  - `README.md` — this file.
  - `backend/.env.example` and `frontend/.env.example` — templates for local configuration (do not commit secrets).

Each folder contains `README`-level comments in relevant files; if you want I can add an index file listing each route and model with quick descriptions.

Folders

- `backend/` — Express server, Mongoose models, API routes, and seeder (`seed.js`).
- `frontend/` — Angular application (dev server on port 4200 by default).

Prerequisites

- Node.js (recommended 18+), npm
- MongoDB (local or remote connection string)

Quick setup

1. Copy example environment (create `backend/.env`) with at least:

```
MONGODB_URI=mongodb://localhost:27017/portfolio
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=changeme
JWT_SECRET=some_secret_value
PORT=5000
```

2. Install dependencies and run backend:

```bash
# backend
cd backend
npm install
# start (dev)
npm run dev
# or start directly
node server.js
```

3. Seed sample data (optional):

```bash
# from backend folder
node seed.js
```

4. Install and run frontend:

```bash
# frontend
cd frontend
npm install
npm start
# opens at http://localhost:4200
```

Admin / editing content

- Visit the admin UI (`/login`) in the frontend. Use the admin credentials you set in `backend/.env`.
- The Admin About screen allows uploading the hero image and signature. After saving, the frontend will show the updated hero image.

Notes on authentication

- The backend issues a JWT on `/api/auth/login`. The frontend stores it in `localStorage` as `portfolio_token`.
- Admin routes require the token in `Authorization: Bearer <token>`.

Files to know

- `backend/server.js` — Express app and CORS configuration (accepts frontend at `http://localhost:4200`).
- `backend/seed.js` — seeds sample About, Projects, Skills, Tools, Education, Experience, SDLC, Contact, Feedback.
- `frontend/src/app/pages/admin/admin-about/admin-about.component.html` — Admin UI for About/hero upload.
- `frontend/src/app/pages/portfolio/portfolio.component.html` — main portfolio page markup.

Build for production

```bash
# frontend build
cd frontend
npm run build
# serve backend and copy frontend/dist content to a static host, or configure Express to serve built files
```

Frontend environment files

- The frontend reads deployment settings from `frontend/.env` when you run `npm run build`.
- Development API base: `frontend/src/environments/environment.ts`
- Production API base: `frontend/src/environments/environment.prod.ts`
- `API_BASE_URL` controls API requests.
- `ASSET_BASE_URL` controls uploaded image and signature URLs.
- The default values use same-origin paths (`/api` and `/uploads`), which works when the built frontend is served behind the backend or a reverse proxy.
- If you deploy the frontend and backend on separate domains, update `frontend/.env` before building.

Troubleshooting

- CORS errors: ensure backend `PORT` and `MONGODB_URI` are set and frontend is served from `http://localhost:4200` (or update backend CORS origin in `backend/server.js`).
- Admin save failing: re-login to refresh token if your session expired.

Want me to:

- Add a `seed` npm script to `backend/package.json`? (I can add and run it.)
- Make backend serve the built frontend for a single-process deploy?

---

Generated: May 30, 2026

**Project README**

**What this is**: A full-stack portfolio app with an admin UI to manage About, Projects, Skills, Tools, Education, Experience, SDLC phases, Feedback and Contact details. The backend exposes a JSON API and serves uploaded asset files under `/uploads`. The frontend is an Angular single-page application that consumes the API.

**Prerequisites**

- **Node.js**: 18+ and npm
- **MongoDB**: local or remote connection string

**Project Structure**

- **`backend/`**: Express server, Mongoose models, API routes. See [backend/server.js](backend/server.js).
- **`frontend/`**: Angular app, build scripts and environment sync. See [frontend/package.json](frontend/package.json) and [frontend/scripts/sync-env.mjs](frontend/scripts/sync-env.mjs).

**Environment & configuration**

- **Frontend**: configure `frontend/.env` (do not commit). A safe template is provided at [frontend/.env.example](frontend/.env.example).
- **Backend**: configure `backend/.env` (do not commit). See [backend/.env.example](backend/.env.example).
- The frontend build step reads `frontend/.env` and generates Angular environment files used by the app. The backend reads `backend/.env` via `dotenv`.

**Local development**

1. Start backend

```bash
cd backend
npm install
npm run dev   # nodemon server.js
```

2. Start frontend (the `prestart` step will sync env into Angular files)

```bash
cd frontend
npm install
npm start     # runs sync-env then ng serve --port 4200
```

**Build for production**

- The frontend sync script runs before builds and writes both `environment.ts` and `environment.prod.ts` from `frontend/.env`.

```bash
cd frontend
# update frontend/.env for production values (API_BASE_URL, ASSET_BASE_URL)
npm run build

# built files appear in frontend/dist/frontend
# serve them from a static host or configure the backend to serve the files
```

**Serve built frontend with backend (one-process deploy)**

- Option A (copy built files to backend static folder):

```bash
# from repo root
cp -r frontend/dist/frontend/* backend/public/
# ensure backend serves static files (example in server.js can be added)
node backend/server.js
```

**Admin / authentication**

- Admin credentials are read from `backend/.env` (`ADMIN_EMAIL` and `ADMIN_PASSWORD`). Use the login UI at `/login` in the frontend to edit content.
- JWTs are issued at `/api/auth/login` and stored in `localStorage` as `portfolio_token`.

**Uploads & asset URLs**

- Server exposes uploaded files from `backend/uploads` via Express static middleware at `/uploads`.
- The frontend resolves asset URLs using the environment `assetBaseUrl` (set in `frontend/.env`). In development, default points to `http://localhost:5000` so previews and portfolio images load correctly.

**Security & Git**

- Do not commit real `.env` files. This repo provides `frontend/.env.example` and `backend/.env.example` as templates.
- If secrets were accidentally committed, rotate them and consider cleaning history with tools like BFG.

**Troubleshooting**

- Images not loading: confirm `frontend/.env` `ASSET_BASE_URL` points to your backend host (e.g. `http://localhost:5000`) and that the backend `uploads/` directory contains the files and is accessible at `http://localhost:5000/uploads/...`.
- CORS errors: set `CORS_ORIGIN` in `backend/.env` to include your frontend origin (comma-separated allowed origins).

**Helpful links (in-repo)**

- Backend entry: [backend/server.js](backend/server.js)
- Frontend env sync: [frontend/scripts/sync-env.mjs](frontend/scripts/sync-env.mjs)
- Frontend examples: [frontend/.env.example](frontend/.env.example)
- Backend examples: [backend/.env.example](backend/.env.example)

If you'd like, I can also:

- Add an Express route to serve the built frontend automatically from `backend/` during production,
- Or create a short deploy script to build frontend and copy files into `backend/public`.
