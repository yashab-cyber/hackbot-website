"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Course } from "@/types";
import { BookOpen, ArrowLeft, Loader2, PlayCircle, ShieldCheck } from "lucide-react";

export default function CourseViewerPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const courseId = params.courseId as string;

  useEffect(() => {
    async function fetchCourse() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
        
      if (!error && data) {
        setCourse(data);
      }
      setLoading(false);
    }
    
    if (courseId) {
      fetchCourse();
    }
  }, [supabase, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-hb-accent animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 text-center">
        <div className="w-24 h-24 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Course Not Found</h1>
        <p className="text-gray-400 mb-8">The course you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => router.push("/academy")}
          className="px-6 py-3 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-xl font-medium transition-colors"
        >
          Return to Academy
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      {/* Header bar */}
      <div className="border-b border-hb-border bg-hb-bg/50 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link 
            href="/academy"
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-hb-accent font-semibold uppercase tracking-wider">Course</span>
            <h1 className="text-xl font-bold text-white truncate">{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-hb-card border border-hb-border rounded-2xl overflow-hidden p-6 md:p-10 mb-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-lg text-gray-400 bg-white/5 p-4 rounded-xl border border-white/10">
              {course.description}
            </p>
          </div>
          
          <hr className="border-hb-border mb-8" />
          
          <div className="prose prose-invert prose-hb max-w-none text-gray-300">
            {/* Simple content renderer splitting by double newline to render paragraphs */}
            {course.content.split("\\n\\n").map((paragraph, i) => (
              <p key={i} className="mb-4 whitespace-pre-wrap">{paragraph.trim()}</p>
            ))}
          </div>
        </div>

        {/* Action Panel for Exam */}
        <div className="bg-hb-accent/10 border border-hb-accent/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-hb-accent/20 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-hb-accent" size={28} />
              <h3 className="text-2xl font-bold text-white">Ready for the Exam?</h3>
            </div>
            <p className="text-gray-300">
              Test your knowledge and earn your certificate upon passing the exam with a score of 70% or more.
            </p>
          </div>
          
          <Link
            href={`/academy/${course.id}/exam`}
            className="flex shrink-0 items-center gap-2 px-8 py-4 bg-hb-accent hover:bg-hb-accent-hover text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(var(--hb-accent-rgb),0.3)] transition-all transform hover:scale-105 relative z-10"
          >
            <PlayCircle size={22} />
            Start Exam
          </Link>
        </div>
      </div>
    </div>
  );
}
