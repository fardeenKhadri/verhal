import { useEffect, useState } from "react";
import { createMediaStreamFromImage } from "../lib/utils"; // Import utility

export function useEsp32Cam() {
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [espIp, setEspIp] = useState(localStorage.getItem("espIp") || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setEspIp(localStorage.getItem("espIp") || "");
    };

    window.addEventListener("storage", handleStorageChange);

    const observer = new MutationObserver(handleStorageChange);
    observer.observe(document, { subtree: true, childList: true });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      observer.disconnect();
    };
  }, []);

  const start = async () => {
    const esp32StreamUrl = `http://192.168.137.${espIp}/capture`;
    fetch(`http://192.168.137.${espIp}/control?var=framesize&val=12`, {
      method: "GET",
    });
    fetch(`http://192.168.137.${espIp}/control?var=vflip&val=1`, {
      method: "GET",
    });
    const mediaStream = await createMediaStreamFromImage(
      esp32StreamUrl,
      stream
    );
    setStream(mediaStream);
    setIsStreaming(true);
    return mediaStream;
  };

  const stop = () => {
    if (stream) {
      if (stream._stopUpdating) stream._stopUpdating(); // Stop animation updates
      stream.getTracks().forEach((track) => track.stop()); // Stop video tracks
    }
    setStream(null);
    setIsStreaming(false);
  };

  return {
    type: "esp32cam",
    start,
    stop,
    isStreaming,
    stream,
  };
}
