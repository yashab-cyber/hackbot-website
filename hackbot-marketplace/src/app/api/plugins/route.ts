import { createRouteClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createRouteClient();
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const sort = searchParams.get("sort") || "downloads";
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const search = searchParams.get("q");

  let query = supabase
    .from("plugins")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

  // Filters
  if (category) query = query.eq("category", category);
  if (featured === "true") query = query.eq("is_featured", true);
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

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
