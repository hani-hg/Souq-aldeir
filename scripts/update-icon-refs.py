from pathlib import Path

index = Path('index.html')
html = index.read_text()
lines = html.splitlines()
updated = []
for line in lines:
    if '<link rel="icon"' in line or '<link rel="icon-old"' in line or '<link rel="apple-touch-icon"' in line:
        if 'data:image' in line or 'icon-old' in line:
            continue
        if 'apple-touch-icon' in line:
            updated.append('<link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png?v=2">')
        else:
            updated.append('<link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png?v=2">')
    else:
        updated.append(line)
index.write_text('\n'.join(updated) + '\n')

manifest = Path('manifest.json')
text = manifest.read_text()
text = text.replace('icons/icon-192.png', 'icons/icon-192.png?v=2')
text = text.replace('icons/icon-512.png', 'icons/icon-512.png?v=2')
text = text.replace('"src": "favicon.svg"', '"src": "icons/icon-192.png?v=2"')
manifest.write_text(text)

sw = Path('sw.js')
text = sw.read_text().replace("const CACHE = 'souq-aldeir-v7';", "const CACHE = 'souq-aldeir-v8-icons';")
text = text.replace("  '/favicon.svg',\n  '/manifest.json'", "  '/favicon.svg',\n  '/icons/icon-192.png',\n  '/icons/icon-512.png',\n  '/manifest.json'")
sw.write_text(text)
