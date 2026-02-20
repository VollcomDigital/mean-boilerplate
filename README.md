# MEAN Stack Boilerplate

A cloud-native, **12-Factor** MEAN stack (MongoDB, Express.js, Angular, Node.js) boilerplate fully written in **TypeScript**.

## Technology Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Database | MongoDB + Mongoose ODM            |
| Backend  | Node.js v20+ / Express.js         |
| Frontend | Angular 17+ (Standalone, Signals) |
| Language | TypeScript (strict mode)          |
| Styling  | SCSS                              |

## Directory Structure

```
/
├── .github/workflows/ci.yml    # CI/CD pipeline
├── .husky/                     # Git hooks (lint-staged, commitlint)
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/             # Env validation (Zod)
│   │   ├── db/                 # MongoDB connection
│   │   ├── middleware/         # Error handling, rate limiting
│   │   ├── modules/            # Domain modules (health, users, auth)
│   │   ├── utils/              # Logger, AppError, asyncHandler
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Interceptors, services, guards
│   │   │   ├── features/       # Lazy-loaded feature modules
│   │   │   └── layout/
│   │   ├── environments/
│   │   └── styles/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── package.json                # Root scripts, lint-staged, husky
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional, for containerized run)
- MongoDB (local or Docker)

### Local Development

```bash
# 1. Clone and install
npm run install:all

# 2. Copy env files
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Start MongoDB (if not running)
docker run -d -p 27017:27017 mongo:7

# 4. Start backend
npm run backend:dev

# 5. In another terminal, start frontend
npm run frontend:dev
```

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:4200

### Docker Compose

```bash
cp .env.example .env
docker-compose up -d
```

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:80
- **MongoDB:** localhost:27017

## API Endpoints

| Method | Path              | Description                |
| ------ | ----------------- | -------------------------- |
| GET    | /                 | API info                   |
| GET    | /health/liveness  | Kubernetes liveness probe  |
| GET    | /health/readiness | Kubernetes readiness probe |
| GET    | /api/users        | List users (paginated)     |
| GET    | /api/users/:id    | Get user by ID             |
| POST   | /api/auth/login   | Login (placeholder)        |
| GET    | /api/auth/me      | Current user (placeholder) |

## Configuration

Environment variables are validated at startup using **Zod**. See `.env.example` and `backend/.env.example` for the full schema.

Key variables:

- `NODE_ENV` – development | test | production
- `PORT` – Backend port (default 3000)
- `MONGODB_URI` – MongoDB connection string
- `CORS_ORIGIN` – Allowed frontend origin(s)
- `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` – Rate limiting

## Code Quality

- **ESLint** + **Prettier** – shared config at repo root
- **Husky** – pre-commit (lint-staged) and commit-msg (commitlint)
- **Conventional Commits** – `feat:`, `fix:`, `chore:`, etc.

```bash
npm run lint
npm run format
```

## Testing

```bash
npm run backend:test   # Jest
npm run frontend:test  # Karma + Jasmine
```

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`, `develop`, and `cursor/**`:

- Backend: lint, test, build
- Frontend: lint, test, build

## License

MIT
