import { createHash, timingSafeEqual } from "crypto";

export const PANEL_COOKIE_NAME = "vp_panel_session";
export const PANEL_SESSION_MAX_AGE = 60 * 60 * 12; // 12h, covers the event day

export function tokenForPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function isValidPanelToken(token: string | undefined): boolean {
  const password = process.env.PANEL_PASSWORD;
  if (!token || !password) return false;
  return safeEqual(token, tokenForPassword(password));
}
