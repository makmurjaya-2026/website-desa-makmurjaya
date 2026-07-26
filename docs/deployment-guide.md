# Panduan Deployment — Website Desa Makmurjaya

Dokumen ini menjelaskan langkah-langkah deploy website ke GitHub Pages, konfigurasi domain kustom, dan setup autentikasi Decap CMS melalui GitHub OAuth + Netlify.

---

## Prasyarat

- Akun GitHub dengan akses ke repository website desa
- (Opsional) Domain kustom yang sudah dibeli (misal: `desamakmurjaya.id`)
- Akun Netlify gratis (untuk OAuth proxy Decap CMS)

---

## 1. Setup GitHub Pages — Deploy from Actions

GitHub Actions workflow sudah dikonfigurasi di `.github/workflows/deploy.yml`. Anda perlu mengaktifkan GitHub Pages agar workflow dapat melakukan deployment.

### Langkah-langkah:

1. Buka repository di GitHub: `https://github.com/username/desa-makmurjaya`
2. Klik tab **Settings** (ikon roda gigi)
3. Di sidebar kiri, klik **Pages**
4. Pada bagian **Build and deployment**:
   - **Source**: pilih **GitHub Actions**
   - (Jangan pilih "Deploy from a branch")
5. Klik **Save**

### Memicu Deployment Pertama:

- Push commit baru ke branch `main`, atau
- Buka tab **Actions** → pilih workflow **Deploy Website Desa Makmurjaya** → klik **Run workflow**

### Verifikasi:

- Setelah workflow selesai (±2-3 menit), buka URL yang muncul di halaman Settings → Pages
- Jika menggunakan subdomain GitHub: `https://username.github.io/desa-makmurjaya`
- Jika menggunakan domain kustom: `https://desamakmurjaya.id`

---

## 2. Konfigurasi Domain Kustom

### Jika Menggunakan Domain Kustom (Rekomendasi):

#### a. Konfigurasi DNS di Provider Domain

Tambahkan DNS record berikut di panel domain registrar Anda:

| Tipe | Nama/Host | Value |
|------|-----------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | username.github.io |

> **Catatan:** Ganti `username` dengan username/organisasi GitHub yang memiliki repository.

#### b. Konfigurasi di GitHub

1. Buka **Settings** → **Pages**
2. Di bagian **Custom domain**, masukkan: `desamakmurjaya.id`
3. Klik **Save**
4. Tunggu verifikasi DNS (bisa memakan waktu hingga 24 jam, biasanya beberapa menit)
5. Centang **Enforce HTTPS** setelah sertifikat SSL ter-provision

#### c. File CNAME

File `public/CNAME` sudah berisi domain `desamakmurjaya.id`. File ini akan otomatis ter-copy ke folder `dist/` saat build, memastikan GitHub Pages mengenali domain kustom.

- Jika Anda mengganti domain, edit file `public/CNAME` sesuai domain baru
- Jika menggunakan subdomain GitHub (tanpa domain kustom), kosongkan isi file `public/CNAME`

#### d. Update `astro.config.mjs`

Pastikan properti `site` di `astro.config.mjs` sesuai dengan domain yang digunakan:

```javascript
// Dengan domain kustom:
site: 'https://desamakmurjaya.id',
base: '/',

// Tanpa domain kustom (subdomain GitHub):
site: 'https://username.github.io',
base: '/desa-makmurjaya/',
```

### Jika Menggunakan Subdomain GitHub (Tanpa Domain Kustom):

1. Kosongkan file `public/CNAME` (hapus isinya, biarkan file kosong)
2. Update `astro.config.mjs`:
   ```javascript
   site: 'https://username.github.io',
   base: '/desa-makmurjaya/',
   ```
3. Website akan tersedia di: `https://username.github.io/desa-makmurjaya`

---

## 3. Setup GitHub OAuth App untuk Decap CMS

Decap CMS memerlukan autentikasi GitHub OAuth untuk login pengelola. Arsitektur yang digunakan:

```
Pengelola → Decap CMS (/admin) → Netlify OAuth Proxy → GitHub OAuth → Akses Repo
```

### Langkah 1: Buat GitHub OAuth App

1. Buka https://github.com/settings/developers
2. Klik **OAuth Apps** → **New OAuth App**
3. Isi form:
   - **Application name**: `Website Desa Makmurjaya CMS`
   - **Homepage URL**: `https://desamakmurjaya.id` (atau URL GitHub Pages Anda)
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. Klik **Register application**
5. Catat **Client ID** yang ditampilkan
6. Klik **Generate a new client secret** dan catat **Client Secret**

> **PENTING:** Simpan Client Secret dengan aman. Anda tidak akan bisa melihatnya lagi setelah meninggalkan halaman.

### Langkah 2: Konfigurasi Netlify sebagai OAuth Proxy

1. Buka https://app.netlify.com dan login/daftar dengan akun GitHub
2. Klik **Add new site** → **Import an existing project** → pilih repository yang sama
3. Pada konfigurasi build:
   - **Build command**: (kosongkan atau isi `echo "proxy only"`)
   - **Publish directory**: (kosongkan atau isi `.`)
   - Netlify tidak perlu benar-benar men-deploy sitenya — hanya digunakan sebagai OAuth proxy
