import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole("admin", "pembimbing");
    const jenis = await prisma.jenisIuran.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(jenis.map((j) => ({ ...j, id: Number(j.id) })));
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin");
    const body = await req.json();
    const jenis = await prisma.jenisIuran.create({
      data: { namaIuran: body.namaIuran, nominal: Number(body.nominal) },
    });
    return NextResponse.json({ ...jenis, id: Number(jenis.id) }, { status: 201 });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireRole("admin");
    const body = await req.json();
    const jenis = await prisma.jenisIuran.update({
      where: { id: BigInt(body.id) },
      data: { namaIuran: body.namaIuran, nominal: Number(body.nominal), status: body.status },
    });
    return NextResponse.json({ ...jenis, id: Number(jenis.id) });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
