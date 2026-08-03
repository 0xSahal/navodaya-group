"""
Exports standalone SVG files of the logo from components/brand/logo-geometry.ts.

The site itself renders the logo through components/brand/Logo.tsx, so these are
for handover: sharing with the client, print, decks, email signatures. Geometry
is identical, only the fills are baked in.

    python scripts/export-logo-svg.py public/brand
"""
import os
import re
import sys

HERE = os.path.abspath(os.path.dirname(__file__))
GEOMETRY = os.path.join(HERE, '..', 'components', 'brand', 'logo-geometry.ts')

CLAY = '#9C4F2E'        # on light backgrounds
CLAY_LIGHT = '#C2724A'  # on dark backgrounds
STONE = '#5A5249'       # strapline, on light
SAND = '#B9AF9F'        # strapline, on dark

src = open(GEOMETRY).read()


def const(name):
    block = re.search(rf'{name}: readonly string\[\] = \[(.*?)\n\]', src, re.S).group(1)
    return re.findall(r"'([^']+)'", block)


VIEWBOX = dict(re.findall(r"(\w+): '([^']+)'", src.split('LOGO_VIEWBOX')[1].split('}')[0]))
MARK, WORD, STRAP = const('MARK_PATHS'), const('WORDMARK_PATHS'), const('STRAPLINE_PATHS')


def build(view, primary, secondary, with_word, with_strap):
    groups = [(primary, MARK + (WORD if with_word else []))]
    if with_strap:
        groups.append((secondary, STRAP))
    body = ''.join(
        f'<g fill="{fill}" fill-rule="evenodd">'
        + ''.join(f'<path d="{d}"/>' for d in paths)
        + '</g>'
        for fill, paths in groups
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEWBOX[view]}" '
        f'role="img" aria-label="Navodaya Design and Contract Pvt Ltd">'
        f'<title>Navodaya Design and Contract Pvt Ltd</title>{body}</svg>\n'
    )


FILES = {
    'navodaya-logo.svg':            ('lockup', CLAY, STONE, True, True),
    'navodaya-logo-on-dark.svg':    ('lockup', CLAY_LIGHT, SAND, True, True),
    'navodaya-logo-stacked.svg':    ('stacked', CLAY, STONE, True, False),
    'navodaya-mark.svg':            ('mark', CLAY, STONE, False, False),
    'navodaya-mark-on-dark.svg':    ('mark', CLAY_LIGHT, SAND, False, False),
}

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'public', 'brand')
    os.makedirs(out, exist_ok=True)
    for name, args in FILES.items():
        open(os.path.join(out, name), 'w').write(build(*args))
        print('wrote', name)
