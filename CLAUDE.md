# Nexus — AI-Powered CRM Builder

## Identity
Nexus is a SaaS where users build their own custom CRM through a conversational AI interface.
Think "Lovable meets Salesforce" — the user describes what they want, the AI builds it live.

## Stack
- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui for ALL UI components (mandatory, no exceptions)
- Supabase (Postgres, Auth, Realtime, Edge Functions, Storage)
- Claude API (Sonnet) for the AI engine
- Framer Motion for animations
- Zustand for client state management
- React Query (TanStack Query) for server state

## Architecture

### Core Concept: Schema-Driven Dynamic CRM
The CRM is NOT hardcoded. Everything is metadata-driven:
- `modules` table: defines CRM modules (Contacts, Deals, Tasks, Invoices, etc.)
- `fields` table: defines fields per module (name, type, options, validation, order)
- `records` table: stores actual data as JSONB keyed by module
- `views` table: defines how data is displayed (table, kanban, calendar, list)
- `automations` table: stores user-defined automation rules
- `pipelines` table: defines pipeline stages per module

The AI reads this schema, understands the current state, and generates SQL migrations + UI config to create/modify modules in real-time.

### Project Context System
The AI must always know:
1. Current modules and their fields (read from `modules` + `fields` tables)
2. Conversation history (stored in `conversations` table with full message log)
3. User preferences and past decisions (stored in `user_context` JSONB)

Each AI request includes a system prompt with:
- Full schema snapshot (modules, fields, views, pipelines)
- Last 20 messages of conversation
- User's business type and preferences

### UI Layout (Critical)
The app has TWO layers:

**Layer 1 — Background: The CRM workspace**
- Full-screen CRM that the user built
- Modules displayed as pages in a sidebar
- Each module renders dynamically based on its `view` type
- Data tables, kanban boards, forms, detail views — all generated from schema

**Layer 2 — Foreground: The AI prompt bar (overlay)**
- Centered at bottom, same width as chat responses (~640px max)
- Supports text input + file upload (drag & drop)
- AI responses appear ABOVE the prompt bar, scrollable upward
- The whole chat panel is collapsible/expandable
- When collapsed: only a floating round button (center bottom) to reopen
- When expanded: chat + prompt bar overlay on top of the CRM (with subtle backdrop blur)
- Chat panel has a grabber/handle to resize height

### AI Capabilities
The AI can:
- Create new modules ("Crée un module Prospects avec nom, email, téléphone, statut")
- Add/modify/delete fields on existing modules
- Create views (table, kanban, calendar, timeline)
- Set up pipelines with stages
- Create automations ("Quand un deal passe en Gagné, crée une facture automatiquement")
- Import data from CSV/Excel
- Generate reports and dashboards
- Modify the UI layout and theme
- Answer questions about the CRM data ("Combien de deals ouverts ce mois-ci ?")

### How the AI modifies the CRM
1. User sends a message
2. AI receives: message + full schema context + conversation history
3. AI responds with:
   - A text explanation (shown in chat)
   - A JSON action payload (executed silently):
```json
     {
       "actions": [
         { "type": "create_module", "payload": { "name": "Prospects", "icon": "users", ... } },
         { "type": "add_field", "payload": { "module": "prospects", "name": "email", "type": "email" } },
         { "type": "create_view", "payload": { "module": "prospects", "type": "table", "columns": [...] } }
       ]
     }
```
4. Frontend executes actions → Supabase mutations → UI re-renders in real-time via Supabase Realtime

## UI Rules

### General
- ALWAYS use shadcn/ui components
- Install with: `npx shadcn@latest add [component]`
- Never build custom components if shadcn/ui has an equivalent
- Dark mode first, with light mode toggle
- All components in `src/components/ui/`

### Design Direction
- Inspiration: Linear + Notion + Attio
- Dense, information-rich UI
- Font: Geist Sans (UI) + Geist Mono (data/code)
- Border radius: 8px
- Subtle animations with Framer Motion (150ms ease)
- Colors: zinc/slate base, blue-500 primary accent
- Sidebar: 240px, collapsible, dark
- No heavy shadows, use subtle borders instead
- Tables: compact rows, hover states, inline editing

### The Prompt Bar
- Fixed at bottom center
- Max width: 640px
- Rounded-2xl, glass effect (backdrop-blur + border)
- Textarea auto-grows
- File upload via paperclip icon + drag & drop zone
- Send button (arrow-up icon) appears when text is entered
- Keyboard shortcut: Cmd+Enter to send
- Loading state: animated dots in the chat

### Chat Panel
- Opens above prompt bar, same max-width
- Messages: user (right-aligned, blue) / AI (left-aligned, neutral)
- AI messages can contain:
  - Text (markdown rendered)
  - Action confirmations with status badges
  - Previews of created modules (mini cards)
