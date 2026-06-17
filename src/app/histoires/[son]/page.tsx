import { notFound } from "next/navigation";
import { SONS, getSon } from "@/lib/progression";
import { Page, BackLink } from "@/components/ui";
import HistoireReader from "@/components/HistoireReader";

export function generateStaticParams() {
  return SONS.filter((s) => (s.content.histoire?.lignes?.length ?? 0) > 0).map((s) => ({
    son: s.id,
  }));
}

export default function HistoirePage({ params }: { params: { son: string } }) {
  const son = getSon(params.son);
  if (!son) notFound();
  return (
    <Page>
      <div className="mb-3">
        <BackLink href="/histoires" label="Les histoires" />
      </div>
      <HistoireReader son={son} />
    </Page>
  );
}
