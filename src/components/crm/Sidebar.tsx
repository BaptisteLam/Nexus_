"use client";

import { useWorkspaceStore } from "@/lib/stores/workspace";
import { useUIStore } from "@/lib/stores/ui";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  Handshake,
  CheckSquare,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Package,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  handshake: Handshake,
  "check-square": CheckSquare,
  package: Package,
};

function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Package;
}

export function CrmSidebar() {
  const modules = useWorkspaceStore((s) => s.modules);
  const activeModuleSlug = useWorkspaceStore((s) => s.activeModuleSlug);
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="relative flex h-screen flex-col border-r border-border bg-zinc-950"
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          N
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap text-lg font-semibold tracking-tight text-zinc-100"
            >
              Nexus
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-white/5" />

      {/* Dashboard link */}
      <div className="px-2 pt-3 pb-1">
        <Button
          variant={pathname === "/workspace" ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "w-full justify-start gap-2 text-zinc-400 hover:text-zinc-100",
            pathname === "/workspace" && "bg-white/5 text-zinc-100"
          )}
          onClick={() => router.push("/workspace")}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Button>
      </div>

      {/* Modules */}
      <div className="px-3 pt-4 pb-1">
        {!collapsed && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Modules
          </span>
        )}
      </div>

      <ScrollArea className="flex-1 px-2">
        <AnimatePresence mode="popLayout">
          {modules.length === 0 ? (
            !collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-2 py-4 text-center text-xs text-zinc-600"
              >
                Aucun module
              </motion.p>
            )
          ) : (
            modules.map((mod) => {
              const Icon = getIcon(mod.icon);
              const isActive = activeModuleSlug === mod.slug;
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "mb-0.5 w-full justify-start gap-2 text-zinc-400 hover:text-zinc-100",
                      isActive && "bg-white/5 text-zinc-100"
                    )}
                    onClick={() => router.push(`/workspace/${mod.slug}`)}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{mod.name}</span>}
                  </Button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t border-white/5 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-zinc-300"
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
