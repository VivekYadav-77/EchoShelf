# EchoShelf Platform

<div align="center">
  <img src="./frontend/public/logo.svg" alt="EchoShelf Logo" width="120" />
</div>
A full-stack, production-ready EchoShelf application allowing users to search the iTunes catalog, save albums to their personal library, rate them, and get AI-powered insights on their music taste.

## Features

- **Authentication**: JWT-based auth via secure HTTP-only cookies
- **Search**: Real-time integration with iTunes Search API
- **Library Management**: Save, rate, and annotate your favorite albums
- **Analytics Dashboard**: Visual breakdown of your music DNA (genres, release years, top artists)
- **AI Insights**: Personalized music recommendations using Gemini 3.1 Flash Lite
- **Clean Architecture**: Spring Boot backend following layered architecture
- **Modern UI**: Next.js 14 App Router with Tailwind CSS and Tanstack Query

## Tech Stack

**Backend**
- Spring Boot 3.2 (Java 17)
- Spring Security (JWT)
- PostgreSQL & Flyway
- Spring Web & RestClient

**Frontend**
- Next.js 14 (App Router)
- React Query & Zustand
- Tailwind CSS & Lucide Icons
- Recharts (Data Visualization)

## Running Locally

### Prerequisites
- Docker & Docker Compose
- Java 17 (for manual backend build)
- Node.js 18+ (for manual frontend build)

### Quick Start (Docker Compose)
1. Clone the repository
2. Set your Gemini API key in `docker-compose.yml` (optional, for AI features)
3. Run the complete stack:
   ```bash
   docker-compose up -d
   ```
4. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api`

### Manual Development Setup

**1. Database**
```bash
docker-compose up -d postgres
```

**2. Backend**
```bash
cd backend
./mvnw spring-boot:run
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Architecture Notes
- The application uses HTTP-only cookies for JWT storage, preventing XSS attacks.
- Duplicate entries are prevented at the database layer via unique constraints on `(user_id, apple_catalog_id)`.
- Analytics queries are optimized using JPQL grouping at the database level rather than fetching and grouping in memory.
