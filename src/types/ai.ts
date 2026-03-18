export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: AIAction[];
  timestamp: string;
}

export type AIActionType =
  | "create_module"
  | "add_field"
  | "update_field"
  | "delete_field"
  | "create_view"
  | "update_module"
  | "delete_module"
  | "create_record"
  | "update_record"
  | "delete_record"
  | "create_pipeline"
  | "create_automation";

export interface AIAction {
  type: AIActionType;
  payload: Record<string, unknown>;
  status?: "pending" | "success" | "error";
}

export interface AIResponse {
  message: string;
  actions: AIAction[];
}

export interface ConversationContext {
  modules: Record<string, unknown>[];
  fields: Record<string, unknown>[];
  messageHistory: ChatMessage[];
  userContext?: Record<string, unknown>;
}
