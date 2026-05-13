import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Sample movies data
  const movies = [
    {
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
      trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      genre: "Action, Crime, Drama",
      year: 2008,
      rating: 9.0,
      duration: 152,
      featured: true,
    },
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      genre: "Action, Sci-Fi, Thriller",
      year: 2010,
      rating: 8.8,
      duration: 148,
      featured: true,
    },
    {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/pbrkL804c8yAv3zBZR4QPWZAAn8.jpg",
      trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      genre: "Adventure, Drama, Sci-Fi",
      year: 2014,
      rating: 8.6,
      duration: 169,
      featured: false,
    },
    {
      title: "The Matrix",
      description: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
      poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      trailer: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      genre: "Action, Sci-Fi",
      year: 1999,
      rating: 8.7,
      duration: 136,
      featured: false,
    },
    {
      title: "Pulp Fiction",
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
      trailer: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      genre: "Crime, Drama",
      year: 1994,
      rating: 8.9,
      duration: 154,
      featured: false,
    },
    {
      title: "The Shawshank Redemption",
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      backdrop: "https://image.tmdb.org/t/p/w1280/l6hQWH9eDksNJNiXWYRkWqikOdu.jpg",
      trailer: "https://www.youtube.com/watch?v=6hB3S9bIaco",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      genre: "Drama",
      year: 1994,
      rating: 9.3,
      duration: 142,
      featured: true,
    }
  ]

  console.log('Seeding movies...')
  
  for (const movie of movies) {
    const existingMovie = await prisma.movie.findFirst({
      where: { title: movie.title }
    })
    
    if (!existingMovie) {
      await prisma.movie.create({
        data: movie
      })
    }
  }

  console.log('Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
