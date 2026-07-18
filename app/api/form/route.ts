import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("admin", "pembimbing");
    const forms = await prisma.form.findMany({
      include: { _count: { select: { response: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      forms.map((f) => ({
        ...f,
        id: Number(f.id),
        createdBy: f.createdBy ? Number(f.createdBy) : null,
        jumlahResponse: f._count.response,
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
    const form = await prisma.form.create({
      data: {
        judul: body.judul,
        deskripsi: body.deskripsi || null,
        status: body.status || "aktif",
        warnaAksen: body.warnaAksen || "#10b981",
        headerGambar: body.headerGambar || null,
        limitSatuResponse: body.limitSatuResponse || false,
        allowEdit: body.allowEdit || false,
      },
    });
    return NextResponse.json({ ...form, id: Number(form.id) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
