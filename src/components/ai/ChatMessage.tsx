"use client";

import type { ChatMessage as ChatMessageType } from "@/types/ai";
import { cn } from "@/lib/utils";
import { Check, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
          isUser
            ? "bg-blue-600 text-white"
            : "border border-zinc-800 bg-zinc-900 text-zinc-500"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-md bg-blue-600 text-white"
            : "rounded-tl-md border border-zinc-800/60 bg-zinc-900/80 text-zinc-300"
        )}
      >
        {/* Simple markdown: bold */}
        <div
          dangerouslySetInnerHTML={{
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-zinc-100'>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />

        {/* Action badges */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {message.actions.map((action, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400"
              >
                <Check className="h-3 w-3" />
                {getActionLabel(action.type)}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getActionLabel(type: string): string {
  const labels: Record<string, string> = {
    create_module: "Module créé",
    add_field: "Champ ajouté",
    update_field: "Champ modifié",
    delete_field: "Champ supprimé",
    create_view: "Vue créée",
    update_module: "Module modifié",
    delete_module: "Module supprimé",
    create_record: "Enregistrement créé",
    create_pipeline: "Pipeline créé",
    create_automation: "Automatisation créée",
  };
  return labels[type] || type;
}
