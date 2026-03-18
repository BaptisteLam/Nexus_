"use client";

import { useState, useRef, useCallback } from "react";
import { useChatStore } from "@/lib/stores/chat";
import { processMessage } from "@/lib/ai/engine";
import { executeActions } from "@/lib/ai/actions";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PromptBar() {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useChatStore((s) => s.addMessage);
  const setLoading = useChatStore((s) => s.setLoading);
  const isLoading = useChatStore((s) => s.isLoading);
  const isOpen = useChatStore((s) => s.isOpen);
  const setOpen = useChatStore((s) => s.setOpen);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (!isOpen) setOpen(true);

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    });

    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await processMessage(trimmed);

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
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <>
      {/* Floating sparkle button when chat is collapsed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <button
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
              onClick={() => setOpen(true)}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-[640px]"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border bg-zinc-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-200",
                focused
                  ? "border-zinc-600/60 ring-1 ring-zinc-600/20"
                  : "border-zinc-800/60"
              )}
            >
              {/* Subtle top gradient line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/30 to-transparent" />

              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Décrivez votre CRM idéal..."
                rows={1}
                className="w-full resize-none bg-transparent px-4 pt-4 pb-12 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                style={{ minHeight: "52px", maxHeight: "160px" }}
              />

              {/* Bottom bar */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-400">
                    <Paperclip className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <AnimatePresence>
                    {input.trim() && (
                      <motion.span
                        initial={{ opacity: 0, x: 4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        className="text-[11px] text-zinc-600"
                      >
                        <kbd className="rounded border border-zinc-800 px-1 py-0.5 text-[10px] text-zinc-600">
                          ⌘
                        </kbd>{" "}
                        <kbd className="rounded border border-zinc-800 px-1 py-0.5 text-[10px] text-zinc-600">
                          ↵
                        </kbd>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button
                    disabled={!input.trim() || isLoading}
                    onClick={handleSend}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
                      input.trim() && !isLoading
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 active:scale-95"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    )}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
