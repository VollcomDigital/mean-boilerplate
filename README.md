# Cloud-Native MEAN Stack Boilerplate

A production-ready, cloud-native MEAN (MongoDB, Express.js, Angular, Node.js) boilerplate built with **TypeScript** and following the **12-Factor App** methodology.

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Database   | MongoDB 7 + Mongoose ODM                       |
| Backend    | Node.js 20+ / Express.js / TypeScript (Strict) |
| Frontend   | Angular 19 / Standalone Components / Signals   |
| Containers | Docker multi-stage builds / Docker Compose     |
| CI/CD      | GitHub Actions                                 |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Env validation (Zod), DB connection
│   │   ├── middleware/       # Error handler, validation, not-found
│   │   ├── modules/
│   │   │   ├── auth/        # JWT auth (register, login, middleware)
│   │   │   ├── health/      # Liveness & readiness probes
│   │   │   └── users/       # CRUD user management
│   │   ├── utils/           # Logger (Pino), AppError, response helpers
│   │   ├── app.ts           # Express app factory
│   │   └── server.ts        # Bootstrap & graceful shutdown
│   ├── tests/               # Jest unit & integration tests
│   └── Dockerfile           # Multi-stage (dev + prod)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # Auth service, interceptors, guards
│   │   │   ├── features/    # Home, Auth (login/register), Dashboard
│   │   │   └── shared/      # Models, shared components
│   │   ├── environments/    # Dev & prod environment configs
│   │   └── styles/          # Global SCSS
│   ├── nginx.conf           # Production Nginx config
│   └── Dockerfile           # Multi-stage (dev + Nginx prod)
├── .github/workflows/ci.yml # CI pipeline
├── docker-compose.yml       # Full stack local development
└── .husky/                  # Git hooks (commitlint, lint-staged)
```

## Quick Start

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- npm >= 10

### Development with Docker (Recommended)

```bash
cp .env.example .env
docker compose up --build
```

| Service  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:4200     |
| Backend  | http://localhost:3000     |
| MongoDB  | mongodb://localhost:27017 |

### Local Development (without Docker)

```bash
# Install all dependencies
npm install

# Start backend (requires MongoDB running)
npm run dev:backend

# Start frontend (in another terminal)
npm run dev:frontend
```

## API Endpoints

### Health Checks

| Method | Endpoint            | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/health/liveness`  | Process is running                   |
| GET    | `/health/readiness` | App can serve traffic (DB connected) |

### Auth

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login             |
| GET    | `/api/auth/profile`  | Get current user  |

### Users (Authenticated)

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| GET    | `/api/users`     | List users (paged) |
| GET    | `/api/users/:id` | Get user by ID     |
| PATCH  | `/api/users/:id` | Update user        |
| DELETE | `/api/users/:id` | Soft-delete user   |

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests (requires Chrome/Chromium)
cd frontend && npm test
```

## Code Quality

- **ESLint** + **Prettier** for consistent formatting
- **Husky** pre-commit hooks run lint-staged
- **Commitlint** enforces Conventional Commits (`feat:`, `fix:`, etc.)
- **TypeScript Strict Mode** across the entire stack

## Security

- **Helmet** for HTTP security headers
- **CORS** configured per environment
- **Rate limiting** on API routes (100 req / 15 min)
- **bcrypt** password hashing (12 salt rounds)
- **JWT** bearer token authentication
- **Zod** request validation

## Environment Variables

See `.env.example` for all configuration options. The backend validates all required environment variables at startup using Zod — the server will refuse to start with invalid config.

## License

MIT
