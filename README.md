# NestJS + Nuxt Application

Fullstack web aplikasi menggunakan:

* **Backend:** NestJS 12
* **Frontend:** Nuxt 3
* **Database:** PostgreSQL
* **ORM:** Prisma 7
* **Runtime:** Node.js 24
* **Package Manager:** npm
* **Container:** Docker / Docker Compose

Untuk DB sendiri kenapa menggunakan postgreSQL daripada mongoDB karena ada beberapa alasan:
1. untuk aplikasi toko sendiri karena data model aplikasi bersifat relational, memiliki banyak relasi, lebih kepada data integrity, dan schema yang sudah ada atau mudah diprediksi, dan karakter inilah yang menurut saya lebih cocok dengan postgreSQL dibandingkan dengan mongoDB
2. sedangkan mongoDB sendiri lebih diperuntukan untuk fleksibilitas atau document oriented data model


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

Karena menggunakan NPM workspace saya sudah menyediakan npm setup untuk mempermudah migrasi, generate prisma client, dan seed data:

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

di production gunakan:

```bash
npx prisma migrate deploy
```

---

# 7. Prisma Seed

Untuk seed sendiri terdiri dari:

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

---

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

# Struktur Folder

```text
.
├── grocery-api/                         # Backend NestJS
│   ├── prisma/
│   │   ├── migrations/                   # Riwayat migrasi database
│   │   ├── schema.prisma                 # Skema database Prisma
│   │   └── seed.ts                       # Data awal database
│   ├── src/
│   │   ├── auth/                         # Autentikasi, JWT, dan role-based access
│   │   │   ├── decorators/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── categories/                   # Modul kategori produk
│   │   │   └── dto/
│   │   ├── common/                       # Kode yang digunakan bersama
│   │   │   ├── filters/                  # Global HTTP exception filter
│   │   │   └── pagination/               # Utilitas pagination
│   │   ├── generated/prisma/             # Prisma Client hasil generate
│   │   ├── health/                       # Endpoint health check
│   │   ├── prisma/                       # Prisma module dan service
│   │   ├── products/                     # Modul produk dan varian produk
│   │   │   └── dto/
│   │   ├── users/                        # Modul pengguna
│   │   ├── app.module.ts                 # Modul utama aplikasi
│   │   └── main.ts                       # Entry point backend
│   ├── test/
│   │   ├── e2e/                          # Integration/end-to-end tests
│   │   └── mocks/                        # Mock untuk pengujian
│   ├── .env.example                      # Contoh environment backend
│   ├── nest-cli.json                     # Konfigurasi Nest CLI
│   ├── package.json
│   └── tsconfig.json
├── grocery-fe/                           # Frontend Nuxt
│   ├── app/
│   │   ├── assets/css/                   # CSS global
│   │   ├── components/
│   │   │   ├── base/                     # Komponen UI yang dapat digunakan ulang
│   │   │   ├── category/                 # Komponen kategori
│   │   │   ├── layout/                   # Sidebar, topbar, dan footer
│   │   │   └── product/                  # Komponen produk dan varian
│   │   ├── composables/                  # Reusable logic dan API client
│   │   ├── layouts/                      # Layout halaman Nuxt
│   │   ├── middleware/                   # Middleware auth, admin, dan guest
│   │   ├── pages/                        # File-based routing Nuxt
│   │   │   ├── categories/
│   │   │   ├── login/
│   │   │   ├── products/
│   │   │   └── register/
│   │   ├── stores/                       # State management Pinia
│   │   ├── types/                        # TypeScript types
│   │   └── app.vue                       # Root Vue component
│   ├── public/                           # Aset statis publik
│   ├── .env.example                      # Contoh environment frontend
│   ├── nuxt.config.ts                    # Konfigurasi Nuxt
│   └── package.json
├── docker-compose.yml                    # Layanan PostgreSQL lokal
├── package.json                          # Workspace dan skrip root project
└── README.md
```

---