- Scroll: newest at bottom, auto-scroll on new messages
- Collapse button at top of chat panel
- When fully collapsed: round floating button with sparkle icon

## Database Schema (Supabase)

### Core Tables
- `users` — auth, profile, preferences
- `workspaces` — multi-tenant, each user has at least one
- `modules` — id, workspace_id, name, slug, icon, description, order, config (JSONB)
- `fields` — id, module_id, name, slug, type, options (JSONB), required, order
- `records` — id, module_id, data (JSONB), created_at, updated_at, created_by
- `views` — id, module_id, type (table|kanban|calendar|list|board), config (JSONB)
- `pipelines` — id, module_id, stages (JSONB array)
- `automations` — id, workspace_id, trigger, conditions, actions (all JSONB)
- `conversations` — id, workspace_id, messages (JSONB array), created_at
- `user_context` — id, user_id, workspace_id, context (JSONB)

### Field Types Supported
text, number, email, phone, url, date, datetime, select, multi_select,
checkbox, currency, percent, rating, user, relation, file, formula, rollup

### RLS (Row Level Security)
All tables filtered by workspace_id. Users can only access their workspace data.

## File Structure
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (redirect to /workspace)
│   ├── auth/
│   ├── workspace/
│   │   ├── layout.tsx (sidebar + main + prompt overlay)
│   │   ├── page.tsx (dashboard/home)
│   │   └── [moduleSlug]/
│   │       ├── page.tsx (module view)
│   │       └── [recordId]/page.tsx (record detail)
├── components/
│   ├── ui/ (shadcn components)
│   ├── crm/
│   │   ├── ModuleRenderer.tsx (dynamic module display)
│   │   ├── FieldRenderer.tsx (dynamic field display)
│   │   ├── TableView.tsx
│   │   ├── KanbanView.tsx
│   │   ├── CalendarView.tsx
│   │   ├── RecordDetail.tsx
│   │   ├── RecordForm.tsx
│   │   └── Sidebar.tsx
│   ├── ai/
│   │   ├── PromptBar.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ActionExecutor.tsx
│   └── layout/
│       ├── AppShell.tsx
│       └── WorkspaceLayout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── ai/
│   │   ├── engine.ts (Claude API integration)
│   │   ├── context.ts (builds context from schema)
│   │   ├── actions.ts (parses + executes AI actions)
│   │   └── prompts.ts (system prompts)
│   ├── crm/
│   │   ├── schema.ts (reads/writes module schema)
│   │   ├── records.ts (CRUD on records)
│   │   └── views.ts (view management)
│   └── stores/
│       ├── workspace.ts
│       ├── chat.ts
│       └── ui.ts
├── hooks/
│   ├── useModules.ts
│   ├── useRecords.ts
│   ├── useChat.ts
│   └── useAI.ts
└── types/
├── crm.ts
├── ai.ts
└── database.ts

## Key Dependencies
```json
{
  "next": "^14",
  "react": "^18",
  "@supabase/supabase-js": "^2",
  "@supabase/ssr": "^0.5",
  "zustand": "^4",
  "@tanstack/react-query": "^5",
  "framer-motion": "^11",
  "lucide-react": "latest",
  "@anthropic-ai/sdk": "latest",
  "react-markdown": "latest",
  "date-fns": "latest",
  "zod": "latest"
}
```

## Critical Rules
1. NEVER hardcode CRM modules — everything is schema-driven from Supabase
2. ALWAYS use shadcn/ui — no custom primitives
3. The AI prompt bar is an OVERLAY, not a sidebar — it floats on top of the CRM
4. All AI actions must be reversible (undo support via action log)
5. Use Supabase Realtime for instant UI updates when schema changes
6. Mobile responsive from day 1
7. French as default language, English support planned
8. Every user interaction with the AI is logged in `conversations`


# UI Rules

## Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui for ALL UI components

## UI Rules
- ALWAYS use shadcn/ui components (Button, Card, Dialog, Table, etc.)
- Install components with: npx shadcn@latest add [component]
- Never build custom components if shadcn has an equivalent
- All components go in src/components/ui/
- Use Tailwind classes only, no custom CSS

## Design Tokens
- Style: minimal, dense, dark mode first
- Font: Inter (sans), JetBrains Mono (mono)
- Border radius: 8px (rounded-lg)
- Primary: slate + indigo accent
- Animations: framer-motion, subtle, 150ms

## Before building any UI:
1. Run `npx shadcn@latest init` if not done
2. Run `npx shadcn@latest add [component]` for each needed component
3. Then build the page/feature using those components
