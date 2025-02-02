import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_KEY, uri } from "../../constants";
import { LiveAPIProvider } from "../../contexts/LiveAPIContext";
import ControlTray from "../../components/shared/ControlTray";
import { VitalsCheck } from "../../components/shared/Vitals";

function EspForm() {
  const [espIp, setEspIp] = useState("");

  const schema = z.object({
    espIp: z.coerce
      .number()
      .int()
      .min(0, "IP address must be a positive integer"),
  });

  // Form State
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      espIp: "",
    },
  });

  const onSubmit = async (data) => {
    localStorage.setItem("espIp", data.espIp.toString());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input
        type="text"
        className="border rounded-sm p-2"
        placeholder="Enter ESP32 IP"
        {...register("espIp")}
      />
      {errors.espIp && (
        <p className="text-red-600 text-sm mt-1">{errors.espIp.message}</p>
      )}
      <button type="submit" className="p-2 bg-green-700 rounded-md text-white">
        Submit
      </button>
    </form>
  );
}

const Home = () => {
  const videoRef = useRef(null);

  const [videoStream, setVideoStream] = useState(null);

  if (!API_KEY) {
    throw new Error(
      "API key is required to use the StreamingConsole component."
    );
  }
  return (
    <section className="relative flex flex-col gap-5 items-center w-full h-[99lvh] p-5">
      <h1 className="text-5xl font-extrabold ">HIRO</h1>
      <EspForm />
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <div className="flex w-full flex-col items-center gap-5">
          <video
            className={"border w-fit max-h-[70lvh]"}
            ref={videoRef}
            autoPlay
            playsInline
          />
          <VitalsCheck />
          <div className="absolute bottom-10">
            <ControlTray
              videoRef={videoRef}
              onVideoStreamChange={setVideoStream}
            />
          </div>
        </div>
      </LiveAPIProvider>
    </section>
  );
};

export default Home;
