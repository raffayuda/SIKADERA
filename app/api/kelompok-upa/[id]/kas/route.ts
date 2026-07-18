import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const { searchParams } = req.nextUrl;
    const tanggalDari = searchParams.get("tanggalDari");
    const tanggalSampai = searchParams.get("tanggalSampai");

    const where: Record<string, unknown> = { kelompokId: BigInt(id) };
    if (tanggalDari || tanggalSampai) {
      const filter: Record<string, Date> = {};
      if (tanggalDari) filter.gte = new Date(tanggalDari);
      if (tanggalSampai) filter.lte = new Date(tanggalSampai);
      where.tanggal = filter;
    }

    const transaksi = await prisma.kasKelompok.findMany({
      where,
      include: { anggota: { select: { id: true, namaLengkap: true } } },
      orderBy: { tanggal: "desc" },
    });

    return NextResponse.json(
      transaksi.map((t) => ({
        ...t,
        id: Number(t.id),
        kelompokId: Number(t.kelompokId),
        anggotaId: t.anggotaId !== null ? Number(t.anggotaId) : null,
      }))
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();

    if (!body.tipe || !["masuk", "keluar"].includes(body.tipe)) {
      return NextResponse.json({ error: "Tipe harus 'masuk' atau 'keluar'" }, { status: 400 });
    }
    if (!body.nominal || body.nominal <= 0) {
      return NextResponse.json({ error: "Nominal harus lebih dari 0" }, { status: 400 });
    }

    const transaksi = await prisma.kasKelompok.create({
      data: {
        kelompokId: BigInt(id),
        anggotaId: body.anggotaId ? BigInt(body.anggotaId) : null,
        tipe: body.tipe,
        nominal: Number(body.nominal),
        keterangan: body.keterangan || null,
        tanggal: body.tanggal ? new Date(body.tanggal) : new Date(),
      },
      include: { anggota: { select: { id: true, namaLengkap: true } } },
    });

    return NextResponse.json(
      {
        ...transaksi,
        id: Number(transaksi.id),
        kelompokId: Number(transaksi.kelompokId),
        anggotaId: transaksi.anggotaId !== null ? Number(transaksi.anggotaId) : null,
      },
      { status: 201 }
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
