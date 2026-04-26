# Library Manager

Library Manager is a full-stack web app for browsing books, reserving rentals, and managing inventory with role-based access (USER and ADMIN).

The project runs with Docker Compose for frontend and backend containers, and uses an external PostgreSQL database (Supabase in the current setup).

## Stack

### Frontend
- React 19
- TypeScript
- Vite
- Axios
- React Router
- Nginx (container runtime)

### Backend
- Java 17
- Spring Boot 4
- Spring Security + JWT
- Spring Data JPA
- Maven

### Infra
- Docker + Docker Compose
- PostgreSQL (Supabase)

## Architecture At A Glance

1. Frontend calls backend API (`/api/**`) using `VITE_API_URL`.
2. Backend validates JWT for protected routes.
3. Backend persists data to PostgreSQL (Supabase connection via `DB_URL`).
4. Admin workflows manage rental lifecycle (reserve, pickup, return).

## Important Setup Facts

- Compose includes **frontend + backend only**. It does **not** include a `db` service.
- You must provide external DB credentials (Supabase recommended).
- JWT secret is required and should be a strong Base64 value.
- Admin seed account runs only outside `prod` profile.

## Project Structure

```text
Library-Manager/
|- Client/                # React + TypeScript app
|- Server/                # Spring Boot API
|- docker-compose.yml
|- .env.example           # Environment template
|- README.md
```

## Quick Start (Local With Docker)

### 1) Prerequisites

- Docker Desktop running
- Docker Compose v2

### 2) Create Environment File

From repo root, copy the template:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your actual values.

### 3) Generate JWT Secret (PowerShell)

```powershell
$bytes = New-Object byte[] 64
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

Use that output as `JWT_SECRET`.

### 4) Start

```bash
docker compose up --build
```

### 5) Access

- Frontend: http://localhost:3000
- Backend API base: http://localhost:8080/api

### 6) Stop

```bash
docker compose down
```

## Environment Variables

Use `.env.example` as the source of truth.

### Required for backend

- `DB_URL`:
  - Example for Supabase:
  - `jdbc:postgresql://db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

### Optional backend settings

- `JWT_EXPIRATION` (default: `86400000`)
- `APP_CORS_ALLOWED_ORIGINS` (comma-separated origins)
- `SPRING_PROFILES_ACTIVE` (`local` for local runs, `prod` for production)
- `APP_SEED_ADMIN_EMAIL` (non-prod only)
- `APP_SEED_ADMIN_PASSWORD` (non-prod only)

### Frontend build variables

- `VITE_API_URL` (default local API URL)
- `VITE_CLOUDINARY_CLOUD_NAME` (optional)
- `VITE_CLOUDINARY_UPLOAD_PRESET` (optional)

## Default Admin (Non-Prod Only)

When `SPRING_PROFILES_ACTIVE` is not `prod`, startup can seed an admin account:

- Email: `admin@library.com`
- Password: `admin123`

For production, use your own controlled admin provisioning process.

## Verification Checklist

After startup/deploy, confirm:

1. Frontend loads.
2. Backend starts without datasource/JWT errors.
3. Auth register/login works.
4. Books list endpoint responds.
5. Reserve/pickup/return flows work.
6. Cloudinary upload works (if cloud vars are set).

## Troubleshooting

### Backend fails on startup with datasource error

- Verify `DB_URL`, username, password.
- Ensure Supabase password is correct and host is reachable.
- Keep `sslmode=require` in `DB_URL`.

### CORS errors in browser

- Add frontend origin to `APP_CORS_ALLOWED_ORIGINS`.
- Restart backend after env changes.

### Login/token issues

- Ensure `JWT_SECRET` is non-empty and stable.
- Regenerate and update if malformed.

### Cloudinary upload fails

- Check `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.
- Rebuild frontend container after changing Vite variables.

## Security Notes

- Never commit `.env`.
- Keep production secrets in your hosting platform secret manager.
- Disable non-prod seed credentials in production (`SPRING_PROFILES_ACTIVE=prod`).
