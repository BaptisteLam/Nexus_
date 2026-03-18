"use client";

import type { ChatMessage as ChatMessageType } from "@/types/ai";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-800 text-zinc-400 border border-border"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-800/80 text-zinc-200 border border-border"
        )}
      >
        {/* Render markdown-ish text (bold support) */}
        <div
          dangerouslySetInnerHTML={{
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />

        {/* Action badges */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.actions.map((action, i) => (
              <Badge
                key={i}
                variant="outline"
                className="gap-1 border-green-500/30 bg-green-500/10 text-green-400 text-xs"
              >
                <Check className="h-3 w-3" />
                {getActionLabel(action.type)}
              </Badge>
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
