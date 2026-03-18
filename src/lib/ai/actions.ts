"use client";

import type { AIAction } from "@/types/ai";
import type { Module, Field } from "@/types/crm";
import { useWorkspaceStore } from "@/lib/stores/workspace";

function generateId(): string {
  return crypto.randomUUID();
}

export function executeActions(actions: AIAction[]) {
  const store = useWorkspaceStore.getState();

  for (const action of actions) {
    switch (action.type) {
      case "create_module": {
        const p = action.payload as {
          name: string;
          slug: string;
          icon: string;
          description?: string;
          fields?: Omit<Field, "id" | "moduleId">[];
        };
        const moduleId = generateId();
        const fields: Field[] = (p.fields || []).map((f, i) => ({
          id: generateId(),
          moduleId,
          name: f.name,
          slug: f.slug,
          type: f.type,
          options: f.options,
          required: f.required ?? false,
          order: f.order ?? i,
        }));

        const module: Module = {
          id: moduleId,
          workspaceId: "default",
          name: p.name,
          slug: p.slug,
          icon: p.icon,
          description: p.description,
          order: store.modules.length,
          fields,
        };
        store.addModule(module);
        break;
      }

      case "add_field": {
        const p = action.payload as {
          module: string; // slug
          name: string;
          slug: string;
          type: string;
          options?: Record<string, unknown>;
          required?: boolean;
        };
        const mod = store.modules.find((m) => m.slug === p.module);
        if (mod) {
          const field: Field = {
            id: generateId(),
            moduleId: mod.id,
            name: p.name,
            slug: p.slug,
            type: p.type as Field["type"],
            options: p.options,
            required: p.required ?? false,
            order: mod.fields.length,
          };
          store.addField(mod.id, field);
        }
        break;
      }

      case "delete_module": {
        const p = action.payload as { slug: string };
        const mod = store.modules.find((m) => m.slug === p.slug);
        if (mod) store.removeModule(mod.id);
        break;
      }

      case "create_record": {
        const p = action.payload as {
          module: string;
          data: Record<string, unknown>;
        };
        const mod = store.modules.find((m) => m.slug === p.module);
        if (mod) {
          store.addRecord(mod.id, {
            id: generateId(),
            moduleId: mod.id,
            data: p.data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "user",
          });
        }
        break;
      }

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }
}
