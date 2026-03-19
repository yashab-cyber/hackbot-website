import { Metadata } from "next";
import { createRouteClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createRouteClient();
  const { data: plugin } = await supabase
    .from("plugins")
    .select("name, description, tags")
    .eq("slug", params.slug)
    .single();

  if (!plugin) {
    return {
      title: "Plugin Not Found",
    };
  }

  return {
    title: plugin.name,
    description: plugin.description,
    keywords: plugin.tags,
    openGraph: {
      title: `${plugin.name} Plugin`,
      description: plugin.description,
      type: "article",
    },
  };
}

export default function PluginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
