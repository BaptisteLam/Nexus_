"use client";

import { executeActions } from "@/lib/ai/actions";
import type { AIAction } from "@/types/ai";

/**
 * ActionExecutor — receives AI actions and mutates the workspace store.
 * This is a utility component/hook, not visual.
 */
export function useActionExecutor() {
  return {
    execute: (actions: AIAction[]) => {
      executeActions(actions);
    },
  };
}
