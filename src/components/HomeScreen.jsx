import { useEffect, useState } from "react";
import axios from "axios";

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
      <div className="text-white text-center mt-10">Loading videos...</div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="items-center flex flex-col p-6 min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-4">Videos</h2>

      <div className="items-center flex flex-row  flex-wrap justify-center gap-6">
        {videos.map((video, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={video.thumbnailUrl || "/placeholder-thumbnail.jpg"}
              alt="Thumbnail"
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 truncate">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {video.description}
              </p>
              <div className="text-sm text-gray-500 mt-2">
                <p>
                  Uploaded by:{" "}
                  <span className="font-medium">{video.uploader}</span>
                </p>
                <p>{video.views} views</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
