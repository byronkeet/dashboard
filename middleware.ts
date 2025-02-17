import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	// Allow access to static files in public directory
	if (
		request.nextUrl.pathname.startsWith("/_next") ||
		request.nextUrl.pathname.includes("/amava.svg")
	) {
		return NextResponse.next();
	}

	// Check if user is authenticated
	const isAuthenticated = request.cookies.get("isAuthenticated");
	const isLoginPage = request.nextUrl.pathname === "/login";

	if (!isAuthenticated && !isLoginPage) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (isAuthenticated && isLoginPage) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * 1. /api/ (API routes)
		 * 2. /_next/ (Next.js internals)
		 * 3. /_static (inside /public)
		 * 4. /_vercel (Vercel internals)
		 * 5. /favicon.ico, /sitemap.xml (static files)
		 */
		"/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
	],
};
