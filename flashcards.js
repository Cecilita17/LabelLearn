// Flashcards de LabelLearn: mismo sistema de repaso espaciado que LinguaGloss (escalera de intervalos, 3 calificaciones,
// nivel 1 = escuchar y entender, nivel 2 = completar el hueco). Las tarjetas son las palabras guardadas con ⭐;
// cada una usa su oración de contexto (sentences.js), con la traducción de la oración entera en vez de glosas.
(function () {
  var MINUTE = 60000, DAY = 86400000;
  var LEARNING_STEPS = [MINUTE, 10 * MINUTE], LADDER_DAYS = [1, 3, 7, 14, 30, 60, 120];
  var NEW_PER_SESSION = 10;
  var KEY = 'labellearn_flashcards_v1';
  var SENT = window.LABELLEARN_SENT || {}, ROOMS = window.LABELLEARN_ROOMS || [];

  // ---------- Repaso espaciado (misma lógica que LinguaGloss) ----------
  function scheduleCard(card, rating, now) {
    var s = { step: 0, rung: -1, due: now, reps: 0, lapses: 0, streak: 0 }, k, last = LADDER_DAYS.length - 1;
    for (k in card) s[k] = card[k];
    s.reps += 1; s.lastRated = now;
    if (rating === 'again') {
      if (s.rung >= 0) s.lapses += 1;
      s.rung = Math.max(-1, s.rung - 2); s.step = 0; s.streak = 0; s.due = now + LEARNING_STEPS[0];
    } else if (s.rung < 0) {
      if (rating === 'easy') { s.rung = 1; s.due = now + LADDER_DAYS[1] * DAY; s.streak += 2; }
      else if (s.step + 1 < LEARNING_STEPS.length) { s.step += 1; s.due = now + LEARNING_STEPS[s.step]; s.streak += 1; }
      else { s.rung = 0; s.due = now + LADDER_DAYS[0] * DAY; s.streak += 1; }
    } else {
      s.rung = Math.min(last, s.rung + (rating === 'easy' ? 2 : 1));
      s.due = now + LADDER_DAYS[s.rung] * DAY; s.streak += rating === 'easy' ? 2 : 1;
    }
    return s;
  }
  function cardLevel(st) { return st && st.streak >= 2 ? 2 : 1; }
  function requeueIndex(st, now, len) { return st.due - now > 20 * MINUTE ? -1 : Math.min(len, st.step === 0 ? 3 : 6); }
  function fmt(ms, T) {
    var m = Math.round(ms / MINUTE);
    if (m < 60) return m + ' min';
    var d = Math.round(ms / DAY);
    return d < 1 ? Math.round(ms / 3600000) + ' h' : d + ' ' + T('d', 'd');
  }

  // ---------- Almacenamiento: { saved: {hanzi: fecha}, states: {hanzi: estado}, prefs } ----------
  var data = { saved: {}, states: {}, prefs: { tr: true, py: true, rate: 0.8 } };
  try { var raw = JSON.parse(localStorage.getItem(KEY) || '{}'); ['saved', 'states', 'prefs'].forEach(function (k) { if (raw[k]) Object.assign(data[k], raw[k]); }); } catch (e) {}
  var listeners = [];
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} listeners.forEach(function (f) { f(); }); }

  function hasSentence(zh) { return !!SENT[zh]; }
  function isSaved(zh) { return !!data.saved[zh]; }
  function setSaved(zh, on) {
    if (on && hasSentence(zh)) data.saved[zh] = data.saved[zh] || Date.now();
    else if (!on) { delete data.saved[zh]; delete data.states[zh]; }
    persist();
  }
  function saveMany(list) { var n = 0; list.forEach(function (zh) { if (hasSentence(zh) && !data.saved[zh]) { data.saved[zh] = Date.now(); n++; } }); persist(); return n; }

  function savedList() { return Object.keys(data.saved).filter(hasSentence).sort(function (a, b) { return data.saved[a] - data.saved[b]; }); }
  function selectSession(now) {
    var all = savedList();
    var reviews = all.filter(function (z) { return data.states[z] && data.states[z].due <= now; }).sort(function (a, b) { return data.states[a].due - data.states[b].due; });
    var fresh = all.filter(function (z) { return !data.states[z]; }).slice(0, NEW_PER_SESSION);
    var q = [], r = 0, n = 0, i;
    while (r < reviews.length || n < fresh.length) {
      for (i = 0; i < 2 && r < reviews.length; i++) q.push(reviews[r++]);
      if (n < fresh.length) q.push(fresh[n++]);
    }
    return q;
  }
  function dueCount() { return selectSession(Date.now()).length; }

  // ---------- Utilidades ----------
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function parse(zh) {
    var s = SENT[zh]; if (!s) return null;
    return { toks: s[0].map(function (t) { var p = t.split('|'); return { zh: p[0], py: p[1] }; }), es: s[1], en: s[2], text: s[0].map(function (t) { return t.split('|')[0]; }).join('') };
  }
  function roomWords(zh) {   // palabras de la misma habitación que zh (para opciones plausibles)
    var out = [];
    ROOMS.forEach(function (r) {
      var has = false, ws = [];
      r.cols.forEach(function (col) { col.forEach(function (c) { if (c) { ws.push(c[1]); if (c[1] === zh) has = true; } }); });
      if (has) out = out.concat(ws);
    });
    return out;
  }
  function distractors(zh, text, lookup) {
    var ok = function (w) { return w !== zh && text.indexOf(w) < 0 && lookup(w) && hasSentence(w); };
    var seen = {}, near = [], other = [];
    roomWords(zh).forEach(function (w) { if (!ok(w) || seen[w]) return; seen[w] = 1; (Math.abs(w.length - zh.length) <= 1 ? near : other).push(w); });
    var pool = shuffle(near).concat(shuffle(other));
    if (pool.length < 3) Object.keys(SENT).forEach(function (w) { if (ok(w) && !seen[w]) pool.push(w); });
    return pool.slice(0, 3);
  }

  // ---------- Pantalla de tarjetas ----------
  // ctx: { host, lang(), lookup(zh)→{e,zh,py,es,en}, speak(text, rate), show(zh) (ir a la casa), onClose() }
  function open(ctx) {
    var now0 = Date.now(), queue = selectSession(now0), total = queue.length, finished = 0, stats = { again: 0, good: 0, easy: 0 };
    var cur = null, flipped = false, phase = 'revealed', wrong = [], opts = null;
    var es = function () { return ctx.lang() !== 'en'; };
    function T(a, b) { return es() ? a : b; }

    var ov = el('div', 'fc'); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Flashcards');
    var box = el('div', 'fc-box'); ov.appendChild(box);
    ctx.host.appendChild(ov);

    function close() { if ('speechSynthesis' in window) speechSynthesis.cancel(); document.removeEventListener('keydown', onKey); ov.remove(); ctx.onClose(); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);

    function header() {
      var h = el('div', 'fc-head');
      h.appendChild(el('span', 'fc-hi', '🃏'));
      var d = el('div'); d.appendChild(el('h3', null, 'Flashcards')); d.appendChild(el('p', null, T('Escucha, entiende y recuerda', 'Listen, understand and remember'))); h.appendChild(d);
      var x = el('button', 'fc-x', '×'); x.type = 'button'; x.setAttribute('aria-label', T('Cerrar', 'Close')); x.addEventListener('click', close); h.appendChild(x);
      return h;
    }
    function begin() {
      cur = queue[0]; flipped = false; wrong = []; opts = null;
      var lvl = cardLevel(data.states[cur]);
      phase = lvl === 2 ? 'prompt' : 'revealed';
      if (lvl === 2) {
        var info = parse(cur), t = distractors(cur, info.text, ctx.lookup);
        if (t.length >= 2) opts = shuffle([cur].concat(t)); else phase = 'revealed';
      }
    }
    function say(text) { ctx.speak(text, data.prefs.rate); }

    function empty() {
      var d = el('div', 'fc-done');
      var saved = savedList().length, next = null;
      savedList().forEach(function (z) { var s = data.states[z]; if (s && (next == null || s.due < next)) next = s.due; });
      d.appendChild(el('div', 'fc-big', saved ? '✅' : '⭐'));
      if (!saved) {
        d.appendChild(el('h3', null, T('Todavía no guardaste palabras', 'You have not saved any words yet')));
        d.appendChild(el('p', null, T('Tocá un objeto de la casa y apretá ⭐ Guardar. En cada habitación también podés guardar todas sus palabras de una vez.', 'Tap an object in the house and press ⭐ Save. In each room you can also save all its words at once.')));
      } else {
        d.appendChild(el('h3', null, T('¡Hoy no hay nada para repasar!', 'Nothing to review today!')));
        d.appendChild(el('p', null, next ? T('La próxima tarjeta vuelve en ' + fmt(Math.max(next - Date.now(), MINUTE), T) + '.', 'Your next card is back in ' + fmt(Math.max(next - Date.now(), MINUTE), T) + '.') : ''));
      }
      var b = el('button', 'fc-btn', T('Volver a la casa', 'Back to the house')); b.type = 'button'; b.addEventListener('click', close); d.appendChild(b);
      return d;
    }
    function done() {
      var d = el('div', 'fc-done'); d.setAttribute('role', 'status');
      d.appendChild(el('div', 'fc-big', '🎉'));
      d.appendChild(el('h3', null, T('¡Sesión completa!', 'Session complete!')));
      d.appendChild(el('p', null, T('Practicaste ' + total + ' tarjetas. Las que marcaste “Otra vez” vuelven en un minuto.', 'You practiced ' + total + ' cards. Cards marked “Again” come back in a minute.')));
      var s = el('div', 'fc-stats');
      [['again', T('Otra vez', 'Again')], ['good', T('Bien', 'Good')], ['easy', T('Fácil', 'Easy')]].forEach(function (r) {
        var c = el('div', 'fc-stat'); c.appendChild(el('b', null, String(stats[r[0]]))); c.appendChild(el('small', null, r[1])); s.appendChild(c);
      });
      d.appendChild(s);
      var b = el('button', 'fc-btn', T('Cerrar', 'Close')); b.type = 'button'; b.addEventListener('click', close); d.appendChild(b);
      return d;
    }

    function render() {
      box.innerHTML = ''; box.appendChild(header());
      if (!total) { box.appendChild(empty()); return; }
      if (!queue.length) { box.appendChild(done()); return; }
      var zh = cur, w = ctx.lookup(zh), info = parse(zh), st = data.states[zh], lvl = cardLevel(st);
      var cloze = phase !== 'revealed';

      var pr = el('div', 'fc-progress');
      var lab = el('span', null, T((finished + 1) + ' de ' + total, (finished + 1) + ' of ' + total));
      lab.appendChild(el('span', 'fc-lvl', T('nivel ', 'level ') + lvl));
      pr.appendChild(lab);
      var bar = el('div', 'fc-bar'), fill = el('i'); fill.style.width = (finished / total * 100) + '%'; bar.appendChild(fill); pr.appendChild(bar);
      box.appendChild(pr);

      // tarjeta que se da vuelta
      var card = el('div', 'fc-card' + (flipped ? ' flipped' : ''));
      var inner = el('button', 'fc-inner'); inner.type = 'button'; inner.setAttribute('aria-label', T('Tarjeta: tocá para dar la vuelta', 'Card: tap to flip'));
      var front = el('span', 'fc-face fc-front');
      if (cloze) { front.appendChild(el('span', 'fc-q', '?')); front.appendChild(el('span', 'fc-sub', T('¿Qué palabra falta?', 'Which word is missing?'))); }
      else { front.appendChild(el('span', 'fc-emoji', w.e)); if (data.prefs.py) front.appendChild(el('span', 'fc-read', w.py)); front.appendChild(el('span', 'fc-word', w.zh)); }
      front.appendChild(el('span', 'fc-hint', T('Tocá para ver la traducción', 'Tap to see the translation')));
      var back = el('span', 'fc-face fc-back');
      back.appendChild(el('span', 'fc-small', cloze ? '?' : w.zh + ' · ' + w.py));
      back.appendChild(el('span', 'fc-mean', es() ? w.es : w.en));
      back.appendChild(el('span', 'fc-hint', T('Tocá para volver', 'Tap to flip back')));
      inner.appendChild(front); inner.appendChild(back);
      inner.addEventListener('click', function () { flipped = !flipped; card.classList.toggle('flipped', flipped); });
      var au = el('button', 'fc-audio', '🔊'); au.type = 'button'; au.setAttribute('aria-label', T('Escuchar', 'Listen')); au.addEventListener('click', function () { say(info.text); });
      card.appendChild(inner); card.appendChild(au); box.appendChild(card);

      // controles
      var ctl = el('div', 'fc-ctl');
      function btn(label, txt, cls, fn, pressed) {
        var c = el('div', 'fc-c'), b = el('button', 'fc-b ' + (cls || ''), txt); b.type = 'button'; b.setAttribute('aria-label', label);
        if (pressed != null) b.setAttribute('aria-pressed', pressed);
        b.addEventListener('click', fn); c.appendChild(b); c.appendChild(el('small', null, label)); ctl.appendChild(c); return b;
      }
      var rates = [0.6, 0.8, 1];
      btn(T('Velocidad', 'Speed'), data.prefs.rate + '×', 'speed', function () { data.prefs.rate = rates[(rates.indexOf(data.prefs.rate) + 1) % rates.length]; persist(); say(info.text); render(); });
      btn(T('Repetir', 'Repeat'), '↺', '', function () { say(cloze ? info.text : w.zh); });
      btn(T('Reproducir', 'Play'), '▶', 'play', function () { say(info.text); });
      btn(T('Traducir', 'Translate'), '译', 'tg', function () { data.prefs.tr = !data.prefs.tr; persist(); render(); }, data.prefs.tr);
      btn('Pinyin', 'Aa', '', function () { data.prefs.py = !data.prefs.py; persist(); render(); }, data.prefs.py);
      box.appendChild(ctl);

      // oración de contexto
      var cx = el('section', 'fc-ctx' + (data.prefs.py ? '' : ' nopy'));
      cx.appendChild(el('header', null, '📖 ' + T('Ejemplo en contexto', 'Example in context')));
      var sent = el('p', 'fc-sent'); sent.lang = 'zh-CN';
      info.toks.forEach(function (t) {
        var s = el('span', 'fc-tk' + (t.py ? '' : ' pu')), tx;
        s.appendChild(el('small', null, t.py || ' '));
        if (t.zh === zh && cloze) tx = el('span', 'fc-gap', '＿＿＿');
        else if (t.zh === zh) tx = el('mark', 'fc-mark', t.zh);
        else tx = el('span', null, t.zh);
        s.appendChild(tx); sent.appendChild(s);
      });
      cx.appendChild(sent);
      if (data.prefs.tr) {
        var tr = el('p', 'fc-trans'); tr.appendChild(el('small', null, T('Traducción de la oración', 'Sentence translation'))); tr.appendChild(document.createTextNode(es() ? info.es : info.en)); cx.appendChild(tr);
      }
      if (cloze) {
        var o = el('div', 'fc-opts');
        opts.forEach(function (op) {
          var bad = wrong.indexOf(op) >= 0, b = el('button', 'fc-opt' + (bad ? ' bad' : ''), op); b.type = 'button'; b.disabled = bad;
          b.addEventListener('click', function () { if (op === zh) { phase = 'revealed'; say(info.text); } else wrong.push(op); render(); });
          o.appendChild(b);
        });
        cx.appendChild(o);
      } else {
        var wh = el('div', 'fc-where'), v = el('button', 'fc-pill', '📍 ' + T('Ver en la casa', 'See in the house')); v.type = 'button';
        v.addEventListener('click', function () { close(); ctx.show(zh); }); wh.appendChild(v); cx.appendChild(wh);
      }
      box.appendChild(cx);

      // calificación con la vista previa del próximo repaso
      if (!cloze) {
        var rt = el('div', 'fc-rating'), sug = wrong.length ? 'again' : 'good', now = Date.now();
        [['again', '😟', T('Otra vez', 'Again')], ['good', '😐', T('Bien', 'Good')], ['easy', '😄', T('Fácil', 'Easy')]].forEach(function (r) {
          var b = el('button', 'fc-rt ' + r[0] + (r[0] === sug ? ' sug' : '')); b.type = 'button';
          b.appendChild(el('span', 'f', r[1]));
          var sp = el('span'); sp.appendChild(el('strong', null, r[2])); sp.appendChild(el('small', null, fmt(scheduleCard(st || {}, r[0], now).due - now, T))); b.appendChild(sp);
          b.addEventListener('click', function () { rate(r[0]); });
          rt.appendChild(b);
        });
        box.appendChild(rt);
      }
    }

    function rate(r) {
      var now = Date.now(), ns = scheduleCard(data.states[cur] || {}, r, now);
      data.states[cur] = ns; stats[r]++; persist();
      queue.shift();
      var at = requeueIndex(ns, now, queue.length);
      if (at >= 0) queue.splice(at, 0, cur); else finished++;
      if (queue.length) { begin(); render(); say(parse(cur).text); } else render();
    }

    if (queue.length) begin();
    render();
    if (queue.length) setTimeout(function () { say(parse(cur).text); }, 300);
    box.parentNode.scrollTop = 0;
  }

  window.LabelCards = { open: open, isSaved: isSaved, setSaved: setSaved, saveMany: saveMany, hasSentence: hasSentence, dueCount: dueCount, savedCount: function () { return savedList().length; }, onChange: function (f) { listeners.push(f); }, scheduleCard: scheduleCard };
})();
