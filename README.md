# Waseem Taha Portfolio

Premium editorial portfolio built with Next.js App Router, TypeScript, Motion for React, `next/image`, and Lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production check

```bash
npm run build
npm run start
```

## Project structure

```
app/
  content.ts            All copy and data: works, reels, roles, skills, tools, AI tools, contact, case studies
  page.tsx              Home page sections
  layout.tsx, globals.css, favicon.ico, icon.png, apple-icon.png
  components/           Intro, nav/footer, work gallery + viewer, reels + player, watch flight,
                        cap journey, tool canvas, AI board, EV app screens, section dock
  work/                 Case-study pages (EV charge finder, fitness app study)
public/
  images/brand/         Signature logo layers (stroke mask + cap) and the link-preview card (1200x630)
  images/hero|about|contact/   Section photography and the watch/cap cut-outs
  images/tools|ai/      Neon tool cubes and AI emblems
  images/work/<project>/       Portfolio pieces, one folder per project (01.jpg, 02.jpg, …)
  videos/short-form/    Reels (NN.mp4) and their 6-second card previews (NN-preview.mp4)
  waseem-taha-resume.pdf
source/                 The client's original files, untouched, grouped like the site
  brief/  brand/  photos/  icons/  works/<project>/
```

`source/` stays on this machine only: `.gitignore` keeps it out of the repo and `.vercelignore` out of deployments. To add a project: export images to `public/images/work/<slug>/01.jpg…`, then add an entry to `works` in `app/content.ts`.

## Deploying

Live at [waseem-taha.vercel.app](https://waseem-taha.vercel.app). The GitHub repo `abu-bakr-sidq/Waseem-Taha` is connected to Vercel, so every push to `main` builds and deploys automatically. `vercel.json` pins the framework to Next.js: the Vercel project was created while the repo held only a README, so without it Vercel treats the site as a plain static folder and every page returns 404.

Contact links (email, phone, WhatsApp, Instagram) live in `contact` in `app/content.ts`. The WhatsApp QR in the contact section is drawn from `app/components/whatsapp-qr-data.ts`, generated for `https://wa.me/qr/BEWHMJVAY4V2H1`; regenerate it if that link changes.
