// Entrada y pasillo en isométrico. Medidas en unidades de 10 cm: 4,4 m x 3,8 m, pared de 2,7 m.
// Pared derecha = plano y=0: estante de zapatos, zapatero con bolso y llaves, farol, puerta principal con timbre, paragüero y espejo.
// Pared izquierda = plano x=0: perchero, ganchos con abrigo y mochila, escalera con baranda.
// Suelo: felpudo, umbral, zapatillas, bolsas de compras, caja y paquete.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.entrance = function (I) {
  var W = 44, D = 38, H = 27;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, cylY = I.cylY, cylX = I.cylX, flat = I.flat, sphere = I.sphere, sh = I.shade, ext = I.ext;
  var CH = '#c3ccd3', PAINT = '#e3d2c1', WOOD = '#c58f5c', DARKW = '#8a5a3a', BRASS = '#d6a84a', FXW = I.FX * 1.14;

  I.defs.push(
    '<linearGradient id="mir3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9f5fa"/><stop offset=".5" stop-color="#bcd8e4"/><stop offset="1" stop-color="#d9ecf3"/></linearGradient>',
    '<linearGradient id="pane" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe8f5"/><stop offset="1" stop-color="#7fb0cf"/></linearGradient>',
    '<radialGradient id="halo6"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>'
  );
  function shadow(x0, y0, x1, y1) { sc.add(null, -50, flat([[x0, y0, .02], [x1, y0, .02], [x1, y1, .02], [x0, y1, .02]], 'rgba(60,40,20,.16)')); }
  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function rect2(x0, y0, x1, y1, z) { return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; }
  function disc(cx, cy, r, z, fill) { return flat(I.ellPoly(cx, cy, r, r, 18).map(function (p) { return [p[0], p[1], z]; }), fill); }
  function halo(x, y, z, r) { var q = I.P(x, y, z); return '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + r + '" fill="url(#halo6)"/>'; }

  // ---------- Suelo de piedra y paredes ----------
  var s = box(0, 0, -2, W, D, 0, '#8d8579'), i, j;
  for (i = 0; i < 11; i++) for (j = 0; j < 10; j++) s += flat([[i * W / 11, j * D / 10, 0], [(i + 1) * W / 11, j * D / 10, 0], [(i + 1) * W / 11, (j + 1) * D / 10, 0], [i * W / 11, (j + 1) * D / 10, 0]], (i + j) % 2 ? '#cfc6b8' : '#c3b9aa', 'stroke="#a79d8e" stroke-width=".4"');
  sc.add('地板', -100, s, { a: [40, 34, 0] });
  sc.add('墙', -90, box(-1.6, -1.6, 0, W, 0, H, PAINT), { a: [4, 0, 23] });
  sc.add('墙', -90, box(-1.6, 0, 0, 0, D, H, PAINT, { k: 1.14 }), { a: [0, 4, 23] });
  sc.add('天花板', -86, box(0, 0, H - 1.7, W, 1.3, H, '#fffaf0') + box(0, 1.3, H - 1.7, 1.3, D, H, '#fffaf0'), { a: [40, 0, H - .8], small: true, dot: [40, .6, H - .8] });

  // ---------- Puerta principal, umbral, felpudo, timbre ----------
  tick('门框', -40, box(25.6, 0, 0, 26.3, 1.3, 22.4, '#fffaf0') + box(35.1, 0, 0, 35.8, 1.3, 22.4, '#fffaf0') + box(25.6, 0, 21.7, 35.8, 1.3, 22.4, '#fffaf0'), [26, 1.3, 22.4], true);
  tick('大门', -39, box(26.3, 0, 0, 35.1, 1.1, 21.7, '#3f6f5a') + flat(I.planeY(1.15, [[27.2, 11.6], [34.2, 11.6], [34.2, 20.6], [27.2, 20.6]]), sh('#32594a', I.FY)) + flat(I.planeY(1.15, [[27.2, 1.4], [34.2, 1.4], [34.2, 10.2], [27.2, 10.2]]), sh('#32594a', I.FY)) +
    flat(I.planeY(1.17, [[28.6, 14.2], [32.8, 14.2], [32.8, 19.6], [28.6, 19.6]]), 'url(#pane)') + box(28.4, 1.1, 14, 33, 1.3, 14.3, '#e8dcc2') + box(28.4, 1.1, 19.6, 33, 1.3, 19.9, '#e8dcc2') + box(28.4, 1.1, 14, 28.7, 1.3, 19.9, '#e8dcc2') + box(32.7, 1.1, 14, 33, 1.3, 19.9, '#e8dcc2') + box(29.4, 1.12, 9.2, 32.2, 1.35, 9.8, BRASS), [30.7, 1.1, 8]);
  tick('门把手', -38, cylY(27.7, 10.6, 1.1, 2, .6, BRASS) + sphere(27.7, 2.5, 10.6, .8, '#e8c36a') + box(27.4, 1.1, 12.6, 28, 1.4, 13.4, '#c0a050'), [27.7, 2.5, 10.6], true);
  tick('门槛', -44, box(25.6, 0, 0, 35.8, 1.8, .7, '#b3a998') + box(25.6, 1.8, 0, 35.8, 2, .5, '#8c8478'), [30.7, 2, .7], true);
  var mat = box(26.2, 2.4, 0, 35.2, 5.6, .35, '#6b4a2f'), mg = [], m;
  for (m = 27; m < 35; m += .9) mg.push([[m, 2.6, .37], [m, 5.4, .37]]);
  tick('门垫', -43, mat + I.path(mg, 'rgba(230,200,150,.55)', .8) + flat(rect2(26.8, 3, 34.6, 5, .38), 'none', 'stroke="#e8c36a" stroke-width=".8"'), [34.6, 5.5, .4], true);
  tick('门铃', -41, cylY(36.8, 11.6, 0, .4, 1, '#f1efe8') + cylY(36.8, 11.6, .4, .8, .45, '#e4572e') + box(36, 0, 9.6, 37.6, .4, 10.1, '#f1efe8'), [36.8, .8, 12.4], true);

  // ---------- Estante de zapatos con zapatos y zapatillas ----------
  shadow(0, 0, 12.8, 4.6);
  var rack = box(.6, .2, 0, 12, .6, 9, '#d9ad7c') + box(.6, .2, 0, 1.2, 3.6, 9, '#d9ad7c') + box(11.4, .2, 0, 12, 3.6, 9, '#d9ad7c');
  [[0, .5], [3, 3.5], [6, 6.5], [8.5, 9]].forEach(function (b) { rack += box(.6, .2, b[0], 12, 3.6, b[1], '#d9ad7c'); });
  tick('鞋架', 9.9, rack, [12, 3.6, 9], true);
  function shoe(x, y, z, col) { return box(x, y, z, x + 2.4, y + 1, z + .35, '#2b2118') + box(x, y, z + .35, x + 1.4, y + 1, z + 1.2, col) + box(x + 1.4, y, z + .35, x + 2.2, y + 1, z + .8, col) + box(x + .9, y + .1, z + 1.2, x + 1.4, y + .9, z + 1.35, '#fffaf0'); }
  tick('鞋子', 10, shoe(1.6, 1.4, .5, '#e4572e') + shoe(1.7, 2.5, .5, '#e4572e') + shoe(5, 1.4, .5, '#2c6fbb') + shoe(5, 2.5, .5, '#2c6fbb') + shoe(8.2, 1.4, .5, '#2b2b33') + shoe(8.3, 2.5, .5, '#2b2b33') +
    shoe(2, 1.4, 3.5, '#f6d86b') + shoe(2.1, 2.5, 3.5, '#f6d86b') + shoe(6.4, 1.6, 3.5, '#8e6bbf') + shoe(6.5, 2.7, 3.5, '#8e6bbf') + shoe(3.4, 1.5, 6.5, '#3fa7a3') + shoe(3.5, 2.6, 6.5, '#3fa7a3'), [6, 1.8, 7.2], true);
  tick('拖鞋', 10.1, box(8, 4.4, .05, 10.4, 6.2, .5, '#f4a6b8') + box(8, 4.4, .5, 9.4, 6.2, .9, '#f8c8d0') + box(10.8, 4.8, .05, 13.2, 6.6, .5, '#f4a6b8') + box(10.8, 4.8, .5, 12.2, 6.6, .9, '#f8c8d0'), [10.8, 5.6, 1.2], true);

  // ---------- Zapatero con bolso y bandeja de llaves; ganchos de llaves; farol ----------
  shadow(13, 0, 25, 4.8);
  var cab = box(13.4, .2, 0, 24.4, 3.8, 10.4, '#e6dcc4') + box(13.2, 0, 10.4, 24.6, 4.1, 10.9, '#d7b58a');
  [[13.9, 18.7], [19.1, 23.9]].forEach(function (d) { cab += flat(I.planeY(3.83, [[d[0], .8], [d[1], .8], [d[1], 9.8], [d[0], 9.8]]), sh('#9cc9b0', I.FY), 'stroke="rgba(40,90,70,.55)" stroke-width=".5"') + box((d[0] + d[1]) / 2 - .15, 3.83, 7.2, (d[0] + d[1]) / 2 + .15, 4.25, 8.6, BRASS); });
  tick('鞋柜', 20.8, cab + box(13.4, 3.7, 0, 24.4, 4.1, .8, '#4b4036'), [24.4, 4.1, 10.9]);
  tick('包', 21, box(14.4, 1.2, 10.9, 18.4, 3.4, 14.2, '#c0504a') + box(14.4, 3.4, 10.9, 18.4, 3.6, 14.2, '#a8403a') + box(14.8, 1.4, 14.2, 15.1, 3.2, 15.4, '#a8403a') + box(17.7, 1.4, 14.2, 18, 3.2, 15.4, '#a8403a') + box(14.8, 1.4, 15.1, 18, 3.2, 15.5, '#a8403a') + box(15.8, 3.62, 12.6, 17, 3.9, 13.2, BRASS), [16.4, 3.4, 15.8], true);
  tick('钥匙', 21.1, cylZ(21.8, 2.4, 10.9, 11.1, 1.3, '#8ec5d6') + box(21.2, 2, 11.1, 22.8, 2.3, 11.25, BRASS) + box(22.4, 2.8, 11.1, 23.6, 3.1, 11.25, BRASS) + disc(21, 2.7, .3, 11.28, BRASS), [21.8, 2.4, 11.5], true);
  tick('钥匙挂钩', -35, box(16, 0, 13.2, 21.4, .7, 15.4, '#8a5a3a') + [16.9, 18.7, 20.5].reduce(function (a, x, n) { return a + sphere(x, .9, 14.3, .28, BRASS) + cylZ(x, 1.1, 12.4, 14, .09, CH) + disc(x, 1.1, .45, 12.4, ['#e4572e', '#3fa7a3', '#f6d86b'][n]); }, ''), [18.7, .9, 15.6], true);
  tick('走廊灯', -34, halo(25.2, 1.2, 16.6, 20) + box(24.7, 0, 15, 25.7, .6, 18.4, '#8a5a3a') + cylZ(25.2, 1.6, 15.2, 18.2, .8, '#fff3c4') + cylZ(25.2, 1.6, 18.2, 18.6, .95, '#8a5a3a') + cylZ(25.2, 1.6, 14.8, 15.2, .95, '#8a5a3a'), [25.2, 1.6, 19], true);

  // ---------- Paragüero y espejo de cuerpo entero ----------
  shadow(36.4, .2, 38.8, 3.6);
  tick('伞架', 40, cylZ(37.6, 2.2, 0, 5.6, 1.15, '#8c969d') + cylZ(37.6, 2.2, 5.4, 5.8, 1.25, '#6b747a'), [37.6, 2.2, 5.8], true);
  tick('雨伞', 40.1, cylZ(37.2, 2, 5.6, 11.6, .14, '#2c6fbb') + cylZ(37.2, 2, 11.6, 12.4, .3, '#2c6fbb') + cylZ(38.1, 2.5, 5.6, 10.8, .14, '#e4572e') + box(37.9, 2.3, 10.2, 38.3, 2.7, 10.8, '#e4572e') + cylZ(37.5, 1.5, 5.6, 9.6, .14, '#3a3f45') + sphere(37.5, 1.5, 9.8, .24, '#3a3f45'), [37.6, 2, 12.6], true);
  tick('穿衣镜', 41.5, box(39.8, .3, .4, 43.6, 1.2, 18.4, '#8a5a3a') + flat(I.planeY(1.22, [[40.3, 1], [43.1, 1], [43.1, 17.9], [40.3, 17.9]]), 'url(#mir3)') + flat(I.planeY(1.23, [[40.7, 2], [41.5, 2], [42.7, 16.6], [41.9, 16.6]]), 'rgba(255,255,255,.4)') + box(39.8, .3, 0, 43.6, 1.2, .4, '#6b4423'), [41.7, 1.2, 18.8], true);

  // ---------- Pared izquierda: percheros, ganchos, abrigo y mochila ----------
  shadow(.6, 4, 5, 8);
  tick('衣帽架', 7.8, cylZ(2.4, 5.8, 0, .4, 1.3, '#3a3f45') + cylZ(2.4, 5.8, .4, 17.4, .22, '#3a3f45') + box(1.2, 5.6, 16.4, 3.6, 6, 16.9, '#3a3f45') + box(2.2, 4.6, 16.4, 2.6, 7, 16.9, '#3a3f45') + sphere(1.2, 5.8, 17.1, .3, BRASS) + sphere(3.6, 5.8, 17.1, .3, BRASS) + sphere(2.4, 4.6, 17.1, .3, BRASS) + sphere(2.4, 7, 17.1, .3, BRASS) +
    cylZ(2.4, 5.8, 17.4, 17.7, .9, '#8a5a3a') + sphere(2.4, 5.8, 17.7, .9, '#c0504a') + cylZ(2.4, 5.8, 17.4, 17.7, 1.2, '#7a3a34'), [2.4, 5.8, 18.6], true);
  tick('挂钩', -36, box(0, 8.4, 15.2, .8, 18.6, 15.8, '#8a5a3a') + [9.4, 11.6, 13.8, 16, 17.8].reduce(function (a, y) { return a + box(.8, y - .15, 15.2, 1.7, y + .15, 15.6, BRASS) + sphere(1.7, y, 15.4, .26, '#e8c36a'); }, ''), [.8, 13.8, 16.2], true);
  function coat(y0, col) { return flat(I.planeX(1.8, [[y0, 14.8], [y0 + 1.6, 14.8], [y0 + 2.8, 13.6], [y0 + 3.4, 9], [y0 + 2.6, 8.2], [y0 + 2.4, 3.8], [y0 + .4, 3.8], [y0 + .4, 8.2], [y0 - .8, 9], [y0 - .2, 13.6]]), sh(col, FXW), 'stroke="rgba(0,0,0,.25)" stroke-width=".4"') + box(1.8, y0 + 1.1, 9.4, 2, y0 + 1.5, 14.6, '#2b2118'); }
  tick('外套', 18, coat(10, '#4a6fa5'), [1.8, 11.2, 14], true);
  tick('背包', 18.1, box(1.2, 15.2, 6.6, 3, 17.8, 12.6, '#e8806b') + box(1.2, 15.4, 8.4, 3, 17.6, 10, '#d9654f') + box(1.3, 15.7, 11, 2.5, 17.3, 11.6, '#f6d86b') + box(.9, 15.5, 12.6, 1.3, 17.5, 13, '#8a5a3a') + box(1.6, 16.9, 7.2, 2.6, 17.9, 8.2, '#c9523f'), [2, 16.6, 13.2], true);
  tick('购物袋', 18.5, box(1.6, 19, 0, 4.4, 21.6, 4.8, '#f2b366') + box(1.8, 19.4, 4.8, 2, 19.8, 6.6, '#f2b366') + box(4, 19.4, 4.8, 4.2, 19.8, 6.6, '#f2b366') + box(2.4, 21.6, 1, 3.6, 21.8, 3.4, '#fffaf0') + box(5.2, 17, 0, 7.4, 19, 3.8, '#3fa7a3') + cylZ(6, 17.8, 3.8, 6.4, .35, '#7bbf6a') + box(5.6, 17.2, 3.8, 6.8, 18.4, 5, '#f6d86b'), [3, 20.2, 6.8], true);

  // ---------- Escalera con baranda ----------
  shadow(.2, 19, 8, 37.6);
  var st = '';
  for (i = 5; i >= 0; i--) st += box(.2, 36.4 - 2.8 * (i + 1), 0, 6.2, 36.4 - 2.8 * i, 2 * (i + 1), i % 2 ? '#d7b58a' : '#e0c298') + box(5.9, 36.4 - 2.8 * (i + 1), 2 * (i + 1) - .35, 6.3, 36.4 - 2.8 * i, 2 * (i + 1), '#a8714a');
  tick('台阶', 31, box(6.4, 36, 0, 8.6, 38, .8, '#d9d1c4'), [7.8, 37.4, .9], true);
  tick('楼梯', 31.1, st, [3.4, 24, 12.4]);
  var rl = '';
  for (i = 0; i < 6; i++) rl += box(5.9, 36 - 2.8 * i - .6, 2 * (i + 1), 6.3, 36 - 2.8 * i - .2, 2 * (i + 1) + 7.2, '#3a3f45');
  rl += ext('x', [[36.2, 9.6], [36.2, 10.4], [19.6, 20.2], [19.6, 19.4]], 5.8, 6.4, '#5a3a22');
  tick('楼梯扶手', 31.2, rl, [6, 28, 17], true);

  // ---------- Paquetes, caja de cartón ----------
  shadow(21, 5, 33, 11);
  tick('纸箱', 36, box(22, 5.4, 0, 26.6, 9.4, 4.4, '#c9a06a') + box(22, 5.4, 4.4, 26.6, 9.4, 4.7, '#b88b52') + box(23.8, 5.4, 4.4, 24.8, 9.4, 4.72, '#e8d2b0') + flat(I.planeY(9.41, [[22.6, .6], [24.8, .6], [24.8, 1.8], [22.6, 1.8]]), sh('#fffaf0', I.FY)) + box(22.8, 9.41, 1.4, 24.4, 9.5, 1.5, '#8a6a4a'), [24.4, 9.4, 4.9], true);
  tick('快递包裹', 37.5, box(28.2, 7, 0, 31.8, 9.6, 2.8, '#d9b383') + box(29.5, 7, 2.8, 30.4, 9.6, 2.84, '#e8d2b0') + box(28.2, 8.2, 0, 31.8, 8.5, 2.84, '#e8d2b0') + flat(I.planeY(9.61, [[28.6, .5], [30.8, .5], [30.8, 2.2], [28.6, 2.2]]), sh('#fffaf0', I.FY)) + flat(I.planeY(9.62, [[28.9, 1.4], [30.4, 1.4], [30.4, 1.6], [28.9, 1.6]]), '#2b2118') + flat(I.planeY(9.62, [[28.9, 1], [29.9, 1], [29.9, 1.2], [28.9, 1.2]]), '#2b2118'), [30, 9.6, 3.2], true);
  return sc;
};
