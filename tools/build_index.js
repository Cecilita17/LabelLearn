// Genera search-index.js: para cada palabra, las habitaciones donde aparece de verdad en una escena.
// Uso: node tools/build_index.js   (volver a correrlo al cambiar o agregar escenas)
const fs = require('fs'), path = require('path'), root = path.resolve(__dirname, '..');
global.window = {};
['data.js', 'iso.js'].forEach(f => require(path.join(root, f)));
fs.readdirSync(root).filter(f => /^scene-.*\.js$/.test(f)).sort().forEach(f => require(path.join(root, f)));
const rooms = window.LABELLEARN_ROOMS, index = {};
rooms.forEach(r => {
  const make = window.LABELLEARN_SCENES[r.id];
  if (!make) return;
  const own = new Set(); r.cols.forEach(col => col.forEach(c => c && own.add(c[1])));
  const seen = new Set(make(window.ISO).items.filter(i => i.w).map(i => i.w));
  seen.forEach(w => { (index[w] = index[w] || []).push({ id: r.id, own: own.has(w) }); });
});
const out = {};
Object.keys(index).sort().forEach(w => { out[w] = index[w].sort((a, b) => (b.own - a.own)).map(x => x.id); });
fs.writeFileSync(path.join(root, 'search-index.js'), '// GENERADO por tools/build_index.js – no editar a mano.\n// palabra -> habitaciones donde aparece (primero aquellas donde es vocabulario propio).\nwindow.LABELLEARN_INDEX = ' + JSON.stringify(out) + ';\n');
const multi = Object.keys(out).filter(w => out[w].length > 1).length;
console.log(Object.keys(out).length + ' palabras indexadas, ' + multi + ' en más de una habitación');
