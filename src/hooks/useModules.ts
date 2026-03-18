"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace";

export function useModules() {
  return useWorkspaceStore((s) => s.modules);
}

export function useModule(slug: string) {
  return useWorkspaceStore((s) => s.modules.find((m) => m.slug === slug));
}
