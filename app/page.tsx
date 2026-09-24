'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar, NAV_CATEGORIES } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { FilterBar } from '@/components/FilterBar';
import { MovieCard } from '@/components/MovieCard';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { ApiInspectorModal } from '@/components/ApiInspectorModal';
import { WatchlistModal } from '@/components/WatchlistModal';
import { FilmItem, WatchlistFilm } from '@/lib/types';
import { Film, RefreshCw, AlertCircle, Sparkles, Terminal } from 'lucide-react';

const CATEGORY_QUERY_MAP: Record<string, string> = {
  naruto: 'naruto',
  marvel: 'marvel',
  anime: 'anime',
  action: 'action',
  horror: 'horror',
  indonesia: 'indonesia',
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('naruto');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>('naruto');

  const [movies, setMovies] = useState<FilmItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [qualityFilter, setQualityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [minRating, setMinRating] = useState<number>(0);

  // Modals & Drawers
  const [selectedFilm, setSelectedFilm] = useState<FilmItem | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isApiInspectorOpen, setIsApiInspectorOpen] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<WatchlistFilm[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cinestream_watchlist');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse watchlist from localStorage', e);
      }
    }
    return [];
  });

  // Save Watchlist to LocalStorage
  const handleToggleWatchlist = useCallback((film: FilmItem) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.slug === film.slug);
      let updated: WatchlistFilm[];
      if (exists) {
        updated = prev.filter((item) => item.slug !== film.slug);
      } else {
        updated = [{ ...film, savedAt: Date.now() }, ...prev];
      }
      try {
        localStorage.setItem('cinestream_watchlist', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save watchlist', err);
      }
      return updated;
    });
  }, []);

  const handleRemoveFromWatchlist = useCallback((slug: string) => {
    setWatchlist((prev) => {
      const updated = prev.filter((item) => item.slug !== slug);
      try {
        localStorage.setItem('cinestream_watchlist', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update watchlist', err);
      }
      return updated;
    });
  }, []);

  const handleClearWatchlist = useCallback(() => {
    setWatchlist([]);
    try {
      localStorage.removeItem('cinestream_watchlist');
    } catch (err) {
      console.error('Failed to clear watchlist', err);
    }
  }, []);

  // Fetch Movies from API
  const fetchMovies = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/movies?query=${encodeURIComponent(query)}&enrich=true`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();

      if (data.ok && data.result?.results) {
        setMovies(data.result.results);
      } else {
        setMovies([]);
        if (data.error) setError(data.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to the movies database');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on activeSearchTerm change without cascading synchronous setState
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/movies?query=${encodeURIComponent(activeSearchTerm)}&enrich=true`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        if (!ignore) {
          if (data.ok && data.result?.results) {
            setMovies(data.result.results);
          } else {
            setMovies([]);
            if (data.error) setError(data.error);
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || 'Failed to connect to the movies database');
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [activeSearchTerm]);

  // Handle Category click
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
    const query = CATEGORY_QUERY_MAP[categoryId] || categoryId;
    setActiveSearchTerm(query);
  };

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveCategory('');
    setActiveSearchTerm(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveCategory('naruto');
    setActiveSearchTerm('naruto');
  };

  // Computed spotlight film (e.g. highest rated or first in collection)
  const spotlightFilm = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    return (
      [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] ||
      movies[0]
    );
  }, [movies]);

  // Filtered & Sorted Movie List
  const filteredMovies = useMemo(() => {
    let list = [...movies];

    // Filter by quality
    if (qualityFilter !== 'ALL') {
      list = list.filter((m) =>
        (m.quality || '').toUpperCase().includes(qualityFilter)
      );
    }

    // Filter by min rating
    if (minRating > 0) {
      list = list.filter((m) => (m.rating || 0) >= minRating);
    }

    // Sort
    if (sortBy === 'rating-desc') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'year-desc') {
      list.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortBy === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [movies, qualityFilter, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenApiInspector={() => setIsApiInspectorOpen(true)}
      />

      {/* Hero Showcase Section */}
      <HeroBanner
        spotlightFilm={spotlightFilm}
        onPlaySpotlight={(film) => setSelectedFilm(film)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
        isSearching={isLoading}
      />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Interactive Segmented Filter Bar */}
        <FilterBar
          categories={NAV_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          qualityFilter={qualityFilter}
          onSelectQuality={setQualityFilter}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          minRating={minRating}
          onSelectMinRating={setMinRating}
          totalResults={filteredMovies.length}
        />

        {/* Catalog Section Header */}
        <div className="pt-6 pb-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {activeCategory
                ? `${NAV_CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory} Collection`
                : `Search: "${activeSearchTerm}"`}
            </h2>
            <p className="text-xs text-zinc-400">
              Direct streaming catalog powered by the IK21 movie index
            </p>
          </div>

          <button
            onClick={() => fetchMovies(activeSearchTerm)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Catalog Feed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading Skeleton State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pt-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-xl overflow-hidden bg-zinc-900/40 border border-white/5 animate-pulse"
              >
                <div className="aspect-[2/3] bg-zinc-800/50" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-1/2 bg-zinc-800/60 rounded" />
                  <div className="h-4 w-3/4 bg-zinc-800/80 rounded" />
                  <div className="h-3 w-1/3 bg-zinc-800/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && filteredMovies.length === 0 && (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Unable to load films from the index
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => fetchMovies(activeSearchTerm)}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty Filter State */}
        {!isLoading && !error && filteredMovies.length === 0 && (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
              <Film className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No matching titles found</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Try adjusting your rating or quality filters, or search for popular terms like &quot;naruto&quot;, &quot;batman&quot;, &quot;avatar&quot;, or &quot;marvel&quot;.
            </p>
            <button
              onClick={() => {
                setQualityFilter('ALL');
                setMinRating(0);
                setSearchQuery('');
                handleSelectCategory('naruto');
              }}
              className="px-4 py-2 text-xs font-semibold text-zinc-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters to Naruto Collection
            </button>
          </div>
        )}

        {/* Movie Cards Grid */}
        {!isLoading && filteredMovies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pt-2">
            {filteredMovies.map((film) => (
              <MovieCard
                key={film.slug}
                film={film}
                onSelect={(f) => setSelectedFilm(f)}
                isWatchlisted={watchlist.some((w) => w.slug === film.slug)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        )}

        {/* Live API Documentation & Curl Banner */}
        <section className="mt-16 p-6 rounded-2xl bg-zinc-950 border border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Live API Endpoint Integration
              </h3>
            </div>
            <button
              onClick={() => setIsApiInspectorOpen(true)}
              className="text-xs font-semibold text-red-400 hover:text-red-300 self-start sm:self-auto cursor-pointer"
            >
              Open Interactive Inspector →
            </button>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            This application directly queries the remote LK21 index via <code className="text-amber-300 font-mono text-[11px]">https://api.kangwifi.eu.org/search/ik21?query=&#123;query&#125;</code> and parses movie titles, slug keys, verified ratings, runtimes, and qualities.
          </p>
          <div className="p-3 rounded-xl bg-black/80 border border-white/5 font-mono text-[11px] text-zinc-300 overflow-x-auto">
            {`curl -X 'GET' 'https://api.kangwifi.eu.org/search/ik21?query=${activeSearchTerm}' -H 'accept: */*'`}
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      <MovieDetailModal
        film={selectedFilm}
        onClose={() => setSelectedFilm(null)}
        isWatchlisted={
          selectedFilm
            ? watchlist.some((w) => w.slug === selectedFilm.slug)
            : false
        }
        onToggleWatchlist={handleToggleWatchlist}
      />

      <ApiInspectorModal
        isOpen={isApiInspectorOpen}
        onClose={() => setIsApiInspectorOpen(false)}
        currentQuery={activeSearchTerm}
      />

      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onSelectFilm={(film) => setSelectedFilm(film)}
        onRemoveFilm={handleRemoveFromWatchlist}
        onClearWatchlist={handleClearWatchlist}
      />

      {/* Clean Editorial Footer */}
      <footer className="border-t border-white/10 bg-[#07080C] py-8 text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-red-500" />
            <span className="font-bold text-zinc-300">CineStream</span>
            <span aria-hidden="true">·</span>
            <span>IK21 Cinema Index Engine</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => handleSelectCategory('naruto')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Naruto Series
            </button>
            <button
              onClick={() => handleSelectCategory('marvel')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Marvel
            </button>
            <button
              onClick={() => setIsApiInspectorOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              API Docs
            </button>
            <button
              onClick={() => setIsWatchlistOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Saved Watchlist ({watchlist.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
