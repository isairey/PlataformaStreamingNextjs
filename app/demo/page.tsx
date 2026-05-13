import MovieGridDemo from "@/components/movie-grid-demo";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="bg-netflix-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container-page py-4">
          <h1 className="title-display text-2xl text-netflix-red">
            🎬 Screenly
          </h1>
          <p className="text-gray-400 mt-2">
            Testing enhanced fonts and trailer functionality
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <MovieGridDemo />
      </main>

      {/* Footer */}
      <footer className="bg-netflix-gray mt-16 py-8">
        <div className="container-page">
          <div className="text-center text-gray-400">
            <h3 className="title-section text-white mb-4">
              Features Implemented
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="bg-netflix-black p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">
                  ✨ Enhanced Typography
                </h4>
                <p>Modern fonts: Inter, Poppins, JetBrains Mono</p>
              </div>
              <div className="bg-netflix-black p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">
                  🎥 Trailer Preview
                </h4>
                <p>Auto-play trailers on hover with 1.5s delay</p>
              </div>
              <div className="bg-netflix-black p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">
                  🎨 Improved UI
                </h4>
                <p>Better animations and visual feedback</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
