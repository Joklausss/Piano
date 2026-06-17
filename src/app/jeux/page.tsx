import { Page, BackLink } from "@/components/ui";
import Jeux from "@/components/Jeux";

export const metadata = { title: "Jeux & défis — Mon Piano des mots" };

export default function JeuxPage() {
  return (
    <Page>
      <div className="mb-3 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">Jeux & défis 🎲</h1>
      </div>
      <Jeux />
    </Page>
  );
}
