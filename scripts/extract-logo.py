"""
Extracts the Navodaya logo from the client's vector PDF into clean SVG.

The mark and the NAVODAYA wordmark are already outlines in the PDF, so those
come across as exact coordinates. The strapline is live Arial text, so its
glyphs are pulled from the PDF's own embedded font subset and converted to
paths, which keeps the recreation independent of what fonts a viewer has.

Step 1 of 2. Writes scripts/extracted.json, which build-logo-geometry.py then
bakes into components/brand/logo-geometry.ts.

    pip install fonttools
    python scripts/extract-logo.py
    python scripts/build-logo-geometry.py
"""
import os
import re
import zlib
from io import BytesIO

from fontTools.cffLib import CFFFontSet
from fontTools.pens.svgPathPen import SVGPathPen

HERE = os.path.abspath(os.path.dirname(__file__))
PDF = os.path.join(HERE, 'navodaya-logo-source.pdf')
OUT = os.path.join(HERE, 'extracted.json')

BLUE = (0.0000, 0.6275, 0.8902)   # the client's brand blue, #00A0E3
GREY = (0.4471, 0.4471, 0.4431)   # strapline grey, #727271

data = open(PDF, 'rb').read()


# --- content stream ---------------------------------------------------------
stream = re.search(rb'10\s+0\s+obj.*?stream\r?\n(.*?)\r?\nendstream', data, re.S)
content = zlib.decompress(stream.group(1)).decode('latin-1')


def parse_paths(text):
    """Pull every filled path out of the content stream, with its fill colour."""
    out = []
    colour = None
    current = []
    for line in text.splitlines():
        line = line.strip()
        # The colour is preceded by `/CS14 cs` on the same line, so this has to
        # search rather than anchor at the start.
        scn = re.search(r'([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+scn\s*$', line)
        if scn:
            colour = tuple(round(float(v), 4) for v in scn.groups())
            continue
        nums = re.findall(r'-?\d+\.?\d*', line)
        if line.endswith(' m'):
            current.append(('M', [float(n) for n in nums]))
        elif line.endswith(' l'):
            current.append(('L', [float(n) for n in nums]))
        elif line.endswith(' c'):
            current.append(('C', [float(n) for n in nums]))
        elif line == 'h':
            current.append(('Z', []))
        elif line in ('f*', 'f'):
            if current:
                out.append((colour, current))
            current = []
    return out


def to_svg_d(ops):
    parts = []
    for op, nums in ops:
        if op == 'Z':
            parts.append('Z')
        else:
            parts.append(op + ' ' + ' '.join(f'{n:.4f}' for n in nums))
    return ' '.join(parts)


paths = parse_paths(content)
print(f'{len(paths)} filled paths in the content stream')

# The six roof bands come before the lettering; everything blue after them is a
# NAVODAYA letter. Split on the first letter path, which is the one starting the
# run of small shapes.
mark_ops = [p for c, p in paths[:6]]
word_ops = [p for c, p in paths[6:] if c == BLUE]
print(f'  {len(mark_ops)} mark bands, {len(word_ops)} wordmark letters')


# --- strapline: embedded CFF subset -> outlines -----------------------------
cff_raw = re.search(rb'22\s+0\s+obj.*?stream\r?\n(.*?)\r?\nendstream', data, re.S).group(1)
cff = CFFFontSet()
cff.decompile(BytesIO(cff_raw), None)
font = cff[cff.fontNames[0]]
charstrings = font.CharStrings

# Identity-H: the hex codes in the Tj strings are glyph ids directly.
WIDTHS = {3: 278, 17: 278, 36: 667, 38: 722, 39: 722, 40: 667, 42: 778,
          44: 278, 47: 556, 49: 722, 50: 778, 51: 667, 53: 722, 54: 667,
          55: 611, 57: 667}

# Text runs, as positioned by the TD operators in the content stream.
SIZE = 30.5440
runs = []
x, y = 0.0, 0.0
for dx, dy, gids in [
    (-1.5925, 0.3665, [0x27, 0x28, 0x36, 0x2c, 0x2a, 0x31, 0x03]),
    (123.9049, 0.0, [0x24, 0x31, 0x27, 0x03, 0x26, 0x32, 0x31, 0x37, 0x35, 0x24, 0x26, 0x37]),
    (242.0980, 0.0, [0x03, 0x33, 0x39, 0x37]),
    (64.5029, 0.0, [0x11, 0x03, 0x2f]),
    (31.6942, 0.0, [0x37, 0x27, 0x11]),
]:
    x += dx
    y += dy
    runs.append((x, y, gids))


def gid_name(gid):
    """CID-keyed subsets name glyphs cidXXXXX; plain ones use the charset order."""
    for candidate in (f'cid{gid:05d}', f'glyph{gid:05d}'):
        if candidate in charstrings:
            return candidate
    names = charstrings.keys()
    return list(names)[gid] if gid < len(names) else None


SPACE = 3

strapline = []
for run_x, run_y, gids in runs:
    pen_x = run_x
    for gid in gids:
        width = WIDTHS[gid] * SIZE / 1000.0
        if gid != SPACE:
            name = gid_name(gid)
            if name is None:
                raise SystemExit(f'glyph {gid} not found in the embedded subset')
            pen = SVGPathPen(charstrings, ntos=lambda v: f'{v:.2f}')
            charstrings[name].draw(pen)
            d = pen.getCommands()
            if not d.strip():
                raise SystemExit(f'glyph {gid} ({name}) produced an empty outline')
            strapline.append((pen_x, run_y, SIZE / 1000.0, d))
        pen_x += width

print(f'  {len(strapline)} strapline glyphs outlined')

with open(OUT, 'w') as fh:
    import json
    json.dump({
        'mark': [to_svg_d(p) for p in mark_ops],
        'word': [to_svg_d(p) for p in word_ops],
        'strapline': strapline,
    }, fh, indent=1)
print('wrote extracted.json')
