// Interacciones urbanas; las habitaciones y su buscador mantienen su vocabulario.
(function () {
  function mount(view,ctx) {
    var host=document.createElement('div'); host.className='iso city'; view.appendChild(host);
    var scene=window.LabelCityScene.create(), words=scene.cityWords;
    var hint=document.createElement('div'); hint.className='city-hint';
    var ov=document.createElement('div'); ov.className='search city-search'; ov.hidden=true;
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-label','Explorar la ciudad');
    ov.innerHTML='<div class="s-top"><button type="button" class="s-back" aria-label="Cerrar búsqueda">‹</button><input type="search" aria-label="Buscar en la ciudad" autocomplete="off"></div><div class="s-hint"></div><div class="s-list"></div>';
    view.appendChild(ov);
    var input=ov.querySelector('input'),list=ov.querySelector('.s-list'),previous=null;
    function close(){ov.hidden=true;if(previous&&previous.isConnected)previous.focus();}
    function norm(t){return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
    function results(){
      list.innerHTML='';var q=norm(input.value.trim()),seen={};
      Object.keys(words).forEach(function(id){var w=words[id];if(seen[w.id])return;seen[w.id]=true;
        if(q&&norm([w.zh,w.py,w.es,w.en].join(' ')).indexOf(q)<0)return;
        var btn=document.createElement('button');btn.type='button';btn.className='s-item';btn.dataset.id=id;
        var zh=document.createElement('b');zh.textContent=w.zh;
        var text=document.createElement('span');text.textContent=' '+w.py+' · '+ctx.tr(w);
        btn.appendChild(zh);btn.appendChild(text);list.appendChild(btn);
      });
      ov.querySelector('.s-hint').textContent=list.children.length+' '+(ctx.lang()==='en'?'places and objects':'lugares y objetos');
    }
    var iso=window.IsoView.mount(host,scene,{
      title:'城市 · Ciudad',onSearch:function(){ctx.closeSheet();previous=document.activeElement;results();ov.hidden=false;input.focus();},
      onSelect:function(id){var w=words[id];if(w)ctx.openSheet(Object.assign({},w,{cityHome:id==='home'||id.indexOf('home-')===0}),true);},
      onDeselect:ctx.closeSheet,isCore:function(){return true;},
      labelLines:function(id){var w=words[id],lines=[w.zh];if(ctx.prefs.pinyin)lines.push(w.py);if(ctx.prefs.trans)lines.push(ctx.tr(w));return lines;}
    });
    // IsoView reemplaza el contenido del host al montar.
    host.appendChild(hint);
    ov.querySelector('button').addEventListener('click',close);
    input.addEventListener('input',results);
    input.addEventListener('keydown',function(e){if(e.key==='Escape')close();if(e.key==='Enter'){var b=list.querySelector('button');if(b)b.click();}});
    list.addEventListener('click',function(e){var b=e.target.closest('button[data-id]');if(b){close();iso.find(b.dataset.id);}});
    function refresh(){
      hint.textContent=ctx.lang()==='en'?'Drag to explore · Pinch to zoom':'Arrastrá para explorar · Pellizcá para acercar';
      input.placeholder=ctx.lang()==='en'?'Chinese, pinyin or English':'Chino, pinyin o español';
      host.querySelector('[data-t="search"]').setAttribute('aria-label',ctx.lang()==='en'?'Search the city':'Buscar en la ciudad');
      if(!ov.hidden)results();refreshLabels();
    }
    var refreshLabels=iso.refreshLabels;
    // Exponer la misma interfaz de las habitaciones, con preferencias urbanas.
    refresh();iso.refreshLabels=refresh;
    return iso;
  }
  window.LabelCityView={mount:mount};
})();
