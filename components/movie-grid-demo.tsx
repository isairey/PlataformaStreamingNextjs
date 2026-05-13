'use client'

import MovieCard from './movie-card'
import { sampleMoviesWithTrailers } from '@/lib/sample-movies'

export default function MovieGridDemo() {
  return (
    <div className="container-page py-8">
      <h2 className="title-section text-white mb-6">Featured Movies with Trailers</h2>
      <p className="text-gray-400 mb-8 text-body">
        Hover over movie cards to see trailer previews. Click on any movie to view details.
      </p>
      
      <div className="grid-movies">
        {sampleMoviesWithTrailers.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onAddToWatchlist={(movieId) => {
              console.log('Added to watchlist:', movieId)
              // You can implement actual watchlist functionality here
            }}
            isInWatchlist={false}
          />
        ))}
      </div>
    </div>
  )
}
