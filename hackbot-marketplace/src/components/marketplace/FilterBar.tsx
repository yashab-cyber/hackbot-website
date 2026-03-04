"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PLUGIN_CATEGORIES, type PluginCategory } from "@/types";

interface FilterBarProps {
  searchQuery: string;
  category: string;
  sortBy: string;
  onSearchChange: (q: string) => void;
  onCategoryChange: (c: string) => void;
  onSortChange: (s: string) => void;
}

export default function FilterBar({
  searchQuery,
  category,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search + Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-hb-card border border-hb-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-hb-accent/50 focus:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition-all ${
            showFilters
              ? "bg-hb-accent/10 border-hb-accent/30 text-hb-accent"
              : "bg-hb-card border-hb-border text-gray-400 hover:text-white hover:border-hb-border"
          }`}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-hb-card border border-hb-border rounded-xl p-5 space-y-4">
          {/* Category */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={category === ""}
                onClick={() => onCategoryChange("")}
              >
                All
              </FilterChip>
              {PLUGIN_CATEGORIES.map((cat) => (
                <FilterChip
                  key={cat.value}
                  active={category === cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                >
                  {cat.icon} {cat.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              Sort by
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "newest", label: "Newest" },
                { value: "popular", label: "Most Downloaded" },
                { value: "stars", label: "Most Starred" },
                { value: "name", label: "Name A-Z" },
              ].map((opt) => (
                <FilterChip
                  key={opt.value}
                  active={sortBy === opt.value}
                  onClick={() => onSortChange(opt.value)}
                >
                  {opt.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(category || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Active:</span>
          {searchQuery && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-hb-accent/10 border border-hb-accent/20 rounded-full text-xs text-hb-accent">
              &quot;{searchQuery}&quot;
              <button onClick={() => onSearchChange("")}>
                <X size={12} />
              </button>
            </span>
          )}
          {category && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-hb-accent/10 border border-hb-accent/20 rounded-full text-xs text-hb-accent">
              {PLUGIN_CATEGORIES.find((c) => c.value === category)?.label || category}
              <button onClick={() => onCategoryChange("")}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-hb-accent text-hb-bg"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-hb-border"
      }`}
    >
      {children}
    </button>
  );
}
