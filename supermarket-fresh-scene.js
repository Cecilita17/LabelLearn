// Secciones ampliadas. Fixture, mercadería y vidrio se dibujan en capas explícitas.
(function () {
  function build(z,add,deco){
    var I=window.ISO,G=window.SupermarketGeometry,F=window.SupermarketFreshGeometry,V=window.SupermarketVocab;
    F.models();var list=window.SupermarketProducts.products.filter(function(p){return p.zone===z.id;}),x=z.x,y=z.y,w=z.w,d=z.d;
    var k=x+y+w/2+d/2,base='',glass='',slots=[];
    function accessory(id,word,svg,a,layer){add('fresh-'+z.id+'-'+id,word,z.id,k+(layer||.85),svg,a,true);}
    function slot(p,px,py,pz,number){
      var svg=F.use(p.model,px,py,pz);
      if(number>1)svg+=F.use(p.model,px,py+3.2,pz,.9);
      slots.push({p:p,svg:svg,a:[px+1.4,py+1.2,pz+1],k:k+.1+(py-y)*.002});
    }
    function scale(px,py,pz){return F.box(px,py,pz,4,4,.6,F.C.steel)+F.box(px+2.7,py,pz+.6,.4,1,2.7,'#91a9a0')+F.box(px+2,py,pz+3.1,2,.5,1.3,'#6d8b7e')+F.poly(I.planeY(py+.51,[[px+2.2,pz+3.4],[px+3.8,pz+3.4],[px+3.8,pz+4.2],[px+2.2,pz+4.2]]),'#dbe6cd');}
    if(z.id==='produce'){
      base=F.box(x,y,0,w,d,3.7,F.C.wood);
      list.forEach(function(p,i){var col=i%5,row=Math.floor(i/5),px=x+.7+col*4.1,py=y+.7+row*2.65,h=7.3-row*.5;
        base+=F.box(px,py,3.7,4,2.5,h-3.7,'#a9a17c')+F.use('crate',px,py,h);
        var svg=F.use(p.model,px+.5,py+.25,h+.35,.9);
        if(['apple','orange','mandarin','pear','potato','onion','tomato','garlic','lemon'].indexOf(p.model)>=0)svg+=F.use(p.model,px+1.8,py+.9,h+.35,.6);
        svg+=F.use('price-'+(i%3),px,py+2.4,h+.5);
        slots.push({p:p,svg:svg,a:[px+1.8,py+1.2,h+1.2],k:k+.1+row*.01});
      });
      base+=G.poleSign(V.produce.zh,'Frutas y verduras',x+w/2,y,21,24,z.color);
      accessory('crate','display-crate',F.use('crate',x+.7,y+.7,7.3),[x+1,y+1,7.8]);
      accessory('scale','scale',F.box(54,108,0,4,5,8,F.C.wood)+scale(54,108.4,8),[56,111,9]);
      accessory('bags','produce-bag',F.box(28,128,0,3,2,7,'#a4b49a')+F.oval(29.5,129,8,1.5,.6,'#e7e4cf')+F.top(28.4,129,7,2.2,3,'#d5dfcd'),[29.5,130,8]);
      accessory('price','price-kg','',[x+3,y+3,8.4]);
      accessory('offer','promotion',G.poleSign('特价','OFERTA',27,109,13,9,'#bb9e71'),[27,109,15]);
      var cart=F.box(54,124,1,5,6,1.5,'#8ba398')+F.box(54,124,3,5,5,3,'#bda17a')+F.line([59,124,2],[59,124,9],'#829b8c',1.5);
      [[54,124],[58,124],[54,129],[58,129]].forEach(function(p){cart+=F.box(p[0],p[1],0,.8,.8,1.2,'#657e72');});
      accessory('restock','restock-cart',cart,[56.5,126.5,6]);
    }else if(['bakery','butcher','fish','deli'].indexOf(z.id)>=0){
      base=F.box(x,y,0,w,d,8,F.C.wood)+F.box(x-.2,y-.2,8,w+.4,d+.4,.5,'#e6e0cc');
      var cols=z.id==='deli'?3:4,cell=(w-2)/cols;
      if(z.id==='bakery'){
        base+=F.box(x+1,y+.5,8,w-2,1,12,'#d1ba91')+F.box(x+1,y+.5,16.8,w-2,6.5,.4,'#c4a780');
        list.forEach(function(p,i){var row=Math.floor(i/4),px=x+1.3+(i%4)*cell,py=y+(row===0?1.3:row===1?7:12),h=row===0?17.2:8.8;
          if(row!==0)base+=F.use('tray',px-.1,py-.3,8.6);
          slot(p,px+.3,py,h,1);slots[slots.length-1].svg+=F.use(p.model,px+3.9,py,h);
        });
        accessory('rack','bread-rack','',[x+w/2,y+3,18]);
        accessory('tongs','tongs',F.line([x+w-6,y+d-1,9],[x+w-4,y+d-4,9],'#859a8e',1.2)+F.line([x+w-6,y+d-1,9],[x+w-2.8,y+d-3.5,9],'#859a8e',1.2),[x+w-4,y+d-3,9.1]);
        accessory('paper-bags','paper-bag',F.box(x+1,y+d-4,8.6,2.5,2,4,'#cbb58d')+F.line([x+1,y+d-4,12.6],[x+3.5,y+d-4,12.6],'#9b916c',.8),[x+2,y+d-3,12.6]);
      }else{
        list.forEach(function(p,i){var row=Math.floor(i/cols),px=x+1+(i%cols)*cell,py=y+2+row*6;
          if(z.id==='deli')base+=F.box(px,py,8.6,cell-1,5,.2,'#c8d1c5')+F.top(px+.3,py+.3,8.81,cell-1.6,4.4,'#e5dfce');
          else base+=F.use(z.id==='fish'?'ice-bed':'tray',px,py,8.6);
          slot(p,px+.8,py+.5,8.9,1);
          if(z.id==='deli')slots[slots.length-1].svg+=F.use(p.model,px+4.9,py+.5,8.9)+F.use(p.model,px+9,py+.8,8.9,.85);
          else if(p.model!=='whole-fish')slots[slots.length-1].svg+=F.use(p.model,px+3.8,py+2,8.9,.65);
          base+=F.use('price-'+(i%3),px,py+5,8.7);
        });
        accessory('scale','scale',scale(x+w-5,y+d-4,8.6),[x+w-3,y+d-2,10]);
        accessory('prices','price-kg','',[x+3,y+7,9.3]);
      }
      // Cristal frontal separado: los alimentos permanecen dentro de la vitrina.
      glass=F.poly([[x,y+d,8.5],[x+w,y+d,8.5],[x+w,y+d-2.5,13.5],[x,y+d-2.5,13.5]],'#b7d2ca','fill-opacity=".14"')+F.line([x,y+d-2.5,13.5],[x+w,y+d-2.5,13.5],'#a4bcb1',1.1);
      base+=G.poleSign(V[z.id].zh,V[z.id].es,x+w/2,y+1,23,w,z.color);
      accessory('case',z.id==='bakery'?'display-case':'chilled-case','',[x+w-1,y+d,10.5]);
      accessory('counter','counter','',[x+w/2,y+d,6]);
      accessory('tray','tray','',[x+1.5,y+3,8.8]);
      if(z.id==='butcher'){
        accessory('board','cutting-board',F.box(x+14,y+12.5,8.6,5,3.5,.45,'#c7ae82')+F.line([x+15,y+13,9.1],[x+18,y+15,9.1],'#ab9b73',.7),[x+16.5,y+14.5,9.2]);
        accessory('wrapper','wrapping-machine',F.box(x+20,y+12,8.6,6,4,1.5,'#9bada3')+F.oval(x+23,y+12.5,11.2,2.2,.7,'#e5e6d4')+F.top(x+21,y+13,10.2,4,2,'#d4dfd0'),[x+23,y+14,11]);
      }
      if(z.id==='fish')accessory('ice','ice','',[x+3,y+4,8.8]);
      if(z.id==='deli'){
        var sx=x+w-14,sy=y+11;
        var slicer=F.box(sx,sy,8.6,6,4,1.1,'#a9b9ac')+F.box(sx+1,sy,9.7,1,2,4,'#9cafa6')+F.oval(sx+2,sy+1,12.5,1.9,1.8,'#d1d6c4')+F.oval(sx+2,sy+1,12.5,.5,.5,'#91a89a')+F.top(sx+3,sy+1,9.8,4,2,'#d2dacb');
        accessory('slicer','slicer',slicer,[sx+2,sy+1,12.5]);
        accessory('paper','wrapping-paper',F.top(x+2,y+12,8.8,5,3.6,'#eee6d0')+F.top(x+2.5,y+12.5,8.9,4,2.6,'#e5dcc5'),[x+4,y+14,9]);
      }
    }else{
      // Heladeras abiertas en corte: fondo, techo y estantes; puertas transparentes por delante.
      var depth=z.id==='frozen'?11:d,fh=22;
      base=F.box(x,y,0,1,depth,fh,'#c2d3c6')+F.box(x,y,0,w,depth,1,'#c2d3c6')+F.box(x,y,21.5,w,depth,.5,'#d7e2d0');
      [2.8,7.3,11.8,16.3].forEach(function(h){base+=F.box(x+1,y+.5,h,w-1,depth-1,.3,'#b4c8bc');});
      base+=G.poleSign(V[z.id].zh,V[z.id].es,x+w/2,y,23,18,z.color);
      if(z.id==='dairy')list.forEach(function(p,i){slot(p,x+w-3.5,y+1.5+(i%2)*8,3.2+Math.floor(i/2)*4.5,2);});
      if(z.id==='eggs'){
        list.forEach(function(p){var svg='';[3.2,7.7,12.2,16.7].forEach(function(h){svg+=F.use('eggs',x+w-3.8,y+1.5,h)+F.use('eggs',x+w-3.8,y+9,h);});slots.push({p:p,svg:svg,a:[x+w-.7,y+7,12.7],k:k+.3});});
        accessory('carton','egg-carton','',[x+w-.5,y+2,3.7]);
      }
      if(z.id==='frozen'){
        list.filter(function(p){return ['frozen-vegetables','frozen-pizza','ready-meal'].indexOf(p.model)>=0;}).forEach(function(p,i){slot(p,x+w-4,y+3,3.2+i*4.5,2);if(i===2)slots[slots.length-1].svg+=F.use(p.model,x+w-4,y+3,16.7)+F.use(p.model,x+w-4,y+6.2,16.7,.9);});
        var cy=y+14;
        base+=F.box(x,cy,0,w,d-14,7,'#b9cec4')+F.box(x+.7,cy+.6,7,w-1.4,d-15.2,.3,'#8eb0aa');
        list.filter(function(p){return ['ice-cream','frozen-fries','frozen-fish'].indexOf(p.model)>=0;}).forEach(function(p,i){slot(p,x+1.2,cy+.4+i*2.8,7.4,1);slots[slots.length-1].svg+=F.use(p.model,x+5.2,cy+.4+i*2.8,7.4);});
        glass+=F.top(x+.6,cy+.4,7.5,w-1.2,d-14.8,'#b8d5cd','')+F.line([x+w/2,cy,7.7],[x+w/2,y+d,7.7],'#e7e8d6',1.2);
        // La tapa deslizable se ve translúcida; no oculta la mercadería.
        glass=glass.replace('fill="#b8d5cd"','fill="#b8d5cd" fill-opacity=".16"');
        accessory('chest','chest-freezer','',[x+w/2,cy+5,7.8]);
        accessory('upright','upright-freezer','',[x+w,y+6,19]);
      }else accessory('fridge','fridge','',[x+w,y+depth-1,20]);
      for(var door=0;door<2;door++){
        var sy=y+.5+door*(depth-1)/2,ey=sy+(depth-1)/2;
        glass+=F.poly(I.planeX(x+w+.08,[[sy,1],[ey,1],[ey,21],[sy,21]]),'#b9d5cb','fill-opacity=".10" stroke="#e1e6d2" stroke-width=".7"')+F.line([x+w+.1,sy+.7,8],[x+w+.1,sy+.7,12],'#a0b9aa',1.2);
      }
    }
    // Es la misma selección de sección de la primera fase, pero sin bloquear los productos.
    add('zone-'+z.id,z.id,z.id,k,base,[x+w/2,y+d/2,8],false,'section');
    slots.forEach(function(s){add(s.p.id,s.p.word,z.id,s.k,s.svg,s.a,true);});
    if(glass)deco(k+.8,glass);
  }
  window.SupermarketFreshScene={build:build};
})();
