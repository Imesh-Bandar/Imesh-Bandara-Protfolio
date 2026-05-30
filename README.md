# Full-Stack Portfolio (Imesh)

This repository contains a full-stack portfolio application with an Express + MongoDB backend and an Angular frontend.

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

Troubleshooting

- CORS errors: ensure backend `PORT` and `MONGODB_URI` are set and frontend is served from `http://localhost:4200` (or update backend CORS origin in `backend/server.js`).
- Admin save failing: re-login to refresh token if your session expired.

Want me to:

- Add a `seed` npm script to `backend/package.json`? (I can add and run it.)
- Make backend serve the built frontend for a single-process deploy?

---

Generated: May 30, 2026
