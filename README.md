# Hope Balentine — Professional Brand Website

**Live site:** <https://debalent.github.io/Hope-Balentine-Professional-website/>

A fully responsive, accessible personal brand website for Hope Balentine — Customer Experience & Operations Leader.

## Features

- Executive hero section with animated floating stats and typed role cycling
- Full career timeline: Embassy Suites by Hilton · Ally Bank · Aspen Dental · Song Shanksy LLC · Walmart Inc.
- Animated skill bars, competency tags, and leadership strengths
- Leadership philosophy panel and target roles section
- Testimonials, resume download CTA, and contact form (Formspree)
- Dark / light mode with system preference detection
- WCAG 2.1 accessible markup throughout
- Fully responsive (desktop → mobile)
- Auto-deployed to GitHub Pages on every push to `main`

## Deploy

Pushes to `main` automatically deploy via `.github/workflows/deploy.yml`.

**First-time setup:**

1. Go to **Settings → Pages**
2. Set Source to **GitHub Actions**
3. Save — the next push will go live at the URL above.

## Contact Form

Replace `YOUR_FORM_ID` in `index.html` with a real [Formspree](https://formspree.io) form ID to activate email delivery.

## Headshot

Drop `headshot.jpg` into `assets/images/` — the site falls back to initials "HB" if the file is missing.

## Resume

Drop `resume.pdf` into `assets/` to enable the download buttons throughout the site.
