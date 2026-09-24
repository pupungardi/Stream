import { NextRequest, NextResponse } from 'next/server';
import { FilmItem, SearchApiResponse } from '@/lib/types';

// Curated verified Naruto films with 100% working TMDB posters and backdrops
const FALLBACK_NARUTO: FilmItem[] = [
  {
    title: "Naruto Shippuden: The Movie (2007)",
    cleanTitle: "Naruto Shippuden The Movie",
    slug: "naruto-shippuden-the-movie-2007",
    url: "https://tv11.lk21official.cc/naruto-shippuden-the-movie-2007",
    poster: "https://image.tmdb.org/t/p/w500/vDkct38sSFSWJIATlfJw0l3QOIR.jpg",
    rating: 6.7,
    quality: "HD",
    runtime: "01:34",
    episode: 0,
    season: 0,
    year: 2007,
    isComplete: 0,
    overview: "Demons that once almost destroyed the world are revived by someone. To prevent the world from being destroyed, the demon must be sealed away by a priestess named Shion who can foresee Naruto's death.",
    genres: ["Animation", "Action", "Adventure", "Fantasy"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/vDkct38sSFSWJIATlfJw0l3QOIR.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/m9m9W0uX8lC6D5v8M1YkP6bA7Vw.jpg",
    streams: {
      "Server 1 (VidCore)": "https://vidcore.net/movie/12693?autoPlay=false",
      "Server 2 (VidNest)": "https://vidnest.fun/movie/12693",
      "Server 3 (VidSrc)": "https://vidsrc-embed.ru/embed/movie/12693"
    }
  },
  {
    title: "Naruto Shippuden: The Lost Tower (2010)",
    cleanTitle: "Naruto Shippuden The Lost Tower",
    slug: "naruto-shippuuden-lost-tower-2010",
    url: "https://tv11.lk21official.cc/naruto-shippuuden-lost-tower-2010",
    poster: "https://image.tmdb.org/t/p/w500/6e2YvN1tQK4xQHlmy7GJTuXOt2u.jpg",
    rating: 6.9,
    quality: "HD",
    runtime: "01:25",
    episode: 0,
    season: 0,
    year: 2010,
    isComplete: 0,
    overview: "Assigned on a mission to capture Mukade, a rogue ninja, Naruto Uzumaki is sent into the historic ruins of Ouran, where he is caught in a chakra light and sent 20 years into the past, teaming up with the Fourth Hokage Minato.",
    genres: ["Animation", "Action", "Adventure"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/6e2YvN1tQK4xQHlmy7GJTuXOt2u.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/5F0HVEgkgP99fEWDjPyikGt9jQi.jpg"
  },
  {
    title: "Naruto Shippuden: The Movie 3: Inheritors of the Will of Fire (2009)",
    cleanTitle: "Naruto Shippuden The Movie Inheritors of the Will of Fire",
    slug: "naruto-shippuden-movie-3-inheritors-will-fire-2009",
    url: "https://tv11.lk21official.cc/naruto-shippuden-movie-3-inheritors-will-fire-2009",
    poster: "https://image.tmdb.org/t/p/w500/pZzdFmztwmg0FUOVCMa7vReHhQN.jpg",
    rating: 7.0,
    quality: "HD",
    runtime: "01:35",
    episode: 0,
    season: 0,
    year: 2009,
    isComplete: 0,
    overview: "The potential outbreak of a 4th Great Ninja World War looms when ninjas with Kekkei Genkai abilities disappear from Hidden Villages. Kakashi is placed under a puppet jutsu to sacrifice himself.",
    genres: ["Animation", "Action", "Drama"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/pZzdFmztwmg0FUOVCMa7vReHhQN.jpg"
  },
  {
    title: "Naruto Shippuden The Movie: Bonds (2008)",
    cleanTitle: "Naruto Shippuden The Movie Bonds",
    slug: "naruto-shippuden-movie-bonds-2008",
    url: "https://tv11.lk21official.cc/naruto-shippuden-movie-bonds-2008",
    poster: "https://image.tmdb.org/t/p/w500/bBqEiQbbfyt4MWR3NhDZMbS4Wp8.jpg",
    rating: 7.1,
    quality: "HD",
    runtime: "01:33",
    episode: 0,
    season: 0,
    year: 2008,
    isComplete: 0,
    overview: "A mysterious group of ninjas called the Sora-nin from the Sky Country make a surprise attack on Konoha. Naruto and Sasuke must join forces against a common threat.",
    genres: ["Animation", "Action", "Adventure"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/bBqEiQbbfyt4MWR3NhDZMbS4Wp8.jpg"
  },
  {
    title: "Naruto Shippuden The Movie: Blood Prison (2011)",
    cleanTitle: "Naruto Shippuden The Movie Blood Prison",
    slug: "naruto-shippuden-blood-prison-2011",
    url: "https://tv11.lk21official.cc/naruto-shippuden-blood-prison-2011",
    poster: "https://image.tmdb.org/t/p/w500/4WT7zYFpe0fsbg6TitppiHddWAh.jpg",
    rating: 7.2,
    quality: "HD",
    runtime: "01:42",
    episode: 0,
    season: 0,
    year: 2011,
    isComplete: 0,
    overview: "After being falsely accused of attempting to assassinate the Raikage, Naruto is imprisoned in Hozukijo, also known as the Blood Prison.",
    genres: ["Animation", "Action", "Mystery"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/4WT7zYFpe0fsbg6TitppiHddWAh.jpg"
  },
  {
    title: "Road to Ninja: Naruto the Movie (2012)",
    cleanTitle: "Road to Ninja Naruto the Movie",
    slug: "road-ninja-naruto-movie-2012",
    url: "https://tv11.lk21official.cc/road-ninja-naruto-movie-2012",
    poster: "https://image.tmdb.org/t/p/w500/xLal6fXNtiJN6Zw6qk21xAtdOeN.jpg",
    rating: 7.6,
    quality: "HD",
    runtime: "01:49",
    episode: 0,
    season: 0,
    year: 2012,
    isComplete: 0,
    overview: "Naruto and Sakura are transported to an alternate reality by Tobi using the Limited Tsukuyomi, where Naruto's parents are alive and Sasuke never deserted the village.",
    genres: ["Animation", "Action", "Adventure"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/xLal6fXNtiJN6Zw6qk21xAtdOeN.jpg"
  },
  {
    title: "The Last: Naruto the Movie (2014)",
    cleanTitle: "The Last Naruto the Movie",
    slug: "the-last-naruto-the-movie-2014",
    url: "https://tv11.lk21official.cc/the-last-naruto-the-movie-2014",
    poster: "https://image.tmdb.org/t/p/w500/bAQ8O5Uw6FedtlCbJTutenzPVKd.jpg",
    rating: 7.6,
    quality: "HD",
    runtime: "01:54",
    episode: 0,
    season: 0,
    year: 2014,
    isComplete: 0,
    overview: "Two years after the Fourth Shinobi World War, the moon is drawing closer to Earth. Naruto and his comrades must save Hanabi Hyūga and protect the planet.",
    genres: ["Animation", "Romance", "Action"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/bAQ8O5Uw6FedtlCbJTutenzPVKd.jpg"
  },
  {
    title: "Boruto: Naruto the Movie (2015)",
    cleanTitle: "Boruto Naruto the Movie",
    slug: "boruto-naruto-movie-2015",
    url: "https://tv11.lk21official.cc/boruto-naruto-movie-2015",
    poster: "https://image.tmdb.org/t/p/w500/1k6iwC4KaPvTBt1JuaqXy3noZRY.jpg",
    rating: 7.8,
    quality: "HD",
    runtime: "01:40",
    episode: 0,
    season: 0,
    year: 2015,
    isComplete: 0,
    overview: "Boruto is the gifted son of Seventh Hokage Naruto. Frustrated by his busy father, he asks Sasuke to take him as an apprentice before the Chunin exams.",
    genres: ["Animation", "Action", "Comedy"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/1k6iwC4KaPvTBt1JuaqXy3noZRY.jpg"
  },
  {
    title: "Naruto the Movie: Legend of the Stone of Gelel (2005)",
    cleanTitle: "Naruto the Movie Legend of the Stone of Gelel",
    slug: "naruto-the-movie-legend-of-the-stone-of-gelel-2005",
    url: "https://tv11.lk21official.cc/naruto-the-movie-legend-of-the-stone-of-gelel-2005",
    poster: "https://image.tmdb.org/t/p/w500/itKMldwL6uhUZYO3X78NOFU4zzO.jpg",
    rating: 6.8,
    quality: "HD",
    runtime: "01:37",
    episode: 0,
    season: 0,
    year: 2005,
    isComplete: 0,
    overview: "Naruto, Shikamaru, and Sakura are on a mission to return a lost ferret when they are ambushed by an armored knight seeking the ancient mineral Gelel.",
    genres: ["Animation", "Action", "Adventure"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/itKMldwL6uhUZYO3X78NOFU4zzO.jpg"
  },
  {
    title: "Naruto the Movie: Ninja Clash in the Land of Snow (2004)",
    cleanTitle: "Naruto the Movie Ninja Clash in the Land of Snow",
    slug: "naruto-the-movie-ninja-clash-land-snow-2004",
    url: "https://tv11.lk21official.cc/naruto-the-movie-ninja-clash-land-snow-2004",
    poster: "https://image.tmdb.org/t/p/w500/kV27j3Nz4d5z8u6mN3EJw9RiLg2.jpg",
    rating: 6.9,
    quality: "HD",
    runtime: "01:22",
    episode: 0,
    season: 0,
    year: 2004,
    isComplete: 0,
    overview: "Naruto and Team 7 are tasked with protecting actress Yukie Fujikaze during a film shoot in the treacherous Land of Snow.",
    genres: ["Animation", "Action", "Adventure"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/kV27j3Nz4d5z8u6mN3EJw9RiLg2.jpg"
  },
  {
    title: "Naruto the Movie: Guardians of the Crescent Moon Kingdom (2006)",
    cleanTitle: "Naruto the Movie Guardians of the Crescent Moon Kingdom",
    slug: "naruto-the-movie-guardians-crescent-moon-kingdom-2006",
    url: "https://tv11.lk21official.cc/naruto-the-movie-guardians-crescent-moon-kingdom-2006",
    poster: "https://image.tmdb.org/t/p/w500/xppeysfvDKVx775MFuH8Z9BlpMk.jpg",
    rating: 6.6,
    quality: "HD",
    runtime: "01:35",
    episode: 0,
    season: 0,
    year: 2006,
    isComplete: 0,
    overview: "Naruto, Kakashi, Sakura, and Rock Lee are assigned to escort the prince of the Crescent Moon Kingdom and his spoiled son back to their homeland.",
    genres: ["Animation", "Action", "Comedy"],
    tmdbPoster: "https://image.tmdb.org/t/p/w500/xppeysfvDKVx775MFuH8Z9BlpMk.jpg"
  }
];

// Verified high-definition posters map for franchise matches
const TMDB_FRANCHISE_POSTERS: Record<string, { poster: string; backdrop?: string; overview?: string }> = {
  // Naruto
  'naruto-shippuden-the-movie-2007': {
    poster: 'https://image.tmdb.org/t/p/w500/vDkct38sSFSWJIATlfJw0l3QOIR.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/m9m9W0uX8lC6D5v8M1YkP6bA7Vw.jpg',
    overview: "Demons that once almost destroyed the world are revived. Shion, a priestess, must seal the demon with Naruto's protection."
  },
  'naruto-shippuuden-lost-tower-2010': {
    poster: 'https://image.tmdb.org/t/p/w500/6e2YvN1tQK4xQHlmy7GJTuXOt2u.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/5F0HVEgkgP99fEWDjPyikGt9jQi.jpg',
    overview: "Naruto travels 20 years into the past to team up with the Fourth Hokage Minato Namikaze."
  },
  'naruto-shippuden-movie-3-inheritors-will-fire-2009': {
    poster: 'https://image.tmdb.org/t/p/w500/pZzdFmztwmg0FUOVCMa7vReHhQN.jpg',
    overview: "Ninjas with Kekkei Genkai disappear from hidden villages as Kakashi steps forward for a fateful mission."
  },
  'naruto-shippuden-movie-bonds-2008': {
    poster: 'https://image.tmdb.org/t/p/w500/bBqEiQbbfyt4MWR3NhDZMbS4Wp8.jpg',
    overview: "Konoha is attacked by Sky ninjas, forcing Naruto and Sasuke to cooperate in battle."
  },
  'naruto-shippuden-blood-prison-2011': {
    poster: 'https://image.tmdb.org/t/p/w500/4WT7zYFpe0fsbg6TitppiHddWAh.jpg',
    overview: "Naruto is wrongly imprisoned in the notorious Hozuki Castle Blood Prison."
  },
  'road-ninja-naruto-movie-2012': {
    poster: 'https://image.tmdb.org/t/p/w500/xLal6fXNtiJN6Zw6qk21xAtdOeN.jpg',
    overview: "Naruto and Sakura enter an alternate reality where Naruto's parents are alive."
  },
  'the-last-naruto-the-movie-2014': {
    poster: 'https://image.tmdb.org/t/p/w500/bAQ8O5Uw6FedtlCbJTutenzPVKd.jpg',
    overview: "The moon is falling toward Earth; Naruto embarks on a mission that changes his destiny."
  },
  'boruto-naruto-movie-2015': {
    poster: 'https://image.tmdb.org/t/p/w500/1k6iwC4KaPvTBt1JuaqXy3noZRY.jpg',
    overview: "Boruto seeks guidance from Sasuke to surpass his father during the Chunin Exams."
  },
  // Marvel & Popular titles
  'avengers-endgame': {
    poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
  },
  'the-batman': {
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
  },
  'avatar-the-way-of-water': {
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
  },
  'iron-man': {
    poster: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
  }
};

function cleanMovieTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*\(Gekijo[^)]+\)/gi, '')
    .replace(/\s*\(\d{4}\)/g, '')
    .replace(/\s*-\s*Series/gi, '')
    .replace(/[:]/g, '')
    .trim();
}

function matchPosterByItem(item: FilmItem): { poster?: string; backdrop?: string; overview?: string } {
  // Check exact slug
  if (item.slug && TMDB_FRANCHISE_POSTERS[item.slug]) {
    return TMDB_FRANCHISE_POSTERS[item.slug];
  }

  const s = (item.slug || '').toLowerCase();
  const t = (item.title || '').toLowerCase();

  // Naruto matches
  if (s.includes('lost-tower') || t.includes('lost tower')) {
    return TMDB_FRANCHISE_POSTERS['naruto-shippuuden-lost-tower-2010'];
  }
  if (s.includes('inheritors-will-fire') || t.includes('inheritors') || t.includes('will of fire')) {
    return TMDB_FRANCHISE_POSTERS['naruto-shippuden-movie-3-inheritors-will-fire-2009'];
  }
  if (s.includes('bonds') || t.includes('bonds')) {
    return TMDB_FRANCHISE_POSTERS['naruto-shippuden-movie-bonds-2008'];
  }
  if (s.includes('blood-prison') || t.includes('blood prison')) {
    return TMDB_FRANCHISE_POSTERS['naruto-shippuden-blood-prison-2011'];
  }
  if (s.includes('road-ninja') || t.includes('road to ninja')) {
    return TMDB_FRANCHISE_POSTERS['road-ninja-naruto-movie-2012'];
  }
  if (s.includes('the-last') || t.includes('the last')) {
    return TMDB_FRANCHISE_POSTERS['the-last-naruto-the-movie-2014'];
  }
  if (s.includes('boruto') || t.includes('boruto')) {
    return TMDB_FRANCHISE_POSTERS['boruto-naruto-movie-2015'];
  }
  if (s.includes('gelel') || t.includes('gelel')) {
    return { poster: 'https://image.tmdb.org/t/p/w500/itKMldwL6uhUZYO3X78NOFU4zzO.jpg' };
  }
  if (s.includes('snow') || t.includes('snow') || s.includes('yuki-hime')) {
    return { poster: 'https://image.tmdb.org/t/p/w500/kV27j3Nz4d5z8u6mN3EJw9RiLg2.jpg' };
  }
  if (s.includes('crescent-moon') || t.includes('crescent moon')) {
    return { poster: 'https://image.tmdb.org/t/p/w500/xppeysfvDKVx775MFuH8Z9BlpMk.jpg' };
  }
  if (s.includes('naruto-shippuden-the-movie-2007') || (t.includes('naruto shippuden') && t.includes('2007'))) {
    return TMDB_FRANCHISE_POSTERS['naruto-shippuden-the-movie-2007'];
  }

  // Marvel & others
  if (t.includes('endgame')) return TMDB_FRANCHISE_POSTERS['avengers-endgame'];
  if (t.includes('batman')) return TMDB_FRANCHISE_POSTERS['the-batman'];
  if (t.includes('avatar')) return TMDB_FRANCHISE_POSTERS['avatar-the-way-of-water'];
  if (t.includes('iron man')) return TMDB_FRANCHISE_POSTERS['iron-man'];

  return {};
}

// In-memory quick cache to keep responses fast
const cache = new Map<string, { data: SearchApiResponse; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.trim() || 'naruto';
  const cacheKey = query.toLowerCase();

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const startTime = Date.now();
  const targetUrl = `https://api.kangwifi.eu.org/search/ik21?query=${encodeURIComponent(query)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(targetUrl, {
      headers: {
        accept: '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CineStreamApp/1.0',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const durationMs = Date.now() - startTime;

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }

    const json = await res.json();
    let results: FilmItem[] = [];

    if (json.ok && json.result && Array.isArray(json.result.results)) {
      results = json.result.results.map((item: FilmItem) => {
        const clean = cleanMovieTitle(item.title);
        const match = matchPosterByItem(item);
        
        // Clean dead showcdnx / lk21official host so images don't fail
        const rawPoster = item.poster || '';
        const isDeadHost = rawPoster.includes('showcdnx.com') || rawPoster.includes('lk21official.cc');
        const resolvedPoster = match.poster || (!isDeadHost ? rawPoster : undefined);

        return {
          ...item,
          cleanTitle: clean,
          poster: resolvedPoster || rawPoster,
          tmdbPoster: match.poster || item.tmdbPoster,
          backdrop: match.backdrop || item.backdrop,
          overview: match.overview || item.overview,
        };
      });
    }

    // Guarantee all results have their exact TMDB poster attached if matched
    results = results.map((item) => {
      const match = matchPosterByItem(item);
      if (match.poster) {
        return {
          ...item,
          tmdbPoster: match.poster,
          poster: match.poster,
          backdrop: match.backdrop || item.backdrop,
          overview: match.overview || item.overview,
        };
      }
      return item;
    });

    const payload: SearchApiResponse = {
      ok: true,
      result: {
        status: true,
        page: json.result?.page || 1,
        totalPages: json.result?.totalPages || 1,
        results,
      },
      durationMs,
      sourceUrl: targetUrl,
    };

    cache.set(cacheKey, { data: payload, timestamp: Date.now() });
    return NextResponse.json(payload);
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error('Movies API Error:', error);

    const isNaruto = query.toLowerCase().includes('naruto');
    const fallbackResults = isNaruto ? FALLBACK_NARUTO : [];

    return NextResponse.json({
      ok: fallbackResults.length > 0,
      result: {
        status: fallbackResults.length > 0,
        page: 1,
        totalPages: 1,
        results: fallbackResults,
      },
      durationMs,
      sourceUrl: targetUrl,
      error: error?.message || 'Failed to fetch from IK21 endpoint',
    });
  }
}
