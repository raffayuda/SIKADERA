CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin','pengurus','anggota'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE kelompok_upa (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nama_kelompok VARCHAR(100),
    ketua_id BIGINT,
    wilayah VARCHAR(100),
    jadwal_rutin VARCHAR(100),
    deskripsi TEXT
);


CREATE TABLE anggota (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE,
    kelompok_id BIGINT,

    nama_lengkap VARCHAR(100),
    nik VARCHAR(20),
    no_hp VARCHAR(20),

    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,

    jenis_kelamin ENUM('L','P'),

    alamat TEXT,

    pendidikan VARCHAR(50),
    pekerjaan VARCHAR(100),

    desil INT,

    status ENUM('aktif','tidak_aktif'),

    tahun_gabung YEAR,

    FOREIGN KEY(user_id)
    REFERENCES users(id),

    FOREIGN KEY(kelompok_id)
    REFERENCES kelompok_upa(id)
);


CREATE TABLE kegiatan (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    nama_kegiatan VARCHAR(150),
    jenis VARCHAR(50),

    tanggal DATE,
    lokasi VARCHAR(150),

    penanggung_jawab BIGINT,

    deskripsi TEXT
);


CREATE TABLE absensi_kelompok (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    kelompok_id BIGINT,
    anggota_id BIGINT,

    tanggal DATE,

    status ENUM(
        'hadir',
        'izin',
        'sakit',
        'tidak_hadir'
    ),

    FOREIGN KEY(kelompok_id)
    REFERENCES kelompok_upa(id),

    FOREIGN KEY(anggota_id)
    REFERENCES anggota(id)
);


CREATE TABLE absensi_kegiatan (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    kegiatan_id BIGINT,
    anggota_id BIGINT,

    status ENUM(
        'hadir',
        'izin',
        'sakit',
        'tidak_hadir'
    ),

    FOREIGN KEY(kegiatan_id)
    REFERENCES kegiatan(id),

    FOREIGN KEY(anggota_id)
    REFERENCES anggota(id)
);


CREATE TABLE iuran (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    anggota_id BIGINT,

    jenis ENUM(
        'iuran',
        'infak'
    ),

    nominal INT,

    tanggal DATE,

    status ENUM(
        'lunas',
        'belum_lunas'
    ),

    keterangan TEXT,

    FOREIGN KEY(anggota_id)
    REFERENCES anggota(id)
);


CREATE TABLE logistik (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    nama_barang VARCHAR(100),

    jumlah INT,

    kondisi VARCHAR(50)
);


CREATE TABLE peminjaman_logistik (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    anggota_id BIGINT,

    logistik_id BIGINT,

    jumlah_pinjam INT,

    tanggal_pinjam DATE,

    tanggal_kembali DATE,

    status ENUM(
        'dipinjam',
        'dikembalikan'
    ),

    FOREIGN KEY(anggota_id)
    REFERENCES anggota(id),

    FOREIGN KEY(logistik_id)
    REFERENCES logistik(id)
);