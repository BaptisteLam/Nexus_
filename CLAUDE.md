# Project Rules

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
