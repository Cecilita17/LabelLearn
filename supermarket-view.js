// Tres niveles: plano, sección y objeto. Las acciones tienen su propia lista.
(function () {
  function mount(view,ctx) {
    var L=window.SupermarketLayout,V=window.SupermarketVocab,scene=window.SupermarketScene.create();
    var productIds={};window.SupermarketProducts.products.forEach(function(p){productIds[p.id]=true;});
    var words=scene.marketWords,meta=scene.marketMeta,current='all',mode='sections',previous=null,firstLabel={};
    Object.keys(meta).forEach(function(id){var m=meta[id],key=m.zone+'/'+words[id].id;if(m.kind==='object'&&!firstLabel[key])firstLabel[key]=id;});
    var nav=document.createElement('nav');nav.className='market-nav';nav.setAttribute('aria-label','Explorar supermercado');
    nav.innerHTML='<div class="market-zone-row"><button type="button" data-caption aria-label="Ficha de la sección"></button><select aria-label="Sección del supermercado"></select></div><div class="market-shortcuts"><button type="button" data-zone="all"></button><button type="button" data-zone="checkout"></button><button type="button" data-zone="selfcheckout"></button><button type="button" data-actions></button></div>';
    view.appendChild(nav);
    var select=nav.querySelector('select');
    var host=document.createElement('div');host.className='iso supermarket overview';view.appendChild(host);
    var panel=document.createElement('div');panel.className='search market-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Explorar supermercado');
    panel.innerHTML='<div class="s-top"><button type="button" class="s-back" aria-label="Cerrar">‹</button><input type="search" aria-label="Buscar vocabulario" autocomplete="off"></div><div class="market-tabs"><button type="button" data-mode="sections"></button><button type="button" data-mode="objects"></button><button type="button" data-mode="actions"></button><button type="button" data-mode="terms"></button></div><p class="s-hint"></p><div class="s-list"></div>';
    view.appendChild(panel);
    var input=panel.querySelector('input'),list=panel.querySelector('.s-list');
    function T(es,en){return ctx.lang()==='en'?en:es;}
    function caption(){var b=nav.querySelector('[data-caption]');b.disabled=current==='all';b.textContent=current==='all'?T('Plano general · Elegí una sección','Overview · Choose a section'):ctx.tr(V[current])+' ⓘ';b.setAttribute('aria-label',current==='all'?T('Plano general','Overview'):T('Ver ficha: ','View card: ')+ctx.tr(V[current]));}
    function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘'\s]/g,'');}
    function closePanel(){panel.hidden=true;if(previous&&previous.isConnected)previous.focus();}
    function scopedDots(){
      Array.prototype.forEach.call(host.querySelectorAll('.dot'),function(dot){var m=meta[dot.dataset.w];dot.style.display=m&&m.zone===current?'':'none';});
    }
    function activate(zone,move,keepSelection){
      current=zone;select.value=zone;host.classList.toggle('overview',zone==='all');if(!keepSelection)ctx.closeSheet();scopedDots();iso.refreshLabels();
      if(move){if(zone==='all')iso.reset();else {var z=L.byId[zone];iso.focus([z.x+z.w/2,z.y+z.d/2,8],z.zoom);}}
      caption();
    }
    function labels(id){
      var m=meta[id],w=words[id];if(!m||!w)return null;
      if(current==='all'&&m.kind!=='section')return null;
      if(current!=='all'&&(m.zone!==current||m.kind==='section'||firstLabel[current+'/'+w.id]!==id))return null;
      var lines=[w.zh];if(ctx.prefs.pinyin)lines.push(w.py);if(ctx.prefs.trans)lines.push(ctx.tr(w));return lines;
    }
    function openPanel(which){ctx.closeSheet();previous=document.activeElement;mode=which||'objects';input.value='';render();panel.hidden=false;input.focus();}
    var iso=window.IsoView.mount(host,scene,{
      findZoom:function(id){return productIds[id]?9:5.5;},
      title:'超市 · Supermercado',onSearch:function(){openPanel('objects');},
      onSelect:function(id){var m=meta[id];if(!m)return;
        if(m.kind==='section'){activate(m.zone,true);return;}
        if(current!==m.zone)activate(m.zone,false,true);
        ctx.openSheet(Object.assign({},words[id],{market:true}),true);
      },onDeselect:ctx.closeSheet,
      isCore:function(id){return meta[id].kind==='section';},labelLines:labels
    });
    function render(){
      var q=norm(input.value.trim());list.innerHTML='';
      Array.prototype.forEach.call(panel.querySelectorAll('[data-mode]'),function(b){b.setAttribute('aria-pressed',b.dataset.mode===mode);});
      var rows=[];
      if(mode==='actions')Object.keys(V).forEach(function(id){if(V[id].kind==='action')rows.push({id:id,w:V[id]});});
      else if(mode==='terms')window.SupermarketProducts.terms.forEach(function(id){rows.push({id:id,w:V[id]});});
      else Object.keys(meta).forEach(function(id){var m=meta[id];
        if(mode==='sections'&&m.kind==='section')rows.push({id:id,w:words[id]});
        if(mode==='objects'&&m.kind==='object')rows.push({id:id,w:words[id]});
      });
      rows.filter(function(row){return !q||norm([row.w.zh,row.w.py,row.w.es,row.w.en].join(' ')).indexOf(q)>=0;}).forEach(function(row){
        var btn=document.createElement('button');btn.type='button';btn.className='s-item';btn.dataset.id=row.id;
        var strong=document.createElement('b');strong.textContent=row.w.zh;
        var text=document.createElement('span');text.textContent=row.w.py+' · '+ctx.tr(row.w);
        btn.appendChild(strong);btn.appendChild(text);
        if(mode==='objects'){var small=document.createElement('small');var instance=row.id.match(/^(lane|self)-(\d)/);small.textContent=ctx.tr(V[meta[row.id].zone])+(instance?' · '+(instance[1]==='lane'?T('Caja ','Checkout '):T('Terminal ','Terminal '))+instance[2]:'');btn.appendChild(small);}
        list.appendChild(btn);
      });
      panel.querySelector('.s-hint').textContent=mode==='terms'?T('Envases y cantidades para comprar por peso o volumen.','Packaging and quantities for buying by weight or volume.'):mode==='actions'?T('Acciones y expresiones: no representan objetos en el plano.','Actions and phrases: these are not objects on the floor plan.'):T('Elegí una sección o un objeto para acercarte.','Choose a section or object to zoom in.');
    }
    select.addEventListener('change',function(){activate(select.value,true);});
    nav.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-caption')){if(current!=='all')ctx.openSheet(Object.assign({},V[current],{market:true}),false);return;}if(b.hasAttribute('data-actions'))openPanel('actions');else activate(b.dataset.zone,true);});
    host.querySelector('.iso-tools').addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b.dataset.t==='reset')activate('all',false);});
    panel.querySelector('.s-back').addEventListener('click',closePanel);
    panel.querySelector('.market-tabs').addEventListener('click',function(e){var b=e.target.closest('button');if(b){mode=b.dataset.mode;render();}});
    input.addEventListener('input',render);
    panel.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();closePanel();}if(e.key==='Enter'&&e.target===input){var first=list.querySelector('button');if(first)first.click();}});
    list.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var id=b.dataset.id;closePanel();
      if(mode==='actions'||mode==='terms')ctx.openSheet(Object.assign({},V[id],{market:true}),false);
      else if(meta[id].kind==='section')activate(meta[id].zone,true);
      else {activate(meta[id].zone,false);iso.find(id);}
    });
    var originalRefresh=iso.refreshLabels;
    function refresh(){
      var value=current;select.innerHTML='';var o=document.createElement('option');o.value='all';o.textContent=T('Todas las secciones','All departments');select.appendChild(o);
      L.zones.forEach(function(z){var o=document.createElement('option');o.value=z.id;o.textContent=ctx.tr(V[z.id]);select.appendChild(o);});select.value=value;
      caption();
      nav.querySelector('[data-zone="all"]').textContent=T('Plano','Overview');nav.querySelector('[data-zone="checkout"]').textContent=T('Cajas','Checkouts');
      nav.querySelector('[data-zone="selfcheckout"]').textContent=T('Autoservicio','Self-checkout');nav.querySelector('[data-actions]').textContent=T('Acciones','Actions');
      panel.querySelector('[data-mode="sections"]').textContent=T('Secciones','Departments');panel.querySelector('[data-mode="objects"]').textContent=T('Objetos','Objects');panel.querySelector('[data-mode="actions"]').textContent=T('Acciones','Actions');
      panel.querySelector('[data-mode="terms"]').textContent=T('Envases y medidas','Packs and measures');
      input.placeholder=T('Hanzi, pinyin o traducción','Hanzi, pinyin or translation');host.querySelector('[data-t="search"]').setAttribute('aria-label',T('Explorar supermercado','Explore supermarket'));
      if(!panel.hidden)render();scopedDots();originalRefresh();
    }
    iso.refreshLabels=refresh;refresh();
    return iso;
  }
  window.SupermarketView={mount:mount};
})();
