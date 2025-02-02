/**
 * This module contains type definitions and type guards for multimodal live types.
 */

// Definitions

/* Outgoing types */

/**
 * The config to initiate the session
 */
export const LiveConfigDefaults = {
  model: "",
  systemInstruction: { parts: [] },
  generationConfig: {},
  tools: [],
};

export const LiveGenerationConfigDefaults = {
  responseModalities: "text",
  speechConfig: {
    voiceConfig: {
      prebuiltVoiceConfig: {
        voiceName: "",
      },
    },
  },
};

export const LiveOutgoingMessageTypes = [
  "SetupMessage",
  "ClientContentMessage",
  "RealtimeInputMessage",
  "ToolResponseMessage",
];

/** Incoming types */
export const LiveIncomingMessageTypes = [
  "ToolCallCancellationMessage",
  "ToolCallMessage",
  "ServerContentMessage",
  "SetupCompleteMessage",
];

// Log types
export const StreamingLogDefaults = {
  date: new Date(),
  type: "",
  count: 0,
  message: "",
};

// Type Guards

const prop = (a, prop, kind = "object") =>
  typeof a === "object" && typeof a[prop] === kind;

// Outgoing messages
export const isSetupMessage = (a) => prop(a, "setup");

export const isClientContentMessage = (a) => prop(a, "clientContent");

export const isRealtimeInputMessage = (a) => prop(a, "realtimeInput");

export const isToolResponseMessage = (a) => prop(a, "toolResponse");

// Incoming messages
export const isSetupCompleteMessage = (a) => prop(a, "setupComplete");

export const isServerContenteMessage = (a) => prop(a, "serverContent");

export const isToolCallMessage = (a) => prop(a, "toolCall");

export const isToolCallCancellationMessage = (a) =>
  prop(a, "toolCallCancellation") &&
  isToolCallCancellation(a.toolCallCancellation);

export const isModelTurn = (a) =>
  typeof a === "object" && a && typeof a.modelTurn === "object";

export const isTurnComplete = (a) =>
  typeof a === "object" && a && typeof a.turnComplete === "boolean";

export const isInterrupted = (a) =>
  typeof a === "object" && a && a.interrupted === true;

export function isToolCall(value) {
  if (!value || typeof value !== "object") return false;

  const candidate = value;

  return (
    Array.isArray(candidate.functionCalls) &&
    candidate.functionCalls.every((call) => isLiveFunctionCall(call))
  );
}

export function isToolResponse(value) {
  if (!value || typeof value !== "object") return false;

  const candidate = value;

  return (
    Array.isArray(candidate.functionResponses) &&
    candidate.functionResponses.every((resp) => isLiveFunctionResponse(resp))
  );
}

export function isLiveFunctionCall(value) {
  if (!value || typeof value !== "object") return false;

  const candidate = value;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.id === "string" &&
    typeof candidate.args === "object" &&
    candidate.args !== null
  );
}

export function isLiveFunctionResponse(value) {
  if (!value || typeof value !== "object") return false;

  const candidate = value;

  return (
    typeof candidate.response === "object" && typeof candidate.id === "string"
  );
}

export const isToolCallCancellation = (a) =>
  typeof a === "object" && Array.isArray(a.ids);