4. Setelah site dibuat, buka **Site settings** → **Access & security** → **OAuth**
5. Klik **Install provider**
6. Pilih **GitHub** dan masukkan:
   - **Client ID**: (dari langkah 1)
   - **Client Secret**: (dari langkah 1)
7. Klik **Install**
8. **PENTING — Tambahkan Domain Alias:**
   - Buka **Domain management** pada site Netlify yang sama
   - Klik **Add domain alias**
   - Tambahkan: `username.github.io` (hostname GitHub Pages Anda, contoh: `makmurjaya-2026.github.io`)
   - Ini WAJIB karena Decap CMS mengirim hostname halaman (`window.location.hostname`) sebagai `site_id` ke Netlify API, bukan nilai `site_id` dari config. Tanpa domain alias ini, Netlify tidak mengenali request dan mengembalikan "Not Found".

### Langkah 3: Verifikasi Konfigurasi Decap CMS

Pastikan file `decap-cms/config.yml` memiliki konfigurasi backend berikut:

```yaml
backend:
  name: github
  repo: username/desa-makmurjaya    # ganti dengan repo aktual
  branch: main
  base_url: https://api.netlify.com
  auth_endpoint: auth
```

### Langkah 4: Testing Login CMS

1. Buka `https://desamakmurjaya.id/admin` (atau URL Pages Anda + `/admin`)
2. Klik **Login with GitHub**
3. Anda akan diarahkan ke halaman otorisasi GitHub
4. Setelah mengizinkan, Anda akan kembali ke dashboard Decap CMS
5. Coba buat/edit sebuah konten dan verifikasi commit muncul di repository

---

## 4. Konfigurasi Secrets di GitHub Repository

Beberapa secret perlu dikonfigurasi agar workflow berjalan dengan benar:

1. Buka repository → **Settings** → **Secrets and variables** → **Actions**
2. Klik **New repository secret** dan tambahkan:

| Nama Secret | Nilai | Keterangan |
|---|---|---|
| `FORMSPREE_ENDPOINT` | `https://formspree.io/f/xxxxxxxx` | Endpoint Formspree untuk form kontak |

> **Catatan:** Daftar di https://formspree.io, buat form baru, dan salin endpoint-nya.

---

## 5. Troubleshooting

### Build Gagal di GitHub Actions

- Periksa tab **Actions** untuk melihat log error
- Pastikan `package-lock.json` sudah ter-commit
- Pastikan versi Node.js di workflow sesuai (20.x)

### Domain Kustom Tidak Bekerja

- Pastikan DNS record sudah benar dan sudah propagasi (gunakan https://dnschecker.org)
- Pastikan file `public/CNAME` berisi domain yang tepat
- Tunggu hingga 24 jam untuk propagasi DNS penuh

### Login CMS Gagal

- Pastikan **Authorization callback URL** di GitHub OAuth App adalah `https://api.netlify.com/auth/done`
- Pastikan Client ID dan Secret di Netlify cocok dengan yang di GitHub
- Pastikan `base_url` di `decap-cms/config.yml` adalah `https://api.netlify.com`
- Pastikan `repo` di config CMS sesuai format `username/repo-name`
- **KRITIS: Tambahkan domain alias di Netlify** — Decap CMS menggunakan `window.location.hostname` (bukan `site_id` dari config) saat mengirim request OAuth ke Netlify. Netlify harus mengenali hostname tersebut sebagai milik situs Anda.
  - Buka Netlify → Site → Domain management → Add domain alias
  - Tambahkan: `username.github.io` (hostname GitHub Pages Anda)
  - Tanpa ini, Anda akan mendapat error "Not Found" saat login CMS

### Halaman 404 Setelah Deploy

- Jika menggunakan subdomain GitHub, pastikan `base` di `astro.config.mjs` diisi dengan nama repository (misal `/desa-makmurjaya/`)
- Pastikan **Source** di GitHub Pages settings sudah diatur ke **GitHub Actions**

---

## Checklist Deployment

- [ ] GitHub Pages diaktifkan dengan source "GitHub Actions"
- [ ] (Opsional) Domain kustom dikonfigurasi di DNS dan GitHub Pages
- [ ] File `public/CNAME` berisi domain yang benar (atau kosong jika pakai subdomain GitHub)
- [ ] `astro.config.mjs` memiliki `site` dan `base` yang sesuai
- [ ] GitHub OAuth App dibuat dengan callback URL `https://api.netlify.com/auth/done`
- [ ] Netlify dikonfigurasi sebagai OAuth proxy dengan Client ID/Secret
- [ ] Netlify domain alias ditambahkan: `username.github.io` (WAJIB untuk CMS login)
- [ ] `decap-cms/config.yml` memiliki `repo` yang benar
- [ ] Secret `FORMSPREE_ENDPOINT` ditambahkan ke repository
- [ ] Workflow deploy berhasil (cek tab Actions)
- [ ] Website dapat diakses di URL publik
- [ ] Login CMS di `/admin` berhasil
- [ ] HTTPS aktif (Enforce HTTPS dicentang)
