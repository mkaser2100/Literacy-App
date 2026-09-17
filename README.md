# Lexi — Phase 2 Learning MVP

React + TypeScript + Vite reading-intervention prototype.

## Phase 2
- Six-activity lesson flow: Sound Detective, Sound Builder, Sound Switch, Word Builder, Mystery Words, Reading Mission
- Guided incorrect-answer feedback and retry
- Hint tracking and first-try accuracy
- Stars and XP
- Timestamped session and attempt persistence
- Parent progress/session history
- Browser speech synthesis for prototype word prompts
- Local persistence remains intentional until Supabase Auth/RLS is enabled

## Run
```bash
npm install
npm run build
npm run dev
```

## Data safety
Phase 2 stores prototype learning events in localStorage. Do not connect the browser directly to the `lexi` Supabase schema until authentication and row-level security policies are enabled.
