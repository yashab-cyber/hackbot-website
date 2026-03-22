"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText, Plus, Trash2, Edit, ArrowLeft, Loader2, CheckCircle, XCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import { Blog } from "@/types";
import toast from "react-hot-toast";

export default function AdminBlogManager() {
  const router = useRouter();
  const supabase = createClient();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isAdmin(getAdminUsername(user))) {
        router.replace("/");
        return;
      }
      setAuthorized(true);
      fetchBlogs();
    }
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } else {
        toast.error("Failed to delete blog");
      }
    } catch {
      toast.error("An error occurred");
    }
    setDeletingId(null);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Blog Manager</h1>
              <p className="text-sm text-gray-500">Manage your blog posts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog/new"
              className="px-4 py-2 bg-hb-accent text-white hover:bg-hb-accent-hover rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> New Post
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-hb-accent transition-colors"
            >
              <ArrowLeft size={16} /> Back to Admin
            </Link>
          </div>
        </div>

        {/* List of Blogs */}
        <div className="bg-hb-card border border-hb-border rounded-xl overflow-hidden shadow-xl">
          {loading ? (
             <div className="p-12 flex justify-center">
               <Loader2 className="w-8 h-8 text-hb-accent animate-spin" />
             </div>
          ) : blogs.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Blog Posts</h3>
              <p className="text-gray-500 mb-6">Create your very first post.</p>
              <Link
                href="/admin/blog/new"
                className="inline-flex px-6 py-3 bg-hb-accent text-white rounded-xl font-medium"
              >
                Create First Post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-hb-border">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                      {blog.title}
                      {blog.published ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <XCircle size={12} /> Draft
                        </span>
                      )}
                    </h3>
                    <p className="text-sm border border-hb-border/50 text-gray-500 bg-black/20 px-2 py-0.5 rounded inline-block mb-3 font-mono">
                      /{blog.slug}
                    </p>
                    <div className="text-xs text-gray-500">
                       Created: {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/blog/${blog.id}/edit`}
                      className="p-2 text-indigo-400 hover:bg-indigo-400/10 border border-transparent hover:border-indigo-400/20 rounded-lg transition-colors flex items-center justify-center"
                      title="Edit Post"
                    >
                      <Edit size={18} />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(blog.id, blog.title)}
                      disabled={deletingId === blog.id}
                      className="p-2 text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 rounded-lg transition-colors flex items-center justify-center"
                      title="Delete Post"
                    >
                      {deletingId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
