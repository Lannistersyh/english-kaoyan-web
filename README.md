# English Study

A local English learning workspace with a PubMed-inspired reading layout. All built-in interface text, passages, explanations, vocabulary definitions, and paraphrasing guidance are in English.

## Launch

Double-click **English Study.command** on the desktop. The launcher builds the current source, starts one local server, and opens the site. Keep its terminal window open while studying; press **Control-C** to stop it. Opening the launcher again reuses an existing server.

The default address is **http://127.0.0.1:5173/**. If that port is occupied, the launcher tries ports 5174 through 5180 and prints the actual address.

Recreate the desktop shortcut with `npm run create-shortcut`. Start without opening a browser using `npm start`. Node.js 22 or later and installed project dependencies are required. If dependencies are missing, run `npm ci` once.

## Features

The October 2026 update adds 8 sourced past exam writing tasks and 16 original mock exercises. The bank contains 72 sets and 296 objective subquestions. See [the collection notes and sources](docs/question-bank-2026-10.md). In **Practice**, search **October 2026** for the new objective sets; past exam emails and notices are under **Writing**.

- Cloze, reading, heading matching, gap-fill, and paragraph reordering with answer explanations.
- English paraphrasing with reference answers, structural guidance, and optional AI feedback.
- Writing practice, sentence patterns, news reading, science and philosophy reading, vocabulary cards, and a review book.
- English dictionary definitions from Datamuse and local study vocabulary, unlocked after typing a word three times.
- English text import, local backup and restore, and optional account-based cloud sync.

## Local and cloud use

The site opens immediately in offline mode. Choose **Log in** for cloud sync, or **Use offline** to leave the sign-in page. Offline progress stays in this browser. Signed-in accounts use separate local storage and may synchronize through Supabase.

For cloud sync, configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` and apply the project's Supabase schema. Do not put a service-role key in frontend configuration.

For local AI feedback, set `DEEPSEEK_API_KEY` in `.env.local`. The launcher loads it into the local server; it is never included in the frontend bundle. The browser calls `/api/deepseek-score` on the same local server. Without this key, practice and self-assessment still work.

Hosted AI endpoints require a valid Supabase session and server-side `DEEPSEEK_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`. Optional `ALLOWED_ORIGINS` lists permitted cross-origin frontends. Request limits are kept in memory (20 per account per hour and 200 per server process per day); multi-instance hosting needs a shared limiter.

## Verification

- `npm run check:english`: checks application source and built-in content for Chinese characters.
- `npm test`: checks scoring, answer integrity, English import formats, account isolation, backups, and cloud snapshot ordering.
- `npm run build`: runs the English check, TypeScript compilation, and production build.

The English import format is available under **Import → Copy format template**. Category names include `Reading`, `Cloze`, `Matching`, `Reorder`, `Paraphrasing`, and `Writing`.

## GitHub Pages

Live site: https://lannistersyh.github.io/english-kaoyan-web/

Pushing to `main` runs the regression tests and builds the English site before deployment. The workflow can also be started manually. GitHub Pages must use **GitHub Actions** as its publishing source.

The workflow uses `/english-kaoyan-web/` as the base path so scripts, fonts, and browser icons load from the repository subdirectory. Local builds default to relative asset paths.

The hosted site opens without a login requirement. Progress is stored in that browser; use backup export and restore to move local study data between the local and hosted sites. Cloud sync is optional and uses the repository's `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` Actions secrets.

GitHub Pages cannot run the Node.js scoring service. Set `VITE_AI_API_URL` to an independently hosted, authenticated scoring endpoint to enable hosted AI feedback. Without one, reference answers and self-assessment remain available and the unavailable AI action is disabled. Keep `DEEPSEEK_API_KEY` on that backend only.
