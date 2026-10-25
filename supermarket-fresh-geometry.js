// Geometría compacta para frescos: modelos compartidos, caras con la luz de ISO.
(function () {
  var I=window.ISO,G=window.SupermarketGeometry,known={};
  var C={wood:'#b49670',rim:'#d1ba8c',steel:'#a5b9b4',green:'#85a38a',ice:'#dcebe5',cream:'#f1e6c9',red:'#bd7668',leaf:'#729258'};
  function poly(a,c,extra){return '<polygon points="'+I.pts(a)+'" fill="'+c+'" '+(extra||'')+'/>';}
  function box(x,y,z,w,d,h,c){return poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],I.shade(c,I.FX))+poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],I.shade(c,I.FY))+poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],I.shade(c,1.12));}
  function top(x,y,z,w,d,c){return poly([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]],c);}
  function orb(x,y,z,r,c){return I.sphere(x,y,z+r,r,c);}
  function oval(x,y,z,rx,ry,c){var p=I.P(x,y,z);return '<ellipse cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" rx="'+(rx*I.S).toFixed(1)+'" ry="'+(ry*I.S).toFixed(1)+'" fill="'+c+'"/>';}
  function line(a,b,c,w){return I.line(a,b,c,w||.7);}
  function leaf(x,y,z,c){return poly([[x,y,z],[x+.8,y-.4,z+.7],[x+1.5,y,z+.4],[x+.7,y+.4,z]],c||C.leaf);}
  function define(id,s){if(!known[id]){known[id]=true;I.defs.push('<g id="pf-'+id+'">'+s+'</g>');}}
  function use(id,x,y,z,scale){var p=I.P(x,y,z||0);return '<use href="#pf-'+id+'" transform="translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')'+(scale?' scale('+scale+')':'')+'"/>';}
  function prism(a,z,h,c){
    var area=0,s='',i;for(i=0;i<a.length;i++){var p=a[i],q=a[(i+1)%a.length];area+=p[0]*q[1]-q[0]*p[1];}
    var winding=area>0?1:-1;
    for(i=0;i<a.length;i++){var p=a[i],q=a[(i+1)%a.length],nx=winding*(q[1]-p[1]),ny=winding*(p[0]-q[0]);if(nx+ny<=0)continue;
      s+=poly([[p[0],p[1],z],[q[0],q[1],z],[q[0],q[1],z+h],[p[0],p[1],z+h]],I.shade(c,nx>ny?I.FX:I.FY));
    }
    return s+poly(a.map(function(p){return[p[0],p[1],z+h];}),I.shade(c,1.08));
  }
  function produce(id){
    var s='',p,fruit={apple:'#ba7562',orange:'#dba157',mandarin:'#dfad60',peach:'#d19a83',tomato:'#c87963',pumpkin:'#c99052'};
    if(fruit[id]){
      if(id==='mandarin')s=oval(1.3,1,1,.95,.65,fruit[id])+leaf(1.3,1,1.6);
      else {s=orb(1.2,1,.1,id==='pumpkin'?1.2:.85,fruit[id]);s+=line([1.2,1,1.6],[1.25,1,2.2],'#7f8050',.7);}
      if(id==='apple'||id==='tomato')s+=leaf(1.2,1,1.8);
      if(id==='peach'||id==='pumpkin')s+=line([1.2,.4,.4],[1.2,.4,1.8],'#a7724f',.7);
      return s;
    }
    if(id==='banana')return prism([[0,.2],[.9,0],[1.6,.5],[2.3,1.5],[2.3,2],[1.6,1.4],[.9,.9],[.1,.7]],.1,.35,'#e1c45f')+prism([[.3,.9],[.8,.8],[1.3,1.2],[1.5,2],[1.1,2.2],[.8,1.5]],.3,.35,'#ebd277');
    if(id==='pear')return orb(1.2,1,0,.9,'#b8bf75')+orb(1.2,1,1.1,.5,'#b8bf75')+line([1.2,1,1.8],[1.3,1,2.4],'#858052',.8);
    if(id==='grapes'){[[.5,.4],[1.4,.4],[2.1,.6],[.8,1.1],[1.7,1.2],[1.3,1.8]].forEach(function(p){s+=orb(p[0],p[1],.1,.4,'#9283a4');});return s+leaf(1.2,.4,1);}
    if(id==='strawberry')return prism([[0,.4],[.6,0],[1.2,.2],[1.7,0],[2.3,.5],[1.2,2.1]],0,.9,'#c77a72')+leaf(.5,.3,1,'#7b9d66')+line([.7,1,1],[.8,1,1.1],C.cream,1)+line([1.4,.8,1],[1.5,.8,1.1],C.cream,1);
    if(id==='watermelon')return oval(1.4,1,1,1.45,1,'#7b9f70')+I.path([[[.7,.4,.3],[.7,.4,1.8]],[[1.5,.4,.2],[1.5,.4,2]],[[2.2,.4,.4],[2.2,.4,1.7]]],'#b0bd80',1.1);
    if(id==='melon')return orb(1.3,1,0,1.1,'#cfbf88')+oval(1.9,1.1,1.3,.8,.7,'#e2ad78')+oval(1.9,1.1,1.3,.4,.35,'#bda16c');
    if(id==='pineapple')return prism([[.3,.2],[1.6,.2],[2,1],[1.6,1.8],[.3,1.8],[0,1]],0,1.7,'#c4a15e')+I.path([[[.4,.1,.4],[1.4,.1,1.6]],[[1.4,.1,.4],[.4,.1,1.6]]],'#9f9255',.7)+poly([[.8,1,1.7],[.2,1,3],[1,1,2.4],[1.6,1,3.2],[1.4,1,1.7]],C.leaf);
    if(id==='kiwi')return orb(.7,1,0,.85,'#9b8966')+oval(1.9,1,1,.85,.8,'#a5bb75')+oval(1.9,1,1,.28,.3,'#e3d6a3')+I.path([[[1.5,.7,1.2],[1.6,.7,1.2]],[[2.1,.7,1.4],[2.2,.7,1.4]],[[1.9,.7,.5],[2,.7,.5]]],'#6e7053',1);
    if(id==='lemon'||id==='mango')return oval(1.3,1,1,id==='lemon'?1.1:1.2,.75,id==='lemon'?'#daca6b':'#d1ac62')+leaf(1.5,.7,1.6);
    if(id==='cherry')return orb(.6,.8,0,.55,'#b76d6b')+orb(1.8,1.2,0,.55,'#b76d6b')+line([.6,.8,1],[1.3,.6,2],'#7e975d',.7)+line([1.8,1.2,1],[1.3,.6,2],'#7e975d',.7);
    if(id==='potato')return oval(.8,.6,.7,.8,.55,'#bfaa80')+oval(1.8,1.5,.7,.8,.6,'#c9b48a')+line([1.7,1,.7],[1.9,1,.7],'#9d946f',1);
    if(id==='onion')return orb(1.2,1,0,.95,'#c9ac77')+line([.9,.5,.3],[.9,.5,1.7],'#e5cc98',.7)+line([1.5,.5,.3],[1.5,.5,1.7],'#e5cc98',.7)+leaf(1.1,1,1.9,'#a7aa73');
    if(id==='carrot')return prism([[.2,.2],[1.6,.2],[1.1,2.2]],0,.55,'#d5995e')+leaf(.2,0,.5)+leaf(.8,0,.7);
    if(id==='lettuce'||id==='cabbage'){[[-.3,0],[.6,0],[0,.8]].forEach(function(p){s+=orb(1.1+p[0],.8+p[1],0,.85,id==='lettuce'?'#90ad73':'#b4c290');});return s+leaf(.8,.5,1.5,'#c2ce9b');}
    if(id==='cucumber'||id==='zucchini')return prism([[.2,0],[1.2,0],[1.6,.4],[1.6,2.1],[1,2.5],[.2,2.1]],0,.8,id==='cucumber'?'#7c9b62':'#9aae72')+line([.8,0,.9],[.8,2.2,.9],'#b4c28b',.8);
    if(id==='broccoli'||id==='cauliflower'){s=box(.9,.6,0,.7,.7,1.3,'#acbf8c');[[.3,0],[1.2,0],[.7,.8]].forEach(function(p){s+=orb(.4+p[0],.5+p[1],.7,.6,id==='broccoli'?'#7d9e70':'#e0d8ad');});return s;}
    if(id==='spinach')return leaf(0,.4,.2)+leaf(.7,.8,.3,'#86a374')+leaf(.5,1.5,.5,'#6f9266')+line([0,1.5,0],[2,1.5,.5],'#b6c690',1);
    if(id==='pepper')return orb(.6,.8,0,.65,'#c48b63')+orb(1.5,.8,0,.65,'#c48b63')+orb(1.1,1.4,0,.6,'#c48b63')+leaf(1,.8,1.4);
    if(id==='garlic'){[0,.7,1.4].forEach(function(x){s+=oval(.4+x,1,.7,.45,.7,'#e6e0c5');});return s+line([1,1,1.3],[1.1,1,2],'#c3b48b',.8);}
    if(id==='aubergine')return oval(1,1,1,.75,1.1,'#86768f')+leaf(.8,.5,2,'#8b9d6d')+line([.7,.6,.5],[.7,.6,1.5],'#b0a1b4',.8);
    throw new Error('Modelo vegetal no definido: '+id);
  }
  function loaf(c,long,sliced){var d=long?5:3.2;var s=prism([[.2,0],[2.5,0],[3,.5],[3,d-.5],[2.5,d],[.2,d],[0,d-.5],[0,.5]],0,1.5,c);for(var j=.7;j<d;j+=sliced?.5:1.3)s+=line([.5,j,1.55],[2.4,j+.3,1.55],'#ecd6a6',.8);return s;}
  function bakery(id){
    if(id==='white-bread'||id==='wholemeal-bread'||id==='baguette'||id==='sliced-bread')return loaf(id==='wholemeal-bread'?'#a48b67':'#d3b27e',id==='baguette',id==='sliced-bread');
    if(id==='croissant')return prism([[0,0],[1.3,.6],[2.5,0],[2.9,.8],[2,1.9],[1.1,2.1],[.1,1]],0,.9,'#c6a06d')+line([1.4,.5,1],[1.4,1.7,1],'#e6c48d',.8);
    if(id==='doughnut')return oval(1.4,1,1,1.2,.8,'#bd9870')+oval(1.4,1,1.1,.9,.55,'#e1bfac')+oval(1.4,1,1.15,.35,.25,'#9b8966');
    if(id==='muffin')return box(.4,.3,0,2,2,1,'#c3b397')+orb(1.4,1.3,.8,1.1,'#b2916d')+oval(1,1,2.1,.2,.15,'#8c7963');
    if(id==='biscuit')return oval(.8,.8,.3,.7,.45,'#c3a274')+oval(2,1.8,.3,.7,.45,'#c3a274')+line([.7,.7,.5],[.8,.7,.5],'#8c7963',1);
    if(id==='cake')return box(0,0,0,3.4,3,1.6,'#c9ac84')+box(0,0,1.6,3.4,3,.4,'#f0e0c3')+use('strawberry',.7,.6,2,.65);
    if(id==='pie')return oval(1.5,1.3,.7,1.5,.9,'#bf9d6c')+oval(1.5,1.3,.8,1.2,.7,'#ba8470')+I.path([[[.4,.5,.9],[2.5,2,.9]],[[2.5,.5,.9],[.4,2,.9]]],'#e2c38e',1);
    return prism([[0,.3],[1.5,0],[3,.3],[2.5,2.6],[.5,2.6]],0,1,'#caa978')+top(.5,.8,1.1,2,1,'#dac3a3')+oval(1.5,1.2,1.1,.5,.3,'#b98c72');
  }
  function protein(id){
    var s='';
    if(id==='whole-chicken')return oval(1.7,1.6,1.2,1.4,1,'#d9c0a2')+oval(.4,1,.7,.6,.5,'#d9c0a2')+oval(2.9,2.2,.7,.6,.5,'#d9c0a2');
    if(id==='sausage'){for(var n=0;n<3;n++)s+=prism([[n*.8,0],[n*.8+.6,0],[n*.8+.9,3],[n*.8+.2,3.4]],0,.6,'#b78374');return s;}
    var colors={beef:'#b57b72',pork:'#d3a497','chicken-breast':'#dcc0ac',mince:'#c38e82',ribs:'#b88478',steak:'#ae746a'};
    if(colors[id]){
      s=oval(1.5,1.5,.6,1.5,.9,colors[id]);
      if(id==='ribs')for(var n=0;n<4;n++)s+=line([.3+n*.7,.4,.8],[.3+n*.7,2.5,.8],'#e3ceaf',1.3);
      else if(id==='mince')s+=I.path([[[.3,.5,.8],[2.7,.5,.8]],[[.3,1,.8],[2.7,1,.8]],[[.3,1.5,.8],[2.7,1.5,.8]],[[.3,2,.8],[2.7,2,.8]]],'#deac9b',.9);
      else s+=oval(1.4,1.3,.7,.45,.3,'#e5c7ae');return s;
    }
    if(id==='whole-fish')return prism([[0,1],[1,.1],[3.5,.4],[4.4,1.3],[3.5,2.2],[1,2.5]],0,.6,'#91aaa7')+poly([[3.8,1.3,.7],[5,.2,.7],[5,2.5,.7]],'#748f91')+orb(.8,.9,.6,.12,'#536968');
    if(['fillet','salmon','tuna'].indexOf(id)>=0){s=prism([[0,.2],[2.5,0],[3.5,2.2],[.4,2.8]],0,.7,id==='salmon'?'#cf9b7e':id==='tuna'?'#b97f79':'#d5ccb5');if(id==='salmon')for(var n=0;n<3;n++)s+=line([.4+n*.7,.3,.8],[1+n*.7,2.3,.8],'#ebcfb0',.8);return s;}
    if(id==='shrimp')return oval(.8,.8,.6,.7,.5,'#d3a38a')+oval(.8,.8,.65,.35,.25,C.cream)+oval(2.2,1.8,.6,.7,.5,'#d3a38a')+oval(2.2,1.8,.65,.35,.25,C.cream);
    if(id==='squid')return prism([[.3,0],[2.4,0],[2,2.4],[.6,2.4]],0,.5,'#dedbca')+I.path([[[.7,2,.5],[0,3,.2]],[[1,2,.5],[.8,3.3,.2]],[[1.4,2,.5],[1.7,3.3,.2]],[[1.8,2,.5],[2.8,3,.2]]],'#c1bcb6',1);
    if(id==='shellfish')return prism([[0,0],[1.5,.4],[.8,2.2]],0,.5,'#879895')+prism([[1.5,1],[3,1.3],[2.3,3]],0,.5,'#a49c89')+line([.7,.4,.6],[.8,1.8,.6],'#c5c9b5',.7);
    if(id==='ham'||id==='salami'){s=oval(1.4,1.2,.5,1.2,.9,id==='ham'?'#d3a397':'#b8827b')+oval(1.8,1.8,.8,1.2,.9,id==='ham'?'#ddb1a1':'#c39487');if(id==='salami')s+=I.path([[[1,1,1],[1.1,1,1]],[[1.8,1.3,1],[2,1.3,1]],[[2.2,2,1],[2.4,2,1]]],C.cream,1.2);return s;}
    if(id==='cheese-block'||id==='cheese')return prism([[0,0],[3.5,0],[3,2.8],[0,2]],0,1.5,'#d9c58f')+oval(1,.7,1.6,.25,.15,'#bda471')+oval(2.4,1.7,1.6,.3,.18,'#bda471');
    if(id==='cheese-slices')return box(0,0,0,3.2,2.6,.6,'#d9c58f')+box(.3,.4,.6,3.2,2.6,.2,'#e6d49f');
    return use('ham',0,0,0,.8)+use('salami',1.5,1.5,.3,.7)+use('cheese-slices',0,2,.2,.6);
  }
  function carton(c,h){return box(.2,.2,0,2.2,2.4,h,c)+poly([[.2,.2,h],[2.4,.2,h],[1.9,.2,h+.6],[.7,.2,h+.6]],'#f2ebd9')+top(.6,.6,h+.65,1.4,1.3,'#dae2d1')+poly([[2.41,.6,.7],[2.41,2.2,.7],[2.41,2.2,h-.3],[2.41,.6,h-.3]],'#9fb7ad');}
  function dairy(id){
    if(id==='milk'||id==='cream')return carton(id==='milk'?'#e6e8d7':'#ded4b6',id==='milk'?3.2:2.2);
    if(id==='butter')return box(0,0,0,3.2,2.4,.9,'#ddcc91')+top(.5,.4,1,2.2,1.6,'#f2e9ce');
    if(id==='cheese')return protein(id);
    if(id==='eggs'){var s=box(0,0,0,3.6,3,.4,'#c5b294');for(var y=0;y<2;y++)for(var x=0;x<3;x++)s+=oval(.6+x*1.2,.7+y*1.4,1,.48,.62,'#e8d9b7');return s;}
    return box(0,0,0,2.8,2.5,1.4,id==='dairy-dessert'?'#c5ab8c':'#d7ddd0')+top(-.1,-.1,1.5,3,2.7,id==='yogurt'?'#bbc5b3':id==='cream-cheese'?'#91b5ad':'#e4d0ac');
  }
  function frozen(id){
    if(id==='ice-cream')return box(0,0,0,3.3,2.8,1.7,'#c7d6d3')+top(-.1,-.1,1.8,3.5,3,'#e9d5bb');
    var col={'frozen-vegetables':'#a5b98a','frozen-fries':'#d4b97f','frozen-pizza':'#c49a7d','frozen-fish':'#99b9bc','ready-meal':'#b7ab99'}[id];
    var s=box(0,0,0,3.4,2.6,id==='frozen-pizza'?.7:1,col);
    if(id==='frozen-pizza')s+=oval(1.7,1.2,.9,1,.6,'#dbc18d')+oval(1.7,1.2,1,.65,.4,'#bf8d71');
    else if(id==='frozen-vegetables')s+=orb(1,1,1,.35,'#93ad74')+orb(2,1.8,1,.35,'#93ad74');
    else if(id==='frozen-fries')s+=I.path([[[.7,.6,1.1],[.7,2,1.1]],[[1.5,.6,1.1],[1.5,2,1.1]],[[2.3,.6,1.1],[2.3,2,1.1]]],'#f1d691',1);
    else if(id==='frozen-fish')s+=poly([[.5,1.4,1.1],[1.4,.6,1.1],[2.7,1.4,1.1],[1.4,2.2,1.1]],'#dae0cd');
    else s+=top(.6,.5,1.1,2.2,1.6,'#dfd3b5');return s;
  }
  // Tinta vectorial compartida: evita recalcular texto SVG por cada cartel al hacer zoom.
  function priceInk(value){
    var glyphs={0:[0,1,2,3,4,5],1:[1,2],2:[0,1,6,4,3],3:[0,1,6,2,3],4:[5,6,1,2],5:[0,5,6,2,3],6:[0,5,6,4,2,3],7:[0,1,2],8:[0,1,2,3,4,5,6],9:[0,5,1,6,2,3]};
    var strokes=[[[0,.5],[.25,.5]],[[.25,.5],[.25,.25]],[[.25,.25],[.25,0]],[[.25,0],[0,0]],[[0,0],[0,.25]],[[0,.25],[0,.5]],[[0,.25],[.25,.25]]],segments=[],offset=.25;
    function seg(a,b){segments.push([[a[0],.23,a[1]+.17],[b[0],.23,b[1]+.17]]);}
    value.split('').forEach(function(ch){if(ch==='.'){seg([offset,.01],[offset+.03,.01]);offset+=.15;return;}glyphs[ch].forEach(function(n){seg([offset+strokes[n][0][0],strokes[n][0][1]],[offset+strokes[n][1][0],strokes[n][1][1]]);});offset+=.4;});
    [[[2.15,0],[2.3,.5]],[[2.5,0],[2.5,.5]],[[2.5,.25],[2.8,.45]],[[2.5,.25],[2.8,0]],[[2.95,.4],[3.25,.4]],[[2.95,.4],[2.95,.1]],[[2.95,.1],[3.25,.1]],[[3.25,.4],[3.25,-.08]],[[3.25,-.08],[3,-.08]]].forEach(function(s){seg(s[0],s[1]);});
    return I.path(segments,'#6d785f',.45);
  }
  function models(){
    if(known.ready)return;
    var groups=window.SupermarketProducts.groups;
    // Las referencias entre modelos se resuelven por ID, aunque la definición venga después.
    Object.keys(groups).forEach(function(zone){groups[zone].forEach(function(r){var id=r[0],s=zone==='produce'?produce(id):zone==='bakery'?bakery(id):['butcher','fish','deli'].indexOf(zone)>=0?protein(id):zone==='frozen'?frozen(id):dairy(id);define(id,s);});});
    define('crate',box(0,0,0,4,2.5,.3,C.wood)+box(0,0,.3,.15,2.5,.7,C.rim)+box(3.85,0,.3,.15,2.5,.7,C.rim)+box(0,2.35,.3,4,.15,.5,C.rim));
    define('tray',box(0,0,0,6.5,5,.2,'#c8d1c5')+top(.3,.3,.21,5.9,4.4,'#e5dfce'));
    define('ice-bed',top(0,0,0,6.5,5,C.ice)+poly([[.4,.5,.1],[2,.3,.1],[2.5,2,.1],[.8,2.2,.1]],'#f0f2df')+poly([[3.4,2,.1],[5.4,1.5,.1],[6,4,.1],[3.4,4.2,.1]],'#c1d9d5'));
    for(var n=0;n<3;n++)define('price-'+n,box(0,0,0,3.8,.2,.85,'#e5d9b8')+priceInk(['12.90','18.90','9.90'][n]));
    known.ready=true;
  }
  window.SupermarketFreshGeometry={models:models,use:use,box:box,top:top,poly:poly,oval:oval,line:line,C:C};
})();
