# PostPe

A classifieds marketplace: post ads, browse by category, favorite listings and message sellers.

## Structure

| Folder | Description |
|--------|-------------|
| `backend/` | Java 21, Spring Boot 3.2 REST API (JPA, JWT auth) |
| `frontend/` | React 18 + TypeScript + Vite + Tailwind CSS |
| `ios/` | SwiftUI iOS app (iOS 16+) |
| `docker-compose.yml` | PostgreSQL 16 + pgAdmin |
| `init.sql` | DB init script |

See [STARTUP.md](STARTUP.md) for the full guide, endpoints and pages.

## Prerequisites

- Docker, JDK 21, Maven 3.9+, Node.js 18+, Xcode 15+ (iOS only)

## Running locally

### 1. Database
```bash
docker-compose up -d        # Postgres on :5432, pgAdmin on :5050
```
If 5432 is taken, map another host port and set `SPRING_DATASOURCE_URL`
(e.g. `jdbc:postgresql://localhost:5433/postpe`). The `postpe` database must exist.

### 2. Backend (default port 8080)
```bash
cd backend
mvn spring-boot:run
# custom port / DB:
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/postpe \
  mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```
Categories are seeded on first run; uploads go to `./uploads/`.

### 3. Frontend (default port 3000)
```bash
cd frontend
npm install
npm run dev
# custom ports (PORT = dev server, API_URL = backend proxy target):
PORT=3001 API_URL=http://localhost:8081 npm run dev
```

## Currently running (this machine)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8081/api |
| Database | `postpe` on Docker Postgres, `localhost:5433` |

Alternate ports are used because 3000, 8080 and 5432 are occupied by other apps.

## Configuration

- Backend: `backend/src/main/resources/application.yml` (datasource, JWT secret, upload path, port)
- Frontend: `frontend/vite.config.ts` (`PORT`, `API_URL` env vars)
- iOS: `ios/PostPe/Utils/Constants.swift` (`baseURL`)
