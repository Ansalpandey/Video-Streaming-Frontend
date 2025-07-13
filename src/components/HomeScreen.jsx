import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomeScreen() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/videos")
      .then((response) => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setError("Failed to fetch videos");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-white text-center mt-20 text-lg">
        Loading videos...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-20 text-lg">{error}</div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen py-12 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        🎬 Explore Videos
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {videos.map((video, index) => (
          <Link key={index} to={`/videos/${video.id}`}>
            <div className="bg-gray-900/70 border border-gray-700 backdrop-blur-md rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-indigo-500 hover:scale-[1.03] transition-all duration-300">
              <div className="aspect-video w-full overflow-hidden rounded-t-xl">
                <img
                  src={video.thumbnailUrl || "/placeholder-thumbnail.jpg"}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 text-white">
                <h3 className="text-lg font-bold mb-1 line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                  {video.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                  <span className="flex items-center gap-1">
                    👤 {video.uploader}
                  </span>
                  <span className="flex items-center gap-1">
                    👁️ {video.views}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  📅 {video.uploadedAt || "2 days ago"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
