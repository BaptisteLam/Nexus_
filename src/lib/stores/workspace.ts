"use client";

import { create } from "zustand";
import type { Module, Field, CrmRecord } from "@/types/crm";

interface WorkspaceState {
  modules: Module[];
  records: Record<string, CrmRecord[]>; // keyed by moduleId
  activeModuleSlug: string | null;

  addModule: (module: Module) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  removeModule: (id: string) => void;

  addField: (moduleId: string, field: Field) => void;
  updateField: (moduleId: string, fieldId: string, updates: Partial<Field>) => void;
  removeField: (moduleId: string, fieldId: string) => void;

  addRecord: (moduleId: string, record: CrmRecord) => void;
  updateRecord: (moduleId: string, recordId: string, data: Record<string, unknown>) => void;
  removeRecord: (moduleId: string, recordId: string) => void;

  setActiveModule: (slug: string | null) => void;
  getModuleBySlug: (slug: string) => Module | undefined;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  modules: [],
  records: {},
  activeModuleSlug: null,

  addModule: (module) =>
    set((state) => ({ modules: [...state.modules, module] })),

  updateModule: (id, updates) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  removeModule: (id) =>
    set((state) => ({
      modules: state.modules.filter((m) => m.id !== id),
      records: Object.fromEntries(
        Object.entries(state.records).filter(([key]) => key !== id)
      ),
    })),

  addField: (moduleId, field) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId ? { ...m, fields: [...m.fields, field] } : m
      ),
    })),

  updateField: (moduleId, fieldId, updates) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              fields: m.fields.map((f) =>
                f.id === fieldId ? { ...f, ...updates } : f
              ),
            }
          : m
      ),
    })),

  removeField: (moduleId, fieldId) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? { ...m, fields: m.fields.filter((f) => f.id !== fieldId) }
          : m
      ),
    })),

  addRecord: (moduleId, record) =>
    set((state) => ({
      records: {
        ...state.records,
        [moduleId]: [...(state.records[moduleId] || []), record],
      },
    })),

  updateRecord: (moduleId, recordId, data) =>
    set((state) => ({
      records: {
        ...state.records,
        [moduleId]: (state.records[moduleId] || []).map((r) =>
          r.id === recordId ? { ...r, data: { ...r.data, ...data }, updatedAt: new Date().toISOString() } : r
        ),
      },
    })),

  removeRecord: (moduleId, recordId) =>
    set((state) => ({
      records: {
        ...state.records,
        [moduleId]: (state.records[moduleId] || []).filter(
          (r) => r.id !== recordId
        ),
      },
    })),

  setActiveModule: (slug) => set({ activeModuleSlug: slug }),

  getModuleBySlug: (slug) => get().modules.find((m) => m.slug === slug),
}));
