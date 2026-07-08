export interface RouteMetadata {
  title: string;
  breadcrumb: string;
  description: string;
}

export const routeMetadata: Record<string, RouteMetadata> = {
  "/admin/dashboard": {
    title: "Dashboard DPC Dramaga",
    breadcrumb: "Dashboard / Overview",
    description: "Ringkasan data dan aktivitas organisasi hari ini.",
  },
  "/admin/anggota": {
    title: "Anggota & Kader",
    breadcrumb: "Data & Keanggotaan / Anggota & Kader",
    description: "Kelola data anggota dan kader DPC Dramaga.",
  },
  "/admin/kelompok-upa": {
    title: "Kelompok UPA",
    breadcrumb: "Pembinaan UPA / Kelompok",
    description: "Kelola unit pembinaan anggota (UPA).",
  },
  "/admin/rapor-keaktifan": {
    title: "Rapor Keaktifan",
    breadcrumb: "Pembinaan UPA / Rapor",
    description: "Pantau tingkat keaktifan kader secara berkala.",
  },
  "/admin/event": {
    title: "Jadwal Event",
    breadcrumb: "Event / Jadwal",
    description: "Kelola agenda dan acara DPC.",
  },
  "/admin/absensi-event": {
    title: "Absensi Event (QR Scan)",
    breadcrumb: "Event / Absensi",
    description: "Sistem absensi cepat menggunakan QR Code.",
  },
  "/admin/kegiatan": {
    title: "Kegiatan",
    breadcrumb: "Kegiatan / Daftar",
    description: "Kelola kegiatan dan agenda organisasi.",
  },
  "/admin/absensi-kegiatan": {
    title: "Absensi Kegiatan",
    breadcrumb: "Kegiatan / Absensi",
    description: "Catat kehadiran peserta kegiatan organisasi.",
  },
  "/admin/laporan": {
    title: "Laporan",
    breadcrumb: "Laporan / Ringkasan",
    description: "Ringkasan dan rekap data organisasi.",
  },
  "/admin/iuran-infak": {
    title: "Iuran & Infak",
    breadcrumb: "Keuangan / Iuran",
    description: "Monitor pembayaran iuran rutin anggota.",
  },
  "/admin/laporan-keuangan": {
    title: "Laporan Keuangan",
    breadcrumb: "Keuangan / Laporan",
    description: "Rekapitulasi pemasukan dan pengeluaran kas.",
  },
  "/admin/inventaris-logistik": {
    title: "Inventaris Logistik",
    breadcrumb: "Logistik / Inventaris",
    description: "Daftar aset dan perlengkapan organisasi.",
  },
  "/admin/peminjaman-logistik": {
    title: "Peminjaman Logistik",
    breadcrumb: "Logistik / Peminjaman",
    description: "Kelola peminjaman barang oleh kader.",
  },
  "/admin/laporan-export": {
    title: "Laporan & Export",
    breadcrumb: "Laporan / Export",
    description: "Generate dan unduh dokumen laporan resmi.",
  },
  "/admin/profile": {
    title: "Profile Settings",
    breadcrumb: "Settings / Profile",
    description: "Kelola informasi profil dan KTA digital Anda.",
  },
};

export const getRouteMetadata = (pathname: string): RouteMetadata => {
  // Check for exact matches first
  if (routeMetadata[pathname]) return routeMetadata[pathname];

  // Handle dynamic routes
  if (pathname.startsWith("/admin/kelompok-upa/")) {
    return {
      title: "Detail Kelompok UPA",
      breadcrumb: "Pembinaan UPA / Kelompok / Detail",
      description: "Informasi lengkap and daftar anggota kelompok UPA.",
    };
  }

  return {
    title: "SIKADERA",
    breadcrumb: "Dashboard",
    description: "Sistem Informasi Manajemen Kaderisasi",
  };
};
