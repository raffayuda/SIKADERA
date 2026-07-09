import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const absensi = await prisma.absensiKegiatan.update({
      where: { id: BigInt(id) },
      data: { status: body.status },
    });
    return NextResponse.json({ ...absensi, id: Number(absensi.id), kegiatanId: Number(absensi.kegiatanId), anggotaId: Number(absensi.anggotaId) });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
