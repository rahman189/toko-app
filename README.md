# NestJS + Nuxt Application

Full-stack web application using:

* **Backend:** NestJS
* **Frontend:** Nuxt 3
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Package Manager:** pnpm
* **Container:** Docker / Docker Compose

The backend and frontend are maintained in a single Git repository.

---

## Project Structure

```text
.
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Requirements

Make sure the following tools are installed:

* Node.js
* pnpm
* Docker
* Docker Compose
* Git

Check your installation:

```bash
node --version
pnpm --version
docker --version
docker compose version
```

---

# 1. Clone Repository

```bash
git clone <repository-url>
cd <project-directory>
```

---

# 2. Install Dependencies

Install backend dependencies:

```bash
cd backend
pnpm install
```

Install frontend dependencies:

```bash
cd ../frontend
pnpm install
```

Or from the project root:

```bash
cd backend && pnpm install
cd ../frontend && pnpm install
```

---

# 3. Environment Variables

Both applications use environment variables.

## Backend

Copy:

```bash
cd backend
cp .env.example .env
```

Example:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp?schema=public"

JWT_SECRET="change-this-secret"
```

Adjust the values according to your local environment.

---

## Frontend

Copy:

```bash
cd frontend
cp .env.example .env
```

Example:

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

The frontend will use this URL to communicate with the NestJS API.

---

# 4. Start PostgreSQL

If PostgreSQL is managed using Docker Compose:

```bash
docker compose up -d postgres
```

Check running containers:

```bash
docker compose ps
```

Example `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: myapp-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# 5. Setup Database

Go to the backend:

```bash
cd backend
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

Run database migrations:

```bash
pnpm prisma migrate dev
```

If this is a completely new database and you already have migration files:

```bash
pnpm prisma migrate deploy
```

For local development, use:

```bash
pnpm prisma migrate dev
```

---

# 6. Seed Database

If the project contains Prisma seed data:

```bash
pnpm prisma db seed
```

For example, the seed can create:

* Admin user
* Staff user
* Categories
* Products
* Product variants

---

# 7. Run Backend

From:

```text
backend/
```

Run:

```bash
pnpm dev
```

or:

```bash
pnpm start:dev
```

Backend should be available at:

```text
http://localhost:3000
```

API example:

```text
http://localhost:3000/api/products
```

---

# 8. Run Frontend

Open another terminal:

```bash
cd frontend
```

Run:

```bash
pnpm dev
```

Nuxt should be available at:

```text
http://localhost:3001
```

The frontend communicates with:

```text
http://localhost:3000/api
```

---

# 9. Run Full Stack Locally

You need three services:

```text
┌──────────────────────┐
│      Nuxt 3          │
│    localhost:3001    │
└──────────┬───────────┘
           │
           │ HTTP
           ▼
┌──────────────────────┐
│      NestJS          │
│    localhost:3000    │
└──────────┬───────────┘
           │
           │ Prisma
           ▼
┌──────────────────────┐
│     PostgreSQL       │
│    localhost:5432    │
└──────────────────────┘
```

Terminal 1:

```bash
docker compose up -d postgres
```

Terminal 2:

```bash
cd backend
pnpm start:dev
```

Terminal 3:

```bash
cd frontend
pnpm dev
```

Open:

```text
http://localhost:3001
```

---

# Production

The recommended production architecture is:

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │ Reverse Proxy    │
              │ Nginx / Traefik  │
              └────────┬────────┘
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
      ┌──────────────┐    ┌──────────────┐
      │    Nuxt      │    │    NestJS    │
      │    :3001     │    │    :3000     │
      └──────────────┘    └──────┬───────┘
                                  │
                                  ▼
                           ┌──────────────┐
                           │ PostgreSQL   │
                           └──────────────┘
```

---

# Production Environment

## Backend

Create:

```text
backend/.env
```

Example:

```env
NODE_ENV=production

PORT=3000

DATABASE_URL="postgresql://username:password@postgres-host:5432/myapp?schema=public"

JWT_SECRET="strong-production-secret"
```

Do not commit this file.

---

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
NUXT_PUBLIC_API_BASE_URL=https://api.example.com/api
```

---

# Production Backend Setup

Go to backend:

```bash
cd backend
```

Install production dependencies:

