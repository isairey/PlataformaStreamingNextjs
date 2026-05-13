import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const movieId = searchParams.get('movieId')
  
  if (!movieId) {
    return NextResponse.json({ error: 'movieId required' }, { status: 400 })
  }

  try {
    const watchlistItem = await prisma.watchlist.findUnique({
      where: { 
        userId_movieId: { 
          userId: session.user.id, 
          movieId: movieId 
        } 
      },
    })

    return NextResponse.json({ inWatchlist: !!watchlistItem })
  } catch (error) {
    console.error('Error checking watchlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
