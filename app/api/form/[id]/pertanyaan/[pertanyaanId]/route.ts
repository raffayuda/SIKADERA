import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pertanyaanId: string }> }
) {
  try {
    await requireRole("admin");
    const { pertanyaanId } = await params;
    const body = await req.json();
    const p = await prisma.pertanyaanForm.update({
      where: { id: BigInt(pertanyaanId) },
      data: {
        tipe: body.tipe,
        pertanyaan: body.pertanyaan,
        isWajib: body.isWajib ?? true,
        urutan: body.urutan,
        opsi: body.opsi || null,
        validasi: body.validasi || null,
        fileMaxSize: body.fileMaxSize || null,
        fileFormat: body.fileFormat || null,
        scaleMin: body.scaleMin !== undefined ? body.scaleMin : null,
        scaleMax: body.scaleMax !== undefined ? body.scaleMax : null,
        scaleLabelMin: body.scaleLabelMin || null,
        scaleLabelMax: body.scaleLabelMax || null,
      },
    });
    return NextResponse.json({ ...p, id: Number(p.id), formId: Number(p.formId) });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; pertanyaanId: string }> }
) {
  try {
    await requireRole("admin");
    const { pertanyaanId } = await params;
    await prisma.pertanyaanForm.delete({ where: { id: BigInt(pertanyaanId) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
