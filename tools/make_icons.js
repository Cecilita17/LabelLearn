// Genera los PNG de la app (icon-192, icon-512, apple-touch-icon) a partir de icon.svg. Uso: node tools/make_icons.js
const { chromium } = require('playwright'), fs = require('fs'), path = require('path');
(async () => {
  const root = path.resolve(__dirname, '..'), svg = fs.readFileSync(path.join(root, 'icon.svg'), 'utf8');
  const b = await chromium.launch();
  for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent('<style>html,body{margin:0}svg{display:block;width:' + size + 'px;height:' + size + 'px}</style>' + svg);
    await p.screenshot({ path: path.join(root, name) });
    await p.close();
  }
  await b.close();
})();
