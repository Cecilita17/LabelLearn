// Patio, balcón y jardín en isométrico (escena exterior). Medidas en unidades de 10 cm: 5,0 m x 4,4 m.
// Pared izquierda = plano x=0: fachada de la casa con puerta de patio, balcón con baranda, ventana, escoba, grifo, manguera y regadera.
// Pared derecha = plano y=0: muro de ladrillo con cantero de flores, y cerca de madera con portón.
// Suelo: césped, patio de piedra con mesa, sillas y sombrilla, zanja de drenaje, charco, piedras, rincón del patio trasero con árbol.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.garden = function (I) {
  var W = 50, D = 44, H = 23;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, cylY = I.cylY, cylX = I.cylX, flat = I.flat, sphere = I.sphere, sh = I.shade;
  var CH = '#c3ccd3', BRICK = '#b5654a', WOODB = '#8a5a3a', BRASS = '#d6a84a', FXW = I.FX * 1.14;

  I.defs.push(
    '<linearGradient id="sky8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#e6f6fc"/></linearGradient>',
    '<linearGradient id="glass2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe8f5"/><stop offset="1" stop-color="#7fb0cf"/></linearGradient>'
  );
  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function shadow(x0, y0, x1, y1) { sc.add(null, -40, flat([[x0, y0, .03], [x1, y0, .03], [x1, y1, .03], [x0, y1, .03]], 'rgba(30,50,20,.2)')); }
  function rect2(x0, y0, x1, y1, z) { return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; }
  function disc(cx, cy, r, z, fill) { return flat(I.ellPoly(cx, cy, r, r, 18).map(function (p) { return [p[0], p[1], z]; }), fill); }
  var seed = 5; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  function leafShape(cx, cy, ang, s, z, col) {
    var base = [[0, -1], [.5, -.45], [.55, .3], [.2, .8], [0, 1], [-.2, .8], [-.55, .3], [-.5, -.45]], c = Math.cos(ang), n = Math.sin(ang);
    return flat(base.map(function (p) { return [cx + (p[0] * c - p[1] * n) * s * .6, cy + (p[0] * n + p[1] * c) * s, z]; }), col, 'stroke="rgba(60,40,10,.4)" stroke-width=".3"');
  }
  function pyramid(cx, cy, zb, zt, r, n, cols) {
    var pts = [], faces = [], i, t;
    for (i = 0; i < n; i++) { t = i / n * Math.PI * 2; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
    for (i = 0; i < n; i++) {
      var a = pts[i], b = pts[(i + 1) % n], mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy, l = Math.hypot(mx, my) || 1, f = .72 + .36 * ((-.25 * mx / l + .55 * my / l) * .5 + .5);
      faces.push({ d: mx + my, s: flat([[a[0], a[1], zb], [b[0], b[1], zb], [cx, cy, zt]], sh(cols[i % 2], f), 'stroke="rgba(0,0,0,.12)" stroke-width=".3"') });
    }
    faces.sort(function (p, q) { return p.d - q.d; });
    return faces.map(function (f) { return f.s; }).join('');
  }

  // ---------- Suelo: tierra, césped, patio de piedra, rincón trasero ----------
  tick('泥土', -100, box(0, 0, -2.2, W, D, 0, '#7a5230'), [47, 44, -1]);
  var lawn = '', i;
  for (i = 0; i < 14; i++) lawn += flat(rect2(0, i * D / 14, W, (i + 1) * D / 14, .02), i % 2 ? '#86c45f' : '#7bb955');
  tick('草坪', -99, lawn, [30, 14, .02]);
  var pv = '', j;
  for (i = 0; i < 6; i++) for (j = 0; j < 8; j++) pv += flat(rect2(i * 2.5, 14 + j * 2.75, (i + 1) * 2.5, 14 + (j + 1) * 2.75, .05), (i + j) % 2 ? '#d9d1c4' : '#cbc2b3', 'stroke="#b3a998" stroke-width=".4"');
  tick('院子', -98, pv, [10, 17, .05], true);
  var bk = flat(rect2(30, 22, 46, 38, .04), '#64a846') + flat(rect2(30.6, 22.6, 45.4, 37.4, .05), '#6fb44e');
  var edges = box(29.6, 21.6, 0, 46.4, 22.2, .7, '#c9c2b4') + box(29.6, 37.8, 0, 46.4, 38.4, .7, '#c9c2b4') + box(29.6, 22.2, 0, 30.2, 37.8, .7, '#c9c2b4') + box(45.8, 22.2, 0, 46.4, 37.8, .7, '#c9c2b4');
  tick('后院', -97, bk, [31, 36, .05], true);
  tick('后院', 6, edges, [46, 30, .7], true);

  // ---------- Fachada de la casa (pared izquierda) ----------
  deco(-92, box(-1.6, 0, 0, 0, D, 22, '#e9d9c3', { k: 1.14 }) + box(-1.6, 0, 0, .3, D, 1.4, '#b7a58c', { k: 1.14 }));
  tick('窗户', -80, flat(I.planeX(.04, [[6.4, 13.4], [13.6, 13.4], [13.6, 20.4], [6.4, 20.4]]), 'url(#glass2)') + flat(I.planeX(.06, [[7.2, 14], [8.2, 14], [10.6, 19.8], [9.6, 19.8]]), 'rgba(255,255,255,.3)') + box(0, 6, 12.8, .9, 6.6, 21, '#fffaf0') + box(0, 13.4, 12.8, .9, 14, 21, '#fffaf0') + box(0, 6.6, 12.8, .9, 13.4, 13.4, '#fffaf0') + box(0, 6.6, 20.4, .9, 13.4, 21, '#fffaf0') + box(0, 9.7, 13.4, .7, 10.3, 20.4, '#fffaf0'), [.9, 6, 21], true);
  tick('门', -81, flat(I.planeX(.04, [[22.6, 0.4], [29.4, 0.4], [29.4, 11.4], [22.6, 11.4]]), 'url(#glass2)') + box(0, 22, 0, 1, 22.6, 11.8, '#fffaf0') + box(0, 29.4, 0, 1, 30, 11.8, '#fffaf0') + box(0, 22.6, 11.2, 1, 29.4, 11.8, '#fffaf0') + box(0, 25.7, .4, .8, 26.3, 11.2, '#fffaf0') + flat(I.planeX(.06, [[23.4, 1], [24.6, 1], [27, 10.6], [25.8, 10.6]]), 'rgba(255,255,255,.28)'), [1, 25.8, 11.8]);
  tick('门把手', -80, cylX(26.8, 5.6, 1, 1.8, .22, BRASS) + sphere(2, 26.8, 5.6, .45, '#e8c36a'), [2, 26.8, 5.6], true);

  // ---------- Balcón con baranda sobre la puerta ----------
  var bal = box(0, 20.2, 11.8, 5.4, 31.8, 12.4, '#d9ad7c') + box(4.8, 20.4, 0, 5.2, 20.8, 11.8, '#c9c2b4') + box(4.8, 31.2, 0, 5.2, 31.6, 11.8, '#c9c2b4');
  var rl = '';
  [[4.8, 20.4], [4.8, 31.4], [.2, 31.4]].forEach(function (p) { rl += box(p[0], p[1], 12.4, p[0] + .45, p[1] + .45, 17, '#3a3f45'); });
  rl += box(4.8, 20.4, 16.6, 5.25, 31.85, 17, '#3a3f45') + box(.2, 31.4, 16.6, 5.25, 31.85, 17, '#3a3f45') + box(4.8, 20.4, 13.6, 5.25, 31.85, 13.9, '#3a3f45');
  for (i = 21.4; i < 31.2; i += 1.05) rl += box(4.9, i, 12.4, 5.15, i + .25, 16.6, '#3a3f45');
  for (i = 1; i < 4.8; i += 1.05) rl += box(i, 31.5, 12.4, i + .25, 31.75, 16.6, '#3a3f45');
  tick('阳台', 21, bal, [5.2, 26, 12.4], true);
  tick('栏杆', 36, rl, [5, 26, 17], true);
  tick('门', -79, flat(I.planeX(.04, [[22.6, 12.8], [29.4, 12.8], [29.4, 21], [22.6, 21]]), 'url(#glass2)') + box(0, 22, 12.4, 1, 22.6, 21.4, '#fffaf0') + box(0, 29.4, 12.4, 1, 30, 21.4, '#fffaf0') + box(0, 22.6, 20.8, 1, 29.4, 21.4, '#fffaf0'), [1, 26, 21.4], true);

  // ---------- Muro de ladrillo (pared derecha), cerca de madera y portón ----------
  function brickWall(x0, x1, hh) {
    var g = [], z, x, row = 0;
    for (z = 1.1; z < hh; z += 1.1) g.push([[x0, .04, z], [x1, .04, z]]);
    for (z = 0; z < hh - .1; z += 1.1, row++) for (x = x0 + (row % 2 ? .9 : 0) + 1.8; x < x1; x += 1.8) g.push([[x, .04, z], [x, .04, Math.min(z + 1.1, hh)]]);
    return box(x0, -1.6, 0, x1, 0, hh, BRICK) + I.path(g, 'rgba(240,225,205,.55)', .5) + box(x0 - .2, -1.8, hh, x1 + .2, .4, hh + .8, '#d9d1c4');
  }
  tick('围墙', -90, brickWall(0, 27.4, 11) + brickWall(46, 50, 11), [10, 0, 11.8], true);
  var fence = box(27.6, .2, 2.6, 46, .6, 3.2, '#e8e1d2') + box(27.6, .2, 7.4, 46, .6, 8, '#e8e1d2') + box(27.4, 0, 0, 28.2, 1, 11, '#f3efe6') + box(45.6, 0, 0, 46.4, 1, 11, '#f3efe6') + box(35.8, 0, 0, 36.4, 1, 11.4, '#f3efe6') + box(39.6, 0, 0, 40.2, 1, 11.4, '#f3efe6');
  for (i = 28.6; i < 45.4; i += 1.15) { if (i > 35.4 && i < 40.4) continue; fence += box(i, .6, 0, i + .75, 1.05, 10 + (i % 2 ? .2 : 0), '#f7f3ea'); }
  fence += box(36.4, .6, .4, 39.6, .9, 9.4, '#c58f5c') + box(36.4, .9, 2.4, 39.6, 1.1, 2.9, '#a8714a') + box(36.4, .9, 6.9, 39.6, 1.1, 7.4, '#a8714a') + box(38.6, 1.1, 4.4, 39.2, 1.4, 5.6, BRASS);
  tick('栅栏', -86, fence, [32, 1, 10.4], true);

  // ---------- Cantero de flores junto al muro ----------
  var bed = box(2.6, .6, 0, 24.4, 1.2, .9, '#b9b0a0') + box(2.6, 6.4, 0, 24.4, 7, .9, '#b9b0a0') + box(2.6, 1.2, 0, 3.2, 6.4, .9, '#b9b0a0') + box(23.8, 1.2, 0, 24.4, 6.4, .9, '#b9b0a0');
  tick('花园', 17, bed, [13, 7, .9], true);
  tick('泥土', 17.2, flat(rect2(3.2, 1.2, 23.8, 6.4, .92), '#5a3b24') + flat(rect2(4, 1.8, 10, 3, .93), 'rgba(110,75,45,.5)') + flat(rect2(14, 3.6, 20, 5, .93), 'rgba(110,75,45,.5)'), [9, 4.6, .93], true);
  var fl = '';
  [[4.6, 2.2, '#f4a6b8'], [6.2, 4.4, '#e4572e'], [8, 2.4, '#f6d86b'], [9.8, 5, '#ffffff'], [11.6, 2.6, '#f4a6b8'], [13.2, 4.6, '#8e6bbf'], [15, 2.2, '#e4572e'], [16.8, 4.8, '#f6d86b'], [18.4, 2.6, '#f4a6b8'], [20, 4.4, '#ffffff'], [21.8, 2.2, '#8e6bbf'], [22.6, 5, '#e4572e']].forEach(function (f, n) {
    var h = 3.4 + (n % 3) * .6;
    fl += cylZ(f[0], f[1], .92, h, .1, '#3f8a4f') + flat(I.planeY(f[1] + .1, [[f[0] - .9, 1.6 + (n % 2) * .4], [f[0], 1.2 + .5], [f[0] + .9, 1.6 + (n % 2) * .4], [f[0], 2.1]]).map(function (p) { return [p[0], p[1], p[2] + 0]; }), '#4a9b5a') + sphere(f[0], f[1], h + .2, .62, f[2]) + sphere(f[0] + .1, f[1] + .15, h + .34, .24, '#f6b21a');
  });
  tick('花', 18, fl, [13.2, 4.6, 5], true);
  deco(17.6, sphere(3.8, 5.6, 1.9, 1.1, '#4a9b5a') + sphere(23, 5.8, 1.7, 1, '#3f8a4f'));
  tick('花园', 17.3, cylZ(25.6, 7.6, 0, 3, .16, '#8a5a3a') + box(24.6, 7.5, 2.4, 26.6, 7.7, 3.8, '#e8d2b0') + flat(I.planeY(7.71, I.ellPoly(25.6, 3.1, .35, .35, 8)), '#e4572e') + flat(I.planeY(7.71, [[25.55, 2.5], [25.65, 2.5], [25.65, 3.1], [25.55, 3.1]]), '#3f8a4f'), [25.6, 7.7, 4], true);
  var boul = ellZ(26.6, 4.2, 1.5, 1.2, 0, 1.5, '#9aa1a6') + ellZ(28.2, 5.4, 1.1, .9, 0, 1.1, '#b3b9bd') + ellZ(25.4, 5.8, .8, .7, 0, .8, '#8c9399');
  [[18, 17.2], [20.6, 15.4], [23.2, 13.4]].forEach(function (p, n) { boul += flat(I.ellPoly(p[0], p[1], 1.2, .9, 12).map(function (q) { return [q[0], q[1], .09]; }), n % 2 ? '#a8aeb2' : '#b9bfc3', 'stroke="#8c9399" stroke-width=".4"'); });
  tick('石头', 30, boul, [26.6, 4.2, 1.7], true);

  // ---------- Patio: mesa, sillas, sombrilla ----------
  shadow(2, 16, 14, 33);
  function chair(x0, y0, face) {
    var s3 = 2.6, o = box(x0 + .1, y0 + .1, 0, x0 + .4, y0 + .4, 3, '#2a8f8b') + box(x0 + s3 - .4, y0 + .1, 0, x0 + s3 - .1, y0 + .4, 3, '#2a8f8b') + box(x0 + .1, y0 + s3 - .4, 0, x0 + .4, y0 + s3 - .1, 3, '#2a8f8b') + box(x0 + s3 - .4, y0 + s3 - .4, 0, x0 + s3 - .1, y0 + s3 - .1, 3, '#2a8f8b') + box(x0, y0, 3, x0 + s3, y0 + s3, 3.4, '#3fa7a3');
    if (face === 'x') o += box(x0, y0, 3.4, x0 + .4, y0 + s3, 7, '#2a8f8b') + box(x0 + .05, y0 + .3, 4.2, x0 + .35, y0 + s3 - .3, 6.6, '#3fa7a3');
    else if (face === '+y') o += box(x0, y0, 3.4, x0 + s3, y0 + .4, 7, '#2a8f8b') + box(x0 + .3, y0 + .05, 4.2, x0 + s3 - .3, y0 + .35, 6.6, '#3fa7a3');
    else o += box(x0, y0 + s3 - .4, 3.4, x0 + s3, y0 + s3, 7, '#2a8f8b') + box(x0 + .3, y0 + s3 - .35, 4.2, x0 + s3 - .3, y0 + s3 - .05, 6.6, '#3fa7a3');
    return o;
  }
  tick('户外椅', 29, chair(2.6, 24, 'x'), [3, 25.3, 7], true);
  tick('户外椅', 28.5, chair(7, 17.6, '+y'), [8.3, 18, 7], true);
  tick('户外桌', 33, cylZ(8, 25.2, 0, .3, 1.4, '#2a8f8b') + cylZ(8, 25.2, .3, 6.6, .35, '#2a8f8b') + cylZ(8, 25.2, 6.6, 7.1, 3.4, '#d9ad7c') + I.path([[[5.2, 25.2, 7.12], [10.8, 25.2, 7.12]], [[8, 22.4, 7.12], [8, 28, 7.12]]], 'rgba(120,80,40,.5)', .6), [10.6, 26.4, 7.1]);
  tick('户外椅', 39, chair(6.7, 29.6, '-y'), [8, 31.4, 7], true);
  tick('遮阳伞', 100, cylZ(8, 25.2, 7.1, 17.6, .16, '#8c969d') + pyramid(8, 25.2, 15.2, 18.2, 6.8, 8, ['#e8806b', '#fffaf0']) + sphere(8, 25.2, 18.4, .35, '#8c969d'), [8, 25.2, 18.6], true);

  function pot(x, y, r, h, fl) { return cylZ(x, y, 0, h, r, '#c9825b') + cylZ(x, y, h - .3, h, r * 1.12, '#b4714d') + disc(x, y, r * .95, h + .02, '#5a3b24') + fl.reduce(function (a, f) { return a + cylZ(x + f[0], y + f[1], h, h + f[2], .08, '#3f8a4f') + sphere(x + f[0], y + f[1], h + f[2] + .25, .5, f[3]); }, '') + sphere(x, y, h + .9, r * .9, '#4a9b5a'); }
  tick('花盆', 29.6, pot(13.2, 16.8, 1.3, 2.4, [[-.4, -.3, 1.8, '#f4a6b8'], [.5, .2, 2.2, '#e4572e'], [.1, -.5, 1.4, '#f6d86b']]) + pot(11.4, 18.2, .9, 1.7, [[0, 0, 1.4, '#8e6bbf']]) + pot(14.6, 18.6, .8, 1.5, [[.1, 0, 1.2, '#f6d86b']]), [13.2, 16.8, 5], true);

  // ---------- Zanja de drenaje, charco, hojas caídas ----------
  var dr = box(15.2, 14, 0, 16.8, 36, .3, '#b3a998') + flat(rect2(15.6, 14.4, 16.4, 35.6, .32), '#3a3f45'), s2;
  for (s2 = 14.8; s2 < 35.4; s2 += 1.2) dr += flat(rect2(15.6, s2, 16.4, s2 + .45, .34), '#8c969d');
  tick('排水沟', -90, dr, [16, 30, .4], true);
  tick('水坑', -88, flat(I.ellPoly(12.6, 32.4, 2.2, 1.5, 20).map(function (p) { return [p[0], p[1], .08]; }), 'rgba(110,165,205,.78)') + flat(I.ellPoly(12.2, 32.2, .9, .5, 12).map(function (p) { return [p[0], p[1], .09]; }), 'rgba(255,255,255,.5)') + flat(I.ellPoly(12.6, 32.4, 2.2, 1.5, 20).map(function (p) { return [p[0], p[1], .1]; }), 'none', 'stroke="rgba(90,140,180,.8)" stroke-width=".5"'), [12.6, 32.4, .1], true);
  var lv = '';
  [[34, 26, '#d9822b'], [36, 33, '#c0392b'], [38.6, 25, '#e8a31f'], [41.5, 34, '#b5651d'], [33, 31, '#e8a31f'], [43, 27, '#c0392b'], [31.6, 35, '#d9822b'], [40, 36, '#b5651d'], [13.6, 20, '#d9822b'], [15, 26, '#e8a31f'], [11, 35.4, '#c0392b'], [4.6, 33, '#b5651d']].forEach(function (l, n) { lv += leafShape(l[0], l[1], n * 1.1, 1.1, .1, l[2]); });
  tick('落叶', -87, lv, [38.6, 25, .1], true);
  var st = '';
  [[18.6, 33], [21, 30.2], [23.4, 27.4], [25.8, 24.2], [28.2, 21.6]].forEach(function (p, n) { st += flat(I.ellPoly(p[0], p[1], 1.4, 1, 12).map(function (q) { return [q[0], q[1], .1]; }), n % 2 ? '#a8aeb2' : '#b9bfc3', 'stroke="#8c969d" stroke-width=".4"'); });
  tick('石头', -86, st, [23.4, 27.4, .1], true);
  var gr = '';
  [[22, 40, 1], [26, 36, 1], [34, 12, 1], [38, 9, 1], [44, 14, 1], [20, 8.4, 1], [4, 11, 1], [6.4, 40.6, 1], [47, 40, 1], [29, 42, 1], [43, 42, 1]].forEach(function (g) {
    for (i = 0; i < 5; i++) gr += flat(I.planeY(g[1] + i * .08, [[g[0] + i * .35 - .35, .05], [g[0] + i * .35 - .1, 1.5 + (i % 3) * .5], [g[0] + i * .35 + .1, .05]]), i % 2 ? '#3f8a4f' : '#52a85e');
  });
  tick('草', 5, gr, [34, 12, 2.2], true);

  // ---------- Árbol con rama y hojas ----------
  shadow(36, 26, 44.4, 34);
  var tr = cylZ(40, 30, 0, 1.4, 1.5, '#7a5230') + cylZ(40, 30, 1.4, 10.6, 1, '#7a5230');
  tick('树', 70, tr + [[40, 30, 15, 4.4, '#4a9b5a'], [37.4, 31.4, 13, 3.4, '#3f8a4f'], [43, 29, 13.4, 3.6, '#4a9b5a'], [40, 33, 13.4, 3.2, '#52a85e'], [41.6, 27.6, 12.6, 3, '#3f8a4f'], [37.6, 28, 12.6, 3, '#4a9b5a'], [40.4, 30.4, 18, 3.2, '#52a85e'], [43.4, 32.4, 12.4, 2.6, '#3f8a4f']].reduce(function (a, c) { return a + sphere(c[0], c[1], c[2], c[3], c[4]); }, ''), [40, 30, 20.4], true);
  tick('树枝', 70.5, cylX(31.4, 8.4, 34, 39.6, .34, '#7a5230') + cylX(31.4, 9.6, 34.6, 37.2, .16, '#7a5230') + cylZ(35.6, 31.4, 8.4, 11.4, .14, '#7a5230') + cylX(31.4, 8.4, 33.6, 34.2, .2, '#6b4423'), [35, 31.4, 11.6], true);
  var lf = '';
  [[34.4, 31.9, 7.6, .3], [35.6, 31.9, 7, -.4], [36.8, 31.9, 7.8, .5], [35, 31.9, 8.8, -.2], [36.2, 31.9, 9.2, .6]].forEach(function (l) {
    var ct = I.planeY(l[1], I.ellPoly(0, 0, 1, 1, 4)); lf += flat(I.planeY(l[1], [[l[0], l[2] + 1.3], [l[0] + .7, l[2] + .5], [l[0] + .8, l[2] - .3], [l[0] + .3, l[2] - 1.1], [l[0] - .2, l[2] - .3], [l[0] - .3, l[2] + .5]].map(function (p) { return [p[0] + Math.sin(l[3]) * .3, p[1]]; })), '#52a85e', 'stroke="#2f6a3a" stroke-width=".4"');
  });
  tick('树叶', 70.6, lf, [35.6, 31.9, 10.6], true);

  // ---------- Cubo de basura ----------
  tick('垃圾桶', 54, box(45.2, 6.4, 0, 47.8, 9, 6.6, '#4a8f5a') + box(45, 6.2, 6.6, 48, 9.2, 7.1, '#3a7a49') + box(45.1, 8.9, 6.9, 47.9, 9.3, 7.3, '#3a7a49') + cylX(7, .5, 47.8, 48.3, .5, '#2b2b33') + cylX(8.4, .5, 47.8, 48.3, .5, '#2b2b33') + box(45.6, 9.01, 3, 47.4, 9.05, 5.4, '#e8f1ea') + sphere(46.5, 7.7, 7.6, .7, '#f4f4f0'), [46.5, 7.8, 7.8], true);

  // ---------- Manguera, regadera, escoba, cuerda de tender ----------
  tick('水管', 40, box(0, 34.2, 3.2, 1.2, 34.8, 3.8, CH) + cylZ(1, 34.5, 3.8, 4.8, .22, CH) + [[1.6, 35, 1.2], [2.6, 36.4, .5], [4, 38, .4], [6, 38.8, .4], [8.2, 38, .4], [9.6, 36.2, .4], [9.4, 34, .4], [8, 32.6, .4], [10.8, 35.4, .4]].reduce(function (a, p) { return a + sphere(p[0], p[1], p[2], .34, '#3fa56a'); }, '') + box(10.4, 35, .1, 11.6, 35.8, .9, '#d6a84a'), [6, 38.8, .8], true);
  tick('浇水壶', 41, cylZ(5.6, 41.4, 0, 2.6, 1.4, '#3fa7a3') + cylZ(5.6, 41.4, 2.6, 2.8, 1.2, '#2a8f8b') + box(7, 41.1, 1.4, 8.2, 41.7, 1.8, '#3fa7a3') + box(8.2, 41.1, 1.8, 9.2, 41.7, 3.2, '#3fa7a3') + cylZ(9, 41.4, 3.2, 3.5, .5, '#2a8f8b') + box(3.8, 41.2, .8, 4.2, 41.6, 3.8, '#2a8f8b') + box(3.8, 41.2, 3.6, 5.4, 41.6, 4, '#2a8f8b'), [5.6, 41.4, 4.2], true);
  tick('扫帚', 20, box(0, 17.4, 14.6, .9, 18.4, 15.1, WOODB) + cylZ(.9, 17.9, 2.2, 15, .22, '#c58f5c') + box(.35, 17.2, .6, 1.5, 18.6, 3, '#d9a02b') + box(.4, 17.3, 2.4, 1.4, 18.5, 3.2, '#7a4b2a'), [.9, 17.9, 15.4], true);
  var cl = '', sheet = I.planeY(11.05, [[2.4, 13.6], [5.8, 13.6], [5.8, 8.6], [2.4, 8.6]]);
  cl += cylZ(16.4, 11, 0, 14.4, .3, '#8a5a3a') + I.path([[[0, 11, 14], [16.4, 11, 14.2]]], '#5a5f66', 1.1) +
    flat(I.planeY(11.05, [[2.4, 13.9], [6, 13.9], [6, 8.8], [2.4, 8.8]]), sh('#f4f1e8', I.FY), 'stroke="rgba(0,0,0,.2)" stroke-width=".4"') +
    flat(I.planeY(11.05, [[7.4, 13.9], [8.4, 13.9], [8.9, 13.2], [10.4, 13.2], [10.9, 13.9], [12, 13.9], [12.8, 12], [11.6, 11.2], [11.6, 8], [7.2, 8], [7.2, 11.2], [6, 12]]), sh('#e4572e', I.FY), 'stroke="rgba(0,0,0,.2)" stroke-width=".4"') +
    flat(I.planeY(11.05, [[13.4, 13.9], [15.8, 13.9], [15.8, 9.2], [13.4, 9.2]]), sh('#4a90d9', I.FY), 'stroke="rgba(0,0,0,.2)" stroke-width=".4"');
  tick('晾衣绳', 27.5, cl, [8, 11, 14.2], true);
  return sc;
};
