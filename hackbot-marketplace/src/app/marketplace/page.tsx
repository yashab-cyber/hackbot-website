"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Package } from "lucide-react";
import PluginCard from "@/components/marketplace/PluginCard";
import FilterBar from "@/components/marketplace/FilterBar";
import type { Plugin } from "@/types";

const MarketplaceScene = dynamic(
  () => import("@/components/three/MarketplaceScene"),
  { ssr: false }
);

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    async function fetchPlugins() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (searchQuery) params.set("q", searchQuery);
        if (searchParams.get("featured")) params.set("featured", "true");

        // Map client sort names to API sort names
        const sortMap: Record<string, string> = {
          popular: "downloads",
          newest: "newest",
          stars: "stars",
          name: "name",
        };
        params.set("sort", sortMap[sortBy] || "downloads");
        params.set("limit", "50");

        const res = await fetch(`/api/plugins?${params.toString()}`);
        const result = await res.json();

        if (result.plugins) {
          setPlugins(result.plugins as Plugin[]);
        } else {
          setPlugins([]);
        }
      } catch {
        setPlugins([]);
      }
      setLoading(false);
    }

    fetchPlugins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortBy, searchQuery, searchParams]);

  const filtered = useMemo(() => {
    if (!searchQuery) return plugins;
    const q = searchQuery.toLowerCase();
    return plugins.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.author_username.toLowerCase().includes(q)
    );
  }, [plugins, searchQuery]);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <MarketplaceScene />
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-hb-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-hb-accent/10 border border-hb-accent/25 rounded-full text-xs text-hb-accent font-medium mb-6">
            <Package size={12} /> Community Plugins
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Plugin <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
            Discover, download, and share HackBot plugins built by the security community.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-hb-accent animate-pulse" /> {plugins.length}+ Plugins</span>
            <span className="w-px h-4 bg-hb-border" />
            <span>Open Source</span>
            <span className="w-px h-4 bg-hb-border" />
            <span>Free to Use</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <FilterBar
          searchQuery={searchQuery}
          category={category}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onCategoryChange={setCategory}
          onSortChange={setSortBy}
        />

        <div className="mt-4 text-sm text-gray-500">
          {filtered.length} plugin{filtered.length !== 1 ? "s" : ""} found
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-hb-card border border-hb-border rounded-xl h-52 animate-pulse"
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-hb-border/50" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-hb-border/50 rounded w-2/3" />
                      <div className="h-2 bg-hb-border/30 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-hb-border/30 rounded w-full" />
                    <div className="h-2 bg-hb-border/30 rounded w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-hb-card border border-hb-border flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              No plugins found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 stagger-grid">
            {filtered.map((plugin) => (
              <PluginCard key={plugin.id} plugin={plugin} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading marketplace...</div>
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
