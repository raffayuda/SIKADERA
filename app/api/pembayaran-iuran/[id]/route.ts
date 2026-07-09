import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const cicilan = await prisma.riwayatPembayaranIuran.findMany({
      where: { pembayaranIuranId: BigInt(id) },
      orderBy: { dibuatPada: "asc" },
    });
    return NextResponse.json(
      cicilan.map((c) => ({
        ...c,
        id: Number(c.id),
        pembayaranIuranId: Number(c.pembayaranIuranId),
      }))
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: String(error), stack: error instanceof Error ? error.stack : null }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const nominal = Number(body.nominal);

    if (nominal <= 0) {
      return NextResponse.json({ error: "Nominal harus lebih dari 0" }, { status: 400 });
    }

    const cicilan = await prisma.$transaction(async (tx) => {
      const pembayaran = await tx.pembayaranIuran.findUnique({
        where: { id: BigInt(id) },
      });
      if (!pembayaran) throw new Error("Data pembayaran tidak ditemukan");

      const cicilan = await tx.riwayatPembayaranIuran.create({
        data: {
          pembayaranIuranId: BigInt(id),
          nominal,
          tanggalBayar: new Date(body.tanggalBayar || new Date()),
          metodePembayaran: body.metodePembayaran || null,
          buktiPembayaran: body.buktiPembayaran || null,
          catatan: body.catatan || null,
        },
      });

      const totalDibayar = (pembayaran.nominalBayar || 0) + nominal;
      const newStatus = totalDibayar >= pembayaran.nominalTagihan ? "sudah_bayar" : "dicicil";

      await tx.pembayaranIuran.update({
        where: { id: BigInt(id) },
        data: {
          nominalBayar: totalDibayar,
          status: newStatus,
          tanggalBayar: new Date(body.tanggalBayar || new Date()),
          metodePembayaran: body.metodePembayaran || pembayaran.metodePembayaran,
          buktiPembayaran: body.buktiPembayaran || pembayaran.buktiPembayaran,
          catatan: body.catatan || pembayaran.catatan,
        },
      });

      return cicilan;
    });

    return NextResponse.json(
      {
        ...cicilan,
        id: Number(cicilan.id),
        pembayaranIuranId: Number(cicilan.pembayaranIuranId),
      },
      { status: 201 }
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: String(error), stack: error instanceof Error ? error.stack : null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.nominalBayar) data.nominalBayar = Number(body.nominalBayar);
    if (body.tanggalBayar) data.tanggalBayar = new Date(body.tanggalBayar);
    if (body.status) data.status = body.status;
    if (body.metodePembayaran) data.metodePembayaran = body.metodePembayaran;
    if (body.buktiPembayaran) data.buktiPembayaran = body.buktiPembayaran;
    if (body.catatan !== undefined) data.catatan = body.catatan;

    const pembayaran = await prisma.pembayaranIuran.update({
      where: { id: BigInt(id) },
      data,
    });
    return NextResponse.json({
      ...pembayaran,
      id: Number(pembayaran.id),
      periodeIuranId: Number(pembayaran.periodeIuranId),
      anggotaId: Number(pembayaran.anggotaId),
    });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
