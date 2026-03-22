"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import toast from "react-hot-toast";

export default function NewBlogPage() {
  const router = useRouter();
  const supabase = createClient();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

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

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!slug || slug === generateSlug(title)) {
        setSlug(generateSlug(e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, published })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Blog created successfully!");
        router.push("/admin/blog");
      } else {
        toast.error(data.error || "Failed to create blog");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
    setSubmitting(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex shrink-0"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Create New Blog Post
              </h1>
              <p className="text-sm text-gray-500">Write your content in Markdown</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-hb-card border border-hb-border rounded-xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. 10 Tips for Bug Bounty"
                  className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. 10-tips-for-bug-bounty"
                  className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content (Markdown format) <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Post Title\n\nWrite your markdown content here..."
                rows={20}
                className="w-full px-4 py-3 bg-hb-bg border border-hb-border focus:border-hb-accent focus:ring-1 focus:ring-hb-accent rounded-xl text-white font-mono text-sm outline-none transition-all resize-y"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  value="" 
                  className="sr-only peer"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hb-accent"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">Publish immediately?</span>
              </label>
            </div>

            <div className="pt-4 border-t border-hb-border flex justify-end gap-3">
              <Link
                href="/admin/blog"
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
                Save Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
