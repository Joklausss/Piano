import { Page, BackLink } from "@/components/ui";
import FreePiano from "@/components/FreePiano";

export const metadata = { title: "Le piano — Mon Piano des mots" };

export default function PianoPage() {
  return (
    <Page>
      <div className="mb-4 flex items-center justify-between">
        <BackLink href="/" label="Accueil" />
        <h1 className="font-display text-xl font-bold text-ink">Le piano 🎹</h1>
      </div>
      <FreePiano />
    </Page>
  );
}
