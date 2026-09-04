from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/Souq-aldeir/icon-manus.png')
icons = Path('/home/ubuntu/Souq-aldeir/icons')
icons.mkdir(exist_ok=True)
image = Image.open(source).convert('RGBA')
image.resize((192, 192), Image.Resampling.LANCZOS).save(icons / 'icon-192.png', optimize=True)
image.resize((512, 512), Image.Resampling.LANCZOS).save(icons / 'icon-512.png', optimize=True)
