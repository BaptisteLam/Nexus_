"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkspaceStore } from "@/lib/stores/workspace";
import { ModuleRenderer } from "@/components/crm/ModuleRenderer";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ModulePage() {
  const params = useParams();
  const slug = params.moduleSlug as string;
  const modules = useWorkspaceStore((s) => s.modules);
  const setActiveModule = useWorkspaceStore((s) => s.setActiveModule);

  const module = modules.find((m) => m.slug === slug);

  useEffect(() => {
    setActiveModule(slug);
    return () => setActiveModule(null);
  }, [slug, setActiveModule]);

  if (!module) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <Sparkles className="h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">
            Module introuvable. Utilisez l&apos;IA pour en créer un.
          </p>
        </motion.div>
      </div>
    );
  }

  return <ModuleRenderer module={module} />;
}
