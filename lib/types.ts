export interface FilmItem {
  title: string;
  slug: string;
  url: string;
  poster: string;
  rating: number;
  quality: string;
  runtime: string;
  episode: number;
  season: number;
  year: number;
  isComplete: number;
  // Enriched fields from TMDB / Hurawatch when available
  cleanTitle?: string;
  tmdbPoster?: string;
  backdrop?: string;
  overview?: string;
  genres?: string[];
  streams?: Record<string, string>;
  streamId?: number;
}

export interface SearchApiResponse {
  ok: boolean;
  result: {
    status: boolean;
    page: number;
    totalPages: number;
    results: FilmItem[];
  };
  durationMs?: number;
  sourceUrl?: string;
  error?: string;
}

export interface WatchlistFilm extends FilmItem {
  savedAt: number;
}
