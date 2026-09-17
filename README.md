# Lexi Phase 1
React + TypeScript + Vite learner UX prototype.

## Included
- Home/Today dashboard
- Journey/Learn path
- Functional 6-step lesson flow beginning with Sound Detective
- Correct/incorrect feedback and completion celebration
- Rewards screen
- Parent dashboard
- Local attempt persistence for safe prototype testing
- Service boundary ready for Supabase wiring

## Run
npm install
npm run dev

## Why local persistence in Phase 1
The existing `lexi` schema currently has RLS disabled. The app does not connect a browser client directly to those tables until authentication and row-level policies are defined. This avoids exposing child-learning records through a publishable key.
