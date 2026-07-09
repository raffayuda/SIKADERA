import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("admin", "pembimbing");

    const totalAnggota = await prisma.anggota.count();
    const anggotaAktif = await prisma.anggota.count({ where: { status: "aktif" } });
    const totalKelompok = await prisma.kelompokUpa.count();
    const totalKegiatan = await prisma.kegiatan.count();

    const totalIuran = await prisma.pembayaranIuran.aggregate({
      _sum: { nominalBayar: true },
      where: { status: "sudah_bayar" },
    });
    const totalInfak = await prisma.infak.aggregate({
      _sum: { nominal: true },
    });

    const totalLogistik = await prisma.logistik.count();
    const logistikDipinjam = await prisma.peminjamanLogistik.count({
      where: { status: "dipinjam" },
    });

    const iuranBelumLunas = await prisma.pembayaranIuran.count({ where: { status: "belum_bayar" } });

    return NextResponse.json({
      anggota: { total: totalAnggota, aktif: anggotaAktif, nonAktif: totalAnggota - anggotaAktif },
      kelompok: { total: totalKelompok },
      kegiatan: { total: totalKegiatan },
      keuangan: {
        totalIuran: totalIuran._sum.nominalBayar || 0,
        totalInfak: totalInfak._sum.nominal || 0,
        iuranBelumLunas,
      },
      logistik: { total: totalLogistik, dipinjam: logistikDipinjam },
    });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
