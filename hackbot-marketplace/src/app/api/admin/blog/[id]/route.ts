import { createRouteClient } from "@/lib/supabase/server";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(getAdminUsername(user))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ blog: data });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(getAdminUsername(user))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const json = await request.json();
    const { title, slug, content, published } = json;

    const { data, error } = await supabase
      .from("blogs")
      .update({ title, slug, content, published, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ blog: data, message: "Blog updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(getAdminUsername(user))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("blogs").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ message: "Blog deleted successfully" });
}
