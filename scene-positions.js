// Posiciones: una sala de demostración. Cada palabra de lugar se ve con una bolita de color y un objeto de referencia.
// 上面 sobre la mesa · 下面 bajo la mesa · 里面 dentro de la caja · 外面 fuera de la caja · 前面 / 后面 / 旁边 respecto de una silla ·
// 中间 / 左边 / 右边 tres cubos en fila · 对面 la silla de enfrente · 附近 dentro del círculo del poste · 角落里 en la esquina · 到处 por todas partes.
window.LABELLEARN_SCENES = window.LABELLEARN_SCENES || {};
window.LABELLEARN_SCENES.positions = function (I) {
  var W = 44, D = 38, H = 27;
  var sc = new I.Scene(W, D, H);
  var box = I.box, cylZ = I.cylZ, ellZ = I.ellZ, flat = I.flat, sphere = I.sphere, sh = I.shade;
  var PAINT = '#dff0e8', WOOD = '#c58f5c', DARKW = '#8a5a3a', FXW = I.FX * 1.14;

  function tick(w, k, svg, a, small) { sc.add(w, k, svg, { a: a, small: small, dot: small ? a : null }); }
  function deco(k, svg) { sc.add(null, k, svg); }
  function rect2(x0, y0, x1, y1, z) { return [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; }
  function shadow(x0, y0, x1, y1) { sc.add(null, -50, flat([[x0, y0, .02], [x1, y0, .02], [x1, y1, .02], [x0, y1, .02]], 'rgba(60,40,20,.16)')); }
  function dropShadow(x, y, r) { return flat(I.ellPoly(x, y, r * 1.1, r * .9, 12).map(function (p) { return [p[0] + .15, p[1] + .1, .05]; }), 'rgba(40,30,20,.22)'); }
  function ball(x, y, z, r, col) { return dropShadow(x, y, r) + sphere(x, y, z, r, col); }
  function star(cu, cv, R, r, z) { var a = [], i, t; for (i = 0; i < 10; i++) { t = -Math.PI / 2 + i * Math.PI / 5; a.push([cu + (i % 2 ? r : R) * Math.cos(t), cv + (i % 2 ? r : R) * Math.sin(t), z]); } return a; }
  function chair(x0, y0, face, col) {
    var s3 = 3.2, o = box(x0 + .1, y0 + .1, 0, x0 + .5, y0 + .5, 2.6, DARKW) + box(x0 + s3 - .5, y0 + .1, 0, x0 + s3 - .1, y0 + .5, 2.6, DARKW) + box(x0 + .1, y0 + s3 - .5, 0, x0 + .5, y0 + s3 - .1, 2.6, DARKW) + box(x0 + s3 - .5, y0 + s3 - .5, 0, x0 + s3 - .1, y0 + s3 - .1, 2.6, DARKW) + box(x0, y0, 2.6, x0 + s3, y0 + s3, 3.2, WOOD) + box(x0 + .2, y0 + .2, 3.2, x0 + s3 - .2, y0 + s3 - .2, 3.7, col);
    return face === '+y' ? o + box(x0, y0, 3.7, x0 + s3, y0 + .5, 8.4, WOOD) : o + box(x0, y0 + s3 - .5, 3.7, x0 + s3, y0 + s3, 8.4, WOOD);
  }

  // ---------- Suelo y paredes ----------
  var s = box(0, 0, -2, W, D, 0, '#a07a55'), i;
  for (i = 0; i < 16; i++) s += flat([[i * W / 16, 0, 0], [(i + 1) * W / 16, 0, 0], [(i + 1) * W / 16, D, 0], [i * W / 16, D, 0]], i % 2 ? '#e0c79f' : '#d6bb92', 'stroke="#a07a55" stroke-width=".35"');
  sc.add('地板', -100, s, { a: [38, 34, 0] });
  sc.add('墙', -90, box(-1.6, -1.6, 0, W, 0, H, PAINT), { a: [10, 0, 20] });
  sc.add('墙', -90, box(-1.6, 0, 0, 0, D, H, PAINT, { k: 1.14 }), { a: [0, 30, 20] });
  sc.add('天花板', -86, box(0, 0, H - 1.7, W, 1.3, H, '#fffaf0') + box(0, 1.3, H - 1.7, 1.3, D, H, '#fffaf0'), { a: [30, 0, H - .8], small: true, dot: [30, .6, H - .8] });
  sc.add('踢脚线', -85, box(0, 0, 0, W, .5, 1.3, '#fffaf0') + box(0, .5, 0, .5, D, 1.3, '#fffaf0'), { a: [40, .5, .7], small: true, dot: [40, .5, .7] });

  // ---------- Mesa: encima y debajo ----------
  shadow(16.6, 13.4, 28, 22);
  deco(36, box(17.4, 14.4, 0, 18, 15, 6.4, WOOD) + box(26, 14.4, 0, 26.6, 15, 6.4, WOOD) + box(17.4, 20, 0, 18, 20.6, 6.4, WOOD) + box(26, 20, 0, 26.6, 20.6, 6.4, WOOD) + box(17, 14, 6.4, 27, 21, 7, '#e6c99b'));
  tick('下面', 35, ball(22, 17.6, 1, 1, '#4a90d9'), [22, 17.6, 2.4], true);
  tick('上面', 36.2, ball(22, 17.6, 8, 1, '#e4572e'), [22, 17.6, 9.4], true);

  // ---------- Caja abierta: dentro y fuera ----------
  shadow(30.4, 7.4, 38, 14.6);
  tick('里面', 24, box(31, 8, 0, 37, 8.4, 2.4, '#c9a06a') + box(31, 8, 0, 31.4, 14, 2.4, '#b88b52') + box(31, 8.4, 0, 37, 14, .3, '#a98450') + ball(34, 11, 1.6, 1.2, '#3fa7a3') + box(31, 13.6, 0, 37, 14, 2.4, '#d9b383') + box(36.6, 8, 0, 37, 14, 2.4, '#c0955f'), [34, 11, 3.8], true);
  tick('外面', 25, ball(39.8, 11, 1, 1, '#f2a31b'), [39.8, 11, 2.4], true);

  // ---------- Silla: delante, detrás, al lado ----------
  shadow(5.4, 13.4, 10, 18);
  deco(28, chair(6, 14.2, '+y', '#e8806b'));
  tick('后面', 26, ball(7.6, 11.4, 1, 1, '#8e6bbf'), [7.6, 11.4, 2.4], true);
  tick('前面', 29.5, ball(7.6, 20.4, 1, 1, '#f6d86b'), [7.6, 20.4, 2.4], true);
  tick('旁边', 29, ball(12.4, 15.8, 1, 1, '#f4a6b8'), [12.4, 15.8, 2.4], true);

  // ---------- Silla de enfrente ----------
  shadow(19.4, 9, 24.6, 13.4);
  tick('对面', 22, chair(20, 8.6, '+y', '#3fa7a3'), [21.6, 11.4, 9]);
  deco(56, chair(20, 23.8, '-y', '#3fa7a3'));

  // ---------- Tres cubos en fila: izquierda, medio, derecha ----------
  shadow(5, 29, 22, 34.4);
  tick('左边', 36.5, box(6, 30, 0, 9, 33, 3, '#f4a6b8') + flat(star(7.5, 31.5, 1, .45, 3.02), '#fffaf0'), [7.5, 31.5, 3.6], true);
  tick('中间', 40, box(11, 30, 0, 14, 33, 3, '#f6d86b') + flat(star(12.5, 31.5, 1, .45, 3.02), '#e4572e'), [12.5, 31.5, 3.6], true);
  tick('右边', 45, box(16, 30, 0, 19, 33, 3, '#8ec5d6') + flat(star(17.5, 31.5, 1, .45, 3.02), '#2c6fbb'), [17.5, 31.5, 3.6], true);

  // ---------- Poste con círculo: cerca ----------
  var rg = flat(I.ellPoly(35.4, 27.6, 4.2, 4.2, 28).map(function (p) { return [p[0], p[1], .06]; }), 'none', 'stroke="#e4572e" stroke-width="1.1" stroke-dasharray="3 2"');
  tick('附近', 45, rg + cylZ(34.4, 26.6, 0, 7.4, .4, DARKW) + sphere(34.4, 26.6, 7.9, .9, '#f2a31b') + ball(37.2, 29.4, 1, 1, '#4aa3a6'), [37.2, 29.4, 2.4], true);

  // ---------- Esquina y por todas partes ----------
  tick('角落里', 5, flat([[0, 0, .05], [4, 0, .05], [4, .7, .05], [.7, .7, .05], [.7, 4, .05], [0, 4, .05]], '#f2a31b', 'stroke="#2b2118" stroke-width=".5"') + ball(1.8, 1.8, 1, 1, '#d62828'), [1.8, 1.8, 2.4], true);
  var tt = '';
  [[4, 22, '#e4572e'], [14, 25, '#4a90d9'], [28, 30, '#f6d86b'], [24, 4, '#3fa7a3'], [41, 22, '#f4a6b8'], [10, 36, '#8e6bbf'], [31, 33, '#e8806b'], [40, 35, '#f2a31b'], [3, 30, '#4aa3a6'], [24, 35, '#d62828'], [15, 7, '#8ec5d6'], [42, 4, '#3fa7a3'], [29, 21.5, '#e4572e'], [3, 12, '#f6d86b'], [37, 18, '#4a90d9'], [19, 28, '#f4a6b8']].forEach(function (b) { tt += ball(b[0], b[1], .6, .6, b[2]); });
  tick('到处', 60, tt, [28, 30, 1.8], true);
  return sc;
};
