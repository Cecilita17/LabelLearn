// Buscador de palabras de la pantalla de la casa. Busca por hanzi, pinyin (con o sin tonos) o traducción en el idioma elegido.
// Si la palabra está en una sola habitación, lleva directo a ella; si está en varias, deja elegir.
(function () {
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var entries = null;

  function build(rooms) {
    var map = {}, idx = window.LABELLEARN_INDEX || {};
    rooms.forEach(function (r) {
      r.cols.forEach(function (col) {
        col.forEach(function (c) {
          if (!c) return;
          var e = map[c[1]] || (map[c[1]] = { zh: c[1], py: c[2], es: [], en: [], own: [] });
          if (e.es.indexOf(c[3]) < 0) e.es.push(c[3]);
          if (e.en.indexOf(c[4]) < 0) e.en.push(c[4]);
          if (e.own.indexOf(r.id) < 0) e.own.push(r.id);
        });
      });
    });
    rooms.forEach(function (r) {   // las habitaciones también se pueden buscar por nombre
      if (map[r.zh]) return;
      map[r.zh] = { zh: r.zh, py: r.py, es: [r.es], en: [r.en], own: [r.id], isRoom: true };
    });
    entries = Object.keys(map).map(function (zh) {
      var e = map[zh];
      e.rooms = (!e.isRoom && idx[zh] && idx[zh].length ? idx[zh] : e.own).slice();
      e.pyN = norm(e.py).replace(/[\s']/g, '');
      e.esN = e.es.map(norm); e.enN = e.en.map(norm);
      return e;
    });
  }

  function score(e, q, raw, lang) {
    var hanzi = /[一-鿿]/.test(raw), best = 99, i, t, k;
    if (hanzi) { k = e.zh.indexOf(raw); return k < 0 ? 99 : (e.zh === raw ? 0 : (k === 0 ? 1 : 2)); }
    var qp = q.replace(/[\s']/g, '');
    if (qp) { k = e.pyN.indexOf(qp); if (k >= 0) best = e.pyN === qp ? 0.5 : (k === 0 ? 1.5 : 3.5); }
    var tl = lang === 'en' ? e.enN : e.esN;
    for (i = 0; i < tl.length; i++) {
      t = tl[i]; k = t.indexOf(q);
      if (k < 0) continue;
      var s = t === q ? 0 : (k === 0 ? 1 : (t.charAt(k - 1) === ' ' || t.charAt(k - 1) === '/' ? 2 : 3));
      if (s < best) best = s;
    }
    return best;
  }

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var LUPA = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.4 15.4L21 21" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

  // ctx: { rooms, byId, lang(), go(roomId, zh) }
  function create(ctx) {
    if (!entries) build(ctx.rooms);
    var scope = null, pool = entries;
    if (ctx.scope) { scope = {}; ctx.scope.forEach(function (w) { scope[w] = true; }); pool = entries.filter(function (e) { return scope[e.zh] && !e.isRoom; });
      if (ctx.roomId) {   // primero el vocabulario propio de la habitación, después los elementos estructurales
        var mine = pool.filter(function (e) { return e.own.indexOf(ctx.roomId) >= 0; }), rest = pool.filter(function (e) { return e.own.indexOf(ctx.roomId) < 0; });
        pool = mine.concat(rest);
      } }
    var es = function () { return ctx.lang() !== 'en'; };
    function T(a, b) { return es() ? a : b; }
    function tr(e) { return (es() ? e.es : e.en).join(' / '); }
    function roomName(id) { var r = ctx.byId[id]; return r.icon + ' ' + r.zh + ' · ' + (es() ? r.es : r.en); }

    var bar = el('button', 's-bar'); bar.type = 'button';
    var barTxt = el('span', 's-bar-txt'); bar.innerHTML = LUPA; bar.appendChild(barTxt);

    var ov = el('div', 'search'); ov.hidden = true; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Buscar');
    var top = el('div', 's-top'), back = el('button', 's-back', '‹'); back.type = 'button'; back.setAttribute('aria-label', 'Cerrar búsqueda');
    var input = document.createElement('input'); input.type = 'search'; input.id = 'searchInput'; input.autocomplete = 'off'; input.spellcheck = false; input.autocapitalize = 'none'; input.setAttribute('enterkeyhint', 'search');
    var clear = el('button', 's-clear', '×'); clear.type = 'button'; clear.hidden = true; clear.setAttribute('aria-label', 'Borrar');
    top.appendChild(back); top.appendChild(input); top.appendChild(clear);
    var hint = el('div', 's-hint'), list = el('div', 's-list'), pick = el('div', 's-pick'); pick.hidden = true;
    ov.appendChild(top); ov.appendChild(hint); ov.appendChild(list); ov.appendChild(pick);

    function texts() {
      barTxt.textContent = T('Buscar una palabra…', 'Search a word…');
      input.placeholder = scope ? T('Buscar en esta habitación', 'Search in this room') : T('Chino, pinyin o español', 'Chinese, pinyin or English');
    }
    function render() {
      var raw = input.value.trim(), q = norm(raw).trim();
      clear.hidden = !input.value;
      list.innerHTML = ''; hint.textContent = '';
      var res = [];
      if (!q) {
        if (!scope) { hint.textContent = T('Escribí una palabra en chino (家), en pinyin (jia) o en español (sofá).', 'Type a word in Chinese (家), pinyin (jia) or English (sofa).'); return; }
        pool.forEach(function (e) { res.push({ e: e, s: 0 }); });   // vacío: lista todas las palabras de la habitación
      } else {
        pool.forEach(function (e) { var s = score(e, q, raw, ctx.lang()); if (s < 99) res.push({ e: e, s: s }); });
        res.sort(function (a, b) { return a.s - b.s || a.e.zh.length - b.e.zh.length; });
      }
      if (!res.length) { hint.textContent = T('Sin resultados para “' + raw + '”.', 'No results for “' + raw + '”.'); return; }
      hint.textContent = res.length + ' ' + (res.length === 1 ? T('resultado', 'result') : T('resultados', 'results'));
      res.slice(0, scope ? 400 : 40).forEach(function (r) {
        var e = r.e, b = el('button', 's-item' + (e.isRoom ? ' room' : '')); b.type = 'button';
        var l1 = el('span', 's-l1'); l1.appendChild(el('span', 's-zh', e.zh)); l1.appendChild(el('span', 's-py', e.py));
        b.appendChild(l1); b.appendChild(el('span', 's-tr', tr(e)));
        var chips = el('span', 's-rooms');
        if (scope) { /* dentro de una habitación no hace falta indicar dónde está */ } else if (e.isRoom) chips.appendChild(el('span', 's-chip', ctx.byId[e.rooms[0]].icon + ' ' + T('Habitación', 'Room')));
        else e.rooms.slice(0, 4).forEach(function (id) { chips.appendChild(el('span', 's-chip', ctx.byId[id].icon + ' ' + (es() ? ctx.byId[id].es : ctx.byId[id].en))); });
        if (e.rooms.length > 4) chips.appendChild(el('span', 's-chip more', '+' + (e.rooms.length - 4)));
        if (!scope) b.appendChild(chips);
        b.addEventListener('click', function () { choose(e); });
        list.appendChild(b);
      });
    }
    function choose(e) {
      if (ctx.pick) { close(); ctx.pick(e.zh); return; }
      if (e.rooms.length === 1) { close(); ctx.go(e.rooms[0], e.isRoom ? null : e.zh); return; }
      showPick(e);
    }
    function showPick(e) {
      pick.innerHTML = ''; pick.hidden = false;
      var card = el('div', 's-pick-card');
      var head = el('div', 's-pick-head');
      head.appendChild(el('b', null, e.zh + ' ' + e.py));
      head.appendChild(el('span', null, T('Está en ' + e.rooms.length + ' habitaciones. ¿A cuál ir?', 'It is in ' + e.rooms.length + ' rooms. Which one?')));
      card.appendChild(head);
      var grid = el('div', 's-pick-list');
      e.rooms.forEach(function (id) {
        var r = ctx.byId[id], b = el('button', 's-pick-btn'); b.type = 'button';
        b.appendChild(el('span', 's-pick-ic', r.icon)); b.appendChild(el('span', 's-pick-zh', r.zh)); b.appendChild(el('span', 's-pick-tr', es() ? r.es : r.en));
        if (e.own.indexOf(id) < 0) b.classList.add('minor');
        b.addEventListener('click', function () { close(); ctx.go(id, e.zh); });
        grid.appendChild(b);
      });
      card.appendChild(grid);
      var cancel = el('button', 's-pick-cancel', T('Cancelar', 'Cancel')); cancel.type = 'button';
      cancel.addEventListener('click', function () { pick.hidden = true; });
      card.appendChild(cancel);
      pick.appendChild(card);
    }
    function open() { ov.hidden = false; pick.hidden = true; texts(); render(); setTimeout(function () { input.focus(); }, 30); }
    function close() { ov.hidden = true; pick.hidden = true; input.blur(); }

    bar.addEventListener('click', open);
    back.addEventListener('click', close);
    clear.addEventListener('click', function () { input.value = ''; render(); input.focus(); });
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); if (ev.key === 'Enter') { var f = list.querySelector('.s-item'); if (f) f.click(); input.blur(); } });
    pick.addEventListener('click', function (ev) { if (ev.target === pick) pick.hidden = true; });
    texts();
    return { bar: bar, overlay: ov, open: open, refresh: function () { texts(); if (!ov.hidden) render(); }, isOpen: function () { return !ov.hidden; }, close: close };
  }
  window.LabelSearch = { create: create };
})();
