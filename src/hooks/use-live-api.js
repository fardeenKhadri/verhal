import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MultimodalLiveClient } from "../lib/multimodal-live-clients";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/utils";
import VolMeterWorket from "../lib/worklets/vol-meter";

export function useLiveAPI({ url, apiKey }) {
  // console.log("Initializing useLiveAPI with URL:", url, "and API Key:", apiKey);

  const client = useMemo(
    () => new MultimodalLiveClient({ url, apiKey }),
    [url, apiKey]
  );
  const audioStreamerRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState({
    model: "models/gemini-2.0-flash-exp",
  });
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    // console.log("Setting up audio streamer...");
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" })
        .then((audioCtx) => {
          // console.log("AudioContext initialized:", audioCtx);
          audioStreamerRef.current = new AudioStreamer(audioCtx);

          audioStreamerRef.current
            .addWorklet("vumeter-out", VolMeterWorket, (ev) => {
              // console.log("Volume meter event:", ev.data.volume);
              setVolume(ev.data.volume);
            })
            .then(() => {
              // console.log("Audio worklet added successfully.");
            });
        })
        .catch((error) => {
          console.error("Error initializing AudioContext:", error);
        });
    }
  }, []);

  useEffect(() => {
    const onClose = () => {
      // console.log("WebSocket closed.");
      setConnected(false);
    };

    const stopAudioStreamer = () => {
      // console.log("Stopping audio streamer.");
      audioStreamerRef.current?.stop();
    };

    const onAudio = (data) => {
      // console.log("Audio data received in onAudio:", data);
      if (audioStreamerRef.current) {
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      } else {
        console.warn("AudioStreamer not initialized.");
      }
    };

    // console.log("Setting up client event listeners...");
    client
      .on("close", onClose)
      .on("interrupted", stopAudioStreamer)
      .on("audio", onAudio);

    return () => {
      // console.log("Cleaning up client event listeners...");
      client
        .off("close", onClose)
        .off("interrupted", stopAudioStreamer)
        .off("audio", onAudio);
    };
  }, [client]);

  const connect = useCallback(async () => {
    // console.log("Connecting to server with config:", config);
    if (!config) {
      console.error("Config is not set.");
      throw new Error("Config has not been set.");
    }
    client.disconnect();
    try {
      await client.connect(config);
      // console.log("Connected to server.");
      setConnected(true);
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  }, [client, config]);

  const disconnect = useCallback(() => {
    // console.log("Disconnecting from server...");
    client.disconnect();
    setConnected(false);
  }, [client]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    volume,
  };
}
