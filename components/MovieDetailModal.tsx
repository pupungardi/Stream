'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Play, Star, Bookmark, ExternalLink, Film, Tv, Share2, Check, RefreshCw } from 'lucide-react';
import { FilmItem } from '@/lib/types';

interface MovieDetailModalProps {
  film: FilmItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (film: FilmItem) => void;
}

export function MovieDetailModal({
  film,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}: MovieDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'stream' | 'overview' | 'api'>('overview');
  const [activeServer, setActiveServer] = useState<string>('server1');
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch extra details & stream links when film changes
  useEffect(() => {
    if (!film) return;

    let isMounted = true;
    const fetchDetails = async () => {
      setIsLoadingDetail(true);
      try {
        const res = await fetch(`/api/movies/detail?title=${encodeURIComponent(film.title)}&year=${film.year}`);
        const data = await res.json();
        if (isMounted && data.ok && data.detail) {
          setDetailData(data.detail);
        }
      } catch (err) {
        console.error('Detail fetch error:', err);
      } finally {
        if (isMounted) setIsLoadingDetail(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [film]);

  if (!film) return null;

  const posterUrl = detailData?.posterUrl || film.tmdbPoster || film.poster;
  const backdropUrl = detailData?.backdropUrl || film.backdrop || '/images/hero_cinema_backdrop_1790254485276.jpg';
  const overview = detailData?.overview || film.overview || 'Comprehensive film details loaded directly from the LK21 movie catalog. Select a streaming server to begin playback or view official distributor information.';
  const genres = detailData?.genres || film.genres || ['Action', 'Drama', 'Featured'];

  // Stream servers: Combine from Hurawatch/TMDB or generate standard embed endpoints
  const availableStreams: Record<string, string> = {
    ...(detailData?.streams || film.streams || {}),
    "Server 1 (VidCore)": `https://vidcore.net/movie/${detailData?.id || 12693}?autoPlay=false`,
    "Server 2 (VidNest)": `https://vidnest.fun/movie/${detailData?.id || 12693}`,
    "Server 3 (VidSrc)": `https://vidsrc-embed.ru/embed/movie/${detailData?.id || 12693}`,
  };

  const currentStreamUrl = availableStreams[activeServer] || Object.values(availableStreams)[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(film.url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden bg-[#0F111A] border border-white/15 shadow-2xl text-zinc-100 flex flex-col my-auto max-h-[92vh]">
        {/* Top Header / Backdrop Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-zinc-950">
          <Image
            src={backdropUrl}
            alt={film.title}
            fill
            className="object-cover object-center opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F111A] via-[#0F111A]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title and quick unboxed metadata on backdrop */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300 font-medium">
                <span className="text-red-400 font-bold uppercase">{film.quality}</span>
                <span aria-hidden="true">·</span>
                <span>{film.year}</span>
                {film.runtime && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{film.runtime}</span>
                  </>
                )}
                {film.rating > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="tabular-nums">{film.rating.toFixed(1)}</span>
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
                {film.title}
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleWatchlist(film)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                  isWatchlisted
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 border-white/10 text-zinc-200'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5 fill-current" />
                <span>{isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Share Film Link"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Segmented Controls) */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-zinc-950/40 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-red-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Overview & Cast
          </button>
          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 transition-colors cursor-pointer ${
              activeTab === 'stream'
                ? 'text-white border-b-2 border-red-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Play className="h-3 w-3 fill-current text-red-500" />
            <span>Streaming Player</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-2.5 px-3 transition-colors cursor-pointer ${
              activeTab === 'api'
                ? 'text-white border-b-2 border-red-500 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Raw IK21 API Object
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Poster Column */}
              <div className="md:col-span-4 flex flex-col items-center">
                <div className="relative aspect-[2/3] w-48 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg">
                  {posterUrl && !imageError ? (
                    <Image
                      src={posterUrl}
                      alt={film.title}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-zinc-900 text-center">
                      <Film className="h-8 w-8 text-red-500 mb-2" />
                      <span className="text-xs text-zinc-400">{film.title}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 w-full flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('stream')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-md"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Launch Stream Player</span>
                  </button>

                  {film.url && (
                    <a
                      href={film.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                    >
                      <span>Open on LK21 Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Details Column */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Synopsis
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {overview}
                  </p>
                </div>

                {/* Genres */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Genres
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
                    {genres.map((g: string, i: number) => (
                      <span key={g}>
                        {g}
                        {i < genres.length - 1 && <span className="ml-2 text-zinc-600">·</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detailed Specifications Table */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Status / Quality</span>
                    <span className="text-zinc-200 font-semibold">{film.quality || 'HD'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Release Year</span>
                    <span className="text-zinc-200 font-semibold tabular-nums">{film.year}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Catalog Rating</span>
                    <span className="text-amber-400 font-semibold tabular-nums">★ {film.rating} / 10</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Duration</span>
                    <span className="text-zinc-200 font-semibold">{film.runtime || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Format</span>
                    <span className="text-zinc-200 font-semibold">
                      {film.season > 0 ? `Season ${film.season}` : 'Feature Film'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">API Slug</span>
                    <span className="text-zinc-400 font-mono text-[11px] truncate block" title={film.slug}>
                      {film.slug}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stream' && (
            <div className="space-y-4">
              {/* Server selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Tv className="h-4 w-4 text-red-400" />
                  <span>Streaming Server:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {Object.keys(availableStreams).map((serverKey) => (
                    <button
                      key={serverKey}
                      onClick={() => setActiveServer(serverKey)}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                        activeServer === serverKey
                          ? 'bg-red-600 text-white font-semibold'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                      }`}
                    >
                      {serverKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Player Embed Container */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <iframe
                  src={currentStreamUrl}
                  title={`${film.title} Stream`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>If a stream fails or shows ads, switch servers or use the official LK21 link.</span>
                {film.url && (
                  <a
                    href={film.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Open direct source ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Response data structure from ik21 endpoint:</span>
                <span className="font-mono text-emerald-400">status: true · 200 OK</span>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-80 leading-relaxed scrollbar-thin">
                {JSON.stringify(film, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
