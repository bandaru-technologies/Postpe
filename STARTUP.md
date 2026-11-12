# PostPe - Quick Start Guide

## Project Structure

```
Postpe/
├── backend/          Java Spring Boot 3 REST API
├── frontend/         React 18 + TypeScript + Vite + Tailwind CSS
├── ios/              SwiftUI iOS app (iOS 16+)
├── docker-compose.yml  PostgreSQL + pgAdmin
└── STARTUP.md
```

## Prerequisites

- Docker Desktop (for PostgreSQL)
- Java 17 + Maven
- Node.js 18+
- Xcode 15+ (for iOS)

---

## 1. Start the Database

```bash
cd /Users/manbanda/Postpe
docker-compose up -d
```

- PostgreSQL runs at `localhost:5432` (postpe / postgres)
- pgAdmin UI at `http://localhost:5050` (admin@postpe.com / admin)

---

## 2. Start the Backend

```bash
cd /Users/manbanda/Postpe/backend
./mvnw spring-boot:run
```

Or with Maven:
```bash
mvn spring-boot:run
```

- API runs at `http://localhost:8080`
- On first run, categories are auto-seeded (17 categories)
- Uploaded files stored in `./uploads/`

### Key API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/categories` | List all categories |
| GET | `/api/posts` | List posts (supports filters) |
| POST | `/api/posts` | Create post (auth required) |
| GET | `/api/posts/{id}` | Get post detail |
| POST | `/api/posts/{id}/images` | Upload images |
| POST | `/api/posts/{id}/favorite` | Toggle favorite |
| GET | `/api/messages` | Get conversations |
| POST | `/api/messages` | Send message |

---

## 3. Start the Frontend

```bash
cd /Users/manbanda/Postpe/frontend
npm install
npm run dev
```

- App runs at `http://localhost:3000`
- API calls are proxied to `http://localhost:8080`

### Pages
| Path | Description |
|------|-------------|
| `/` | Homepage with categories & listings |
| `/posts` | Browse all listings with filters |
| `/posts/:id` | Post detail view |
| `/posts/create` | Create a new ad (auth required) |
| `/login` | Login page |
| `/register` | Registration page |
| `/profile` | User profile (auth required) |
| `/messages` | Messaging (auth required) |
| `/users/:id` | Public user profile |

---

## 4. iOS App

Open in Xcode:
```bash
open /Users/manbanda/Postpe/ios/PostPe.xcodeproj
```

Or create a new Xcode project named "PostPe" and copy the Swift files from:
`/Users/manbanda/Postpe/ios/PostPe/`

The app connects to `http://localhost:8080/api` (update `Constants.swift` for production).

For iOS Simulator to reach localhost backend, the URL works directly. For a physical device, replace with your machine's local IP (e.g. `http://192.168.1.x:8080/api`).

---

## Categories (auto-seeded)
Cars, Bikes, Other Vehicles, Mobiles & Electronics, Jobs, Real Estate, Hotel/PG, Furniture & Home, Carpool/Travel, Animals & Pets, Fashion & Beauty, Books & Education, Events & Promotions, Home Services, Software & IT, Business, Others

---

## Environment / Config

### Backend (`backend/src/main/resources/application.yml`)
```yaml
spring.datasource.url: jdbc:postgresql://localhost:5432/postpe
spring.datasource.username: postgres
spring.datasource.password: postgres
app.jwt.secret: postpe-jwt-secret-key-...
app.upload.path: ./uploads
```

### Frontend (`frontend/vite.config.ts`)
API proxy target: `http://localhost:8080`

### iOS (`ios/PostPe/Utils/Constants.swift`)
```swift
static let baseURL = "http://localhost:8080/api"
```
