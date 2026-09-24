'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Info, Search, X, Sparkles } from 'lucide-react';
import { FilmItem } from '@/lib/types';

interface HeroBannerProps {
  spotlightFilm: FilmItem | null;
  onPlaySpotlight: (film: FilmItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

export function HeroBanner({
  spotlightFilm,
  onPlaySpotlight,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
  isSearching,
}: HeroBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-zinc-950 via-[#0B0D13] to-[#090A0F] border-b border-white/10">
      {/* Background visual container with measured contrast scrim */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/images/hero_cinema_backdrop_1790257700207.jpg"
          alt="Cinematic theater backdrop"
          fill
          className="object-cover object-center"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines, unboxed metadata, CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-red-400 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cinema & Anime Streaming Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Explore Thousands of Films, Anime & Box Office Classics
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed">
              Real-time integration with the LK21 movie catalog. Discover HD releases, verified user ratings, comprehensive runtimes, and instant stream servers.
            </p>

            {/* Spotlight Movie Card Info if available */}
            {spotlightFilm && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-xl space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-white font-medium">Spotlight Premiere</span>
                  <span aria-hidden="true">·</span>
                  <span>{spotlightFilm.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-semibold">{spotlightFilm.quality}</span>
                  <span aria-hidden="true">·</span>
                  <span>{spotlightFilm.runtime}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-yellow-400 font-semibold">★ {spotlightFilm.rating}</span>
                </div>
                <h3 className="text-base font-bold text-white line-clamp-1">
                  {spotlightFilm.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {spotlightFilm.overview || "High-stakes shinobi conflict, cinematic combat, and ancient demons threatening the ninja world."}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onPlaySpotlight(spotlightFilm)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-md"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Watch Spotlight Film</span>
                  </button>
                  <button
                    onClick={() => onPlaySpotlight(spotlightFilm)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer border border-white/10"
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>View Specifications</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Search Bar */}
            <form onSubmit={onSearchSubmit} className="max-w-xl pt-2">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search movies (e.g. naruto, avengers, avatar, batman, horror)..."
                  className="w-full h-12 pl-11 pr-24 text-sm bg-black/60 border border-white/15 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={onClearSearch}
                    className="absolute right-20 text-zinc-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Featured visual card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/80 group">
              <Image
                src="/images/featured_spotlight_banner_1790257712127.jpg"
                alt="Spotlight fantasy film illustration"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">
                  Featured Cinematic Artwork
                </div>
                <div className="text-sm font-bold text-white">
                  Shinobi Legends & Martial Arts Chronicles
                </div>
                <div className="text-xs text-zinc-400">
                  Full HD Quality · Multi-server Streaming · LK21 Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
