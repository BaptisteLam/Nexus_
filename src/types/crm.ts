export type FieldType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "url"
  | "date"
  | "datetime"
  | "select"
  | "multi_select"
  | "checkbox"
  | "currency"
  | "percent"
  | "rating"
  | "user"
  | "relation"
  | "file"
  | "formula"
  | "rollup";

export type ViewType = "table" | "kanban" | "calendar" | "list" | "board";

export interface Field {
  id: string;
  moduleId: string;
  name: string;
  slug: string;
  type: FieldType;
  options?: Record<string, unknown>;
  required: boolean;
  order: number;
}

export interface Module {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  order: number;
  config?: Record<string, unknown>;
  fields: Field[];
}

export interface CrmRecord {
  id: string;
  moduleId: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface View {
  id: string;
  moduleId: string;
  type: ViewType;
  config: Record<string, unknown>;
}

export interface Pipeline {
  id: string;
  moduleId: string;
  stages: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Automation {
  id: string;
  workspaceId: string;
  trigger: Record<string, unknown>;
  conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
}
