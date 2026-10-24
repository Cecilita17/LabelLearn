// Mini motor isométrico 2.5D en SVG. Sin dependencias.
// Ejes: x crece hacia abajo-derecha de la pantalla, y hacia abajo-izquierda, z hacia arriba.
// Las paredes del fondo son el plano y=0 (pared derecha) y el plano x=0 (pared izquierda).
// Toda forma se construye extruyendo un polígono; la luz se calcula por cara (lambert), así que
// todos los objetos comparten perspectiva, iluminación y escala.
(function () {
  var S = 4.7, A = S * 0.866, B = S * 0.5;      // px por unidad (1 unidad = 10 cm)
  var LV = (function () { var v = [-0.25, 0.55, 0.85], m = Math.hypot(v[0], v[1], v[2]); return v.map(function (c) { return c / m; }); })();

  function f2(n) { return Math.round(n * 10) / 10; }
  function P(x, y, z) { return [(x - y) * A, (x + y) * B - z * S]; }
  function pt(p) { var q = P(p[0], p[1], p[2]); return f2(q[0]) + ',' + f2(q[1]); }
  function pts(a) { return a.map(pt).join(' '); }
  function rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function shade(h, f) {
    var c = rgb(h), o = f <= 1 ? c.map(function (v) { return v * f; }) : c.map(function (v) { return v + (255 - v) * (f - 1); });
    return 'rgb(' + o.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))); }).join(',') + ')';
  }
  function lam(n) { return 0.68 + 0.45 * Math.max(0, n[0] * LV[0] + n[1] * LV[1] + n[2] * LV[2]); }
  var FX = lam([1, 0, 0]), FY = lam([0, 1, 0]);   // factores de luz de los planos x=cte e y=cte

  function map3(ax, u, v, a) { return ax === 'z' ? [u, v, a] : ax === 'y' ? [u, a, v] : [a, u, v]; }

  // Extruye un polígono 2D (en el plano perpendicular a `ax`) entre a0 y a1 y dibuja solo las caras visibles.
  function ext(ax, poly, a0, a1, col, o) {
    o = o || {};
    var n = poly.length, area = 0, i, out = '';
    for (i = 0; i < n; i++) { var p0 = poly[i], q0 = poly[(i + 1) % n]; area += p0[0] * q0[1] - q0[0] * p0[1]; }
    var s = area > 0 ? 1 : -1;
    for (i = 0; i < n; i++) {
      var p = poly[i], q = poly[(i + 1) % n], du = q[0] - p[0], dv = q[1] - p[1], l = Math.hypot(du, dv) || 1;
      var n3 = map3(ax, s * dv / l, -s * du / l, 0);
      if (n3[0] + n3[1] + n3[2] <= 0.001) continue;
      var c = shade(col, lam(n3) * (o.k || 1));
      out += '<polygon points="' + pts([map3(ax, p[0], p[1], a0), map3(ax, q[0], q[1], a0), map3(ax, q[0], q[1], a1), map3(ax, p[0], p[1], a1)]) + '" fill="' + c + '" stroke="' + c + '" stroke-width=".5" stroke-linejoin="round"/>';
    }
    var axn = ax === 'z' ? [0, 0, 1] : ax === 'y' ? [0, 1, 0] : [1, 0, 0];
    var cc = shade(o.top || col, lam(axn) * (o.k || 1));
    out += '<polygon points="' + pts(poly.map(function (p) { return map3(ax, p[0], p[1], a1); })) + '" fill="' + cc + '" stroke="' + cc + '" stroke-width=".5" stroke-linejoin="round"/>';
    return out;
  }
  function rectP(x0, y0, x1, y1) { return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; }
  function ell(cx, cy, rx, ry, n) { n = n || 24; var a = [], t; for (var i = 0; i < n; i++) { t = i / n * Math.PI * 2; a.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } return a; }

  var I = {
    S: S, A: A, B: B, P: P, shade: shade, FX: FX, FY: FY, pts: pts, pt: pt,
    box: function (x0, y0, z0, x1, y1, z1, c, o) { return ext('z', rectP(x0, y0, x1, y1), z0, z1, c, o); },
    cylZ: function (cx, cy, z0, z1, r, c, o) { return ext('z', ell(cx, cy, r, r, 16), z0, z1, c, o); },
    ellZ: function (cx, cy, rx, ry, z0, z1, c, o) { return ext('z', ell(cx, cy, rx, ry, 28), z0, z1, c, o); },
    cylY: function (cx, cz, y0, y1, r, c, o) { return ext('y', ell(cx, cz, r, r, 18), y0, y1, c, o); },
    cylX: function (cy, cz, x0, x1, r, c, o) { return ext('x', ell(cy, cz, r, r, 18), x0, x1, c, o); },
    ellPoly: ell,
    ext: ext,   // prisma de un polígono 2D en cualquier eje (formas no rectangulares)
    // polígono plano en 3D (decals, tapas, cristales...)
    flat: function (a3, fill, extra) { return '<polygon points="' + pts(a3) + '" fill="' + fill + '" ' + (extra || '') + '/>'; },
    line: function (a, b, stroke, w, extra) { return '<line x1="' + pt(a).split(',')[0] + '" y1="' + pt(a).split(',')[1] + '" x2="' + pt(b).split(',')[0] + '" y2="' + pt(b).split(',')[1] + '" stroke="' + stroke + '" stroke-width="' + (w || .5) + '" ' + (extra || '') + '/>'; },
    path: function (a3list, stroke, w, extra) {
      var d = ''; a3list.forEach(function (seg) { d += 'M' + pt(seg[0]) + 'L' + pt(seg[1]); });
      return '<path d="' + d + '" stroke="' + stroke + '" stroke-width="' + (w || .5) + '" fill="none" ' + (extra || '') + '/>';
    },
    // puntos de un plano de pared: planeY(y,[[x,z],..]) y planeX(x,[[y,z],..])
    planeY: function (y, a) { return a.map(function (p) { return [p[0], y, p[1]]; }); },
    planeX: function (x, a) { return a.map(function (p) { return [x, p[0], p[1]]; }); },
    hit: function (x, y, z, r) { var q = P(x, y, z); return '<circle class="hit" cx="' + f2(q[0]) + '" cy="' + f2(q[1]) + '" r="' + r + '"/>'; }
  };

  var sph = {};
  I.defs = [];
  I.sphere = function (cx, cy, cz, r, c) {
    var q = P(cx, cy, cz), id = 'sp' + c.replace('#', '');
    if (!sph[id]) {
      sph[id] = 1;
      I.defs.push('<radialGradient id="' + id + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="' + shade(c, 1.35) + '"/><stop offset=".55" stop-color="' + c + '"/><stop offset="1" stop-color="' + shade(c, .62) + '"/></radialGradient>');
    }
    return '<circle cx="' + f2(q[0]) + '" cy="' + f2(q[1]) + '" r="' + f2(r * S * 1.1) + '" fill="url(#' + id + ')"/>';
  };

  // Escena: lista de piezas con orden de profundidad (k). Menor k se dibuja antes (más atrás).
  function Scene(W, D, H) { this.W = W; this.D = D; this.H = H; this.items = []; this.seq = 0; }
  Scene.prototype.add = function (w, k, svg, o) { this.items.push({ w: w, k: k, svg: svg, o: o || {}, n: this.seq++ }); };
  Scene.prototype.viewBox = function () {
    var x0 = P(0, this.D, 0)[0] - 8, x1 = P(this.W, 0, 0)[0] + 8, y0 = -this.H * S - 6, y1 = (this.W + this.D) * B + 2 * S + 10;
    return [f2(x0), f2(y0), f2(x1 - x0), f2(y1 - y0)];
  };
  Scene.prototype.sorted = function () { return this.items.slice().sort(function (a, b) { return a.k - b.k || a.n - b.n; }); };
  I.Scene = Scene;
  window.ISO = I;
})();
