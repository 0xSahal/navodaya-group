"""
Renders the logo as a PNG for use in email.

Email clients do not render SVG, so the same geometry the site uses is
rasterised here instead. Output is 2x the display size so it stays sharp on
retina screens, and transparent so it can sit on whatever band colour the
template uses.

The stacked lockup (mark + wordmark, no strapline) is deliberate: at the ~200px
an email header allows, the strapline would render around 5px tall and read as
a smudge. Same reasoning as the site header.

    pip install pillow
    python scripts/generate-email-logo.py public/brand
"""
import os
import re
import subprocess
import sys

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
HERE = os.path.abspath(os.path.dirname(__file__))
GEOMETRY = os.path.join(HERE, '..', 'components', 'brand', 'logo-geometry.ts')

CLAY = '#9C4F2E'

# Display size in the email; the file is rendered at twice this.
DISPLAY_WIDTH = 200

source = open(GEOMETRY, encoding='utf-8').read()


def const(name):
    block = re.search(rf'{name}: readonly string\[\] = \[(.*?)\n\]', source, re.S).group(1)
    return re.findall(r"'([^']+)'", block)


VIEWBOX = dict(re.findall(r"(\w+): '([^']+)'", source.split('LOGO_VIEWBOX')[1].split('}')[0]))
PATHS = const('MARK_PATHS') + const('WORDMARK_PATHS')

stacked = VIEWBOX['stacked']
sx, sy, sw, sh = (float(n) for n in stacked.split())

# The stacked bbox is tight: the wordmark baseline sits exactly on the bottom
# edge, so any rounding shaves a pixel off the letters. Pad the viewBox so the
# lockup has room to breathe.
PAD = 10
view = f'{sx - PAD} {sy - PAD} {sw + PAD * 2} {sh + PAD * 2}'
vw, vh = sw + PAD * 2, sh + PAD * 2

width = DISPLAY_WIDTH * 2
height = round(width * vh / vw)

# Chrome enforces a minimum window size, so anything this small comes back at
# the wrong scale. Render large, then resample down.
MASTER_WIDTH = 1200
master_height = round(MASTER_WIDTH * vh / vw)

inner = ''.join(f'<path d="{d}"/>' for d in PATHS)
html = (
    f'<style>html,body{{margin:0;padding:0;width:{MASTER_WIDTH}px;'
    f'height:{master_height}px;background:transparent;overflow:hidden}}</style>'
    f'<svg viewBox="{view}" width="{MASTER_WIDTH}" height="{master_height}" '
    f'xmlns="http://www.w3.org/2000/svg">'
    f'<g fill="{CLAY}" fill-rule="evenodd">{inner}</g></svg>'
)

if __name__ == '__main__':
    # Chrome resolves --screenshot against its own working directory, so this
    # has to be absolute or the file lands somewhere unexpected (or nowhere).
    out_dir = os.path.abspath(
        sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'public', 'brand')
    )
    os.makedirs(out_dir, exist_ok=True)

    html_path = os.path.join(HERE, '_email_logo.html')
    png_path = os.path.join(out_dir, 'navodaya-logo-email.png')
    open(html_path, 'w', encoding='utf-8').write(html)

    subprocess.run(
        [
            CHROME, '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
            f'--user-data-dir={HERE}/_cdp-email-logo', '--no-first-run',
            '--no-default-browser-check',
            # Transparent canvas, so the band colour comes from the template.
            '--default-background-color=00000000',
            '--virtual-time-budget=6000',
            f'--window-size={MASTER_WIDTH},{master_height}',
            f'--screenshot={png_path}', f'file:///{html_path.replace(os.sep, "/")}',
        ],
        capture_output=True,
    )

    os.remove(html_path)

    from PIL import Image

    if not os.path.exists(png_path):
        raise SystemExit('Chrome did not write the screenshot')

    image = Image.open(png_path).convert('RGBA')
    image = image.crop((0, 0, MASTER_WIDTH, master_height))
    image = image.resize((width, height), Image.LANCZOS)
    image.save(png_path, optimize=True)

    print(f'wrote {png_path}')
    print(f'  {image.size[0]}x{image.size[1]}, mode {image.mode}')
    print(f'  display at width="{DISPLAY_WIDTH}" in the email')
