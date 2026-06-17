"use client";

import { useEffect } from "react";
import { initCloudSync } from "@/lib/cloud";

/** Démarre la synchronisation cloud (sans effet si Supabase n'est pas configuré). */
export default function CloudSync() {
  useEffect(() => {
    initCloudSync();
  }, []);
  return null;
}
