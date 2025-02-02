export function useMediaStream(type) {
  if (!["webcam", "screen", "esp32cam"].includes(type)) {
    throw new Error('Invalid type. Expected "webcam", "screen", or "esp32cam".');
  }

  let stream = null;
  let isStreaming = false;

  const start = async () => {
    if (type === "webcam") {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    } else if (type === "screen") {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
    } else if (type === "esp32cam") {
      stream = "http://localhost:81/stream"; // ESP32-CAM HTTP Stream URL
    }
    isStreaming = true;
    return stream;
  };

  const stop = () => {
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    stream = null;
    isStreaming = false;
  };

  return {
    type,
    start,
    stop,
    get isStreaming() {
      return isStreaming;
    },
    get stream() {
      return stream;
    },
  };
}
