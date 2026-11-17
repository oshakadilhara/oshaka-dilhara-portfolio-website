import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { applySecurityHeaders } from "@/lib/security/headers";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  return to;
}

function withSecurityHeaders(response: NextResponse) {
  applySecurityHeaders(response.headers);
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = withSecurityHeaders(
    NextResponse.next({
      request,
    })
  );

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  let url: string;
  let key: string;
  try {
    url = getSupabaseUrl();
    key = getSupabasePublishableKey();
  } catch {
    // Fail closed for protected admin routes when auth env is missing.
    if (isAdminRoute && !isLoginRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("error", "auth_unavailable");
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = withSecurityHeaders(
          NextResponse.next({
            request,
          })
        );
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([headerKey, value]) => {
          supabaseResponse.headers.set(headerKey, value);
        });
      },
    },
  });

  // IMPORTANT: keep this call — refreshes and validates the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAllowlistedAdmin = isAdminEmail(user?.email);

  if (isAdminRoute && !isLoginRoute) {
    if (!user || !isAllowlistedAdmin) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      const redirect = NextResponse.redirect(loginUrl);
      return withSecurityHeaders(copyCookies(supabaseResponse, redirect));
    }
  }

  if (isLoginRoute && user && isAllowlistedAdmin) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin/dashboard";
    const redirect = NextResponse.redirect(dashboardUrl);
    return withSecurityHeaders(copyCookies(supabaseResponse, redirect));
  }

  return supabaseResponse;
}
