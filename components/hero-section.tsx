'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import MovieDetailModal from '@/components/movie-detail-modal'
import { Movie, HeroSectionProps } from '@/types/movie'

export default function HeroSection({ movie }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true)

  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full">
      <Image
        src={movie.backdrop || movie.poster || '/placeholder-movie.svg'}
        alt={movie.title}
        fill
        priority
        className="object-cover"
      />
      <div className="hero-overlay absolute inset-0" />
      
      <div className="absolute bottom-0 left-0 right-0 container-page pb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 max-w-3xl">
          {movie.title}
        </h1>
        <p className="max-w-2xl text-gray-200 mb-4 line-clamp-3 md:line-clamp-none text-sm md:text-base">
          {movie.description}
        </p>
        
        <div className="flex items-center gap-3">
          <Link href={`/watch/${movie.id}`}>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold">
              <Play className="h-5 w-5 mr-2 fill-current" />
              Play
            </Button>
          </Link>
          
          <MovieDetailModal movie={movie}>
            <Button 
              size="lg" 
              variant="ghost" 
              className="bg-gray-600/70 hover:bg-gray-600/90 text-white font-semibold"
            >
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Button>
          </MovieDetailModal>
        </div>
      </div>

      {/* Mute/Unmute button */}
      <div className="absolute bottom-8 right-8">
        <Button
          size="lg"
          variant="ghost"
          className="bg-gray-600/70 hover:bg-gray-600/90 text-white border-2 border-gray-400 rounded-full"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </section>
  )
}
