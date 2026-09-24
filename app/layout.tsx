import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'CineStream - Film Explorer & Streaming Hub',
  description: 'Discover, explore, and stream films, anime, and movies with instant search, quality tags, ratings, and comprehensive movie details.',
  openGraph: {
    title: 'CineStream - Film Explorer & Streaming Hub',
    description: 'Discover, explore, and stream films, anime, and movies with instant search, quality tags, ratings, and comprehensive movie details.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CineStream - Film Explorer & Streaming Hub',
    description: 'Discover, explore, and stream films, anime, and movies with instant search, quality tags, ratings, and comprehensive movie details.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
