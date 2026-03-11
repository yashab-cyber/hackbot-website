import { createRouteClient } from "@/lib/supabase/server";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import { NextResponse, type NextRequest } from "next/server";

// PATCH /api/admin/plugins/[id] — Admin actions on a plugin
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(getAdminUsername(user))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { action } = body;

  const pluginId = params.id;

  switch (action) {
    case "approve": {
      const { error } = await supabase
        .from("plugins")
        .update({ is_approved: true, rejection_reason: null, updated_at: new Date().toISOString() })
        .eq("id", pluginId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, message: "Plugin approved" });
    }

    case "reject": {
      const reason = body.reason || "Does not meet marketplace guidelines";
      const { error } = await supabase
        .from("plugins")
        .update({ is_approved: false, rejection_reason: reason, updated_at: new Date().toISOString() })
        .eq("id", pluginId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, message: "Plugin rejected" });
    }

    case "feature": {
      const { error } = await supabase
        .from("plugins")
        .update({ is_featured: body.featured ?? true, updated_at: new Date().toISOString() })
        .eq("id", pluginId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, message: body.featured ? "Plugin featured" : "Plugin unfeatured" });
    }

    case "verify": {
      const { error } = await supabase
        .from("plugins")
        .update({ is_verified: body.verified ?? true, updated_at: new Date().toISOString() })
        .eq("id", pluginId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, message: body.verified ? "Plugin verified" : "Plugin unverified" });
    }

    case "delete": {
      // Get plugin file_path to clean up storage
      const { data: plugin } = await supabase
        .from("plugins")
        .select("file_path")
        .eq("id", pluginId)
        .single();

      if (plugin?.file_path) {
        await supabase.storage.from("plugins").remove([plugin.file_path]);
      }

      const { error } = await supabase.from("plugins").delete().eq("id", pluginId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, message: "Plugin deleted" });
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
