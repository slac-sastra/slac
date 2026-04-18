# SASTRA AI Legal Aid — Agent & AI Coding Guidelines

This file contains project-specific rules for AI coding agents working on this codebase.

---

## Project Context

**SASTRA AI Legal Aid** is a Next.js 16 (App Router) + Firebase Cloud Functions application that helps rural communities in Tamil Nadu get AI-generated legal guidance. Cases are stored in Firestore; PDFs are generated server-side with PDFKit and stored in Cloudinary.

---

## ⚠️ Framework Version Warning

This project uses **Next.js 16** with the **App Router**. This is a post-15 release with breaking changes. Before writing any Next.js code, read the docs in `node_modules/next/dist/docs/`. API surfaces differ from your training data.

---

## Directory Responsibilities

| Directory | Purpose |
|---|---|
| `src/` | Next.js 16 frontend — all user-facing UI |
| `functions/` | **Production** backend — Firebase Cloud Functions |
| `api-server/` | Legacy/alternative backend — **not in production use** |

> Do not add new production backend logic to `api-server/`. Use `functions/` for all backend changes.

---

## Coding Rules

### General
- All new TypeScript files must have strict types. No `any` except where existing code uses it.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging.
- All new UI components go in `src/components/ui/` (shadcn/ui pattern).

### Backend (functions/)
- All route handlers are async functions with `(req: Request, res: Response): Promise<void>`.
- All user inputs **must** be validated with Zod before use.
- Sarvam AI calls use `generateLegalAdvice()` in `functions/src/lib/sarvam.ts` — do not call the API directly.
- PDF generation uses `generatePDF()` in `functions/src/lib/pdf.ts`.
- Firestore access goes through `db` exported from `functions/src/lib/firebase.ts`.

### Frontend (src/)
- All backend calls go through `src/lib/api.ts`. Do not use `fetch()` directly in components.
- State changes (language, admin session) go through `useStore()` from `src/hooks/use-store.ts`.
- Use TanStack Query (`useQuery`, `useMutation`) for all server state in the admin dashboard.
- Translations must be added to **both** `en` and `ta` objects in `src/lib/translations.ts`.

### Tamil Language
- AI-generated `guidance` and `summary` must be in **Tamil Unicode script** (e.g., `காவல் நிலையம்`).
- Never use transliterated Tamil (e.g., `Kaval Nilayam`) in those fields.
- Only `petition` should be in English.

---

## Environment
- Local frontend: `http://localhost:3000`
- Local functions dev server: `http://localhost:5001`
- Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001` during local development.
- The functions dev server authenticates to **production Firestore** via `functions/service-account.json`.

---

## Testing
There are currently no automated tests. Verify changes manually:
1. Submit a case on the frontend and confirm the three output tabs appear.
2. Download the PDF and confirm Tamil text renders correctly.
3. Visit `/admin`, log in, and confirm the submitted case appears with search working.
