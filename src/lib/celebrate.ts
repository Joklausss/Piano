// Petite célébration (confettis) — sans pression, juste du renforcement positif.

export function celebrate(x?: number, y?: number): void {
  if (typeof document === "undefined") return;
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  } catch {}
  const cx = x ?? window.innerWidth / 2;
  const cy = y ?? window.innerHeight / 3;
  const emojis = ["⭐", "🎉", "💛", "✨", "🌟", "🎵"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "burst";
    s.textContent = emojis[i % emojis.length];
    s.style.left = cx + (Math.random() * 130 - 65) + "px";
    s.style.top = cy + (Math.random() * 40 - 20) + "px";
    document.body.appendChild(s);
    window.setTimeout(() => s.remove(), 1000);
  }
}
