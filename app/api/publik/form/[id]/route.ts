import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await prisma.form.findUnique({
      where: { id: BigInt(id) },
      include: {
        pertanyaan: { orderBy: { urutan: "asc" } },
      },
    });
    if (!form) return NextResponse.json({ error: "Form tidak ditemukan" }, { status: 404 });
    if (form.status === "ditutup") {
      return NextResponse.json({ error: "Form sudah ditutup" }, { status: 403 });
    }
    return NextResponse.json({
      ...form,
      id: Number(form.id),
      limitSatuResponse: form.limitSatuResponse,
      allowEdit: form.allowEdit,
      warnaAksen: form.warnaAksen,
      headerGambar: form.headerGambar,
      pertanyaan: form.pertanyaan.map((p) => ({
        ...p,
        id: Number(p.id),
        formId: Number(p.formId),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
