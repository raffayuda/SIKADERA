import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin");
    const { id } = await params;
    const body = await req.json();

    const count = await prisma.pertanyaanForm.count({ where: { formId: BigInt(id) } });
    const p = await prisma.pertanyaanForm.create({
      data: {
        formId: BigInt(id),
        tipe: body.tipe,
        pertanyaan: body.pertanyaan,
        isWajib: body.isWajib ?? true,
        urutan: body.urutan ?? count,
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
    return NextResponse.json({ ...p, id: Number(p.id), formId: Number(p.formId) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
