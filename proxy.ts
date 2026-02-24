// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("better-auth.session_token")?.value;
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
