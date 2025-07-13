import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

function VideoScreen() {
  const { id: videoId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-[#111] to-black text-white font-sans">
      <header className="py-10 text-center border-b border-gray-800">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🎬 Stream Studio
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-6">🎥 Now Playing</h2>
          <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-700">
            {videoId ? (
              <VideoPlayer
                src={`http://localhost:8000/api/videos/${videoId}/manifest.mpd`}
              />
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500 text-lg">
                No video selected
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default VideoScreen;
