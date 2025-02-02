import { useEffect, useState, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

const systemInstructionObject = {
  parts: [
    {
      text: `You are a friendly personal health care companion. Help the user by guiding them through navigation and answering their health queries in a supportive manner.`,
    },
  ],
};

function Vitals() {
  const { client, setConfig, connect, connected } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: systemInstructionObject,
    });
  }, [setConfig]);

  const [isAwaitingFirstResponse, setIsAwaitingFirstResponse] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  const connectAndSend = async (message) => {
    setIsAwaitingFirstResponse(true);
    if (!connected) await connect();
    client.send({ text: message });
  };

  const renderInitialScreen = () => (
    <div className="initial-screen">
      {!isAwaitingFirstResponse && (
        <>
          <div className="spacer"></div>
          <input
            type="text"
            value={initialMessage}
            className="initialMessageInput"
            placeholder="type or say something..."
            onChange={(e) => setInitialMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              connectAndSend(
                `Hey friend, I need some health advice: ${initialMessage}`
              )
            }
          />
        </>
      )}
    </div>
  );

  return <div className="app">{renderInitialScreen()}</div>;
}

export const VitalsCheck = memo(Vitals);
