"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ArrowRight, Loader2, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Blog } from "@/types";
import dynamic from "next/dynamic";

const MarketplaceScene = dynamic(() => import("@/components/three/MarketplaceScene"), {
  ssr: false,
});

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
        
      if (!error && data) {
        setBlogs(data);
      }
      setLoading(false);
    }
    
    fetchBlogs();
  }, [supabase]);

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <MarketplaceScene />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            HackBot <span className="text-emerald-400">Blog</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stay up to date with the latest cybersecurity trends, HackBot updates, 
            and deep-dive hacking tutorials.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-hb-card/80 backdrop-blur-xl border border-hb-border rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Posts Yet</h3>
            <p className="text-gray-400">We are busy writing amazing content. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-hb-card/80 backdrop-blur-xl border border-hb-border hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all group flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                    <FileText className="text-emerald-400" size={24} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <div className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
                    {/* Basic plain text extraction for preview */}
                    {blog.content.replace(/[#_*\[\]]/g, '').substring(0, 150)}...
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/blog/${blog.slug}`}
                    className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-emerald-500 text-white rounded-xl transition-colors font-medium text-sm group/btn mt-auto"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
