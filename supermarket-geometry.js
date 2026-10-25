// Mobiliario y productos volumétricos; los modelos repetidos viven en defs SVG.
(function () {
  var I=window.ISO, b=I.box, f=I.flat, line=I.line, defined={};
  var C={ wood:'#c3a17a', cream:'#eee7d7', steel:'#aeb9b8', dark:'#405651', green:'#7c9b85', glass:'#a8d0cf' };
  function ground(x,y,w,d,z,color,extra){return f([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]],color,extra);}
  function place(svg,x,y,z){var p=I.P(x,y,z||0);return '<g transform="translate('+p.join(' ')+')">'+svg+'</g>';}
  function define(id,svg){if(!defined[id]){defined[id]=true;I.defs.push('<g id="sm-'+id+'">'+svg+'</g>');}}
  function use(id,x,y,z){return place('<use href="#sm-'+id+'"/>',x,y,z);}
  function textY(text,x,y,z,size,color){var p=I.P(x,y,z);return '<text transform="translate('+p.join(' ')+') matrix(.866 .5 0 1 0 0)" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="600" font-size="'+size+'" fill="'+(color||'#fff9e9')+'">'+text+'</text>';}
  function sign(zh,es,x,y,z,w,color){return b(x-w/2,y-.5,z,x+w/2,y+.5,z+5,color)+textY(zh,x,y+.6,z+2.7,11)+textY(es,x,y+.6,z+.7,6.5);}
  function poleSign(zh,es,x,y,z,w,color){return line([x,y,0],[x,y,z],C.steel,1.4)+sign(zh,es,x,y,z,w,color);}
  function packet(color,h,label){
    return b(0,0,0,2.3,3,h,color)+f(I.planeX(2.32,[[.3,.7],[2.7,.7],[2.7,h-.5],[.3,h-.5]]),label||'#eee4c7')+line([.4,3.02,.7],[1.9,3.02,.7],'#f8eed7',.7);
  }
  function bottle(color){return b(.4,.4,0,2,2.6,3.7,color)+b(.8,.8,3.7,1.6,2.2,4.7,color)+b(.7,.7,4.7,1.7,2.3,5,'#e3d8b8')+f(I.planeX(2.03,[[.7,1],[2.3,1],[2.3,2.7],[.7,2.7]]),'#eee5cd');}
  function models(){
    var packs={rice:['#d4c28c',3.5],cereal:['#bf9b66',4.5],chips:['#cb966e',4],pasta:['#c4b179',4.4],diapers:['#ddd4ba',4.5],'pet-food':['#a49972',4],'paper-towels':['#e3e3d0',4],milk:['#dbe7dc',4.5],'ice-cream':['#bdd2d1',2.8],'egg-carton':['#d1bca0',1.5]};
    Object.keys(packs).forEach(function(k){define(k,packet(packs[k][0],packs[k][1]));});
    [['water','#93b6bc'],['soy-sauce','#806e52'],['detergent','#84a6a8'],['shampoo','#aa9fb4']].forEach(function(p){define(p[0],bottle(p[1]));});
    define('apple',I.sphere(1.2,1.4,1.3,1.1,'#b8765f')+line([1.2,1.4,2.2],[1.2,1.4,2.7],'#789164',.8));
    define('carrot',I.ext('z',[[0,0],[2.4,0],[1.8,3.3],[.6,3.3]],0,.8,'#d29a61')+line([1.2,0,.5],[1.2,-1.2,1.3],'#7d9d68',2));
    define('bread',I.ext('z',[[0,.8],[.6,0],[2.4,0],[3,.8],[3,4],[2.4,4.8],[.6,4.8],[0,4]],0,1.6,'#ccab72')+line([.6,1,1.7],[2.4,2,1.7],'#ead2a1',1)+line([.6,2.5,1.7],[2.4,3.5,1.7],'#ead2a1',1));
    define('meat',b(0,0,0,3.3,4,.3,'#e7daca')+I.ext('z',I.ellPoly(1.6,2,1.3,1.5,8),.3,.8,'#c68e83')+line([.9,1,.9],[2.2,3,.9],'#e8c8b6',1));
    define('fish-product',f([[0,2,.5],[.8,.7,.5],[2.5,1,.5],[4,2,.5],[2.5,3,.5],[.8,3.3,.5]],'#8aa7a5')+f([[3.5,2,.5],[4.7,.6,.5],[4.7,3.4,.5]],'#729290'));
    define('ham',I.ext('z',I.ellPoly(1.5,2,1.5,2,8),0,1.6,'#cc9b91')+I.ext('z',I.ellPoly(1.5,2,1.1,1.6,8),1.6,1.7,'#e0b3a0'));
    define('bag',b(0,0,0,3,2.3,4,'#c7b38c')+line([.5,.5,4],[.5,.5,5.3],'#8d957a',.8)+line([2.5,.5,4],[2.5,.5,5.3],'#8d957a',.8)+line([.5,.5,5.3],[2.5,.5,5.3],'#8d957a',.8));
    define('basket',b(0,0,0,5,3.8,2.6,'#86a28b')+ground(.4,.4,4.2,3,2.7,'#667f6d')+line([0,1.8,2.6],[2.5,1.8,5],'#4e6860',1)+line([2.5,1.8,5],[5,1.8,2.6],'#4e6860',1));
    define('cart',cart());
    define('staff',person('#789b8b','#4e6766'));
    define('customer-blue',person('#8ca9b1','#667c82'));
    define('customer-rust',person('#c3977b','#677b7a'));
  }
  function person(shirt,trousers){
    var s=b(-1.4,-.8,0,-.2,.8,6,trousers)+b(.2,-.8,0,1.4,.8,6,trousers);
    s+=b(-1.8,-1,6,1.8,1.2,12,shirt)+line([-1.8,0,10],[-2.4,1,6.3],'#d9b79a',2)+line([1.8,0,10],[2.7,1,7],'#d9b79a',2);
    s+=I.sphere(0,0,14.1,1.8,'#d9b79a')+f([[ -1.8,-1,15],[1.4,-1,15],[1.4,1,15.5],[-1.5,1,15.5]],'#75675a');
    return s;
  }
  function cart(){
    var s=b(0,0,2,5,8,2.4,C.steel)+b(0,1,4,5,7.5,4.5,C.steel);
    var seg=[];
    [0,5].forEach(function(x){for(var y=1;y<=7;y+=2)seg.push([[x,y,2.4],[x,y,9]]);seg.push([[x,1,9],[x,7.5,9]]);});
    [1,7.5].forEach(function(y){seg.push([[0,y,4.5],[0,y,9]],[[5,y,4.5],[5,y,9]],[[0,y,9],[5,y,9]]);});
    s+=I.path(seg,'#8b9c9b',1)+line([0,0,10],[5,0,10],'#779783',2);
    [0,5].forEach(function(x){[1,7].forEach(function(y){s+=b(x-.4,y-.6,.2,x+.4,y+.6,1.6,'#5b706b');});});return s;
  }
  function gondola(z){
    var x=z.x,y=z.y,w=z.w,d=z.d,s=b(x,y,0,x+w,y+d,1,C.green)+b(x+4.5,y,1,x+5.5,y+d,14,C.cream);
    // Dos caras y tres niveles; paquetes compartidos, no cajas vacías.
    [1.2,5.4,9.6].forEach(function(h){
      s+=b(x,y,h,x+w,y+d,h+.5,'#d3c4a9');
      for(var j=1;j<d-2;j+=4.4)s+=use(z.stock,x+6.5,y+j,h+.5);
      s+=line([x+w,y,h+.6],[x+w,y+d,h+.6],'#f6eed8',1.5);
    });
    s+=poleSign(window.SupermarketVocab[z.id].zh,window.SupermarketVocab[z.id].es,x+w/2,y+1,21,18,z.color);
    return s;
  }
  function fresh(z,stock){
    var x=z.x,y=z.y,w=z.w,d=z.d,s=b(x,y,0,x+w,y+d,8,C.wood)+b(x,y,8,x+w,y+d,8.6,C.cream);
    for(var j=3;j<w-2;j+=5)s+=use(stock,x+j,y+7,8.7);
    s+=f([[x,y+d,8.6],[x+w,y+d,8.6],[x+w,y+d-3,14],[x,y+d-3,14]],C.glass,'fill-opacity=".35" stroke="#c5d9d0" stroke-width="1"');
    s+=line([x,y+d-3,14],[x+w,y+d-3,14],C.steel,1.5);
    s+=sign(window.SupermarketVocab[z.id].zh,window.SupermarketVocab[z.id].es,x+w/2,y+1,23,w,z.color);
    s+=line([x+1,y+1,0],[x+1,y+1,23],C.steel,1)+line([x+w-1,y+1,0],[x+w-1,y+1,23],C.steel,1);
    return s;
  }
  function chilled(z,stock){
    var x=z.x,y=z.y,w=z.w,d=z.d,s=b(x,y,0,x+w,y+d,20,'#ccd7cd');
    s+=f(I.planeX(x+w+.1,[[y+.6,2],[y+d-.6,2],[y+d-.6,18],[y+.6,18]]),'#6f9391');
    for(var h=3;h<=12;h+=7)for(var j=1;j<d-2;j+=4.2)s+=use(stock,x+w-2.8,y+j,h);
    for(var j=0;j<2;j++){
      var sy=y+.5+j*(d-1)/2;
      s+=f(I.planeX(x+w+.3,[[sy,2],[sy+(d-1)/2,2],[sy+(d-1)/2,18],[sy,18]]),C.glass,'fill-opacity=".24" stroke="#eef1de" stroke-width="1"');
      s+=line([x+w+.5,sy+1,8],[x+w+.5,sy+1,12],'#e2dec7',1.3);
    }
    s+=line([x+w/2,y,20],[x+w/2,y,22],C.steel,1.2)+sign(window.SupermarketVocab[z.id].zh,window.SupermarketVocab[z.id].es,x+w/2,y,22,18,z.color);return s;
  }
  function monitor(x,y,z,touch){
    return b(x+1,y+.5,z-3,x+1.6,y+1.4,z,C.steel)+b(x,y,z,x+4.5,y+1.4,z+4,touch?'#567d77':C.dark)+f(I.planeY(y+1.43,[[x+.4,z+.4],[x+4.1,z+.4],[x+4.1,z+3.5],[x+.4,z+3.5]]),'#b0d4cb')+line([x+.9,y+1.47,z+1],[x+3.6,y+1.47,z+1],'#f2ebcf',1);
  }
  function pinpad(x,y,z){return b(x,y,z,x+2.2,y+3.3,z+.8,C.dark)+ground(x+.3,y+.3,1.6,1.3,z+.9,'#a9c6be')+I.path([[[x+.5,y+2,z+.9],[x+1.7,y+2,z+.9]],[[x+.5,y+2.7,z+.9],[x+1.7,y+2.7,z+.9]]],'#d4dfcb',.8);}
  function checkout(){
    // Cada componente se devuelve separado para conservar su selección individual.
    var p=[];function part(key,w,svg,a){p.push({key:key,w:w,svg:svg,a:a});}
    part('belt','conveyor',b(0,0,0,7,17,8,'#9daea7')+b(.5,.4,8,6.5,16.5,8.6,'#526760')+line([0,0,8.7],[0,17,8.7],C.steel,1.6)+line([7,0,8.7],[7,17,8.7],C.steel,1.6),[3.5,9,8.7]);
    part('base','register',b(0,17,0,9,25,8.5,C.green)+b(-1,17,8.5,10,25,9,C.cream)+b(4,20,9,7.5,23,10,C.dark),[6,22,10]);
    part('scanner','scanner',ground(.3,16.3,5.2,3.3,9.1,'#5d7470')+ground(1,16.8,3.8,2,9.2,'#b9d2c9')+line([1.2,17,9.3],[4.5,18,9.3],'#c48b77',1),[2.5,17.5,9.3]);
    part('display','display',monitor(4,18.6,12,false),[6.2,20,14.2]);
    part('pinpad','payment-terminal',b(9,19,8.6,12,22.5,9.2,C.steel)+pinpad(9.2,19,9.2),[10.3,20.6,10]);
    part('drawer','cash-drawer',b(-3,21,6,2,25,7.4,C.steel)+ground(-2.6,21.4,4.2,3.2,7.5,'#5c7367')+line([-2,25,6.8],[1,25,6.8],C.dark,1),[-1,24,7.5]);
    part('receipt','receipt',ground(4.7,22.8,1.4,2.3,10.1,'#f8f1db')+I.path([[[4.9,24,10.2],[5.8,24,10.2]],[[4.9,25,10.2],[5.8,25,10.2]]],'#9aa994',.5),[5.4,24.8,10.2]);
    part('divider','divider',b(.4,10,8.7,6.6,10.6,9.3,'#9db8a1'),[1.2,10.3,9.4]);
    part('goods','goods',use('cereal',1,3,8.7)+use('water',3.7,6.5,8.7),[2.2,4.5,12]);
    part('bagging','bagging',b(0,25,0,12,36,7.1,C.wood)+b(-.5,25,7.1,12.5,36,7.7,C.steel)+ground(.5,25.5,11,9.8,7.8,'#c1ccc1'),[6,32,7.8]);
    part('bag','bag',use('bag',7.5,29,7.9),[9,30,12]);
    return p;
  }
  function selfCheckout(){
    var p=[];function part(key,w,svg,a){p.push({key:key,w:w,svg:svg,a:a});}
    part('base','self-terminal',b(5,0,0,10,9,10,'#8ea89e')+b(9.8,0,0,13,4,9,'#8ea89e')+b(-.5,0,0,3.8,7,7.5,C.wood)+b(10,3,0,16,12,7,C.wood),[7.5,6,8]);
    part('touchscreen','touchscreen',monitor(5,.5,13,true),[7.2,2,16]);
    part('scanner','scanner',b(5,7,8.5,10,10,9,C.dark)+ground(5.7,7.5,3.6,2,9.1,'#a6cac3')+line([6,8,9.2],[9,8.7,9.2],'#bd8d7c',.9),[7,9,9.2]);
    part('scale','scale',b(10.5,6.5,7,16,12.5,7.6,C.steel)+ground(11,7,4.5,4.8,7.7,'#c7d4c8'),[14,11.5,7.7]);
    part('pinpad','payment-terminal',pinpad(10.2,.3,9),[11.4,2,10]);
    part('product-area','product-area',b(-.5,0,7.5,4.5,7,8,C.steel)+use('rice',.5,1.5,8.1),[2,5,8.1]);
    part('bags','bag-area',use('bag',12,7.5,7.8)+line([11,7,8],[11,7,12],C.steel,1)+line([15.5,7,8],[15.5,7,12],C.steel,1),[14,8.5,12]);
    part('light','status-light',line([9,.5,10],[9,.5,23],C.steel,1.3)+b(8.2,-.3,22,9.8,1.3,24,'#9bbc8d'),[9,.5,24]);
    part('help','help-button',b(8.9,3.8,10,10.5,5.4,11.7,'#90a99e')+b(9.1,4,11.7,10.3,5.2,12.5,'#c49b6b')+textY('?',9.7,5.25,12,3.4,'#fff7e1'),[10.2,5,12.6]);
    return p;
  }
  window.SupermarketGeometry={C:C,models:models,ground:ground,place:place,use:use,textY:textY,sign:sign,poleSign:poleSign,gondola:gondola,fresh:fresh,chilled:chilled,monitor:monitor,checkout:checkout,selfCheckout:selfCheckout};
})();
