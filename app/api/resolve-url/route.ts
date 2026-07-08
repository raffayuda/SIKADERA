import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "manual" });
    const location = res.headers.get("location");
    if (location) {
      return NextResponse.json({ resolved: location });
    }
    return NextResponse.json({ resolved: url });
  } catch {
    return NextResponse.json({ resolved: url });
  }
}
