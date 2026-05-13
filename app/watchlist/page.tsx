'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, Filter, Grid, List, Search, Trash2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import MovieCard from '@/components/movie-card'
import { sampleMoviesWithTrailers } from '@/lib/sample-movies'

export default function WatchlistPage() {
  const { data: session } = useSession()
  const [watchlistMovies, setWatchlistMovies] = useState(sampleMoviesWithTrailers.slice(0, 4))
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMovies = watchlistMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRemoveFromWatchlist = (movieId: string) => {
    setWatchlistMovies(prev => prev.filter(movie => movie.id !== movieId))
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="bg-netflix-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container-page py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="title-display text-2xl text-white flex items-center">
                <Heart className="h-6 w-6 text-netflix-red mr-3" />
                My Watchlist
              </h1>
              <p className="text-gray-400 mt-1">{watchlistMovies.length} movies saved</p>
            </div>
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-netflix-gray border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-netflix-red focus:outline-none"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-netflix-gray border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-netflix-red focus:outline-none"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Title A-Z</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
          </select>

          {/* View Mode */}
          <div className="flex bg-netflix-gray rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredMovies.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            {searchQuery ? (
              <div>
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="title-section text-white mb-2">No results found</h3>
                <p className="text-gray-400 mb-6">
                  No movies match your search "{searchQuery}"
                </p>
                <Button onClick={() => setSearchQuery('')} variant="ghost" className="text-netflix-red">
                  Clear search
                </Button>
              </div>
            ) : (
              <div>
                <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="title-section text-white mb-2">Your watchlist is empty</h3>
                <p className="text-gray-400 mb-6">
                  Start adding movies you want to watch later
                </p>
                <Link href="/demo">
                  <Button className="bg-netflix-red hover:bg-red-700">
                    Browse Movies
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid-movies">
                {filteredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MovieCard
                      movie={movie}
                      onAddToWatchlist={handleRemoveFromWatchlist}
                      isInWatchlist={true}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-netflix-gray rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="title-display text-lg text-white mb-1">{movie.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{movie.genre} • {movie.year}</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">
                        ★ {movie.rating}
                      </span>
                      <Link href={`/watch/${movie.id}`}>
                        <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => handleRemoveFromWatchlist(movie.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {filteredMovies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-netflix-gray rounded-lg p-6"
          >
            <h3 className="title-section text-white mb-4">Watchlist Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-netflix-red">{watchlistMovies.length}</div>
                <div className="text-gray-400 text-sm">Total Movies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {Math.round(watchlistMovies.reduce((acc, movie) => acc + movie.duration, 0) / 60)}h
                </div>
                <div className="text-gray-400 text-sm">Total Runtime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {(watchlistMovies.reduce((acc, movie) => acc + movie.rating, 0) / watchlistMovies.length).toFixed(1)}
                </div>
                <div className="text-gray-400 text-sm">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  {new Set(watchlistMovies.flatMap(movie => movie.genre.split(', '))).size}
                </div>
                <div className="text-gray-400 text-sm">Genres</div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
