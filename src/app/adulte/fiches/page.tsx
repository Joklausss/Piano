import { Page, BackLink } from "@/components/ui";
import PrintFiches from "@/components/PrintFiches";

export const metadata = { title: "Fiches à imprimer — Mon Piano des mots" };

export default function FichesPage() {
  return (
    <Page>
      <div className="no-print mb-3 flex items-center justify-between print:hidden">
        <BackLink href="/adulte" label="Espace adulte" />
        <h1 className="font-display text-xl font-bold text-ink">Fiches 🖨️</h1>
      </div>
      <PrintFiches />
    </Page>
  );
}
