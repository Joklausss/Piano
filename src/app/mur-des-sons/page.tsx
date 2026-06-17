import { Page, BackLink } from "@/components/ui";
import MurDesSons from "@/components/MurDesSons";

export const metadata = { title: "Le mur des sons — Mon Piano des mots" };

export default function MurPage() {
  return (
    <Page>
      <div className="mb-3 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">Le mur des sons 🧱</h1>
      </div>
      <p className="mb-4 text-center text-sm font-bold text-ink-soft">
        Toutes tes cartes-sons. Touche une carte pour entendre le son.
      </p>
      <MurDesSons />
    </Page>
  );
}
