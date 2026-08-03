"""
Generates the icon set from the client's logo mark.

The full mark has six thin bands and turns to mush below about 48px, so the
icon uses a crop of the apex where the bands converge. That keeps the logo's
most recognisable feature and stays legible in a 16px browser tab.

Writes icon.png (512), apple-icon.png (180) and favicon.ico (16/32/48) into the
given directory, plus a preview sheet for judging the small sizes.

    pip install pillow
    python scripts/generate-icons.py out

Then copy icon.png and apple-icon.png into app/, and favicon.ico into public/.

Geometry comes from components/brand/logo-geometry.ts, so the icons cannot drift
from the logo on the page.
"""
import os
import subprocess
import re
import sys
from PIL import Image

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
HERE = os.path.abspath(os.path.dirname(__file__))

INK = '#16130F'
CLAY_LIGHT = '#C2724A'

# Apex crop: x centred on the peak (x=224), down to just past the second band.
CROP = '120 0 210 165.93'

GEOMETRY = os.path.join(HERE, '..', 'components', 'brand', 'logo-geometry.ts')

geometry = open(GEOMETRY).read()
block = re.search(r'MARK_PATHS: readonly string\[\] = \[(.*?)\n\]', geometry, re.S).group(1)
PATHS = re.findall(r"'([^']+)'", block)[0:4]   # four slope bands; skip the lower steps
INNER = ''.join(f'<path d="{d}"/>' for d in PATHS)

VW, VH = 210.0, 165.93


# Chrome enforces a minimum window size, so anything smaller than this comes
# back at the wrong scale. Every tile is rendered at MASTER and stepped down.
MASTER = 1024


def render(size, pad_ratio):
    """Render the tile at MASTER with proportional padding, then resample down."""
    pad = round(MASTER * pad_ratio)
    iw = MASTER - 2 * pad
    ih = round(iw * VH / VW)

    html = (
        f'<style>html,body{{margin:0;padding:0;width:{MASTER}px;height:{MASTER}px;'
        f'background:{INK};display:flex;align-items:center;justify-content:center;'
        f'overflow:hidden}}</style>'
        f'<svg viewBox="{CROP}" width="{iw}" height="{ih}" xmlns="http://www.w3.org/2000/svg">'
        f'<g fill="{CLAY_LIGHT}" fill-rule="evenodd">{INNER}</g></svg>'
    )
    tag = f'{size}_{int(pad_ratio * 100)}'
    html_path = os.path.join(HERE, f'_icon_{tag}.html')
    png_path = os.path.join(HERE, f'_icon_{tag}.png')
    open(html_path, 'w').write(html)

    subprocess.run([
        CHROME, '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        f'--user-data-dir={HERE}/cdp-icon', '--no-first-run', '--no-default-browser-check',
        '--virtual-time-budget=6000', f'--window-size={MASTER},{MASTER}',
        f'--screenshot={png_path}', f'file:///{html_path.replace(os.sep, "/")}',
    ], capture_output=True)

    img = Image.open(png_path).convert('RGB')
    if img.size != (MASTER, MASTER):
        img = img.crop((0, 0, MASTER, MASTER))
    return img if size == MASTER else img.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else HERE
    os.makedirs(out, exist_ok=True)

    render(512, 0.14).save(f'{out}/icon.png')
    render(180, 0.14).save(f'{out}/apple-icon.png')

    ico = [(48, 0.12), (32, 0.09), (16, 0.06)]
    frames = [render(px, pad) for px, pad in ico]
    frames[0].save(f'{out}/favicon.ico', format='ICO',
                   sizes=[(px, px) for px, _ in ico], append_images=frames[1:])

    sheet = Image.new('RGB', (16 + 32 + 48 + 64 + 128 + 6 * 18, 170), (120, 120, 120))
    x = 18
    for px in (16, 32, 48, 64, 128):
        sheet.paste(render(px, 0.09 if px <= 32 else 0.12), (x, (170 - px) // 2))
        x += px + 18
    sheet.resize((sheet.width * 2, sheet.height * 2), Image.NEAREST).save(f'{out}/icon-preview.png')

    for f in os.listdir(HERE):
        if f.startswith('_icon_'):
            os.remove(os.path.join(HERE, f))
    print('written to', out)
