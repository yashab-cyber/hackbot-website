"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Upload, Package, Download, Star, User, Settings,
  ExternalLink, Trash2, Edit, BarChart3, LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Plugin } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [stats, setStats] = useState({ totalDownloads: 0, totalStars: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/");
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from("plugins")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      const userPlugins = (data || []) as Plugin[];
      setPlugins(userPlugins);

      setStats({
        totalDownloads: userPlugins.reduce((s, p) => s + p.downloads, 0),
        totalStars: userPlugins.reduce((s, p) => s + p.stars, 0),
      });

      setLoading(false);
    }
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (plugin: Plugin) => {
    if (!confirm(`Delete "${plugin.name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/plugins/${plugin.slug}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to delete plugin");
      } else {
        setPlugins(plugins.filter((p) => p.id !== plugin.id));
        toast.success("Plugin deleted");
      }
    } catch {
      toast.error("Failed to delete plugin");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-6xl mx-auto px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-hb-card rounded-xl" />
          <div className="h-48 bg-hb-card rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const username = user.user_metadata?.user_name || user.email?.split("@")[0];
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="bg-hb-card border border-hb-border rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={username}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-hb-border"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-hb-accent/20 border-2 border-hb-accent/30 flex items-center justify-center text-xl text-hb-accent font-bold">
                  {username?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{username}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/plugins/upload"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-hb-accent text-hb-bg font-semibold rounded-lg text-sm hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all"
              >
                <Upload size={16} /> Upload Plugin
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-hb-border rounded-lg text-sm text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Package} label="Plugins" value={plugins.length} />
          <StatCard icon={Download} label="Total Downloads" value={stats.totalDownloads} />
          <StatCard icon={Star} label="Total Stars" value={stats.totalStars} />
        </div>

        {/* Plugins */}
        <div className="bg-hb-card border border-hb-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-hb-border flex items-center justify-between">
            <h2 className="font-bold text-white">My Plugins</h2>
            <span className="text-xs text-gray-500">
              {plugins.length} plugin{plugins.length !== 1 ? "s" : ""}
            </span>
          </div>

          {plugins.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-400 mb-2">No plugins yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Share your HackBot plugins with the community.
              </p>
              <Link
                href="/plugins/upload"
                className="inline-flex items-center gap-2 px-5 py-2 bg-hb-accent text-hb-bg font-semibold rounded-lg text-sm"
              >
                <Upload size={16} /> Upload Your First Plugin
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-hb-border/50">
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-hb-accent/10 border border-hb-accent/20 flex items-center justify-center text-lg shrink-0">
                      🧩
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/plugins/${plugin.slug}`}
                        className="font-medium text-white hover:text-hb-accent transition-colors text-sm truncate block"
                      >
                        {plugin.name}
                      </Link>
                      <p className="text-xs text-gray-500 truncate">
                        v{plugin.version} &middot; {plugin.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500 pl-13 sm:pl-0">
                    <span className="flex items-center gap-1">
                      <Download size={14} /> {plugin.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} /> {plugin.stars}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/plugins/${plugin.slug}`}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        title="View"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(plugin)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-hb-card border border-hb-border rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-hb-accent/10 border border-hb-accent/20 flex items-center justify-center">
          <Icon size={18} className="text-hb-accent" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
