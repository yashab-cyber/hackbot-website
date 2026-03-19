"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Shield, Package, Download, Users, CheckCircle, XCircle,
  Star, Eye, Trash2, Clock, AlertTriangle, BarChart3,
  ChevronDown, ExternalLink, Loader2, ArrowLeft, BookOpen, Award
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isAdmin, getAdminUsername } from "@/lib/admin";
import { PLUGIN_CATEGORIES } from "@/types";
import type { Plugin } from "@/types";
import toast from "react-hot-toast";

interface Stats {
  totalPlugins: number;
  pendingPlugins: number;
  approvedPlugins: number;
  rejectedPlugins: number;
  totalUsers: number;
  totalDownloads: number;
  totalCourses: number;
  totalCertificates: number;
}

type TabFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [tab, setTab] = useState<TabFilter>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

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

  useEffect(() => {
    if (!authorized) return;
    fetchStats();
    fetchPlugins(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized, tab]);

  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
  }

  async function fetchPlugins(status: TabFilter) {
    const url = status === "all" ? "/api/admin/plugins" : `/api/admin/plugins?status=${status}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setPlugins(data.plugins || []);
    }
  }

  async function handleAction(pluginId: string, action: string, extra?: Record<string, any>) {
    setActionLoading(pluginId);
    try {
      const res = await fetch(`/api/admin/plugins/${pluginId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchPlugins(tab);
        fetchStats();
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setActionLoading(null);
  }

  function handleReject() {
    if (!rejectModal) return;
    handleAction(rejectModal.id, "reject", { reason: rejectReason || undefined });
    setRejectModal(null);
    setRejectReason("");
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-hb-accent animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  const categoryIcon = (cat: string) =>
    PLUGIN_CATEGORIES.find((c) => c.value === cat)?.icon || "🧩";

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage the HackBot Plugin Marketplace</p>
            </div>
          </div>
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-hb-accent transition-colors"
          >
            <ArrowLeft size={16} /> Back to Marketplace
          </Link>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses} color="text-indigo-400" bg="bg-indigo-400/10 border-indigo-400/20" />
            <StatCard icon={Award} label="Certificates" value={stats.totalCertificates} color="text-pink-400" bg="bg-pink-400/10 border-pink-400/20" />
            <StatCard icon={Package} label="Total Plugins" value={stats.totalPlugins} color="text-blue-400" bg="bg-blue-400/10 border-blue-400/20" />
            <StatCard icon={Clock} label="Pending" value={stats.pendingPlugins} color="text-amber-400" bg="bg-amber-400/10 border-amber-400/20" />
            <StatCard icon={CheckCircle} label="Approved" value={stats.approvedPlugins} color="text-green-400" bg="bg-green-400/10 border-green-400/20" />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejectedPlugins} color="text-red-400" bg="bg-red-400/10 border-red-400/20" />
            <StatCard icon={Users} label="Users" value={stats.totalUsers} color="text-purple-400" bg="bg-purple-400/10 border-purple-400/20" />
            <StatCard icon={Download} label="Downloads" value={stats.totalDownloads} color="text-cyan-400" bg="bg-cyan-400/10 border-cyan-400/20" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-hb-card border border-hb-border rounded-xl p-1 overflow-x-auto">
          {([
            { key: "pending", label: "Pending Review", icon: Clock, count: stats?.pendingPlugins },
            { key: "approved", label: "Approved", icon: CheckCircle, count: stats?.approvedPlugins },
            { key: "rejected", label: "Rejected", icon: XCircle, count: stats?.rejectedPlugins },
            { key: "all", label: "All Plugins", icon: Package, count: stats?.totalPlugins },
          ] as const).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                tab === key
                  ? "bg-hb-accent text-hb-bg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
              {count !== undefined && count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === key ? "bg-hb-bg/20 text-hb-bg" : "bg-white/10 text-gray-400"
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plugin List */}
        <div className="bg-hb-card border border-hb-border rounded-xl overflow-hidden">
          {plugins.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-400 mb-1">No plugins</h3>
              <p className="text-sm text-gray-500">
                {tab === "pending" ? "No plugins waiting for review." : `No ${tab} plugins found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-hb-border/50">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    {/* Plugin Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-hb-accent/10 border border-hb-accent/20 flex items-center justify-center text-lg sm:text-xl shrink-0">
                      {categoryIcon(plugin.category)}
                    </div>

                    {/* Plugin Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Link
                          href={`/plugins/${plugin.slug}`}
                          className="font-semibold text-white hover:text-hb-accent transition-colors"
                        >
                          {plugin.name}
                        </Link>
                        <span className="text-xs text-gray-500 font-mono">v{plugin.version}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                          {plugin.category}
                        </span>
                        {plugin.is_approved && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-green-400">
                            Approved
                          </span>
                        )}
                        {!plugin.is_approved && !plugin.rejection_reason && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400">
                            Pending
                          </span>
                        )}
                        {plugin.rejection_reason && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/10 border border-red-400/20 text-red-400">
                            Rejected
                          </span>
                        )}
                        {plugin.is_verified && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-hb-accent/10 border border-hb-accent/20 text-hb-accent">
                            ✓ Verified
                          </span>
                        )}
                        {plugin.is_featured && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">{plugin.description}</p>

                      <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {plugin.author_avatar_url ? (
                            <Image src={plugin.author_avatar_url} alt="" width={16} height={16} className="rounded-full" />
                          ) : null}
                          {plugin.author_username}
                        </span>
                        <span className="flex items-center gap-1"><Download size={12} /> {plugin.downloads}</span>
                        <span className="flex items-center gap-1"><Star size={12} /> {plugin.stars}</span>
                        <span>{new Date(plugin.created_at).toLocaleDateString()}</span>
                        {plugin.source_url && (
                          <a
                            href={plugin.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-hb-accent hover:underline"
                          >
                            <ExternalLink size={12} /> Source
                          </a>
                        )}
                      </div>

                      {plugin.rejection_reason && (
                        <div className="mt-2 flex items-start gap-2 text-xs text-red-400 bg-red-400/5 border border-red-400/10 rounded-lg p-2">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                          <span>Rejection reason: {plugin.rejection_reason}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0 self-start sm:self-auto">
                      {actionLoading === plugin.id ? (
                        <Loader2 size={18} className="text-gray-400 animate-spin" />
                      ) : (
                        <>
                          {!plugin.is_approved && (
                            <button
                              onClick={() => handleAction(plugin.id, "approve")}
                              className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {!plugin.rejection_reason && (
                            <button
                              onClick={() => setRejectModal({ id: plugin.id, name: plugin.name })}
                              className="p-2 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleAction(plugin.id, "verify", { verified: !plugin.is_verified })}
                            className={`p-2 rounded-lg transition-colors ${
                              plugin.is_verified ? "text-hb-accent hover:bg-hb-accent/10" : "text-gray-500 hover:bg-white/5"
                            }`}
                            title={plugin.is_verified ? "Remove verification" : "Verify"}
                          >
                            <Shield size={18} />
                          </button>
                          <button
                            onClick={() => handleAction(plugin.id, "feature", { featured: !plugin.is_featured })}
                            className={`p-2 rounded-lg transition-colors ${
                              plugin.is_featured ? "text-purple-400 hover:bg-purple-400/10" : "text-gray-500 hover:bg-white/5"
                            }`}
                            title={plugin.is_featured ? "Remove featured" : "Feature"}
                          >
                            <Star size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${plugin.name}"? This cannot be undone.`)) {
                                handleAction(plugin.id, "delete");
                              }
                            }}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-hb-card border border-hb-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-1">Reject Plugin</h3>
            <p className="text-sm text-gray-400 mb-4">
              Reject <span className="text-white font-medium">&quot;{rejectModal.name}&quot;</span>? Provide a reason for the author.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              className="w-full p-3 bg-hb-bg border border-hb-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-400/50 resize-none"
              rows={3}
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
              >
                Reject Plugin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-hb-card border border-hb-border rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${bg}`}>
          <Icon size={18} className={color} />
        </div>
        <div>
          <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
          <p className="text-[11px] text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
