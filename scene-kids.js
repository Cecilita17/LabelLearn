// Habitación infantil en isométrico. Medidas en unidades de 10 cm: 4,8 m x 4,4 m, pared de 2,7 m.
// Pared derecha = plano y=0 (x de 0 a W). Pared izquierda = plano x=0 (y de 0 a D).
// Distribución: ropero en la esquina, cuna y cama pequeña contra la pared izquierda, ventana con cofre de juguetes,
// estantería de cubos y cambiador contra la pared derecha, alfombras de juego al centro y rincón de lectura.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.kids = function (I) {
  var W = 48, D = 44, H = 27;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, cylY = I.cylY, cylX = I.cylX, flat = I.flat, sphere = I.sphere, sh = I.shade;
  var CH = '#c3ccd3', CREAM = '#f5ecd9', PAINT = '#cfe3f3', WOODL = '#e9c999', MINT = '#8fc6a8', SUN = '#f6d86b', CORAL = '#e8806b';

  I.defs.push(
    '<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#e6f6fc"/></linearGradient>',
    '<radialGradient id="halo"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>'
  );
  function shadow(x0, y0, x1, y1) { sc.add(null, -50, flat([[x0, y0, .02], [x1, y0, .02], [x1, y1, .02], [x0, y1, .02]], 'rgba(60,40,20,.16)')); }
  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function star(cu, cv, R, r) { var a = [], i, t; for (i = 0; i < 10; i++) { t = -Math.PI / 2 + i * Math.PI / 5; a.push([cu + (i % 2 ? r : R) * Math.cos(t), cv + (i % 2 ? r : R) * Math.sin(t)]); } return a; }
  function cloud(plane, o, cu, cv, s, col) {
    var out = '';
    [[0, 0, 3.4, 1.7], [-2.6, -.4, 2.3, 1.4], [2.7, -.3, 2.5, 1.5], [.4, .9, 2.8, 1.2]].forEach(function (c) {
      var pts = I.ellPoly(cu + c[0] * s, cv + c[1] * s, c[2] * s, c[3] * s, 14);
      out += flat(plane === 'y' ? I.planeY(o, pts) : I.planeX(o, pts), col);
    });
    return out;
  }

  // ---------- Suelo de madera ----------
  var s = box(0, 0, -2, W, D, 0, '#bf9a6e'), i;
  for (i = 0; i < 16; i++)
    s += flat([[i * 3, 0, 0], [i * 3 + 3, 0, 0], [i * 3 + 3, D, 0], [i * 3, D, 0]], i % 2 ? '#dcbc90' : '#d4b184', 'stroke="#bf9a6e" stroke-width=".35"');
  sc.add('地板', -100, s, { a: [38, 36, 0] });

  // ---------- Paredes con friso blanco y adornos ----------
  sc.add('墙', -90, box(-1.6, -1.6, 0, W, 0, H, PAINT), { a: [4, 0, 22] });
  sc.add('墙', -90, box(-1.6, 0, 0, 0, D, H, PAINT, { k: 1.14 }), { a: [0, 38, 22] });
  var FXW = I.FX * 1.14;   // las pinturas de la pared izquierda se aclaran igual que su caja
  function wain(plane, len, fx) {
    var pl = plane === 'y' ? I.planeY : I.planeX, g = [], m;
    for (m = 3; m < len; m += 3) g.push([pl(.04, [[m, 0]])[0], pl(.04, [[m, 8]])[0]]);
    return flat(pl(.04, [[0, 0], [len, 0], [len, 8], [0, 8]]), sh('#f7f2e8', fx)) + I.path(g, 'rgba(150,130,100,.3)', .5) +
      flat(pl(.04, [[0, 8], [len, 8], [len, 8.9], [0, 8.9]]), sh('#fffaf0', fx));
  }
  sc.add('墙', -88, wain('y', W, I.FY), { a: [30, 0, 4] });
  sc.add('墙', -88, wain('x', D, FXW), { a: [0, 10, 4] });
  deco(-87, cloud('x', .05, 26, 19, .9, sh('#ffffff', FXW)) + cloud('y', .05, 33, 22, .8, sh('#ffffff', I.FY)) +
    flat(I.planeX(.05, star(10, 21, 1.5, .65)), sh('#ffd24d', FXW)) + flat(I.planeX(.05, star(33, 22, 1.1, .5)), sh('#ffd24d', FXW)) +
    flat(I.planeY(.05, star(6, 21, 1.4, .6)), sh('#ffd24d', I.FY)) + flat(I.planeY(.05, star(40, 19, 1.6, .7)), sh('#ffd24d', I.FY)) + flat(I.planeY(.05, star(30, 22, 1, .45)), sh('#f4a6b8', I.FY)));
  sc.add('天花板', -86, box(0, 0, H - 1.7, W, 1.3, H, '#fffaf0') + box(0, 1.3, H - 1.7, 1.3, D, H, '#fffaf0'), { a: [24, 0, H - .8], small: true, dot: [24, .6, H - .8] });
  sc.add('踢脚线', -85, box(0, 0, 0, W, .5, 1.3, '#fffaf0') + box(0, .5, 0, .5, D, 1.3, '#fffaf0'), { a: [30, .5, .7], small: true, dot: [30, .5, .7] });

  // ---------- Alfombras de juego ----------
  var quilt = '';
  for (i = 13.5; i < 25; i += 2) quilt += I.path([[[i, 9, .52], [i - 1.5, 20, .52]]], 'rgba(90,150,185,.5)', .5);
  for (i = 10.5; i < 20; i += 2.5) quilt += I.path([[[12, i, .52], [24.6, i, .52]]], 'rgba(90,150,185,.5)', .5);
  tick('爬行垫', -32, box(11.5, 8.5, 0, 25, 20.5, .5, '#bde0f0') + flat([[11.8, 8.8, .5], [24.7, 8.8, .5], [24.7, 20.2, .5], [11.8, 20.2, .5]], 'none', 'stroke="#f6d86b" stroke-width="1"') + quilt, [13, 19.4, .5]);
  var foam = '', fc = ['#e4572e', '#f6d86b', '#3fa7a3', '#4a90d9', '#f6d86b', '#e4572e'];
  for (i = 0; i < 3; i++) { foam += box(26.5 + i * 4, 10, 0, 30.5 + i * 4, 13.75, .45, fc[i]); foam += box(26.5 + i * 4, 13.75, 0, 30.5 + i * 4, 17.5, .45, fc[i + 3]); }
  tick('游戏垫', -31, foam, [37.5, 16.8, .45]);

  // ---------- Ropero infantil (esquina) ----------
  shadow(0, 0, 11, 6);
  tick('儿童衣柜', 7.2, box(.2, .2, 0, 9.5, 4.8, 15, '#f6efe0') + box(0, 0, 15, 9.8, 5.1, 15.7, '#e6dcc6') +
    flat(I.planeY(4.83, [[.9, 1], [4.6, 1], [4.6, 14.2], [.9, 14.2]]), sh(MINT, I.FY), 'stroke="rgba(40,90,70,.5)" stroke-width=".5"') +
    flat(I.planeY(4.83, [[5.1, 1], [8.8, 1], [8.8, 14.2], [5.1, 14.2]]), sh(MINT, I.FY), 'stroke="rgba(40,90,70,.5)" stroke-width=".5"') +
    sphere(4.1, 4.95, 8, .5, '#f2b366') + sphere(5.6, 4.95, 8, .5, '#f2b366') +
    flat(I.planeY(4.84, star(2.8, 11.5, 1.1, .5)), '#ffd24d') + flat(I.planeY(4.84, star(7, 4.5, .9, .4)), '#f4a6b8'), [5, 4.9, 15.7]);

  // ---------- Ventana con cofre de juguetes debajo ----------
  tick('窗帘', -60, box(11, 1.5, 22.4, 23, 2.1, 22.9, CH) + box(11.3, 1.6, 9.6, 14.3, 2.4, 22.4, '#f9e08a') + box(19.7, 1.6, 9.6, 22.7, 2.4, 22.4, '#f9e08a') +
    I.path([[[12.1, 2.45, 9.8], [12.1, 2.45, 22.2]], [[13.3, 2.45, 9.8], [13.3, 2.45, 22.2]], [[20.7, 2.45, 9.8], [20.7, 2.45, 22.2]], [[21.9, 2.45, 9.8], [21.9, 2.45, 22.2]]], 'rgba(180,140,40,.4)', .6), [12.8, 2.4, 20]);
  sc.add('窗户', -62, flat(I.planeY(.5, [[13, 10.4], [21, 10.4], [21, 21], [13, 21]]), 'url(#sky2)') +
    cloud('y', .52, 15.8, 17.8, .55, 'rgba(255,255,255,.9)') + flat(I.planeY(.55, [[14.2, 11], [15, 11], [18, 20.4], [17.2, 20.4]]), 'rgba(255,255,255,.3)'), { a: [17, .5, 16] });
  sc.add('窗框', -61, box(12.2, 0, 9.4, 13, 1.2, 21.8, '#fffaf0') + box(21, 0, 9.4, 21.8, 1.2, 21.8, '#fffaf0') + box(13, 0, 9.4, 21, 1.2, 10.2, '#fffaf0') + box(13, 0, 21, 21, 1.2, 21.8, '#fffaf0') +
    box(16.6, 0, 10.2, 17.4, .9, 21, '#fffaf0') + box(13, 0, 15, 21, .9, 15.6, '#fffaf0'), [21.4, 1.2, 21.8], true);
  sc.add('窗台', -59, box(11.6, 0, 8.8, 22.4, 2.4, 9.4, '#fffaf0'), { a: [22, 2.4, 9.1], small: true, dot: [22, 2.4, 9.1] });
  shadow(11.2, 0, 22.6, 5.6);
  tick('玩具箱', 18.2, box(11.2, .2, 0, 21.2, 4.8, 4.6, '#e9a23b') + box(11.2, .2, 4.6, 21.2, 4.8, 5.2, '#f2b366') +
    flat(I.planeY(4.83, [[12, 1], [20.4, 1], [20.4, 3.8], [12, 3.8]]), sh('#d98d22', I.FY)) + flat(I.planeY(4.84, star(16.2, 2.4, 1.1, .5)), '#fff3c4'), [20, 4.8, 5.2]);
  var tb = sphere(16.2, 2.6, 6.9, 1.5, '#c58f5c') + sphere(15.3, 3.7, 5.9, .65, '#b57d4b') + sphere(17.1, 3.7, 5.9, .65, '#b57d4b') +
    sphere(14.8, 3, 7, .55, '#b57d4b') + sphere(17.6, 3, 7, .55, '#b57d4b') + sphere(16.2, 2.7, 9.2, 1.15, '#c58f5c') +
    sphere(15.3, 2.7, 10.2, .45, '#b57d4b') + sphere(17.1, 2.7, 10.2, .45, '#b57d4b') + sphere(16.6, 3.6, 9, .45, '#ebd2ac') + sphere(16.8, 4, 9.2, .18, '#2b2118') + sphere(16.9, 3.2, 8.1, .5, '#e6a0a8');
  tick('毛绒玩具', 18.6, tb, [16.2, 2.7, 11.4], true);

  // ---------- Estantería de cubos con juguetes y libros ----------
  shadow(24, 0, 36.6, 4.6);
  var shelf = box(24, .2, 0, 35.6, .6, 10, '#f0d9a8');
  [[24, 24.6], [27.7, 28.3], [31.4, 32], [35, 35.6]].forEach(function (c) { shelf += box(c[0], .2, 0, c[1], 3.4, 10, '#f0d9a8'); });
  [[0, .6], [4.7, 5.3], [9.4, 10]].forEach(function (r) { shelf += box(24, .2, r[0], 35.6, 3.4, r[1], '#f0d9a8'); });
  tick('玩具架', 31.2, shelf, [29, 3.4, 10], true);
  var bl = '';
  [[25.4, 1.9, .6, '#e4572e'], [26.8, 1.9, .6, '#4a90d9'], [26.1, 1.9, 1.8, '#f6d86b'], [25.2, 2.4, 1.8, '#3fa7a3']].forEach(function (b) { bl += box(b[0] - .55, b[1] - .55, b[2], b[0] + .55, b[1] + .55, b[2] + 1.1, b[3]); });
  tick('积木', 31.4, bl, [26.1, 1.9, 3.2], true);
  tick('玩具', 31.4, sphere(29.1, 2.1, 1.7, 1.1, '#e4572e') + cylZ(30.8, 1.9, .6, 3.8, .14, '#8c969d') + cylZ(30.8, 1.9, .6, 1.3, 1, '#f2b366') + cylZ(30.8, 1.9, 1.3, 1.9, .8, '#3fa7a3') + cylZ(30.8, 1.9, 1.9, 2.5, .6, '#e4572e') + sphere(30.8, 1.9, 3.9, .3, '#f6d86b'), [30, 1.9, 4], true);
  tick('拼图', 31.4, box(32.3, 1, .6, 34.7, 3, 1, '#8ec5d6') + box(32.5, 1.2, 1, 34.5, 2.8, 1.4, '#f4a6b8') + box(32.4, 1.1, 1.4, 34.6, 2.9, 1.8, '#f6d86b') + flat([[33.2, 2, 1.81], [33.8, 2, 1.81], [33.8, 2.6, 1.81], [33.2, 2.6, 1.81]], '#e4572e'), [33.5, 2, 2], true);
  tick('洋娃娃', 31.4, cylZ(26.1, 1.9, 5.3, 7.2, .95, '#f4a6b8') + cylZ(26.1, 1.9, 5.3, 5.8, 1.1, '#e98fa6') + sphere(25.2, 2.1, 6.6, .3, '#f6d4b8') + sphere(27, 2.1, 6.6, .3, '#f6d4b8') +
    sphere(26.1, 1.6, 8.2, .85, '#7a4b2a') + sphere(26.1, 1.9, 8, .75, '#f6d4b8'), [26.1, 1.9, 9], true);
  tick('绘本', 31.4, box(28.7, 1, 5.3, 31.1, 3, 5.7, '#e4572e') + box(28.9, 1.2, 5.7, 31.3, 3.1, 6.1, '#3fa7a3') + box(28.6, 1, 6.1, 31, 2.9, 6.5, '#f6d86b') + flat(I.planeY(3.01, [[28.9, 5.35], [30.8, 5.35], [30.8, 5.65], [28.9, 5.65]]), '#fffaf0'), [29.9, 2, 6.6], true);
  tick('故事书', 31.4, box(32.4, 1.2, 5.3, 32.95, 3, 8.6, '#c0392b') + box(32.95, 1.2, 5.3, 33.65, 3, 8.2, '#2c6fbb') + box(33.65, 1.2, 5.3, 34.2, 3, 8.4, '#2e9e6b') + box(34.2, 1.2, 5.3, 34.7, 3, 7.9, '#f2b366'), [33.5, 2, 8.8], true);

  // ---------- Cambiador con pañales, toallitas, biberón y chupete ----------
  shadow(36.6, 0, 48.2, 6.2);
  tick('换尿布台', 44.7, box(36.8, .2, 0, 37.5, 5.4, 9, '#f4efe4') + box(46.5, .2, 0, 47.2, 5.4, 9, '#f4efe4') + box(37.5, .2, 0, 46.5, .6, 9, '#ece4d4') +
    box(37.5, .6, 3.4, 46.5, 5.4, 4, '#f4efe4') + box(36.6, .2, 9, 47.4, 5.8, 9.7, '#f4efe4') + box(37, .4, 9.7, 47, 5.4, 10.3, '#a8d8ea') +
    box(37, .4, 10.3, 47, 1.2, 11.4, '#8ec5d6') + box(37, .4, 10.3, 37.8, 5.4, 11.4, '#8ec5d6') + box(46.2, .4, 10.3, 47, 5.4, 11.4, '#8ec5d6'), [42, 5.4, 11.4]);
  tick('尿布', 45, box(38.5, 1.2, 4, 43.5, 4.6, 7.4, '#e8f4fa') + flat(I.planeY(4.62, [[39, 4.5], [43, 4.5], [43, 6.9], [39, 6.9]]), sh('#5fb3d6', I.FY)) +
    flat(I.planeY(4.63, I.ellPoly(41, 5.7, 1.1, 1.1, 12)), '#fffaf0') + box(44.5, 1.5, 4, 46.2, 4, 4.25, '#ffffff') + box(44.5, 2.6, 4.25, 45, 2.9, 4.3, '#5fb3d6'), [41, 4.6, 7.4], true);
  tick('湿巾', 45.1, box(38.4, 1.8, 10.3, 41.4, 3.6, 11.5, '#ffffff') + box(38.4, 1.8, 11.5, 41.4, 3.6, 11.9, '#4aa3a6') + flat(I.planeY(3.62, [[39, 10.5], [40.8, 10.5], [40.8, 11.2], [39, 11.2]]), '#9fd3d4'), [39.9, 3.6, 11.9], true);
  tick('安抚奶嘴', 45.1, ellZ(43.6, 3.2, 1, 1, 10.3, 10.5, '#f6a6c1') + cylZ(43.6, 3.2, 10.5, 10.7, .55, '#f6a6c1') + sphere(43.6, 3.2, 11.1, .5, '#f6d4b8'), [43.6, 3.2, 11.7], true);
  tick('奶瓶', 45.2, cylZ(45.4, 2.6, 10.3, 13.2, .8, '#eef6fa') + cylZ(45.4, 2.6, 10.3, 11.9, .72, '#ffffff') + cylZ(45.4, 2.6, 13.2, 13.6, .9, '#8ec5d6') + sphere(45.4, 2.6, 14.1, .45, '#f6d4b8'), [45.4, 2.6, 14.6], true);
  tick('架子', -20, box(40, 0, 15, 47, 2.6, 15.6, '#d9ad7c') + box(40.4, 0, 13.6, 41, .6, 15, '#b98b5e') + box(46, 0, 13.6, 46.6, .6, 15, '#b98b5e'), [46.6, 2.6, 15.6], true);
  tick('婴儿监视器', -19, box(42.4, .4, 15.6, 45.6, 2.2, 18.4, '#f3f3f0') + sphere(44, 1.8, 17.2, .85, '#2b2b33') + sphere(44.9, 2.1, 17.9, .15, '#3ddc84') + cylZ(42.9, 1, 18.4, 20.4, .12, '#c3ccd3'), [44, 1.8, 20.4], true);
  tick('电灯开关', -50, box(35.3, 0, 11, 36.4, .35, 12.9, '#f9f8f4') + flat(I.planeY(.37, [[35.6, 11.5], [36.1, 11.5], [36.1, 12.3], [35.6, 12.3]]), '#e3e1da'), [35.8, .4, 13], true);

  // ---------- Cuna (pared izquierda) ----------
  var cs = 5.8, ce = 18.8, back = '', inner = '', front = '', y, x;
  shadow(0, 5.8, 8.4, 19.8);
  back += box(.3, cs, 2.2, 1, ce, 3, CREAM) + box(.3, cs, 11.4, 1, ce, 12.2, CREAM);
  for (x = 1.4; x < 6.6; x += 1.05) back += box(x, cs, 2.2, x + .35, cs + .6, 11.4, CREAM);
  back += box(.3, cs, 2.2, 7, cs + .6, 3, CREAM) + box(.3, cs, 11.4, 7, cs + .7, 12.2, CREAM);
  back += box(.3, cs, 0, 1, cs + .7, 13.6, CREAM) + sphere(.65, cs + .35, 14.1, .55, '#f2b366') + box(6.3, cs, 0, 7, cs + .7, 13.6, CREAM) + sphere(6.65, cs + .35, 14.1, .55, '#f2b366');
  tick('婴儿床', 10.5, back, [3.6, cs, 14], true);
  tick('婴儿床垫', 10.8, box(1, 6.5, 2.8, 6.3, 18.1, 4.3, '#f4f1e8') + box(1, 6.5, 2.2, 6.3, 18.1, 2.8, '#e0c9a0'), [3.6, 12.3, 4.3]);
  tick('床围', 10.85, box(1, 6.5, 4.3, 1.9, 18.1, 8.2, '#f8c8d0') + box(1.9, 6.5, 4.3, 6.3, 7.4, 8.2, '#f8c8d0') + box(5.5, 7.4, 4.3, 6.3, 18.1, 6.8, '#fbd8de') +
    flat(I.planeX(1.92, [[8, 6.1], [10, 6.1], [10, 7.5], [8, 7.5]]), '#fff') + flat(I.planeX(1.92, [[13, 6.1], [15, 6.1], [15, 7.5], [13, 7.5]]), '#fff'), [1.5, 12.8, 8.2], true);
  tick('婴儿毯', 10.9, box(2.2, 9.5, 4.3, 5.4, 17.6, 4.8, SUN) + box(2.2, 9.5, 4.8, 3.2, 17.6, 5, SUN) + [[3, 11], [4.2, 13], [3.4, 15.2], [4.8, 10.4], [4.6, 16.4]].reduce(function (a, p) { return a + flat(I.ellPoly(p[0], p[1], .35, .35, 8).map(function (q) { return [q[0], q[1], 4.82]; }), '#fff'); }, ''), [3.8, 13.5, 4.9], true);
  for (y = 6.6; y < 18.4; y += 1.05) front += box(6.5, y, 2.2, 6.85, y + .35, 11.4, CREAM);
  for (x = 1.4; x < 6.4; x += 1.05) front += box(x, 18.3, 2.2, x + .35, 18.65, 11.4, CREAM);
  front += box(6.3, cs, 2.2, 7, ce, 3, CREAM) + box(6.3, cs, 11.4, 7, ce, 12.2, CREAM) + box(.3, 18.2, 2.2, 7, ce, 3, CREAM) + box(.3, 18.2, 11.4, 7, ce, 12.2, CREAM) +
    box(6.3, 18.1, 0, 7, ce, 13.6, CREAM) + sphere(6.65, 18.45, 14.1, .55, '#f2b366') + box(.3, 18.1, 0, 1, ce, 13.6, CREAM) + sphere(.65, 18.45, 14.1, .55, '#f2b366') + box(6.3, cs, 0, 7, cs + .7, 13.6, CREAM);
  tick('婴儿床', 11.6, front, [6.6, 12.3, 12.4]);
  deco(11.7, box(0, 12.1, 19.6, 6.6, 12.5, 20, '#c3ccd3') + I.path([[[6, 12.3, 19.6], [6, 12.3, 16]], [[4, 12.3, 19.6], [4, 12.3, 17.4]], [[2, 12.3, 19.6], [2, 12.3, 15.4]]], '#8c969d', .5) +
    sphere(6, 12.3, 15.6, .6, '#f6d86b') + sphere(4, 12.3, 17, .55, '#f4a6b8') + sphere(2, 12.3, 15, .6, '#8ec5d6'));

  // ---------- Enchufe con luz de noche y cama pequeña ----------
  tick('插座', 21, box(0, 19.3, 3.4, .35, 20.7, 6.6, '#f9f8f4') + flat(I.planeX(.37, [[19.6, 3.7], [19.9, 3.7], [19.9, 4.1], [19.6, 4.1]]), '#3a3a3a') + flat(I.planeX(.37, [[20.1, 3.7], [20.4, 3.7], [20.4, 4.1], [20.1, 4.1]]), '#3a3a3a'), [.4, 20, 3.4], true);
  tick('夜灯', 21.2, '<circle cx="' + I.P(1.2, 20, 5.6)[0].toFixed(1) + '" cy="' + I.P(1.2, 20, 5.6)[1].toFixed(1) + '" r="20" fill="url(#halo)"/>' + box(.35, 19.4, 5, 1.4, 20.6, 6.2, '#fffaf0') + sphere(1.5, 20, 5.8, .95, '#ffe9a8'), [1.5, 20, 6.8], true);
  var bd = '';
  bd = box(.2, 21.5, 1, 7, 22.3, 8.5, '#f2b366') + sphere(1.4, 21.9, 8.8, .6, '#f6d86b') + sphere(5.8, 21.9, 8.8, .6, '#f6d86b') + box(.2, 21.5, 0, .9, 22.1, 1, '#c58f5c') + box(6.3, 21.5, 0, 7, 22.1, 1, '#c58f5c') +
    box(.2, 22.3, 1, 7, 34.5, 2, '#f2b366') + box(.6, 22.3, 2, 6.4, 33.9, 3.4, '#f4f1e8') + box(1, 22.6, 3.4, 5.2, 25.3, 4.4, '#fdf6e3') +
    box(.5, 25.8, 3.4, 6.5, 33.9, 4.3, '#9bd1c6') + flat(star(2.5, 29, .9, .4).map(function (p) { return [p[0], p[1], 4.32]; }), '#ffd24d') + flat(star(4.6, 32, .9, .4).map(function (p) { return [p[0], p[1], 4.32]; }), '#ffd24d') +
    box(6.2, 22.3, 2, 7, 33.9, 3.6, '#f2b366') + box(.2, 33.9, 1, 7, 34.5, 4, '#f2b366') + box(.2, 34.2, 0, .9, 34.5, 1, '#c58f5c') + box(6.3, 34.2, 0, 7, 34.5, 1, '#c58f5c');
  shadow(0, 21.5, 8.2, 35.4);
  tick('小床', 31.6, bd, [3.6, 28, 4.4]);

  // ---------- Puerta (pared izquierda) ----------
  tick('门框', -40, box(0, 36, 0, 1.1, 36.6, 22, '#fffaf0') + box(0, 43.1, 0, 1.1, 43.7, 22, '#fffaf0') + box(0, 36, 21.4, 1.1, 43.7, 22, '#fffaf0'), [1, 40, 22], true);
  tick('门', -39, box(0, 36.6, 0, .9, 43.1, 21.4, '#f2b366') + flat(I.planeX(.95, [[37.4, 11], [42.3, 11], [42.3, 20.2], [37.4, 20.2]]), sh('#e09f45', I.FX)) +
    flat(I.planeX(.95, [[37.4, 1.2], [42.3, 1.2], [42.3, 9.8], [37.4, 9.8]]), sh('#e09f45', I.FX)) + flat(I.planeX(.96, star(39.8, 15.6, 1.8, .8)), sh('#fff3c4', I.FX)), [.9, 40.5, 6]);
  tick('门把手', -38, cylX(37.7, 10.5, .9, 1.7, .55, CH) + sphere(2.2, 37.7, 10.5, .75, '#d7dde2'), [2.2, 37.7, 10.5], true);

  // ---------- Rincón de lectura y juguetes sobre las alfombras ----------
  shadow(26, 22, 38, 33.4);
  var tbl = box(30.2, 22.2, 0, 30.8, 22.8, 4.4, '#c58f5c') + box(35.6, 22.2, 0, 36.2, 22.8, 4.4, '#c58f5c') + box(30.2, 27.6, 0, 30.8, 28.2, 4.4, '#c58f5c') + box(35.6, 27.6, 0, 36.2, 28.2, 4.4, '#c58f5c') + box(29.8, 21.8, 4.4, 36.6, 28.6, 5.1, '#f2b366');
  tick('小桌子', 58, tbl, [36, 28, 5.1]);
  function chair(x0, y0, face) {
    var o = box(x0, y0, 0, x0 + .4, y0 + .4, 2.6, '#c58f5c') + box(x0 + 2.6, y0, 0, x0 + 3, y0 + .4, 2.6, '#c58f5c') + box(x0, y0 + 2.6, 0, x0 + .4, y0 + 3, 2.6, '#c58f5c') + box(x0 + 2.6, y0 + 2.6, 0, x0 + 3, y0 + 3, 2.6, '#c58f5c') + box(x0 - .1, y0 - .1, 2.6, x0 + 3.1, y0 + 3.1, 3.2, MINT);
    return o + (face === 'x' ? box(x0 - .1, y0 - .1, 3.2, x0 + .5, y0 + 3.1, 6.4, MINT) : box(x0 - .1, y0 + 2.5, 3.2, x0 + 3.1, y0 + 3.1, 6.4, MINT));
  }
  tick('小椅子', 52, chair(26.4, 23.4, 'x'), [26.8, 25, 6.4], true);
  tick('小椅子', 64.7, chair(32, 29.4, 'y'), [33.5, 32.4, 6.4], true);
  tick('绘本', 58.2, box(30.8, 23.2, 5.1, 35, 27.4, 5.35, '#e4572e') + box(31, 23.4, 5.35, 32.9, 27.2, 5.6, '#fffaf0') + box(32.9, 23.4, 5.35, 34.8, 27.2, 5.6, '#fffaf0') +
    I.path([[[31.4, 24, 5.62], [32.5, 24, 5.62]], [[31.4, 24.8, 5.62], [32.5, 24.8, 5.62]], [[33.3, 24, 5.62], [34.4, 24, 5.62]]], '#8c969d', .5) + flat(star(33.6, 26, .7, .3).map(function (p) { return [p[0], p[1], 5.62]; }), '#e4572e'), [33, 25.4, 5.7], true);
  // bloques y coche sobre las alfombras
  var tw = '';
  [[15, 11, 0, '#e4572e'], [16.2, 11, 0, '#4a90d9'], [15.6, 11, 1.1, '#f6d86b'], [15.4, 12.2, 0, '#3fa7a3'], [15.6, 11.2, 2.2, '#e4572e']].forEach(function (b) { tw += box(b[0], b[1], b[2] + .5, b[0] + 1.1, b[1] + 1.1, b[2] + 1.6, b[3]); });
  tick('积木', 33, tw, [15.6, 11.5, 3.1], true);
  tick('玩具车', 43.8, box(29, 12.2, .45, 33, 13.8, 1.3, '#d62828') + box(30, 12.3, 1.3, 32.2, 13.7, 2.2, '#f6d86b') + cylY(29.8, .85, 13.5, 14, .55, '#2b2b33') + cylY(32.2, .85, 13.5, 14, .55, '#2b2b33') + cylY(29.8, .85, 12, 12.3, .55, '#2b2b33') + cylY(32.2, .85, 12, 12.3, .55, '#2b2b33'), [31, 13, 2.4], true);
  tick('拼图', 43.9, box(34.8, 12.4, .45, 36.2, 13.8, .85, '#8ec5d6') + box(36.2, 12.8, .45, 37.4, 14, .85, '#f4a6b8') + box(34.6, 14, .45, 35.9, 15.2, .85, '#3fa7a3') + box(36, 14.1, .45, 37.3, 15.4, .85, SUN) + sphere(36.2, 13.1, .9, .3, '#8ec5d6') + sphere(35.2, 14.1, .9, .3, '#3fa7a3'), [36, 14, 1], true);
  // Juguetes tirados por el suelo y montón junto al cofre
  var sc1 = sphere(19.5, 27, 1.2, 1.2, '#e4572e') + box(22.5, 30, 0, 24, 31.5, 1.5, '#4a90d9') + cylZ(15, 29, 0, 1.6, .8, SUN) + box(24, 25, 0, 25.2, 26.2, 1.2, '#3fa7a3') + cylX(32.2, .6, 17, 19.6, .6, '#f4a6b8') + sphere(19.7, 32.2, .7, .6, '#f4a6b8') + sphere(27, 34, 1, 1, '#f6d86b');
  tick('乱放的玩具', 46, sc1, [21, 30, 2.6], true);
  var pile = '';
  [[13.6, 5.6, 0, 1.3, '#4a90d9'], [15.6, 5.8, 0, 1.2, '#e4572e'], [17.4, 5.7, 0, 1.3, '#f6d86b'], [14.6, 6.8, 0, 1.2, '#3fa7a3'], [16.6, 7, 0, 1.1, '#f4a6b8']].forEach(function (b) { pile += box(b[0], b[1], b[2], b[0] + b[3], b[1] + b[3], b[2] + b[3], b[4]); });
  pile += sphere(15, 6.4, 2.6, .8, '#e4572e') + cylZ(16.4, 6.4, 1.2, 2.4, .6, '#8ec5d6') + box(15.4, 6.2, 1.3, 16.6, 7.2, 2.3, '#f6d86b') + sphere(17.9, 6.6, 1.9, .65, '#3fa7a3');
  tick('一堆玩具', 22, pile, [16, 6.4, 3.4], true);
  return sc;
};
