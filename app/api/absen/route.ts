import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kelompok_id, kegiatan_id, tanggal, anggota_id } = body;

    if (!anggota_id) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Kegiatan-based absensi
    if (kegiatan_id) {
      if (!tanggal) {
        return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
      }

      const existing = await prisma.absensiKegiatan.findFirst({
        where: {
          kegiatanId: BigInt(kegiatan_id),
          anggotaId: BigInt(anggota_id),
        },
      });

      if (existing) {
        return NextResponse.json({ message: "Sudah absen", hadir: true });
      }

      await prisma.absensiKegiatan.create({
        data: {
          kegiatanId: BigInt(kegiatan_id),
          anggotaId: BigInt(anggota_id),
          status: "hadir",
        },
      });

      return NextResponse.json({ message: "Absen berhasil", hadir: true });
    }

    // Kelompok-based absensi
    if (!kelompok_id || !tanggal) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

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
    const kegiatanId = searchParams.get("kegiatan_id");
    const tanggal = searchParams.get("tanggal");

    // Kegiatan-based absensi
    if (kegiatanId) {
      if (!tanggal) {
        return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
      }

      const anggota = await prisma.anggota.findMany({
        where: { status: "aktif" },
        orderBy: { namaLengkap: "asc" },
      });

      const absensi = await prisma.absensiKegiatan.findMany({
        where: { kegiatanId: BigInt(kegiatanId) },
      });

      const sudahAbsen = new Set(absensi.map((a) => Number(a.anggotaId)));

      return NextResponse.json(
        anggota.map((a) => ({
          id: Number(a.id),
          namaLengkap: a.namaLengkap,
          sudahAbsen: sudahAbsen.has(Number(a.id)),
        }))
      );
    }

    // Kelompok-based absensi
    if (!kelompokId || !tanggal) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }

    const anggota = await prisma.anggota.findMany({
      where: { kelompokId: BigInt(kelompokId) },
      include: { user: true },
      orderBy: { namaLengkap: "asc" },
    });

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
