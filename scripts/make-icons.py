from pathlib import Path
from PIL import Image

source = next(Path('icons').glob('*.PNG'))
image = Image.open(source).convert('RGB')
side = min(image.width, image.height)
left = (image.width - side) // 2
top = 0
square = image.crop((left, top, left + side, top + side))
icons = Path('icons')
icons.mkdir(exist_ok=True)
square.resize((192, 192), Image.Resampling.LANCZOS).save(icons / 'icon-192.png', optimize=True)
square.resize((512, 512), Image.Resampling.LANCZOS).save(icons / 'icon-512.png', optimize=True)
