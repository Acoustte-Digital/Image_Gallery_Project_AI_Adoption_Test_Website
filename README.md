# Image Gallery Frontend

Next.js 15 + TypeScript + Tailwind CSS frontend for browsing an image gallery API.

## Features

- Responsive image grid
- Search by title/description/category
- Category filters
- Image preview modal
- Loading, error and empty states
- API integration with configurable endpoints

## API configuration

Set one of these environment variables in `.env.local`:

- `NEXT_PUBLIC_IMAGES_ENDPOINT` (full images endpoint URL)
- `NEXT_PUBLIC_API_BASE_URL` (base API URL; frontend tries `/api/images` and `/images`)

Without env config, frontend tries same-origin `/api/images` and `/images`.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
