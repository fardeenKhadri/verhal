export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (typeof API_KEY !== "string") {
  throw new Error("Set REACT_APP_GEMINI_API_KEY in the .env file.");
}

export const host = "generativelanguage.googleapis.com";
export const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;
