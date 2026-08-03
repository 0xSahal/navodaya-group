"""
Bakes the extracted logo geometry into one SVG coordinate space.

Everything is flipped out of the PDF's y-up space and the strapline glyph
transforms are applied at build time, so the runtime SVG carries no transform
attributes and any part can be isolated purely by changing the viewBox.

Step 2 of 2. Reads scripts/extracted.json from extract-logo.py and writes
components/brand/logo-geometry.ts.
"""
import json
import os
import re

HERE = os.path.abspath(os.path.dirname(__file__))
SOURCE = os.path.join(HERE, 'extracted.json')
TARGET = os.path.join(HERE, '..', 'components', 'brand', 'logo-geometry.ts')
REFERENCE = os.path.join(HERE, 'reference-original.svg')

data = json.load(open(SOURCE))


CMD = 'MLCQHVZ'


def tokens(d):
    """
    Split path data into (command, [numbers]) pairs, normalising the H and V
    shorthands that fontTools' SVGPathPen emits into full L segments. Absolute
    commands only, which is all either source produces.
    """
    out = []
    x = y = sx = sy = 0.0
    for cmd, body in re.findall(rf'([{CMD}{CMD.lower()}])([^{CMD}{CMD.lower()}]*)', d):
        nums = [float(n) for n in re.findall(r'-?\d*\.?\d+(?:e-?\d+)?', body)]
        cmd = cmd.upper()

        if cmd == 'Z':
            out.append(('Z', []))
            x, y = sx, sy
            continue

        if cmd == 'H':
            for n in nums:
                x = n
                out.append(('L', [x, y]))
            continue

        if cmd == 'V':
            for n in nums:
                y = n
                out.append(('L', [x, y]))
            continue

        # M/L take pairs and may repeat; C takes 6, Q takes 4.
        step = {'M': 2, 'L': 2, 'C': 6, 'Q': 4}[cmd]
        for i in range(0, len(nums), step):
            chunk = nums[i:i + step]
            if len(chunk) < step:
                raise ValueError(f'truncated {cmd} segment: {chunk}')
            out.append((cmd if i == 0 else ('L' if cmd == 'M' else cmd), chunk))
            x, y = chunk[-2], chunk[-1]
            if cmd == 'M' and i == 0:
                sx, sy = x, y
    return out


def transform(d, fn):
    """Apply a point transform to every coordinate pair in a path."""
    parts = []
    for cmd, nums in tokens(d):
        if cmd == 'Z':
            parts.append('Z')
            continue
        moved = []
        for i in range(0, len(nums), 2):
            px, py = fn(nums[i], nums[i + 1])
            moved += [px, py]
        parts.append(cmd + ' ' + ' '.join(f'{round(v, 2):g}' for v in moved))
    return ' '.join(parts)


def bounds(paths):
    xs, ys = [], []
    for d in paths:
        for cmd, nums in tokens(d):
            for i in range(0, len(nums), 2):
                xs.append(nums[i])
                ys.append(nums[i + 1])
    return min(xs), min(ys), max(xs), max(ys)


# --- assemble in PDF space first, to find the true artboard ------------------
pdf_mark = list(data['mark'])
pdf_word = list(data['word'])
pdf_strap = [
    transform(d, lambda gx, gy, px=px, py=py, s=s: (px + gx * s, py + gy * s))
    for px, py, s, d in data['strapline']
]

x0, y0, x1, y1 = bounds(pdf_mark + pdf_word + pdf_strap)
print(f'PDF artboard: x {x0:.2f}..{x1:.2f}  y {y0:.2f}..{y1:.2f}')

# Flip to SVG space, origin at the artboard's top-left.
flip = lambda x, y: (x - x0, y1 - y)

mark = [transform(d, flip) for d in pdf_mark]
word = [transform(d, flip) for d in pdf_word]
strap = [transform(d, flip) for d in pdf_strap]


def box(paths, pad=0.0):
    a, b, c, e = bounds(paths)
    return f'{a - pad:g} {b - pad:g} {c - a + 2 * pad:g} {e - b + 2 * pad:g}'


VIEWS = {
    'lockup': box(mark + word + strap),
    'stacked': box(mark + word),   # mark + NAVODAYA, no strapline
    'mark': box(mark),
    'wordmark': box(word),
}
for name, vb in VIEWS.items():
    print(f'  viewBox {name:9s} = {vb}')

ts = ['/**',
      ' * Navodaya logo geometry, extracted from the client\'s vector PDF by',
      ' * scripts/extract-logo.py. Do not hand-edit: regenerate instead.',
      ' *',
      ' * All three parts share one coordinate space, so a part can be isolated',
      ' * purely by picking the matching viewBox. No transforms at runtime.',
      ' */',
      '']
ts.append('export const LOGO_VIEWBOX = {')
for name, vb in VIEWS.items():
    ts.append(f"  {name}: '{vb}',")
ts.append('} as const\n')

for const, paths in (('MARK_PATHS', mark), ('WORDMARK_PATHS', word), ('STRAPLINE_PATHS', strap)):
    ts.append(f'export const {const}: readonly string[] = [')
    for d in paths:
        ts.append(f"  '{d}',")
    ts.append(']\n')

open(TARGET, 'w').write('\n'.join(ts))
print(f'wrote logo-geometry.ts ({len("".join(ts))} chars)')

# A reference SVG in the original colours, purely to diff against the PDF.
def svg(view, groups, w=None):
    vb = VIEWS[view]
    body = ''
    for fill, paths in groups:
        ds = ''.join(f'<path d="{d}"/>' for d in paths)
        body += f'<g fill="{fill}" fill-rule="evenodd">{ds}</g>'
    size = f' width="{w}"' if w else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{size}>{body}</svg>'


open(REFERENCE, 'w').write(
    svg('lockup', [('#00A0E3', mark + word), ('#727271', strap)], w=1000)
)
print('wrote reference-original.svg')
