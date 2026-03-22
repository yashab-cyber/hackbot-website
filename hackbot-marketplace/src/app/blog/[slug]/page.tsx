import { createRouteClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createRouteClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("title, content")
    .eq("slug", params.slug)
    .single();

  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} | HackBot Blog`,
    description: blog.content.substring(0, 150).replace(/[#_*\[\]]/g, ''),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = createRouteClient();

  const { data: blog } = await supabase
    .from("blogs")
    .select(`
      *,
      profiles:author_id (username, avatar_url)
    `)
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!blog) {
    notFound();
  }

  // Estimate read time (roughly 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen pt-24 pb-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>
        
        {/* Header */}
        <header className="mb-12 border-b border-hb-border pb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User size={16} className="text-emerald-400" />
              <span className="font-medium text-gray-300">
                {blog.profiles?.username || "Admin"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-400" />
              <span>{new Date(blog.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-400" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <article className="prose-container">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-10 mb-6 text-white" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-10 mb-4 text-white border-b border-hb-border pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-emerald-100" {...props} />,
              p: ({node, ...props}) => <p className="mb-6 text-gray-300 leading-relaxed text-lg" {...props} />,
              a: ({node, ...props}) => <a className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-6 text-gray-300 space-y-2 text-lg" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-6 text-gray-300 space-y-2 text-lg" {...props} />,
              li: ({node, ...props}) => <li className="pl-1" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 my-6 text-gray-400 italic bg-emerald-500/5 rounded-r-lg" {...props} />
              ),
              code: ({node, inline, ...props}: any) => inline 
                ? <code className="bg-black/50 rounded-md px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-300 border border-white/10" {...props} />
                : <code className="block bg-[#0a0e17] p-4 rounded-xl font-mono text-sm text-gray-300 overflow-x-auto my-6 border border-hb-border" {...props} />,
              pre: ({node, ...props}) => <pre className="p-0 m-0 bg-transparent" {...props} />,
              img: ({node, ...props}) => <img className="rounded-xl max-w-full h-auto my-8 border border-hb-border shadow-lg" {...props} />,
              hr: ({node, ...props}) => <hr className="my-10 border-hb-border" {...props} />,
              table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="w-full text-left border-collapse" {...props} /></div>,
              th: ({node, ...props}) => <th className="border-b-2 border-hb-border p-4 text-white font-semibold bg-white/5" {...props} />,
              td: ({node, ...props}) => <td className="border-b border-hb-border p-4 text-gray-300" {...props} />,
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
