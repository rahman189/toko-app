# NestJS + Nuxt Application

Fullstack web aplikasi menggunakan:

* **Backend:** NestJS 12
* **Frontend:** Nuxt 3
* **Database:** PostgreSQL
* **ORM:** Prisma 7
* **Runtime:** Node.js 24
* **Package Manager:** npm
* **Container:** Docker / Docker Compose

The backend and frontend are maintained in a single Git repository.

# Requirements

pastikan tools yang sudah terinstall:

* Node.js 24
* npm
* Docker
* Docker Compose
* Git

Check versi:

```bash
node --version
npm --version
docker --version
docker compose version
```

Expected Node.js version:

```text
v24.x.x
```

---

# Node.js Version

Harap menggunakan **Node.js 24**.
Lebih direkomendasikan menggunaka node package manager seperti `nvm`.

Check node version:

```bash
node -v
```

jika menggunakan NVM:

```bash
nvm install 24
nvm use 24
```

verif:

```bash
node -v
npm -v
```

---

# 1. Clone Repository

```bash
git clone <repository-url>
cd <project-directory>
```

---

# 2. Install Dependencies

Backend dan frontend menggunaka NPM workspace untuk memudahkan setup project.

Install frontend dan backend dependencies:

```bash
npm install
```

---

# 3. Environment Variables

Silakan sesuaikan environment pada masing-masing project grocery-api dan grocery-fe.

## Backend

Copy dan paste environment file pada grocery-api:

```bash
cd grocery-api
cp .env.example .env
```

---

## Frontend

Copy dan paste environment pada grocery-fe:

```bash
cd ../grocery-fe
cp .env.example .env
```

---

# 4. Start PostgreSQL

Untuk database PostgresSQL saya menggunakan docker compose.

dari folder root:

```bash
docker compose up -d
```

check container:

```bash
docker compose ps
```

pastikan database benar2 kosong:

```bash
grocery_db       → kosong
grocery_test_db  → kosong
```

---

# 5. Setup Prisma 7

Karena menggunakan NPM workspace saya sudah menyediakan npm setup untuk mempermudah migrasi, genare client, dan seed data:

pada folder root jalankan:

```bash
npm run setup:grocery-api
```

---

# 6. Prisma Migration Workflow

Saat ada perubahan table:

```text
backend/prisma/schema.prisma
```

buat migrasi:

```bash
npx prisma migrate dev --name add_something
```

Kemudian commit ke Git.

```bash
git add prisma
git commit -m "feat: say something for migration"
```

developer lain:

```bash
git pull
npm run db:migrate:deploy
npm run db:generate
```

### Production

Jangan gunakan:

```bash
npx prisma migrate dev
```

di production.

Use:

```bash
npx prisma migrate deploy
```

---

# 7. Prisma Seed

Untuk seend sendiri terdiri dari:

The seed can be used to create initial data such as:

* Admin user
* Staff user
* Categories
* Products
* Product variants

```bash
admin user : admin@grocery.local | Password123!
staff user : staff@grocery.local | Password123!
```

---

# 8. Run Project

Karena menggunakan NPM workspace kita tinggal menjalankan perintah ini di root folder:

```bash
npm run dev
```

maka backend dan frontend akan otomatis running
Backend:

```text
http://localhost:3001
```

Frontend:

```text
http://localhost:3000
```

# 9. Run Full Stack Locally

Local architecture:

```text
                    Browser
                       │
                       ▼
              ┌─────────────────┐
              │     Nuxt 3      │
              │    :3001        │
              └────────┬────────┘
                       │
                       │ HTTP
                       ▼
              ┌─────────────────┐
              │    NestJS 12    │
              │     :3000       │
              └────────┬────────┘
                       │
                       │ Prisma 7
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │     :5432       │
              └─────────────────┘
```

---

# Production

Recommended production architecture:

```text
                         Internet
                            │
                            ▼
                    ┌───────────────┐
                    │ Reverse Proxy │
                    │ Nginx / Proxy │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          ┌──────────────┐      ┌──────────────┐
          │    Nuxt 3    │      │   NestJS 12  │
          │    :3001     │      │    :3000     │
          └──────────────┘      └───────┬───────┘
                                        │
                                        ▼
                                 ┌──────────────┐
                                 │  PostgreSQL  │
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

Only variables intended to be exposed to the browser should use `NUXT_PUBLIC_*`.

Never expose:

```text
DATABASE_URL
JWT_SECRET
```

through Nuxt public environment variables.

---

# Production Backend Deployment

Go to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm ci
```

Generate Prisma Client:

```bash
npx prisma generate
```

Apply production migrations:

```bash
npx prisma migrate deploy
```

Build NestJS:

```bash
npm run build
```

Start:

```bash
npm run start:prod
```

---

# Production Frontend Deployment

Go to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm ci
```

Build Nuxt:

```bash
npm run build
```

Start the production server:

```bash
node .output/server/index.mjs
```

Nuxt's production output is generated inside:

```text
frontend/.output/
```

---

# Production Deployment Flow

When deploying a new version:

## 1. Pull latest code

```bash
git pull origin main
```

## 2. Install backend dependencies

```bash
cd backend
npm ci
```

## 3. Generate Prisma Client

```bash
npx prisma generate
```

## 4. Run database migrations

```bash
npx prisma migrate deploy
```

## 5. Build backend

```bash
npm run build
```

## 6. Install frontend dependencies

```bash
cd ../frontend
npm ci
```

## 7. Build frontend

```bash
npm run build
```

## 8. Restart applications

Start NestJS:

```bash
cd ../backend
npm run start:prod
```

Start Nuxt:

```bash
cd ../frontend
node .output/server/index.mjs
```

For production, it is recommended to use a process manager such as PM2 or Docker rather than running these commands directly in a terminal.

---

# Database Migration Rules

### Development

After modifying:

```text
backend/prisma/schema.prisma
```

run:

```bash
npx prisma migrate dev --name <migration-name>
```

Commit the generated migration:

```bash
git add prisma/migrations
git commit -m "feat: add database migration"
```

### Production

Deploy the existing migration:

```bash
npx prisma migrate deploy
```

Do not run:

```bash
npx prisma migrate dev
```

on production.

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

Create a feature branch:

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

1. Use **Node.js 24** for development and production.
2. Use **npm** as the package manager.
3. Never commit `.env`.
4. Always maintain `.env.example`.
5. Commit Prisma migration files.
6. Use `npx prisma migrate dev` for local development.
7. Use `npx prisma migrate deploy` for production.
8. Do not manually modify the production database schema.
9. Keep backend and frontend dependencies separated.
10. Use `npm ci` for production/CI installations.
11. Never expose backend secrets to Nuxt public environment variables.
12. Keep only one Git repository at the project root.
13. Do not run `git init` inside `backend` or `frontend`.

---

# Quick Start

Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Setup backend:

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Open another terminal and setup frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev -- --port 3001
```

Open:

```text
http://localhost:3001
```

Backend API:

```text
http://localhost:3000
```

---

# Technology Stack

| Layer           | Technology |
| --------------- | ---------- |
| Runtime         | Node.js 24 |
| Package Manager | npm        |
| Frontend        | Nuxt 3     |
| Backend         | NestJS 12  |
| Language        | TypeScript |
| Database        | PostgreSQL |
| ORM             | Prisma 7   |
| Container       | Docker     |
| Version Control | Git        |
