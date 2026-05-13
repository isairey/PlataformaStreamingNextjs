'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Play, Plus, ThumbsUp, X, Volume2, VolumeX, Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatDuration, formatYear } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

import { Movie, MovieDetailModalProps } from '@/types/movie'

export default function MovieDetailModal({ movie, children }: MovieDetailModalProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [inWatchlist, setInWatchlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Check if movie is in watchlist when modal opens
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      checkWatchlistStatus()
    }
  }, [isOpen, session?.user?.id, movie.id])

  const checkWatchlistStatus = async () => {
    try {
      const response = await fetch(`/api/watchlist/check?movieId=${movie.id}`)
      if (response.ok) {
        const data = await response.json()
        setInWatchlist(data.inWatchlist)
      }
    } catch (error) {
      console.error('Error checking watchlist status:', error)
    }
  }

  const toggleWatchlist = async () => {
    if (!session) return
    
    setIsLoading(true)
    try {
      const method = inWatchlist ? 'DELETE' : 'POST'
      const response = await fetch('/api/watchlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: movie.id }),
      })

      if (response.ok) {
        setInWatchlist(!inWatchlist)
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 bg-netflix-black border-gray-800 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Hero Section with Backdrop */}
          <div className="relative h-[50vh] w-full">
            {movie.trailer && movie.trailer.trim() !== '' ? (
              <div className="w-full h-full">
                <iframe
                  src={`${movie.trailer.replace('watch?v=', 'embed/')}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${movie.trailer.split('v=')[1]}`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : (
              <Image
                src={movie.backdrop || movie.poster || '/placeholder-movie.svg'}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 bg-netflix-black/80 hover:bg-netflix-black rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Movie Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="title-display text-3xl md:text-4xl text-white mb-4">
                  {movie.title}
                </h1>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-4">
                  <Link href={`/watch/${movie.id}`}>
                    <Button 
                      size="lg" 
                      className="bg-white text-black hover:bg-gray-200 font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      <Play className="h-5 w-5 mr-2 fill-current" />
                      Play
                    </Button>
                  </Link>
                  
                  {session && (
                    <Button
                      size="lg"
                      variant="ghost"
                      className="bg-gray-600/80 hover:bg-gray-600 text-white border-2 border-gray-400"
                      onClick={toggleWatchlist}
                      disabled={isLoading}
                    >
                      {inWatchlist ? (
                        <Heart className="h-5 w-5 fill-current text-red-500" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                  
                  <Button
                    size="lg"
                    variant="ghost"
                    className="bg-gray-600/80 hover:bg-gray-600 text-white border-2 border-gray-400"
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </Button>

                  {/* Mute/Unmute Button - only show if trailer is available */}
                  {movie.trailer && (
                    <div className="ml-auto">
                      <Button
                        size="lg"
                        variant="ghost"
                        className="bg-gray-600/80 hover:bg-gray-600 text-white border-2 border-gray-400 rounded-full"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 bg-netflix-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                  <span className="text-green-400 font-semibold">
                    {Math.round(movie.rating * 10)}% Match
                  </span>
                  <span>{formatYear(movie.year)}</span>
                  <span className="border border-gray-500 px-1 text-xs">HD</span>
                  <span>{formatDuration(movie.duration)}</span>
                </div>

                <p className="text-body text-white text-base mb-6">
                  {movie.description}
                </p>

                {/* Cast & Crew (placeholder) */}
                <div className="text-sm text-gray-400">
                  <p className="mb-2">
                    <span className="text-gray-500">Cast:</span> Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth
                  </p>
                  <p className="mb-2">
                    <span className="text-gray-500">Genres:</span> {movie.genre}
                  </p>
                  <p>
                    <span className="text-gray-500">This movie is:</span> Exciting, Action-packed, Suspenseful
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* More Like This */}
                <SimilarMovies movieId={movie.id} />

                {/* About */}
                <div>
                  <h3 className="title-section text-white mb-4">About {movie.title}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400">
                      <span className="text-gray-500">Director:</span> Anthony Russo, Joe Russo
                    </p>
                    <p className="text-gray-400">
                      <span className="text-gray-500">Writer:</span> Christopher Markus, Stephen McFeely
                    </p>
                    <p className="text-gray-400">
                      <span className="text-gray-500">Rating:</span> ★ {movie.rating}/10
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Similar Movies Component
function SimilarMovies({ movieId }: { movieId: string }) {
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        const response = await fetch(`/api/movies/similar/${movieId}`)
        if (response.ok) {
          const data = await response.json()
          setSimilarMovies(data.movies || [])
        }
      } catch (error) {
        console.error('Error fetching similar movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarMovies()
  }, [movieId])

  if (loading) {
    return (
      <div>
        <h3 className="text-white font-semibold mb-4">More Like This</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-3 p-3 bg-netflix-gray rounded animate-pulse">
              <div className="w-16 h-24 bg-gray-600 rounded flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded mb-2" />
                <div className="h-3 bg-gray-700 rounded mb-1" />
                <div className="h-3 bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="title-section text-white mb-4">More Like This</h3>
      <div className="space-y-3">
        {similarMovies.slice(0, 3).map((movie) => (
          <MovieDetailModal key={movie.id} movie={movie}>
            <div className="flex gap-3 p-3 bg-netflix-gray rounded hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-16 h-24 rounded flex-shrink-0 overflow-hidden">
                <Image
                  src={movie.poster || movie.backdrop || '/placeholder-movie.svg'}
                  alt={movie.title}
                  width={64}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-white text-sm font-medium mb-1 line-clamp-1">{movie.title}</h4>
                <p className="text-gray-400 text-xs line-clamp-3">
                  {movie.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>★ {movie.rating}</span>
                  <span>{movie.year}</span>
                </div>
              </div>
            </div>
          </MovieDetailModal>
        ))}
      </div>
    </div>
  )
}
