// Integración local. Servidor externo: python3 -m http.server 8000.
var assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),chromium=require('playwright').chromium;
var output=path.resolve(process.argv[2]||'/tmp/labellearn-supermarket'),base=process.env.BASE_URL||'http://127.0.0.1:8000/';
var report={errors:[],resolutions:[],selected:[],actions:[],sectionCards:[]};fs.mkdirSync(output,{recursive:true});
function save(){fs.writeFileSync(path.join(output,'result.json'),JSON.stringify(report,null,2));}
async function main(){
 var b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,chromiumSandbox:true});
 try{
  for(var size of [[390,800],[360,800],[430,932],[768,1024]]){
   var c=await b.newContext({viewport:{width:size[0],height:size[1]},hasTouch:true,isMobile:size[0]<768});
   var p=await c.newPage();p.setDefaultTimeout(6000);p.on('pageerror',function(e){report.errors.push(e.message);});p.on('console',function(m){if(m.type()==='error')report.errors.push(m.text());});
   await p.goto(base+'#/city');await p.waitForTimeout(550);
   // El acceso real sale de la ficha del edificio existente.
   await p.locator('[data-t="search"]').tap();await p.locator('.city-search input').fill('supermercado');await p.locator('.city-search .s-item').tap();await p.waitForTimeout(700);
   await p.locator('#shSupermarket').tap();await p.waitForTimeout(550);
   var storage=await p.evaluate(function(){return localStorage.getItem('labellearn_flashcards_v1');});
   assert.equal(await p.locator('.supermarket .obj').count(),120);
   var suffix=size.join('x');
   async function shot(n){await p.screenshot({path:path.join(output,n+'-'+suffix+'.png')});}
   async function zone(id){await p.locator('.market-nav select').selectOption(id);await p.waitForTimeout(480);}
   async function item(id){await p.locator('.supermarket [data-t="search"]').tap();await p.locator('.market-panel input').fill('');await p.locator('.market-panel button[data-id="'+id+'"]').tap();await p.waitForTimeout(700);}
   await shot('overview');
   var layout=await p.evaluate(function(){return {overflow:document.documentElement.scrollWidth>innerWidth,controls:Array.from(document.querySelectorAll('.market-nav button,.market-nav select,.supermarket .iso-tools button')).every(function(n){var r=n.getBoundingClientRect(),a=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&!!a&&n.contains(a);})};});
   assert.ok(!layout.overflow&&layout.controls);
   await p.locator('[data-zone="checkout"]').tap();await p.waitForTimeout(500);await shot('traditional');
   await p.locator('[data-zone="selfcheckout"]').tap();await p.waitForTimeout(500);await shot('selfcheckout');
   await item('self-1-touchscreen');assert.equal(await p.locator('#shZh').textContent(),'触摸屏');assert.equal(await p.locator('#shPy').textContent(),'chùmōpíng');
   await p.locator('[data-lang="en"]').tap();assert.equal(await p.locator('#shTr').textContent(),'Touchscreen');await p.locator('[data-lang="es"]').tap();
   var card=await p.locator('.sheet-card').boundingBox();assert.ok(card.y>=0&&card.y+card.height<=size[1]+.5);await shot('object-card');
   await p.locator('#shClose').tap();
   await p.locator('.supermarket [data-t="lbl"]').tap();await shot('labels');
   var labels=await p.evaluate(function(){var svg=document.querySelector('.iso-svg').getBoundingClientRect(),area=0;var visible=Array.from(document.querySelectorAll('.lbls .lbl')).filter(function(n){return getComputedStyle(n).display!=='none';});visible.forEach(function(n){var r=n.getBoundingClientRect();area+=Math.max(0,Math.min(r.right,svg.right)-Math.max(r.left,svg.left))*Math.max(0,Math.min(r.bottom,svg.bottom)-Math.max(r.top,svg.top));});return {count:visible.length,coverage:area/(svg.width*svg.height)};});assert.ok(labels.coverage<.35);
   await p.locator('.supermarket [data-t="lbl"]').tap();
   if(size[0]===390){
    var zones=await p.evaluate(function(){return window.SupermarketLayout.zones.map(function(z){return z.id;});});for(var id of zones){await zone(id);await p.locator('.market-nav [data-caption]').tap();assert.equal(await p.locator('#shZh').textContent(),await p.evaluate(function(id){return window.SupermarketVocab[id].zh;},id));await p.locator('#shClose').tap();report.sectionCards.push(id);}
    var components=await p.evaluate(function(){var s=window.SupermarketScene.create();return Object.keys(s.marketMeta).filter(function(id){return s.marketMeta[id].kind==='object';}).map(function(id){return{id:id,zh:s.marketWords[id].zh};});});
    for(var component of components){
     await item(component.id);assert.equal(await p.locator('#shZh').textContent(),component.zh,component.id);
     // Tras el enfoque se vuelve a tocar su punto físico, no solo la lista.
     var dot=p.locator('.dot[data-w="'+component.id+'"] .dot-core');
     if(await dot.count()){await p.locator('#shClose').tap();await p.waitForTimeout(320);var rect=await dot.boundingBox();assert.ok(rect,'Punto visible '+component.id);await p.touchscreen.tap(rect.x+rect.width/2,rect.y+rect.height/2);assert.equal(await p.locator('#shZh').textContent(),component.zh,component.id+' punto');}
     assert.equal(await p.locator('#sheet').getAttribute('hidden'),null);
     await p.locator('#shClose').tap();report.selected.push(component.id);if(report.selected.length%15===0){save();console.log('Seleccionados '+report.selected.length+'/'+components.length);}
    }
    await p.locator('[data-actions]').tap();var actions=await p.locator('.market-panel .s-item').count();assert.equal(actions,11);
    var actionIds=await p.locator('.market-panel .s-item').evaluateAll(function(ns){return ns.map(function(n){return n.dataset.id;});});
    for(var a of actionIds){await p.locator('.market-panel .s-item[data-id="'+a+'"]').tap();assert.equal(await p.locator('#shStar').isVisible(),false);report.actions.push(a);await p.locator('#shClose').tap();await p.locator('[data-actions]').tap();}
    await p.locator('.market-panel .s-back').tap();
    // Gestos verdaderos de CDP en una sección, con CPU 4×.
    await zone('checkout');var cd=await c.newCDPSession(p);await cd.send('Emulation.setCPUThrottlingRate',{rate:4});
    var before=await p.locator('.cam').getAttribute('transform');await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:120,y:400,id:0}]});for(var n=1;n<=12;n++)await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:120+n*5,y:400+n*2,id:0}]});await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.notEqual(await p.locator('.cam').getAttribute('transform'),before);
    var old=await p.locator('.cam').evaluate(function(e){return e.transform.baseVal.consolidate().matrix.a;});
    await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:420,id:0},{x:220,y:460,id:1}]});await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:110,y:390,id:0},{x:260,y:490,id:1}]});await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(await p.locator('.cam').evaluate(function(e){return e.transform.baseVal.consolidate().matrix.a;})>old);await cd.send('Emulation.setCPUThrottlingRate',{rate:1});
    await p.locator('.supermarket [data-t="reset"]').tap();await p.waitForTimeout(400);assert.equal(await p.locator('.cam').evaluate(function(e){return e.transform.baseVal.consolidate().matrix.a;}),1);assert.equal(await p.locator('.market-nav select').inputValue(),'all');
   }
   assert.equal(await p.evaluate(function(){return localStorage.getItem('labellearn_flashcards_v1');}),storage);
   await p.locator('#back').tap();await p.waitForTimeout(550);assert.equal(await p.locator('.city .obj').count(),55);
   await p.locator('#back').tap();await p.waitForTimeout(100);assert.equal(await p.locator('.house .tile').count(),13);
   report.resolutions.push({size:size,layout:layout,labels:labels,card:card,cityReturn:true,houseReturn:true});save();console.log('OK '+suffix);await c.close();
  }
  assert.deepEqual(report.errors,[]);report.passed=true;save();
 }finally{await b.close();}
}
main().catch(function(e){report.passed=false;report.error=e.stack;save();console.error(e);process.exitCode=1;});
