import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import shaka from "shaka-player";
import toast from "react-hot-toast";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(
    () => localStorage.getItem("isMuted") === "true"
  );
  const [selectedResolutionId, setSelectedResolutionId] = useState(
    () => parseInt(localStorage.getItem("preferredResolutionId")) || null
  );
  const [playbackRate, setPlaybackRate] = useState(
    () => parseFloat(localStorage.getItem("playbackRate")) || 1
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initPlayer = async () => {
      shaka.polyfill.installAll();

      if (shaka.Player.isBrowserSupported()) {
        const player = new shaka.Player(video);
        playerRef.current = player;

        player.addEventListener("error", (event) => onError(event.detail));

        try {
          await player.attach(video);
          await player.load(src);

          video.muted = true;
          await video.play();
          video.muted = isMuted;
          video.playbackRate = playbackRate;

          player.configure({ abr: { enabled: true } });

          const availableTracks = player.getVariantTracks();
          setTracks(availableTracks);

          // Load saved resolution
          const storedId = parseInt(
            localStorage.getItem("preferredResolutionId")
          );
          const storedTrack = availableTracks.find((t) => t.id === storedId);
          if (storedTrack) {
            player.configure({ abr: { enabled: false } });
            player.selectVariantTrack(storedTrack, true);
            setSelectedResolutionId(storedId);
          }
        } catch (error) {
          onError(error);
        }
      } else {
        toast.error("Browser not supported by Shaka Player.");
      }
    };

    const onError = (error) => {
      const harmlessErrors = [7000];
      if (!harmlessErrors.includes(error.code)) {
        toast.error(`Video load failed: Shaka Error ${error.code}`);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      const mute = !video.muted;
      video.muted = mute;
      setIsMuted(mute);
      localStorage.setItem("isMuted", mute);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleResolutionChange = (trackId) => {
    const player = playerRef.current;
    const selectedTrack = tracks.find((t) => t.id === parseInt(trackId));
    if (selectedTrack) {
      player.configure({ abr: { enabled: false } });
      player.selectVariantTrack(selectedTrack, true);
      setSelectedResolutionId(selectedTrack.id);
      localStorage.setItem("preferredResolutionId", selectedTrack.id);
    }
  };

  const handleSpeedChange = (speed) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackRate(speed);
      localStorage.setItem("playbackRate", speed);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  let timeout;
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full bg-black group overflow-hidden rounded-lg"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        muted={isMuted}
        autoPlay
        preload="auto"
      />

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between px-4 py-3 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        } bg-gradient-to-b from-black/60 via-transparent to-black/60`}
      >
        {/* Top Controls */}
        <div className="flex justify-end items-center gap-2 text-white text-sm">
          {tracks.length > 0 && (
            <select
              onChange={(e) => handleResolutionChange(e.target.value)}
              value={selectedResolutionId ?? ""}
              className="bg-black/60 px-2 py-1 rounded"
            >
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.height}p
                </option>
              ))}
            </select>
          )}
          <select
            value={playbackRate}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="bg-black/60 px-2 py-1 rounded"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
        {/* Bottom Controls + Timeline */}
        <div className="flex flex-col gap-2 w-full text-white">
          {/* Timeline */}
          <div>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              step="0.1"
              onChange={handleSeek}
              className="w-full appearance-none h-1 bg-gray-600 rounded-lg cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-3
        [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:rounded-full"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay}>
                {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
              </button>
              <button onClick={toggleMute}>
                {isMuted ? (
                  <FaVolumeMute size={22} />
                ) : (
                  <FaVolumeUp size={22} />
                )}
              </button>
            </div>
            <div>
              <button onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <FaCompress size={20} />
                ) : (
                  <FaExpand size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
};

export default VideoPlayer;
