# Cloud-Native MEAN Boilerplate (TypeScript, 12-Factor Ready)

Production-oriented MEAN stack starter with:

- **MongoDB + Mongoose**
- **Express + Node.js 20+**
- **Angular 17+ style architecture (standalone, lazy routes, signals, control flow)**
- **TypeScript strict mode** on frontend and backend
- **Docker multi-stage images** for backend and frontend (Nginx)
- **docker-compose** for local full-stack development
- **CI pipeline** (GitHub Actions) for lint, test, and build
- **Git hooks** (`husky` + `lint-staged`) and **Conventional Commit** enforcement (`commitlint`)

## Repository Structure

```text
.
├── backend
├── frontend
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Quick Start

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm start
```

### 3) Full stack with Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017`

## API Endpoints (core)

- `GET /health/liveness`
- `GET /health/readiness`
- `POST /api/v1/auth/login`
- `GET /api/v1/users`
- `POST /api/v1/users`

All API responses follow:

```json
{
  "success": true,
  "data": {}
}
```

or

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message",
    "details": {}
  }
}
```
