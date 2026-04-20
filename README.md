# Djaloe Coffee Roastery — Next.js + PostgreSQL

**Stack:** Next.js 14 · PostgreSQL (Neon) · Prisma · NextAuth · Resend · Vercel

---

## 📁 Struktur Halaman

| Halaman | URL | Keterangan |
|---------|-----|------------|
| Homepage | `/` | Hero, About, Produk, Gallery, Reviews nyata |
| Story | `/story` | Brand story + Nilai Perusahaan (editable) |
| Origins | `/origins` | Semua produk dengan filter roast |
| Detail Produk | `/origins/[slug]` | Detail + tulis review |
| Gallery | `/gallery` | Grid foto + lightbox |
| Contact | `/contact` | Kontak + sosmed + store |
| Login | `/auth/login` | Email/Password + Google |
| Register | `/auth/register` | Daftar akun |
| Forgot Password | `/auth/forgot-password` | Kirim link reset via email |
| Reset Password | `/auth/reset-password` | Input password baru |
| **Admin CMS** | `/admin` | Dashboard lengkap |

---

## 🖥️ Cara Jalankan di Lokal (Windows/Mac/Linux)

### Prasyarat
- Node.js 18+ — download dari [nodejs.org](https://nodejs.org)
- PostgreSQL lokal **ATAU** akun Neon gratis (direkomendasikan)

### Langkah-langkah

**1. Install dependencies**
```bash
cd djaloe-v2
npm install
```

**2. Setup database**

**Opsi A — Neon (gratis, direkomendasikan):**
1. Daftar di [neon.tech](https://neon.tech)
2. Create project → pilih region terdekat
3. Dashboard → Connection Details → salin kedua string koneksi

**Opsi B — PostgreSQL lokal:**
- Install PostgreSQL dari [postgresql.org](https://www.postgresql.org/download/)
- Buat database: `createdb djaloe_coffee`

**3. Buat file `.env.local`**
```bash
cp .env.example .env.local
```
Edit `.env.local` dan isi:
```env
# Neon:
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/dbname?sslmode=require"

# PostgreSQL lokal:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/djaloe_coffee"
# DIRECT_URL="postgresql://postgres:password@localhost:5432/djaloe_coffee"

NEXTAUTH_SECRET="buat-random-string-panjang"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="dari-google-console"
GOOGLE_CLIENT_SECRET="dari-google-console"
RESEND_API_KEY="re_dari_resend"
RESEND_FROM_EMAIL="onboarding@resend.dev"
ADMIN_EMAIL="admin@djaloecoffee.com"
ADMIN_PASSWORD="PasswordKuat123!"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**4. Setup database schema + data awal**
```bash
npm run db:push       # buat semua tabel
npm run db:seed       # isi data awal (produk, settings, admin)
```

**5. Jalankan**
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000)

Login admin: `http://localhost:3000/admin`

---

## 🌐 Deploy ke Vercel

### 1. Setup Neon Database (gratis)
1. Daftar di [neon.tech](https://neon.tech) → Create project
2. Nama project: `djaloe-coffee`
3. Dashboard → **Connection Details** → salin:
   - **Connection string** → untuk `DATABASE_URL`
   - **Direct connection** → untuk `DIRECT_URL`

### 2. Setup Google OAuth
1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web application
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://nama-project.vercel.app/api/auth/callback/google`
5. Salin Client ID dan Client Secret

### 3. Setup Resend (email)
1. Daftar di [resend.com](https://resend.com) → API Keys → Create API Key
2. Untuk testing: gunakan `onboarding@resend.dev` sebagai FROM email
3. Untuk production: verify domain kamu di Resend → Domains

### 4. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit — Djaloe Coffee Roastery"
# Buat repo baru di github.com, lalu:
git remote add origin https://github.com/username/djaloe-coffee.git
git push -u origin main
```

### 5. Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) → New Project → Import dari GitHub
2. Pilih repo `djaloe-coffee` → **Deploy**
3. Setelah deploy, buka **Settings → Environment Variables**
4. Tambahkan semua variabel:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Neon connection string |
| `DIRECT_URL` | Neon direct connection string |
| `NEXTAUTH_SECRET` | Random string panjang |
| `NEXTAUTH_URL` | `https://nama-project.vercel.app` |
| `GOOGLE_CLIENT_ID` | Dari Google Console |
| `GOOGLE_CLIENT_SECRET` | Dari Google Console |
| `RESEND_API_KEY` | Dari Resend |
| `RESEND_FROM_EMAIL` | Email pengirim |
| `ADMIN_EMAIL` | Email admin pertama |
| `ADMIN_PASSWORD` | Password admin |
| `NEXT_PUBLIC_APP_URL` | `https://nama-project.vercel.app` |

5. **Redeploy** setelah mengisi env vars: Deployments → klik titik tiga → Redeploy

### 6. Seed database production (sekali saja)
```bash
# Di terminal lokal, dengan DATABASE_URL sudah diset ke Neon production:
npm run db:push    # push schema ke Neon
npm run db:seed    # isi data awal
```

---

## 📸 Tentang Upload Gambar di Vercel

Vercel adalah **serverless** — file yang ditulis ke filesystem tidak persisten. Ini artinya:
- ✅ Gambar produk yang sudah ada di `public/uploads/` (committed ke repo) → **tetap bisa diakses**
- ⚠️ Gambar baru yang diupload via CMS setelah deploy → **bisa hilang** saat instance restart

**Solusi untuk production (pilih salah satu):**

**Opsi 1 — Cloudinary (gratis 25GB):**
```bash
npm install cloudinary
```
Ganti upload handler di `app/api/admin/upload/route.ts` untuk upload ke Cloudinary.

**Opsi 2 — Vercel Blob (berbayar setelah 5GB):**
```bash
npm install @vercel/blob
```
Vercel Blob terintegrasi langsung dengan deployment Vercel.

**Untuk sekarang (lokal & commit gambar ke repo):** Upload via CMS di lokal → commit `public/uploads/` → push ke GitHub → Vercel otomatis serve.

---

## 🔑 Login Admin
- URL: `/admin`
- Email: nilai `ADMIN_EMAIL` di `.env.local`
- Password: nilai `ADMIN_PASSWORD` di `.env.local`

---

## 🗝️ Generate NEXTAUTH_SECRET
```bash
# Di terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
