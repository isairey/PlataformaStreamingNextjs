import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  runtime?: number
  genres?: { id: number; name: string }[]
  videos?: {
    results: {
      key: string
      site: string
      type: string
    }[]
  }
}

interface TMDBResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

class TMDBFetcher {
  private apiKey: string
  private baseUrl: string
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
  private delay = 250 // 250ms delay between requests to respect rate limits

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY!
    this.baseUrl = process.env.TMDB_BASE_URL!
    
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('TMDB API key or base URL not found in environment variables')
    }
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url)
        
        if (response.status === 429) {
          // Rate limited, wait longer
          console.log('Rate limited, waiting 1 second...')
          await this.sleep(1000)
          continue
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        return await response.json()
      } catch (error) {
        console.log(`Attempt ${i + 1} failed:`, error)
        if (i === retries - 1) throw error
        await this.sleep(1000 * (i + 1)) // Exponential backoff
      }
    }
  }

  async fetchPopularMovies(page: number = 1): Promise<TMDBResponse> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  async fetchTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
    const url = `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  async fetchNowPlayingMovies(page: number = 1): Promise<TMDBResponse> {
    const url = `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  async fetchUpcomingMovies(page: number = 1): Promise<TMDBResponse> {
    const url = `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&page=${page}&language=en-US`
    return this.fetchWithRetry(url)
  }

  async fetchMovieDetails(movieId: number): Promise<TMDBMovie> {
    const url = `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=videos&language=en-US`
    return this.fetchWithRetry(url)
  }

  async fetchDiscoverMovies(page: number = 1): Promise<TMDBResponse> {
    const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&page=${page}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false`
    return this.fetchWithRetry(url)
  }

  private transformMovieData(movie: TMDBMovie): any {
    const trailer = movie.videos?.results?.find(
      video => video.site === 'YouTube' && video.type === 'Trailer'
    )

    return {
      title: movie.title,
      description: movie.overview || 'No description available',
      poster: movie.poster_path ? `${this.imageBaseUrl}${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${this.imageBaseUrl}${movie.backdrop_path}` : null,
      genre: movie.genres?.[0]?.name || 'Unknown',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : new Date().getFullYear(),
      rating: Math.round(movie.vote_average * 10) / 10,
      duration: movie.runtime || 120, // Default 2 hours if not available
      trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      featured: false
    }
  }

  async saveMoviesToDatabase(movies: TMDBMovie[]) {
    console.log(`Saving ${movies.length} movies to database...`)
    
    for (const movie of movies) {
      try {
        // Check if movie already exists
        const existingMovie = await prisma.movie.findFirst({
          where: { title: movie.title }
        })

        if (existingMovie) {
          console.log(`Movie "${movie.title}" already exists, skipping...`)
          continue
        }

        // Fetch detailed movie data
        const detailedMovie = await this.fetchMovieDetails(movie.id)
        await this.sleep(this.delay) // Rate limiting

        const movieData = this.transformMovieData(detailedMovie)

        await prisma.movie.create({
          data: movieData
        })

        console.log(`✅ Saved: ${movie.title}`)
      } catch (error) {
        console.error(`❌ Error saving ${movie.title}:`, error)
      }
    }
  }

  async fetchAndSaveAllMovies(maxPages: number = 10) {
    console.log(`🎬 Starting to fetch movies from TMDB (max ${maxPages} pages per category)...`)
    
    const categories = [
      { name: 'Popular', fetcher: this.fetchPopularMovies.bind(this) },
      { name: 'Top Rated', fetcher: this.fetchTopRatedMovies.bind(this) },
      { name: 'Now Playing', fetcher: this.fetchNowPlayingMovies.bind(this) },
      { name: 'Upcoming', fetcher: this.fetchUpcomingMovies.bind(this) },
      { name: 'Discover', fetcher: this.fetchDiscoverMovies.bind(this) }
    ]

    for (const category of categories) {
      console.log(`\n📂 Fetching ${category.name} movies...`)
      
      for (let page = 1; page <= maxPages; page++) {
        try {
          console.log(`📄 Fetching page ${page}...`)
          const response = await category.fetcher(page)
          
          if (!response.results || response.results.length === 0) {
            console.log(`No more movies found on page ${page}`)
            break
          }

          await this.saveMoviesToDatabase(response.results)
          await this.sleep(this.delay) // Rate limiting between pages

          // Break if we've reached the last page
          if (page >= response.total_pages) {
            console.log(`Reached last page (${response.total_pages})`)
            break
          }
        } catch (error) {
          console.error(`Error fetching ${category.name} page ${page}:`, error)
          // Continue with next page
        }
      }
    }
  }
}

async function main() {
  try {
    const fetcher = new TMDBFetcher()
    
    // You can adjust the number of pages to fetch
    // Each page contains ~20 movies, so 10 pages = ~200 movies per category
    await fetcher.fetchAndSaveAllMovies(5) // Start with 5 pages per category
    
    console.log('\n🎉 Movie fetching completed!')
    
    // Show statistics
    const totalMovies = await prisma.movie.count()
    console.log(`📊 Total movies in database: ${totalMovies}`)
    
  } catch (error) {
    console.error('❌ Error in main function:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
if (require.main === module) {
  main()
}

export { TMDBFetcher }
