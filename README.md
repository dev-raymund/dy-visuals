# DY Visuals

An elegant, fast, dependency‑free website for **DY Visuals**, a photography &amp; videography studio.

Built as a single static page (HTML + CSS + vanilla JS) so it loads instantly and deploys anywhere — GitHub Pages, Netlify, Vercel, or any static host. No build step, no framework, nothing to install.

---

## ✨ What's inside

| Section | Purpose |
| --- | --- |
| **Hero** | Full‑screen image, headline, and two calls‑to‑action |
| **Intro** | Studio statement + animated stat counters |
| **Services** | Six service cards (weddings, portraits, brand, events, real estate, aerial) |
| **Work** | Filterable portfolio gallery with a full‑screen lightbox |
| **About** | Studio story with photo + credentials |
| **Process** | Four‑step "how it works" flow |
| **Testimonials** | Auto‑playing review slider (swipe + dots) |
| **Credentials** | "As featured in" logo row |
| **CTA banner** | Full‑bleed call to book |
| **Contact** | Booking / quote form with validation + contact details |
| **Footer** | Navigation, contact, social links |

Interactions: sticky header, mobile off‑canvas menu, scroll‑reveal animations, active‑section nav highlighting, portfolio filtering, lightbox (keyboard + arrows), testimonial slider, and full client‑side form validation. Everything degrades gracefully and respects `prefers-reduced-motion`.

---

## 🚀 Run it locally

No dependencies required. Any static server works:

```bash
# Python (built in on macOS/Linux)
python3 -m http.server 8000

# …or Node
npx serve .
```

Then open <http://localhost:8000>.

> You can also just double‑click `index.html`, but running a local server is recommended so relative paths and the fonts/images behave exactly like production.

---

## 🖼️ Replace the placeholder photos (important)

The site currently pulls demo images from Unsplash so the layout is visible out of the box. **Swap these for your own photography** — it's the single biggest quality upgrade.

1. Drop your images into `assets/images/` (e.g. `hero.jpg`, `wedding-01.jpg`, …).
2. In `index.html`, replace each `https://images.unsplash.com/...` URL with your local path, e.g.:
   ```html
   <!-- before -->
   <img src="https://images.unsplash.com/photo-1519741497674-...">
   <!-- after -->
   <img src="assets/images/wedding-01.jpg" data-full="assets/images/wedding-01-large.jpg">
   ```
3. For the gallery, `src` is the thumbnail and `data-full` is the large version shown in the lightbox. They can be the same file.

**Tips for elegant, fast images:** export around `1600px` on the long edge at ~80% quality, use `.jpg` (or `.webp` for smaller files), and keep hero images landscape.

---

## 📮 Make the contact form send real enquiries

The form works in **demo mode** out of the box (it validates and shows a success message without sending). To receive real enquiries, point it at a form backend. Two easy, free options:

### Option A — Formspree (works on any host)
1. Create a form at <https://formspree.io> and copy your endpoint (looks like `https://formspree.io/f/abcdwxyz`).
2. In `index.html`, update the form's `action`:
   ```html
   <form id="bookingForm" method="POST" action="https://formspree.io/f/abcdwxyz">
   ```
That's it — the JavaScript already submits via `fetch` and shows success/error states.

### Option B — Netlify Forms (if you deploy to Netlify)
1. Add `data-netlify="true"` to the `<form>` tag (the hidden `form-name` field is already present).
2. Deploy to Netlify — the form appears under **Forms** in your dashboard automatically.

Either way, update the fallback email (`hello@dyvisuals.com`) in `js/main.js` if you want a different address shown on errors.

---

## ✏️ Customise the content

Everything is plain HTML/CSS — no templating to learn.

- **Business name / brand:** search for `DY Visuals` in `index.html` and the `.brand` block in the header/footer.
- **Contact details:** email, phone, hours, and social links live in the `#contact` section and footer.
- **Colours & fonts:** edit the CSS custom properties at the top of `css/styles.css` (`:root`). The palette is warm ink, cream, and champagne gold; fonts are Cormorant Garamond (serif) + Jost (sans).
- **Services / copy:** edit the `<article class="service">` cards and section text directly.
- **Testimonials:** edit the `<blockquote class="quote">` blocks; dots are generated automatically.

---

## 🌐 Deploy

The repo is already initialised with a git commit and a `vercel.json` (static, no build). Pick one path:

### Vercel → `dyvisuals.vercel.app` (recommended)

**A. Push to GitHub, then import (auto‑deploys on every push):**
```bash
git remote add origin https://github.com/dev-raymund/dy-visuals.git
git push -u origin main
```
Then at <https://vercel.com/new>: **Import** the `dy-visuals` repo → Framework preset **Other** (no build command, output = root) → set the **Project Name to `dyvisuals`** → **Deploy**. Production URL becomes `https://dyvisuals.vercel.app` (if that name is still available; otherwise pick another and Vercel names the URL after it).

**B. Or deploy straight from your machine with the CLI (no GitHub needed):**
```bash
npm i -g vercel
cd dy-visuals
vercel login          # one-time, opens your browser
vercel --prod         # when asked "project name?", enter: dyvisuals
```

> To lock in the exact subdomain: Vercel → Project → **Settings → Domains** → the `dyvisuals.vercel.app` domain is assigned automatically from the project name. Rename the project there if you want a different one.

### GitHub Pages (alternative)
1. `git push` to GitHub (as above).
2. Repo **Settings → Pages → Source:** `main` branch, `/ (root)`.
3. Live at `https://dev-raymund.github.io/dy-visuals/`.

---

## 📁 Structure

```
dy-visuals/
├── index.html          # All page content
├── css/
│   └── styles.css      # Design system + component styles
├── js/
│   └── main.js         # All interactivity (no dependencies)
├── assets/
│   └── images/         # Drop your own photos here
└── README.md
```

---

## 📄 License

© DY Visuals. All rights reserved. Replace demo Unsplash imagery with your own before publishing.
