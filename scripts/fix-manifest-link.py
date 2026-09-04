from pathlib import Path

path = Path('index.html')
lines = path.read_text().splitlines()
result = []
for line in lines:
    if '<link rel="manifest"' in line:
        result.append('  <link rel="manifest" href="/manifest.json?v=3">')
    else:
        result.append(line)
path.write_text('\n'.join(result) + '\n')
