import { createRouteClient } from "@/lib/supabase/server";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/admin/plugins — List all plugins (including unapproved) for admin
export async function GET(request: NextRequest) {
  const supabase = createRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(getAdminUsername(user))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "pending" | "approved" | "rejected" | null (all)

  let query = supabase
    .from("plugins")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status === "pending") query = query.eq("is_approved", false).is("rejection_reason", null);
  else if (status === "approved") query = query.eq("is_approved", true);
  else if (status === "rejected") query = query.not("rejection_reason", "is", null);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plugins: data, total: count });
}
