import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const anggota = await prisma.anggota.findUnique({
      where: { id: BigInt(id) },
      include: { user: true, kelompok: true, iuran: true },
    });
    if (!anggota) {
      return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({
      ...anggota,
      id: Number(anggota.id),
      userId: anggota.userId !== null ? Number(anggota.userId) : null,
      kelompokId: anggota.kelompokId !== null ? Number(anggota.kelompokId) : null,
      user: anggota.user ? { ...anggota.user, id: Number(anggota.user.id) } : null,
      kelompok: anggota.kelompok ? { ...anggota.kelompok, id: Number(anggota.kelompok.id) } : null,
      iuran: anggota.iuran.map((i) => ({ ...i, id: Number(i.id), anggotaId: i.anggotaId !== null ? Number(i.anggotaId) : null })),
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

    if (body.userPassword || body.userRole || body.userEmail) {
      const anggotaDb = await prisma.anggota.findUnique({ where: { id: BigInt(id) } });
      if (anggotaDb?.userId) {
        const userData: Record<string, unknown> = {};
        if (body.userPassword) {
          userData.password = await bcrypt.hash(body.userPassword, 12);
        }
        if (body.userRole) {
          userData.role = body.userRole;
        }
        if (body.userEmail) {
          userData.email = body.userEmail;
        }
        await prisma.user.update({ where: { id: anggotaDb.userId }, data: userData });
      }
    }

    const anggota = await prisma.anggota.update({
      where: { id: BigInt(id) },
      data: {
        namaLengkap: body.namaLengkap,
        nik: body.nik,
        noHp: body.noHp,
        tempatLahir: body.tempatLahir,
        tanggalLahir: body.tanggalLahir ? new Date(body.tanggalLahir) : null,
        jenisKelamin: body.jenisKelamin,
        alamat: body.alamat,
        pendidikan: body.pendidikan,
        pekerjaan: body.pekerjaan,
        desil: body.desil ? Number(body.desil) : null,
        status: body.status,
        tahunGabung: body.tahunGabung ? Number(body.tahunGabung) : null,
        kelompokId: body.kelompokId ? Number(body.kelompokId) : null,
      },
    });
    return NextResponse.json({
      ...anggota,
      id: Number(anggota.id),
      userId: anggota.userId !== null ? Number(anggota.userId) : null,
      kelompokId: anggota.kelompokId !== null ? Number(anggota.kelompokId) : null,
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
    await prisma.anggota.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
