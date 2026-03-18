"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace";
import type { CrmRecord } from "@/types/crm";

export function getRecords(moduleId: string): CrmRecord[] {
  return useWorkspaceStore.getState().records[moduleId] ?? [];
}

export function createRecord(moduleId: string, data: Record<string, unknown>): CrmRecord {
  const record: CrmRecord = {
    id: crypto.randomUUID(),
    moduleId,
    data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "user",
  };
  useWorkspaceStore.getState().addRecord(moduleId, record);
  return record;
}
