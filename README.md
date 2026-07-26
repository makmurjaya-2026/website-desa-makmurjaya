# Website Desa Makmurjaya

Website profil resmi Desa Makmurjaya — dibangun dengan Astro 4, Decap CMS, Tailwind CSS, dan di-deploy otomatis ke GitHub Pages.

## Arsitektur Sistem

```
┌─────────────┐      ┌────────────────┐      ┌─────────────────┐
│  Pengelola  │─────▶│  Decap CMS     │─────▶│  GitHub Repo    │
│  (Browser)  │      │  (/admin)      │      │  (main branch)  │
└─────────────┘      └────────────────┘      └────────┬────────┘
                                                       │
                                              push event (otomatis)
                                                       │
                                                       ▼
┌─────────────┐      ┌────────────────┐      ┌─────────────────┐
│ Pengunjung  │◀─────│  GitHub Pages  │◀─────│ GitHub Actions  │
│  (Browser)  │      │  (CDN global)  │      │ (build & deploy)│
└─────────────┘      └────────────────┘      └─────────────────┘
```

**Alur kerja:**
1. Pengelola login ke `/admin` menggunakan akun GitHub
2. Decap CMS menyimpan perubahan sebagai Git commit ke repository
3. GitHub Actions otomatis menjalankan build (`astro build` + Pagefind)
4. Hasil build di-deploy ke GitHub Pages
5. Pengunjung mengakses website statis melalui CDN GitHub

## Prasyarat

| Software | Versi | Keterangan |
|----------|-------|------------|
| Node.js  | 20.x LTS | Runtime untuk build Astro |
| npm      | 10.x+ | Package manager (bawaan Node.js) |
| Git      | 2.x+  | Version control |

Pastikan Node.js 20 terinstal:

```bash
node --version
# Output: v20.x.x
```

## Instalasi

```bash
# Clone repository
git clone https://github.com/[username]/desa-makmurjaya.git
cd desa-makmurjaya

# Install dependencies
npm install
```

## Development

Jalankan development server dengan hot-reload:

```bash
npm run dev
```

Server berjalan di `http://localhost:4321`. Perubahan pada file di `src/` akan otomatis ter-refresh di browser.

### Script Tersedia

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Development server dengan hot-reload |
| `npm run build` | Build produksi ke folder `dist/` |
| `npm run preview` | Preview hasil build secara lokal |
| `npm run test` | Jalankan unit test (Vitest) |
| `npm run test:watch` | Jalankan test dalam mode watch |
| `npm run test:coverage` | Jalankan test dengan laporan coverage |

## Build

Build situs untuk produksi:

```bash
npm run build
```

Output berada di folder `dist/`. Untuk menjalankan Pagefind (search index) secara lokal setelah build:

```bash
npx pagefind --site dist
```

Preview hasil build:

```bash
npm run preview
```

## Deployment

### GitHub Pages (Otomatis)

Deployment otomatis melalui GitHub Actions. Setiap push ke branch `main` akan memicu workflow:

1. Checkout kode
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Build Astro (`npm run build`)
5. Generate search index (Pagefind)
6. Deploy ke GitHub Pages

File workflow: `.github/workflows/deploy.yml`

### Konfigurasi Repository GitHub

1. Buka **Settings** > **Pages** di repository GitHub
2. Source: pilih **GitHub Actions**
3. Tambahkan secret `FORMSPREE_ENDPOINT` di **Settings** > **Secrets and variables** > **Actions**
   - Nilai: endpoint Formspree untuk formulir kontak (contoh: `https://formspree.io/f/xxxxx`)

## Konfigurasi Domain Kustom

Untuk menggunakan domain kustom (misal: `desamakmurjaya.id`):

### 1. Konfigurasi DNS

Tambahkan record DNS di provider domain:

| Tipe | Nama | Nilai |
|------|------|-------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |
| CNAME| www  | [username].github.io |

### 2. Konfigurasi GitHub Pages

1. Buka **Settings** > **Pages**
2. Di bagian **Custom domain**, masukkan domain (misal: `desamakmurjaya.id`)
3. Centang **Enforce HTTPS**

