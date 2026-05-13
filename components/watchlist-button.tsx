"use client"

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Plus } from 'lucide-react'

export default function WatchlistButton({ movieId, initialInWatchlist }: { movieId: string; initialInWatchlist: boolean }) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist)
  const [isPending, startTransition] = useTransition()

  const toggleWatchlist = () => {
    startTransition(async () => {
      const method = inWatchlist ? 'DELETE' : 'POST'
      const res = await fetch('/api/watchlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }),
      })
      if (res.ok) setInWatchlist(!inWatchlist)
    })
  }

  return (
    <Button onClick={toggleWatchlist} variant={inWatchlist ? 'secondary' : 'default'} disabled={isPending}>
      {inWatchlist ? (
        <Heart className="h-4 w-4 mr-2 fill-current text-red-500" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </Button>
  )
}
