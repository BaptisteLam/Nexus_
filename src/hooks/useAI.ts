"use client";

import { useCallback } from "react";
import { useChatStore } from "@/lib/stores/chat";
import { processMessage } from "@/lib/ai/engine";
import { executeActions } from "@/lib/ai/actions";

export function useAI() {
  const addMessage = useChatStore((s) => s.addMessage);
  const setLoading = useChatStore((s) => s.setLoading);

  const sendMessage = useCallback(
    async (content: string) => {
      addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      });

      setLoading(true);

      try {
        const response = await processMessage(content);

        if (response.actions.length > 0) {
          executeActions(response.actions);
        }

        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
          actions: response.actions,
          timestamp: new Date().toISOString(),
        });
      } catch {
        addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Désolé, une erreur s'est produite.",
          timestamp: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    },
    [addMessage, setLoading]
  );

  return { sendMessage };
}
