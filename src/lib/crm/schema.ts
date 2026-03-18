"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace";
import type { Module, Field } from "@/types/crm";

export function getModules(): Module[] {
  return useWorkspaceStore.getState().modules;
}

export function getModuleBySlug(slug: string): Module | undefined {
  return useWorkspaceStore.getState().modules.find((m) => m.slug === slug);
}

export function getFieldsForModule(moduleId: string): Field[] {
  const mod = useWorkspaceStore.getState().modules.find((m) => m.id === moduleId);
  return mod?.fields ?? [];
}
