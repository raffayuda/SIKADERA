import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const absensi = await prisma.absensiKelompok.update({
      where: { id: BigInt(id) },
      data: { status: body.status },
    });
    return NextResponse.json({
      ...absensi,
      id: Number(absensi.id),
      kelompokId: absensi.kelompokId !== null ? Number(absensi.kelompokId) : null,
      anggotaId: absensi.anggotaId !== null ? Number(absensi.anggotaId) : null,
    });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
