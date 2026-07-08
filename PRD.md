# PRD - SIKADERA

## Sistem Informasi Kader UPA PKS Kecamatan Dramaga

---

# 1. Product Overview

## Nama Produk

SIKADERA (Sistem Informasi Kader Daerah)

## Deskripsi Produk

SIKADERA merupakan aplikasi berbasis web untuk membantu pengelolaan administrasi anggota UPA PKS tingkat Kecamatan Dramaga.

Aplikasi ini berfungsi sebagai pusat pendataan anggota, pengelolaan kelompok UPA, pencatatan kegiatan, absensi, administrasi iuran, pengelolaan logistik, serta pembuatan laporan organisasi.

Sistem dibuat untuk menggantikan proses administrasi manual sehingga data anggota dan aktivitas organisasi dapat tersimpan secara terstruktur.

---

# 2. Tujuan Produk

Tujuan utama SIKADERA:

1. Membuat database anggota UPA PKS Kecamatan Dramaga.
2. Mempermudah pengelolaan kelompok UPA.
3. Mengelola kegiatan organisasi beserta absensi peserta.
4. Mengelola pencatatan iuran dan infak.
5. Mengelola peminjaman logistik organisasi.
6. Membantu pengurus membuat laporan administrasi.

---

# 3. Target User

## Admin Kecamatan

Hak akses:

* Mengelola seluruh data sistem.
* Mengelola akun pengguna.
* Melihat seluruh laporan.

---

## Pengurus UPA

Hak akses:

* Mengelola kelompok.
* Membuat kegiatan.
* Mengelola absensi.
* Mengelola logistik.

---

## Anggota

Hak akses:

* Memiliki akun pribadi.
* Melihat profil.
* Melihat kelompok.
* Melihat kegiatan.
* Melihat riwayat iuran.

---

# 4. Modul Sistem

# 4.1 Pendataan Anggota

## Deskripsi

Modul untuk menyimpan seluruh informasi anggota UPA PKS Kecamatan Dramaga.

## Fitur

* Tambah anggota.
* Edit anggota.
* Detail anggota.
* Pencarian anggota.
* Status keaktifan anggota.

## Data Anggota

* Nama lengkap
* NIK
* Nomor HP
* Email
* Tempat lahir
* Tanggal lahir
* Jenis kelamin
* Alamat
* Pendidikan
* Pekerjaan
* Status anggota
* Tahun bergabung
* Desil kesejahteraan
* Kelompok UPA

---

# 4.2 Akun Anggota

## Deskripsi

Setiap anggota memiliki akun untuk mengakses sistem.

## Fitur

* Login anggota.
* Reset password.
* Update profil.

## Data Akun

* Email/username
* Password
* Role pengguna

Role:

* Admin
* Pengurus
* Anggota

Relasi:

```
users 1 : 1 anggota
```

---

# 4.3 Kelompok UPA

## Deskripsi

Modul untuk mengelola kelompok pembinaan anggota.

## Fitur

* Membuat kelompok.
* Menentukan ketua kelompok.
* Melihat anggota kelompok.
* Absensi pertemuan kelompok.

## Data Kelompok

* Nama kelompok
* Ketua kelompok
* Wilayah
* Jadwal rutin
* Deskripsi

---

# 4.4 Absensi Kelompok

## Deskripsi

Digunakan untuk mencatat kehadiran anggota dalam pertemuan kelompok.

## Data Absensi

* Kelompok
* Tanggal pertemuan
* Anggota
* Status kehadiran

Status:

* Hadir
* Izin
* Sakit
* Tidak hadir

---

# 4.5 Kegiatan

## Deskripsi

Mengelola kegiatan organisasi tingkat kelompok maupun kecamatan.

## Data Kegiatan

* Nama kegiatan
* Jenis kegiatan
* Tanggal
* Lokasi
* Penanggung jawab
* Deskripsi

---

# 4.6 Absensi Kegiatan

## Deskripsi

Mencatat peserta yang mengikuti kegiatan organisasi.

## Data

* Kegiatan
* Anggota
* Status hadir

---

# 4.7 Iuran / Infak

## Deskripsi

Mengelola transaksi pemasukan organisasi.

## Data

* Anggota
* Jenis transaksi
* Nominal
* Tanggal
* Status pembayaran
* Keterangan

Jenis:

* Iuran
* Infak

---

# 4.8 Logistik

## Deskripsi

Mengelola inventaris barang organisasi.

## Data Barang

* Nama barang
* Jumlah tersedia
* Kondisi
* Lokasi penyimpanan

---

# 4.9 Peminjaman Logistik

## Deskripsi

Mengelola peminjaman barang.

## Data

* Peminjam
* Barang
* Jumlah
* Tanggal pinjam
* Tanggal kembali
* Status

Status:

* Dipinjam
* Dikembalikan

---

# 4.10 Laporan

## Jenis Laporan

### Laporan Anggota

* Jumlah anggota aktif
* Data anggota

### Laporan Absensi

* Kehadiran anggota
* Rekap kegiatan

### Laporan Keuangan

* Total pemasukan
* Riwayat transaksi

### Laporan Logistik

* Stok barang
* Riwayat peminjaman

---

# 5. Struktur Menu

```
Dashboard

Anggota
Kelompok UPA
Kegiatan
Iuran / Infak
Logistik
Laporan

Pengaturan
```

---

# 6. Business Rule

1. Setiap anggota harus memiliki satu akun.
2. Satu anggota hanya berada pada satu kelompok UPA aktif.
3. Satu kelompok dapat memiliki banyak anggota.
4. Satu kegiatan dapat memiliki banyak peserta.
5. Satu anggota dapat memiliki banyak riwayat iuran.
6. Satu barang dapat memiliki banyak transaksi peminjaman.
7. Absensi tidak menjadi menu utama, tetapi bagian dari kelompok dan kegiatan.
