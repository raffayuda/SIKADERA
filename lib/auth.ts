import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "sikadera_session";

export type SessionUser = {
  id: bigint;
  email: string;
  role: string;
};

async function encrypt(payload: SessionUser): Promise<string> {
  const data = { ...payload, id: payload.id.toString() };
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

async function decrypt(token: string): Promise<SessionUser | null> {
  try {
    const data = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    return { ...data, id: BigInt(data.id) };
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser) {
  const cookieStore = await cookies();
  const token = await encrypt(user);
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decrypt(token);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(...roles: string[]) {
  const session = await requireAuth();
  if (!roles.includes(session.role)) redirect("/admin/dashboard");
  return session;
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  return { id: user.id, email: user.email, role: user.role };
}