### 3. Tambahkan File CNAME

Buat file `public/CNAME` berisi domain:

```
desamakmurjaya.id
```

### 4. Update `astro.config.mjs`

Pastikan `site` sesuai domain:

```js
export default defineConfig({
  site: 'https://desamakmurjaya.id',
  base: '/',
  // ...
});
```

## Struktur Proyek

```
├── .github/workflows/    # GitHub Actions workflow
├── decap-cms/            # Konfigurasi Decap CMS
├── public/
│   ├── admin/            # Decap CMS admin panel
│   ├── uploads/          # File media (gambar)
│   └── robots.txt
├── src/
│   ├── components/       # Komponen Astro (.astro)
│   ├── content/          # Konten Markdown (berita, dll)
│   ├── layouts/          # Layout halaman
│   ├── pages/            # Halaman (file-based routing)
│   └── styles/           # Global styles
├── astro.config.mjs      # Konfigurasi Astro
├── package.json
├── tailwind.config.mjs   # Konfigurasi Tailwind CSS
└── tsconfig.json         # Konfigurasi TypeScript
```

## Teknologi Utama

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Astro | 4.x | Static site generator |
| Decap CMS | 3.x | Content management (browser-based) |
| Tailwind CSS | 3.x | Styling (utility-first) |
| TypeScript | 5.x | Type safety |
| Leaflet.js | 1.9.x | Peta interaktif (OpenStreetMap) |
| Pagefind | 1.x | Pencarian client-side |
| Vitest | 2.x | Unit testing |

## Troubleshooting

### Build gagal di GitHub Actions

**Masalah:** Workflow gagal saat build.

**Solusi:**
1. Periksa log di tab **Actions** pada repository GitHub
2. Pastikan semua dependencies terinstall dengan benar
3. Jalankan `npm run build` secara lokal untuk mereproduksi error
4. Pastikan secret `FORMSPREE_ENDPOINT` sudah dikonfigurasi

### `npm install` gagal

**Masalah:** Error saat install dependencies.

**Solusi:**
```bash
# Hapus node_modules dan lock file, lalu install ulang
rm -rf node_modules package-lock.json
npm install
```

### Pagefind tidak menghasilkan index

**Masalah:** Pencarian tidak berfungsi setelah build.

**Solusi:**
```bash
# Pastikan build selesai terlebih dahulu
npm run build

# Jalankan Pagefind secara manual
npx pagefind --site dist
```

### Decap CMS tidak bisa login

**Masalah:** Error saat login ke `/admin`.

**Solusi:**
1. Pastikan repository bersifat publik atau user memiliki akses
2. Periksa konfigurasi OAuth di `decap-cms/config.yml`
3. Pastikan backend `name: github` dan `branch: main` sudah benar
4. Coba clear cache browser dan login ulang

### Peta tidak muncul

**Masalah:** Komponen peta Leaflet tidak tampil.

**Solusi:**
1. Pastikan CSS Leaflet sudah di-import
2. Periksa console browser untuk error terkait tile loading
3. Pastikan koneksi internet tersedia (tile dari OpenStreetMap)

### Gambar tidak tampil setelah upload via CMS

**Masalah:** Gambar yang diupload via Decap CMS tidak muncul di website.

**Solusi:**
1. Pastikan path upload di `decap-cms/config.yml` sesuai (`public/uploads/`)
2. Tunggu build selesai (GitHub Actions) setelah commit
3. Periksa apakah file gambar sudah ter-commit ke repository

### Port 4321 sudah digunakan

**Masalah:** `npm run dev` gagal karena port busy.

**Solusi:**
```bash
# Gunakan port lain
npx astro dev --port 3000
```

## Environment Variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `FORMSPREE_ENDPOINT` | Ya (production) | Endpoint Formspree untuk formulir kontak |

Untuk development lokal, buat file `.env`:

```
FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxx
```

## Lisensi

Proyek ini dikembangkan untuk Desa Makmurjaya. Kredit kepada Tim KKN IPB 2026, Jeff146354
