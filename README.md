# Atharva Mehta — Portfolio

Open `index.html` directly in a browser (double-click) or run `python3 -m http.server 8080`
and visit http://localhost:8080.

Keep `index.html` next to the `assets/` folder — images load from `./assets/`.

Certificates: add images to `assets/certificates/` (cert-01.jpg ... cert-14.jpg) and fill in
titles/issuers in the `CERTIFICATES` array near the end of `index.html`.

`index.html` is self-contained (About + Experience scripts and the StringTune runtime are inlined).
The old helper files (scroll-expand-media.js, experience-section.js, etc.) are kept for reference
and are no longer loaded by the page.
