"use client";

import { useState } from "react";
import type { Son } from "@/data/types";
import { keepDecodable } from "@/lib/progression";
import { useProgress, useSettings, type AideLevel } from "@/lib/store";
import StoryReader from "@/components/reading/StoryReader";
import AideToggle from "@/components/reading/AideToggle";

export default function HistoireReader({ son }: { son: Son }) {
  const { setFluence, progress } = useProgress();
  const { settings } = useSettings();
  const [aide, setAide] = useState<AideLevel>(settings.aide);
  const lines = keepDecodable(son.content.histoire?.lignes || [], son.index);
  const best = progress.fluence[son.id];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <AideToggle value={aide} onChange={setAide} />
        {best ? (
          <span className="text-xs font-extrabold text-grass-dark">⏱️ record : {best} mots/min</span>
        ) : null}
      </div>
      <StoryReader
        title={son.content.histoire?.titre || "Mon histoire"}
        lines={lines}
        aide={aide}
        onFluence={(wpm) => setFluence(son.id, wpm)}
      />
    </div>
  );
}
