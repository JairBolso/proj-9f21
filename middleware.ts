import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { papelPodeAcessar, resolverNavItems } from "@/lib/permissions";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user, supabase } = await updateSession(request);

  const isLoginPage = pathname === "/admin/login";
  const isForbiddenPage = pathname === "/admin/403";

  if (!user) {
    if (isLoginPage) return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (isForbiddenPage) return supabaseResponse;

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("papel, ativo")
    .eq("id", user.id)
    .single();

  if (!usuario || !usuario.ativo) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/403";
    return NextResponse.redirect(url);
  }

  const { data: overrides } = await supabase
    .from("permissoes")
    .select("papel, item_id, permitido");

  const navItems = resolverNavItems(overrides ?? []);
  const permitido = papelPodeAcessar(usuario.papel, pathname, navItems);
  if (!permitido) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/403";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
