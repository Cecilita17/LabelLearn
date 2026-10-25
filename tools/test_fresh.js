// Prueba de todos los frescos, sus fichas, audio solicitado y puntos táctiles.
var fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),chromium=require('playwright').chromium;
var output=path.resolve(process.argv[2]||'/tmp/labellearn-fresh'),base=process.env.BASE_URL||'http://127.0.0.1:8000/';
var report={products:[],accessories:[],terms:[],resolutions:[],errors:[]};fs.mkdirSync(output,{recursive:true});
function save(){fs.writeFileSync(path.join(output,'result.json'),JSON.stringify(report,null,2));}
async function main(){
 var b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,chromiumSandbox:true});
 try{
  for(var size of [[390,800],[360,800],[430,932],[768,1024]]){
   var c=await b.newContext({viewport:{width:size[0],height:size[1]},hasTouch:true,isMobile:size[0]<768});
   await c.addInitScript(function(){window.pronunciations=[];var original=speechSynthesis.speak.bind(speechSynthesis);speechSynthesis.speak=function(u){window.pronunciations.push({text:u.text,lang:u.lang});return original(u);};});
   var p=await c.newPage();p.setDefaultTimeout(6000);p.on('pageerror',function(e){report.errors.push(e.message);});p.on('console',function(m){if(m.type()==='error')report.errors.push(m.text());});
   await p.goto(base+'#/supermarket');await p.waitForTimeout(600);var stored=await p.evaluate(function(){return localStorage.getItem('labellearn_flashcards_v1');});
   async function shot(n){await p.screenshot({path:path.join(output,n+'-'+size.join('x')+'.png')});}
   async function zone(id){await p.locator('.market-nav select').selectOption(id);await p.waitForTimeout(480);}
   async function item(id){await p.locator('.supermarket [data-t="search"]').tap();await p.locator('.market-panel input').fill('');await p.locator('.market-panel [data-id="'+id+'"]').tap();await p.waitForTimeout(700);}
   await shot('overview');var zones=await p.evaluate(function(){return window.SupermarketProducts.zones;});
   for(var z of zones){await zone(z);await shot(z);}
   if(size[0]===390){
    var catalog=await p.evaluate(function(){return window.SupermarketProducts.products.map(function(v){return Object.assign({},v,{wordData:window.SupermarketVocab[v.word]});});});assert.equal(catalog.length,75);
    for(var product of catalog){
     await item(product.id);assert.equal(await p.locator('.obj[data-w="'+product.id+'"]').isVisible(),true,'Producto renderizado '+product.id);assert.equal(await p.locator('#shZh').textContent(),product.wordData.zh);assert.equal(await p.locator('#shPy').textContent(),product.wordData.py);assert.equal(await p.locator('#shTr').textContent(),product.wordData.es);
     assert.equal(await p.locator('#shStar').isVisible(),false);
     var card=await p.locator('.sheet-card').boundingBox();assert.ok(card.y>=0&&card.y+card.height<=size[1]+.5);
     assert.ok(await p.locator('.cam').evaluate(function(n){return n.transform.baseVal.consolidate().matrix.a;})>=8.9);
     if(['watermelon','pineapple','croissant','salmon','cheese','frozen-pizza'].indexOf(product.model)>=0)await shot('detail-'+product.model);
     await p.locator('[data-lang="en"]').tap();assert.equal(await p.locator('#shTr').textContent(),product.wordData.en);await p.locator('[data-lang="es"]').tap();
     await p.locator('#shClose').tap();await p.waitForTimeout(300);var r=await p.locator('.dot[data-w="'+product.id+'"] .dot-core').boundingBox();assert.ok(r,'Punto '+product.id);
     await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);assert.equal(await p.locator('#shZh').textContent(),product.wordData.zh,product.id+' toque');assert.equal(await p.locator('#sheet').getAttribute('hidden'),null);await p.locator('#shClose').tap();
     report.products.push(product.id);if(report.products.length%15===0){save();console.log('Productos '+report.products.length+'/75');}
    }
    var accessoryIds=await p.evaluate(function(){var s=window.SupermarketScene.create();return Object.keys(s.marketMeta).filter(function(id){return window.SupermarketProducts.zones.indexOf(s.marketMeta[id].zone)>=0&&s.marketMeta[id].kind==='object'&&!window.SupermarketProducts.products.some(function(v){return v.id===id;});});});
    for(var id of accessoryIds){await item(id);assert.equal(await p.locator('#sheet').getAttribute('hidden'),null);report.accessories.push(id);await p.locator('#shClose').tap();}
    var terms=await p.evaluate(function(){return window.SupermarketProducts.terms.map(function(id){return window.SupermarketVocab[id];});});
    for(var term of terms){await p.locator('[data-t="search"]').tap();await p.locator('[data-mode="terms"]').tap();await p.locator('.market-panel [data-id="'+term.id+'"]').tap();assert.equal(await p.locator('#shZh').textContent(),term.zh);assert.equal(await p.locator('#shPy').textContent(),term.py);await p.locator('#shClose').tap();report.terms.push(term.id);}
    var calls=await p.evaluate(function(){return window.pronunciations;});for(var product of catalog)assert.ok(calls.some(function(q){return q.text===product.wordData.zh&&q.lang==='zh-CN';}));report.audio={voices:await p.evaluate(function(){return speechSynthesis.getVoices().length;}),requestsVerified:true};
   }
   await zone('produce');await p.locator('[data-t="lbl"]').tap();await shot('produce-labels');
   var labels=await p.evaluate(function(){var area=0,svg=document.querySelector('.iso-svg').getBoundingClientRect();var boxes=Array.from(document.querySelectorAll('.lbls .lbl')).filter(function(n){return getComputedStyle(n).display!=='none';}).map(function(n){return n.getBoundingClientRect();});boxes.forEach(function(r){area+=Math.max(0,Math.min(r.right,svg.right)-Math.max(r.left,svg.left))*Math.max(0,Math.min(r.bottom,svg.bottom)-Math.max(r.top,svg.top));});return {visible:boxes.length,coverage:area/(svg.width*svg.height),overflow:document.documentElement.scrollWidth>innerWidth};});assert.ok(labels.coverage<.35&&!labels.overflow);
   await p.locator('[data-t="lbl"]').tap();await p.locator('[data-t="reset"]').tap();await p.waitForTimeout(400);assert.equal(await p.locator('.market-nav select').inputValue(),'all');
   assert.equal(await p.evaluate(function(){return localStorage.getItem('labellearn_flashcards_v1');}),stored);
   await p.locator('#back').tap();await p.waitForTimeout(500);assert.equal(await p.locator('.city .obj').count(),55);
   report.resolutions.push({size:size,labels:labels,navigation:true,progressUntouched:true});save();await c.close();console.log('Resolución OK '+size.join('x'));
  }
  assert.deepEqual(report.errors,[]);report.passed=true;save();
 }finally{await b.close();}
}
main().catch(function(e){report.passed=false;report.failure=e.stack;save();console.error(e);process.exitCode=1;});
