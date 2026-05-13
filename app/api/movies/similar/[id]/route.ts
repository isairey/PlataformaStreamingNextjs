import { NextResponse } from 'next/server'
import { tmdb, convertTMDBMovie } from '@/lib/tmdb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = parseInt(params.id)
    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 })
    }

    // Get similar movies from TMDB
    const response = await fetch(
      `${process.env.TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${process.env.TMDB_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch similar movies')
    }

    const data = await response.json()
    const similarMovies = data.results.slice(0, 6).map(convertTMDBMovie)

    return NextResponse.json({ movies: similarMovies })
  } catch (error) {
    console.error('Error fetching similar movies:', error)
    
    // Fallback to popular movies if similar movies fail
    try {
      const popularResponse = await tmdb.getPopularMovies(1)
      const fallbackMovies = popularResponse.results
        .filter(m => m.id.toString() !== params.id)
        .slice(0, 6)
        .map(convertTMDBMovie)
      
      return NextResponse.json({ movies: fallbackMovies })
    } catch (fallbackError) {
      return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
    }
  }
}
