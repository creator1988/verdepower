import { NextRequest, NextResponse } from "next/server";
import {
  PANEL_COOKIE_NAME,
  PANEL_SESSION_MAX_AGE,
  safeEqual,
  tokenForPassword,
} from "@/core/auth/panel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const expected = process.env.PANEL_PASSWORD ?? "";

  // Comparamos hashes de longitud fija (en vez de las contraseñas crudas)
  // para que la longitud de la contraseña nunca afecte el tiempo de respuesta.
  if (!expected || !safeEqual(tokenForPassword(password), tokenForPassword(expected))) {
    return NextResponse.json({ error: "contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PANEL_COOKIE_NAME, tokenForPassword(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: PANEL_SESSION_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(PANEL_COOKIE_NAME);
  return res;
}
