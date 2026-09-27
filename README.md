# Gabriel Ceslov Gallery

React + TypeScript + Vite portfolio editor using Puck and Supabase.

## Routes

- `/` is the public portfolio. It reads only the published page.
- `/admin` is the private Puck editor. It requires a Supabase Auth account.

## Local setup

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Only variables prefixed with `VITE_` are exposed to the browser. The publishable
key is intended for frontend use. Never put a Supabase secret or service-role key
in `.env.local`.

Start the development server:

```bash
npm run dev
```

Open the public page at `http://localhost:5173/` or the editor at
`http://localhost:5173/admin`.

## Supabase setup

Create a Supabase project with:

- Data API enabled
- Automatic table exposure disabled
- Automatic RLS enabled
- GitHub integration optional

### Auth owner

Create the single owner account in Supabase under **Authentication > Users**.
The application intentionally has no public sign-up flow. Use that account to
sign in at `/admin`.

### Database migrations

Run these migrations in order from the Supabase SQL Editor:

1. `supabase/migrations/20260927155648_create_gallery_pages.sql`
2. `supabase/migrations/20260927160511_secure_portfolio_image_storage.sql`

The first migration creates:

- `page_drafts`: owner-only editable Puck JSON
- `published_pages`: publicly readable Puck JSON

Both tables use JSONB content, unique slugs, owner UUIDs, timestamps, explicit
Data API grants, and Row Level Security policies.

The second migration restricts Storage API operations to paths beginning with
the authenticated user's UUID.

### Storage bucket

Create a public bucket named `portfolio-images` with:

- Public access: enabled
- File size limit: `5 MB` (`5242880` bytes)
- Allowed MIME types:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/avif`

Uploaded files use this path format:

```text
{owner-uuid}/{generated-uuid}.{extension}
```

Public image URLs are stored in Puck data. The editor validates file size and
MIME type before uploading. SVG uploads are intentionally excluded.

## Content persistence

Puck data is stored as JSONB because the current content model is page-builder
data. The typed data layer lives in `src/lib/content.ts` and provides:

- Draft loading and initial seeding from `sampleData`
- Debounced draft saves from Puck changes
- Published-page loading for `/`
- Explicit publishing from the Puck Publish action

`sampleData` contains development placeholders. Uploaded production images use
Supabase Storage URLs instead of data URLs.

## Verification

Run the checks before deploying:

```bash
npm run build
npm run lint
```

Manual checks:

1. Open `/` while signed out and confirm the public page does not show login.
2. Open `/admin`, sign in, and confirm the draft loads.
3. Edit text, wait for the save status, reload, and confirm the draft survives.
4. Upload an allowed image and confirm it remains available after reload.
5. Publish, then confirm `/` shows the published content.
6. Make another draft edit and confirm `/` does not change until publishing again.

## Deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting
provider's build environment. Do not commit `.env.local`.

Because this is a Vite SPA, configure the host to serve `index.html` for direct
requests to `/admin`.

For Netlify, create `public/_redirects`:

```text
/* /index.html 200
```

For Vercel, create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Use the equivalent SPA fallback setting for other hosting providers.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
