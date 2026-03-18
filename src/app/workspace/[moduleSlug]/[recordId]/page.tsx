"use client";

import { useParams } from "next/navigation";

export default function RecordDetailPage() {
  const params = useParams();

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-zinc-500">
        Détail de l&apos;enregistrement {params.recordId} — À venir
      </p>
    </div>
  );
}
