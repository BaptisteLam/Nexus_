"use client";

import { useState } from "react";
import type { Module } from "@/types/crm";
import { useWorkspaceStore } from "@/lib/stores/workspace";
import { TableView } from "./TableView";
import { RecordForm } from "./RecordForm";
import { Button } from "@/components/ui/button";
import { Plus, Filter, SortAsc } from "lucide-react";
import { motion } from "framer-motion";

interface ModuleRendererProps {
  module: Module;
}

export function ModuleRenderer({ module }: ModuleRendererProps) {
  const [formOpen, setFormOpen] = useState(false);
  const records = useWorkspaceStore((s) => s.records[module.id] ?? []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">{module.name}</h1>
          {module.description && (
            <p className="mt-0.5 text-sm text-zinc-500">{module.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-zinc-400">
            <Filter className="h-3.5 w-3.5" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-zinc-400">
            <SortAsc className="h-3.5 w-3.5" />
            Trier
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Nouveau
          </Button>
        </div>
      </div>

      {/* Table view (default) */}
      <TableView module={module} records={records} />

      {/* Record creation dialog */}
      <RecordForm module={module} open={formOpen} onOpenChange={setFormOpen} />
    </motion.div>
  );
}
