// Objetos pequeños que aparecen por toda la casa: un rincón de trastos. Medidas en unidades de 10 cm: 4,2 m x 3,6 m.
// Pared derecha = plano y=0: estantería con cajas, cestas, botellas y rollos; banco con objetos personales; mancha de agua.
// Pared izquierda = plano x=0: tablero con ganchos y bolsa de plástico; telaraña en la esquina del techo.
// Suelo: baúl, tacho desbordado, polvo, mugre, papeles rotos y fragmentos.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.misc = function (I) {
  var W = 42, D = 36, H = 27;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, cylY = I.cylY, cylX = I.cylX, flat = I.flat, sphere = I.sphere, sh = I.shade;
  var CH = '#c3ccd3', PAINT = '#d8dde0', WOOD = '#c58f5c', BRASS = '#d6a84a', FXW = I.FX * 1.14;

  function shadow(x0, y0, x1, y1) { sc.add(null, -50, flat([[x0, y0, .02], [x1, y0, .02], [x1, y1, .02], [x0, y1, .02]], 'rgba(60,40,20,.18)')); }
  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function rect2(x0, y0, x1, y1, z) { return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; }
  function disc(cx, cy, r, z, fill) { return flat(I.ellPoly(cx, cy, r, r, 14).map(function (p) { return [p[0], p[1], z]; }), fill); }
  function blob(cx, cy, rx, ry, z, fill) { return flat(I.ellPoly(cx, cy, rx, ry, 11).map(function (p, n) { return [p[0] + (n % 3 - 1) * .12, p[1] + (n % 2 ? .1 : -.1), z]; }), fill); }

  // ---------- Suelo de hormigón y paredes ----------
  var s = box(0, 0, -2, W, D, 0, '#8d9296'), i, j;
  for (i = 0; i < 7; i++) for (j = 0; j < 6; j++) s += flat([[i * 6, j * 6, 0], [(i + 1) * 6, j * 6, 0], [(i + 1) * 6, (j + 1) * 6, 0], [i * 6, (j + 1) * 6, 0]], (i + j) % 2 ? '#b8bcbf' : '#c3c7ca', 'stroke="#9a9fa3" stroke-width=".4"');
  sc.add('地板', -100, s, { a: [36, 32, 0] });
  sc.add('墙', -90, box(-1.6, -1.6, 0, W, 0, H, PAINT), { a: [4, 0, 22] });
  sc.add('墙', -90, box(-1.6, 0, 0, 0, D, H, PAINT, { k: 1.14 }), { a: [0, 30, 22] });
  sc.add('天花板', -86, box(0, 0, H - 1.7, W, 1.3, H, '#f1f1ee') + box(0, 1.3, H - 1.7, 1.3, D, H, '#f1f1ee'), { a: [38, 0, H - .8], small: true, dot: [38, .6, H - .8] });

  // ---------- Mugre, mancha de agua, telaraña, polvo ----------
  tick('污垢', -80, flat(I.planeY(.05, [[0, 0], [14, 0], [13.2, 2.6], [10, 3.4], [6, 2.2], [2.6, 3.6], [0, 2.4]]), 'rgba(60,45,30,.4)') + flat(I.planeX(.05, [[22, 0], [31, 0], [30, 2.8], [26, 3.4], [23, 2]]), 'rgba(60,45,30,.4)') + blob(33, 26, 3.2, 2.2, .06, 'rgba(50,40,30,.5)') + blob(12, 28, 2.4, 1.6, .06, 'rgba(50,40,30,.4)'), [33, 26, .1], true);
  tick('水渍', -79, flat(I.planeY(.06, I.ellPoly(32, 20.6, 3, 2.6, 18)), 'rgba(170,135,70,.28)') + flat(I.planeY(.07, I.ellPoly(32, 20.4, 2.2, 1.9, 18)), 'rgba(150,110,50,.3)') + flat(I.planeY(.08, [[31.6, 18.4], [32.2, 18.4], [32.1, 7], [31.7, 7]]), 'rgba(150,110,50,.22)') + flat(I.planeY(.09, I.ellPoly(32, 20.4, 1.3, 1.1, 14)), 'rgba(120,80,30,.3)'), [32, .08, 23], true);
  var web = I.path([[[0, .1, 26.8], [0, 9, 26.8]], [[0, .1, 26.8], [0, 7.4, 21.4]], [[0, .1, 26.8], [0, 4.2, 18.2]], [[0, .1, 26.8], [0, .1, 17.6]], [[0, .1, 26.8], [8, 0, 26.8]], [[0, .1, 26.8], [6.2, 0, 21.6]], [[0, .1, 26.8], [3.4, 0, 18.4]],
    [[0, 3, 26.8], [0, 2.4, 24.4]], [[0, 3, 24.4], [0, 5.6, 22.4]], [[0, 5.2, 22.4], [0, 4.2, 21]], [[3, 0, 26.8], [2.4, 0, 24.4]], [[3, 0, 24.4], [5.2, 0, 22.6]], [[0, .1, 22.2], [0, 3, 22]], [[2.4, 0, 21.4], [4.6, 0, 21.6]]], 'rgba(255,255,255,.85)', .7);
  tick('蜘蛛网', -70, web + sphere(0, 2.6, 22.6, .32, '#2b2b33') + I.path([[[0, 2.6, 22.6], [0, 1.6, 22.2]], [[0, 2.6, 22.6], [0, 3.6, 22.2]], [[0, 2.6, 22.6], [0, 1.8, 23.2]], [[0, 2.6, 22.6], [0, 3.4, 23.2]]], '#2b2b33', .5), [0, 3.4, 24], true);
  var dust = '';
  [[22.5, 1.6, 1.1], [24.6, 2.4, .8], [20.4, 2.2, .7], [1.4, 11.4, 1.2], [1.8, 13.4, .8], [0.9, 8.4, .7], [14.8, 26.4, .9]].forEach(function (d) { dust += sphere(d[0], d[1], d[2] * .55, d[2], '#b3b3ac') + sphere(d[0] + d[2] * .6, d[1] + d[2] * .4, d[2] * .4, d[2] * .6, '#c2c2bb'); });
  tick('灰尘', 20, dust, [22.5, 1.6, 2], true);

  // ---------- Estantería abierta ----------
  shadow(0, 0, 16, 5);
  var sh1 = box(1, .2, 0, 15, .6, 20, '#8c969d') + box(1, .2, 0, 1.6, 4, 20, '#8c969d') + box(14.4, .2, 0, 15, 4, 20, '#8c969d');
  [.4, 6.4, 12.4, 18.4].forEach(function (z) { sh1 += box(1, .2, z, 15, 4, z + .6, '#b3b9bd'); });
  deco(8.5, sh1);
  tick('篮子', 8.6, cylZ(4, 2.2, 1, 5, 1.7, '#c9a06a') + cylZ(4, 2.2, 2.2, 2.6, 1.74, '#a98450') + cylZ(4, 2.2, 4.4, 4.8, 1.74, '#a98450') + sphere(3.4, 2, 5.4, .7, '#f4a6b8') + sphere(4.6, 2.4, 5.2, .6, '#8ec5d6'), [4, 2.2, 6.4], true);
  tick('盒子', 8.7, box(7.4, 1, 1, 10.6, 3.4, 3, '#c9a06a') + box(7.4, 1, 3, 10.6, 3.4, 3.3, '#b88b52') + box(8.2, 1.4, 3.3, 11.6, 3.4, 5.2, '#8ec5d6') + box(8.2, 1.4, 5.2, 11.6, 3.4, 5.5, '#5fa8c8') + box(11.2, 1.2, 1, 13.8, 3.4, 4, '#e8806b') + box(11.2, 1.2, 4, 13.8, 3.4, 4.3, '#cf6b57'), [10.8, 3.4, 5.8], true);
  var bt = '';
  [[2.2, '#3fa7a3'], [3.6, '#e4572e'], [5, '#f6d86b'], [6.4, '#4a90d9']].forEach(function (b, n) { bt += cylZ(b[0], 1.8, 7, 7 + 3.8 + (n % 2) * .8, .6, b[1]) + cylZ(b[0], 1.8, 7 + 3.8 + (n % 2) * .8, 7 + 4.6 + (n % 2) * .8, .3, '#fffaf0'); });
  tick('瓶子', 8.6, bt, [4.2, 1.8, 12.4], true);
  tick('盖子', 8.7, cylZ(7.6, 2.8, 7, 7.3, .5, '#e4572e') + cylZ(8.4, 1.6, 7, 7.3, .45, '#3fa7a3') + cylZ(8.9, 3.2, 7, 7.3, .5, '#f6d86b') + cylZ(9.6, 1.9, 7, 7.3, .4, '#fffaf0'), [8.8, 2.6, 7.6], true);
  tick('胶带', 8.8, cylY(11.6, 8, 1, 2.4, 1.1, '#e8c36a') + cylY(11.6, 8, .9, 1, 1.15, '#c0a050') + cylY(13.4, 7.7, 1.6, 3, .9, '#4a90d9') + box(12.2, 1.6, 7, 12.6, 2.8, 7.2, '#e8c36a'), [12.4, 2.4, 9.2], true);
  tick('电池', 8.6, box(2, 1.2, 12.4, 5.4, 3.2, 14, '#2b2b33') + box(2, 1.2, 14, 5.4, 3.2, 14.2, '#f2a31b') + cylY(2.8, 14.6, 1.2, 2.6, .35, '#3fa7a3') + cylY(3.6, 14.6, 1.2, 2.6, .35, '#3fa7a3') + cylY(4.4, 14.6, 1.2, 2.6, .35, '#e4572e'), [3.6, 2.2, 15.2], true);
  var rope = '';
  for (i = 0; i < 12; i++) { var an = i / 12 * Math.PI * 2; rope += sphere(10.2 + 1.5 * Math.cos(an), 2.2 + 1.2 * Math.sin(an), 12.9, .38, '#c9a06a') + sphere(10.2 + 1.3 * Math.cos(an + .3), 2.2 + 1.05 * Math.sin(an + .3), 13.6, .36, '#b88b52'); }
  tick('绳子', 8.7, rope, [10.2, 2.2, 14.4], true);
  tick('塑料袋', 8.8, sphere(4.2, 2, 19.9, 1.3, '#f1f1ee') + sphere(5.2, 2.4, 20.3, 1.1, '#e8eef2') + sphere(3.4, 2.4, 20.2, .9, '#f6f6f3') + sphere(8.4, 2, 20, 1, '#f3d36b') + sphere(9.2, 2.3, 20.3, .8, '#f6e08a'), [6.6, 2.2, 21.4], true);

  // ---------- Tablero con ganchos (pared izquierda) ----------
  tick('塑料袋', 22, box(0, 12, 12, .5, 22, 21, '#8a6a4a') + [13, 15.2, 17.4, 19.6].reduce(function (a, y) { return a + box(.5, y - .12, 18.6, 1.3, y + .12, 19, BRASS); }, '') + sphere(1.4, 15.2, 16.6, 1.2, '#f1f1ee') + sphere(1.5, 16, 15.4, 1, '#e8eef2') + sphere(1.4, 14.4, 15.8, .9, '#f6f6f3'), [1.4, 15.2, 18.6], true);

  // ---------- Banco con objetos personales ----------
  shadow(17.4, 0, 37, 6);
  var bc = box(18, .4, 0, 18.7, 1.1, 7.2, WOOD) + box(35.3, .4, 0, 36, 1.1, 7.2, WOOD) + box(18, 4.4, 0, 18.7, 5.1, 7.2, WOOD) + box(35.3, 4.4, 0, 36, 5.1, 7.2, WOOD) + box(18.7, .4, 3.2, 35.3, .8, 4, '#a8714a') + box(17.8, .2, 7.2, 36.2, 5.4, 7.8, '#e6c99b');
  deco(22.4, bc);
  var zb = 7.8;
  tick('手机', 22.6, box(19.2, 1.4, zb, 20.1, 3.2, zb + .15, '#2b2b33') + flat(rect2(19.3, 1.5, 20, 3.1, zb + .17), '#4a90d9') + sphere(19.7, 1.75, zb + .2, .1, '#2b2b33'), [19.7, 2.4, zb + .5], true);
  tick('手机壳', 22.7, box(20.6, 1.3, zb, 21.7, 3.3, zb + .12, '#f4a6b8') + box(20.6, 1.3, zb + .12, 21.7, 1.5, zb + .3, '#f4a6b8') + box(20.6, 3.1, zb + .12, 21.7, 3.3, zb + .3, '#f4a6b8') + box(20.6, 1.5, zb + .12, 20.8, 3.1, zb + .3, '#f4a6b8') + box(21.5, 1.5, zb + .12, 21.7, 3.1, zb + .3, '#f4a6b8') + sphere(21.2, 1.9, zb + .3, .2, '#2b2b33'), [21.1, 2.4, zb + .6], true);
  tick('充电宝', 22.8, box(22.4, 1.2, zb, 25, 2.6, zb + .7, '#e8ecef') + box(22.4, 1.2, zb + .7, 25, 2.6, zb + .8, '#4a90d9') + sphere(22.7, 2.6, zb + .4, .12, '#3ddc84') + sphere(23.1, 2.6, zb + .4, .12, '#3ddc84') + sphere(23.5, 2.6, zb + .4, .12, '#dfe5e9'), [23.7, 2, zb + 1.2], true);
  tick('眼镜', 22.9, flat(I.ellPoly(26.5, 2.4, .85, .85, 14).map(function (p) { return [p[0], p[1], zb + .05]; }), 'rgba(190,225,240,.5)', 'stroke="#2b2118" stroke-width="1.2"') + flat(I.ellPoly(28.4, 2.4, .85, .85, 14).map(function (p) { return [p[0], p[1], zb + .05]; }), 'rgba(190,225,240,.5)', 'stroke="#2b2118" stroke-width="1.2"') + box(27.2, 2.3, zb, 27.7, 2.5, zb + .12, '#2b2118') + box(25.6, 2.3, zb, 26, 4.2, zb + .12, '#2b2118') + box(28.9, 2.3, zb, 29.3, 4.2, zb + .12, '#2b2118'), [27.4, 2.4, zb + .6], true);
  tick('纸巾盒', 23, box(30, 1, zb, 33, 3, zb + 2, '#8ec5d6') + flat(I.planeY(3.01, [[30.5, zb + .6], [32.5, zb + .6], [32.5, zb + 1.6], [30.5, zb + 1.6]]), sh('#5fa8c8', I.FY)) + flat(rect2(31, 1.6, 32.2, 2.4, zb + 2.02), '#2b3a4a'), [31.5, 2, zb + 2.4], true);
  tick('纸巾', 23.1, flat([[31, 1.7, zb + 2], [31.4, 1.5, zb + 3.8], [31.9, 1.8, zb + 3.2], [32.2, 1.5, zb + 3.9], [32.4, 2.3, zb + 2]], '#ffffff', 'stroke="#dfe5e9" stroke-width=".4"') + box(33.4, 2.2, zb, 34.8, 4, zb + .5, '#fffaf0') + box(33.5, 2.3, zb + .5, 34.7, 3.9, zb + .6, '#e8806b') + sphere(30.6, 4.2, zb + .45, .5, '#ffffff') + sphere(31.4, 4.5, zb + .35, .4, '#f4f1e8'), [34, 3, zb + .9], true);
  tick('钱包', 23.2, box(19.2, 3.8, zb, 21.8, 5.2, zb + .6, '#7a4b2a') + box(19.3, 3.9, zb + .6, 21.7, 5.1, zb + .72, '#8f5c3a') + box(20.2, 3.7, zb + .2, 20.8, 3.8, zb + .5, BRASS) + box(20.2, 3.8, zb + .3, 21.6, 5.1, zb + .35, '#e8dcc2'), [20.5, 4.5, zb + 1], true);
  var cn = '';
  [[22.6, 3.9, '#e8c36a'], [23.5, 4.5, '#cfd6dc'], [24.4, 3.8, '#e8c36a'], [25.1, 4.6, '#cfd6dc'], [23.9, 4.9, '#e8c36a']].forEach(function (c) { cn += cylZ(c[0], c[1], zb, zb + .12, .38, c[2]); });
  tick('硬币', 23.3, cn, [24, 4.3, zb + .3], true);
  tick('钥匙串', 23.4, flat(I.ellPoly(27.6, 4.6, .6, .6, 12).map(function (p) { return [p[0], p[1], zb + .06]; }), 'none', 'stroke="#c3ccd3" stroke-width="1.1"') + box(28, 4.4, zb, 29.8, 4.8, zb + .1, BRASS) + box(28, 4.9, zb, 29.4, 5.2, zb + .1, '#cfd6dc') + box(27, 3.9, zb, 27.6, 4.4, zb + .12, '#e4572e') + box(29.5, 4.4, zb, 29.8, 4.8, zb + .3, BRASS), [28.2, 4.7, zb + .6], true);
  tick('遥控器', 23.5, box(34.4, 3.4, zb, 35.6, 5, zb + .3, '#2b2b33') + box(34.6, 3.6, zb + .3, 35.4, 3.8, zb + .36, '#e4572e') + box(34.6, 3.95, zb + .3, 35.4, 4.15, zb + .36, '#8c969d') + box(34.6, 4.3, zb + .3, 35.4, 4.5, zb + .36, '#8c969d'), [35, 4.2, zb + .6], true);
  tick('碎片', 23.6, ext2([[29.6, 3.2], [30.9, 3.6], [30.2, 4.6]], zb, zb + .3, '#fffaf0') + ext2([[31.4, 3.8], [32.3, 3.4], [32.6, 4.6], [31.8, 4.9]], zb, zb + .26, '#f1efe8') + ext2([[29.8, 4.7], [30.6, 5.1], [30, 5.3]], zb, zb + .22, '#e8806b') + ext2([[32.7, 2.9], [33.2, 3.3], [32.8, 3.6]], zb, zb + .2, '#4a90d9'), [31, 4, zb + .6], true);
  function ext2(poly, z0, z1, col) { return I.ext('z', poly, z0, z1, col); }
  var ps = '';
  [[18.4, 4.4], [34.6, 1.6], [26.2, 5], [19.2, .6]].forEach(function (p, n) { ps += flat([[p[0], p[1], zb + .02], [p[0] + .9, p[1] + .2, zb + .02], [p[0] + .7, p[1] + .9, zb + .02], [p[0] - .1, p[1] + .6, zb + .02]], n % 2 ? '#fffaf0' : '#f4f1e8', 'stroke="rgba(0,0,0,.2)" stroke-width=".3"'); });
  [[12.4, 14.4], [13.6, 16.2], [14.2, 13.2], [28, 17], [26.4, 19.2]].forEach(function (p, n) { ps += flat([[p[0], p[1], .05], [p[0] + .9, p[1] + .2, .05], [p[0] + .7, p[1] + .9, .05], [p[0] - .1, p[1] + .6, .05]], '#f4f1e8', 'stroke="rgba(0,0,0,.25)" stroke-width=".3"'); });
  tick('纸屑', 23.7, ps, [26.2, 5.2, zb + .3], true);

  // ---------- Baúl y tacho desbordado ----------
  shadow(5.4, 11, 15.4, 20);
  tick('箱子', 25, box(6, 12, 0, 14.4, 18.4, 5.2, '#8a5a3a') + box(5.8, 11.8, 5.2, 14.6, 18.6, 6.2, '#a8714a') + box(5.8, 11.8, 5.2, 6.2, 18.6, 6.2, '#6b747a') + box(14.2, 11.8, 5.2, 14.6, 18.6, 6.2, '#6b747a') + box(9.6, 18.4, 3, 11, 18.7, 6.4, BRASS) + flat(I.planeY(18.41, [[6.8, 1], [13.6, 1], [13.6, 4.4], [6.8, 4.4]]), sh('#6f4426', I.FY)) + box(6.2, 11.8, 0, 7, 12.6, 5.2, '#6b747a') + box(13.6, 11.8, 0, 14.4, 12.6, 5.2, '#6b747a'), [10.2, 18.6, 6.4], true);
  shadow(26.2, 10.6, 33, 18);
  var tr = cylZ(29.4, 14.4, 0, 5.6, 1.8, '#4a8f5a') + cylZ(29.4, 14.4, 5.4, 5.8, 1.95, '#3a7a49') + sphere(28.4, 14, 6.6, 1.3, '#3a3f45') + sphere(30.6, 14.8, 6.8, 1.2, '#2b2b33') + sphere(29.6, 13.6, 7.6, 1, '#4a4a52') + box(28.6, 15.4, 5.8, 30, 16.4, 7.4, '#f1f1ee') + sphere(31.4, 14, 6, .6, '#e8806b');
  tr += box(26.4, 16.6, 0, 28.2, 18.2, 1.6, '#f1f1ee') + sphere(27.2, 17.4, 2.2, 1, '#e9e9e5') + cylZ(31.4, 17.6, 0, .9, .45, '#c3ccd3') + box(32.8, 16.6, 0, 34.2, 18, 1.1, '#f3d36b') + sphere(25.6, 15.2, .5, .5, '#8a7a6a') + cylY(31.5, .4, 18.4, 19.8, .4, '#c3ccd3');
  tick('垃圾', 30, tr, [29.4, 14.4, 8.6], true);
  return sc;
};
