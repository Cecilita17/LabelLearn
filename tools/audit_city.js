// Auditoría visual y de rendimiento local. Requiere servidor en BASE_URL.
// python3 -m http.server 8000; node tools/audit_city.js /tmp/labellearn-audit
var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var chromium = require('playwright').chromium;
var output = path.resolve(process.argv[2] || '/tmp/labellearn-audit');
var url = process.env.BASE_URL || 'http://127.0.0.1:8000/';
var report = { resolutions:[], selection:[], performance:[], errors:[], audio:null };
fs.mkdirSync(output, { recursive:true });
function save() { fs.writeFileSync(path.join(output, 'audit.json'), JSON.stringify(report, null, 2)); }
async function main() {
  var options = { headless:true, chromiumSandbox:true };
  if (process.env.CHROMIUM_PATH) options.executablePath = process.env.CHROMIUM_PATH;
  else if (fs.existsSync('/usr/bin/chromium')) options.executablePath = '/usr/bin/chromium';
  var browser = await chromium.launch(options);
  try {
    for (var size of [[360,800],[390,800],[430,932],[768,1024]]) {
      var width = size[0], height = size[1], suffix = width + 'x' + height;
      var context = await browser.newContext({ viewport:{ width:width, height:height }, hasTouch:true, isMobile:width < 768, deviceScaleFactor:1 });
      await context.addInitScript(function () {
        // Se observa la API original; la pronunciación sigue invocándose de verdad.
        window.audioCalls = [];
        var speak = speechSynthesis.speak.bind(speechSynthesis);
        speechSynthesis.speak = function (u) {
          var entry = { text:u.text, lang:u.lang, rate:u.rate, events:[] };
          u.addEventListener('start', function () { entry.events.push('start'); });
          u.addEventListener('error', function (e) { entry.events.push(e.error); });
          window.audioCalls.push(entry); return speak(u);
        };
      });
      var page = await context.newPage(); page.setDefaultTimeout(6000);
      page.on('pageerror', function (e) { report.errors.push(e.message); });
      page.on('console', function (m) { if (m.type() === 'error') report.errors.push(m.text()); });
      await page.goto(url + '#/city'); await page.waitForTimeout(600);
      var stored = await page.evaluate(function () { return localStorage.getItem('labellearn_flashcards_v1'); });
      async function shot(name) { await page.screenshot({ path:path.join(output, name + '-' + suffix + '.png') }); }
      async function reset() { await page.locator('[data-t="reset"]').tap(); await page.waitForTimeout(400); }
      async function search(q) {
        await page.locator('[data-t="search"]').tap(); await page.locator('.city-search input').fill(q);
        await page.locator('.city-search .s-item').first().tap(); await page.waitForTimeout(700);
      }
      var layout = await page.evaluate(function () {
        var buttons = Array.from(document.querySelectorAll('.iso-tools button'));
        return { overflow:document.documentElement.scrollWidth > innerWidth,
          controls:buttons.map(function (b) { var r=b.getBoundingClientRect(); var p=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2); return { tool:b.dataset.t, visible:r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight, reachable:!!p&&b.contains(p), width:r.width,height:r.height }; }),
          proportional:Math.abs(document.querySelector('.world').getScreenCTM().a-document.querySelector('.world').getScreenCTM().d)<.0001 };
      });
      assert.equal(layout.overflow, false); assert.ok(layout.proportional);
      assert.ok(layout.controls.every(function (b) { return b.visible && b.reachable; }));
      await shot('city-full'); await search('escuela');
      assert.equal(await page.locator('#shZh').textContent(), '学校');
      assert.equal(await page.locator('#shPy').textContent(), 'xuéxiào');
      assert.equal(await page.locator('#shTr').textContent(), 'Escuela');
      var card = await page.locator('.sheet-card').boundingBox();
      assert.ok(card.y>=0&&card.y+card.height<=height+.5&&card.x>=0&&card.x+card.width<=width+.5);
      await shot('city-card');
      await page.locator('#shPlay').tap(); await page.waitForTimeout(100);
      var audio = await page.evaluate(function () { return { voices:speechSynthesis.getVoices().map(function (v) { return {name:v.name,lang:v.lang}; }), calls:window.audioCalls }; });
      assert.ok(audio.calls.some(function (c) { return c.text==='学校'&&c.lang==='zh-CN'&&Math.abs(c.rate-.8)<.001; }));
      report.audio = audio;
      await page.locator('[data-lang="en"]').tap(); assert.equal(await page.locator('#shTr').textContent(), 'School');
      await page.locator('[data-lang="es"]').tap(); await page.locator('#shClose').tap();
      await shot('city-detail'); await page.locator('[data-t="lbl"]').tap();
      var labels = await page.evaluate(function () {
        var svg=document.querySelector('.iso-svg').getBoundingClientRect();
        var boxes=Array.from(document.querySelectorAll('.lbls .lbl')).filter(function (n) { return getComputedStyle(n).display!=='none'; }).map(function (n) { return n.getBoundingClientRect(); });
        var area=0, overlaps=0;
        boxes.forEach(function (r,i) { area+=Math.max(0,Math.min(r.right,svg.right)-Math.max(r.left,svg.left))*Math.max(0,Math.min(r.bottom,svg.bottom)-Math.max(r.top,svg.top));
          boxes.slice(i+1).forEach(function (q) { if(Math.min(r.right,q.right)-Math.max(r.left,q.left)>1&&Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top)>1)overlaps++; }); });
        return { displayed:boxes.length, viewportCoverage:area/(svg.width*svg.height),overlaps:overlaps };
      });
      await shot('city-labels'); assert.ok(labels.viewportCoverage<.35); assert.equal(labels.overlaps,0);
      await page.locator('[data-t="lbl"]').tap();
      await reset(); for (var i=0;i<6;i++) { await page.locator('[data-t="in"]').tap(); await page.waitForTimeout(240); }
      var edges=[];
      for (var delta of [[100000,100000],[-100000,100000],[100000,-100000],[-100000,-100000]]) {
        var point=await page.evaluate(function (delta) {
          var svg=document.querySelector('.iso-svg');
          svg.dispatchEvent(new PointerEvent('pointerdown',{pointerId:8,clientX:190,clientY:420,bubbles:true}));
          window.dispatchEvent(new PointerEvent('pointermove',{pointerId:8,clientX:delta[0],clientY:delta[1],bubbles:true}));
          window.dispatchEvent(new PointerEvent('pointerup',{pointerId:8,bubbles:true}));
          var box=svg.getBoundingClientRect(),m=svg.querySelector('.world').getScreenCTM().inverse();
          var p=new DOMPoint(box.x+box.width/2,box.y+box.height/2).matrixTransform(m),I=window.ISO;
          return { x:(p.x/I.A+p.y/I.B)/2,y:(p.y/I.B-p.x/I.A)/2 };
        },delta);
        assert.ok(point.x>=-.01&&point.x<=280.01&&point.y>=-.01&&point.y<=260.01, 'Centro fuera del terreno');edges.push(point);
      }
      await shot('city-camera-limit');
      await reset(); await search('LabelLearn'); await page.locator('#shHouse').tap(); await page.waitForTimeout(100);
      await page.locator('.city-entry').tap(); await page.waitForTimeout(600);
      assert.equal(await page.locator('.city .obj').count(),55);
      assert.equal(await page.evaluate(function () { return localStorage.getItem('labellearn_flashcards_v1'); }),stored);
      report.resolutions.push({ width:width,height:height,layout:layout,card:card,labels:labels,camera:edges,houseReturn:true,progressUntouched:true });
      save(); console.log('Visual OK '+suffix);
      if (width===390) {
        // Prueba de selección real de cada instancia, no solo de cada palabra.
        var items=await page.evaluate(function () { var s=window.LabelCityScene.create(); return s.items.filter(function (it) { return it.w; }).map(function (it) { return { id:it.w,word:s.cityWords[it.w].zh,anchor:it.o.a }; }); });
        for (var item of items) {
          await reset();
          var anchor=await page.evaluate(function (a) { var q=window.ISO.P(a[0],a[1],a[2]);var p=new DOMPoint(q[0],q[1]).matrixTransform(document.querySelector('.world').getScreenCTM());return {x:p.x,y:p.y}; },item.anchor);
          await page.mouse.move(anchor.x,anchor.y);
          for(i=0;i<6;i++){await page.mouse.wheel(0,-1);await page.waitForTimeout(25);}
          var hit=await page.evaluate(function (id) {
            var dot=document.querySelector('.dot[data-w="'+id+'"] .dot-core');
            if(dot){var r=dot.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};}
            var obj=document.querySelector('.obj[data-w="'+id+'"]'),r=obj.getBoundingClientRect(),svg=document.querySelector('.iso-svg').getBoundingClientRect();
            var x0=Math.max(svg.left,r.left),x1=Math.min(svg.right,r.right),y0=Math.max(svg.top,r.top),y1=Math.min(svg.bottom,r.bottom);
            for(var y=y0+1;y<y1;y+=Math.max(2,(y1-y0)/35))for(var x=x0+1;x<x1;x+=Math.max(2,(x1-x0)/35)){var n=document.elementFromPoint(x,y),o=n&&n.closest('[data-w]');if(o&&o.dataset.w===id&&(id==='crosswalk'?[[.5,0],[-.5,0],[0,.5],[0,-.5]]:[[2,0],[-2,0],[0,2],[0,-2]]).every(function(d){var e=document.elementFromPoint(x+d[0],y+d[1]),a=e&&e.closest('[data-w]');return a&&a.dataset.w===id;}))return{x:x,y:y};}
            return null;
          },item.id);
          assert.ok(hit,'Sin zona visible: '+item.id);await page.touchscreen.tap(hit.x,hit.y);await page.waitForTimeout(70);
          var selected=await page.locator('.obj.sel').getAttribute('data-w').catch(async function(e){await shot('selection-failed-'+item.id);throw e;});
          assert.equal(selected,item.id,'Selección: '+item.id); assert.equal(await page.locator('#shZh').textContent(),item.word);
          report.selection.push(item.id);if(report.selection.length%10===0){save();console.log('Selección '+report.selection.length+'/55');}await page.locator('#shClose').tap();
        }
        save();console.log('Selección OK: '+report.selection.length+' instancias');
        await reset();for(i=0;i<3;i++){await page.locator('[data-t="in"]').tap();await page.waitForTimeout(250);}
        var cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
        async function metrics(){var m=await cdp.send('Performance.getMetrics');return Object.fromEntries(m.metrics.map(function (v) { return [v.name,v.value]; }));}
        async function sample(kind,labelsOn){
          await page.evaluate(function () {
            window.auditPerf={frames:[],longTasks:[],worldMutations:0,labelMutations:0,dotMutations:0,running:true};
            var a=window.auditPerf,last=performance.now();
            function frame(t){if(!a.running)return;a.frames.push(t-last);last=t;requestAnimationFrame(frame);}requestAnimationFrame(frame);
            a.mo=new MutationObserver(function (ms) { ms.forEach(function (m) { if(m.target.closest('.world'))a.worldMutations++;else if(m.target.closest('.lbls'))a.labelMutations++;else if(m.target.closest('.dots'))a.dotMutations++; }); });
            a.mo.observe(document.querySelector('.iso-svg'),{attributes:true,childList:true,subtree:true});
            a.po=new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { a.longTasks.push(e.duration); }); });a.po.observe({type:'longtask'});
          });
          var before=await metrics();var domBefore=await cdp.send('Memory.getDOMCounters');var start=Date.now();
          if(kind==='pan'){
            await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:420,id:0}]});
            for(var n=0;n<90;n++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150+85*Math.sin(n/15),y:420+70*Math.cos(n/15),id:0}]});
          }else{
            await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:140,y:420,id:0},{x:240,y:420,id:1}]});
            for(var n=0;n<90;n++){var gap=50+20*Math.sin(n/15);await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190-gap,y:420,id:0},{x:190+gap,y:420,id:1}]});}
          }
          await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          var after=await metrics(),domAfter=await cdp.send('Memory.getDOMCounters');
          var frames=await page.evaluate(function () { var a=window.auditPerf;a.running=false;a.mo.disconnect();a.po.disconnect();return {frames:a.frames.slice(2),longTasks:a.longTasks,worldMutations:a.worldMutations,labelMutations:a.labelMutations,dotMutations:a.dotMutations}; });
          frames.frames.sort(function(a,b){return a-b;});var times=frames.frames;
          var result={ gesture:kind,labels:labelsOn,cpu:4,elapsedMs:Date.now()-start,frameCount:times.length,medianMs:times[Math.floor(times.length*.5)],p95Ms:times[Math.floor(times.length*.95)],maxMs:times[times.length-1],over34ms:times.filter(function(t){return t>34;}).length,longTasks:frames.longTasks,worldMutations:frames.worldMutations,labelMutations:frames.labelMutations,dotMutations:frames.dotMutations,domBefore:domBefore,domAfter:domAfter,heapBefore:before.JSHeapUsedSize,heapAfter:after.JSHeapUsedSize,scriptMs:(after.ScriptDuration-before.ScriptDuration)*1000,layoutMs:(after.LayoutDuration-before.LayoutDuration)*1000,styleMs:(after.RecalcStyleDuration-before.RecalcStyleDuration)*1000 };
          assert.equal(frames.worldMutations,0,'Geometría estática modificada durante gesto');report.performance.push(result);save();console.log('Perf '+kind+' labels='+labelsOn+' p95='+result.p95Ms);
        }
        await sample('pan',false);await sample('pinch',false);
        await page.locator('[data-t="lbl"]').tap();await sample('pan',true);await sample('pinch',true);
        await page.locator('[data-t="lbl"]').tap();await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
        await cdp.send('HeapProfiler.collectGarbage');var initialMemory=await cdp.send('Memory.getDOMCounters'),initialHeap=(await metrics()).JSHeapUsedSize;
        for(i=0;i<12;i++){await page.locator('#back').tap();await page.locator('.city-entry').tap();await page.waitForTimeout(480);}
        await cdp.send('HeapProfiler.collectGarbage');report.memory={cycles:12,before:initialMemory,after:await cdp.send('Memory.getDOMCounters'),heapBefore:initialHeap,heapAfter:(await metrics()).JSHeapUsedSize};save();
      }
      await context.close();
    }
    assert.deepEqual(report.errors,[]);report.passed=true;save();
  } finally { await browser.close(); }
}
main().catch(function (e) { report.passed=false;report.failure=e.stack;save();console.error(e);process.exitCode=1; });
