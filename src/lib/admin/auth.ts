import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const COOKIE_MAX_AGE_MS = COOKIE_MAX_AGE_SECONDS * 1000;

function getPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be set and at least 8 characters long");
  }
  return password;
}

function getSessionSecret(): string {
  // Prefer a dedicated secret. Fall back to a hash derivation of the password
  // so the HMAC key is not the password itself.
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  return crypto.createHash("sha256").update("session::" + getPassword()).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const expected = getPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function signToken(payload: string): string {
  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(payload);
  return payload + "." + hmac.digest("hex");
}

function verifyToken(token: string): boolean {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return false;
  const payload = token.substring(0, dotIndex);
  const expected = signToken(payload);
  if (token.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
    return false;
  }
  const issuedAt = parseInt(payload, 10);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > COOKIE_MAX_AGE_MS) return false;
  return true;
}

export async function createSession(): Promise<void> {
  const timestamp = Date.now().toString();
  const token = signToken(timestamp);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function getSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch {
    return false;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAuth(): Promise<void> {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}
