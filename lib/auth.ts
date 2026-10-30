import { cookies } from "next/headers";
import crypto from "crypto";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "COUNSELOR";
}

const SESSION_COOKIE_NAME = "seeyam_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "seeyam-technologies-crm-secure-session-key-2025";

// Static credentials for quick development / fallback
const DEFAULT_USERS: Array<SessionUser & { passwordHash: string }> = [
  {
    id: "usr-admin-1",
    email: process.env.ADMIN_EMAIL || "admin@seeyam.com",
    name: "Dr. Arvind Sundaram (Director)",
    role: "ADMIN",
    // SHA256 of "admin123"
    passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "admin123"),
  },
  {
    id: "usr-counselor-1",
    email: "counselor@seeyam.com",
    name: "Priya Sharma (Senior Counselor)",
    role: "COUNSELOR",
    // SHA256 of "counselor123"
    passwordHash: hashPassword("counselor123"),
  },
];

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + SESSION_SECRET).digest("hex");
}

export function signToken(payload: SessionUser, maxAgeSeconds: number = 86400 * 7): string {
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
    const [base64Data, signature] = token.split(".");
    if (!base64Data || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(base64Data)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const jsonString = Buffer.from(base64Data, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonString);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
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
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function authenticateUser(email: string, password: string): SessionUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = hashPassword(password);

  const found = DEFAULT_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.passwordHash === passwordHash
  );

  if (!found) return null;

  return {
    id: found.id,
    email: found.email,
    name: found.name,
    role: found.role,
  };
}
