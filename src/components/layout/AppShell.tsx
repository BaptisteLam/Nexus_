"use client";

import { CrmSidebar } from "@/components/crm/Sidebar";
import { PromptBar } from "@/components/ai/PromptBar";
import { ChatPanel } from "@/components/ai/ChatPanel";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Sidebar */}
      <CrmSidebar />

      {/* Main area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* CRM Workspace content with dotted grid background */}
        <main className="flex-1 overflow-auto px-8 py-6 pb-44 dotted-grid">
          {children}
        </main>

        {/* AI overlay — fixed at bottom center */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex flex-col items-center px-4 pb-5">
          {/* Gradient fade at the bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
          <div className="pointer-events-auto relative flex w-full flex-col items-center">
            <ChatPanel />
            <PromptBar />
          </div>
        </div>
      </div>
    </div>
  );
}
