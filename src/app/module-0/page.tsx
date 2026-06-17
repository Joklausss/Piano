import { Page, BackLink } from "@/components/ui";
import Module0 from "@/components/Module0";

export const metadata = { title: "Avant de lire — Mon Piano des mots" };

export default function Module0Page() {
  return (
    <Page>
      <div className="mb-3 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">Avant de lire 🧩</h1>
      </div>
      <Module0 />
    </Page>
  );
}
