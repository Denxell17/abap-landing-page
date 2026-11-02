# ABAP public landing page

The public product landing page for **ABAP — AI Business Automation Platform**.

This site is intentionally built with plain HTML, CSS, and JavaScript. The static page needs no framework, build step, package manager, external fonts, application-authored analytics, or package-manager runtime dependencies. The existing public assistant loads Cloudflare Turnstile and calls the configured ABAP API after verification.

The landing page distinguishes the live production application from capabilities that are implemented and privately tested. Milestones 1–5 are complete; Milestone 6 integrations are implemented and privately tested but not production-enabled; Milestones 7–8 remain in progress even though the application and HTTPS are live. On October 8, 2026, the production Restic/Backblaze B2 backup and isolated PostgreSQL 18.6 recovery drill passed: the encrypted snapshot was verified, 22 tables were restored, application records were checked, and the disposable application passed health and readiness checks.

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
