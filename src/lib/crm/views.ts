"use client";

import type { View, ViewType } from "@/types/crm";

export function getDefaultView(moduleId: string): View {
  return {
    id: "default",
    moduleId,
    type: "table" as ViewType,
    config: {},
  };
}
