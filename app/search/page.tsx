'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/movie-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Movie } from '@/types/movie'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([])
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setMovies(data.movies || [])
    } catch (err) {
      setError('Failed to search movies')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) {
      setQuery(initialQuery)
      searchMovies(initialQuery)
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchMovies(query)
    
    // Update URL
    const url = new URL(window.location.href)
    if (query.trim()) {
      url.searchParams.set('q', query)
    } else {
      url.searchParams.delete('q')
    }
    window.history.pushState({}, '', url.toString())
  }

  return (
    <div className="container-page py-10 mt-12">
      <h1 className="section-title">Search Movies</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8 max-w-md">
        <Input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-400">Searching...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <div className="text-red-400">{error}</div>
        </div>
      )}

      {!loading && !error && movies.length === 0 && query && (
        <div className="text-center py-8">
          <div className="text-gray-400">No movies found for "{query}"</div>
        </div>
      )}

      {movies.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Search results for "{query}" ({movies.length} found)
          </h2>
          <div className="grid-movies">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
