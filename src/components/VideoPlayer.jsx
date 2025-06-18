import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import shaka from "shaka-player";
import toast from "react-hot-toast";

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const initPlayer = async () => {
      const video = videoRef.current;
      if (!video) return;

      shaka.polyfill.installAll();

      if (shaka.Player.isBrowserSupported()) {
        const player = new shaka.Player();
        playerRef.current = player;

        player.addEventListener("error", onErrorEvent);

        try {
          await player.attach(video);
          await player.load(src);
          video.play();
        } catch (error) {
          onError(error);
        }
      } else {
        toast.error("Browser not supported by Shaka Player.");
      }
    };

    const onErrorEvent = (event) => {
      onError(event.detail);
    };

    const onError = (error) => {
      // These are non-fatal and recoverable
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

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "500px" }}
        controls
        autoPlay        
        preload="auto"
      />
    </div>
  );
}

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
};

export default VideoPlayer;
