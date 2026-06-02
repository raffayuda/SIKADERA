"use client";

import { ModulePageTemplate } from "../module-page-template";
import {
  IconChartBar,
  IconUsers,
  IconTrendingUp,
  IconAlertCircle,
} from "@tabler/icons-react";

export default function RaporKeaktifanPage() {
  return (
    <ModulePageTemplate
      activeItem="Rapor Keaktifan"
      breadcrumb="Pembinaan UPA / Rapor Keaktifan"
      title="Rapor Keaktifan"
      description="Pantau performa kehadiran anggota dan kelompok UPA."
      primaryActionLabel="Buat Rapor"
      searchPlaceholder="Cari anggota, UPA, murabbi, atau wilayah..."
      summaryCards={[
        {
          title: "Rata-rata Keaktifan",
          value: "76%",
          note: "bulan ini",
          icon: IconChartBar,
          tone: "emerald",
        },
        {
          title: "Kader Aktif",
          value: "2,137",
          note: "aktif pembinaan",
          icon: IconUsers,
          tone: "sky",
        },
        {
          title: "Naik Tren",
          value: "12",
          note: "kelompok membaik",
          icon: IconTrendingUp,
          tone: "emerald",
        },
        {
          title: "Perlu Perhatian",
          value: "5",
          note: "kelompok rendah",
          icon: IconAlertCircle,
          tone: "amber",
        },
      ]}
      tabs={[
        { label: "Semua", value: "all", count: "24" },
        { label: "Baik", value: "Baik", count: "15" },
        { label: "Cukup", value: "Cukup", count: "6" },
        { label: "Rendah", value: "Rendah", count: "3" },
      ]}
      rows={[
        {
          title: "UPA Babakan",
          subtitle: "Rapor keaktifan kelompok",
          meta1: "96 anggota",
          meta2: "5 pertemuan",
          meta3: "Trend naik",
          status: "Baik",
          statusTone: "emerald",
          progressLabel: "Keaktifan",
          progressValue: 92,
        },
        {
          title: "UPA Dramaga",
          subtitle: "Rapor keaktifan kelompok",
          meta1: "88 anggota",
          meta2: "5 pertemuan",
          meta3: "Stabil",
          status: "Baik",
          statusTone: "emerald",
          progressLabel: "Keaktifan",
          progressValue: 84,
        },
        {
          title: "UPA Ciherang",
          subtitle: "Rapor keaktifan kelompok",
          meta1: "69 anggota",
          meta2: "4 pertemuan",
          meta3: "Perlu monitoring",
          status: "Cukup",
          statusTone: "amber",
          progressLabel: "Keaktifan",
          progressValue: 68,
        },
        {
          title: "UPA Petir",
          subtitle: "Rapor keaktifan kelompok",
          meta1: "38 anggota",
          meta2: "3 pertemuan",
          meta3: "Turun",
          status: "Rendah",
          statusTone: "rose",
          progressLabel: "Keaktifan",
          progressValue: 47,
        },
      ]}
      rightTitle="Rekomendasi Kaderisasi"
      rightDescription="Tindak lanjut berdasarkan rapor keaktifan."
      insights={[
        {
          title: "UPA Babakan paling aktif",
          description: "Kehadiran dan konsistensi pembinaan berada di atas rata-rata.",
          tone: "emerald",
        },
        {
          title: "UPA Ciherang perlu monitoring",
          description: "Kehadiran cukup namun perlu penguatan komunikasi murabbi.",
          tone: "amber",
        },
        {
          title: "UPA Petir perlu aktivasi",
          description: "Butuh strategi reaktivasi anggota dan jadwal ulang.",
          tone: "rose",
        },
      ]}
    />
  );
}