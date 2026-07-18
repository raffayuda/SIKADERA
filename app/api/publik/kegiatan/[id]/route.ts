import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kegiatan = await prisma.kegiatan.findUnique({
      where: { id: BigInt(id) },
    });

    if (!kegiatan) {
      return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      ...kegiatan,
      id: Number(kegiatan.id),
      penanggungJawab: kegiatan.penanggungJawab ? Number(kegiatan.penanggungJawab) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
