import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { tmdb, convertTMDBMovie } from '@/lib/tmdb'

// Create a global prisma instance to avoid connection issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // First, search in local database
    const localMovies = await prisma.movie.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query
            }
          },
          {
            description: {
              contains: query
            }
          },
          {
            genre: {
              contains: query
            }
          }
        ]
      },
      take: 20, // Limit results
      orderBy: {
        rating: 'desc'
      }
    })

    // If we have local results, return them
    if (localMovies.length > 0) {
      console.log(`Found ${localMovies.length} movies in local database`)
      return NextResponse.json({ movies: localMovies })
    }

    // If no local results, fallback to TMDB API
    console.log('No local results, searching TMDB...')
    const searchResponse = await tmdb.searchMovies(query)
    const movies = searchResponse.results.map(convertTMDBMovie)

    return NextResponse.json({ movies })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
