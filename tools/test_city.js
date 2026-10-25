// Prueba de integración local: requiere Playwright y Chromium instalados.
// node tools/test_city.js [directorio de capturas]
// No publica ni escribe progreso en el navegador personal.
var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var http = require('node:http');
var chromium = require('playwright').chromium;
var root = path.resolve(__dirname, '..');
var output = path.resolve(process.argv[2] || '/tmp/labellearn-city-test');
var errors = [];
var phase = 'configuration';
var size = (process.env.VIEWPORT || '390x800').match(/^(\d+)x(\d+)$/);
if (!size || +size[1] < 320 || +size[2] < 400) throw new Error('VIEWPORT debe ser ancho x alto, por ejemplo 390x800');
var viewport = { width:+size[1], height:+size[2] };
var suffix = viewport.width + 'x' + viewport.height;
var port = +(process.env.TEST_PORT || 8000);
var server = http.createServer(function (req, res) {
  var name = decodeURIComponent(req.url.split('?')[0]);
  var file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, function (error, data) {
    if (error) { res.writeHead(404); res.end(); return; }
    var types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webmanifest':'application/manifest+json' };
    res.setHeader('Content-Type', types[path.extname(file)] || 'text/plain'); res.end(data);
  });
});
async function main() {
  fs.mkdirSync(output, { recursive:true });
  phase = 'local-server';
  await new Promise(function (resolve, reject) { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  var options = { headless:true, chromiumSandbox:true, timeout:15000 };
  if (process.env.CHROMIUM_PATH) options.executablePath = process.env.CHROMIUM_PATH;
  else if (fs.existsSync('/usr/bin/chromium')) options.executablePath = '/usr/bin/chromium';
  var browser;
  try {
    phase = 'chromium-launch';
    browser = await chromium.launch(options);
    phase = 'browser-tests';
    var context = await browser.newContext({ viewport:viewport, hasTouch:true, isMobile:viewport.width < 768, deviceScaleFactor:1 });
    var page = await context.newPage();
    page.on('pageerror', function (error) { errors.push(error.message); });
    page.on('console', function (message) { if (message.type() === 'error') errors.push(message.text()); });
    page.setDefaultTimeout(6000);
    await page.goto('http://127.0.0.1:' + port + '/');
    await page.locator('.city-entry').tap();
    await page.waitForTimeout(650);
    await page.screenshot({ path:path.join(output, 'city-full-' + suffix + '.png') });
    assert.equal(await page.locator('.city .obj').count(), 55);
    await page.locator('.obj[data-w="hospital"] text').tap();
    assert.equal(await page.locator('#shZh').textContent(), '医院');
    await page.locator('#shClose').tap();
    async function reset() { await page.locator('[data-t="reset"]').tap(); await page.waitForTimeout(400); }
    async function search(text) {
      await page.locator('[data-t="search"]').tap();
      await page.locator('.city-search input').fill(text);
      await page.locator('.city-search .s-item').first().tap();
      await page.waitForTimeout(700);
    }
    await search('escuela');
    assert.equal(await page.locator('#shZh').textContent(), '学校');
    await page.locator('#shClose').tap();
    await page.screenshot({ path:path.join(output, 'city-detail-' + suffix + '.png') });
    await page.locator('[data-t="lbl"]').tap();
    assert.ok(await page.locator('.lbls .lbl').count() > 0);
    await page.locator('[data-lang="en"]').tap();
    assert.ok((await page.locator('#roomTitle').textContent()).includes('City'));
    await page.locator('[data-lang="es"]').tap();
    await page.locator('[data-t="lbl"]').tap();
    await search('cesto');
    await page.locator('#shClose').tap();
    await page.waitForTimeout(400);
    await page.locator('.dot[data-w="bin-park"] .dot-core').tap();
    assert.equal(await page.locator('#shZh').textContent(), '垃圾桶');
    await page.locator('#shClose').tap();
    await reset();
    for (var i = 0; i < 4; i++) { await page.locator('[data-t="in"]').tap(); await page.waitForTimeout(250); }
    function scale() { return page.locator('.cam').evaluate(function (n) { return n.transform.baseVal.consolidate().matrix.a; }); }
    assert.ok(await scale() > 4, 'La ciudad debe superar el límite de zoom de las habitaciones');
    var before = await page.locator('.cam').getAttribute('transform');
    var cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate:4 });
    async function touch(type, points) { await cdp.send('Input.dispatchTouchEvent', { type:type, touchPoints:points }); }
    await touch('touchStart', [{ x:190,y:420,id:0 }]);
    for (i = 1; i <= 12; i++) await touch('touchMove', [{ x:190+i*6,y:420+i*3,id:0 }]);
    await touch('touchEnd', []);
    assert.notEqual(await page.locator('.cam').getAttribute('transform'), before, 'Arrastre táctil');
    var oldScale = await scale();
    await touch('touchStart', [{ x:170,y:410,id:0 }, { x:220,y:450,id:1 }]);
    await touch('touchMove', [{ x:130,y:380,id:0 }, { x:260,y:480,id:1 }]);
    await touch('touchEnd', []);
    assert.ok(await scale() > oldScale, 'Pellizco táctil');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate:1 });
    await reset(); assert.equal(await scale(), 1);
    await search('LabelLearn');
    await page.locator('#shHouse').tap();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.house .tile').count(), 13);
    var rooms = await page.evaluate(function () { return window.LABELLEARN_ROOMS.map(function (r) { return r.id; }); });
    for (var id of rooms) {
      await page.locator('.tile[data-room="' + id + '"]').tap();
      await page.waitForTimeout(500);
      assert.ok(await page.locator('.iso-svg .obj').count() > 0, id);
      await page.locator('[data-t="search"]').tap();
      await page.locator('.search .s-item').first().tap();
      await page.waitForTimeout(700);
      assert.equal(await page.locator('#sheet').getAttribute('hidden'), null, id + ': ficha');
      await page.locator('#shClose').tap();
      await page.locator('#back').tap();
      await page.waitForTimeout(50);
    }
    assert.deepEqual(errors, [], 'Consola sin errores');
    fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify({ viewport:viewport, hasTouch:true, buildings:13, vocabulary:38, interactive:55, rooms:rooms.length, errors:errors, passed:true }, null, 2));
    console.log('OK: ciudad, zoom, arrastre, pellizco, objeto pequeño, fichas, preferencias y 13 escenas. Capturas: ' + output);
  } finally { if (browser) await browser.close(); server.close(); }
}
main().catch(function (error) {
  fs.mkdirSync(output, { recursive:true });
  fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify({ passed:false, phase:phase, viewport:viewport, error:error.message, code:error.code || null, screenshots:fs.readdirSync(output).filter(function (f) { return f.endsWith('.png'); }) }, null, 2));
  console.error(error); server.close(); process.exitCode = 1;
});
