# ABAP public landing page

The public product landing page for **ABAP — AI Business Automation Platform**.

This site is intentionally built with plain HTML, CSS, and JavaScript. The static page needs no framework, build step, package manager, external fonts, application-authored analytics, or package-manager runtime dependencies. The existing public assistant loads Cloudflare Turnstile and calls the configured ABAP API after verification.

The landing page reflects **Completed — v1.0.0**, with milestones 1–9 complete for the approved cloud/synthetic portfolio scope. It highlights CRM, invoicing, employees, workflows, English/Japanese localization and the authenticated Advanced AI Assistant. Signed n8n integration was demonstrated through temporary authenticated HTTPS routes with disposable synthetic records; shared live integrations remain disabled. Automated backup success and isolated application/n8n recovery are verified, without claiming a host disaster restore or zero data-loss guarantee.

Release provenance: [v1.0.0](https://github.com/Denxell17/AI-Business-Automation-Platform/releases/tag/v1.0.0) and [acceptance record at 69a21d7](https://github.com/Denxell17/AI-Business-Automation-Platform/blob/69a21d7/docs/deployment/final-platform-acceptance-20261104.md). The November 5 scheduled n8n service completed at 05:30:58 UTC, success/exit 0. Detailed fresh snapshot IDs were not independently read.

The Advanced AI Assistant supports two selectable free cloud models, English/Japanese responses, private account history and confirmation-protected synthetic demonstrations. Quotas apply; no paid fallback. Free-form conversation, live business-record access and AI-initiated live actions remain future capabilities, not release promises. The existing public RAG chatbot remains separate and unchanged.

**Publication:** owner approved the v1.0.0 landing-page update on November 5, 2026. Production `main` automatically deploys through the existing Cloudflare Pages project; application/VPS services are outside this deployment.

## Local preview

From the repository root, start any static HTTP server. For example, with Python 3:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

The site uses document-relative asset paths, so its styling also works when `index.html` is opened directly or through an embedded local preview. A local server is still recommended because it most closely matches production hosting.

## Project structure

```text
.
|-- index.html    # Semantic page content and metadata
|-- styles.css    # Responsive design, states, and motion
|-- script.js     # Mobile navigation and progressive reveal behavior
|-- assets/       # Approved ABAP logo and dashboard, with optimized WebP copies
|-- favicon.svg   # Local product favicon
|-- _headers      # Cloudflare Pages response headers
|-- robots.txt    # Search crawler policy
`-- sitemap.xml   # Public canonical URL
```

## Cloudflare Pages deployment

The owner-verified Cloudflare configuration uses production branch `main`, automatic deployments enabled, build command `exit 0`, repository-root output, and build watch paths `*`. The site requires no compilation; any future push to production main is a deployment action.

1. Create a Cloudflare Pages project from this repository.
2. Choose the static HTML / no-framework preset.
3. Preserve the configured **build command** `exit 0`.
4. Set the **build output directory** to `/` (the repository root).
5. Preserve the existing `abap.dennisbasadre.com` custom domain. Deployment requires separate approval.

Cloudflare Pages will apply the security policy in `_headers`. The unchanged remote Content Security Policy permits local assets plus the scoped Cloudflare Turnstile and ABAP API origins required by the public assistant.

## Public assistant release gate

`public-rag-config.js` contains the public production Turnstile site key and release flag. The Turnstile secret, Gemini key, Supabase secret, and gateway token remain server-side and must never be committed to this repository. Setting `enabled: false` hides the assistant and prevents it from making external requests.

## Pre-deployment checklist

- Keep the approved logo and product screenshot optimized and local to the repository.
- Confirm the canonical URL and sitemap remain `https://abap.dennisbasadre.com`.
- Test keyboard navigation, the mobile menu, and reduced-motion behavior.
- Check every public link and confirm the browser console is clean.
- Confirm the production application link remains `https://app.dennisbasadre.com`.

## Current product screenshots

Six genuine captures from November 3, 2026 are stored as `assets/abap-*-current-*.webp` and `assets/abap-dashboard-mobile-en.webp`. They use synthetic records in an isolated local SQLite demonstration. The English dashboard leads the page; the gallery covers CRM, invoice details, workflows, Japanese interface labels, and mobile reflow. Images link to their full-size files.

The workflow capture shows a started-only manual execution that remains Running, no configured schedules, and disabled n8n dispatch. Japanese localization does not translate business records; some date formatting remains English. No AI Assistant screenshot is included; verified live provider evidence is linked above. See `SCREENSHOTS.md` for provenance and privacy results.

Cloudflare settings above were verified by the owner. This candidate preserves remote RAG and Turnstile behavior; it changes no headers, scripts, release flags, keys, or endpoints. No live assistant request was made during candidate validation.
