import { Page, BackLink } from "@/components/ui";
import EspaceAdulte from "@/components/EspaceAdulte";

export const metadata = { title: "Espace adulte — Mon Piano des mots" };

export default function AdultePage() {
  return (
    <Page>
      <div className="mb-3 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">Espace adulte 👩‍🏫</h1>
      </div>
      <EspaceAdulte />
    </Page>
  );
}
