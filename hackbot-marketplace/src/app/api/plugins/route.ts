import { createRouteClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createRouteClient();
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") || "downloads";
  const rawLimit = parseInt(searchParams.get("limit") || "50");
  const rawOffset = parseInt(searchParams.get("offset") || "0");
  const search = searchParams.get("q");

  // Validate and clamp pagination params
  const limit = Math.min(Math.max(Number.isNaN(rawLimit) ? 50 : rawLimit, 1), 100);
  const offset = Math.max(Number.isNaN(rawOffset) ? 0 : rawOffset, 0);

  let query = supabase
    .from("plugins")
    .select("*", { count: "exact" })
    .eq("is_approved", true)
    .range(offset, offset + limit - 1);

  // Filters
  if (category) query = query.eq("category", category);
  if (featured === "true") query = query.gt("stars", 0).order("stars", { ascending: false });
  if (search) {
    // Sanitize search input: escape special PostgREST characters
    const sanitized = search.replace(/[%_\\,()."']/g, "");
    if (sanitized) {
      query = query.or(
        `name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`
      );
    }
  }

  // Sort
  switch (sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "stars":
      query = query.order("stars", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("downloads", { ascending: false });
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    plugins: data,
    total: count,
    limit,
    offset,
  });
}
