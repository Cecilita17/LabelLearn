// Vista interactiva de una escena isométrica: cámara (arrastrar, pellizcar, rueda), selección de objetos,
// puntos táctiles para objetos pequeños y etiquetas opcionales. Usa el motor de iso.js.
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  function mount(host, scene, ctx) {
    var I = window.ISO, vb = scene.viewBox(), vw = vb[2], vh = vb[3];
    var body = '', dots = '', anchors = {}, order = [];
    scene.sorted().forEach(function (it) {
      if (!it.w) { body += '<g class="deco">' + it.svg + '</g>'; return; }
      var a = it.o.a, hit = '';
      if (it.o.small && a) hit = I.hit(a[0], a[1], a[2], 9);
      body += '<g class="obj" data-w="' + it.w + '">' + it.svg + hit + '</g>';
      if (it.o.dot) {
        var q = I.P(it.o.dot[0], it.o.dot[1], it.o.dot[2]);
        dots += '<g class="dot" data-w="' + it.w + '" data-x="' + q[0].toFixed(1) + '" data-y="' + q[1].toFixed(1) + '"><circle class="dot-hit" r="9"/><circle class="dot-core" r="2.3"/></g>';
      }
      if (a && !anchors[it.w]) { anchors[it.w] = I.P(a[0], a[1], a[2]); order.push(it.w); }
    });

    host.innerHTML =
      '<svg class="iso-svg" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + ctx.title + '">' +
      '<defs>' + I.defs.join('') + '</defs><g class="cam"><g class="world">' + body + '</g><g class="dots">' + dots + '</g><g class="lbls"></g></g></svg>' +
      '<div class="iso-tools">' +
      '<button type="button" data-t="in" aria-label="Acercar">+</button>' +
      '<button type="button" data-t="out" aria-label="Alejar">−</button>' +
      '<button type="button" data-t="reset" aria-label="Vista completa">⤢</button>' +
      '<button type="button" data-t="dots" aria-pressed="true" aria-label="Puntos táctiles">●</button>' +
      '<button type="button" data-t="lbl" aria-pressed="false" aria-label="Etiquetas">Aa</button></div>';
    var svg = host.querySelector('.iso-svg'), cam = svg.querySelector('.cam'), lbls = svg.querySelector('.lbls'), dotsG = svg.querySelector('.dots');
    var cur = { k: 1, tx: 0, ty: 0 }, showLbl = false, moved = false, raf = 0;

    // ---------- cámara ----------
    function upu() { var r = svg.getBoundingClientRect(); return 1 / Math.min(r.width / vw, r.height / vh); }   // unidades vb por px
    function clamp(c) {
      var k = Math.max(0.85, Math.min(4, c.k));
      var mx = Math.min(0, vw * (1 - k)) - 30, Mx = Math.max(0, vw * (1 - k)) + 30;
      var my = Math.min(0, vh * (1 - k)) - 30, My = Math.max(0, vh * (1 - k)) + 30;
      return { k: k, tx: Math.max(mx, Math.min(Mx, c.tx)), ty: Math.max(my, Math.min(My, c.ty)) };
    }
    function apply(c) {
      cur = clamp(c);
      cam.setAttribute('transform', 'translate(' + cur.tx.toFixed(2) + ' ' + cur.ty.toFixed(2) + ') scale(' + cur.k.toFixed(3) + ')');
      Array.prototype.forEach.call(lbls.children, function (g) { g.setAttribute('transform', 'translate(' + g._x + ' ' + g._y + ') scale(' + (1 / cur.k).toFixed(3) + ')'); });
      Array.prototype.forEach.call(dotsG.children, function (g) { g.setAttribute('transform', 'translate(' + g.getAttribute('data-x') + ' ' + g.getAttribute('data-y') + ') scale(' + (1 / cur.k).toFixed(3) + ')'); });
      if (typeof layoutLabels === 'function') layoutLabels();
      svg.classList.toggle('zoomed', cur.k > 1.6);
    }
    function animate(to, ms) {
      cancelAnimationFrame(raf);
      var from = { k: cur.k, tx: cur.tx, ty: cur.ty }, t0 = performance.now(); to = clamp(to);
      (function step(t) {
        var p = Math.min(1, (t - t0) / (ms || 300)), e = 1 - Math.pow(1 - p, 3);
        apply({ k: from.k + (to.k - from.k) * e, tx: from.tx + (to.tx - from.tx) * e, ty: from.ty + (to.ty - from.ty) * e });
        if (p < 1) raf = requestAnimationFrame(step);
      })(t0);
    }
    function toVB(cx, cy) { var m = svg.getScreenCTM().inverse(), p = svg.createSVGPoint(); p.x = cx; p.y = cy; p = p.matrixTransform(m); return { x: p.x, y: p.y }; }
    function zoomAt(cx, cy, f, smooth) {
      var p = toVB(cx, cy), k2 = Math.max(0.85, Math.min(4, cur.k * f)), r = k2 / cur.k;
      var to = { k: k2, tx: p.x - (p.x - cur.tx) * r, ty: p.y - (p.y - cur.ty) * r };
      if (smooth) animate(to, 220); else apply(to);
    }
    function center() { var r = svg.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }

    var ptrs = {}, pinch = null, drag = null;
    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function onDown(e) {
      cancelAnimationFrame(raf);
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length === 1) { moved = false; drag = { x: e.clientX, y: e.clientY, tx: cur.tx, ty: cur.ty }; pinch = null; }
      else if (ids.length === 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], mid = toVB((a.x + b.x) / 2, (a.y + b.y) / 2);
        pinch = { d: dist(a, b), k: cur.k, wx: (mid.x - cur.tx) / cur.k, wy: (mid.y - cur.ty) / cur.k }; drag = null; moved = true;
      }
    }
    function onMove(e) {
      if (!ptrs[e.pointerId]) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (pinch && ids.length >= 2) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], mid = toVB((a.x + b.x) / 2, (a.y + b.y) / 2), k = pinch.k * dist(a, b) / pinch.d;
        k = Math.max(0.85, Math.min(4, k));
        apply({ k: k, tx: mid.x - pinch.wx * k, ty: mid.y - pinch.wy * k });
      } else if (drag) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!moved && Math.hypot(dx, dy) > 6) moved = true;
        if (moved) { var u = upu(); apply({ k: cur.k, tx: drag.tx + dx * u, ty: drag.ty + dy * u }); }
      }
    }
    function onUp(e) {
      delete ptrs[e.pointerId];
      var ids = Object.keys(ptrs);
      if (ids.length === 1) { var p = ptrs[ids[0]]; drag = { x: p.x, y: p.y, tx: cur.tx, ty: cur.ty }; pinch = null; }
      else if (!ids.length) { drag = null; pinch = null; }
    }
    svg.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    svg.addEventListener('wheel', function (e) { e.preventDefault(); zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });

    // ---------- selección ----------
    function allByWord(w) { return Array.prototype.filter.call(svg.querySelectorAll('[data-w]'), function (n) { return n.getAttribute('data-w') === w; }); }
    function clearSel() { Array.prototype.forEach.call(svg.querySelectorAll('.sel'), function (n) { n.classList.remove('sel'); }); }
    function ensureVisible(w) {
      var a = anchors[w]; if (!a) return;
      var r = svg.getBoundingClientRect(), u = upu(), card = document.querySelector('.sheet-card'), cardPx = card ? card.offsetHeight : 210;
      var tl = toVB(r.left, r.top), br = toVB(r.right, r.bottom), m = 26;
      var ax = cur.tx + cur.k * a[0], ay = cur.ty + cur.k * a[1];
      var minY = tl.y + m, maxY = br.y - cardPx * u - m, minX = tl.x + m, maxX = br.x - m, dx = 0, dy = 0;
      if (ax < minX) dx = minX - ax; else if (ax > maxX) dx = maxX - ax;
      if (ay < minY) dy = minY - ay; else if (ay > maxY) dy = maxY - ay;
      if (dx || dy) animate({ k: cur.k, tx: cur.tx + dx, ty: cur.ty + dy }, 280);
    }
    function select(w) {
      clearSel(); allByWord(w).forEach(function (n) { n.classList.add('sel'); });
      ctx.onSelect(w); setTimeout(function () { ensureVisible(w); }, 30);
    }
    function nearestDot(cx, cy) {
      var best = null, bd = 1e9;
      Array.prototype.forEach.call(dotsG.children, function (g) {
        var r = g.querySelector('.dot-core').getBoundingClientRect(), d = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2));
        if (d < bd) { bd = d; best = g; }
      });
      return bd <= 16 ? best : null;
    }
    svg.addEventListener('click', function (e) {
      if (moved) { moved = false; return; }
      var n = e.target.closest ? e.target.closest('[data-w]') : null;
      if (n && n.classList.contains('dot')) n = nearestDot(e.clientX, e.clientY) || n;   // en grupos apretados gana el punto más cercano al dedo
      if (n) select(n.getAttribute('data-w')); else { clearSel(); ctx.onDeselect(); }
    });

    // ---------- etiquetas ----------
    // Tamaño constante en pantalla. A poco zoom solo el hanzi; al acercar, pinyin y traducción.
    // Un filtro voraz oculta las que se pisan (las del vocabulario de la habitación tienen prioridad).
    var labels = [];
    function refreshLabels() {
      lbls.innerHTML = ''; labels = [];
      if (!showLbl) return;
      order.slice().sort(function (a, b) { return (ctx.isCore(b) ? 1 : 0) - (ctx.isCore(a) ? 1 : 0); }).forEach(function (w) {
        var lines = ctx.labelLines(w); if (!lines) return;
        var a = anchors[w], g = document.createElementNS(NS, 'g'), rect = document.createElementNS(NS, 'rect'), texts = [];
        g.setAttribute('class', 'lbl'); g.setAttribute('data-w', w); g._x = a[0].toFixed(1); g._y = (a[1] - 3).toFixed(1);
        rect.setAttribute('rx', 4); g.appendChild(rect);
        lines.forEach(function (t, i) {
          var tx = document.createElementNS(NS, 'text'); tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('class', 't' + i);
          tx.setAttribute('font-size', i ? 8 : 11); tx.textContent = t; g.appendChild(tx); texts.push(tx);
        });
        lbls.appendChild(g); labels.push({ g: g, rect: rect, texts: texts, lines: lines, core: ctx.isCore(w), x: a[0], y: a[1] - 3, mode: '' });
      });
      apply(cur);
    }
    function layoutLabels() {
      if (!labels.length) return;
      var full = cur.k >= 1.5, placed = [];
      labels.forEach(function (L) {
        var n = full ? L.lines.length : 1, sizes = [11, 8, 8], wpx = 0, y = -8, i;
        for (i = 0; i < n; i++) wpx = Math.max(wpx, L.lines[i].length * (i ? 4.7 : 11.5));
        wpx += 10;
        var hpx = 6; for (i = 0; i < n; i++) hpx += sizes[i] + 2;
        for (i = L.texts.length - 1; i >= 0; i--) {
          if (i >= n) { L.texts[i].setAttribute('display', 'none'); continue; }
          L.texts[i].removeAttribute('display'); L.texts[i].setAttribute('x', 0); L.texts[i].setAttribute('y', y); y -= sizes[i] + 2;
        }
        L.rect.setAttribute('x', -wpx / 2); L.rect.setAttribute('width', wpx); L.rect.setAttribute('height', hpx); L.rect.setAttribute('y', -hpx - 3);
        // caja en espacio de cámara (el grupo se escala 1/k, así que mide wpx x hpx)
        var ax = cur.tx + cur.k * L.x, ay = cur.ty + cur.k * L.y, bx = ax - wpx / 2, by = ay - hpx - 3, hide = false;
        for (i = 0; i < placed.length; i++) { var q = placed[i]; if (bx < q[2] && bx + wpx > q[0] && by < q[3] && by + hpx > q[1]) { hide = true; break; } }
        if (hide) L.g.setAttribute('display', 'none'); else { L.g.removeAttribute('display'); placed.push([bx, by, bx + wpx, by + hpx]); }
      });
    }

    // ---------- herramientas ----------
    host.querySelector('.iso-tools').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var t = b.dataset.t, c = center();
      if (t === 'in') zoomAt(c[0], c[1], 1.5, true);
      else if (t === 'out') zoomAt(c[0], c[1], 1 / 1.5, true);
      else if (t === 'reset') animate({ k: 1, tx: 0, ty: 0 }, 350);
      else if (t === 'dots') { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); svg.classList.toggle('nodots', !on); }
      else if (t === 'lbl') { showLbl = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', showLbl); refreshLabels(); }
    });

    // Entrada suave: llega acercándose desde un poco más lejos
    apply({ k: 0.9, tx: vw * 0.05, ty: vh * 0.05 }); animate({ k: 1, tx: 0, ty: 0 }, 450);

    return {
      refreshLabels: refreshLabels,
      deselect: clearSel,
      has: function (w) { return !!anchors[w]; },
      select: select,
      words: function () { return Object.keys(anchors); },
      destroy: function () { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp); }
    };
  }
  window.IsoView = { mount: mount };
})();
