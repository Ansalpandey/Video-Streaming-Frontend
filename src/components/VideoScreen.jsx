import { useState } from "react";
import VideoUpload from "./VideoUpload";
import { Toaster } from "react-hot-toast";
import { Button, TextInput } from "flowbite-react";
import VideoPlayer from "./VideoPlayer";
function VideoScreen() {
  const [videoId, setVideoId] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handlePlay = () => {
    if (inputValue.trim()) {
      setVideoId(inputValue.trim());
    }
  };

  return (
    <>
      <Toaster />
      <div className="h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 py-4">
          Video Streaming App
        </h1>

        <div className="flex flex-1 flex-col md:flex-row">
          {/* Video Player - Left Half */}
          <div className="w-full md:w-1/2 h-full p-4 flex flex-col">
            <h2 className="text-lg font-medium text-gray-200 mb-2">
              Playing Video
            </h2>
            <div className="flex-1 w-full aspect-video md:aspect-auto bg-black rounded-lg overflow-hidden">
              {videoId ? (
                <VideoPlayer
                  src={`http://localhost:8000/api/videos/${videoId}/manifest.mpd`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Enter a video ID to play
                </div>
              )}
            </div>

            {/* Input for Video ID */}
            <div className="mt-4 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <TextInput
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter video ID"
                name="video_id_field"
                className="w-full sm:w-auto"
              />
              <Button onClick={handlePlay}>Play</Button>
            </div>
          </div>

          {/* Upload Form - Right Half */}
          <div className="w-full md:w-1/2 h-full p-4 overflow-y-auto">
            <VideoUpload />
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoScreen;