```bash
pnpm install --prod
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

Run production migrations:

```bash
pnpm prisma migrate deploy
```

Build NestJS:

```bash
pnpm build
```

Start the application:

```bash
pnpm start:prod
```

The NestJS application will run on:

```text
http://localhost:3000
```

or the configured production host/port.

---

# Production Frontend Setup

Go to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
pnpm install
```

Build Nuxt:

```bash
pnpm build
```

Start Nuxt:

```bash
pnpm preview
```

or:

```bash
node .output/server/index.mjs
```

For production, use:

```bash
node .output/server/index.mjs
```

Nuxt will serve the generated application from `.output`.

---

# Production Deployment Order

A typical deployment should follow this order:

## 1. Pull latest code

```bash
git pull origin main
```

## 2. Install dependencies

Backend:

```bash
cd backend
pnpm install --frozen-lockfile
```

Frontend:

```bash
cd ../frontend
pnpm install --frozen-lockfile
```

## 3. Update database

```bash
cd ../backend
pnpm prisma generate
pnpm prisma migrate deploy
```

## 4. Build backend

```bash
pnpm build
```

## 5. Build frontend

```bash
cd ../frontend
pnpm build
```

## 6. Restart applications

Backend:

```bash
cd ../backend
pnpm start:prod
```

Frontend:

```bash
cd ../frontend
node .output/server/index.mjs
```

---

# Database Migration Workflow

When changing the Prisma schema during development:

```bash
cd backend
```

Edit:

```text
prisma/schema.prisma
```

Then create a migration:

```bash
pnpm prisma migrate dev --name add_product_status
```

Example:

```text
prisma/
├── migrations/
│   ├── 20260917090000_init/
│   ├── 20260917100000_add_category/
│   └── 20260917110000_add_product_status/
└── schema.prisma
```

Commit migration files to Git.

```bash
git add prisma/
git commit -m "feat: add product status migration"
```

In production, **do not use**:

```bash
pnpm prisma migrate dev
```

Use:

```bash
pnpm prisma migrate deploy
```

---

# Prisma Commands

Generate Prisma Client:

```bash
pnpm prisma generate
```

Create migration:

```bash
pnpm prisma migrate dev --name <migration-name>
```

Apply production migrations:

```bash
pnpm prisma migrate deploy
```

Reset local database:

```bash
pnpm prisma migrate reset
```

Open Prisma Studio:

```bash
pnpm prisma studio
```

Run seed:

```bash
pnpm prisma db seed
```

---

# Useful Development Commands

## Backend

```bash
cd backend
```

Development:

```bash
pnpm start:dev
```

Build:

```bash
pnpm build
```

Production:

```bash
pnpm start:prod
```

Lint:

```bash
pnpm lint
```

Test:

```bash
pnpm test
```

---

## Frontend

```bash
cd frontend
```

Development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Preview:

```bash
pnpm preview
```

Lint:

```bash
pnpm lint
```

---

# Git Workflow

Recommended branches:

```text
main
├── develop
├── feature/*
├── fix/*
└── hotfix/*
```

Example:

```bash
git checkout -b feature/product-management
```

Commit:

```bash
git add .
git commit -m "feat: add product management"
```

Push:

```bash
git push origin feature/product-management
```

---

# Important Rules

1. Never commit `.env`.
2. Always commit `.env.example`.
3. Always commit Prisma migration files.
4. Use `prisma migrate dev` for local development.
5. Use `prisma migrate deploy` in production.
6. Do not manually modify production database schema.
7. Keep frontend and backend dependencies separate.
8. Use `pnpm install --frozen-lockfile` in CI/CD.
9. Store production secrets in the server/CI/CD secret manager.
10. Do not expose `DATABASE_URL` or other backend secrets to Nuxt public environment variables.

---

# Quick Start

For a new developer:

```bash
git clone <repository-url>

cd <project-directory>

# Backend
cd backend
pnpm install
cp .env.example .env
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed

# Frontend
cd ../frontend
pnpm install
cp .env.example .env

# Start PostgreSQL
cd ..
docker compose up -d postgres

# Start backend
cd backend
pnpm start:dev

# In another terminal
cd frontend
pnpm dev
```

Open:

```text
http://localhost:3001
```

Backend:

```text
http://localhost:3000
```
