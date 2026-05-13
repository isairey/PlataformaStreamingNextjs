import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { movieId } = await req.json()
  if (!movieId) return NextResponse.json({ error: 'movieId required' }, { status: 400 })

  await prisma.watchlist.upsert({
    where: { userId_movieId: { userId: session.user.id, movieId } },
    update: {},
    create: { userId: session.user.id, movieId },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { movieId } = await req.json()
  if (!movieId) return NextResponse.json({ error: 'movieId required' }, { status: 400 })

  await prisma.watchlist.deleteMany({ where: { userId: session.user.id, movieId } })
  return NextResponse.json({ ok: true })
}
