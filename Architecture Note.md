# Technical Architecture & Engineering Decisions

1. Pemilihan Database: PostgreSQL
ada beberapa pendekatan kenapa saya memilih postgreSQL salah satunya adalah karena model data aplikasi yang digunakan sekarang bersifat relational dan memiliki beberapa hubungan yang jelas antara entity contohnya `Category`, `Product`, dan `ProductVariant`.
struktur ini membutuhkan referential integrity, unique constraint, serta query yang melibatkan beberapa entity dan postgre menyediakan hal tersebut secara native dan cocok dengan ORM prisma yang digunakan pada aplikasi sekarang

mongoDB juga menjadi pilihan yang valid untuk case2 yang memmbutuhkan flexibilitas atau pada pendekata document-oriented scheme. namun untuk kebutuhan aplikasi saat ini flexibilitas scheme bukannya yang menjadi prioritas utama dibandingkan dengan konsistensi dan relational integrity.

---

2. Struktur Backend: NestJS

backend menggunakan nestJS dengan pendekatan modular berdasarkan domain/feature.

Struktur secara umum:

```text
grocery-api/
├── src/
│   ├── auth/
│   ├── categories/
│   ├── common/
│   ├── generated/
│   ├── health/
│   ├── prisma/
│   ├── products/
│   ├── users/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── ...
```

setiap module bertanggung jawab terhadap domain tertentu dan mengikuti pemisahan:

```text
Controller
    ↓
Service
    ↓
Prisma / Repository
    ↓
PostgreSQL
```

controller menangani HTTP concern seperti request, response, dan validation sedangkan business logic di tempatkan diservice sehingga tidak tercampur dengan HTTP layer
shared functionality seperti exception handling, pagination, dan utility ditempatkan di `common` atau module yang relevan
pendekatan ini membuat codebase lebih mudah dikembangkan ketika jumlah feature bertambah tanpa membuat satu module atau service menjadi terlalu besar

---

3. Struktur Frontend: Nuxt 3

frontend menggunakan Nuxt 3 dengan pemisahan antara UI, reusable component, dan feature-based

Struktur utama:

```text
grocery-fe/
├── assets/
├── components/
├── composables/
├── layouts/
├── middleware/
├── pages/
├── stores/
├── types/
└── app.vue
```

`pages` bertanggung jawab terhadap routing dan page composition, sedangkan reusable UI ditempatkan di `components`.
business atau api logic yang digunakan oleh beberapa halaman ditempatkan pada `composables`, sementara state yang perlu digunakan lintas halaman dapat ditempatkan pada store.
authentication dan authorization access control ditangani melalui middleware.

---

4. API Contract

API menggunakan REST dengan contract yang konsisten antara frontend dan backend.

Contoh:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

response success dan error menggunakan struktur yang konsisten sehingga frontend tidak perlu memiliki logic khusus untuk setiap endpoint
list endpoint menggunakan pagination, sorting, dan filtering sebagai bagian dari contract

contoh:

```text
GET /api/products?page=1&limit=20&sortBy=name&sortOrder=asc
```

request validation dilakukan di backend menggunakan DTO, frontend dapat melakukan validasi untuk meningkatkan user experience, tetapi backend tetap menjadi source of truth.

HTTP status code juga digunakan sesuai dengan kondisi request, misalnya:

```text
200 → successful request
400 → invalid request
401 → unauthenticated
403 → authenticated but not authorized
404 → resource not found
409 → conflict
500 → unexpected server error
```

sebenarnya ada statusCode:
```text
304 → unexpected server error
```

ini adalah cache dari nestJS sementara secara default dipakai diaplikasi sekarang, bisa kita disable dengan menambahkan:
```text
app.disable('etag');
```

pendekatan ini membuat contract lebih predictable dan mempermudah integrasi frontend dengan backend

---

5. Trade-off karena Batas Waktu

dengan keterbatasan waktu, saya memprioritaskan hal-hal yang memberikan value langsung terhadap core functionality dan maintainability
Beberapa hal sengaja dibuat sederhana:

- belum menambahkan caching layer seperti Redis
- belum membuat distributed tracing
- belum membangun pipeline CI/CD yang kompleks
- test coverage masih seadanya.
- audit logging belum menjadi bagian dari initial implementation
- mungkin ada beberapa functionality yang belum ditest dibeberapa case

saya menghindari menambahkan infrastructure hanya karena bisa digunakan atau menambah developer experience. setiap tambahan dependency atau infrastructure membawa operational cost, maintenance, dan failure mode baru

prioritas awal adalah memiliki fundamental yang clean (walaupun sekarang belum clean2 amat) dan mudah dikembangkan sehingga komponen tersebut dapat ditambahkan ketika memang ada kebutuhan nyata

