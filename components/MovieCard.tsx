'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Star, Bookmark, Film, ExternalLink } from 'lucide-react';
import { FilmItem } from '@/lib/types';

interface MovieCardProps {
  film: FilmItem;
  onSelect: (film: FilmItem) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (film: FilmItem) => void;
}

export function MovieCard({
  film,
  onSelect,
  isWatchlisted,
  onToggleWatchlist,
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Check if poster URL is known to be dead host
  const rawPoster = film.tmdbPoster || film.poster || '';
  const isDeadHost = rawPoster.includes('showcdnx.com') || rawPoster.includes('lk21official.cc');
  const validPoster = !isDeadHost && rawPoster.startsWith('http') ? rawPoster : (film.tmdbPoster || null);

  // Format runtime nicely if "01:34" -> "1h 34m"
  const formattedRuntime = React.useMemo(() => {
    if (!film.runtime) return null;
    const parts = film.runtime.split(':');
    if (parts.length === 2) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
    }
    return film.runtime;
  }, [film.runtime]);

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/60 border border-white/10 hover:border-white/25 transition-all duration-200 hover:shadow-xl hover:shadow-black/60">
      {/* Poster Media Container */}
      <div
        onClick={() => onSelect(film)}
        className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950 cursor-pointer"
      >
        {validPoster && !imageError ? (
          <Image
            src={validPoster}
            alt={film.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Styled Fallback Container when remote poster image is unavailable */
          <div className="absolute inset-0 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-zinc-900 via-[#12141D] to-black text-center border-b border-white/5">
            <div className="w-full flex justify-between items-center text-[11px] text-zinc-400 font-mono">
              <span>{film.year || 'FEATURE'}</span>
              <span className="text-red-400 font-semibold">{film.quality || 'HD'}</span>
            </div>
            <div className="space-y-3 px-1 my-auto">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-950/40 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-950/50">
                <Film className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="text-xs font-bold text-zinc-100 line-clamp-3 leading-snug tracking-tight">
                {film.title}
              </h4>
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest">
                Cinema Premiere
              </div>
            </div>
            <div className="w-full pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
              <span>{formattedRuntime || 'Feature Film'}</span>
              {film.rating > 0 && <span className="text-amber-400 font-semibold">★ {film.rating}</span>}
            </div>
          </div>
        )}

        {/* Measured Scrim & Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* Top Floating Actions: Quality indicator & Watchlist bookmark */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <span className="text-[11px] font-bold text-white tracking-wider px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 uppercase">
            {film.quality || 'HD'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(film);
            }}
            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isWatchlisted
                ? 'bg-red-600 text-white'
                : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950/80 transform group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Content with Zero-Pill Unboxed Metadata */}
      <div className="flex flex-col p-3.5 flex-1 justify-between gap-2">
        <div>
          {/* Metadata line with subtle typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
            <span>{film.year || '2024'}</span>
            {formattedRuntime && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{formattedRuntime}</span>
              </>
            )}
            {film.rating > 0 && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                  <Star className="h-3 w-3 fill-current inline" />
                  <span className="tabular-nums">{film.rating.toFixed(1)}</span>
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(film)}
            className="text-sm font-semibold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug cursor-pointer transition-colors"
            title={film.title}
          >
            {film.title}
          </h3>
        </div>

        {/* Bottom Card Actions: Quick Details + LK21 URL */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <button
            onClick={() => onSelect(film)}
            className="text-zinc-300 hover:text-red-400 font-medium transition-colors cursor-pointer"
          >
            Details & Stream
          </button>
          {film.url && (
            <a
              href={film.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
              title="Open Official Source"
              onClick={(e) => e.stopPropagation()}
            >
              <span>LK21</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
