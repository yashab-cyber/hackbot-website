"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Package } from "lucide-react";
import PluginCard from "@/components/marketplace/PluginCard";
import FilterBar from "@/components/marketplace/FilterBar";
import { createClient } from "@/lib/supabase/client";
import type { Plugin } from "@/types";

const MarketplaceScene = dynamic(
  () => import("@/components/three/MarketplaceScene"),
  { ssr: false }
);

// Demo plugins for when Supabase isn't connected
const DEMO_PLUGINS: Plugin[] = [
  {
    id: "1",
    name: "Nmap Advanced Scanner",
    slug: "nmap-advanced-scanner",
    description: "Enhanced nmap integration with auto-target profiling, custom NSE scripts, and intelligent scan scheduling.",
    long_description: null,
    version: "2.1.0",
    category: "scanner",
    author_id: "demo",
    author_username: "securitypro",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 45000,
    source_url: "https://github.com/example/nmap-advanced",
    tags: ["nmap", "scanning", "recon", "automation"],
    downloads: 2847,
    stars: 156,
    is_verified: true,
    is_featured: true,
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-02-20T00:00:00Z",
  },
  {
    id: "2",
    name: "Subdomain Bruter",
    slug: "subdomain-bruter",
    description: "High-performance subdomain enumeration using multiple engines: DNS brute force, certificate transparency, and web scraping.",
    long_description: null,
    version: "1.5.3",
    category: "recon",
    author_id: "demo",
    author_username: "recon_master",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 32000,
    source_url: "https://github.com/example/subdomain-bruter",
    tags: ["subdomain", "dns", "recon", "enumeration"],
    downloads: 1923,
    stars: 98,
    is_verified: true,
    is_featured: false,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "3",
    name: "SQLi Payload Generator",
    slug: "sqli-payload-generator",
    description: "AI-assisted SQL injection payload generation with support for MySQL, PostgreSQL, MSSQL, and Oracle databases.",
    long_description: null,
    version: "1.0.0",
    category: "exploit",
    author_id: "demo",
    author_username: "exploit_dev",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 28000,
    source_url: "https://github.com/example/sqli-payloads",
    tags: ["sqli", "sql-injection", "exploit", "payload"],
    downloads: 3451,
    stars: 203,
    is_verified: true,
    is_featured: true,
    created_at: "2025-12-10T00:00:00Z",
    updated_at: "2026-02-28T00:00:00Z",
  },
  {
    id: "4",
    name: "OSINT Email Hunter",
    slug: "osint-email-hunter",
    description: "Discover email addresses associated with domains using public data sources, breach databases, and social media APIs.",
    long_description: null,
    version: "1.2.0",
    category: "osint",
    author_id: "demo",
    author_username: "osint_ninja",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 19000,
    source_url: "https://github.com/example/email-hunter",
    tags: ["osint", "email", "harvesting", "recon"],
    downloads: 1567,
    stars: 87,
    is_verified: false,
    is_featured: false,
    created_at: "2026-01-20T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "5",
    name: "PDF Report Pro",
    slug: "pdf-report-pro",
    description: "Professional pentest report generator with customizable templates, executive summary, charts, and compliance mapping.",
    long_description: null,
    version: "3.0.1",
    category: "reporting",
    author_id: "demo",
    author_username: "report_guru",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 67000,
    source_url: "https://github.com/example/pdf-report-pro",
    tags: ["report", "pdf", "pentest", "executive"],
    downloads: 4201,
    stars: 312,
    is_verified: true,
    is_featured: true,
    created_at: "2025-11-05T00:00:00Z",
    updated_at: "2026-03-02T00:00:00Z",
  },
  {
    id: "6",
    name: "Network Mapper 3D",
    slug: "network-mapper-3d",
    description: "Visualize network topology in 3D using WebGL. Supports nmap XML import, live discovery, and subnet clustering.",
    long_description: null,
    version: "1.1.0",
    category: "network",
    author_id: "demo",
    author_username: "netvis",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 82000,
    source_url: "https://github.com/example/network-mapper-3d",
    tags: ["network", "topology", "3d", "visualization"],
    downloads: 982,
    stars: 145,
    is_verified: false,
    is_featured: false,
    created_at: "2026-02-10T00:00:00Z",
    updated_at: "2026-02-28T00:00:00Z",
  },
  {
    id: "7",
    name: "XSS Finder Pro",
    slug: "xss-finder-pro",
    description: "Automated cross-site scripting detection with smart payload mutation, DOM-based analysis, and proof-of-concept generation.",
    long_description: null,
    version: "2.0.0",
    category: "web",
    author_id: "demo",
    author_username: "websec_pro",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 41000,
    source_url: "https://github.com/example/xss-finder",
    tags: ["xss", "web", "vulnerability", "detection"],
    downloads: 2156,
    stars: 178,
    is_verified: true,
    is_featured: false,
    created_at: "2026-01-05T00:00:00Z",
    updated_at: "2026-02-25T00:00:00Z",
  },
  {
    id: "8",
    name: "Hash Cracker Module",
    slug: "hash-cracker-module",
    description: "Integrate hashcat and john with HackBot. Auto-detect hash types, manage wordlists, and report cracked credentials.",
    long_description: null,
    version: "1.3.2",
    category: "crypto",
    author_id: "demo",
    author_username: "crypto_hawk",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 15000,
    source_url: "https://github.com/example/hash-cracker",
    tags: ["hash", "password", "cracking", "crypto"],
    downloads: 1834,
    stars: 91,
    is_verified: false,
    is_featured: false,
    created_at: "2026-01-25T00:00:00Z",
    updated_at: "2026-02-18T00:00:00Z",
  },
  {
    id: "9",
    name: "Memory Forensics Kit",
    slug: "memory-forensics-kit",
    description: "Volatility-based memory analysis plugin for HackBot. Extract processes, network connections, and malware indicators from memory dumps.",
    long_description: null,
    version: "1.0.0",
    category: "forensics",
    author_id: "demo",
    author_username: "forensic_analyst",
    author_avatar_url: null,
    download_url: null,
    file_path: null,
    file_size: 53000,
    source_url: "https://github.com/example/memory-forensics",
    tags: ["forensics", "memory", "volatility", "malware"],
    downloads: 756,
    stars: 62,
    is_verified: true,
    is_featured: false,
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
  },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("popular");
  const supabase = createClient();

  useEffect(() => {
    async function fetchPlugins() {
      setLoading(true);
      try {
        let query = supabase
          .from("plugins")
          .select("*")
          .order(
            sortBy === "newest"
              ? "created_at"
              : sortBy === "stars"
              ? "stars"
              : sortBy === "name"
              ? "name"
              : "downloads",
            { ascending: sortBy === "name" }
          );

        if (category) query = query.eq("category", category);
        if (searchParams.get("featured")) query = query.eq("is_featured", true);

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
          // Use demo data when Supabase isn't configured or returns empty
          setPlugins(DEMO_PLUGINS);
        } else {
          setPlugins(data as Plugin[]);
        }
      } catch {
        // Fallback to demo data
        setPlugins(DEMO_PLUGINS);
      }
      setLoading(false);
    }

    fetchPlugins();
  }, [category, sortBy, searchParams]);

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
