import { notFound } from "next/navigation";
import { SONS, getSon } from "@/lib/progression";
import { Page } from "@/components/ui";
import Lesson from "@/components/lesson/Lesson";

export function generateStaticParams() {
  return SONS.map((s) => ({ son: s.id }));
}

export default function LessonPage({ params }: { params: { son: string } }) {
  const son = getSon(params.son);
  if (!son) notFound();
  return (
    <Page>
      <Lesson son={son} />
    </Page>
  );
}
