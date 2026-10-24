#!/usr/bin/env python3
"""tools/sentences/*.tsv -> sentences.js (oraciones de contexto, generadas una sola vez).
Cada línea del .tsv: palabra <TAB> oración segmentada con espacios <TAB> español <TAB> inglés.
El pinyin de cada token se calcula con pypinyin; la palabra objetivo toma el pinyin de data.js."""
import glob, json, re, sys
from pypinyin import lazy_pinyin, Style

src = open('data.js', encoding='utf-8').read()
rooms = json.loads(re.search(r'LABELLEARN_ROOMS = (\[.*\]);', src, re.S).group(1))
vocab, order = {}, []
for r in rooms:
    for col in r['cols']:
        for c in col:
            if c and c[1] not in vocab:
                vocab[c[1]] = c[2]; order.append(c[1])

PUNCT = set('，。？！、')
out, errors = {}, []
for f in sorted(glob.glob('tools/sentences/*.tsv')):
    for ln in open(f, encoding='utf-8'):
        ln = ln.rstrip('\n')
        if not ln.strip(): continue
        p = ln.split('\t')
        if len(p) != 4: errors.append('formato: ' + ln); continue
        w, seg, es, en = p
        if w not in vocab: errors.append('palabra desconocida: ' + w); continue
        toks = seg.split(' ')
        if w not in toks: errors.append('sin token objetivo: ' + w + ' → ' + seg); continue
        t = []
        for z in toks:
            py = '' if z in PUNCT else (vocab[w] if z == w else ''.join(lazy_pinyin(z, style=Style.TONE)))
            t.append(z + '|' + py)
        out[w] = [t, es, en]
missing = [w for w in order if w not in out]
if missing: errors.append('faltan: ' + ' '.join(missing))
if errors: print('\n'.join(errors)); sys.exit(1)
js = '// GENERADO por tools/build_sentences.py – no editar a mano.\n// palabra → [[“hanzi|pinyin”…], español, inglés]\nwindow.LABELLEARN_SENT = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n'
open('sentences.js', 'w', encoding='utf-8').write(js)
print(len(out), 'oraciones,', len(js) // 1024, 'KB')
