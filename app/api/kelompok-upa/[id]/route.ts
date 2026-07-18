import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const kelompok = await prisma.kelompokUpa.findUnique({
      where: { id: BigInt(id) },
      include: {
        ketua: { include: { user: true } },
        anggota: { include: { user: true }, orderBy: { namaLengkap: "asc" } },
        jadwalUpa: { orderBy: { id: "asc" } },
        absensiKelompok: {
          include: { anggota: { include: { user: true } } },
          orderBy: { tanggal: "desc" },
          take: 50,
        },
        kasKelompok: {
          orderBy: { tanggal: "desc" },
          take: 3,
          include: { anggota: { select: { id: true, namaLengkap: true } } },
        },
      },
    });
    if (!kelompok) {
      return NextResponse.json({ error: "Kelompok tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({
      ...kelompok,
      id: Number(kelompok.id),
      ketuaId: kelompok.ketuaId !== null ? Number(kelompok.ketuaId) : null,
      ketua: kelompok.ketua ? {
        ...kelompok.ketua,
        id: Number(kelompok.ketua.id),
        userId: kelompok.ketua.userId !== null ? Number(kelompok.ketua.userId) : null,
        kelompokId: kelompok.ketua.kelompokId !== null ? Number(kelompok.ketua.kelompokId) : null,
        user: kelompok.ketua.user ? { ...kelompok.ketua.user, id: Number(kelompok.ketua.user.id) } : null,
      } : null,
      anggota: kelompok.anggota.map((a) => ({
        ...a,
        id: Number(a.id),
        userId: a.userId !== null ? Number(a.userId) : null,
        kelompokId: a.kelompokId !== null ? Number(a.kelompokId) : null,
        user: a.user ? { ...a.user, id: Number(a.user.id) } : null,
      })),
      jadwalUpa: kelompok.jadwalUpa.map((j) => ({
        ...j,
        id: Number(j.id),
        kelompokId: j.kelompokId !== null ? Number(j.kelompokId) : null,
        mapsUrl: j.mapsUrl,
      })),
      absensiKelompok: kelompok.absensiKelompok.map((a) => ({
        ...a,
        id: Number(a.id),
        kelompokId: a.kelompokId !== null ? Number(a.kelompokId) : null,
        anggotaId: a.anggotaId !== null ? Number(a.anggotaId) : null,
        anggota: a.anggota ? {
          ...a.anggota,
          id: Number(a.anggota.id),
          userId: a.anggota.userId !== null ? Number(a.anggota.userId) : null,
          kelompokId: a.anggota.kelompokId !== null ? Number(a.anggota.kelompokId) : null,
          user: a.anggota.user ? { ...a.anggota.user, id: Number(a.anggota.user.id) } : null,
        } : null,
      })),
      kasKelompok: kelompok.kasKelompok.map((k) => ({
        ...k,
        id: Number(k.id),
        kelompokId: Number(k.kelompokId),
      })),
    });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const kelompok = await prisma.kelompokUpa.update({
      where: { id: BigInt(id) },
      data: {
        namaKelompok: body.namaKelompok,
        ketuaId: body.ketuaId ? Number(body.ketuaId) : null,
        wilayah: body.wilayah,
        jadwalRutin: body.jadwalRutin,
        deskripsi: body.deskripsi,
      },
    });
    return NextResponse.json({
      ...kelompok,
      id: Number(kelompok.id),
      ketuaId: kelompok.ketuaId !== null ? Number(kelompok.ketuaId) : null,
    });
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
    await prisma.kelompokUpa.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
