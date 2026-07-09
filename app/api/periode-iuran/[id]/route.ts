import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const pembayaran = await prisma.pembayaranIuran.findMany({
      where: { periodeIuranId: BigInt(id) },
      include: { anggota: true },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(
      pembayaran.map((p) => ({
        ...p,
        id: Number(p.id),
        periodeIuranId: Number(p.periodeIuranId),
        anggotaId: Number(p.anggotaId),
        anggota: p.anggota
          ? { ...p.anggota, id: Number(p.anggota.id), userId: p.anggota.userId ? Number(p.anggota.userId) : null, kelompokId: p.anggota.kelompokId ? Number(p.anggota.kelompokId) : null }
          : null,
      }))
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
