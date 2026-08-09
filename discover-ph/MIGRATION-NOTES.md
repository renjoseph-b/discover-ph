# Migration notes

## What's in this package

- `1-homepage/home.html`, `script.js`, `style.css` — fully updated, all links fixed for the new folder layout.
- `7-news/` through `14-terms/` — placeholder pages (title, "coming soon" message, link back home) for the nav items that don't have real content yet.
- These placeholders use `../1-homepage/style.css` so they already match your brand styling.

## What you still need to do yourself

I don't have the content of your existing `about.html`, `attraction.html`, `contact.html`, `directory.html`, and `maps.html` files, so I couldn't regenerate them. You'll need to:

1. **Rename these folders** in your project (drop the spaces, fix the numbering clash):
   - `2About Page` → `2-about-page`
   - `3Attraction Page` → `3-attraction-page`
   - `3Contact Page` → `4-contact-page`
   - `4Directory` → `5-directory`
   - `5Maps` → `6-maps`

2. **Inside each of those pages**, update the header/mobile-nav/footer links the same way I did in `home.html`:
   - `href="../1-home/home.html"` → `href="../1-homepage/home.html"`
   - `href="about.html"` → `href="../2-about-page/about.html"` (or just `about.html` if you're linking to itself from within that same folder)
   - `href="attractions.html"` (and the `?category=` variants) → `href="../3-attraction-page/attraction.html"` (note: singular, matching your actual filename)
   - `href="directory.html"` → `href="../5-directory/directory.html"`
   - `href="contact.html"` → `href="../4-contact-page/contact.html"`
   - `href="news.html"`, `history.html`, `culture.html`, `food.html`, `people.html`, `geography.html`, `privacy.html`, `terms.html` → point into their respective new folders (`../7-news/news.html`, `../8-history/history.html`, etc.)
   - Each page's own `<link rel="stylesheet" href="style.css">` should become `href="../1-homepage/style.css"` (assuming you're sharing one stylesheet, as your current `about.css` naming suggests you might have page-specific CSS too — keep that alongside its page if so).
   - `<script src="script.js">` → `src="../1-homepage/script.js"` (all pages share the same JS file).

3. Paste the updated `about.html`, `attraction.html`, `contact.html`, `directory.html`, `maps.html` back to me any time and I'll fix their links directly, the same way I did for `home.html`.

## Why the placeholders exist

Your original nav referenced `news.html`, `history.html`, `culture.html`, `food.html`, `people.html`, `geography.html`, `privacy.html`, and `terms.html` — none of which existed as real pages yet. Rather than leave broken links, I created simple stub pages for each so every nav link resolves to something real. Replace their content whenever you're ready.
