"use client";

import { useRef, useEffect } from "react";
import { useChatStore } from "@/lib/stores/chat";
import { ChatMessage } from "./ChatMessage";
import { X, MessageSquare } from "lucide-react";
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
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-3 flex max-h-[50vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
          style={{ originY: 1 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/40 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-zinc-600" />
              <span className="text-xs font-medium text-zinc-500">
                Conversation
              </span>
            </div>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-400"
              onClick={() => setOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Loading dots */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="block h-1 w-1 rounded-full bg-blue-400"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl rounded-tl-md border border-zinc-800/60 bg-zinc-900/80 px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{
                            y: [0, -3, 0],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="block h-1.5 w-1.5 rounded-full bg-zinc-500"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
