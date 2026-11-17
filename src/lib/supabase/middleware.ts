import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/auth/admin";
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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  let url: string;
  let key: string;
  try {
    url = getSupabaseUrl();
    key = getSupabasePublishableKey();
  } catch {
    // Allow public pages to render when Supabase env is not configured yet.
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    }
  );

  // IMPORTANT: keep this call — refreshes and validates the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";
  const isAllowlistedAdmin = isAdminEmail(user?.email);

  if (isAdminRoute && !isLoginRoute) {
    if (!user || !isAllowlistedAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      const redirect = NextResponse.redirect(url);
      return copyCookies(supabaseResponse, redirect);
    }
  }

  if (isLoginRoute && user && isAllowlistedAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    const redirect = NextResponse.redirect(url);
    return copyCookies(supabaseResponse, redirect);
  }

  return supabaseResponse;
}
