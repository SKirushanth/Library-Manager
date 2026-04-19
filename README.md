# Library Manager

Library Manager is a full-stack web application for managing books and rentals with role-based access for users and admins.

It uses Docker Compose for running frontend and backend services, with a local PostgreSQL database container by default.

## Technologies

### Frontend

- React 19
- TypeScript
- Vite
- Axios
- React Router

### Backend

- Java 17
- Spring Boot 4
- Spring Security (JWT)
- Spring Data JPA
- Maven

### Database and Infra

- PostgreSQL
- Docker
- Docker Compose
- Nginx (frontend container runtime)

## Features

- User registration and login with JWT authentication
- Role-based authorization (USER, ADMIN)
- Browse and search books
- Book detail view and reservation flow
- My Library page with user rental history/status
- Admin dashboard to:
  - Add and manage books
  - Confirm pickup and return actions
  - Track rental lifecycle
- Dockerized deployment flow for local development

## Process (How the App Works)

1. A user registers or logs in.
2. Backend returns JWT and role info.
3. Frontend stores token and includes it on protected API calls.
4. Users browse books and create reservations.
5. Admin manages inventory and rental status transitions.
6. Data is stored in PostgreSQL.

## Project Structure

```text
Library-Manager/
|- Client/         # React + TypeScript frontend
|- Server/         # Spring Boot backend
|- docker-compose.yml
|- README.md
```

## How to Run the Project

### 1) Prerequisites

- Docker Desktop installed and running
- Docker Compose available

### 2) Configure Environment

Create a `.env` file in the repository root:

```env
DB_URL=jdbc:postgresql://db:5432/Library_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=admin123
VITE_API_URL=http://localhost:8080/api
```

### 3) Build and Start

From the repository root:

```bash
docker compose up --build
```

### 4) Access Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

### 5) Stop Services

```bash
docker compose down
```

## Basic Verification Checklist

- Frontend loads on port 3000
- Backend responds on port 8080
- Login/register works
- Books API returns records
- Admin actions (add book, pickup/return) work

## One-Time Data Migration (Optional)

If you want to move your local Docker PostgreSQL data to Supabase later:

```bash
docker run --name lm-pg-migrate -d \
	-e POSTGRES_DB=Library_db \
	-e POSTGRES_USER=postgres \
	-e POSTGRES_PASSWORD=admin123 \
	-v library-manager_db_data:/var/lib/postgresql/data \
	-p 55432:5432 postgres:15-alpine

docker exec lm-pg-migrate pg_dump -U postgres -d Library_db -Fc > backup.dump

pg_restore --no-owner --no-privileges --clean --if-exists \
	--dbname="postgresql://<DB_USER>:<DB_PASSWORD>@<SUPABASE_HOST>:5432/postgres?sslmode=require" \
	backup.dump

docker stop lm-pg-migrate
```

## How This Can Be Improved

- Add health checks in `docker-compose.yml` for backend and frontend
- Add CI pipeline for lint/build/test and Docker image validation
- Introduce centralized logging and monitoring
- Add unit/integration tests for critical rental workflows
- Add API documentation (OpenAPI/Swagger)
- Move secrets to a secure secret manager instead of plain `.env`
- Add rate limiting and stricter security headers for production

## Notes

- Current setup uses a local PostgreSQL container by default.
- You can switch to Supabase later by changing `DB_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.
