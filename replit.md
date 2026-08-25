# سوق دير الزور المفتوح — Deir ez-Zor Open Market

An Arabic-language classified-ads marketplace (RTL) built as a single-page static web app.

## Stack

- Pure HTML/CSS/JS — no build step
- Firebase / Firestore (embedded config in `index.html`)
- Cloudinary for image uploads (config embedded in `index.html`)
- Google Fonts (Tajawal), Font Awesome icons

## Running the project

The app is served by Python's built-in HTTP server:

```
python3 -m http.server 5000
```

The **Start application** workflow handles this automatically. Open the preview pane to see the app.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Entire application — HTML, CSS, and JS in one file |

## User preferences

<!-- Add any preferences here -->
