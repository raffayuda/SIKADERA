import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; kasId: string }> }
) {
  try {
    await requireRole("admin");
    const { kasId } = await params;

    await prisma.kasKelompok.delete({
      where: { id: BigInt(kasId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
