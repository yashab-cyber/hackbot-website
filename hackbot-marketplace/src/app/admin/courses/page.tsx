"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Plus, Trash2, Edit, ArrowLeft, Loader2, ShieldCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import { Course } from "@/types";
import toast from "react-hot-toast";

export default function AdminCoursesManager() {
  const router = useRouter();
  const supabase = createClient();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isAdmin(getAdminUsername(user))) {
        router.replace("/");
        return;
      }
      setAuthorized(true);
      fetchCourses();
    }
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (!error && data) {
      setCourses(data);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will delete all associated exams and certificates.`)) {
      return;
    }
    
    setDeletingId(id);
    const { error } = await supabase.from("courses").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete course");
      console.error(error);
    } else {
      toast.success("Course deleted successfully");
      fetchCourses();
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
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Academy Manager</h1>
              <p className="text-sm text-gray-500">Manage Courses and Exams</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses/new"
              className="px-4 py-2 bg-hb-accent text-white hover:bg-hb-accent-hover rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> New Course
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-hb-accent transition-colors"
            >
              <ArrowLeft size={16} /> Back to Admin
            </Link>
          </div>
        </div>

        {/* List of Courses */}
        <div className="bg-hb-card border border-hb-border rounded-xl overflow-hidden shadow-xl">
          {loading ? (
             <div className="p-12 flex justify-center">
               <Loader2 className="w-8 h-8 text-hb-accent animate-spin" />
             </div>
          ) : courses.length === 0 ? (
            <div className="p-16 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Academy Courses</h3>
              <p className="text-gray-500 mb-6">Create your very first educational course for HackBot Academy.</p>
              <Link
                href="/admin/courses/new"
                className="inline-flex px-6 py-3 bg-hb-accent text-white rounded-xl font-medium"
              >
                Create First Course
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-hb-border">
              {courses.map((course) => (
                <div key={course.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 max-w-2xl">{course.description}</p>
                    <div className="text-xs text-gray-500 mt-2">
                       Created: {new Date(course.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/courses/${course.id}/exam`}
                      className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      title="Manage Exam"
                    >
                      <ShieldCheck size={16} /> Manage Exam
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      disabled={deletingId === course.id}
                      className="p-2 text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 rounded-lg transition-colors flex items-center justify-center"
                      title="Delete Course"
                    >
                      {deletingId === course.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
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
