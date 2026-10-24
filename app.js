(function () {
  var ROOMS = window.LABELLEARN_ROOMS;
  var KEY = 'labellearn_prefs';
  var prefs = { lang: 'es', pinyin: true, trans: true };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var roomsEl = $('rooms'), tabsEl = $('tabs'), titleEl = $('roomTitle'), sheet = $('sheet');
  var current = 0, currentObj = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function tr(o) { return prefs.lang === 'en' ? o.en : o.es; }

  function build() {
    ROOMS.forEach(function (r, i) {
      var room = el('section', 'room'); room.dataset.room = r.id;
      var stage = el('div', 'stage');
      [true, false].forEach(function (isWall) {
        var items = r.objects.filter(function (o) { return o.wall === isWall; });
        if (!items.length) return;
        var zone = el('div', 'zone ' + (isWall ? 'wall' : 'floor'));
        items.forEach(function (o) {
          var b = el('button', 'obj'); b.type = 'button';
          b.appendChild(el('span', 'em', o.e));
          var tag = el('span', 'tag');
          tag.appendChild(el('span', 'zh', o.zh));
          tag.appendChild(el('span', 'py', o.py));
          var t = el('span', 'tr', tr(o));
          tag.appendChild(t);
          b.appendChild(tag);
          b.addEventListener('click', function () { openSheet(o); });
          o._tr = t;
          zone.appendChild(b);
        });
        stage.appendChild(zone);
      });
      room.appendChild(stage);
      roomsEl.appendChild(room);

      var tab = el('button', 'tab'); tab.type = 'button'; tab.setAttribute('role', 'tab');
      tab.appendChild(el('span', 'ic', r.icon));
      tab.appendChild(el('span', 'zh', r.zh));
      var es = el('span', 'es', tr(r)); r._tr = es; tab.appendChild(es);
      tab.addEventListener('click', function () { go(i); });
      tabsEl.appendChild(tab);
    });
  }

  function go(i) {
    roomsEl.scrollTo({ left: i * roomsEl.clientWidth, behavior: 'smooth' });
  }
  function setCurrent(i) {
    current = i;
    var r = ROOMS[i];
    Array.prototype.forEach.call(tabsEl.children, function (t, j) { t.setAttribute('aria-selected', j === i); });
    titleEl.innerHTML = '';
    titleEl.appendChild(el('b', null, r.zh));
    titleEl.appendChild(document.createTextNode(r.py + ' · ' + tr(r)));
  }
  roomsEl.addEventListener('scroll', function () {
    var i = Math.round(roomsEl.scrollLeft / roomsEl.clientWidth);
    if (i !== current && ROOMS[i]) setCurrent(i);
  }, { passive: true });

  function applyPrefs() {
    roomsEl.classList.toggle('hide-py', !prefs.pinyin);
    roomsEl.classList.toggle('hide-tr', !prefs.trans);
    $('togPinyin').setAttribute('aria-pressed', prefs.pinyin);
    $('togTrans').setAttribute('aria-pressed', prefs.trans);
    document.documentElement.lang = prefs.lang;
    Array.prototype.forEach.call(document.querySelectorAll('.seg button'), function (b) {
      b.setAttribute('aria-pressed', b.dataset.lang === prefs.lang);
    });
    $('togTrans').textContent = '译 ' + (prefs.lang === 'en' ? 'Translation' : 'Traducción');
    $('shPlay').textContent = '🔊 ' + (prefs.lang === 'en' ? 'Listen' : 'Escuchar');
    ROOMS.forEach(function (r) {
      r._tr.textContent = tr(r);
      r.objects.forEach(function (o) { o._tr.textContent = tr(o); });
    });
    setCurrent(current);
    if (currentObj) fillSheet(currentObj);
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = 0.8;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }
  function fillSheet(o) {
    $('shEmoji').textContent = o.e; $('shZh').textContent = o.zh;
    $('shPy').textContent = o.py; $('shTr').textContent = tr(o);
  }
  function openSheet(o) { currentObj = o; fillSheet(o); sheet.hidden = false; $('shClose').focus(); speak(o.zh); }
  function closeSheet() { sheet.hidden = true; currentObj = null; if ('speechSynthesis' in window) speechSynthesis.cancel(); }

  $('shClose').addEventListener('click', closeSheet);
  $('shPlay').addEventListener('click', function () { if (currentObj) speak(currentObj.zh); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  $('togPinyin').addEventListener('click', function () { prefs.pinyin = !prefs.pinyin; save(); applyPrefs(); });
  $('togTrans').addEventListener('click', function () { prefs.trans = !prefs.trans; save(); applyPrefs(); });
  Array.prototype.forEach.call(document.querySelectorAll('.seg button'), function (b) {
    b.addEventListener('click', function () { prefs.lang = b.dataset.lang; save(); applyPrefs(); });
  });

  build();
  applyPrefs();
})();
