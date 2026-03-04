"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Download, Star, Shield, Calendar, Tag, ExternalLink,
  ArrowLeft, Github, FileCode, HardDrive, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Plugin } from "@/types";

export default function PluginDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStarred, setUserStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPlugin() {
      setLoading(true);
      const { data, error } = await supabase
        .from("plugins")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        // Demo fallback
        setPlugin({
          id: "demo-1",
          name: slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
          slug,
          description: "A powerful HackBot plugin for advanced cybersecurity operations.",
          long_description: `## Overview\n\nThis plugin extends HackBot with advanced capabilities for security testing.\n\n## Features\n\n- Automated scanning and reconnaissance\n- Integration with multiple security tools\n- Real-time reporting and alerts\n- Configurable output formats\n\n## Installation\n\n\`\`\`bash\nhackbot plugin install ${slug}\n\`\`\`\n\n## Usage\n\n\`\`\`bash\nhackbot ${slug} target.com\n\`\`\``,
          version: "1.0.0",
          category: "scanner",
          author_id: "demo",
          author_username: "hackbot-community",
          author_avatar_url: null,
          download_url: null,
          file_path: null,
          file_size: 45000,
          source_url: "https://github.com/yashab-cyber/hackbot",
          tags: ["security", "scanner", "automation"],
          downloads: 1234,
          stars: 56,
          is_verified: true,
          is_featured: false,
          created_at: "2026-01-15T00:00:00Z",
          updated_at: "2026-03-01T00:00:00Z",
        });
      } else {
        setPlugin(data as Plugin);
      }
      setLoading(false);
    }

    fetchPlugin();
  }, [slug]);

  useEffect(() => {
    if (plugin) setStarCount(plugin.stars);
  }, [plugin]);

  useEffect(() => {
    async function checkStar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !plugin) return;

      const { data } = await supabase
        .from("plugin_stars")
        .select("id")
        .eq("plugin_id", plugin.id)
        .eq("user_id", user.id)
        .single();

      setUserStarred(!!data);
    }
    checkStar();
  }, [plugin]);

  const handleStar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Sign in to star plugins");
      return;
    }
    if (!plugin) return;

    const { data: newCount, error } = await supabase.rpc("toggle_star", {
      p_plugin_id: plugin.id,
      p_user_id: user.id,
    });

    if (!error) {
      setUserStarred(!userStarred);
      setStarCount(newCount ?? starCount);
      toast.success(userStarred ? "Star removed" : "Plugin starred!");
    }
  };

  const handleDownload = async () => {
    if (!plugin) return;

    // Log download
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("plugin_downloads").insert({
      plugin_id: plugin.id,
      user_id: user?.id || null,
    });
    await supabase.rpc("increment_downloads", { plugin_uuid: plugin.id });

    if (plugin.file_path) {
      const { data } = await supabase.storage
        .from("plugins")
        .createSignedUrl(plugin.file_path, 60);
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } else if (plugin.source_url) {
      window.open(plugin.source_url, "_blank");
    }

    toast.success("Download started!");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-5xl mx-auto px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-hb-card rounded w-1/3" />
          <div className="h-4 bg-hb-card rounded w-2/3" />
          <div className="h-64 bg-hb-card rounded-xl" />
        </div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h1 className="text-2xl font-bold text-white">Plugin not found</h1>
        <Link href="/marketplace" className="text-hb-accent mt-4 inline-block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/marketplace" className="hover:text-hb-accent flex items-center gap-1">
            <ArrowLeft size={14} /> Marketplace
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-300">{plugin.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-hb-card border border-hb-border rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-hb-accent/10 border border-hb-accent/20 flex items-center justify-center text-2xl shrink-0">
                  🧩
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{plugin.name}</h1>
                    {plugin.is_verified && (
                      <Shield size={18} className="text-hb-accent" />
                    )}
                  </div>
                  <p className="text-gray-400">{plugin.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {plugin.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Tag size={14} /> v{plugin.version}
                </span>
                <span className="flex items-center gap-1.5">
                  <Download size={14} /> {plugin.downloads.toLocaleString()} downloads
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={14} /> {starCount} stars
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {new Date(plugin.updated_at).toLocaleDateString()}
                </span>
                {plugin.file_size && (
                  <span className="flex items-center gap-1.5">
                    <HardDrive size={14} /> {(plugin.file_size / 1024).toFixed(0)} KB
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {plugin.long_description && (
              <div className="bg-hb-card border border-hb-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">About</h2>
                <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {plugin.long_description}
                </div>
              </div>
            )}

            {/* Install Instructions */}
            <div className="bg-hb-card border border-hb-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Installation</h2>
              <div className="rounded-lg overflow-hidden border border-hb-border">
                <div className="px-4 py-2 bg-[#1a2030] text-xs text-gray-500">
                  Install via HackBot CLI
                </div>
                <pre className="p-4 bg-hb-terminal font-mono text-sm text-hb-accent">
                  hackbot plugin install {plugin.slug}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Actions */}
            <div className="bg-hb-card border border-hb-border rounded-xl p-5 space-y-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-hb-accent text-hb-bg font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all text-sm"
              >
                <Download size={18} /> Download Plugin
              </button>
              <button
                onClick={handleStar}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all border ${
                  userStarred
                    ? "bg-hb-accent/10 text-hb-accent border-hb-accent/30"
                    : "bg-white/5 text-gray-300 border-hb-border hover:border-hb-accent/30"
                }`}
              >
                <Star size={18} fill={userStarred ? "currentColor" : "none"} />
                {userStarred ? "Starred" : "Star"} ({starCount})
              </button>
              {plugin.source_url && (
                <a
                  href={plugin.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-hb-border rounded-xl text-sm text-gray-300 hover:text-white hover:border-hb-border transition-all"
                >
                  <Github size={18} /> View Source
                </a>
              )}
            </div>

            {/* Author */}
            <div className="bg-hb-card border border-hb-border rounded-xl p-5">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Author
              </h3>
              <div className="flex items-center gap-3">
                {plugin.author_avatar_url ? (
                  <Image
                    src={plugin.author_avatar_url}
                    alt={plugin.author_username}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-hb-accent/20 border border-hb-accent/30 flex items-center justify-center text-sm text-hb-accent font-bold">
                    {plugin.author_username[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white text-sm">{plugin.author_username}</p>
                  <Link
                    href={`https://github.com/${plugin.author_username}`}
                    target="_blank"
                    className="text-xs text-gray-500 hover:text-hb-accent"
                  >
                    @{plugin.author_username}
                  </Link>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-hb-card border border-hb-border rounded-xl p-5">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Category
              </h3>
              <Link
                href={`/marketplace?category=${plugin.category}`}
                className="inline-flex items-center gap-2 text-sm text-hb-accent hover:underline"
              >
                <FileCode size={14} /> {plugin.category}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
