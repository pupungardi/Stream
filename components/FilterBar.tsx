'use client';

import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

interface FilterBarProps {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  qualityFilter: string;
  onSelectQuality: (q: string) => void;
  sortBy: string;
  onSelectSort: (s: string) => void;
  minRating: number;
  onSelectMinRating: (r: number) => void;
  totalResults: number;
}

export function FilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  qualityFilter,
  onSelectQuality,
  sortBy,
  onSelectSort,
  minRating,
  onSelectMinRating,
  totalResults,
}: FilterBarProps) {
  return (
    <div className="w-full space-y-4 py-4 border-b border-white/10">
      {/* Category Segmented Controls (Interactive Filter Buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Results Counter (Unboxed text metadata) */}
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-zinc-200 font-semibold tabular-nums">{totalResults}</span>
          <span>titles available</span>
          <span aria-hidden="true">·</span>
          <span>LK21 Live Feed</span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quality Filter */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
            {['ALL', 'HD', 'CAM'].map((q) => (
              <button
                key={q}
                onClick={() => onSelectQuality(q)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  qualityFilter === q
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Min Rating Filter */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
            {[
              { val: 0, label: 'Any Rating' },
              { val: 7, label: '7.0+ ★' },
              { val: 7.5, label: '7.5+ ★' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => onSelectMinRating(item.val)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  minRating === item.val
                    ? 'bg-white/15 text-amber-400 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-zinc-300">
            <ArrowUpDown className="h-3 w-3 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured" className="bg-zinc-900 text-white">Default Catalog</option>
              <option value="rating-desc" className="bg-zinc-900 text-white">Highest Rated</option>
              <option value="year-desc" className="bg-zinc-900 text-white">Newest Release</option>
              <option value="title-asc" className="bg-zinc-900 text-white">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
