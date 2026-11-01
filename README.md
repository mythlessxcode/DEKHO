# DEKHO

A movie browser built with Vite, React, and ChaiUI. Data comes from [TMDb](https://www.themoviedb.org/).

## Local

```bash
npm install
cp .env.example .env
```

Put your TMDb key in `.env`:

```
VITE_TMDB_API_KEY=your_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

```bash
npm run dev
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new). Framework preset: **Vite**. Root directory: the repo root.
3. Add environment variables (Production, Preview, and Development):
   - `VITE_TMDB_API_KEY`
   - `VITE_TMDB_BASE_URL` = `https://api.themoviedb.org/3`
4. Deploy. Routes `/`, `/movies`, and `/movie/:id` are rewritten to `index.html` via `vercel.json`.

Vite inlines `VITE_*` values at build time. If you change a key, trigger a new deployment.
