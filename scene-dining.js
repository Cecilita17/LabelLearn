// Comedor en isométrico. Medidas en unidades de 10 cm: 4,6 m x 4,0 m, pared de 2,7 m.
// Pared derecha = plano y=0: aparador con bandeja, frutero y florero, cuadros y puerta.
// Pared izquierda = plano x=0: ventana grande con cortinas.
// Centro: mesa con mantel a cuadros, mesa servida, cuatro sillas, silla alta y silla de comer de bebé; lámpara colgante.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.dining = function (I) {
  var W = 46, D = 40, H = 27;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, cylY = I.cylY, cylX = I.cylX, flat = I.flat, sphere = I.sphere, sh = I.shade;
  var CH = '#c3ccd3', PAINT = '#f1d3c4', PANEL = '#9c6b4a', WOOD = '#c58f5c', DARK = '#8a5a3a', BRASS = '#d6a84a', CLOTH = '#fbf4ea';
  var FXW = I.FX * 1.14;

  I.defs.push(
    '<linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#e6f6fc"/></linearGradient>',
    '<radialGradient id="halo2"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>'
  );
  function shadow(x0, y0, x1, y1) { sc.add(null, -50, flat([[x0, y0, .02], [x1, y0, .02], [x1, y1, .02], [x0, y1, .02]], 'rgba(60,40,20,.16)')); }
  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function rect2(x0, y0, x1, y1, z) { return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; }
  function disc(cx, cy, r, z, fill) { return flat(I.ellPoly(cx, cy, r, r, 18).map(function (p) { return [p[0], p[1], z]; }), fill); }
  function ring(cx, cy, r, z, stroke) { return flat(I.ellPoly(cx, cy, r, r, 18).map(function (p) { return [p[0], p[1], z]; }), 'none', 'stroke="' + stroke + '" stroke-width=".6"'); }

  // ---------- Suelo, paredes con boiserie ----------
  var s = box(0, 0, -2, W, D, 0, '#a8774a'), i;
  for (i = 0; i < 16; i++) s += flat([[i * W / 16, 0, 0], [(i + 1) * W / 16, 0, 0], [(i + 1) * W / 16, D, 0], [i * W / 16, D, 0]], i % 2 ? '#d7a46f' : '#cd9a64', 'stroke="#a8774a" stroke-width=".35"');
  sc.add('地板', -100, s, { a: [38, 34, 0] });
  sc.add('墙', -90, box(-1.6, -1.6, 0, W, 0, H, PAINT), { a: [4, 0, 22] });
  sc.add('墙', -90, box(-1.6, 0, 0, 0, D, H, PAINT, { k: 1.14 }), { a: [0, 36, 22] });
  function panel(plane, len, fx) {
    var pl = plane === 'y' ? I.planeY : I.planeX, g = [], m, out = flat(pl(.04, [[0, 0], [len, 0], [len, 9], [0, 9]]), sh(PANEL, fx));
    for (m = 0; m + 4 <= len; m += 4.6) { g.push([pl(.05, [[m + .4, 1]])[0], pl(.05, [[m + 3.6, 1]])[0]], [pl(.05, [[m + 3.6, 1]])[0], pl(.05, [[m + 3.6, 7.6]])[0]], [pl(.05, [[m + 3.6, 7.6]])[0], pl(.05, [[m + .4, 7.6]])[0]], [pl(.05, [[m + .4, 7.6]])[0], pl(.05, [[m + .4, 1]])[0]]); }
    return out + I.path(g, 'rgba(60,35,20,.55)', .6) + flat(pl(.05, [[0, 9], [len, 9], [len, 9.9], [0, 9.9]]), sh('#fffaf0', fx));
  }
  sc.add('墙', -88, panel('y', W, I.FY), { a: [34, 0, 4] });
  sc.add('墙', -88, panel('x', D, FXW), { a: [0, 6, 4] });
  sc.add('天花板', -86, box(0, 0, H - 1.7, W, 1.3, H, '#fffaf0') + box(0, 1.3, H - 1.7, 1.3, D, H, '#fffaf0'), { a: [24, 0, H - .8], small: true, dot: [24, .6, H - .8] });
  sc.add('踢脚线', -85, box(0, 0, 0, W, .5, 1.3, '#fffaf0') + box(0, .5, 0, .5, D, 1.3, '#fffaf0'), { a: [32, .5, .7], small: true, dot: [32, .5, .7] });
  // cuadros sobre el aparador (decorativos)
  [[12, 17.5, '#7bbf6a'], [19, 24.5, '#e8a15b'], [26, 28.5, '#6aa6d6']].forEach(function (f) {
    var x0 = f[0], x1 = f[0] + (f[0] === 19 ? 5 : 4.4), z0 = f[0] === 19 ? 13.6 : 14.4, z1 = f[0] === 19 ? 21.6 : 20.6;
    deco(-80, flat(I.planeY(.06, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]), sh('#6b4423', I.FY)) + flat(I.planeY(.07, [[x0 + .5, z0 + .5], [x1 - .5, z0 + .5], [x1 - .5, z1 - .5], [x0 + .5, z1 - .5]]), sh('#fdf3df', I.FY)) +
      flat(I.planeY(.08, [[x0 + .9, z0 + .9], [x1 - .9, z0 + .9], [x1 - .9, z1 - .9], [x0 + .9, z1 - .9]]), sh(f[2], I.FY)));
  });

  // ---------- Ventana grande (pared izquierda) ----------
  tick('窗帘', -60, box(0, 9.6, 23.8, 2.4, 29.6, 24.3, CH) + box(0, 10, 9.8, 2.2, 14, 23.8, '#e8806b') + box(0, 25.2, 9.8, 2.2, 29.2, 23.8, '#e8806b') +
    I.path([[[2.25, 10.8, 10], [2.25, 10.8, 23.6]], [[2.25, 12.2, 10], [2.25, 12.2, 23.6]], [[2.25, 26, 10], [2.25, 26, 23.6]], [[2.25, 27.4, 10], [2.25, 27.4, 23.6]]], 'rgba(140,50,40,.4)', .6), [2.2, 11, 20]);
  sc.add('窗户', -62, flat(I.planeX(.5, [[14.4, 10.8], [24.6, 10.8], [24.6, 22.6], [14.4, 22.6]]), 'url(#sky4)') + flat(I.planeX(.55, [[15.6, 11.2], [17, 11.2], [20.4, 22.2], [19, 22.2]]), 'rgba(255,255,255,.3)'), { a: [.5, 19.5, 17] });
  sc.add('窗框', -61, box(0, 13.6, 10, 1.2, 14.4, 23.4, '#fffaf0') + box(0, 24.6, 10, 1.2, 25.4, 23.4, '#fffaf0') + box(0, 14.4, 10, 1.2, 24.6, 10.8, '#fffaf0') + box(0, 14.4, 22.6, 1.2, 24.6, 23.4, '#fffaf0') + box(0, 19.1, 10.8, .9, 19.9, 22.6, '#fffaf0') + box(0, 14.4, 17.5, .9, 24.6, 18.1, '#fffaf0'), { a: [1.2, 13.6, 23.4], small: true, dot: [1.2, 13.6, 23.4] });
  sc.add('窗台', -59, box(0, 13, 9.2, 2.4, 26, 10, '#fffaf0'), { a: [2.4, 26, 9.6], small: true, dot: [2.4, 26, 9.6] });

  // ---------- Puerta (pared derecha) ----------
  tick('门框', 40, box(35.2, 0, 0, 35.8, 1.1, 22, '#fffaf0') + box(43, 0, 0, 43.6, 1.1, 22, '#fffaf0') + box(35.2, 0, 21.4, 43.6, 1.1, 22, '#fffaf0'), [35.5, 1.1, 22], true);
  tick('门', 40.1, box(35.8, 0, 0, 43, .9, 21.4, '#8a5a3a') + flat(I.planeY(.95, [[36.8, 11], [42, 11], [42, 20.2], [36.8, 20.2]]), sh('#744a2e', I.FY)) + flat(I.planeY(.95, [[36.8, 1.2], [42, 1.2], [42, 9.8], [36.8, 9.8]]), sh('#744a2e', I.FY)), [39.4, .9, 6]);
  tick('门把手', 40.3, cylY(36.7, 10.5, .9, 1.7, .55, BRASS) + sphere(36.7, 2.2, 10.5, .75, '#e8c36a'), [36.7, 2.2, 10.5], true);

  // ---------- Aparador con bandeja, frutero y florero ----------
  shadow(10.4, 0, 30.4, 5.8);
  var sb = box(11, .2, 0, 29.4, 4.8, 8.2, '#a8714a'), n;
  for (n = 0; n < 4; n++) {
    sb += flat(I.planeY(4.83, [[11.5 + n * 4.5, .8], [15.5 + n * 4.5, .8], [15.5 + n * 4.5, 7.6], [11.5 + n * 4.5, 7.6]]), sh('#8f5c3a', I.FY), 'stroke="rgba(50,25,10,.6)" stroke-width=".5"') + box(13.3 + n * 4.5, 4.83, 5.2, 13.7 + n * 4.5, 5.25, 6.6, BRASS);
  }
  sb += box(11.3, 4.6, 0, 11.9, 5, 1, '#6b4423') + box(28.5, 4.6, 0, 29.1, 5, 1, '#6b4423');
  tick('餐具柜', 22.7, sb, [20, 4.8, 4]);
  tick('餐具柜', 22.8, box(10.6, 0, 8.2, 29.8, 5.2, 8.8, '#d9ad7c'), [29.6, 5.2, 8.8]);
  var tray = box(12.4, 1.2, 8.8, 18.2, 4.4, 9.1, '#e8d2b0') + box(12.4, 1.2, 9.1, 18.2, 1.5, 9.5, '#e8d2b0') + box(12.4, 4.1, 9.1, 18.2, 4.4, 9.5, '#e8d2b0') + box(12.4, 1.2, 9.1, 12.7, 4.4, 9.5, '#e8d2b0') + box(17.9, 1.2, 9.1, 18.2, 4.4, 9.5, '#e8d2b0');
  tick('托盘', 22.9, tray, [18.2, 4.4, 9.5], true);
  tick('水杯', 23, cylZ(13.9, 2.7, 9.1, 11, .6, '#d3ecf5') + cylZ(15.3, 3.4, 9.1, 11, .6, '#d3ecf5') + cylZ(16.7, 2.6, 9.1, 11, .6, '#d3ecf5') + disc(13.9, 2.7, .5, 11.02, '#a8dcf0') + disc(15.3, 3.4, .5, 11.02, '#a8dcf0') + disc(16.7, 2.6, .5, 11.02, '#a8dcf0'), [15.3, 3.4, 11.4], true);
  var fr = cylZ(22.6, 2.5, 8.8, 9.4, 1.8, '#c58f5c') + cylZ(22.6, 2.5, 9.4, 9.9, 2.4, '#d7a46f') + disc(22.6, 2.5, 2, 9.92, '#a8714a');
  [[21.6, 2.2, '#e4572e'], [23.6, 2.6, '#f2a31b'], [22.4, 3.3, '#7bbf6a'], [22.8, 1.8, '#e4572e'], [21.5, 3.2, '#f6d86b']].forEach(function (f) { fr += sphere(f[0], f[1], 10.5, .85, f[2]); });
  tick('水果盘', 23, fr, [22.6, 2.5, 11.6], true);
  var vz = cylZ(27.6, 2.4, 8.8, 11.2, .95, '#3fa7a3') + cylZ(27.6, 2.4, 11.2, 12.8, .55, '#3fa7a3') + disc(27.6, 2.4, .4, 12.82, '#1d5f5c');
  [[26.6, 1.9, 15.4, '#f4a6b8'], [27.6, 2.6, 16.3, '#e4572e'], [28.6, 2.1, 15.2, '#f6d86b'], [27.2, 3, 14.6, '#f4a6b8'], [28.2, 3.1, 15.4, '#e4572e']].forEach(function (f) {
    vz += cylZ(f[0] * .35 + 27.6 * .65, f[1] * .35 + 2.4 * .65, 12.8, f[2], .09, '#3f8a4f') + sphere(f[0], f[1], f[2] + .3, .55, f[3]);
  });
  tick('花瓶', 23, vz, [27.6, 2.4, 16.8], true);

  // ---------- Alfombra y sombras ----------
  deco(-45, flat(rect2(9, 11, 36, 31, .06), '#e8d2b0') + flat(rect2(9.8, 11.8, 35.2, 30.2, .07), '#c0504a') + flat(rect2(11, 13, 34, 29, .08), '#e8d2b0') + flat(rect2(11.6, 13.6, 33.4, 28.4, .09), '#d98a5f'));
  shadow(13.4, 16.6, 31.6, 27.8);

  // ---------- Mesa con mantel ----------
  var T = 43.5, ZT = 7.9;
  tick('桌子腿', T, box(13.6, 17.2, 0, 14.4, 18, 7.2, WOOD) + box(29.6, 17.2, 0, 30.4, 18, 7.2, WOOD) + box(13.6, 25, 0, 14.4, 25.8, 7.2, WOOD) + box(29.6, 25, 0, 30.4, 25.8, 7.2, WOOD), [30, 25.4, 3], true);
  tick('餐桌', T + .01, box(13, 16.6, 7.2, 31, 26.4, ZT, '#b9824f'), [30.5, 26.4, ZT]);
  var gh = [], m;
  for (m = 13.6; m < 31; m += 1.5) gh.push([[m, 16, ZT + .22], [m, 27, ZT + .22]]);
  for (m = 16.5; m < 27; m += 1.5) gh.push([[13, m, ZT + .22], [31, m, ZT + .22]]);
  tick('桌布', T + .02, box(13, 16, ZT, 31, 27, ZT + .2, CLOTH) + box(13, 27, 6, 31, 27.2, ZT + .2, '#efe4d2') + box(31, 16, 6, 31.2, 27.2, ZT + .2, '#e4d8c4') + I.path(gh, 'rgba(216,80,74,.4)', .8) +
    I.path([[[13, 27.21, 6.4], [31, 27.21, 6.4]], [[31.21, 16, 6.4], [31.21, 27, 6.4]]], 'rgba(216,80,74,.55)', 1), [14, 27, ZT + .2]);
  tick('污渍', T + .05, flat(I.ellPoly(27.4, 21.8, 1.5, .9, 14).map(function (p) { return [p[0], p[1], ZT + .24]; }), 'rgba(120,28,48,.55)') + flat(I.ellPoly(28.6, 22.6, .5, .35, 10).map(function (p) { return [p[0], p[1], ZT + .24]; }), 'rgba(120,28,48,.5)'), [27.4, 21.8, ZT + .3], true);
  var cr = '';
  [[15.1, 24.8], [15.7, 25.3], [14.6, 25.6], [15.9, 24.4], [14.9, 24.2], [16.3, 25.7]].forEach(function (p, q) { cr += box(p[0], p[1], ZT + .2, p[0] + .35, p[1] + .3, ZT + .55, q % 2 ? '#c58f5c' : '#e1b97a'); });
  tick('食物残渣', T + .06, cr, [15.4, 25, ZT + .6], true);

  // ---------- Mesa servida: individuales, vajilla, servilletas, vasos ----------
  var mats = '', cut = '', setts = [[17.5, 17.3], [24.5, 17.3], [17.5, 23.2], [24.5, 23.2]];
  setts.forEach(function (p, q) {
    var cx = p[0] + 1.8, cy = p[1] + 1.3, z0 = ZT + .22;
    mats += box(p[0], p[1], z0, p[0] + 3.6, p[1] + 2.6, z0 + .12, '#d9b383') + I.path([[[p[0], p[1] + .9, z0 + .13], [p[0] + 3.6, p[1] + .9, z0 + .13]], [[p[0], p[1] + 1.7, z0 + .13], [p[0] + 3.6, p[1] + 1.7, z0 + .13]]], 'rgba(150,100,50,.5)', .6);
    cut += cylZ(cx, cy, z0 + .12, z0 + .4, 1.05, '#fbfaf6') + ring(cx, cy, .8, z0 + .42, '#9fbcd2') + box(p[0] + .2, p[1] + .5, z0 + .12, p[0] + .45, p[1] + 2.1, z0 + .22, CH) + box(p[0] + .15, p[1] + .3, z0 + .12, p[0] + .5, p[1] + .6, z0 + .22, CH) +
      box(p[0] + 3.1, p[1] + .5, z0 + .12, p[0] + 3.35, p[1] + 2.1, z0 + .22, CH) + box(p[0] + 2.95, p[1] + .4, z0 + .12, p[0] + 3.4, p[1] + 1.1, z0 + .24, '#dfe5e9');
  });
  tick('餐垫', T + .1, mats, [18.5, 18.3, ZT + .4], true);
  tick('餐具', T + .2, cut, [20.5, 24.3, ZT + .9], true);
  tick('餐巾', T + .25, box(20.3, 17.6, ZT + .4, 21.3, 19.4, ZT + .6, '#3fa7a3') + box(20.35, 17.7, ZT + .6, 21.25, 19.3, ZT + .7, '#4fc0be') + box(20.3, 23.5, ZT + .4, 21.3, 25.3, ZT + .6, '#e8806b') + box(20.35, 23.6, ZT + .6, 21.25, 25.2, ZT + .7, '#f09a87'), [27, 19, ZT + .8], true);
  tick('水杯', T + .3, cylZ(22.5, 17.7, ZT + .22, ZT + 2.2, .55, '#d3ecf5') + disc(22.5, 17.7, .46, ZT + 2.24, '#a8dcf0') + cylZ(29, 17.8, ZT + .22, ZT + 2.2, .55, '#d3ecf5') + disc(29, 17.8, .46, ZT + 2.24, '#a8dcf0'), [22.5, 17.7, ZT + 2.7], true);
  tick('水壶', T + .35, cylZ(22.4, 21.6, ZT + .22, ZT + 3.2, 1, '#d3ecf5') + cylZ(22.4, 21.6, ZT + .22, ZT + 2.4, .9, '#bfe3f2') + disc(22.4, 21.6, .8, ZT + 3.22, '#a8dcf0') + box(23.2, 21.4, ZT + 1.2, 24, 21.8, ZT + 3, '#d3ecf5') + sphere(22.1, 21.4, ZT + 3.1, .45, '#f6d86b') + sphere(22.8, 21.9, ZT + 3.1, .4, '#f6d86b'), [22.4, 21.6, ZT + 3.8], true);
  tick('餐巾纸', T + .4, box(25.3, 21, ZT + .22, 26.9, 22, ZT + 1.4, '#c58f5c') + box(25.45, 21.1, ZT + 1.4, 26.75, 21.9, ZT + 2.3, '#ffffff') + box(25.8, 21.2, ZT + 2.3, 26.4, 21.8, ZT + 2.7, '#f1f1ee'), [26, 21.5, ZT + 2.9], true);
  tick('水杯', T + .8, cylZ(22.5, 24.6, ZT + .22, ZT + 2.2, .55, '#d3ecf5') + disc(22.5, 24.6, .46, ZT + 2.24, '#a8dcf0') + cylZ(29, 24.5, ZT + .22, ZT + 2.2, .55, '#d3ecf5') + disc(29, 24.5, .46, ZT + 2.24, '#a8dcf0'), [29, 24.5, ZT + 2.7], true);

  // ---------- Sillas ----------
  function chair(x0, y0, face, key, cush, label) {
    var s3 = 3.2, legs = box(x0 + .1, y0 + .1, 0, x0 + .5, y0 + .5, 2.6, DARK) + box(x0 + s3 - .5, y0 + .1, 0, x0 + s3 - .1, y0 + .5, 2.6, DARK) + box(x0 + .1, y0 + s3 - .5, 0, x0 + .5, y0 + s3 - .1, 2.6, DARK) + box(x0 + s3 - .5, y0 + s3 - .5, 0, x0 + s3 - .1, y0 + s3 - .1, 2.6, DARK);
    var frame = box(x0, y0, 2.6, x0 + s3, y0 + s3, 3.2, WOOD), back = '';
    if (face === '+y') back = box(x0, y0, 3.2, x0 + .45, y0 + .5, 8.8, WOOD) + box(x0 + s3 - .45, y0, 3.2, x0 + s3, y0 + .5, 8.8, WOOD) + box(x0, y0, 7.8, x0 + s3, y0 + .5, 8.8, WOOD) + box(x0 + 1, y0, 3.8, x0 + 1.35, y0 + .4, 7.8, WOOD) + box(x0 + 1.85, y0, 3.8, x0 + 2.2, y0 + .4, 7.8, WOOD);
    else if (face === '-y') back = box(x0, y0 + s3 - .5, 3.2, x0 + .45, y0 + s3, 8.8, WOOD) + box(x0 + s3 - .45, y0 + s3 - .5, 3.2, x0 + s3, y0 + s3, 8.8, WOOD) + box(x0, y0 + s3 - .5, 7.8, x0 + s3, y0 + s3, 8.8, WOOD) + box(x0 + 1, y0 + s3 - .4, 3.8, x0 + 1.35, y0 + s3, 7.8, WOOD) + box(x0 + 1.85, y0 + s3 - .4, 3.8, x0 + 2.2, y0 + s3, 7.8, WOOD);
    else back = box(x0 + s3 - .5, y0, 3.2, x0 + s3, y0 + .45, 8.8, WOOD) + box(x0 + s3 - .5, y0 + s3 - .45, 3.2, x0 + s3, y0 + s3, 8.8, WOOD) + box(x0 + s3 - .5, y0, 7.8, x0 + s3, y0 + s3, 8.8, WOOD) + box(x0 + s3 - .4, y0 + 1, 3.8, x0 + s3, y0 + 1.35, 7.8, WOOD) + box(x0 + s3 - .4, y0 + 1.85, 3.8, x0 + s3, y0 + 2.2, 7.8, WOOD);
    var cu = cush ? box(x0 + .25, y0 + .25, 3.2, x0 + s3 - .25, y0 + s3 - .25, 3.75, cush) : '';
    var near = face !== '+y';
    if (near) { tick('餐椅', key, legs + frame, [x0 + 1.6, y0 + 1.6, 3.2], true); if (cu) tick('椅垫', key + .1, cu, [x0 + 1.6, y0 + 1.6, 3.8], true); tick('椅背', key + .2, back, [x0 + (face === '-x' ? 3 : 1.6), y0 + (face === '-x' ? 1.6 : 3), 8.8], true); }
    else { tick('椅背', key, back, [x0 + 1.6, y0, 8.8], true); tick('餐椅', key + .1, legs + frame, [x0 + 1.6, y0 + 1.6, 3.2], true); if (cu) tick('椅垫', key + .2, cu, [x0 + 1.6, y0 + 1.6, 3.8], true); }
  }
  shadow(15.6, 14, 29, 17.6); shadow(15.6, 25, 29, 29);
  chair(17.4, 14.2, '+y', 35, '#e8806b');
  chair(24.4, 14.2, '+y', 42, '#3fa7a3');
  chair(24.4, 25.3, '-y', 52.8, '#3fa7a3');
  chair(17.4, 25.3, '-y', 46, null);
  chair(29, 19.9, '-x', 52.2, '#e8806b');
  // silla de comer de bebé sobre la silla izquierda delantera
  tick('儿童餐椅', 46.35, box(17.7, 25.6, 3.2, 20.3, 28.1, 4.6, '#f2b366') + box(17.7, 26.6, 4.6, 18.3, 28.1, 8.6, '#f2b366') + box(19.7, 26.6, 4.6, 20.3, 28.1, 8.6, '#f2b366') + box(17.7, 27.2, 4.6, 20.3, 28.1, 9.2, '#f2b366') + box(18.5, 25.7, 4.6, 19.5, 26.3, 5.2, '#4a90d9') + sphere(19, 26, 5.5, .35, '#4a90d9'), [19, 27.4, 9.2], true);
  // silla alta junto a la cabecera
  tick('高脚椅', 37, box(9.6, 20, 0, 10.1, 20.5, 5.2, WOOD) + box(11.9, 20, 0, 12.4, 20.5, 5.2, WOOD) + box(9.6, 22.4, 0, 10.1, 22.9, 5.2, WOOD) + box(11.9, 22.4, 0, 12.4, 22.9, 5.2, WOOD) + box(11.6, 20, 2.2, 12.4, 22.9, 2.6, WOOD) +
    box(9.6, 20, 5.2, 12.4, 22.9, 5.8, WOOD) + box(9.6, 20, 5.8, 10.2, 20.5, 12.4, WOOD) + box(9.6, 22.4, 5.8, 10.2, 22.9, 12.4, WOOD) + box(9.6, 20, 11.4, 10.2, 22.9, 12.4, WOOD) +
    box(9.8, 20, 5.8, 12.4, 20.4, 6.9, WOOD) + box(9.8, 22.5, 5.8, 12.4, 22.9, 6.9, WOOD) + box(11.8, 19.7, 6.9, 13.6, 23.2, 7.3, '#3fa7a3') + box(11.8, 19.7, 7.3, 13.6, 20, 7.8, '#3fa7a3') + box(11.8, 22.9, 7.3, 13.6, 23.2, 7.8, '#3fa7a3') + box(13.3, 19.7, 7.3, 13.6, 23.2, 7.8, '#3fa7a3'), [11, 21.4, 12.4], true);

  // ---------- Lámpara colgante ----------
  tick('吊灯', 100, box(21.2, 0, 23, 22.6, 25, 24.2, '#7a4b2a') + cylZ(21.9, 21.5, 17.6, 22.6, .1, '#2b2118') + cylZ(21.9, 21.5, 17.2, 17.8, .5, '#2b2118') +
    '<circle cx="' + I.P(21.9, 21.5, 15.2)[0].toFixed(1) + '" cy="' + I.P(21.9, 21.5, 15.2)[1].toFixed(1) + '" r="26" fill="url(#halo2)"/>' + cylZ(21.9, 21.5, 16.6, 17.2, .8, '#e8a15b') + cylZ(21.9, 21.5, 15.9, 16.6, 1.5, '#e8a15b') + cylZ(21.9, 21.5, 15.4, 15.9, 2.2, '#e8a15b') + sphere(21.9, 21.5, 15.2, .8, '#fff3c4'), [21.9, 21.5, 17.6], true);
  return sc;
};
