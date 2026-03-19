"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import toast from "react-hot-toast";

export default function NewCoursePage() {
  const router = useRouter();
  const supabase = createClient();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isAdmin(getAdminUsername(user))) {
        router.replace("/");
        return;
      }
      setAuthorized(true);
      setLoading(false);
    }
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !content) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        description,
        content,
        youtube_link: youtubeLink || null
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      console.error(error);
      toast.error("Failed to create course");
    } else {
      toast.success("Course created successfully!");
      router.push("/admin/courses");
    }
  };

  if (loading && !authorized) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-hb-accent animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex shrink-0"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Create New Course
              </h1>
              <p className="text-sm text-gray-500">Draft your curriculum and content</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-hb-card border border-hb-border rounded-xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Intro to Web Security"
                className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief overview of the course (Max 200 characters)"
                rows={2}
                maxLength={250}
                className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube Video Link (Optional)
              </label>
              <input
                type="url"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Course Content (Syllabus/Lesson Materials) <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the full structured content of the course here. Paragraphs are divided by double line breaks."
                rows={12}
                className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white font-mono text-sm outline-none transition-all resize-y"
              />
            </div>

            <div className="pt-4 border-t border-hb-border flex justify-end gap-3">
              <Link
                href="/admin/courses"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-hb-border rounded-xl font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-hb-accent hover:bg-hb-accent-hover disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Publish Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
