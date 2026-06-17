import { Page, BackLink } from "@/components/ui";
import HistoiresList from "@/components/HistoiresList";

export const metadata = { title: "Les histoires — Mon Piano des mots" };

export default function HistoiresPage() {
  return (
    <Page>
      <div className="mb-3 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">Mes histoires 📚</h1>
      </div>
      <p className="mb-4 text-center text-sm font-bold text-ink-soft">
        Des histoires 100 % déchiffrables, juste pour le plaisir de lire.
      </p>
      <HistoiresList />
    </Page>
  );
}
