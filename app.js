(function () {
  var ROOMS = window.LABELLEARN_ROOMS, BY_ID = {};
  ROOMS.forEach(function (r) { BY_ID[r.id] = r; });

  // Plano de la casa (corte): filas de arriba a abajo
  var FLOORS = [['study', 'kids', 'bedroom'], ['living', 'dining', 'kitchen'], ['entrance', 'laundry', 'bathroom']];
  var EXTRAS = ['structure', 'misc', 'positions'];
  var ROOF = { e: '🔺', zh: '屋顶', py: 'wūdǐng', es: 'Tejado', en: 'Roof' };

  var KEY = 'labellearn_prefs';
  var prefs = { lang: 'es', pinyin: true, trans: true };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var view = $('view'), sheet = $('sheet'), titleEl = $('roomTitle'), backBtn = $('back');
  var inCity = false, inSupermarket = false;
  var currentObj = null, currentRoom = null, iso = null, search = null, roomSearch = null, pendingSelect = null;
  var WORDS = {};   // hanzi -> palabra (el baño tiene prioridad, luego el resto del vocabulario)
  [BY_ID.bathroom].concat(ROOMS).forEach(function (r) {
    r.cols.forEach(function (col) { col.forEach(function (c) { if (c && !WORDS[c[1]]) WORDS[c[1]] = word(c); }); });
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function tr(o) { return prefs.lang === 'en' ? o.en : o.es; }
  function word(c) { return { e: c[0], zh: c[1], py: c[2], es: c[3], en: c[4] }; }

  // ---------- Flashcards ----------
  var Cards = window.LabelCards;
  function cardsEntry() {
    var b = el('button', 'fc-entry'); b.type = 'button';
    b.appendChild(el('span', 'ic', '🃏'));
    var t = el('span'); t.appendChild(el('b', null, 'Flashcards')); t.appendChild(el('small', null, ''));
    b.appendChild(t);
    var badge = el('span', 'fc-badge'); b.appendChild(badge);
    function fill() {
      var n = Cards.dueCount(), saved = Cards.savedCount();
      t.lastChild.textContent = saved ? (prefs.lang === 'en' ? 'Review the words you saved' : 'Repasar las palabras que guardaste')
        : (prefs.lang === 'en' ? 'Save words with ⭐ to study them' : 'Guardá palabras con ⭐ para estudiarlas');
      badge.textContent = n; badge.hidden = !n;
    }
    b.fill = fill; fill(); cardsBtn = b;
    b.addEventListener('click', openCards);
    return b;
  }
  var cardsBtn = null;
  function roomOf(zh) {
    var ix = window.LABELLEARN_INDEX && window.LABELLEARN_INDEX[zh];
    if (ix && ix.length) return ix[0];
    for (var i = 0; i < ROOMS.length; i++) if (ROOMS[i].cols.some(function (c) { return c.some(function (x) { return x && x[1] === zh; }); })) return ROOMS[i].id;
    return null;
  }
  function openCards() {
    closeSheet();
    Cards.open({
      host: document.querySelector('.app'), lang: function () { return prefs.lang; },
      lookup: function (zh) { return WORDS[zh]; }, speak: speak,
      show: function (zh) { var id = roomOf(zh); if (!id) return; pendingSelect = zh; if (location.hash === '#/' + id) route(); else location.hash = '#/' + id; },
      onClose: function () { if (cardsBtn && cardsBtn.isConnected) cardsBtn.fill(); }
    });
  }
  function roomWords(r) {
    var out = [];
    r.cols.forEach(function (col) { col.forEach(function (c) { if (c && out.indexOf(c[1]) < 0) out.push(c[1]); }); });
    return out;
  }
  function fillRoomSave() {
    var b = $('roomSave');
    if (!currentRoom) { b.hidden = true; return; }
    var ws = roomWords(currentRoom), left = ws.filter(function (w) { return !Cards.isSaved(w); }).length;
    b.hidden = false; b.setAttribute('aria-pressed', !left);
    var en = prefs.lang === 'en';
    b.textContent = left ? '⭐ ' + (en ? 'Save ' : 'Guardar ') + left : '✓ ' + (en ? 'Saved' : 'Guardada');
    b.setAttribute('aria-label', left ? (en ? 'Save all ' + left + ' words of this room' : 'Guardar las ' + left + ' palabras de esta habitación') : (en ? 'All words of this room are saved' : 'Todas las palabras de la habitación están guardadas'));
  }
  $('roomSave').addEventListener('click', function () { if (currentRoom) { Cards.saveMany(roomWords(currentRoom)); fillRoomSave(); if (currentObj) fillSheet(currentObj); } });
  $('shStar').addEventListener('click', function () {
    if (!currentObj) return;
    Cards.setSaved(currentObj.zh, !Cards.isSaved(currentObj.zh)); fillSheet(currentObj); fillRoomSave();
  });

  // ---------- Vista general: casa en corte ----------
  function tile(r, extra) {
    var t = el('button', 'tile ' + (extra || '')); t.type = 'button'; t.dataset.room = r.id;
    var prev = [];
    r.cols.forEach(function (col) {
      for (var l = 0; l < 4; l++) if (col[l]) { prev.push(col[l][0]); break; }
    });
    t.appendChild(el('span', 't-zh', r.zh));
    t.appendChild(el('span', 't-py', r.py));
    var es = el('span', 't-tr', tr(r)); es.dataset.tr = r.id; t.appendChild(es);
    t.appendChild(el('span', 't-prev', prev.slice(0, r.outdoor ? 6 : 4).join('')));
    t.addEventListener('click', function () { location.hash = '#/' + r.id; });
    return t;
  }
  function renderHouse() {
    view.innerHTML = '';
    var wrap = el('div', 'house');
    var roof = el('button', 'roof'); roof.type = 'button';
    roof.appendChild(el('span', 'r-zh', ROOF.zh));
    roof.appendChild(el('span', 'r-py', ROOF.py));
    var rtr = el('span', 'r-tr', tr(ROOF)); rtr.dataset.roof = '1'; roof.appendChild(rtr);
    roof.addEventListener('click', function () { openSheet(ROOF); });
    search = window.LabelSearch.create({
      rooms: ROOMS, byId: BY_ID, lang: function () { return prefs.lang; },
      go: function (roomId, zh) { pendingSelect = zh; location.hash = '#/' + roomId; }
    });
    wrap.appendChild(search.bar);
    wrap.appendChild(cardsEntry());
    var cityEntry = el('a', 'city-entry'); cityEntry.href = '#/city';
    cityEntry.innerHTML = '<span>🏘️</span><span><b data-city-title>Ciudad</b><small data-city-sub>Un barrio para explorar en chino</small></span><span aria-hidden="true">↗</span>';
    wrap.appendChild(cityEntry);
    wrap.appendChild(roof);

    var body = el('div', 'house-body');
    FLOORS.forEach(function (row) {
      var f = el('div', 'floor');
      row.forEach(function (id) { f.appendChild(tile(BY_ID[id])); });
      body.appendChild(f);
    });
    wrap.appendChild(body);
    wrap.appendChild(tile(BY_ID.garden, 'wide'));
    var ex = el('div', 'extras');
    EXTRAS.forEach(function (id) { ex.appendChild(tile(BY_ID[id], 'extra')); });
    wrap.appendChild(ex);
    view.appendChild(wrap);
    view.appendChild(search.overlay);
    titleEl.innerHTML = '';
    titleEl.appendChild(el('b', null, '家'));
    titleEl.appendChild(document.createTextNode('jiā · ' + (prefs.lang === 'en' ? 'Home' : 'Casa')));
    backBtn.hidden = true;
  }

  // ---------- Escena de una habitación ----------
  function renderRoom(r) {
    view.innerHTML = '';
    var scene = el('div', 'scene'); scene.dataset.room = r.id;
    if (r.outdoor) scene.classList.add('outdoor');
    var inner = el('div', 'scene-inner');
    inner.style.setProperty('--cols', r.cols.length);
    r.cols.forEach(function (col, ci) {
      col.forEach(function (c, lvl) {
        if (!c) return;
        var o = word(c);
        var b = el('button', 'cell lvl' + lvl); b.type = 'button';
        b.style.gridColumn = ci + 1; b.style.gridRow = 4 - lvl;
        b.appendChild(el('span', 'em', o.e));
        var tag = el('span', 'tag');
        tag.appendChild(el('span', 'zh', o.zh));
        tag.appendChild(el('span', 'py', o.py));
        var t = el('span', 'tr', tr(o)); t.dataset.zh = o.zh; t.dataset.es = o.es; t.dataset.en = o.en;
        tag.appendChild(t);
        b.appendChild(tag);
        b.addEventListener('click', function () { openSheet(o); });
        inner.appendChild(b);
      });
    });
    scene.appendChild(inner);
    view.appendChild(scene);
    scene.scrollLeft = 0;
    titleEl.innerHTML = '';
    titleEl.appendChild(el('b', null, r.zh));
    titleEl.appendChild(document.createTextNode(r.py + ' · ' + tr(r)));
    backBtn.hidden = false;
  }

  // ---------- Habitación isométrica (escena 2.5D) ----------
  function renderIso(r) {
    view.innerHTML = '';
    var host = el('div', 'iso');
    view.appendChild(host);
    var scene = window.LABELLEARN_SCENES[r.id](window.ISO), core = {}, local = {};
    r.cols.forEach(function (col) { col.forEach(function (c) { if (c) { core[c[1]] = true; local[c[1]] = word(c); } }); });
    function lookup(w) { return local[w] || WORDS[w]; }
    iso = window.IsoView.mount(host, scene, {
      title: r.zh + ' ' + tr(r),
      onSearch: function () { if (roomSearch) { closeSheet(); roomSearch.open(); } },
      onSelect: function (w) { if (lookup(w)) openSheet(lookup(w), true); },
      onDeselect: function () { closeSheet(); },
      isCore: function (w) { return core[w]; },
      labelLines: function (w) {
        var o = lookup(w); if (!o) return null;
        var l = [o.zh]; if (prefs.pinyin) l.push(o.py); if (prefs.trans) l.push(tr(o)); return l;
      }
    });
    roomSearch = window.LabelSearch.create({
      rooms: ROOMS, byId: BY_ID, lang: function () { return prefs.lang; }, scope: iso.words(), roomId: r.id,
      pick: function (zh) { iso.find(zh); }
    });
    view.appendChild(roomSearch.overlay);
    titleEl.innerHTML = '';
    titleEl.appendChild(el('b', null, r.zh));
    titleEl.appendChild(document.createTextNode(r.py + ' · ' + tr(r)));
    backBtn.hidden = false;
    if (pendingSelect) {   // llegada desde el buscador: resaltar la palabra buscada
      var w = pendingSelect; pendingSelect = null;
      setTimeout(function () { if (iso && iso.has(w)) iso.find(w); }, 650);
    }
  }

  function route() {
    closeSheet();
    if (iso) { iso.destroy(); iso = null; }
    search = null; roomSearch = null;
    var id = (location.hash.match(/^#\/(\w+)/) || [])[1];
    inCity = id === 'city';
    inSupermarket = id === 'supermarket';
    currentRoom = BY_ID[id] || null;
    var isIso = !!(currentRoom && window.LABELLEARN_SCENES && window.LABELLEARN_SCENES[currentRoom.id]);
    view.classList.toggle('iso-view', isIso || inCity || inSupermarket);
    if (inSupermarket) {
      view.innerHTML = '';
      iso = window.SupermarketView.mount(view, { prefs: prefs, lang: function () { return prefs.lang; }, tr: tr, openSheet: openSheet, closeSheet: closeSheet });
      titleEl.innerHTML = '<b>超市</b>chāoshì · ' + (prefs.lang === 'en' ? 'Supermarket' : 'Supermercado');
      backBtn.hidden = false;
    } else if (inCity) {
      view.innerHTML = '';
      iso = window.LabelCityView.mount(view, { prefs: prefs, lang: function () { return prefs.lang; }, tr: tr, openSheet: openSheet, closeSheet: closeSheet });
      titleEl.innerHTML = '<b>城市</b>chéngshì · ' + (prefs.lang === 'en' ? 'City' : 'Ciudad');
      backBtn.hidden = false;
    } else if (isIso) renderIso(currentRoom); else if (currentRoom) renderRoom(currentRoom); else renderHouse();
    fillRoomSave();
    applyPrefs(true);
  }

  // ---------- Preferencias ----------
  function applyPrefs(skipRoute) {
    view.classList.toggle('hide-py', !prefs.pinyin);
    view.classList.toggle('hide-tr', !prefs.trans);
    $('togPinyin').setAttribute('aria-pressed', prefs.pinyin);
    $('togTrans').setAttribute('aria-pressed', prefs.trans);
    document.documentElement.lang = prefs.lang;
    Array.prototype.forEach.call(document.querySelectorAll('.seg button'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.lang === prefs.lang);
    });
    $('togTrans').textContent = '译 ' + (prefs.lang === 'en' ? 'Translation' : 'Traducción');
    $('shPlay').textContent = '🔊 ' + (prefs.lang === 'en' ? 'Listen' : 'Escuchar');
    $('backTxt').textContent = inSupermarket ? (prefs.lang === 'en' ? 'City' : 'Ciudad') : (prefs.lang === 'en' ? 'Home' : 'Casa');
    fillRoomSave();
    if (cardsBtn && cardsBtn.isConnected) cardsBtn.fill();
    var cityTitle = view.querySelector('[data-city-title]'), citySub = view.querySelector('[data-city-sub]');
    if (cityTitle) cityTitle.textContent = prefs.lang === 'en' ? 'City' : 'Ciudad';
    if (citySub) citySub.textContent = prefs.lang === 'en' ? 'A neighborhood to explore in Chinese' : 'Un barrio para explorar en chino';
    if (!skipRoute) {
      Array.prototype.forEach.call(view.querySelectorAll('.cell .tr'), function (n) {
        n.textContent = prefs.lang === 'en' ? n.dataset.en : n.dataset.es;
      });
      Array.prototype.forEach.call(view.querySelectorAll('[data-tr]'), function (n) {
        n.textContent = tr(BY_ID[n.dataset.tr]);
      });
      var rt = view.querySelector('[data-roof]'); if (rt) rt.textContent = tr(ROOF);
      if (inSupermarket) { titleEl.lastChild.textContent = 'chāoshì · ' + (prefs.lang === 'en' ? 'Supermarket' : 'Supermercado'); }
      else if (inCity) { titleEl.lastChild.textContent = 'chéngshì · ' + (prefs.lang === 'en' ? 'City' : 'Ciudad'); }
      else if (currentRoom) { titleEl.lastChild.textContent = currentRoom.py + ' · ' + tr(currentRoom); }
      else { titleEl.lastChild.textContent = 'jiā · ' + (prefs.lang === 'en' ? 'Home' : 'Casa'); }
      if (currentObj) fillSheet(currentObj);
    }
    if (iso) iso.refreshLabels();
    if (search) search.refresh();
    if (roomSearch) roomSearch.refresh();
  }

  // ---------- Ficha de objeto + audio ----------
  function speak(text, rate) {
    if (!('speechSynthesis' in window)) return;
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = rate || 0.8;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
  function fillSheet(o) {
    $('shEmoji').textContent = o.e; $('shZh').textContent = o.zh;
    $('shPy').textContent = o.py; $('shTr').textContent = tr(o);
    var star = $('shStar'), saved = Cards.isSaved(o.zh), en = prefs.lang === 'en';
    star.hidden = !!inCity || !!inSupermarket || !Cards.hasSentence(o.zh);
    $('shHouse').hidden = !o.cityHome;
    $('shSupermarket').hidden = !o.enterSupermarket;
    $('shSupermarket').textContent = en ? 'Enter supermarket →' : 'Entrar al supermercado →';
    $('shHouse').textContent = en ? 'Enter LabelLearn house →' : 'Entrar a la casa de LabelLearn →';
    star.setAttribute('aria-pressed', saved);
    star.textContent = saved ? '⭐ ' + (en ? 'Saved' : 'Guardada') : '☆ ' + (en ? 'Save' : 'Guardar');
  }
  function openSheet(o, keepFocus) { currentObj = o; fillSheet(o); sheet.hidden = false; if (!keepFocus) $('shClose').focus(); speak(o.zh); }
  function closeSheet() { sheet.hidden = true; currentObj = null; if (iso) iso.deselect(); if ('speechSynthesis' in window) speechSynthesis.cancel(); }

  $('shClose').addEventListener('click', closeSheet);
  $('shPlay').addEventListener('click', function () { if (currentObj) speak(currentObj.zh); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  backBtn.addEventListener('click', function () { location.hash = inSupermarket ? '#/city' : '#/'; });
  $('togPinyin').addEventListener('click', function () { prefs.pinyin = !prefs.pinyin; save(); applyPrefs(); });
  $('togTrans').addEventListener('click', function () { prefs.trans = !prefs.trans; save(); applyPrefs(); });
  Array.prototype.forEach.call(document.querySelectorAll('.seg button'), function (b) {
    b.addEventListener('click', function () { prefs.lang = b.dataset.lang; save(); applyPrefs(); });
  });
  window.addEventListener('hashchange', route);
  route();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {} });
  }
})();
