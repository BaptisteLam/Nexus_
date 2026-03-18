"use client";

import type { Module, CrmRecord } from "@/types/crm";
import { FieldRenderer } from "./FieldRenderer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";

interface TableViewProps {
  module: Module;
  records: CrmRecord[];
}

export function TableView({ module, records }: TableViewProps) {
  const fields = [...module.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-900/50 hover:bg-zinc-900/50">
            {fields.map((field) => (
              <TableHead
                key={field.id}
                className="h-9 text-xs font-medium uppercase tracking-wider text-zinc-500"
              >
                {field.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={fields.length}
                  className="h-32 text-center text-sm text-zinc-600"
                >
                  Aucun enregistrement. Ajoutez-en un avec le bouton ci-dessus.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="border-b border-border hover:bg-white/[0.02] cursor-pointer"
                >
                  {fields.map((field) => (
                    <TableCell key={field.id} className="py-2.5 text-sm">
                      <FieldRenderer
                        field={field}
                        value={record.data[field.slug]}
                      />
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
