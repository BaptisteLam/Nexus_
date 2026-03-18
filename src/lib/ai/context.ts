import type { ConversationContext } from "@/types/ai";
import { useWorkspaceStore } from "@/lib/stores/workspace";
import { useChatStore } from "@/lib/stores/chat";

export function buildContext(): ConversationContext {
  const { modules } = useWorkspaceStore.getState();
  const { messages } = useChatStore.getState();

  return {
    modules: modules.map((m) => ({
      name: m.name,
      slug: m.slug,
      icon: m.icon,
      fields: m.fields.map((f) => ({
        name: f.name,
        slug: f.slug,
        type: f.type,
      })),
    })),
    fields: modules.flatMap((m) =>
      m.fields.map((f) => ({ name: f.name, slug: f.slug, type: f.type }))
    ),
    messageHistory: messages.slice(-20),
  };
}
