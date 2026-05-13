// Centralized Movie type definition that matches Prisma schema
export interface Movie {
  id: string
  title: string
  description: string
  poster: string | null
  backdrop: string | null
  genre: string
  year: number
  rating: number
  duration: number
  trailer: string | null
  videoUrl?: string | null
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Props interfaces for components
export interface MovieCardProps {
  movie: Movie
  onAddToWatchlist?: (movieId: string) => void
  isInWatchlist?: boolean
}

export interface HeroSectionProps {
  movie: Movie
}

export interface MovieDetailModalProps {
  movie: Movie
  children: React.ReactNode
}
