import clsx from "clsx";
import { memo, useEffect, useRef, useState } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useScreenCapture } from "../../hooks/use-screen-capture";
import { useWebcam } from "../../hooks/use-webcam";
import { useEsp32Cam } from "../../hooks/use-esp32cam"; // Import the new hook
import { AudioRecorder } from "../../lib/audio-recorder";
import AudioPulse from "../shared/AudioPulse";
import {
  Ban,
  Mic,
  MicOff,
  Pause,
  Play,
  Presentation,
  Video,
  VideoOff,
  Wifi,
  WifiOff,
} from "lucide-react";

const MediaStreamButton = memo(
  ({ isStreaming, onIcon, offIcon, start, stop }) =>
    isStreaming ? (
      <button className="h-fit cursor-pointer" onClick={stop}>
        <div>{onIcon}</div>
      </button>
    ) : (
      <button className="h-fit cursor-pointer" onClick={start}>
        <div>{offIcon}</div>
      </button>
    )
);

function ControlTray({ videoRef, children, onVideoStreamChange = () => {} }) {
  const videoStreams = [useWebcam(), useScreenCapture(), useEsp32Cam()];
  const [activeVideoStream, setActiveVideoStream] = useState(null);
  const [webcam, screenCapture, esp32Cam] = videoStreams;
  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const renderCanvasRef = useRef(null);
  const connectButtonRef = useRef(null);

  const { client, connected, connect, disconnect, volume } =
    useLiveAPIContext();

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`
    );
  }, [inVolume]);

  useEffect(() => {
    const onData = (base64) => {
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = activeVideoStream;
    }

    let timeoutId = -1;

    function sendVideoFrame() {
      const video = videoRef.current;
      const canvas = renderCanvasRef.current;

      if (!video || !canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth * 0.25;
      canvas.height = video.videoHeight * 0.25;
      if (canvas.width + canvas.height > 0) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 1.0);
        const data = base64.slice(base64.indexOf(",") + 1);
        client.sendRealtimeInput([{ mimeType: "image/jpeg", data }]);
      }
      if (connected) {
        timeoutId = window.setTimeout(sendVideoFrame, 1000 / 0.5);
      }
    }
    if (connected && activeVideoStream !== null) {
      requestAnimationFrame(sendVideoFrame);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [connected, activeVideoStream, client, videoRef]);

  const changeStreams = (next) => async () => {
    if (next) {
      const mediaStream = await next.start();
      setActiveVideoStream(mediaStream);
      onVideoStreamChange(mediaStream);
    } else {
      setActiveVideoStream(null);
      onVideoStreamChange(null);
    }

    videoStreams.filter((msr) => msr !== next).forEach((msr) => msr.stop());
  };

  return (
    <div className="flex h-fit gap-5 p-5 border rounded-full bg-white">
      <canvas style={{ display: "none" }} ref={renderCanvasRef} />
      <div
        className={clsx(
          "flex h-fit gap-5",
          connected ? "" : "pointer-events-none"
        )}
      >
        <button
          className="h-fit cursor-pointer"
          onClick={() => setMuted(!muted)}
        >
          {!muted ? (
            <div>
              <Mic />
            </div>
          ) : (
            <div>
              <MicOff />
            </div>
          )}
        </button>

        <div className="flex h-fit justify-center items-center cursor-pointer">
          <AudioPulse volume={volume} active={connected} hover={false} />
        </div>

        <MediaStreamButton
          isStreaming={screenCapture.isStreaming}
          start={changeStreams(screenCapture)}
          stop={changeStreams()}
          onIcon={<Ban />}
          offIcon={<Presentation />}
        />
        <MediaStreamButton
          isStreaming={webcam.isStreaming}
          start={changeStreams(webcam)}
          stop={changeStreams()}
          onIcon={<Video />}
          offIcon={<VideoOff />}
        />
        <MediaStreamButton
          isStreaming={esp32Cam.isStreaming} // Compare with stored stream
          start={changeStreams(esp32Cam)}
          stop={changeStreams()}
          onIcon={<Wifi />}
          offIcon={<WifiOff />}

        />

        {children}
      </div>

      <div className="flex h-fit justify-center items-center gap-5">
        <button
          className="h-fit"
          ref={connectButtonRef}
          onClick={connected ? disconnect : connect}
        >
          <div>{connected ? <Pause /> : <Play />}</div>
        </button>

        <span className={connected ? "" : "hidden"}>Streaming</span>
      </div>
    </div>
  );
}

export default memo(ControlTray);
