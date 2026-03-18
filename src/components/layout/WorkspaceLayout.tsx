"use client";

import { AppShell } from "./AppShell";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
