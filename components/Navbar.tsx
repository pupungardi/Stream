'use client';

import React from 'react';
import { Bookmark, Terminal, Film, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
  onOpenApiInspector: () => void;
}

export const NAV_CATEGORIES = [
  { id: 'naruto', label: 'Naruto Universe' },
  { id: 'marvel', label: 'Marvel & DC' },
  { id: 'anime', label: 'Anime Hits' },
  { id: 'action', label: 'Action' },
  { id: 'horror', label: 'Horror' },
  { id: 'indonesia', label: 'Indonesian' },
];

export function Navbar({
  activeCategory,
  onSelectCategory,
  watchlistCount,
  onOpenWatchlist,
  onOpenApiInspector,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090A0F]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-red-500 shrink-0" />
          <button
            onClick={() => onSelectCategory('naruto')}
            className="text-lg font-black tracking-tight text-white hover:text-red-400 transition-colors cursor-pointer"
          >
            CineStream
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold border-b-2 border-red-500 pb-0.5'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiInspector}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            title="Inspect IK21 API Endpoint"
          >
            <Terminal className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">API Inspector</span>
          </button>

          <button
            onClick={onOpenWatchlist}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-white text-red-700 rounded-sm">
                {watchlistCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
