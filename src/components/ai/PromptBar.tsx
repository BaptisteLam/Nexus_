"use client";

import { useState, useRef, useCallback } from "react";
import { useChatStore } from "@/lib/stores/chat";
import { processMessage } from "@/lib/ai/engine";
import { executeActions } from "@/lib/ai/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PromptBar() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useChatStore((s) => s.addMessage);
  const setLoading = useChatStore((s) => s.setLoading);
  const isLoading = useChatStore((s) => s.isLoading);
  const isOpen = useChatStore((s) => s.isOpen);
  const setOpen = useChatStore((s) => s.setOpen);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Open chat if collapsed
    if (!isOpen) setOpen(true);

    // Add user message
    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    });

    setInput("");
    setLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await processMessage(trimmed);

      // Execute actions before showing message
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
    } catch (error) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [input, isLoading, isOpen, addMessage, setLoading, setOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <>
      {/* Floating button when chat is collapsed and has messages */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-600 shadow-lg shadow-blue-600/25 hover:bg-blue-500"
              onClick={() => setOpen(true)}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[640px]"
          >
            <div className="relative rounded-2xl border border-border bg-zinc-900/90 shadow-2xl backdrop-blur-xl transition-colors focus-within:border-zinc-600">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Décrivez votre CRM idéal..."
                className={cn(
                  "min-h-[48px] max-h-[160px] resize-none border-0 bg-transparent px-4 pt-3.5 pb-12 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                )}
                rows={1}
              />

              {/* Bottom bar inside prompt */}
              <div className="absolute right-2 bottom-2 left-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-600 hover:text-zinc-400"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-700">
                    {input.trim() ? "⌘↵ pour envoyer" : ""}
                  </span>
                  <Button
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      input.trim()
                        ? "bg-blue-600 hover:bg-blue-500"
                        : "bg-zinc-800 text-zinc-600"
                    )}
                    onClick={handleSend}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
