"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace";

export function useRecords(moduleId: string) {
  return useWorkspaceStore((s) => s.records[moduleId] ?? []);
}
