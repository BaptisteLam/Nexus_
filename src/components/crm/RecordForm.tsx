"use client";

import { useState } from "react";
import type { Module } from "@/types/crm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkspaceStore } from "@/lib/stores/workspace";

interface RecordFormProps {
  module: Module;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecordForm({ module, open, onOpenChange }: RecordFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const addRecord = useWorkspaceStore((s) => s.addRecord);
  const fields = [...module.fields].sort((a, b) => a.order - b.order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecord(module.id, {
      id: crypto.randomUUID(),
      moduleId: module.id,
      data: formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user",
    });
    setFormData({});
    onOpenChange(false);
  };

  const updateField = (slug: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [slug]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-zinc-950 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">
            Nouveau {module.name.replace(/s$/, "")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-400">
                {field.name}
                {field.required && <span className="ml-1 text-red-400">*</span>}
              </label>
              {renderFieldInput(field, formData[field.slug], (v) =>
                updateField(field.slug, v)
              )}
            </div>
          ))}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function renderFieldInput(
  field: { type: string; options?: Record<string, unknown> },
  value: unknown,
  onChange: (value: unknown) => void
) {
  switch (field.type) {
    case "text":
    case "phone":
    case "url":
      return (
        <Input
          type={field.type === "url" ? "url" : field.type === "phone" ? "tel" : "text"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900 border-border"
        />
      );

    case "email":
      return (
        <Input
          type="email"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900 border-border"
        />
      );

    case "number":
    case "currency":
    case "percent":
      return (
        <Input
          type="number"
          value={String(value ?? "")}
          onChange={(e) => onChange(Number(e.target.value))}
          className="bg-zinc-900 border-border"
        />
      );

    case "date":
      return (
        <Input
          type="date"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900 border-border"
        />
      );

    case "datetime":
      return (
        <Input
          type="datetime-local"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900 border-border"
        />
      );

    case "select": {
      const choices =
        (field.options as { choices?: { label: string; value: string }[] })
          ?.choices ?? [];
      return (
        <Select
          value={String(value ?? "")}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger className="bg-zinc-900 border-border">
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent>
            {choices.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    case "checkbox":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-600"
          />
        </label>
      );

    default:
      return (
        <Input
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-900 border-border"
        />
      );
  }
}
