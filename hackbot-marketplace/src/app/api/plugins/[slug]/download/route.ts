import { createRouteClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// POST /api/plugins/[slug]/download — Track download
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = createRouteClient();

  // Get plugin
  const { data: plugin } = await supabase
    .from("plugins")
    .select("id, file_path, source_url")
    .eq("slug", params.slug)
    .single();

  if (!plugin) {
    return NextResponse.json({ error: "Plugin not found" }, { status: 404 });
  }

  // Get user (optional)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Log download
  await supabase.from("plugin_downloads").insert({
    plugin_id: plugin.id,
    user_id: user?.id || null,
  });

  // Increment counter
  await supabase.rpc("increment_downloads", { plugin_uuid: plugin.id });

  // Return download URL
  let downloadUrl = plugin.source_url;

  if (plugin.file_path) {
    const { data: signedUrl } = await supabase.storage
      .from("plugins")
      .createSignedUrl(plugin.file_path, 300); // 5 min

    if (signedUrl) {
      downloadUrl = signedUrl.signedUrl;
    }
  }

  return NextResponse.json({
    download_url: downloadUrl,
  });
}
