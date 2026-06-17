"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isAudioEnabled,
  setAudioEnabled,
  speak,
  stopSpeaking,
} from "@/lib/audio";

/** Accès à l'audio + état global activé/coupé synchronisé. */
export function useAudio() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isAudioEnabled());
    const handler = () => setEnabled(isAudioEnabled());
    window.addEventListener("mpm-audio", handler);
    return () => window.removeEventListener("mpm-audio", handler);
  }, []);

  const toggle = useCallback(() => setAudioEnabled(!isAudioEnabled()), []);

  return { enabled, toggle, speak, stop: stopSpeaking };
}