---

6. Scaling dari 100 ke 100.000 Produk

pada skala 100 produk, hampir semua query sederhana masih akan memberikan hasil yang baik dan desain dari awal tetap mempertimbangkan pertumbuhan data

untuk menghandle 100.000 produk, langkah pertama adalah memastikan list API tidak mengambil seluruh dataset

pagination akan menjadi default:

```text
GET /api/products?page=1&limit=50
```

kemudian query database akan dioptimalkan dengan index berdasarkan pola filtering, sorting, dan lookup yang sebenarnya digunakan

beberapa area yang menjadi concern adalah:

```text
100 products
    ↓
Pagination
    ↓
Database indexes
    ↓
Query optimization
    ↓
Caching untuk read-heavy data
    ↓
Connection pooling
    ↓
Horizontal scaling
```

jika traffic meningkat, backend NestJS dapat dijalankan sebagai beberapa instance dibelakang load balancer.

postgre tetap dapat menjadi primary data store, sementara redis dapat ditambahkan untuk caching jika hasil monitoring menunjukkan database menjadi bottleneck.

pada tahap lebih lanjut, read replicas atau strategi database scaling lainnya dapat dipertimbangkan berdasarkan workloadnya

yang penting, saya tidak akan melakukan premature optimizatio atau over enginering hanya karena target datanya 100.000 produk
bottleneck sebaiknya diidentifikasi melalui metrics dan profiling

---

7. Role-Based Access Control

RBAC akan dikembangkan di backend menggunakan kombinasi role dan guard.

Model dasarnya:

```text
User
  ↓
Role
  ↓
Permissions
```

Contohnya:

```text
ADMIN
 ├── product:read
 ├── product:create
 ├── product:update
 ├── product:delete
 └── user:manage

STAFF
 ├── product:read
 └── product:update
```

NestJS Guard akan memeriksa role atau permission sebelum request diteruskan ke business logic.

Frontend middleware dan UI permission hanya digunakan sebagai user experience layer. Authorization sebenarnya tetap dilakukan di backend karena client tidak dapat dipercaya.

Jika kebutuhan authorization semakin kompleks, model dapat dikembangkan dari simple role-based access menjadi permission-based access.

---

8. Audit Logging

audit logging akan ditambahkan untuk aktivitas yang membutuhkan traceability, terutama perubahan terhadap data penting
contohnya:

```text
User A
    ↓
UPDATE Product
    ↓
Product #123
    ↓
price: 10000 → 12000
    ↓
2026-09-17 10:30:00
```

Audit record minimal dapat menyimpan:

```text
actor
action
entity
entityId
oldValue
newValue
timestamp
requestId
```

Contoh:

```text
actor: user-123
action: PRODUCT_UPDATED
entity: Product
entityId: product-456
oldValue: {"price": 10000}
newValue: {"price": 12000}
timestamp: ...
```

audit log sebaiknya immutable atau setidaknya tidak dapat diubah oleh user biasa

---

9. Apa yang Sengaja Tidak Dibangun

Beberapa fitur tidak saya build pada tahap ini karena belum memberikan value yang sebanding dengan kompleksitasnya.

- Upload Image

Belum sempat diimplementasikan karena kendala waktu dan focus pada core function

- Email User validation

untuk email user validation ketika proses regestrasi termasuk menjadi concern karena salah satunya adalah untuk fitur forgot password yang membutuhkan email user yang valid. namun hal ini bisa ditunda karena kita focus pada fungsi CRUD produk

- Forgot Password

ini juga belum diimplementasikan karena perlu email user validation untuk memastikan email user valid

- Halaman Profile

untuk concernnya adalah karena ini bukan fungsi utama dan terkendala waktu, namun kedepannya hal ini diperlukan untuk update info seperti nama dan fitur ganti password

- Redis

belum diperlukan selama PostgreSQL dan API query masih dapat memenuhi kebutuhan performa, redis akan ditambahkan jika profiling menunjukkan kebutuhan caching atau distributed state

- Advanced RBAC

sekarang baru ada dilevel aplikasi backend dan frontend untuk role `ADMIN` dan `STAFF`
permission matrix yang lebih kompleks baru diperlukan ketika jumlah role dan business rule bertambah dan menjadi configurable.

---

## Closing

Arsitektur ini dirancang dengan prinsip yang simple namun scaleable, dan mungkin masih banyak kekurangan, system ini akan terus berkembang sesuai dengan kebutuhan penggunanya itu sendiri, dan ini bukanlah pattern yang pasti karena akan dapat terus berkembang mengikuti perkembangan teknologi sekarang
