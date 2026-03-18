"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace";
import { Sparkles, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkspacePage() {
  const modules = useWorkspaceStore((s) => s.modules);

  if (modules.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              Bienvenue sur Nexus
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
              Décrivez votre activité et je créerai votre CRM sur mesure.
              Commencez par me dire quels types de données vous souhaitez gérer.
            </p>
          </div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-zinc-600"
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Dashboard with module overview
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {modules.length} module{modules.length > 1 ? "s" : ""} dans votre CRM
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <motion.a
            key={mod.id}
            href={`/workspace/${mod.slug}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
            className="group rounded-xl border border-border bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="mb-3 text-sm font-medium text-zinc-100">
              {mod.name}
            </div>
            {mod.description && (
              <p className="text-xs text-zinc-500">{mod.description}</p>
            )}
            <div className="mt-3 text-xs text-zinc-600">
              {mod.fields.length} champ{mod.fields.length > 1 ? "s" : ""}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
