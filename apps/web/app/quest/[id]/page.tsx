import { notFound } from "next/navigation";
import { getQuestById } from "@/lib/questParser";
import QuestPlayClient from "@/components/QuestPlayClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestPlayPage({ params }: PageProps) {
  const { id } = await params;
  const quest = getQuestById(id);

  if (!quest) {
    notFound();
  }

  return (
    <QuestPlayClient
      meta={quest.meta}
      instructions={quest.instructions}
      starterCode={quest.starterCode}
      testCode={quest.testCode}
    />
  );
}
