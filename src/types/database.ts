export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          created_at: string;
        };
      };
      modules: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          slug: string;
          icon: string;
          description: string | null;
          order: number;
          config: Record<string, unknown> | null;
          created_at: string;
        };
      };
      fields: {
        Row: {
          id: string;
          module_id: string;
          name: string;
          slug: string;
          type: string;
          options: Record<string, unknown> | null;
          required: boolean;
          order: number;
        };
      };
      records: {
        Row: {
          id: string;
          module_id: string;
          data: Record<string, unknown>;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
      };
      views: {
        Row: {
          id: string;
          module_id: string;
          type: string;
          config: Record<string, unknown>;
        };
      };
      pipelines: {
        Row: {
          id: string;
          module_id: string;
          stages: Record<string, unknown>[];
        };
      };
      automations: {
        Row: {
          id: string;
          workspace_id: string;
          trigger: Record<string, unknown>;
          conditions: Record<string, unknown>;
          actions: Record<string, unknown>;
        };
      };
      conversations: {
        Row: {
          id: string;
          workspace_id: string;
          messages: Record<string, unknown>[];
          created_at: string;
        };
      };
      user_context: {
        Row: {
          id: string;
          user_id: string;
          workspace_id: string;
          context: Record<string, unknown>;
        };
      };
    };
  };
}
