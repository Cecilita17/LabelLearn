// Estructura de la casa: una "anatomía" de los elementos que forman una vivienda. Medidas en unidades de 10 cm: 4,8 m x 4,0 m.
// Pared derecha = plano y=0: puerta con cerradura y llave, interruptor, dos ventanas (cortina y persiana), grieta, zona de azulejos, enchufe con cable.
// Pared izquierda = plano x=0: escalera con baranda y balcón; el borde cortado de los muros muestra sus capas.
// Centro: mesa con maquetas de una casa (con tejado), un departamento y una habitación.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.structure = function (I) {
  var W = 48, D = 40, H = 27;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, cylY = I.cylY, cylX = I.cylX, flat = I.flat, sphere = I.sphere, sh = I.shade, ext = I.ext;
  var CH = '#c3ccd3', PAINT = '#e7dccb', BRICK = '#b5654a', WOOD = '#c58f5c', BRASS = '#d6a84a', FXW = I.FX * 1.14;

  I.defs.push(
    '<linearGradient id="sky10" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#e6f6fc"/></linearGradient>',
    '<radialGradient id="halo7"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>'
  );
  function shadow(x0, y0, x1, y1) { sc.add(null, -50, flat([[x0, y0, .02], [x1, y0, .02], [x1, y1, .02], [x0, y1, .02]], 'rgba(60,40,20,.16)')); }
  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function rect2(x0, y0, x1, y1, z) { return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; }
  function halo(x, y, z, r) { var q = I.P(x, y, z); return '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + r + '" fill="url(#halo7)"/>'; }

  // ---------- Suelo: madera con una zona de baldosas ----------
  var s = box(0, 0, -2, W, D, 0, '#a07a55'), i, j;
  for (i = 0; i < 16; i++) s += flat([[i * W / 16, 0, 0], [(i + 1) * W / 16, 0, 0], [(i + 1) * W / 16, D, 0], [i * W / 16, D, 0]], i % 2 ? '#d5b186' : '#cba67a', 'stroke="#a07a55" stroke-width=".35"');
  sc.add('地板', -100, s, { a: [30, 36, 0] });
  var ft = '';
  for (i = 0; i < 4; i++) for (j = 0; j < 3; j++) ft += flat(rect2(36 + i * 3, 1 + j * 3, 36 + (i + 1) * 3, 1 + (j + 1) * 3, .04), (i + j) % 2 ? '#e8e2d6' : '#cfe4df', 'stroke="#a9b8b4" stroke-width=".5"');
  tick('瓷砖', -98, ft, [44, 8, .05], true);

  // ---------- Muros con sus capas (borde cortado), cornisa, zócalo, esquina ----------
  sc.add('墙', -90, box(-1.6, -1.6, 0, W, 0, H, PAINT), { a: [20, 0, 15] });
  sc.add('墙', -90, box(-1.6, 0, 0, 0, D, H, PAINT, { k: 1.14 }) +
    flat(I.planeY(D + .02, [[-1.6, 0], [-1.2, 0], [-1.2, H], [-1.6, H]]), sh('#efe3cf', I.FY)) + flat(I.planeY(D + .02, [[-1.2, 0], [-.4, 0], [-.4, H], [-1.2, H]]), sh(BRICK, I.FY)) + flat(I.planeY(D + .02, [[-.4, 0], [0, 0], [0, H], [-.4, H]]), sh('#efe3cf', I.FY)) +
    flat(I.planeY(D + .03, [[-1.2, 0], [-.4, 0], [-.4, H], [-1.2, H]]), 'none', 'stroke="rgba(240,225,205,.6)" stroke-width=".4"'), { a: [0, 39, 22], small: true, dot: [-.8, D + .02, 14] });
  sc.add('天花板', -86, box(0, 0, H - 1.7, W, 1.3, H, '#fffaf0') + box(0, 1.3, H - 1.7, 1.3, D, H, '#fffaf0'), { a: [32, 0, H - .8], small: true, dot: [32, .6, H - .8] });
  sc.add('踢脚线', -85, box(0, 0, 0, W, .5, 1.3, '#fffaf0') + box(0, .5, 0, .5, D, 1.3, '#fffaf0'), { a: [44, .5, .7], small: true, dot: [44, .5, .7] });
  tick('角落', -84, box(0, 0, 0, .55, .55, H, BRASS) + box(.55, 0, 0, 3, .3, .4, BRASS) + box(0, .55, 0, .3, 3, .4, BRASS), [.3, .3, 14], true);
  tick('瓷砖', -88, flat(I.planeY(.04, [[39.4, 0], [W, 0], [W, 12], [39.4, 12]]), sh('#cfe4df', I.FY)) + I.path([[[39.4, .05, 4], [W, .05, 4]], [[39.4, .05, 8], [W, .05, 8]], [[41.6, .05, 0], [41.6, .05, 12]], [[43.8, .05, 0], [43.8, .05, 12]], [[46, .05, 0], [46, .05, 12]]], 'rgba(120,160,155,.5)', .5), [43, .05, 6], true);
  tick('裂缝', -80, I.path([[[24.6, .06, 17.8], [25.4, .06, 16.6]], [[25.4, .06, 16.6], [24.9, .06, 15.2]], [[24.9, .06, 15.2], [25.9, .06, 14]], [[25.9, .06, 14], [25.4, .06, 12.6]], [[25.4, .06, 12.6], [26.2, .06, 11.4]], [[25.4, .06, 12.6], [24.4, .06, 11.8]]], '#3a2e26', 1.1), [25.4, .06, 18.4], true);

  // ---------- Puerta, cerradura, llave, interruptor ----------
  tick('门框', -40, box(3.4, 0, 0, 4, 1.3, 22.4, '#fffaf0') + box(11.6, 0, 0, 12.2, 1.3, 22.4, '#fffaf0') + box(3.4, 0, 21.7, 12.2, 1.3, 22.4, '#fffaf0'), [3.7, 1.3, 22.4], true);
  tick('门', -39, box(4, 0, 0, 11.6, 1.1, 21.7, '#8a5a3a') + flat(I.planeY(1.15, [[4.9, 11.6], [10.7, 11.6], [10.7, 20.6], [4.9, 20.6]]), sh('#744a2e', I.FY)) + flat(I.planeY(1.15, [[4.9, 1.4], [10.7, 1.4], [10.7, 10.2], [4.9, 10.2]]), sh('#744a2e', I.FY)), [7.8, 1.1, 6]);
  tick('门把手', -38, cylY(5.4, 10, 1.1, 2, .55, BRASS) + sphere(5.4, 2.4, 10, .8, '#e8c36a'), [5.4, 2.4, 10], true);
  tick('门锁', -37, box(5, 1.1, 11.6, 6.4, 1.5, 13.4, '#c0a050') + disc(5.7, 12.4, .3, 1.52) + box(5.6, 1.5, 11.9, 5.8, 1.55, 12.3, '#2b2118'), [5.7, 1.55, 13.7], true);
  function disc(cx, cz, r, y) { return flat(I.ellPoly(cx, cz, r, r, 14).map(function (p) { return [p[0], y, p[1]]; }), '#2b2118'); }
  tick('钥匙', -36, box(7.4, 1.1, 14.8, 8.1, 1.5, 15.2, BRASS) + cylY(7.2, 15, 1.1, 1.3, .1, '#8a6a4a') + flat(I.planeY(1.52, I.ellPoly(8.6, 13.4, .5, .5, 10)), '#e8c36a') + box(8.4, 1.4, 11.2, 8.8, 1.6, 13, '#e8c36a') + box(8.8, 1.4, 11.2, 9.5, 1.6, 11.6, '#e8c36a') + box(8.8, 1.4, 11.8, 9.3, 1.6, 12.2, '#e8c36a'), [8.6, 1.6, 15.2], true);
  tick('台阶', 3, box(3.4, 1.3, 0, 12.2, 3.6, 1.2, '#cfc6b8') + box(3.4, 3.6, 0, 12.2, 3.8, 1.2, '#a79d8e'), [11.8, 3.8, 1.3], true);
  tick('电灯开关', -50, box(13.2, 0, 11, 14.3, .35, 12.9, '#f9f8f4') + flat(I.planeY(.37, [[13.5, 11.5], [14, 11.5], [14, 12.3], [13.5, 12.3]]), '#e3e1da'), [13.7, .4, 13], true);

  // ---------- Ventanas: cortina y persiana ----------
  tick('窗户', -62, flat(I.planeY(.5, [[18, 12.4], [26, 12.4], [26, 21], [18, 21]]), 'url(#sky10)') + flat(I.planeY(.55, [[19, 12.8], [20.2, 12.8], [23.2, 20.6], [22, 20.6]]), 'rgba(255,255,255,.32)'), { a: [22, .5, 17] });
  sc.add('窗框', -61, box(17.2, 0, 11.6, 18, 1.2, 21.8, '#fffaf0') + box(26, 0, 11.6, 26.8, 1.2, 21.8, '#fffaf0') + box(18, 0, 11.6, 26, 1.2, 12.4, '#fffaf0') + box(18, 0, 21, 26, 1.2, 21.8, '#fffaf0') + box(21.6, 0, 12.4, 22.4, .9, 21, '#fffaf0'), { a: [26.8, 1.2, 21.8], small: true, dot: [26.8, 1.2, 21.8] });
  sc.add('窗台', -59, box(16.6, 0, 10.8, 27.4, 2.4, 11.6, '#fffaf0'), { a: [27.4, 2.4, 11.2], small: true, dot: [27.4, 2.4, 11.2] });
  tick('窗帘', -60, box(16, 1.5, 22.2, 28.4, 2.1, 22.7, CH) + box(16.3, 1.6, 10.8, 19.3, 2.4, 22.2, '#e8806b') + box(24.8, 1.6, 10.8, 27.8, 2.4, 22.2, '#e8806b') + I.path([[[17.1, 2.45, 11], [17.1, 2.45, 22]], [[18.3, 2.45, 11], [18.3, 2.45, 22]], [[25.6, 2.45, 11], [25.6, 2.45, 22]], [[26.8, 2.45, 11], [26.8, 2.45, 22]]], 'rgba(150,60,45,.4)', .6), [17.6, 2.4, 20]);
  var bl = flat(I.planeY(.5, [[31.4, 12.4], [38.6, 12.4], [38.6, 20.4], [31.4, 20.4]]), 'url(#sky10)'), z;
  for (z = 20.2; z > 15.2; z -= .75) bl += box(31.2, .7, z - .35, 38.8, 1.9, z, '#f1efe6');
  bl += box(31, 0, 20.4, 39, 2, 21.2, '#e0dccf') + box(34.9, .8, 15, 35.1, .9, 20.2, '#8c969d') + box(34.7, .8, 14.6, 35.3, 1.4, 15, '#8c969d');
  tick('百叶窗', -61, bl + box(30.6, 0, 11.6, 31.4, 1.2, 21.2, '#fffaf0') + box(38.6, 0, 11.6, 39.4, 1.2, 21.2, '#fffaf0') + box(31.4, 0, 11.6, 38.6, 1.2, 12.4, '#fffaf0'), [35, 1.2, 21.6], true);
  tick('通风口', -50, box(11.4, 0, 22.6, 15.8, .6, 24.5, '#ecebe6') + I.path([[[11.7, .62, 23.1], [15.5, .62, 23.1]], [[11.7, .62, 23.6], [15.5, .62, 23.6]], [[11.7, .62, 24.1], [15.5, .62, 24.1]]], '#9aa0a4', .6), [13.6, .6, 24.8], true);

  // ---------- Enchufe, clavija, cable y bombilla colgante ----------
  tick('插座', -50, box(40.6, 0, 4, 42.2, .4, 6.6, '#f9f8f4') + flat(I.planeY(.42, [[41, 5.4], [41.4, 5.4], [41.4, 5.8], [41, 5.8]]), '#3a3a3a') + flat(I.planeY(.42, [[41.4, 5.4], [41.8, 5.4], [41.8, 5.8], [41.4, 5.8]]), '#3a3a3a'), [41.4, .4, 6.8], true);
  tick('插头', 6, box(40.8, .4, 4.6, 41.8, 1.8, 6, '#fffaf0') + box(41.1, 1.8, 4.9, 41.5, 2.6, 5.7, '#e8dcc2') + box(41.1, .1, 5.3, 41.2, .5, 5.5, CH) + box(41.4, .1, 5.3, 41.5, .5, 5.5, CH), [41.3, 1.8, 6.2], true);
  var cb = '';
  [[41.3, 2.6, 5.3], [41.2, 3.2, 3.6], [40.6, 4, 1.6], [39.4, 4.4, .4], [37.6, 4.2, .3], [35.6, 4.6, .3], [33.6, 5, .3], [31.6, 4.6, .3], [29.6, 4.2, .3], [27.8, 4.6, .3]].forEach(function (p) { cb += sphere(p[0], p[1], p[2], .22, '#2b2b33'); });
  tick('电线', 6.2, cb + cylZ(11.8, 10.4, 17.6, 23.4, .08, '#2b2b33'), [31.6, 4.6, .8], true);
  tick('灯泡', 100, box(11, 0, 23, 12.6, 12, 24.2, '#7a4b2a') + halo(11.8, 10.4, 17.2, 26) + cylZ(11.8, 10.4, 17.4, 18.2, .5, '#2b2118') + sphere(11.8, 10.4, 16.6, 1.15, '#fff3c4'), [11.8, 10.4, 18.4], true);

  // ---------- Escalera con baranda y balcón ----------
  shadow(.2, 6, 8, 38);
  var st = '';
  for (i = 5; i >= 0; i--) st += box(.2, 36.4 - 2.8 * (i + 1), 0, 6.2, 36.4 - 2.8 * i, 2 * (i + 1), i % 2 ? '#d7b58a' : '#e0c298') + box(5.9, 36.4 - 2.8 * (i + 1), 2 * (i + 1) - .35, 6.3, 36.4 - 2.8 * i, 2 * (i + 1), '#a8714a');
  tick('楼梯', 31.1, st, [3.4, 26, 12.4]);
  var rl = '';
  for (i = 0; i < 6; i++) rl += box(5.9, 36 - 2.8 * i - .6, 2 * (i + 1), 6.3, 36 - 2.8 * i - .2, 2 * (i + 1) + 7.2, '#3a3f45');
  rl += ext('x', [[36.2, 9.6], [36.2, 10.4], [19.6, 20.2], [19.6, 19.4]], 5.8, 6.4, '#5a3a22');
  tick('楼梯', 31.2, rl, [6, 30, 17], true);
  var bal = box(0, 6, 11.4, 6.2, 19.6, 12, '#d9ad7c') + box(5.6, 6.2, 0, 6, 6.6, 11.4, '#c9c2b4') + box(5.6, 18.8, 0, 6, 19.2, 11.4, '#c9c2b4');
  tick('阳台', 21, bal, [6.2, 12.8, 12], true);
  var br = '';
  [[5.6, 6.2], [5.6, 19], [.2, 6.2]].forEach(function (p) { br += box(p[0], p[1], 12, p[0] + .45, p[1] + .45, 17, '#3a3f45'); });
  br += box(5.6, 6.2, 16.6, 6.05, 19.45, 17, '#3a3f45') + box(.2, 6.2, 16.6, 6.05, 6.65, 17, '#3a3f45') + box(5.6, 6.2, 13.6, 6.05, 19.45, 13.9, '#3a3f45');
  for (i = 7; i < 18.8; i += 1.05) br += box(5.7, i, 12, 5.95, i + .25, 16.6, '#3a3f45');
  for (i = 1; i < 5.6; i += 1.05) br += box(i, 6.3, 12, i + .25, 6.55, 16.6, '#3a3f45');
  deco(35, br);

  // ---------- Pasillo: alfombra larga con flechas ----------
  tick('走廊', -45, flat(rect2(13, 6, 46.4, 10.6, .05), '#6f90a6') + flat(rect2(13.6, 6.6, 45.8, 10, .06), '#e8d2b0') + [16, 22, 28, 34, 40].reduce(function (a, x) { return a + flat([[x, 7.2, .07], [x + 3.2, 8.3, .07], [x, 9.4, .07], [x + .8, 8.3, .07]], '#6f90a6'); }, ''), [14.6, 8.3, .1], true);

  // ---------- Mesa con maquetas: casa, departamento y habitación ----------
  shadow(19, 21, 33.2, 31);
  var tb = box(19.6, 22, 0, 20.4, 22.8, 6, WOOD) + box(31.8, 22, 0, 32.6, 22.8, 6, WOOD) + box(19.6, 29.2, 0, 20.4, 30, 6, WOOD) + box(31.8, 29.2, 0, 32.6, 30, 6, WOOD) + box(19.2, 21.6, 6, 33, 30.4, 6.5, '#e6c99b');
  deco(45, tb);
  var zt = 6.5;
  tick('房子', 45.2, box(20.4, 23, zt, 24.4, 26.4, zt + 2.6, '#f1e3c9') + flat(I.planeY(26.41, [[21.4, zt + .3], [22.4, zt + .3], [22.4, zt + 1.7], [21.4, zt + 1.7]]), sh('#8a5a3a', I.FY)) + flat(I.planeY(26.41, [[22.9, zt + 1.2], [23.9, zt + 1.2], [23.9, zt + 2.2], [22.9, zt + 2.2]]), sh('#8ec5d6', I.FY)) + flat(I.planeX(24.41, [[24, zt + 1.1], [25.2, zt + 1.1], [25.2, zt + 2.1], [24, zt + 2.1]]), sh('#8ec5d6', I.FX)), [22.4, 26.4, zt + 2.8], true);
  tick('屋顶', 45.4, ext('x', [[22.6, zt + 2.6], [27.2, zt + 2.6], [24.9, zt + 4.6]], 20.1, 24.7, '#c0504a'), [22.4, 24.9, zt + 4.9], true);
  var ap = box(26, 23.4, zt, 29.2, 26.2, zt + 6.2, '#cbd5e0');
  for (i = 0; i < 4; i++) for (j = 0; j < 2; j++) ap += flat(I.planeY(26.21, [[26.4 + j * 1.5, zt + .5 + i * 1.5], [27.2 + j * 1.5, zt + .5 + i * 1.5], [27.2 + j * 1.5, zt + 1.4 + i * 1.5], [26.4 + j * 1.5, zt + 1.4 + i * 1.5]]), sh(i === 1 && j === 0 ? '#f6d86b' : '#8ec5d6', I.FY)) + flat(I.planeX(29.21, [[23.8 + j * 1.2, zt + .5 + i * 1.5], [24.5 + j * 1.2, zt + .5 + i * 1.5], [24.5 + j * 1.2, zt + 1.4 + i * 1.5], [23.8 + j * 1.2, zt + 1.4 + i * 1.5]]), sh('#8ec5d6', I.FX));
  tick('公寓', 45.6, ap + box(25.8, 23.2, zt + 6.2, 29.4, 26.4, zt + 6.5, '#8c969d'), [27.6, 26.2, zt + 6.9], true);
  var rm = box(30, 23, zt, 32.4, 26.6, zt + .2, '#d5b186') + box(30, 23, zt + .2, 32.4, 23.2, zt + 2.6, '#d9d3f2') + box(30, 23, zt + .2, 30.2, 26.6, zt + 2.6, '#c9c3e0') + box(31.4, 25.2, zt + .2, 32.2, 26.4, zt + .9, '#e8806b') + box(30.4, 23.4, zt + .2, 31.2, 24.4, zt + 1.2, '#4aa3a6') + flat(I.planeY(23.21, [[31, zt + 1.1], [31.9, zt + 1.1], [31.9, zt + 2], [31, zt + 2]]), sh('#8ec5d6', I.FY));
  tick('房间', 45.7, rm, [31.2, 26.6, zt + 2.9], true);
  return sc;
};
