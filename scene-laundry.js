// Lavadero en isométrico. Medidas en unidades de 10 cm: 4,4 m x 3,8 m, pared de 2,7 m.
// Pared derecha = plano y=0: lavarropas y secarropas con estante de detergentes, mesada de planchado bajo la ventana, puerta.
// Pared izquierda = plano x=0: escoba y pala colgadas, balde con trapeador, aspiradora y tacho.
// Centro: canasto de ropa sucia, tabla de planchar con plancha, tender plegable y una cuerda de ropa mojada que cruza la esquina.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.laundry = function (I) {
  var W = 44, D = 38, H = 27;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, cylY = I.cylY, cylX = I.cylX, flat = I.flat, sphere = I.sphere, sh = I.shade, ext = I.ext;
  var CH = '#c3ccd3', PAINT = '#d3ead8', WHITE = '#f6f5f1', BRASS = '#d6a84a';
  var FXW = I.FX * 1.14;

  I.defs.push(
    '<linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#e6f6fc"/></linearGradient>',
    '<linearGradient id="porth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9d9ee"/><stop offset="1" stop-color="#5f8fb0"/></linearGradient>'
  );
  function shadow(x0, y0, x1, y1) { sc.add(null, -50, flat([[x0, y0, .02], [x1, y0, .02], [x1, y1, .02], [x0, y1, .02]], 'rgba(60,40,20,.16)')); }
  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function disc(cx, cy, r, z, fill) { return flat(I.ellPoly(cx, cy, r, r, 18).map(function (p) { return [p[0], p[1], z]; }), fill); }
  function ringY(cx, cz, r, y, stroke, w) { return flat(I.ellPoly(cx, cz, r, r, 24).map(function (p) { return [p[0], y, p[1]]; }), 'none', 'stroke="' + stroke + '" stroke-width="' + (w || .7) + '"'); }

  // ---------- Suelo, paredes ----------
  var s = box(0, 0, -2, W, D, 0, '#98a6b0'), i, j;
  for (i = 0; i < 10; i++) for (j = 0; j < 9; j++)
    s += flat([[i * W / 10, j * D / 9, 0], [(i + 1) * W / 10, j * D / 9, 0], [(i + 1) * W / 10, (j + 1) * D / 9, 0], [i * W / 10, (j + 1) * D / 9, 0]], (i + j) % 2 ? '#c4ced6' : '#d4dce2', 'stroke="#a9b6bf" stroke-width=".35"');
  sc.add('地板', -100, s, { a: [36, 32, 0] });
  sc.add('墙', -90, box(-1.6, -1.6, 0, W, 0, H, PAINT), { a: [4, 0, 22] });
  sc.add('墙', -90, box(-1.6, 0, 0, 0, D, H, PAINT, { k: 1.14 }), { a: [0, 34, 22] });
  function tiles(plane, len, fx) {
    var pl = plane === 'y' ? I.planeY : I.planeX, g = [], v, u, row = 0;
    for (v = 1.5; v < 10; v += 1.5) g.push([pl(.04, [[0, v]])[0], pl(.04, [[len, v]])[0]]);
    for (v = 0; v < 9.9; v += 1.5, row++) for (u = (row % 2 ? 1.5 : 0) + 3; u < len; u += 3) g.push([pl(.04, [[u, v]])[0], pl(.04, [[u, v + 1.5]])[0]]);
    return flat(pl(.04, [[0, 0], [len, 0], [len, 10], [0, 10]]), sh('#fbfaf6', fx)) + I.path(g, 'rgba(120,150,150,.4)', .45) + flat(pl(.04, [[0, 10], [len, 10], [len, 10.8], [0, 10.8]]), sh('#9cc9b0', fx));
  }
  sc.add('瓷砖', -88, tiles('y', W, I.FY), { a: [38, 0, 5] });
  sc.add('瓷砖', -88, tiles('x', D, FXW), { a: [0, 30, 5] });
  sc.add('天花板', -86, box(0, 0, H - 1.7, W, 1.3, H, '#fffaf0') + box(0, 1.3, H - 1.7, 1.3, D, H, '#fffaf0'), { a: [24, 0, H - .8], small: true, dot: [24, .6, H - .8] });
  sc.add('踢脚线', -85, box(0, 0, 0, W, .5, 1.3, '#fffaf0') + box(0, .5, 0, .5, D, 1.3, '#fffaf0'), { a: [43, .5, .7], small: true, dot: [43, .5, .7] });

  // ---------- Ventana y puerta (pared derecha) ----------
  sc.add('窗户', -62, flat(I.planeY(.5, [[21.4, 13.4], [29.1, 13.4], [29.1, 21.8], [21.4, 21.8]]), 'url(#sky5)') + flat(I.planeY(.55, [[22.4, 13.8], [23.2, 13.8], [25.6, 21.4], [24.8, 21.4]]), 'rgba(255,255,255,.35)'), { a: [25, .5, 18] });
  sc.add('窗框', -61, box(20.6, 0, 12.6, 21.4, 1.2, 22.6, '#fffaf0') + box(29.1, 0, 12.6, 29.9, 1.2, 22.6, '#fffaf0') + box(21.4, 0, 12.6, 29.1, 1.2, 13.4, '#fffaf0') + box(21.4, 0, 21.8, 29.1, 1.2, 22.6, '#fffaf0') + box(24.8, 0, 13.4, 25.7, .9, 21.8, '#fffaf0'), { a: [29.5, 1.2, 22.6], small: true, dot: [29.5, 1.2, 22.6] });
  sc.add('窗台', -59, box(20, 0, 11.9, 30.6, 2.4, 12.6, '#fffaf0'), { a: [30.2, 2.4, 12.2], small: true, dot: [30.2, 2.4, 12.2] });
  tick('门框', 40, box(34, 0, 0, 34.6, 1.1, 22, '#fffaf0') + box(41.8, 0, 0, 42.4, 1.1, 22, '#fffaf0') + box(34, 0, 21.4, 42.4, 1.1, 22, '#fffaf0'), [34.3, 1.1, 22], true);
  tick('门', 40.1, box(34.6, 0, 0, 41.8, .9, 21.4, '#9cc9b0') + flat(I.planeY(.95, [[35.6, 11], [40.8, 11], [40.8, 20.2], [35.6, 20.2]]), sh('#86b79b', I.FY)) + flat(I.planeY(.95, [[35.6, 1.2], [40.8, 1.2], [40.8, 9.8], [35.6, 9.8]]), sh('#86b79b', I.FY)), [38.2, .9, 6]);
  tick('门把手', 40.3, cylY(35.5, 10.5, .9, 1.7, .55, BRASS) + sphere(35.5, 2.2, 10.5, .75, '#e8c36a'), [35.5, 2.2, 10.5], true);
  tick('插座', -50, box(17, 0, 10, 18.2, .4, 11.8, '#f9f8f4') + flat(I.planeY(.42, [[17.3, 10.7], [17.6, 10.7], [17.6, 11.1], [17.3, 11.1]]), '#3a3a3a') + flat(I.planeY(.42, [[17.6, 10.7], [17.9, 10.7], [17.9, 11.1], [17.6, 11.1]]), '#3a3a3a'), [17.6, .4, 11.8], true);

  // ---------- Lavarropas y secarropas ----------
  shadow(0, 0, 15.4, 7.2);
  function machine(x0, name, k, tint) {
    var cx = x0 + 3.4, o = box(x0, .2, 0, x0 + 6.8, 6.4, 8.6, tint) + box(x0, 4.6, 8.6, x0 + 6.8, 6.4, 9.2, '#e7eaee') +
      flat(I.planeY(6.43, I.ellPoly(cx, 4.2, 2.7, 2.7, 26).map(function (p) { return [p[0], p[1]]; })), '#d7dde2') +
      flat(I.planeY(6.45, I.ellPoly(cx, 4.2, 2.2, 2.2, 26)), 'url(#porth)') + ringY(cx, 4.2, 2.35, 6.46, '#8c969d', 1) +
      flat(I.planeY(6.47, I.ellPoly(cx - .6, 4.8, .8, .5, 10)), 'rgba(255,255,255,.55)') +
      flat(I.planeY(6.43, [[x0 + .6, 7.3], [x0 + 3, 7.3], [x0 + 3, 8.3], [x0 + .6, 8.3]]), '#cfd6dc') + sphere(x0 + 4.4, 6.6, 7.8, .45, '#8c969d') + sphere(x0 + 5.6, 6.6, 7.8, .45, '#e4572e') + box(x0 + 3.5, 6.43, 7.4, x0 + 4, 6.6, 8.2, '#2b2b33');
    return o;
  }
  tick('洗衣机', 7.1, machine(.4, 'w', 7.1, WHITE), [3.8, 6.4, 5]);
  tick('烘干机', 14.5, machine(7.8, 'd', 14.5, '#eef0f2') + flat(I.planeY(6.44, [[8.6, 1], [13.2, 1], [13.2, 1.8], [8.6, 1.8]]), '#c7ced4'), [11.2, 6.4, 5]);
  // estante de detergentes
  tick('架子', 9, box(.5, 0, 14.6, 14.6, 2.8, 15.2, '#d9ad7c') + box(.9, 0, 13.4, 1.5, .6, 14.6, '#b98b5e') + box(13.6, 0, 13.4, 14.2, .6, 14.6, '#b98b5e'), [14.6, 2.8, 15.2], true);
  tick('洗衣液', 9.1, cylZ(2.5, 1.5, 15.2, 19.4, 1.05, '#4a90d9') + cylZ(2.5, 1.5, 19.4, 20, .5, '#fffaf0') + box(3.4, 1.2, 17, 4, 1.8, 19.2, '#3a76b5') + flat(I.planeY(2.57, [[1.6, 16], [3.4, 16], [3.4, 18.4], [1.6, 18.4]]), 'rgba(255,255,255,.75)'), [2.5, 1.5, 20.4], true);
  tick('洗衣粉', 9.1, box(5, .6, 15.2, 7.8, 2.2, 18.8, '#f2a31b') + flat(I.planeY(2.22, [[5.3, 15.8], [7.5, 15.8], [7.5, 18.4], [5.3, 18.4]]), sh('#fffaf0', I.FY)) + flat(I.planeY(2.24, I.ellPoly(6.4, 17.1, .8, .8, 12)), '#f2a31b'), [6.4, 1.4, 18.9], true);
  tick('柔顺剂', 9.1, cylZ(9.2, 1.5, 15.2, 18.8, .95, '#c39bd3') + cylZ(9.2, 1.5, 18.8, 19.7, .5, '#8e6bbf') + flat(I.planeY(1.78, [[8.4, 15.8], [10, 15.8], [10, 17.8], [8.4, 17.8]]), 'rgba(255,255,255,.7)'), [9.2, 1.5, 19.9], true);
  tick('漂白剂', 9.1, cylZ(12, 1.5, 15.2, 18.4, .9, '#f4f4f0') + cylZ(12, 1.5, 18.4, 19.2, .55, '#e4572e') + flat(I.planeY(1.76, [[11.3, 15.8], [12.7, 15.8], [12.7, 17.6], [11.3, 17.6]]), 'rgba(80,150,200,.7)'), [12, 1.5, 19.4], true);
  // sobre el lavarropas
  tick('清洁剂', 7.6, cylZ(1.7, 2.6, 9.2, 12.2, .65, '#4fc08d') + cylZ(1.7, 2.6, 12.2, 12.8, .3, '#2a7a56') + box(1.5, 2.4, 12.4, 3, 2.9, 13, '#2a7a56') + box(2.7, 2.5, 12.6, 3.2, 2.8, 13.4, '#2a7a56'), [1.7, 2.6, 13.4], true);
  var br = box(3.6, 1.4, 9.2, 5.2, 4.8, 9.9, '#c58f5c');
  for (j = 0; j < 4; j++) br += box(3.7 + j * .4, 1.5, 9.9, 3.9 + j * .4, 4.7, 10.5, '#e9d39a');
  tick('刷子', 7.7, br, [4.4, 3, 10.6], true);
  tick('手套', 7.8, box(5.6, 2, 9.2, 6.8, 4.6, 9.8, '#f6d86b') + box(5.6, 4.6, 9.2, 5.9, 5.4, 9.7, '#f6d86b') + box(6, 4.6, 9.2, 6.3, 5.5, 9.7, '#f6d86b') + box(6.4, 4.6, 9.2, 6.7, 5.4, 9.7, '#f6d86b') + box(5.7, 1.5, 9.3, 6.9, 2, 10.2, '#e8c23a'), [6.2, 3.4, 10], true);
  // ropa limpia doblada sobre el secarropas y la mesada
  function stackAt(x, y, z0, cols) { var o = '', z = z0; cols.forEach(function (c) { o += box(x, y, z, x + 3.2, y + 2.6, z + .6, c); z += .6; }); return o; }
  tick('干净衣服', 14.6, stackAt(8.9, 1.5, 9.2, ['#f4a6b8', '#fffaf0', '#8ec5d6', '#f6d86b']), [10.5, 2.8, 12], true);
  tick('干净衣服', 26.9, stackAt(17.2, 1.4, 9.2, ['#e8806b', '#fffaf0', '#4aa3a6']) + stackAt(21.2, 1.8, 9.2, ['#fffaf0', '#9cc9b0', '#f4a6b8', '#fffaf0', '#8ec5d6']), [18.8, 2.7, 11], true);

  // ---------- Mesada bajo la ventana ----------
  shadow(16, 0, 32, 7);
  var cab = box(16.2, .2, 0, 31, 6.2, 8.6, '#e6eef2');
  [16.8, 21.7, 26.4].forEach(function (x0) { cab += flat(I.planeY(6.23, [[x0, 1.2], [x0 + 4.2, 1.2], [x0 + 4.2, 8], [x0, 8]]), sh('#8ec5d6', I.FY), 'stroke="rgba(40,90,110,.55)" stroke-width=".5"') + box(x0 + 1.9, 6.23, 5.4, x0 + 2.3, 6.65, 6.8, BRASS); });
  deco(26.8, cab + box(16, 0, 8.6, 31.3, 6.4, 9.2, '#e8d2b0'));
  tick('抹布', 26.95, box(26.4, 2.6, 9.2, 29, 4.6, 9.4, '#e4572e') + I.path([[[27.2, 2.6, 9.42], [27.2, 4.6, 9.42]], [[28, 2.6, 9.42], [28, 4.6, 9.42]]], 'rgba(255,255,255,.65)', .8) + box(26.4, 4.6, 8.9, 29, 4.8, 9.4, '#d9452b'), [27.7, 3.6, 9.5], true);

  // ---------- Pared izquierda: escoba, pala, balde con trapeador, aspiradora, tacho ----------
  shadow(0, 7.5, 7, 37);
  tick('架子', -55, box(0, 7.8, 21, .8, 14.4, 21.6, '#d9ad7c') + sphere(.9, 9.2, 21.6, .35, BRASS) + sphere(.9, 12.6, 21.6, .35, BRASS), [.8, 14.4, 21.6], true);
  tick('扫帚', 10, cylZ(1, 9.2, 5.6, 21.4, .26, '#c58f5c') + box(.35, 8.2, 3.8, 1.65, 10.2, 6, '#d9a02b') + box(.4, 8.3, 5.6, 1.6, 10.1, 6.6, '#7a4b2a'), [1, 9.2, 21.8], true);
  tick('簸箕', 10.1, box(.4, 10.8, 5, 1.2, 14.2, 5.4, '#4a90d9') + box(.4, 10.8, 5.4, 1.2, 11.2, 7.4, '#4a90d9') + box(.4, 13.8, 5.4, 1.2, 14.2, 7.4, '#4a90d9') + box(.4, 11.6, 5.4, 1.2, 13.4, 5.8, '#3a76b5') + box(.4, 12.2, 7.4, 1, 12.8, 11.6, '#4a90d9') + box(0, 12.1, 11.2, .9, 12.9, 11.9, BRASS), [.8, 12.5, 12], true);
  shadow(0.6, 14.4, 4.9, 18.6);
  tick('水桶', 19, cylZ(2.6, 16.4, 0, 4.6, 1.9, '#4a90d9') + disc(2.6, 16.4, 1.55, 4.62, '#2b4a78') + box(.8, 16.2, 4.6, 1, 16.6, 6.4, '#8c969d') + box(4.2, 16.2, 4.6, 4.4, 16.6, 6.4, '#8c969d') + box(.8, 16.2, 6.2, 4.4, 16.6, 6.5, '#8c969d'), [2.6, 16.4, 6.5], true);
  var mop = '';
  for (j = 0; j < 8; j++) mop += cylZ(2.6 + 1.05 * Math.cos(j * Math.PI / 4), 16.4 + 1.05 * Math.sin(j * Math.PI / 4), 4.6, 6.2, .32, j % 2 ? '#f3f3f0' : '#e5e5e1');
  tick('拖把', 19.2, cylZ(2.6, 16.4, 4.6, 6.2, .9, '#f3f3f0') + mop + cylZ(2.6, 16.4, 6.2, 19.8, .26, '#c58f5c') + sphere(2.6, 16.4, 20, .5, '#d9a02b'), [2.6, 16.4, 20.4], true);
  tick('抹布', 19.3, box(4.1, 15.5, 3.2, 4.5, 17.3, 5.6, '#4aa3a6') + box(3.7, 15.5, 5.3, 4.5, 17.3, 5.7, '#4aa3a6'), [4.4, 16.4, 5.8], true);
  shadow(.8, 19, 6.4, 24.4);
  tick('吸尘器', 24.8, ellZ(3.2, 21.6, 2.3, 2.6, .9, 4.4, '#d62828') + ellZ(3.2, 21.6, 1.6, 1.9, 4.4, 4.9, '#b01e1e') + cylX(19.8, 1, 4.8, 5.5, 1, '#2b2b33') + cylX(23.4, 1, 4.8, 5.5, 1, '#2b2b33') + sphere(3.2, 21.6, 5.1, .5, '#2b2b33') +
    [[3.2, 23.8, 3.4], [2.7, 25, 5.6], [2, 26, 8], [1.3, 26.6, 10.2]].reduce(function (a, p) { return a + sphere(p[0], p[1], p[2], .42, '#6b747a'); }, '') +
    cylZ(1.1, 26.9, .8, 11, .28, CH) + box(.5, 26, 0, 2.9, 27.8, .8, '#2b2b33') + box(.6, 26.4, 10.4, 1.8, 27.4, 11.2, '#d62828'), [3.2, 21.6, 5.2]);
  shadow(.6, 29.4, 5, 34);
  tick('垃圾桶', 35.6, cylZ(2.6, 31.8, 0, 6.4, 1.75, '#8c969d') + ellZ(2.6, 31.8, 1.9, 1.9, 6.4, 6.9, '#6b747a') + box(4.3, 31.5, .4, 5.1, 32.1, 1.2, '#2b2b33') + box(.5, 31.1, 6.9, 1.3, 32.5, 7.4, '#6b747a'), [2.6, 31.8, 7.2], true);

  // ---------- Canasto con ropa sucia ----------
  shadow(7.4, 9.8, 13.2, 15.4);
  tick('洗衣篮', 22.4, cylZ(10.2, 12.6, 0, 5.2, 2.3, '#c9a06a') + cylZ(10.2, 12.6, 1.4, 1.8, 2.34, '#a98450') + cylZ(10.2, 12.6, 3.2, 3.6, 2.34, '#a98450') + cylZ(10.2, 12.6, 5.2, 5.6, 2.45, '#a98450') + box(7.7, 12.3, 3.4, 8, 12.9, 4.4, '#a98450') + box(12.4, 12.3, 3.4, 12.7, 12.9, 4.4, '#a98450'), [12.4, 12.6, 4.8], true);
  tick('脏衣服', 22.6, sphere(9.2, 12, 6.2, 1.4, '#8a7a6a') + sphere(10.8, 13, 6.4, 1.5, '#6b7f9a') + sphere(10, 11.8, 7.4, 1.3, '#a0725a') + sphere(11.4, 12, 6.6, 1.1, '#7a8a6a') + sphere(9.6, 13.6, 6.1, 1.1, '#b07a8a') + box(11.6, 14, 3.8, 12, 14.4, 6.2, '#8a7a6a') + box(11.2, 14, 3.6, 12.4, 14.4, 4.4, '#8a7a6a'), [10.2, 12.4, 8.6], true);

  // ---------- Tabla de planchar con plancha ----------
  shadow(14, 14, 29, 20);
  var bd = [[15, 15.1], [24.6, 15.1], [27.6, 16.5], [27.6, 17.5], [24.6, 18.9], [15, 18.9]], legs = '';
  [[17, 15.4], [24, 15.4], [17, 18.3], [24, 18.3]].forEach(function (p) { legs += box(p[0], p[1], 0, p[0] + .35, p[1] + .35, 8.1, '#8c969d'); });
  legs += box(17, 15.4, 3, 24.35, 15.75, 3.3, '#8c969d') + box(17, 18.3, 3, 24.35, 18.65, 3.3, '#8c969d');
  tick('熨衣板', 38.2, legs + ext('z', bd, 8.1, 8.7, '#8ec5d6') + flat([[16, 16.2, 8.72], [18, 16.2, 8.72], [18, 17.8, 8.72], [16, 17.8, 8.72]], 'rgba(255,255,255,.35)') + flat([[20, 15.6, 8.72], [21, 15.6, 8.72], [21, 18.4, 8.72], [20, 18.4, 8.72]], 'rgba(255,255,255,.25)'), [26.8, 17, 8.8]);
  tick('熨斗', 38.5, ext('z', [[18.6, 16.3], [21.4, 16.3], [22.6, 17], [21.4, 17.7], [18.6, 17.7]], 8.72, 9.4, '#e9eef1') + box(19.1, 16.55, 9.4, 20.8, 17.45, 10.1, '#2a9d8f') + box(19.4, 16.7, 10.1, 19.8, 17.3, 11.1, '#2a9d8f') + box(19.4, 16.7, 11, 20.8, 17.3, 11.4, '#2a9d8f') + cylZ(18.2, 17, 8.72, 8.76, .4, '#2b2b33'), [20.4, 17, 11.5], true);

  // ---------- Tender plegable con toallas ----------
  shadow(14.4, 21.6, 25.6, 28);
  var rack = '', rods = [22.8, 24, 25.2, 26.4];
  [[15.4, 22.4], [15.4, 26.6], [24, 22.4], [24, 26.6]].forEach(function (p) { rack += box(p[0], p[1], 0, p[0] + .4, p[1] + .4, 7.8, '#e8ecef'); });
  rack += box(15.4, 22.4, 7.4, 15.8, 27, 7.8, '#e8ecef') + box(24, 22.4, 7.4, 24.4, 27, 7.8, '#e8ecef') + box(15.4, 22.4, 3.2, 15.8, 27, 3.5, '#e8ecef') + box(24, 22.4, 3.2, 24.4, 27, 3.5, '#e8ecef');
  rods.forEach(function (y) { rack += box(15.4, y, 7.4, 24.4, y + .3, 7.7, '#e8ecef'); });
  rack += box(15.4, 23.4, 3.2, 24.4, 23.7, 3.5, '#e8ecef') + box(15.4, 25.8, 3.2, 24.4, 26.1, 3.5, '#e8ecef');
  tick('晾衣架', 44.2, rack, [24.2, 26.8, 7.8], true);
  tick('湿衣服', 44.4, box(16.4, 23.7, 4.4, 20.8, 24.3, 7.8, '#4aa3a6') + box(16.4, 23.7, 4.4, 20.8, 24.3, 4.9, '#9fd3d4') + box(21.4, 25.5, 4.8, 23.8, 26, 7.8, '#e8806b') + box(21.4, 25.5, 4.8, 23.8, 26, 5.2, '#f6cdbf') + box(21.9, 22.7, 6.6, 22.5, 23.2, 7.8, '#f6d86b') + box(22.7, 22.7, 6.6, 23.3, 23.2, 7.8, '#f6d86b') +
    sphere(17.4, 24, 4.2, .28, '#7ec8f0') + sphere(19.6, 24, 4.1, .28, '#7ec8f0') + sphere(22.6, 25.8, 4.6, .26, '#7ec8f0') + sphere(18.5, 24.1, 3.4, .22, '#7ec8f0'), [17.6, 24, 8.1], true);

  // ---------- Cuerda de tender diagonal con ropa mojada ----------
  var P0 = [0, 15, 22.5], Pe = [17.5, 0, 22.5], len = Math.hypot(Pe[0] - P0[0], Pe[1] - P0[1]), dx = (Pe[0] - P0[0]) / len, dy = (Pe[1] - P0[1]) / len;
  function at(t, v) { return [P0[0] + t * dx, P0[1] + t * dy, P0[2] - v]; }
  function garment(t0, shape, col) { return flat(shape.map(function (p) { return at(t0 + p[0], p[1]); }), sh(col, .79), 'stroke="' + sh(col, .6) + '" stroke-width=".4"'); }
  var tshirt = [[0, 0], [1.1, 0], [1.6, .6], [2.8, .6], [3.3, 0], [4.4, 0], [5.4, 1.9], [4, 2.7], [4, 6.6], [.4, 6.6], [.4, 2.7], [-1, 1.9]];
  var towel = [[0, 0], [4, 0], [4, 7.4], [0, 7.4]];
  var pants = [[0, 0], [4.2, 0], [4.2, 3], [4.6, 8.4], [2.6, 8.4], [2.1, 3.6], [1.6, 8.4], [-.4, 8.4], [0, 3]];
  var sock = [[0, 0], [1.2, 0], [1.2, 2.4], [2, 3.2], [.6, 3.8], [0, 3]];
  tick('晾衣绳', 16.9, I.path([[P0, Pe]], '#5a5f66', 1.3) + sphere(0.3, 15, 22.5, .3, BRASS) + sphere(17.3, 0.2, 22.5, .3, BRASS), [8, 7.5, 22.8], true);
  tick('湿衣服', 17, garment(3.4, tshirt, '#e4572e') + garment(9.6, towel, '#4aa3a6') + garment(15.2, pants, '#4a90d9') + garment(20.4, sock, '#f6d86b') + garment(21.9, sock, '#f4a6b8') +
    [[at(5.2, 6.8), '#7ec8f0'], [at(6.8, 6.9), '#7ec8f0'], [at(11.5, 7.6), '#7ec8f0'], [at(17.2, 8.7), '#7ec8f0'], [at(15.6, 8.6), '#7ec8f0']].reduce(function (a, p) { return a + sphere(p[0][0], p[0][1], p[0][2], .26, p[1]); }, ''), at(6, 3.4), true);
  var pins = '';
  [[3.4, '#e4572e'], [7.8, '#f6d86b'], [9.6, '#3fa7a3'], [13.6, '#e4572e'], [15.2, '#4a90d9'], [19.4, '#f6d86b']].forEach(function (p) { var q = at(p[0], -.1); pins += box(q[0] - .2, q[1] - .2, q[2] - .5, q[0] + .2, q[1] + .2, q[2] + .5, p[1]); });
  tick('衣夹', 17.1, pins, [at(9.6, -.6)[0], at(9.6, -.6)[1], at(9.6, -.6)[2]], true);
  return sc;
};
