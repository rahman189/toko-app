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

# Production Gaps

implementasi sekarang hanya difokuskan pada kebutuhan utama aplikasi, masih kurang untuk level production.
Masih banyak hal yang perlu diperkuat dan dievaluasi kedepannya.

# Security concern
1. Authentication & Authorization
untuk sekarang authentication baru menggunakan token based, kenapa menggunakan token based, lebih cocok dengan kebutuhan sekarang, nestJS tidak perlu menyimpan session di server, jadi membuat API lebih stateless dan lebih mudah di-scale secara horizontal dan lebih mudah jika aplikasi berkembang menjadi beberapa client (mobile app, admin dashboard). Namun bisa ditingkatkan lagi dengan implementasi refresh token rotation dan menyimpan token di HTTPOnly dan secure cookie ketimbang menyimpannya hanya di localStorage. kita juga bisa menyimpan refresh token di database untuk support revoke/logout dari server
2. Password hashing dan credential handling
untuk password hasing sudah dilakukan dengan bcrypt cuman bisa ditingkatkan lagi untuk credential handling nya dari sisi backend
3. Role dan permission checks
untuk sekarang masih dari sisi aplikasi, kedepannya bisa ditingkatkan based on database agar bisa configurable
4. Input validation
dari sisi backend dan frontend input sudah divalidasi, cuman perlu ada peningkatan untuk sanitaze input
5. API protection
ada beberapa hal yang bisa dilakukan:
- CORS restriction
- Rate limiting
- consistent error handling
- security headers
error response tidak boleh mengekpose error database, stack trace, internal path, atau detail yang lain
6. Secrets & Environment Variables
Secret tidak boleh disimpan di repository.
Contohnya:
- DATABASE_URL
- JWT_SECRET
- API keys
- Third-party credentials
- Encryption keys
jadi secret harusnya hanya bisa di akses dari sisi server atau dedicated secret management solution, bukan di level repo

# Performance concern
1. Database queries
untuk sekarang karena relasi masih sedikit dan jumlah data tidak terlalu bnyak maka belum ada audit queri yang bertujuan untuk memberikan query yg efisien seperti:
- check missing indexing
- relasi yg tidak diperlukan
- filtering yang kurang efisien
- sorting yang mahal
2. API response size
hal ini sudah dilakukan sebenarnya dengan penggunaan pagination, mungkin nanti dengan image optimization atau penggunaan CDN dsb
3. Frontend performance
ada beberapa hal yang menjadi concern:
- asset optimization
- bundle size (sekarang relatif kecil)
- third party dependency (kalo ada)
- penggunaan SSR/CSR 
4. Caching
- sekarang baru di level nestJS dengan eTag, kedepannya ketika request semakin banyak, bisa menggunakan redis, implementasinya biasanya dipakai untuk data dashboard yang membutuhkan query yang compleks

# Logging
1. Applicaion Logging
memberikan log yg jelas tanpa memasukan info yang sifatnya credential seperti access token, password, third party credential, contoh struktur loging yang pernah saya terapkan:
```bash
{ 
        "level": "error", 
        "timestamp": "2026-09-17T10:20:30Z",
        "requestId": "abc-123", 
        "method": "POST",
        "path": "/api/products",
        "statusCode": 500, 
        "duration": 245, 
        "message": "Failed to create product" 
}
```
2. Request Correlation
menggunakan request ID atau corelation ID bisa membantu logging dalam mentrace berbagai layar aplikasi:
Client
   ↓
Nginx
   ↓
NestJS
   ↓
Prisma
   ↓
PostgreSQL
3. Error Monitoring
bisa dengan sentry, kibana, atau grafana
4. Metrics & Health Checks
ada beberapa metric yang pernah saya gunakan untuk monitoring:
- Request rate
- Error rate
- Response latency
- CPU dan memory usage
- Database availability

# Deployment Considerations
1. Environment Separation
dalam proses software development biasanya saya menerapkan minimal ada 3 environment
- Development/Feature Branch -> untuk development test
- Staging/UAT -> untuk user test sebelum production
- Production -> real aplication
setiap environment memilikin database, monitoring, credential, secret, CI/CD yang berbeda beda sesuai peruntukannya
2. Deployment production biasanya dilakukan melalui CI/CD proses, proses yang biasa dilakukan adalah:
Pull Request -> Lint -> Unit Tests -> Build -> Integration / E2E Tests -> Deploy ke Staging -> Smoke Tests -> Production Deployment
3. Docker & Process Management
infrastructure yang digunakan:
- Docker
- Docker Compose
- Nginx
- PM2
untuk deployment skala kecil sepetinya ini sudah cukup namun untuk skala yang lebih komples atau yang membutuhkan horizontal scaling mungkin bisa dipindahkan ke managed container platform atau container orchestration platform.
4. Reverse Proxy & HTTPS
nginx digunakan sebagai reverse proxy di depan application dan dapat menangani:
- HTTPS
- Domain routing
- Request forwarding
- Security headers
- Access logs
5. Deployment & Rollback
setiap deployment production harus memiliki mekanisme rollback yang jelas
sebelum deployment biasanya:
- Pastikan application build berhasil
- Pastikan database migration sudah direview
- Pastikan backup tersedia jika diperlukan
- Deploy versi baru
- Jalankan health check
- Monitor error rate dan application log
- Rollback jika ditemukan regression yang bersifat kritikal


# Testing Gaps
1. Unit Test
business logic yang utama sebaiknya memiliki unit test degan scope:
- services
- validation
- authentication
- authorization
- transaction proses
tujuannya adalah mengejar coverage setinggi mungkin agar core business terlindungi oleh test
2. E2E test
hal ini bertujuan untuk menguji interaksi antara service, ORM atau query, dan database agar fungsinya terlindungi, sebagai contoh:
- create product
- create category
- create varian
etc

# Data Migration Concerns
1. Prisma migration 
karena pada aplikasi yang sekarang menggunaka PRM prisma maka semua bentuk perubahan table harus melalui prisma migration
dan migration file harus di-commit bersama perubahan application yang membutuhkan schema tersebut
2. Migration Compatibility
migration harus direview bersama application version yang akan menggunakannya. perhatian khusus diperlukan untuk perubahan seperti:
- menambahkan non-nullable column
- menghapus column
- mengubah data type
- menambahkan unique constraint
- menambahkan foreign key
- membuat index pada table besar
- mengubah enum value
concern utamanya adalah dampat migrasi kepada data existing bukan hanya pada aplication layer
3. Expand and Contract
untuk perubahan schema yang cukup berisiko, biasanya menggunakan pendekatan expand-and-contract
contoh:

Tambahkan column baru
        ↓
Deploy code yang mendukung column lama dan baru
        ↓
Migrasikan data existing
        ↓
Pindahkan read/write ke column baru
        ↓
Hapus column lama
4. Backup & Recovery
sebelum melakukan database migration yang signifikan:

- pastikan backup terbaru tersedia
- pastikan backup dapat digunakan untuk restore
- test migration di staging
- pahami estimasi waktu migration
- siapkan recovery plan



