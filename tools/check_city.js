// Validaciones sin navegador: datos, IDs, geometría, cobertura y presupuesto SVG.
// Ejecutar: node tools/check_city.js
var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var root = path.resolve(__dirname, '..');
global.window = {};
['iso', 'city-vocab', 'city-map', 'city-geometry', 'city-scene'].forEach(function (f) { require(path.join(root, f + '.js')); });
var vocab = window.LabelCityVocab, scene = window.LabelCityScene.create();
var ids = {}, covered = {};
assert.equal(Object.keys(vocab).length, 38);
scene.items.forEach(function (it) {
  assert.ok(Number.isFinite(it.k));
  assert.ok(!/NaN|undefined|Infinity/.test(it.svg), 'Geometría inválida: ' + it.w);
  if (!it.w) return;
  assert.ok(!ids[it.w], 'ID duplicado: ' + it.w); ids[it.w] = true;
  var word = scene.cityWords[it.w];
  assert.ok(word, 'Sin vocabulario: ' + it.w);
  ['id','zh','py','es','en'].forEach(function (key) { assert.ok(word[key]); });
  assert.ok(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(word.py), 'Pinyin sin tonos: ' + word.id);
  assert.equal(it.o.a.length, 3);
  assert.ok(it.o.a.every(Number.isFinite));
  covered[word.id] = true;
});
Object.keys(vocab).forEach(function (id) { assert.ok(covered[id], 'Sin zona seleccionable: ' + id); });
window.LabelCityMap.buildings.forEach(function (o) {
  assert.ok(o.x > 0 && o.y > 0 && o.x + o.w < scene.W && o.y + o.d < scene.D);
  window.LabelCityMap.roadsX.forEach(function (r) { assert.ok(o.x + o.w <= r[0] || o.x >= r[1], 'Edificio en calle: ' + o.id); });
  window.LabelCityMap.roadsY.forEach(function (r) { assert.ok(o.y + o.d <= r[0] || o.y >= r[1], 'Edificio en calle: ' + o.id); });
});
var definitions = window.ISO.defs.length;
var again = window.LabelCityScene.create();
assert.equal(window.ISO.defs.length, definitions, 'Defs repetidas al volver a entrar');
assert.deepEqual(scene.sorted(), again.sorted(), 'La geometría estática debe ser determinista');
var svg = '<svg xmlns="http://www.w3.org/2000/svg"><defs>' + window.ISO.defs.join('') + '</defs>' + scene.sorted().map(function (it) { return it.svg; }).join('') + '</svg>';
var nodes = (svg.match(/<(polygon|path|rect|line|text|circle|g|use)\b/g) || []).length;
assert.ok(nodes < 2000, 'Presupuesto de nodos');
assert.ok(Buffer.byteLength(svg) < 230000, 'Presupuesto de geometría');
var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
var sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
['city-vocab','city-map','city-geometry','city-scene','city-view'].forEach(function (f) {
  assert.ok(html.includes('src="' + f + '.js"'));
  assert.ok(sw.includes("'" + f + ".js'"));
});
console.log('OK: 38 palabras, ' + Object.keys(ids).length + ' IDs únicos, ' + nodes + ' nodos, ' + Buffer.byteLength(svg) + ' bytes SVG.');
