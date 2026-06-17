import { Page, BackLink } from "@/components/ui";
import Dictee from "@/components/Dictee";

export const metadata = { title: "La dictée — Mon Piano des mots" };

export default function DicteePage() {
  return (
    <Page>
      <div className="mb-3 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">La dictée muette ✍️</h1>
      </div>
      <p className="mb-4 text-center text-sm font-bold text-ink-soft">
        Regarde l'image, écoute le mot, puis écris-le avec les lettres.
      </p>
      <Dictee />
    </Page>
  );
}
