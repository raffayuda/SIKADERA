import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { kelompok_id, tanggal, anggota_id } = await req.json();

    if (!kelompok_id || !tanggal || !anggota_id) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek apakah sudah absen hari ini
    const existing = await prisma.absensiKelompok.findFirst({
      where: {
        kelompokId: BigInt(kelompok_id),
        anggotaId: BigInt(anggota_id),
        tanggal: new Date(tanggal),
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Sudah absen", hadir: true });
    }

    await prisma.absensiKelompok.create({
      data: {
        kelompokId: BigInt(kelompok_id),
        anggotaId: BigInt(anggota_id),
        tanggal: new Date(tanggal),
        status: "hadir",
      },
    });

    return NextResponse.json({ message: "Absen berhasil", hadir: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const kelompokId = searchParams.get("kelompok_id");
    const tanggal = searchParams.get("tanggal");

    if (!kelompokId || !tanggal) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }

    const anggota = await prisma.anggota.findMany({
      where: { kelompokId: BigInt(kelompokId) },
      include: { user: true },
      orderBy: { namaLengkap: "asc" },
    });

    // Cek yang sudah absen
    const absensi = await prisma.absensiKelompok.findMany({
      where: {
        kelompokId: BigInt(kelompokId),
        tanggal: new Date(tanggal),
      },
    });

    const sudahAbsen = new Set(absensi.map((a) => Number(a.anggotaId)));

    return NextResponse.json(
      anggota.map((a) => ({
        id: Number(a.id),
        namaLengkap: a.namaLengkap,
        sudahAbsen: sudahAbsen.has(Number(a.id)),
      }))
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
