import { Page, BackLink } from "@/components/ui";
import AtelierSyllabes from "@/components/AtelierSyllabes";

export const metadata = { title: "Atelier de syllabes — Mon Piano des mots" };

export default function AtelierPage() {
  return (
    <Page>
      <div className="mb-3 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">Atelier de syllabes 🔤</h1>
      </div>
      <AtelierSyllabes />
    </Page>
  );
}
