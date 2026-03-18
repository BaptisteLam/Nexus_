"use client";

import type { Field } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, X } from "lucide-react";

interface FieldRendererProps {
  field: Field;
  value: unknown;
}

export function FieldRenderer({ field, value }: FieldRendererProps) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-zinc-600">—</span>;
  }

  switch (field.type) {
    case "text":
    case "phone":
    case "url":
      return <span className="truncate">{String(value)}</span>;

    case "email":
      return (
        <span className="truncate text-blue-400">{String(value)}</span>
      );

    case "number":
      return <span className="font-mono text-sm">{Number(value).toLocaleString("fr-FR")}</span>;

    case "currency":
      return (
        <span className="font-mono text-sm">
          {Number(value).toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </span>
      );

    case "percent":
      return <span className="font-mono text-sm">{Number(value)}%</span>;

    case "date":
      try {
        return (
          <span className="text-sm">
            {format(new Date(String(value)), "dd MMM yyyy", { locale: fr })}
          </span>
        );
      } catch {
        return <span>{String(value)}</span>;
      }

    case "datetime":
      try {
        return (
          <span className="text-sm">
            {format(new Date(String(value)), "dd MMM yyyy HH:mm", {
              locale: fr,
            })}
          </span>
        );
      } catch {
        return <span>{String(value)}</span>;
      }

    case "select": {
      const choices =
        (field.options as { choices?: { label: string; value: string; color: string }[] })
          ?.choices ?? [];
      const choice = choices.find((c) => c.value === value);
      if (choice) {
        return (
          <Badge
            variant="outline"
            className="text-xs font-medium"
            style={{
              borderColor: choice.color + "40",
              color: choice.color,
              backgroundColor: choice.color + "10",
            }}
          >
            {choice.label}
          </Badge>
        );
      }
      return <span>{String(value)}</span>;
    }

    case "multi_select": {
      const choices =
        (field.options as { choices?: { label: string; value: string; color: string }[] })
          ?.choices ?? [];
      const values = Array.isArray(value) ? value : [value];
      return (
        <div className="flex gap-1">
          {values.map((v) => {
            const choice = choices.find((c) => c.value === v);
            return (
              <Badge
                key={String(v)}
                variant="outline"
                className="text-xs"
                style={
                  choice
                    ? {
                        borderColor: choice.color + "40",
                        color: choice.color,
                        backgroundColor: choice.color + "10",
                      }
                    : {}
                }
              >
                {choice?.label ?? String(v)}
              </Badge>
            );
          })}
        </div>
      );
    }

    case "checkbox":
      return value ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-zinc-600" />
      );

    case "rating": {
      const num = Number(value) || 0;
      return (
        <span className="text-amber-400">
          {"★".repeat(num)}
          {"☆".repeat(Math.max(0, 5 - num))}
        </span>
      );
    }

    default:
      return <span className="truncate">{String(value)}</span>;
  }
}
