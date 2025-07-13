import { Toaster } from "react-hot-toast";
import VideoUpload from "./VideoUpload";
function UploadScreen() {
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-tr from-black via-[#111] to-black text-white font-sans">
        <header className="py-10 text-center border-b border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🎬 Stream Studio
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Adaptive video playback & seamless uploads on the go!
          </p>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">📤 Upload a Video</h2>
            <VideoUpload />
          </section>
        </main>
      </div>
    </>
  );
}

export default UploadScreen;
