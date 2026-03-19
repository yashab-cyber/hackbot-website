import { Metadata } from "next";
import { createRouteClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: { courseId: string };
}): Promise<Metadata> {
  const supabase = createRouteClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title, description")
    .eq("id", params.courseId)
    .single();

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: `${course.title} | Academy`,
      description: course.description,
      type: "article",
    },
  };
}

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
