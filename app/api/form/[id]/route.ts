import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const form = await prisma.form.findUnique({
      where: { id: BigInt(id) },
      include: {
        pertanyaan: { orderBy: { urutan: "asc" } },
        _count: { select: { response: true } },
      },
    });
    if (!form) return NextResponse.json({ error: "Form tidak ditemukan" }, { status: 404 });
    return NextResponse.json({
      ...form,
      id: Number(form.id),
      createdBy: form.createdBy ? Number(form.createdBy) : null,
      jumlahResponse: form._count.response,
      _count: undefined,
      pertanyaan: form.pertanyaan.map((p) => ({
        ...p,
        id: Number(p.id),
        formId: Number(p.formId),
      })),
    });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const form = await prisma.form.update({
      where: { id: BigInt(id) },
      data: {
        judul: body.judul,
        deskripsi: body.deskripsi,
        status: body.status,
        warnaAksen: body.warnaAksen,
        headerGambar: body.headerGambar,
        limitSatuResponse: body.limitSatuResponse,
        allowEdit: body.allowEdit,
      },
    });
    return NextResponse.json({ ...form, id: Number(form.id) });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin");
    const { id } = await params;
    await prisma.form.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
