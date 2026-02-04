# PhotoBox Koran - SnapManner

Aplikasi web interaktif untuk membuat foto bergaya koran vintage khas Malioboro. Ambil 3 foto menggunakan kamera, dan hasilnya akan ditampilkan dalam layout koran klasik yang dapat diunduh.

---

## Fitur Utama

- **Kamera Real-time** - Akses kamera langsung dari browser
- **Live Photo Effect** - Menyimpan beberapa frame untuk efek live photo saat hover
- **Template Koran Vintage** - Desain klasik bergaya koran Malioboro
- **Custom Headline** - Bisa mengubah judul, sub-headline, dan lokasi
- **Download Gambar** - Simpan hasil koran sebagai gambar
- **Download Video** - Simpan sebagai video dengan efek live photo
- **Responsive** - Bisa digunakan di desktop dan mobile
- **Flash Effect** - Efek flash saat mengambil foto
- **Shutter Sound** - Suara kamera saat mengambil foto

---

## Cara Menggunakan

### 1. Buka Aplikasi
Buka file `index.html` di browser modern (Chrome, Firefox, Safari, Edge).

### 2. Izinkan Akses Kamera
Saat pertama kali membuka, browser akan meminta izin akses kamera. Klik **"Allow"** atau **"Izinkan"**.

### 3. Ambil 3 Foto
- Posisikan diri di depan kamera
- Klik tombol **capture** (bulat besar) untuk mengambil foto
- Ulangi hingga 3 foto terambil
- Foto akan muncul di thumbnail di bawah kamera

### 4. Isi Informasi Koran
Setelah mengambil 3 foto, isi informasi berikut:

| Field | Keterangan | Contoh |
|-------|------------|--------|
| **Judul Headline** | Judul utama koran (maks 20 karakter) | `MALIOBORO` |
| **Sub Headline** | Deskripsi tambahan (maks 80 karakter) | `A Timeless Journey Through Yogyakarta's Heart` |
| **Lokasi/Kategori** | Kategori atau lokasi (maks 20 karakter) | `PLACE TO GO` |

### 5. Cetak Koran
Klik tombol **"Cetak Koran"** untuk melihat hasil akhir dalam format koran.

### 6. Download Hasil
- **Download Gambar** - Simpan sebagai file JPG
- **Download Video** - Simpan sebagai video MP4 dengan efek live photo animasi

### 7. Reset (Opsional)
Klik **"Reset Semua"** untuk mengulang dari awal.

---

## Struktur File

```
photobox/
├── index.html    # Halaman utama HTML
├── style.css     # Styling dan desain koran
├── app.js        # Logika aplikasi (kamera, capture, dll)
└── README.md     # Dokumentasi ini
```

---

## Teknologi yang Digunakan

- **HTML5** - Struktur halaman dan elemen canvas
- **CSS3** - Styling, animasi, dan desain koran vintage
- **JavaScript (Vanilla)** - Logika aplikasi tanpa framework
- **MediaDevices API** - Akses kamera browser
- **Canvas API** - Capture dan manipulasi gambar
- **Web Audio API** - Efek suara shutter

---

## Persyaratan Sistem

- Browser modern dengan dukungan:
  - `navigator.mediaDevices.getUserMedia()`
  - HTML5 Canvas
  - ES6 JavaScript
- Kamera (webcam atau kamera HP)
- Koneksi HTTPS (untuk akses kamera di beberapa browser)

---

## Tips Penggunaan

1. **Pencahayaan** - Pastikan pencahayaan cukup untuk hasil foto terbaik
2. **Posisi** - Posisikan wajah di tengah frame kamera
3. **Variasi Pose** - Ambil 3 foto dengan pose berbeda agar lebih menarik
4. **Headline Singkat** - Gunakan kata-kata singkat dan impactful untuk headline
5. **Live Photo** - Hover di thumbnail untuk melihat efek live photo

---

## Kustomisasi

### Mengubah Font
Edit bagian `@import` di `style.css` untuk menggunakan font berbeda dari Google Fonts.

### Mengubah Warna
Warna utama dapat diubah di variabel CSS atau langsung di class `.newspaper`.

### Mengubah Layout
Struktur koran dapat disesuaikan di `index.html` pada bagian `#newspaper`.

---

## Lisensi

Proyek ini dibuat untuk pembelajaran dan dapat digunakan secara bebas.

---

## Kontributor

Dibuat untuk pengalaman PhotoBox bergaya koran Malioboro.

---

## Kontak & Support

Jika ada pertanyaan atau saran, silakan buat issue di repository ini.

---

**Selamat menggunakan PhotoBox Koran!**
