import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || '';
  const year = searchParams.get('year') || '';

  if (!title) {
    return NextResponse.json({ ok: false, error: 'Title required' }, { status: 400 });
  }

  // Clean title for search: e.g. "Naruto Shippuden: The Movie (2007)" -> "Naruto Shippuden The Movie"
  const cleanTitle = title
    .replace(/\s*\(Gekijo[^)]+\)/gi, '')
    .replace(/\s*\(\d{4}\)/g, '')
    .replace(/\s*-\s*Series/gi, '')
    .replace(/[:]/g, '')
    .trim();

  try {
    const huraUrl = `https://api.kangwifi.eu.org/anime/hurawatch?query=${encodeURIComponent(cleanTitle)}`;
    const res = await fetch(huraUrl, {
      headers: { accept: '*/*' },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.ok && json.result?.results?.length > 0) {
        // Find best match by year or title if possible
        const results = json.result.results;
        let match = results[0];
        if (year) {
          const yearMatch = results.find((r: any) => String(r.year) === String(year));
          if (yearMatch) match = yearMatch;
        }

        return NextResponse.json({
          ok: true,
          detail: {
            id: match.id,
            title: match.title,
            originalTitle: match.original_title,
            type: match.type,
            year: match.year,
            rating: match.rating,
            genres: match.genres || [],
            overview: match.overview || '',
            posterUrl: match.poster_url || '',
            backdropUrl: match.backdrop_url || '',
            streams: match.streams || {},
          },
        });
      }
    }

    return NextResponse.json({
      ok: false,
      message: 'No exact TMDB/Hurawatch match found',
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error?.message || 'Failed to fetch detail',
    });
  }
}
