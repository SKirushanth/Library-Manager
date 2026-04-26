# Library Manager

Library Manager is a full-stack web application for managing books and rentals with role-based access for users and admins.

It uses Docker Compose for running frontend and backend services. PostgreSQL is expected to be provided externally (Supabase in this setup).

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
- Supabase (hosted PostgreSQL)

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

## Production-Safety Defaults

- JWT secret must come from environment variables
- CORS origins are environment-driven
- Default admin seeding is disabled in the `prod` profile
- Image upload configuration is environment-driven for the frontend build

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

Create a `.env` file in the repository root. You can copy from `.env.example` and fill values.

```env
DB_URL=jdbc:postgresql://db.<SUPABASE_PROJECT_REF>.supabase.co:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<SUPABASE_DB_PASSWORD>

JWT_SECRET=<BASE64_ENCODED_SECRET>
JWT_EXPIRATION=86400000

VITE_API_URL=http://localhost:8080/api
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
SPRING_PROFILES_ACTIVE=local

# Optional admin seed (used in non-prod profile only)
APP_SEED_ADMIN_EMAIL=admin@library.com
APP_SEED_ADMIN_PASSWORD=admin123

# Optional Cloudinary upload support for admin image uploads
VITE_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your-unsigned-preset>
```

Generate a JWT secret (PowerShell):

```powershell
$bytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
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
- Image upload works if Cloudinary vars are set

## Default Admin (Non-Prod)

When `SPRING_PROFILES_ACTIVE` is not `prod`, app startup can seed a default admin user:

- Email: `admin@library.com`
- Password: `admin123`

For production, set `SPRING_PROFILES_ACTIVE=prod` and create admin accounts through a controlled process.

## Notes

- This repository does not include a local database container in Compose.
- Supabase SSL is enabled through `sslmode=require` in `DB_URL`.
- Keep `.env` local only. It is ignored by git.
