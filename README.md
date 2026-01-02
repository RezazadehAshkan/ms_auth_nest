# Auth Microservice

A production-ready authentication microservice built with NestJS and Clean Architecture.

## Features

- **Clean Architecture**: Separation of concerns (Domain, Application, Infrastructure, Presentation).
- **Authentication**: JWT-based authentication with Passport and Bcrypt.
- **Database**: PostgreSQL with TypeORM.
- **Docker**: Dockerfile and docker-compose ready.

## Directory Structure

```
src/
  ├── application/      # Use cases, DTOs, interfaces
  ├── domain/           # Entities, repository interfaces
  ├── infrastructure/   # Database, Repositories, Auth services
  ├── presentation/     # Controllers
  ├── app.module.ts     # Main module
  └── main.ts           # Entry point
```

## Running the app

### Prerequisites
- Node.js
- Docker & Docker Compose

### Local Development (with Docker DB)

1. Start the database:
   ```bash
   docker-compose up -d postgres
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm run start:dev
   ```

### Running with Docker Compose

To run the entire stack (App + DB):

```bash
docker-compose up --build
```

## Endpoints

- `POST /auth/register`: Register a new user.
  - Body: `{ "email": "user@example.com", "password": "password123" }`
- `POST /auth/login`: Login and get JWT.
  - Body: `{ "email": "user@example.com", "password": "password123" }`

## Environment Variables

See `.env.example` or `.env`.

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=auth_db
JWT_SECRET=supersecretkey
```
