import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { tmdb, convertTMDBMovie } from '@/lib/tmdb'
import { formatDuration, formatYear } from '@/lib/utils'
import WatchlistButton from '@/components/watchlist-button'
import MovieCard from '@/components/movie-card'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: { id: string }
}

export const revalidate = 3600 // Revalidate every hour

export default async function MovieDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  try {
    const movieId = parseInt(params.id)
    if (isNaN(movieId)) return notFound()

    const [movieDetails, popularMovies] = await Promise.all([
      tmdb.getMovieDetails(movieId),
      tmdb.getPopularMovies(1),
    ])

    const movie = convertTMDBMovie(movieDetails)
    
    // Check if movie is in user's watchlist
    const inWatchlist = session?.user?.id
      ? (await prisma.watchlist.findUnique({
          where: { userId_movieId: { userId: session.user.id, movieId: params.id } },
        })) !== null
      : false

    // Get related movies (same genre or popular movies as fallback)
    const related = popularMovies.results
      .filter(m => m.id !== movieId)
      .slice(0, 12)
      .map(convertTMDBMovie)

    return (
      <div>
        <section className="relative h-[50vh] w-full">
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 container-page pb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{movie.title}</h1>
            <div className="flex items-center gap-3 text-gray-200 mb-3">
              <span>{formatYear(movie.year)}</span>
              <span>{formatDuration(movie.duration)}</span>
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-sm">★ {movie.rating}</span>
            </div>
            <p className="max-w-3xl text-gray-200 mb-4 line-clamp-4 md:line-clamp-none">{movie.description}</p>
            <div className="flex items-center gap-2">
              <Link href={`/watch/${movie.id}`}>
                <Button className="bg-white text-black hover:bg-gray-200">Play</Button>
              </Link>
              {session && (
                <WatchlistButton movieId={movie.id} initialInWatchlist={inWatchlist} />
              )}
              {movie.trailer && (
                <Link href={movie.trailer} target="_blank">
                  <Button variant="ghost" className="text-white hover:bg-white/20">
                    Watch Trailer
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="container-page py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-400">Genre:</span> {movie.genre}</div>
                <div><span className="text-gray-400">Release Year:</span> {movie.year}</div>
                <div><span className="text-gray-400">Duration:</span> {formatDuration(movie.duration)}</div>
                <div><span className="text-gray-400">Rating:</span> ★ {movie.rating}/10</div>
              </div>
            </div>
          </div>

          <h2 className="section-title">More like this</h2>
          <div className="grid-movies">
            {related.map((relatedMovie) => (
              <MovieCard key={relatedMovie.id} movie={relatedMovie} />
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return notFound()
  }
}
