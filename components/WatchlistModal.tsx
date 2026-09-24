'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, Play, Film, Star } from 'lucide-react';
import { WatchlistFilm, FilmItem } from '@/lib/types';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: WatchlistFilm[];
  onSelectFilm: (film: FilmItem) => void;
  onRemoveFilm: (slug: string) => void;
  onClearWatchlist: () => void;
}

export function WatchlistModal({
  isOpen,
  onClose,
  watchlist,
  onSelectFilm,
  onRemoveFilm,
  onClearWatchlist,
}: WatchlistModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#0F111A] border border-white/15 shadow-2xl text-zinc-100 flex flex-col my-auto max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Saved Watchlist
            </h3>
            <p className="text-xs text-zinc-400">
              {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved for later
            </p>
          </div>
          <div className="flex items-center gap-3">
            {watchlist.length > 0 && (
              <button
                onClick={onClearWatchlist}
                className="text-xs text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3">
          {watchlist.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                <Film className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-zinc-400">Your watchlist is currently empty</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Click the bookmark icon on any movie card or detail view to save titles here.
              </p>
            </div>
          ) : (
            watchlist.map((film) => (
              <div
                key={film.slug}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all gap-4 group"
              >
                <div
                  onClick={() => {
                    onSelectFilm(film);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="relative aspect-[2/3] w-12 rounded-md overflow-hidden bg-zinc-900 shrink-0">
                    {film.poster || film.tmdbPoster ? (
                      <Image
                        src={film.tmdbPoster || film.poster}
                        alt={film.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                        <Film className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                      {film.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>{film.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-red-400 font-semibold">{film.quality}</span>
                      {film.rating > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-current inline" />
                            <span>{film.rating}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectFilm(film);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                    title="Watch Now"
                  >
                    <Play className="h-4 w-4 fill-current" />
                  </button>
                  <button
                    onClick={() => onRemoveFilm(film.slug)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
