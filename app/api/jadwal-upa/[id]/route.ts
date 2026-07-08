import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const jadwal = await prisma.jadwalUpa.update({
      where: { id: BigInt(id) },
      data: {
        hari: body.hari || null,
        waktu: body.waktu || null,
        tempat: body.tempat || null,
        mapsUrl: body.mapsUrl || null,
        aktivitas: body.aktivitas || null,
      },
    });
    return NextResponse.json({ ...jadwal, id: Number(jadwal.id) });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin");
    const { id } = await params;
    await prisma.jadwalUpa.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
