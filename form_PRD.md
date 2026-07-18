Product Requirement Document (PRD): Form Builder & Data Recapping Tool
1. Project Overview & Objective
Tujuannya adalah membangun sebuah platform pembuatan formulir (Form Builder) internal yang berfokus penuh pada pengumpulan, perekapan, dan manajemen data. Sistem ini dirancang untuk menggantikan kebutuhan Google Forms standar, namun dioptimalkan khusus untuk keperluan operasional/survei murni tanpa adanya kompleksitas fitur edukasi seperti sistem penilaian soal (kuis), skor, atau kunci jawaban.

2. Core User Features (Fitur Utama Pengguna)
A. Form Creator & Customization (Pembuat Formulir)
Drag-and-Drop / Linear Interface: Pengguna dapat menambah, menghapus, dan mengatur ulang urutan pertanyaan dengan mudah.

Theme Customization: Fitur mengubah warna aksen dasar formulir dan menambahkan gambar header atas.

Form Control:

Pengaturan judul dan deskripsi formulir.

Opsi mengaktifkan/menonaktifkan formulir (Menerima / Menolak tanggapan).

B. Response Controls (Batasan Tanggapan)
Limit to 1 Response: Opsi untuk membatasi pengisian hanya 1 kali per pengguna (memerlukan sistem login).

Allow Response Editing: Opsi yang membolehkan responden mengubah data yang sudah dikirimkan setelah formulir dikumpulkan.

C. Data Recapping & Analytics (Perekapan Data)
Real-time Summary Dashboard: Menyediakan halaman visualisasi data tanggapan yang otomatis diperbarui:

Grafik lingkaran (Pie Chart) untuk pilihan ganda dan dropdown.

Grafik batang (Bar Chart) untuk tipe kotak centang (checkboxes) dan skala.

Daftar teks untuk jawaban singkat dan paragraf.

Response Table View: Menampilkan seluruh data masuk dalam bentuk tabel baris dan kolom.

Export Data: Fitur wajib untuk mengunduh seluruh data rekapan dalam format CSV / Excel (.xlsx).

3. Supported Question Types (Jenis Pertanyaan)
Untuk kebutuhan rekap data, sistem harus mendukung tipe input berikut lengkap dengan fitur Response Validation (Validasi Jawaban) dan opsi Required (Wajib Diisi):

Short Answer (Jawaban Singkat): Input teks satu baris.

Validasi: Harus berupa Angka, Email, atau batas karakter minimum/maksimum.

Paragraph (Paragraf): Input teks multi-baris untuk masukan panjang.

Multiple Choice (Pilihan Ganda): Memilih 1 dari N opsi.

Fitur Tambahan: Opsi percabangan logika halaman (Go to Section Based on Answer).

Checkboxes (Kotak Centang): Memilih lebih dari 1 opsi.

Validasi: Batasan minimal atau maksimal opsi yang boleh dicentang.

Dropdown: Menu tarik-turun untuk memilih 1 dari N opsi (desain ringkas).

File Upload (Unggah File): Mengizinkan responden mengunggah file.

Validasi: Pembatasan format file (PDF, Doc, Image) dan ukuran file maksimal.

Linear Scale (Skala Linier): Rating angka (misal: 1 hingga 5 atau 1 hingga 10) untuk mengukur kepuasan.

Date & Time (Tanggal & Waktu): Input berbasis kalender dan jam untuk perekapan waktu yang presisi.

4. Banned Features / Out of Scope (Fitur yang Ditiadakan)
Untuk menjaga kesederhanaan sistem perekapan data, FITUR BERIKUT TIDAK BOLEH DIKRITERIAKAN ATAU DIBUAT:

Tidak ada Mode Kuis (Quiz Mode Toggle).

Tidak ada Input Kunci Jawaban (Answer Key).

Tidak ada Poin / Bobot Nilai pada tiap pertanyaan.

Tidak ada Umpan balik jawaban benar/salah (Feedback Message).

5. Non-Functional Requirements (Ketentuan Teknis)
Data Integrity: Validasi data harus berjalan di sisi client (UI) dan server untuk memastikan tidak ada data korup yang terekap.

Responsiveness: Formulir harus mobile-friendly (mudah diisi melalui HP), sedangkan dasbor perekapan data dioptimalkan untuk tampilan desktop.