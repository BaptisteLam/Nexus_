"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace";
import { Sparkles, ArrowDown, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkspacePage() {
  const modules = useWorkspaceStore((s) => s.modules);

  if (modules.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-8 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800/60 bg-zinc-900/50">
              <Sparkles className="h-9 w-9 text-blue-400" />
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-blue-500/5 blur-xl" />
          </motion.div>

          {/* Text */}
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              Bienvenue sur Nexus
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
              Décrivez votre activité et je créerai votre CRM sur mesure.
              <br />
              <span className="text-zinc-600">
                Essayez : &quot;Je veux gérer mes contacts et mes deals&quot;
              </span>
            </p>
          </div>

          {/* Arrow pointing to prompt bar */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-zinc-700"
          >
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Dashboard with module cards
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {modules.length} module{modules.length > 1 ? "s" : ""} dans votre CRM
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod, i) => (
          <motion.a
            key={mod.id}
            href={`/workspace/${mod.slug}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all duration-200 hover:border-zinc-700/60 hover:bg-zinc-900/60"
          >
            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800/60 bg-zinc-800/40">
                  <Layers className="h-4 w-4 text-zinc-400" />
                </div>
                <span className="text-sm font-medium text-zinc-200">
                  {mod.name}
                </span>
              </div>
              {mod.description && (
                <p className="mb-3 text-xs leading-relaxed text-zinc-500">
                  {mod.description}
                </p>
              )}
              <div className="text-[11px] font-medium text-zinc-600">
                {mod.fields.length} champ{mod.fields.length > 1 ? "s" : ""}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
