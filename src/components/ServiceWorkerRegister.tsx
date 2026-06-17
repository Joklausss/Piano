"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker pour le mode hors-ligne (PWA).
 * Sans effet en développement ou si le navigateur ne supporte pas les SW.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* hors-ligne indisponible — l'app reste utilisable en ligne */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
