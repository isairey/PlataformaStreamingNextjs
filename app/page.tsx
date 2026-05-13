import { tmdb, convertTMDBMovie } from '@/lib/tmdb'
import MovieCard from '@/components/movie-card'
import HeroSection from '@/components/hero-section'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  try {
    const [trendingResponse, popularResponse] = await Promise.all([
      tmdb.getTrendingMovies('week'),
      tmdb.getPopularMovies(1),
    ])

    const featured = trendingResponse.results[0] ? convertTMDBMovie(trendingResponse.results[0]) : null
    const trending = trendingResponse.results.slice(0, 12).map(convertTMDBMovie)
    const popular = popularResponse.results.slice(0, 12).map(convertTMDBMovie)

    return (
      <div>
        {/* Hero section */}
        {featured && <HeroSection movie={featured} />}

        {/* Trending movies */}
        <section className="container-page py-8">
          <h2 className="section-title">Trending This Week</h2>
          <div className="grid-movies">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Popular movies */}
        <section className="container-page py-8">
          <h2 className="section-title">Popular Movies</h2>
          <div className="grid-movies">
            {popular.map((movie) => (
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
