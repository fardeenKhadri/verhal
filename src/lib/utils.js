const map = new Map();

export const audioContext = (() => {
  const didInteract = new Promise((resolve) => {
    window.addEventListener("pointerdown", resolve, { once: true });
    window.addEventListener("keydown", resolve, { once: true });
  });

  return async (options) => {
    try {
      const a = new Audio();
      a.src =
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      await a.play();
      if (options?.id && map.has(options.id)) {
        const ctx = map.get(options.id);
        if (ctx) {
          return ctx;
        }
      }
      const ctx = new AudioContext(options);
      if (options?.id) {
        map.set(options.id, ctx);
      }
      return ctx;
    } catch (e) {
      await didInteract;
      if (options?.id && map.has(options.id)) {
        const ctx = map.get(options.id);
        if (ctx) {
          return ctx;
        }
      }
      const ctx = new AudioContext(options);
      if (options?.id) {
        map.set(options.id, ctx);
      }
      return ctx;
    }
  };
})();

export const blobToJSON = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        try {
          const json = JSON.parse(reader.result);
          resolve(json);
        } catch (error) {
          reject(`Error parsing JSON: ${error}`);
        }
      } else {
        reject("Error reading blob");
      }
    };
    reader.readAsText(blob);
  });

export function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function createMediaStreamFromImage(url) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Ensures CORS handling

  return new Promise((resolve) => {
    let animationFrameId;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Capture the canvas as a video stream
      const stream = canvas.captureStream(30); // Approximate 30 FPS

      function updateFrame() {
        img.src = `${url}?t=${Date.now()}`; // Force refresh image

        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          animationFrameId = requestAnimationFrame(updateFrame);
        };
      }

      updateFrame(); // Start frame updates

      // Attach a cleanup function to properly stop the stream
      stream._stopUpdating = () => {
        cancelAnimationFrame(animationFrameId);
      };

      resolve(stream);
    };

    img.src = `${url}?t=${Date.now()}`; // Load the first frame
  });
}
