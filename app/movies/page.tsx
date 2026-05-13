import MovieCard from '@/components/movie-card'
import { tmdb, convertTMDBMovie } from '@/lib/tmdb'

export const revalidate = 3600 // Revalidate every hour

export default async function MoviesPage() {
  try {
    const [popularResponse, topRatedResponse, nowPlayingResponse] = await Promise.all([
      tmdb.getPopularMovies(1),
      tmdb.getTopRatedMovies(1),
      tmdb.getNowPlayingMovies(1),
    ])

    const popular = popularResponse.results.map(convertTMDBMovie)
    const topRated = topRatedResponse.results.map(convertTMDBMovie)
    const nowPlaying = nowPlayingResponse.results.map(convertTMDBMovie)

    return (
      <div className="container-page py-8">
        <h1 className="section-title">Movies</h1>
        
        {/* Popular Movies */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
          <div className="grid-movies">
            {popular.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Top Rated Movies */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
          <div className="grid-movies">
            {topRated.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Now Playing Movies */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Now Playing</h2>
          <div className="grid-movies">
            {nowPlaying.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error fetching movies:', error)
    return (
      <div className="container-page py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load movies</h2>
          <p className="text-gray-400 mb-4">
            Please make sure TMDB API key is configured in your environment variables.
          </p>
          <p className="text-sm text-gray-500">
            Add TMDB_API_KEY to your .env.local file
          </p>
        </div>
      </div>
    )
  }
}
