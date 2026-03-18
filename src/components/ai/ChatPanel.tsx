"use client";

import { useRef, useEffect } from "react";
import { useChatStore } from "@/lib/stores/chat";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages);
  const isOpen = useChatStore((s) => s.isOpen);
  const isLoading = useChatStore((s) => s.isLoading);
  const setOpen = useChatStore((s) => s.setOpen);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: 20, scaleY: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mb-3 flex max-h-[50vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-border bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
          style={{ originY: 1 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-xs font-medium text-zinc-500">
              Conversation
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-500 hover:text-zinc-300"
              onClick={() => setOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-zinc-800 text-zinc-400">
                    <div className="flex gap-0.5">
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        className="block h-1 w-1 rounded-full bg-zinc-400"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                        className="block h-1 w-1 rounded-full bg-zinc-400"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                        className="block h-1 w-1 rounded-full bg-zinc-400"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-zinc-800/80 px-4 py-2.5">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        className="block h-1.5 w-1.5 rounded-full bg-zinc-500"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                        className="block h-1.5 w-1.5 rounded-full bg-zinc-500"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                        className="block h-1.5 w-1.5 rounded-full bg-zinc-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
