# ABAP public landing page

The public product landing page for **ABAP — AI Business Automation Platform**.

This site is intentionally built with plain HTML, CSS, and JavaScript. It has no framework, build step, package manager, external fonts, remote scripts, analytics, or runtime dependencies.

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
|-- assets/       # Approved ABAP logo and application dashboard image
|-- favicon.svg   # Local product favicon
|-- _headers      # Cloudflare Pages response headers
|-- robots.txt    # Search crawler policy
`-- sitemap.xml   # Public canonical URL
```

## Cloudflare Pages deployment

This repository needs no build command.

1. Create a Cloudflare Pages project from this repository.
2. Choose the static HTML / no-framework preset.
3. Leave the **build command** empty.
4. Set the **build output directory** to `/` (the repository root).
5. Deploy, then add `abap.dennisbasadre.com` as the custom domain when DNS work is ready.

Cloudflare Pages will apply the security policy in `_headers`. The Content Security Policy intentionally allows only same-origin files and does not permit third-party scripts, frames, or connections.

## Pre-deployment checklist

- Keep the approved logo and product screenshot optimized and local to the repository.
- Confirm the canonical URL and sitemap remain `https://abap.dennisbasadre.com`.
- Test keyboard navigation, the mobile menu, and reduced-motion behavior.
- Check every public link and confirm the browser console is clean.
- Do not add a live-application link until the application is deployed.
