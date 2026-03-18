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
        {/* CRM Workspace content */}
        <main className="flex-1 overflow-auto px-6 py-6 pb-40">
          {children}
        </main>

        {/* AI overlay — fixed at bottom center */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex flex-col items-center px-4 pb-4">
          <div className="pointer-events-auto flex flex-col items-center w-full">
            <ChatPanel />
            <PromptBar />
          </div>
        </div>
      </div>
    </div>
  );
}
