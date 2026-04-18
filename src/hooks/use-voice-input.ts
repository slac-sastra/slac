"use client";

import { useState, useRef, useCallback } from "react";

const SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text";
const SARVAM_API_KEY = process.env.NEXT_PUBLIC_SARVAM_API_KEY || "";

interface UseVoiceInputOptions {
  /** Language hint — "ta-IN" for Tamil, "unknown" for auto-detect */
  languageCode?: string;
  /** Called with the final transcript text */
  onTranscript: (text: string) => void;
}

interface UseVoiceInputReturn {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export function useVoiceInput({
  languageCode = "unknown",
  onTranscript,
}: UseVoiceInputOptions): UseVoiceInputReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    // Stop all tracks on the mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const sendToSarvam = useCallback(
    async (audioBlob: Blob) => {
      setIsProcessing(true);
      setError(null);

      try {
        const formData = new FormData();
        // Sarvam expects a file field; use .webm since MediaRecorder outputs WebM
        formData.append("file", audioBlob, "recording.webm");
        formData.append("model", "saaras:v3");
        formData.append("language_code", languageCode);

        const res = await fetch(SARVAM_STT_URL, {
          method: "POST",
          headers: {
            "api-subscription-key": SARVAM_API_KEY,
          },
          body: formData,
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Sarvam STT error (${res.status}): ${errBody}`);
        }

        const data = await res.json();
        const transcript = (data.transcript || "").trim();

        if (transcript) {
          onTranscript(transcript);
        } else {
          setError("No speech detected. Try again.");
        }
      } catch (err: unknown) {
        console.error("STT Error:", err);
        const message =
          err instanceof Error ? err.message : "Speech recognition failed";
        setError(message);
      } finally {
        setIsProcessing(false);
      }
    },
    [languageCode, onTranscript]
  );

  const startRecording = useCallback(async () => {
    setError(null);

    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support microphone access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Prefer webm/opus; fall back to whatever is available
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Sarvam rejects codec-qualified types like "audio/webm;codecs=opus"
        // so we always re-wrap with the bare "audio/webm" MIME type
        const sarvamSafeMime = "audio/webm";
        const blob = new Blob(chunksRef.current, { type: sarvamSafeMime });
        cleanup();
        // Only send if we have meaningful audio (> 1 KB)
        if (blob.size > 1024) {
          sendToSarvam(blob);
        } else {
          setError("Recording too short. Please try again.");
        }
      };

      recorder.onerror = () => {
        setError("Recording error. Please try again.");
        setIsRecording(false);
        cleanup();
      };

      // Collect data every 250ms
      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err: unknown) {
      console.error("Mic Error:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Microphone permission denied. Please allow access.");
      } else {
        setError("Could not access microphone.");
      }
    }
  }, [cleanup, sendToSarvam]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  return { isRecording, isProcessing, error, startRecording, stopRecording };
}
