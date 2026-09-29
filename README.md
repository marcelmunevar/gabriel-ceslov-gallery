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

### Editor accounts

Create each editor account in Supabase under **Authentication > Users**. The
application has no public sign-up or invitation flow. Any authenticated user
can manage drafts, publish pages, and manage images in the `portfolio-images`
bucket. Use an editor account to sign in at `/admin`.

### Database migrations

Apply these migrations manually, in order, using the Supabase SQL Editor (or
`supabase db push` if the project is linked and the CLI is configured):

1. `supabase/migrations/20260927155648_create_gallery_pages.sql`
2. `supabase/migrations/20260927160511_secure_portfolio_image_storage.sql`
3. `supabase/migrations/20260928120000_allow_shared_editing.sql`

The first migration creates `page_drafts` for editable Puck JSON and
`published_pages` for public page content. Both use JSONB content, unique slugs,
owner UUIDs, timestamps, Data API grants, and Row Level Security. `owner_id`
records the user who created or most recently saved/published each row.

The second migration initially restricts Storage operations to paths beginning
with the authenticated user's UUID. The third replaces the owner-only database
and Storage policies so any authenticated user can manage gallery content and
images. Public visitors can still only read published pages and public images.

### Storage bucket

Create a public bucket named `portfolio-images` with:

- Public access: enabled
- File size limit: `5 MB` (`5242880` bytes)
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`

Uploaded files use this path format:

```text
{owner-uuid}/{generated-uuid}.{extension}
```

Public image URLs are stored in Puck data. Files are stored under the UUID of
the uploader, but any authenticated editor can manage images in the bucket.
The editor validates file size and MIME type before uploading. SVG uploads are
intentionally excluded.

## Content persistence

Puck data is stored as JSONB because the current content model is page-builder
data. The typed data layer in `src/lib/content.ts` handles draft loading and
initial seeding, debounced draft saves, published-page loading, and explicit
publishing from the Puck Publish action. `sampleData` contains development
placeholders; production images use Supabase Storage URLs.

Multiple authenticated editors can work on the same content. Saves use
last-write-wins, with no live synchronization or conflict merging, so
simultaneous edits can overwrite one another.

## Verification

Run the checks before deploying:

```bash
npm run build
npm run lint
```

Manual checks:

1. Open `/` while signed out and confirm the public page loads without login.
2. Sign in at `/admin` with two different editor accounts and confirm both can
   load and edit the same draft.
3. Save a draft, reload, and confirm the changes persist.
4. Upload an allowed image and confirm it remains available after reload.
5. Publish, then confirm `/` shows the published content.
6. Confirm later draft edits do not change `/` until publishing again.

## Deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the hosting
provider's build environment. Do not commit `.env.local`. Configure the host to
serve `index.html` for direct requests to `/admin`.

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

Multiple authenticated editors can work on the same content. Saves use
last-write-wins; there is no live synchronization or conflict merging, so
simultaneous edits can overwrite one another.
