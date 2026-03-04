import { createRouteClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// GET /api/plugins/[slug] — Fetch a single plugin
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteClient();

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// DELETE /api/plugins/[slug] — Delete a plugin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get plugin to verify ownership
  const { data: plugin } = await supabase
    .from("plugins")
    .select("id, author_id, file_path")
    .eq("slug", params.slug)
    .single();

  if (!plugin) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  if (plugin.author_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete file from storage
  if (plugin.file_path) {
    await supabase.storage.from("plugins").remove([plugin.file_path]);
  }

  // Delete record
  const { error } = await supabase.from("plugins").delete().eq("id", plugin.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
