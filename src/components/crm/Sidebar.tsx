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
  PanelLeftClose,
  PanelLeft,
  Package,
  type LucideIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      animate={{ width: collapsed ? 56 : 240 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex h-screen flex-col border-r border-zinc-800/60 bg-zinc-950"
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 px-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
          N
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-[15px] font-semibold tracking-tight text-zinc-100"
            >
              Nexus
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-zinc-800/40" />

      {/* Navigation */}
      <div className="flex flex-col gap-0.5 px-2 pt-3">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === "/workspace"}
          collapsed={collapsed}
          onClick={() => router.push("/workspace")}
        />
      </div>

      {/* Modules section */}
      <div className="px-3 pt-5 pb-1.5">
        {!collapsed && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
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
                className="px-2 py-6 text-center text-xs text-zinc-700"
              >
                Aucun module
              </motion.p>
            )
          ) : (
            <div className="flex flex-col gap-0.5">
              {modules.map((mod) => {
                const Icon = getIcon(mod.icon);
                const isActive = activeModuleSlug === mod.slug;
                return (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarItem
                      icon={Icon}
                      label={mod.name}
                      active={isActive}
                      collapsed={collapsed}
                      onClick={() => router.push(`/workspace/${mod.slug}`)}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Collapse toggle */}
      <Separator className="bg-zinc-800/40" />
      <div className="p-2">
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-full items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-800/50 hover:text-zinc-400"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const button = (
    <button
      onClick={onClick}
      className={cn(
        "group flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium transition-all duration-150",
        active
          ? "bg-zinc-800/80 text-zinc-100 shadow-sm"
          : "text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-blue-400" : "text-zinc-600 group-hover:text-zinc-400"
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
