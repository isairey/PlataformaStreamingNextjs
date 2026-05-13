const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

if (!TMDB_API_KEY) {
  console.warn('TMDB_API_KEY not found in environment variables')
}

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  runtime?: number
  genres?: { id: number; name: string }[]
  videos?: {
    results: Array<{
      key: string
      site: string
      type: string
      name: string
    }>
  }
}

export interface TMDBResponse<T> {
  results: T[]
  total_pages: number
  total_results: number
  page: number
}

class TMDBClient {
  private baseUrl = TMDB_BASE_URL
  private apiKey = TMDB_API_KEY

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('TMDB API key not configured')
    }

    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.set('api_key', this.apiKey)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getPopularMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>('/movie/popular', { page: page.toString() })
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>(`/trending/movie/${timeWindow}`)
  }

  async getTopRatedMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>('/movie/top_rated', { page: page.toString() })
  }

  async getNowPlayingMovies(page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>('/movie/now_playing', { page: page.toString() })
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    return this.fetch<TMDBMovie>(`/movie/${movieId}`, { append_to_response: 'videos' })
  }

  async searchMovies(query: string, page = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>('/search/movie', { 
      query: encodeURIComponent(query), 
      page: page.toString() 
    })
  }

  getImageUrl(path: string | null, size: 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image'
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image'
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  getYouTubeTrailerUrl(movie: TMDBMovie): string | null {
    const trailer = movie.videos?.results.find(
      video => video.site === 'YouTube' && video.type === 'Trailer'
    )
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
  }
}

export const tmdb = new TMDBClient()

// Helper function to convert TMDB movie to our app format
export function convertTMDBMovie(tmdbMovie: TMDBMovie) {
  const genres = tmdbMovie.genres?.map(g => g.name).join(', ') || 
                 tmdbMovie.genre_ids?.slice(0, 3).join(', ') || 'Unknown'
  
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    poster: tmdb.getImageUrl(tmdbMovie.poster_path),
    backdrop: tmdb.getBackdropUrl(tmdbMovie.backdrop_path),
    genre: genres,
    year: new Date(tmdbMovie.release_date || '2000').getFullYear(),
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    duration: tmdbMovie.runtime || 120,
    trailer: tmdb.getYouTubeTrailerUrl(tmdbMovie),
  }
}
