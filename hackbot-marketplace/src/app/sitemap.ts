import { MetadataRoute } from "next";
import { createRouteClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hackbot.yashab-cyber.com";
  const supabase = createRouteClient();

  // Fetch dynamic plugins
  const { data: plugins } = await supabase.from("plugins").select("slug, updated_at");
  const pluginUrls = (plugins || []).map((plugin) => ({
    url: `${baseUrl}/plugins/${plugin.slug}`,
    lastModified: new Date(plugin.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Fetch dynamic courses
  const { data: courses } = await supabase.from("courses").select("id, created_at");
  const courseUrls = (courses || []).map((course) => ({
    url: `${baseUrl}/academy/${course.id}`,
    lastModified: new Date(course.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/academy`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...pluginUrls,
    ...courseUrls,
  ];
}
