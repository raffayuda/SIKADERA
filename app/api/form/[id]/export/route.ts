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
        response: {
          include: { jawaban: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!form) return NextResponse.json({ error: "Form tidak ditemukan" }, { status: 404 });

    // Build CSV
    const headers = ["No", "Nama", "Email", "Tanggal", ...form.pertanyaan.map((p) => p.pertanyaan)];
    const rows = form.response.map((r, i) => [
      String(i + 1),
      r.respondenNama || "",
      r.respondenEmail || "",
      r.createdAt.toISOString().split("T")[0],
      ...form.pertanyaan.map((p) => {
        const jawaban = r.jawaban.find((j) => j.pertanyaanId === p.id);
        return jawaban?.jawaban || "";
      }),
    ]);

    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${form.judul}.csv"`,
      },
    });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
