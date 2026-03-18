"use client";

import { useChatStore } from "@/lib/stores/chat";

export function useChat() {
  const messages = useChatStore((s) => s.messages);
  const isOpen = useChatStore((s) => s.isOpen);
  const isLoading = useChatStore((s) => s.isLoading);
  const addMessage = useChatStore((s) => s.addMessage);
  const toggleOpen = useChatStore((s) => s.toggleOpen);

  return { messages, isOpen, isLoading, addMessage, toggleOpen };
}
