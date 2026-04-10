# Student Tracking System

Full-stack student tracking app with:
- Backend: Node.js + Express + PostgreSQL
- Frontend: React + Vite
- Validation: Zod schemas across API routes
- Dev orchestration: Docker Compose (frontend + backend + db)

## Project Structure
- `backend/` API server
- `frontend/` React UI
- `docker-compose.yml` development stack

## Quick Start (Docker, Recommended)
From the project root:

```powershell
docker compose up --build
```

App URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

Default seeded login:
- Email: `admin@school.edu`
- Password: `Password123!`

Notes:
- On first startup, Postgres initializes from:
  - `backend/prisma-or-sql/schema.sql`
  - `backend/prisma-or-sql/seed.sql`
- To reset DB data:

```powershell
docker compose down -v
```

## Run Without Docker
### 1) Database
Create PostgreSQL database `student_tracking`, then run:
- `backend/prisma-or-sql/schema.sql`
- `backend/prisma-or-sql/seed.sql`

### 2) Backend
```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

### 3) Frontend
Open a second terminal:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

## API Highlights
- `POST /api/auth/login`
- `GET /api/classes`
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `POST /api/attendance`
- `GET /api/reports/at-risk`

## Error Response Shape
Validation and API errors are normalized to:

```json
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    { "path": "body.first_name", "message": "Required" }
  ]
}
```