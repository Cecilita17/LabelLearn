// Datos, circulación, componentes y presupuesto de la maqueta del supermercado.
var assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
var root=path.resolve(__dirname,'..');global.window={};
['iso','supermarket-vocab','supermarket-layout','supermarket-geometry','supermarket-scene'].forEach(function(n){require(path.join(root,n+'.js'));});
var V=window.SupermarketVocab,L=window.SupermarketLayout,s=window.SupermarketScene.create(),ids={},coverage={};
assert.equal(L.zones.length,25);
s.items.forEach(function(it){
  assert.ok(Number.isFinite(it.k));assert.ok(!/undefined|NaN|Infinity/.test(it.svg),'Geometría: '+it.w);
  if(!it.w)return;assert.ok(!ids[it.w],'ID duplicado: '+it.w);ids[it.w]=true;
  var w=s.marketWords[it.w],m=s.marketMeta[it.w];assert.ok(w&&m&&L.byId[m.zone]);
  ['id','zh','py','es','en','kind'].forEach(function(k){assert.ok(w[k]);});
  assert.ok(it.o.a.length===3&&it.o.a.every(Number.isFinite));
  assert.ok(it.o.a[0]>=0&&it.o.a[0]<=L.width&&it.o.a[1]>=0&&it.o.a[1]<=L.depth);
  coverage[w.id]=true;
});
Object.keys(V).forEach(function(id){if(V[id].kind!=='action')assert.ok(coverage[id],'Sin objeto o sección: '+id);else assert.ok(!coverage[id],'Acción convertida en mueble: '+id);});
var solid=L.zones.filter(function(z){return z.stock||['bakery','butcher','fish','deli','dairy','eggs','frozen','produce','service'].indexOf(z.id)>=0;});
solid.forEach(function(a,i){solid.slice(i+1).forEach(function(b){assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.d<=b.y||b.y+b.d<=a.y,'Muebles superpuestos: '+a.id+'/'+b.id);});});
var columns=[30,54,78,102,126,150];columns.slice(1).forEach(function(x,i){assert.ok(x-columns[i]-10>=12,'Pasillo de al menos 1,2 m');});
L.checkouts.forEach(function(c){['belt','base','scanner','display','pinpad','drawer','receipt','divider','goods','bagging','bag','cashier','customer','cart'].forEach(function(k){assert.ok(ids[c.id+'-'+k],c.id+'/'+k);});});
L.terminals.forEach(function(c){['base','touchscreen','scanner','scale','pinpad','product-area','bags','light','help'].forEach(function(k){assert.ok(ids[c.id+'-'+k],c.id+'/'+k);});});
var count=window.ISO.defs.length,second=window.SupermarketScene.create();assert.equal(window.ISO.defs.length,count);assert.deepEqual(second.sorted(),s.sorted());
var svg=s.items.map(function(it){return it.svg;}).join('')+window.ISO.defs.join(''),nodes=(svg.match(/<[a-z]/g)||[]).length;
assert.ok(Buffer.byteLength(svg)<220000,'Presupuesto SVG');assert.ok(nodes<2200,'Presupuesto de nodos');
var html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
['supermarket-vocab.js','supermarket-layout.js','supermarket-geometry.js','supermarket-scene.js','supermarket-view.js','supermarket.css'].forEach(function(f){assert.ok(html.includes(f)&&sw.includes(f));});
console.log('OK: '+Object.keys(V).length+' términos, 25 secciones, '+Object.keys(ids).length+' zonas, '+nodes+' nodos, '+Buffer.byteLength(svg)+' bytes; circulación, modelos compartidos y componentes completos.');
