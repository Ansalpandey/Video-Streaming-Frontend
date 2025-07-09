import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import shaka from "shaka-player";
import toast from "react-hot-toast";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const initPlayer = async () => {
      const video = videoRef.current;
      if (!video) return;

      shaka.polyfill.installAll();

      if (shaka.Player.isBrowserSupported()) {
        const player = new shaka.Player(); // ✅ Create player without passing mediaElement
        playerRef.current = player;

        player.addEventListener("error", onErrorEvent);

        try {
          await player.attach(video); // ✅ Attach separately
          await player.load(src);
          video.play();

          // Enable ABR by default
          player.configure({ abr: { enabled: true } });

          // Get available tracks
          const availableTracks = player.getVariantTracks();
          setTracks(availableTracks);
        } catch (error) {
          onError(error);
          console.log(error);
        }
      } else {
        toast.error("Browser not supported by Shaka Player.");
      }
    };

    const onErrorEvent = (event) => {
      onError(event.detail);
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

  const handleResolutionChange = (trackId) => {
    const player = playerRef.current;
    if (!player) return;

    const selectedTrack = tracks.find((t) => t.id === parseInt(trackId));
    if (selectedTrack) {
      player.configure({ abr: { enabled: false } }); // disable auto
      player.selectVariantTrack(selectedTrack, true); // clear buffer
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "500px" }}
        controls
        autoPlay
        muted
        preload="auto"
      />
      {tracks.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <label>Resolution: </label>
          <select onChange={(e) => handleResolutionChange(e.target.value)}>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.height}p ({Math.round(track.bandwidth / 1000)} kbps)
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
};

export default VideoPlayer;
