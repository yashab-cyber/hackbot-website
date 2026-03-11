import Link from "next/link";
import Image from "next/image";
import { Download, Star, Shield, ExternalLink } from "lucide-react";
import type { Plugin } from "@/types";

export default function PluginCard({ plugin }: { plugin: Plugin }) {
  const categoryColors: Record<string, string> = {
    scanner: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    exploit: "text-red-400 bg-red-400/10 border-red-400/20",
    recon: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    reporting: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    osint: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    network: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    web: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    crypto: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    forensics: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    misc: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  };

  const categoryIcons: Record<string, string> = {
    scanner: "🔍",
    exploit: "💥",
    recon: "🌐",
    reporting: "📊",
    osint: "🕵️",
    network: "🗺️",
    web: "🌍",
    crypto: "🔐",
    forensics: "🔬",
    misc: "🧩",
  };

  return (
    <Link
      href={`/plugins/${plugin.slug}`}
      className="group relative block bg-hb-card border border-hb-border rounded-xl overflow-hidden transition-all duration-300 hover:border-hb-accent/30 hover:shadow-[0_0_40px_rgba(0,255,136,0.1)] hover:-translate-y-1.5 card-hover-3d"
    >
      {/* Gradient top accent line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-hb-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-hb-accent/15 to-hb-accent/5 border border-hb-accent/20 flex items-center justify-center text-lg group-hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-shadow duration-300">
              {categoryIcons[plugin.category] || "🧩"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-white group-hover:text-hb-accent transition-colors text-sm leading-tight">
                  {plugin.name}
                </h3>
                {plugin.is_verified && (
                  <Shield size={13} className="text-hb-accent shrink-0" title="Verified" />
                )}
              </div>
              <span className="text-xs text-gray-500 font-mono">v{plugin.version}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">
          {plugin.description}
        </p>

        {/* Tags */}
        {plugin.tags && plugin.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {plugin.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] bg-white/5 border border-white/8 rounded-full text-gray-400 group-hover:border-white/15 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {plugin.tags.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] text-gray-500">
                +{plugin.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-hb-border/50 bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {plugin.author_avatar_url ? (
            <Image
              src={plugin.author_avatar_url}
              alt={plugin.author_username}
              width={20}
              height={20}
              className="rounded-full ring-1 ring-hb-border"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-hb-accent/30 to-hb-accent/10 flex items-center justify-center text-[10px] text-hb-accent font-bold">
              {plugin.author_username[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-500">{plugin.author_username}</span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
              categoryColors[plugin.category] || categoryColors.misc
            }`}
          >
            {plugin.category}
          </span>
          <div className="flex items-center gap-1 text-gray-500 group-hover:text-gray-400 transition-colors">
            <Download size={12} />
            <span className="text-xs font-medium">{formatCount(plugin.downloads)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 group-hover:text-amber-400/70 transition-colors">
            <Star size={12} />
            <span className="text-xs font-medium">{formatCount(plugin.stars)}</span>
          </div>
        </div>
      </div>

      {/* Featured badge */}
      {plugin.is_featured && (
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-hb-accent/20 to-emerald-500/20 border border-hb-accent/30 rounded-lg text-[10px] font-bold text-hb-accent uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,136,0.15)]">
          ★ Featured
        </div>
      )}
    </Link>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}
