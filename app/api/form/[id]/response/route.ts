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
    const responses = await prisma.responseForm.findMany({
      where: { formId: BigInt(id) },
      include: {
        jawaban: { include: { pertanyaan: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      responses.map((r) => ({
        ...r,
        id: Number(r.id),
        formId: Number(r.formId),
        jawaban: r.jawaban.map((j) => ({
          ...j,
          id: Number(j.id),
          responseId: Number(j.responseId),
          pertanyaanId: Number(j.pertanyaanId),
          pertanyaan: { ...j.pertanyaan, id: Number(j.pertanyaan.id), formId: Number(j.pertanyaan.formId) },
        })),
      }))
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const form = await prisma.form.findUnique({
      where: { id: BigInt(id) },
      include: { pertanyaan: true },
    });
    if (!form) return NextResponse.json({ error: "Form tidak ditemukan" }, { status: 404 });
    if (form.status === "ditutup") return NextResponse.json({ error: "Form sudah ditutup" }, { status: 403 });

    // Limit 1 response
    if (form.limitSatuResponse) {
      const existing = await prisma.responseForm.findFirst({
        where: { formId: BigInt(id), uniqueId: body.uniqueId || null },
      });
      if (existing) {
        return NextResponse.json({ error: "Anda sudah mengirim response" }, { status: 403 });
      }
    }

    // Validasi server untuk setiap pertanyaan
    for (const p of form.pertanyaan) {
      const jawaban = body.jawaban?.find((j: { pertanyaanId: number }) => j.pertanyaanId === Number(p.id));

      // Required check
      if (p.isWajib) {
        if (!jawaban || !jawaban.jawaban?.trim()) {
          return NextResponse.json({ error: `"${p.pertanyaan}" wajib diisi` }, { status: 400 });
        }
      }

      if (!jawaban || !jawaban.jawaban?.trim()) continue;

      const val = jawaban.jawaban.trim();

      // Validasi berdasarkan tipe
      if (p.tipe === "teks" && p.validasi) {
        try {
          const rule = JSON.parse(p.validasi);
          if (rule.type === "angka" && isNaN(Number(val))) {
            return NextResponse.json({ error: `"${p.pertanyaan}" harus berupa angka` }, { status: 400 });
          }
          if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            return NextResponse.json({ error: `"${p.pertanyaan}" harus berupa email yang valid` }, { status: 400 });
          }
          if (rule.type === "minLength" && val.length < Number(rule.value)) {
            return NextResponse.json({ error: `"${p.pertanyaan}" minimal ${rule.value} karakter` }, { status: 400 });
          }
          if (rule.type === "maxLength" && val.length > Number(rule.value)) {
            return NextResponse.json({ error: `"${p.pertanyaan}" maksimal ${rule.value} karakter` }, { status: 400 });
          }
        } catch {}
      }

      // Validasi file upload
      if (p.tipe === "file" && p.fileFormat) {
        try {
          const allowed = p.fileFormat.split(",").map((f: string) => f.trim()).filter(Boolean);
          if (allowed.length > 0) {
            const ext = val.split(".").pop()?.toLowerCase();
            if (ext && !allowed.includes(ext)) {
              const extensionMap: Record<string, string[]> = {
                image: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
                document: ["doc", "docx"],
                presentation: ["ppt", "pptx"],
                spreadsheet: ["xls", "xlsx"],
                pdf: ["pdf"],
                video: ["mp4", "webm", "avi"],
                audio: ["mp3", "wav", "ogg"],
              };
              const allExts = allowed.flatMap((f: string) => extensionMap[f] || [f]);
              if (!allExts.includes(ext)) {
                return NextResponse.json({ error: `Format file tidak didukung untuk "${p.pertanyaan}"` }, { status: 400 });
              }
            }
          }
        } catch {}
      }
    }

    const response = await prisma.responseForm.create({
      data: {
        formId: BigInt(id),
        respondenNama: body.respondenNama || null,
        respondenEmail: body.respondenEmail || null,
        uniqueId: body.uniqueId || null,
        jawaban: {
          create: (body.jawaban || []).map((j: { pertanyaanId: number; jawaban: string }) => ({
            pertanyaanId: BigInt(j.pertanyaanId),
            jawaban: j.jawaban || null,
          })),
        },
      },
      include: { jawaban: true },
    });

    return NextResponse.json({
      ...response,
      id: Number(response.id),
      formId: Number(response.formId),
      jawaban: response.jawaban.map((j: { id: bigint; responseId: bigint; pertanyaanId: bigint; jawaban: string | null }) => ({
        ...j,
        id: Number(j.id),
        responseId: Number(j.responseId),
        pertanyaanId: Number(j.pertanyaanId),
      })),
    }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/form/[id]/response error:", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT — Edit response (allowEdit)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const form = await prisma.form.findUnique({ where: { id: BigInt(id) } });
    if (!form) return NextResponse.json({ error: "Form tidak ditemukan" }, { status: 404 });
    if (!form.allowEdit) return NextResponse.json({ error: "Edit tidak diizinkan" }, { status: 403 });

    const existing = await prisma.responseForm.findFirst({
      where: { formId: BigInt(id), uniqueId: body.uniqueId },
    });
    if (!existing) return NextResponse.json({ error: "Response tidak ditemukan" }, { status: 404 });

    // Hapus jawaban lama, buat baru
    await prisma.jawabanResponse.deleteMany({ where: { responseId: existing.id } });
    await prisma.jawabanResponse.createMany({
      data: (body.jawaban || []).map((j: { pertanyaanId: number; jawaban: string }) => ({
        responseId: existing.id,
        pertanyaanId: BigInt(j.pertanyaanId),
        jawaban: j.jawaban || null,
      })),
    });

    const updated = await prisma.responseForm.update({
      where: { id: existing.id },
      data: {
        respondenNama: body.respondenNama || null,
        respondenEmail: body.respondenEmail || null,
      },
      include: { jawaban: true },
    });

    return NextResponse.json({
      ...updated,
      id: Number(updated.id),
      formId: Number(updated.formId),
      jawaban: updated.jawaban.map((j: { id: bigint; responseId: bigint; pertanyaanId: bigint; jawaban: string | null }) => ({
        ...j,
        id: Number(j.id),
        responseId: Number(j.responseId),
        pertanyaanId: Number(j.pertanyaanId),
      })),
    });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
