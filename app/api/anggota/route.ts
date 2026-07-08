import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") || "";
    const kelompokId = searchParams.get("kelompok_id");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { namaLengkap: { contains: search } },
        { nik: { contains: search } },
        { noHp: { contains: search } },
      ];
    }
    if (kelompokId) where.kelompokId = Number(kelompokId);
    if (status) where.status = status;

    const anggota = await prisma.anggota.findMany({
      where,
      include: { user: true, kelompok: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(
      anggota.map((a) => ({
        ...a,
        id: Number(a.id),
        userId: a.userId !== null ? Number(a.userId) : null,
        kelompokId: a.kelompokId !== null ? Number(a.kelompokId) : null,
        user: a.user ? { ...a.user, id: Number(a.user.id) } : null,
        kelompok: a.kelompok ? { ...a.kelompok, id: Number(a.kelompok.id) } : null,
      }))
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    const details = error instanceof Error ? error.stack : "";
    console.error("GET /api/anggota error:", message, details);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const body = await req.json();
    const anggota = await prisma.anggota.create({
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
        status: body.status || "aktif",
        tahunGabung: body.tahunGabung ? Number(body.tahunGabung) : null,
        kelompokId: body.kelompokId ? Number(body.kelompokId) : null,
        userId: body.userId ? Number(body.userId) : null,
      },
    });
    return NextResponse.json({
      ...anggota,
      id: Number(anggota.id),
      userId: anggota.userId !== null ? Number(anggota.userId) : null,
      kelompokId: anggota.kelompokId !== null ? Number(anggota.kelompokId) : null,
    }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/anggota error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
