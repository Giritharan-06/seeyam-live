import { cookies } from "next/headers";
import crypto from "crypto";
import { promisify } from "node:util";
import { prisma } from "./db";

const deriveKey = promisify(crypto.scrypt);
export async function counselorPasswordHash(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const key = await deriveKey(password, salt, 64) as Buffer;
  return salt + ":" + key.toString("hex");
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "COUNSELOR";
  version?: string;
}

const SESSION_COOKIE_NAME = "seeyam_admin_session";
const PRIMARY_ADMIN_ID = "usr-admin-1";
const PRIMARY_ADMIN_NAME = "SEEYAM";
export const hasSecureAdminConfiguration = Boolean(
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32 &&
  process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12
);
const SESSION_SECRET = process.env.SESSION_SECRET || "";

// Environment-managed staff accounts.
const DEFAULT_USERS: Array<SessionUser & { passwordHash: string }> = [
  {
    id: PRIMARY_ADMIN_ID,
    email: process.env.ADMIN_EMAIL?.trim() || "admin@seeyam.com",
    name: PRIMARY_ADMIN_NAME,
    role: "ADMIN",
    passwordHash: hashPassword(process.env.ADMIN_PASSWORD || ""),
  },
  {
    id: "usr-counselor-1",
    email: "counselor@seeyam.com",
    name: "Priya Sharma (Senior Counselor)",
    role: "COUNSELOR",
    passwordHash: hashPassword(process.env.COUNSELOR_PASSWORD || ""),
  },
];

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + SESSION_SECRET).digest("hex");
}

export function signToken(payload: SessionUser, maxAgeSeconds: number = 86400 * 7): string {
  if (!hasSecureAdminConfiguration) throw new Error("Staff sign-in is not configured.");
  const expiresAt = Date.now() + maxAgeSeconds * 1000;
  const data = JSON.stringify({ ...payload, exp: expiresAt });
  const base64Data = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(base64Data)
    .digest("base64url");
  return `${base64Data}.${signature}`;
}

export function verifyToken(token: string): SessionUser | null {
  try {
    if (!hasSecureAdminConfiguration) return null;
    const [base64Data, signature] = token.split(".");
    if (!base64Data || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(base64Data)
      .digest("base64url");

    const received = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;

    const jsonString = Buffer.from(base64Data, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonString);

    if (!Number.isFinite(payload.exp) || Date.now() >= payload.exp ||
      !["ADMIN", "COUNSELOR"].includes(payload.role)) {
      return null; // Expired
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      version: payload.version,
    };
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser, rememberMe: boolean = true) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 12; // 30 days or 12 hours
  const token = signToken(user, maxAge);
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    const user = verifyToken(token);
    if (user?.role === "ADMIN" && user.id === PRIMARY_ADMIN_ID) {
      return { ...user, name: PRIMARY_ADMIN_NAME };
    }
    if (user?.role === "COUNSELOR" && user.id !== "usr-counselor-1") {
      const current = await prisma.user.findUnique({ where: { id: user.id } });
      if (!current?.active || current.role !== "COUNSELOR" || current.updatedAt.toISOString() !== user.version) return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  if (!hasSecureAdminConfiguration) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = hashPassword(password);

  const found = DEFAULT_USERS.find(
    (u) => (u.role === "ADMIN" || Boolean(process.env.COUNSELOR_PASSWORD)) &&
      u.email.toLowerCase() === normalizedEmail
  );

  if (found && !crypto.timingSafeEqual(Buffer.from(found.passwordHash), Buffer.from(passwordHash))) return null;

  if (!found) {
    if (!prisma || password.length > 256) return null;
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user?.active || user.role !== "COUNSELOR" || !/^[0-9a-f]{32}:[0-9a-f]{128}$/.test(user.passwordHash)) return null;
    const computed = await counselorPasswordHash(password, user.passwordHash.split(":")[0]);
    if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(user.passwordHash))) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role, version: user.updatedAt.toISOString() };
  }

  return {
    id: found.id,
    email: found.email,
    name: found.name,
    role: found.role,
  };
}
