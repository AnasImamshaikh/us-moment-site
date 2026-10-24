Us Moment — Website Build
==========================

HOW TO VIEW THE SITE
---------------------
Easiest way:
  1. Unzip this folder anywhere on your computer.
  2. Double-click "index.html" — it will open in your default browser.
  3. Use the top navigation to browse Home, Work, Services, About.

If anything looks broken when opened directly (some browsers restrict
local files), instead serve it with a simple local server:
  - If you have Node.js installed, open a terminal in this folder and run:
      npx serve .
    then open the URL it prints (usually http://localhost:3000).
  - Or with Python installed:
      python3 -m http.server 8000
    then open http://localhost:8000 in your browser.

WHAT'S INCLUDED
----------------
index.html, about.html, work.html, services.html, portfolio.html — the site pages
css/   — all styles
js/    — all scripts
assets/ — images (client logos, team photos, work reels)

NOTE ON THE CONTACT FORM
--------------------------
The "Let's Talk" contact form on the homepage is wired to send
submissions via Formspree, but still needs a real Formspree form ID
in place of the placeholder before it will actually deliver emails.

DEPLOYING LIVE
----------------
This is a static site — it can be deployed as-is to Netlify, Vercel,
Cloudflare Pages, GitHub Pages, or any standard web host. Just upload
the contents of this folder.
