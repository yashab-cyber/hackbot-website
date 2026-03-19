import { createRouteClient } from "@/lib/supabase/server";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import { NextResponse } from "next/server";

// GET /api/admin/stats — Marketplace statistics
export async function GET() {
  const supabase = createRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(getAdminUsername(user))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    { count: totalPlugins },
    { count: pendingPlugins },
    { count: approvedPlugins },
    { count: totalUsers },
    { count: totalCourses },
    { count: totalCertificates },
  ] = await Promise.all([
    supabase.from("plugins").select("*", { count: "exact", head: true }),
    supabase.from("plugins").select("*", { count: "exact", head: true }).eq("is_approved", false).is("rejection_reason", null),
    supabase.from("plugins").select("*", { count: "exact", head: true }).eq("is_approved", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
  ]);

  // Get total downloads
  const { data: downloadsData } = await supabase
    .from("plugins")
    .select("downloads");
  const totalDownloads = (downloadsData || []).reduce((sum, p) => sum + (p.downloads || 0), 0);

  return NextResponse.json({
    totalPlugins: totalPlugins || 0,
    pendingPlugins: pendingPlugins || 0,
    approvedPlugins: approvedPlugins || 0,
    rejectedPlugins: (totalPlugins || 0) - (pendingPlugins || 0) - (approvedPlugins || 0),
    totalUsers: totalUsers || 0,
    totalDownloads,
    totalCourses: totalCourses || 0,
    totalCertificates: totalCertificates || 0,
  });
}
