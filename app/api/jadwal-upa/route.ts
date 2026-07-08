import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const { searchParams } = req.nextUrl;
    const kelompokId = searchParams.get("kelompok_id");

    const where: Record<string, unknown> = {};
    if (kelompokId) where.kelompokId = Number(kelompokId);

    const jadwal = await prisma.jadwalUpa.findMany({
      where,
      orderBy: { id: "asc" },
    });

    return NextResponse.json(
      jadwal.map((j) => ({ ...j, id: Number(j.id), kelompokId: j.kelompokId !== null ? Number(j.kelompokId) : null }))
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const body = await req.json();
    const jadwal = await prisma.jadwalUpa.create({
      data: {
        kelompokId: body.kelompokId ? Number(body.kelompokId) : null,
        hari: body.hari || null,
        waktu: body.waktu || null,
        tempat: body.tempat || null,
        mapsUrl: body.mapsUrl || null,
        aktivitas: body.aktivitas || null,
      },
    });
    return NextResponse.json({
      ...jadwal,
      id: Number(jadwal.id),
      kelompokId: jadwal.kelompokId !== null ? Number(jadwal.kelompokId) : null,
    }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
