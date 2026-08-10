// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const beritaCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    judul: z.string().max(200),
    cuplikan: z.string().max(300).optional(),
    foto_thumbnail: image().optional(),
    tanggal: z.date(),
    penulis: z.string().optional(),
  }),
});

const pengumumanCollection = defineCollection({
  type: 'content',
  schema: z.object({
    judul: z.string().max(200),
    cuplikan: z.string().max(300).optional(),
    kategori: z.enum(['Pengumuman', 'Agenda']),
    tanggal: z.date(),
    tanggal_pelaksanaan: z.date().optional(),
    waktu_pelaksanaan: z.string().optional(),
    lampiran: z.array(z.object({
      nama_file: z.string(),
      url: z.string(),
      ukuran_kb: z.number().optional(),
    })).default([]),
  }),
});

const wisataCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    nama: z.string(),
    deskripsi_singkat: z.string().max(300),
    lokasi_lat: z.number().optional(),
    lokasi_lng: z.number().optional(),
    lokasi_label: z.string().optional(),
    jam_operasional: z.string().optional(),
    harga_tiket: z.string().optional(),
    kontak: z.string().optional(),
    petunjuk_akses: z.string().optional(),
    galeri_foto: z.array(image()).default([]),
    foto_utama: image().optional(),
  }),
});

const umkmCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    nama_usaha: z.string(),
    pemilik: z.string(),
    kategori: z.string().optional(),
    jenis_produk: z.string(),
    harga_range: z.string().optional(),
    kontak_wa: z.string(),
    alamat: z.string().optional(),
    lokasi_lat: z.number().optional(),
    lokasi_lng: z.number().optional(),
    lokasi_gmaps: z.string().optional(),
    foto_utama: image().optional(),
    galeri_foto: z.array(image()).default([]),
  }),
});

const galeriCollection = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    judul_foto: z.string(),
    file_foto: image(),
    caption: z.string().optional(),
    album: z.string().default('Umum'),
    tanggal_upload: z.coerce.date(),
    urutan: z.number().default(0),
  }),
});

const perangkatDesaCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    nama: z.string(),
    jabatan: z.string(),
    foto: image().optional(),
    urutan: z.number().default(99),
    level_hierarki: z.number().default(1),
    parent_slug: z.string().optional(),
    kontak: z.string().optional(),
  }),
});

const faqCollection = defineCollection({
  type: 'content',
  schema: z.object({
    pertanyaan: z.string(),
    kategori: z.string().optional(),
    urutan: z.number().default(99),
  }),
});

const halamanStatisCollection = defineCollection({
  type: 'content',
  schema: z.object({
    judul: z.string(),
    tipe: z.enum([
      'profil-sejarah',
      'profil-visi-misi',
      'profil-lokasi',
      'kontak-info'
    ]),
    lokasi_lat: z.number().optional(),
    lokasi_lng: z.number().optional(),
    lokasi_label: z.string().optional(),
  }),
});

export const collections = {
  berita: beritaCollection,
  pengumuman: pengumumanCollection,
  wisata: wisataCollection,
  umkm: umkmCollection,
  galeri: galeriCollection,
  'perangkat-desa': perangkatDesaCollection,
  faq: faqCollection,
  'halaman-statis': halamanStatisCollection,
};
