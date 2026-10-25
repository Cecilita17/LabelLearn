// Montaje estático por secciones. La cámara no reconstruye las góndolas.
(function () {
  function create() {
    var I=window.ISO,G=window.SupermarketGeometry,L=window.SupermarketLayout,V=window.SupermarketVocab;
    var sc=new I.Scene(L.width,L.depth,28), b=I.box, ln=I.line, gr=G.ground;
    sc.camera={min:.85,max:10,screenSize:true,ground:true,findZoom:5.5,cull:true,scopedDots:true,dotHitsOnly:true};
    sc.marketWords={};sc.marketMeta={};G.models();
    sc.viewBox=function(){return [-700,-155,1480,1030];};
    function deco(k,s){sc.add(null,k,s);}
    function add(id,w,zone,k,s,a,small,kind){
      sc.marketWords[id]=V[w];sc.marketMeta[id]={zone:zone,kind:kind||'object',a:a};
      sc.add(id,k,s,{a:a,small:!!small,dot:small?a:null});
    }
    function part(id,w,zone,x,y,k,svg,a,small){add(id,w,zone,x+y+k,G.place(svg,x,y,0),[x+a[0],y+a[1],a[2]],small);}
    var floor=b(0,0,-1.6,L.width,L.depth,0,'#b59d7b'),segments=[];
    for(var x=0;x<L.width;x+=10)segments.push([[x,0,.02],[x,L.depth,.02]]);
    for(var y=0;y<L.depth;y+=10)segments.push([[0,y,.02],[L.width,y,.02]]);
    deco(-100,floor+gr(0,0,L.width,L.depth,.01,'#e7e2d3')+I.path(segments,'#d4cdb9',.4));
    deco(-99,b(-1,-1,0,L.width,0,27,'#e9e5d7')+b(-1,0,0,0,L.depth,27,'#d8dfcc'));
    deco(-98,b(0,0,1,L.width,.5,2,'#b3bfaa')+b(0,0,1,.5,L.depth,2,'#aab89f'));
    deco(-97,b(0,0,25,L.width,1.6,27,'#f5eedb')+b(0,0,25,1.6,L.depth,27,'#f5eedb'));
    // Iluminación perimetral, sin techo que oculte la planta.
    [20,59,98,137].forEach(function(x){deco(-96,b(x,1,23,x+17,2,23.5,'#f7edce'));});
    // Los corredores de circulación quedan despejados delante, detrás y entre góndolas.
    deco(-90,gr(26,26,148,10,.03,'#e1e4d6')+gr(26,96,148,13,.03,'#e1e4d6')+gr(0,150,180,10,.03,'#d4dfcc'));
    var arrows='';[34,56,116,151].forEach(function(x){arrows+=I.path([[[x,153,.05],[x+5,153,.05]],[[x+3,151,.05],[x+5,153,.05]],[[x+3,155,.05],[x+5,153,.05]]],'#78967f',1.2);});deco(-89,arrows);
    // Secciones: sus superficies o muebles permiten acercarse sin abrir una ficha.
    L.zones.forEach(function(z){
      var svg='',a=[z.x+z.w/2,z.y+z.d/2,8],k=z.x+z.y+z.w/2+z.d/2;
      if(window.SupermarketProducts.zones.indexOf(z.id)>=0){window.SupermarketFreshScene.build(z,add,deco);return;}
      if(z.stock)svg=G.gondola(z);
      else if(z.id==='service')svg=b(4,117,0,25,127,9,z.color)+b(3.5,116.5,9,25.5,127.5,9.7,G.C.wood)+G.monitor(16,121,12,false)+G.poleSign(V.service.zh,'Atención',14,117,22,24,z.color);
      else {
        k=-85;
        if(z.id==='checkout'||z.id==='selfcheckout')svg=gr(z.x,z.y,z.w,z.d,.04,z.id==='checkout'?'#d6dfcf':'#d0dfd8');
        else if(z.id==='bagging')svg=gr(z.x,z.y,z.w,z.d,.05,'#c0ccb4');
        else if(z.id==='entry')svg=gr(z.x,z.y,z.w,z.d,.05,'#b4c6b1');
        else if(z.id==='exit')svg=gr(z.x,z.y,z.w,z.d,.05,'#c5d2b9');
      }
      add('zone-'+z.id,z.id,z.id,k,svg,a,false,'section');
    });
    // Acceso de vidrio: dos hojas desplazadas, sensor, riel y felpudo.
    var door=b(5,157,0,6,159,24,G.C.green)+b(36,157,0,37,159,24,G.C.green)+b(5,157,23,37,159,24,G.C.green);
    door+=I.flat(I.planeY(157.6,[[6,1],[15,1],[15,22.5],[6,22.5]]),'#a6caca','fill-opacity=".32" stroke="#8eaaa1" stroke-width="1"');
    door+=I.flat(I.planeY(157.7,[[27,1],[36,1],[36,22.5],[27,22.5]]),'#a6caca','fill-opacity=".32" stroke="#8eaaa1" stroke-width="1"');
    door+=b(20,157,24,22,158,24.8,G.C.dark)+G.sign('超市','ENTRADA',21,158.5,25,32,G.C.green);
    add('entry-door','automatic-door','entry',181,door,[22,158,15],true);
    [0,1,2].forEach(function(n){add('cart-'+n,'cart','entry',178+n,G.use('cart',38+n*1.5,139-n*2,0),[40+n*1.5,143-n*2,9],n===0);});
    add('baskets','basket','entry',169,G.use('basket',7,137,0)+G.use('basket',7,137,1.2)+G.use('basket',7,137,2.4),[9,139,6],true);
    var poster=ln([29,134,0],[29,134,14],'#81937e',1.7)+G.sign('本周特价','Ofertas de la semana',29,134,10,13,'#bd9569');
    add('promotion','promotion','entry',163,poster,[29,134,13],true);
    // Productos representativos en muebles ya abastecidos: una zona táctil, sin duplicar stock.
    var products=[];
    L.zones.filter(function(z){return z.stock;}).forEach(function(z){products.push([z.id,z.stock,[z.x+8,z.y+2.5,12.5]]);});
    products.forEach(function(p){add('product-'+p[1],p[1],p[0],p[2][0]+p[2][1]+2,'',p[2],true);});
    // Dos cajas completas. Las piezas conservan sus IDs y posiciones por caja.
    L.checkouts.forEach(function(lane,index){
      G.checkout().forEach(function(p,n){part(lane.id+'-'+p.key,p.w,'checkout',lane.x,lane.y,24+n*.01,p.svg,p.a,true);});
      add(lane.id+'-cashier','cashier','checkout',lane.x+lane.y+15,G.use('staff',lane.x-5,lane.y+20,0),[lane.x-5,lane.y+20,14],true);
      add(lane.id+'-customer','customer','checkout',lane.x+lane.y+35,G.use(index?'customer-rust':'customer-blue',lane.x+14,lane.y+21,0),[lane.x+14,lane.y+21,14],true);
      add(lane.id+'-cart','cart','checkout',lane.x+lane.y+25,G.use('cart',lane.x+13,lane.y+3,0),[lane.x+15.5,lane.y+7,9],true);
      deco(lane.x+lane.y+1,G.poleSign(String(index+1),'CAJA',lane.x+3,lane.y,22,10,'#7e9d8c'));
    });
    var queue=G.use('customer-rust',85,102,0)+G.use('customer-blue',114,102,0);
    [81,90,110,119].forEach(function(x){queue+=b(x,99,0,x+1,100,1,'#879a89')+ln([x+.5,99.5,1],[x+.5,99.5,8],'#86978b',1.4);});
    queue+=ln([81.5,99.5,7],[90.5,99.5,7],'#90a58e',1.6)+ln([110.5,99.5,7],[119.5,99.5,7],'#90a58e',1.6);
    add('queue','queue','checkout',216,queue,[85,102,13],true);
    // Cuatro terminales, cada una con ocho componentes educativos propios.
    L.terminals.forEach(function(t,index){
      G.selfCheckout().forEach(function(p,n){part(t.id+'-'+p.key,p.w,'selfcheckout',t.x,t.y,14+n*.01,p.svg,p.a,true);});
      if(index!==3)add(t.id+'-customer','customer','selfcheckout',t.x+t.y+18,G.use(index%2?'customer-rust':'customer-blue',t.x+7,t.y+14,0),[t.x+7,t.y+14,14],true);
    });
    add('supervisor','supervisor','selfcheckout',297,G.use('staff',174,122,0),[174,122,14],true);
    deco(243,G.poleSign('自助收银','AUTOSERVICIO',149,100,25,39,'#7d9e9c'));
    deco(155,G.poleSign('收银台','CAJAS',66,99,25,24,'#7e9d8c'));
    deco(232,G.poleSign('装袋区','EMBOLSADO',59,141,18,15,'#8c9e83'));
    deco(281,G.poleSign('出口','SALIDA',140,154,19,24,'#809a7e'));
    // Control de salida a baja altura; frente recortado para ver el interior.
    deco(319,b(165,151,0,166,157,10,'#aab9ac')+b(176,151,0,177,157,10,'#aab9ac'));
    return sc;
  }
  window.SupermarketScene={create:create};
})();
