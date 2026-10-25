// Cobertura del catálogo, referencias SVG, no duplicación y protección de la primera etapa.
var fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
var root=path.resolve(__dirname,'..');global.window={};
['iso','supermarket-vocab','supermarket-products','supermarket-layout','supermarket-geometry','supermarket-fresh-geometry','supermarket-fresh-scene','supermarket-scene'].forEach(function(n){require(path.join(root,n+'.js'));});
var P=window.SupermarketProducts,V=window.SupermarketVocab,s=window.SupermarketScene.create(),models={},words={};
var counts={produce:30,bakery:11,butcher:8,fish:7,deli:5,dairy:7,eggs:1,frozen:6};
Object.keys(counts).forEach(function(z){assert.equal(P.products.filter(function(p){return p.zone===z;}).length,counts[z],z);});
assert.equal(P.products.length,75);assert.equal(Object.keys(V).length,174);assert.equal(P.terms.length,12);
P.products.forEach(function(p){assert.ok(!models[p.model]);models[p.model]=true;assert.ok(V[p.word]);var it=s.items.find(function(it){return it.w===p.id;});assert.ok(it&&it.svg.includes('#pf-'+p.model),p.id);assert.equal(s.marketMeta[p.id].zone,p.zone);assert.equal(s.marketWords[p.id].id,p.word);});
Object.keys(V).forEach(function(id){var w=V[id];assert.ok(!words[w.zh],'Hanzi duplicado '+w.zh);words[w.zh]=id;assert.ok(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(w.py),'Pinyin: '+id);});
assert.equal(P.products.find(function(p){return p.model==='cheese';}).word,P.products.find(function(p){return p.model==='cheese-block';}).word);
var svg=s.items.map(function(it){return it.svg;}).join('')+window.ISO.defs.join('');
var defined=new Set(Array.from(svg.matchAll(/\bid="([^"]+)"/g),function(m){return m[1];}));
Array.from(svg.matchAll(/href="#([^"]+)"/g)).forEach(function(m){assert.ok(defined.has(m[1]),'Referencia: '+m[1]);});
var snapshot=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/supermarket-protected.json'),'utf8')),protectedItems=snapshot.objects;
Object.keys(snapshot.vocabulary).forEach(function(id){assert.equal(crypto.createHash('sha256').update(JSON.stringify(V[id])).digest('hex'),snapshot.vocabulary[id],'Vocabulario previo: '+id);});
Object.keys(protectedItems).forEach(function(id){var it=s.items.find(function(it){return it.w===id;});assert.ok(it,id);var hash=crypto.createHash('sha256').update(JSON.stringify([it.k,it.o,it.svg,s.marketMeta[id],V[id]||null])).digest('hex');assert.equal(hash,protectedItems[id],'Cambió un objeto protegido: '+id);});
console.log('OK: 75 productos, 174 términos sin Hanzi duplicados, 12 envases/medidas, '+Object.keys(protectedItems).length+' objetos originales idénticos.');
