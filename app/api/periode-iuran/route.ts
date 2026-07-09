import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("admin", "pembimbing");
    const periode = await prisma.periodeIuran.findMany({
      include: {
        jenisIuran: true,
        _count: { select: { pembayaranIuran: true } },
      },
      orderBy: [{ tahun: "desc" }, { bulan: "desc" }],
    });
    return NextResponse.json(
      periode.map((p) => ({
        ...p,
        id: Number(p.id),
        jenisIuranId: Number(p.jenisIuranId),
        dibuatOleh: p.dibuatOleh ? Number(p.dibuatOleh) : null,
        jenisIuran: p.jenisIuran ? { ...p.jenisIuran, id: Number(p.jenisIuran.id) } : null,
        _count: p._count,
      }))
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin");
    const body = await req.json();

    // 1. Buat periode
    const periode = await prisma.periodeIuran.create({
      data: {
        jenisIuranId: BigInt(body.jenisIuranId),
        bulan: Number(body.bulan),
        tahun: Number(body.tahun),
        nominal: Number(body.nominal),
      },
    });

    // 2. Ambil semua anggota aktif
    const anggota = await prisma.anggota.findMany({ where: { status: "aktif" } });

    // 3. Buat kewajiban pembayaran untuk setiap anggota
    const pembayaran = await prisma.$transaction(
      anggota.map((a) =>
        prisma.pembayaranIuran.create({
          data: {
            periodeIuranId: Number(periode.id),
            anggotaId: Number(a.id),
            nominalTagihan: Number(body.nominal),
            status: "belum_bayar",
          },
        })
      )
    );

    return NextResponse.json(
      {
        ...periode,
        id: Number(periode.id),
        jenisIuranId: Number(periode.jenisIuranId),
        dibuatOleh: periode.dibuatOleh ? Number(periode.dibuatOleh) : null,
        totalAnggota: anggota.length,
      },
      { status: 201 }
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
