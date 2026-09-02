import { NextResponse, type NextRequest } from "next/server";

import { TOKEN_COOKIE } from "@/lib/auth-token";

const PUBLIC_PATHS = ["/auth"];

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAuthenticated ? "/dashboard" : "/auth", request.url),
    );
  }

  if (!isAuthenticated && !isPublic) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
