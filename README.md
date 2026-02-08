# QR Code Generator (Web)

A simple web app that generates QR codes from text or URLs and lets you download them as PNG images.

## Features

- Generate QR codes from text or URL input
- Live preview in the browser
- Download as PNG

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [qrcode](https://www.npmjs.com/package/qrcode)

## Getting Started

Prerequisites: Node.js and npm.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build (Static Export)

This project uses Next.js static export (`output: "export"`). The build output is written to `out/`.

```bash
npm run build
```

To preview the static output locally, serve the `out/` directory with any static file server (for example: `npx serve out`).

If you deploy under a subpath, update `basePath` in `next.config.ts`.

## Deployment

Pushing to `main` deploys the `out/` directory to GitHub Pages via GitHub Actions.
