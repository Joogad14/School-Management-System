import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // 🟢 Allow public routes
  const publicRoutes = ["/"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🟢 Protected routes
  const protectedRoutes = ["/admin", "/student", "/teacher", "/parent"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔴 DEBUG (remove later)
  console.log("🔐 MIDDLEWARE PATH:", pathname);
  console.log("🍪 TOKEN FOUND:", !!token);

  if (isProtected && !token) {
    const loginUrl = new URL("/", request.url);

    // optional message
    loginUrl.searchParams.set("auth", "required");

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/teacher/:path*", "/parent/:path*"],
};