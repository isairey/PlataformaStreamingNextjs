import { notFound, redirect } from 'next/navigation'
import { tmdb, convertTMDBMovie } from '@/lib/tmdb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: { id: string }
}

export const revalidate = 3600 // Revalidate every hour

export default async function WatchPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/watch/${params.id}`)}`)
  }

  try {
    const movieId = parseInt(params.id)
    if (isNaN(movieId)) return notFound()

    const movieDetails = await tmdb.getMovieDetails(movieId)
    const movie = convertTMDBMovie(movieDetails)

    // Sample video URLs for demo purposes
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    ]
    
    // Use a sample video based on movie ID
    const videoUrl = sampleVideos[parseInt(movie.id) % sampleVideos.length]

    return (
      <div className="container-page py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">{movie.title}</h1>
          <Link href={`/movie/${movie.id}`}>
            <Button variant="ghost">Back to details</Button>
          </Link>
        </div>
        <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
          <video
            className="w-full h-full"
            src={videoUrl}
            controls
            poster={movie.backdrop}
          />
        </div>
        
        {/* Movie info below video */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
          <p className="text-gray-300 text-sm mb-4">{movie.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{movie.year}</span>
            <span>★ {movie.rating}</span>
            <span>{movie.genre}</span>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching movie for watch:', error)
    return notFound()
  }
}
