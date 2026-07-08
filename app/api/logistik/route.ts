import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("admin", "pembimbing");
    const logistik = await prisma.logistik.findMany({
      include: {
        _count: { select: { peminjamanLogistik: { where: { status: "dipinjam" } } } },
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(
      logistik.map((l) => ({
        ...l,
        id: Number(l.id),
        dipinjam: l._count.peminjamanLogistik,
        _count: undefined,
      }))
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const body = await req.json();
    const logistik = await prisma.logistik.create({
      data: {
        namaBarang: body.namaBarang,
        jumlah: Number(body.jumlah),
        kondisi: body.kondisi || "baik",
      },
    });
    return NextResponse.json({ ...logistik, id: Number(logistik.id) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
