"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** Conteneur de page centré (max 640px, comme une feuille de cahier). */
export function Page({ children }: { children: ReactNode }) {
  return (
    <main
      id="contenu"
      className="mx-auto w-full max-w-[640px] px-4 pb-24 pt-5 sm:px-5"
    >
      {children}
    </main>
  );
}

/** Lien de retour (grosse cible tactile). */
export function BackLink({ href, label = "Retour" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-tap items-center gap-2 rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 text-sm font-extrabold text-ink-soft shadow-softs"
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 shadow-softs ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  badge,
  color = "#F2785C",
  title,
  sub,
}: {
  badge: ReactNode;
  color?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <div
        className="grid h-11 w-11 flex-none place-items-center rounded-2xl font-display text-xl font-bold text-white shadow-softs"
        style={{ background: color }}
        aria-hidden
      >
        {badge}
      </div>
      <div>
        <h2 className="m-0 font-display text-xl font-semibold text-ink">{title}</h2>
        {sub && <div className="mt-0.5 text-xs font-bold text-ink-soft">{sub}</div>}
      </div>
    </div>
  );
}

/** Gros bouton tactile principal. */
export function BigButton({
  children,
  onClick,
  href,
  color = "#7BB36A",
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  color?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const cls = `inline-flex min-h-tap items-center justify-center gap-2 rounded-xl2 px-5 py-3 text-center font-display text-lg font-semibold text-white shadow-soft transition-transform active:scale-95 ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls} style={{ background: color }} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls} style={{ background: color }} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/** Tuile de menu de l'accueil. */
export function Tile({
  href,
  emoji,
  title,
  sub,
  color,
}: {
  href: string;
  emoji: string;
  title: string;
  sub?: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-tap items-center gap-3 rounded-xl2 border-2 border-[#F1E2CB] bg-white p-3 shadow-softs transition-transform active:scale-[0.98]"
    >
      <span
        className="grid h-12 w-12 flex-none place-items-center rounded-2xl text-2xl"
        style={{ background: color }}
        aria-hidden
      >
        {emoji}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-base font-semibold text-ink">{title}</span>
        {sub && <span className="block text-xs font-bold text-ink-soft">{sub}</span>}
      </span>
    </Link>
  );
}
