import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("admin", "pembimbing");
    const infak = await prisma.infak.findMany({
      include: { anggota: true },
      orderBy: { tanggal: "desc" },
    });
    return NextResponse.json(
      infak.map((i) => ({
        ...i,
        id: Number(i.id),
        anggotaId: i.anggotaId ? Number(i.anggotaId) : null,
        createdBy: i.createdBy ? Number(i.createdBy) : null,
        anggota: i.anggota
          ? { ...i.anggota, id: Number(i.anggota.id), userId: i.anggota.userId ? Number(i.anggota.userId) : null, kelompokId: i.anggota.kelompokId ? Number(i.anggota.kelompokId) : null }
          : null,
      }))
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const body = await req.json();
    const infak = await prisma.infak.create({
      data: {
        anggotaId: body.anggotaId ? Number(body.anggotaId) : null,
        kategoriInfak: body.kategoriInfak,
        nominal: Number(body.nominal),
        tanggal: body.tanggal ? new Date(body.tanggal) : new Date(),
        tujuan: body.tujuan,
        keterangan: body.keterangan,
        bukti: body.bukti,
        createdBy: body.createdBy ? Number(body.createdBy) : null,
      },
    });
    return NextResponse.json({ ...infak, id: Number(infak.id) }, { status: 201 });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
