// Piezas urbanas: geometría estática con la proyección y luz del motor original.
(function () {
  var I = window.ISO, b = I.box, f = I.flat, ln = I.line;
  function ground(x, y, w, d, z, c) { return f([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]], c); }
  function sign(text, x, y, z, size, color) {
    var p = I.P(x,y,z);
    return '<text transform="translate('+p.join(' ')+') matrix(.866 .5 0 1 0 0)" text-anchor="middle" font-family="system-ui,sans-serif" font-size="'+size+'" font-weight="700" fill="'+color+'">'+text+'</text>';
  }
  function windowY(x,y,z,w,h) {
    return f([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]], '#719ba9') +
      ln([x+.5,y,z+h-.6],[x+w-.5,y,z+h-.6],'#e9eee6',1.7) +
      ln([x+w/2,y,z],[x+w/2,y,z+h],'#dce6dd',.8);
  }
  function roof(o) {
    var x=o.x-1,y=o.y-1,w=o.w+2,d=o.d+2,z=o.h;
    return f([[x,y,z],[x+w,y,z],[x+w,y+d/2,z+9],[x,y+d/2,z+9]], I.shade(o.accent,1.2)) +
      f([[x,y+d/2,z+9],[x+w,y+d/2,z+9],[x+w,y+d,z],[x,y+d,z]],o.accent) +
      f([[x+w,y,z],[x+w,y+d,z],[x+w,y+d/2,z+9]],I.shade(o.color,.9)) +
      ln([x,y+d/2,z+9],[x+w,y+d/2,z+9],'#f0c5a0',1.4);
  }
  function building(o) {
    var x=o.x,y=o.y,w=o.w,d=o.d,h=o.h,a=o.accent, out='';
    out+=b(x-1,y-1,0,x+w+1,y+d+1,.7,'#c9c5b4');
    out+=b(x,y,.7,x+w,y+d,h,o.color);
    out+=b(x-.3,y-.3,h-2,x+w+.3,y+d+.3,h,a);
    // Molduras, ventanas y vidrieras en las dos fachadas visibles.
    var floors = Math.max(1,Math.floor(h/13)), cols=Math.max(2,Math.floor(w/9)), j,k;
    for(j=0;j<floors;j++) {
      var z=5+j*12;
      for(k=0;k<cols;k++) {
        var wx=x+3+k*(w-6)/cols;
        out+=windowY(wx,y+d+.12,z,(w-6)/cols-2,6);
        if(o.type==='apartments') out+=b(wx-.5,y+d+.3,z-1,wx+(w-6)/cols-1,y+d+2.2,z,'#ece1cd')+ln([wx,y+d+2.2,z+2],[wx+5,y+d+2.2,z+2],a,1);
      }
      for(k=0;k<Math.floor(d/10);k++) out+=f([[x+w+.12,y+3+k*10,z],[x+w+.12,y+8+k*10,z],[x+w+.12,y+8+k*10,z+6],[x+w+.12,y+3+k*10,z+6]],'#6c909a');
    }
    out+=b(x+w*.43,y+d+.2,.7,x+w*.58,y+d+.5,11,a);
    out+=windowY(x+w*.45,y+d+.6,3,w*.1,6);
    out+=b(x+w*.4,y+d+.5,0,x+w*.62,y+d+2,.6,'#ded5c4');
    if(o.type==='shop'||o.type==='bakery') {
      out+=b(x+1,y+d+.4,11,x+w-1,y+d+3,12.1,a);
      for(k=0;k<Math.floor(w/3);k++) out+=ground(x+1+k*3,y+d+.4,1.5,2.6,12.2,'#f5e8cf');
      out+=b(x+1,y+d+.6,13,x+w-1,y+d+.9,17,a);
      out+=sign(o.sign,x+w/2,y+d+1,14,Math.min(16,w*.7),'#fff6dd');
    } else if(o.sign) {
      out+=b(x+w*.13,y+d+.3,h-8,x+w*.87,y+d+.7,h-3,a);
      out+=sign(o.sign,x+w/2,y+d+.9,h-6.5,o.type==='home'?10:17,'#fff6e3');
    }
    if(['home','house','bakery','school'].indexOf(o.type)>=0) out+=roof(o);
    else {
      out+=b(x+1,y+1,h,x+w-1,y+d-1,h+.6,'#c0c6bd');
      out+=b(x+3,y+3,h+.6,x+9,y+8,h+3,'#94a4a3');
      out+=ln([x+w,y,h],[x+w,y+d,h],a,2);
    }
    if(o.type==='hospital') {
      out+=b(x+w*.6,y+6,h+.7,x+w*.6+12,y+18,h+1,'#e6ece0');
      out+=ground(x+w*.6+5,y+7,2,10,h+1.1,'#c25f56')+ground(x+w*.6+1,y+11,10,2,h+1.2,'#c25f56');
      out+=b(x+3,y+d+1,0,x+15,y+d+6,1,'#dcd9cb');
      out+=b(x+3,y+d+1,11,x+15,y+d+6,12,a);
    }
    if(o.type==='school') {
      var p=I.P(x+w/2,y+d+.9,h+3);
      out+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="9" fill="#fff1d7" stroke="#61777c" stroke-width="2"/>';
      out+='<path d="M'+p[0]+' '+(p[1]-6)+'v6l4 2" fill="none" stroke="#61777c" stroke-width="1.5"/>';
      out+=b(x+2,y+d+3,0,x+3,y+d+3.7,26,'#7c8d8d');
      out+=f([[x+3,y+d+3,26],[x+11,y+d+3,26],[x+11,y+d+3,21],[x+3,y+d+3,21]],'#bd735b');
    }
    if(o.type==='library'||o.type==='bank') {
      for(k=0;k<3;k++) out+=b(x+1+k,y+d+1+k,0,x+w-1-k,y+d+2+k,.4*(3-k),'#e1d9c6');
      for(k=0;k<4;k++) out+=b(x+2+k*(w-5)/3,y+d+1,1,x+3+k*(w-5)/3,y+d+2,12,'#e5decb');
      out+=b(x+1,y+d+1,12,x+w-1,y+d+3,13,a);
    }
    if(o.type==='police') out+=ln([x+5,y+5,h],[x+5,y+5,h+11],'#566c76',1)+ln([x+2,y+5,h+8],[x+8,y+5,h+8],'#566c76',1);
    return out;
  }
  function tree() {
    return b(-.8,-.8,0,.8,.8,11,'#93745a') + I.ext('z',I.ellPoly(0,0,5.5,5.5,7),8,14,'#73976a') + I.ext('z',I.ellPoly(-1,0,4.7,4.7,7),13,19,'#83a677') + I.ext('z',I.ellPoly(0,0,3.5,3.5,7),18,22,'#96b67c');
  }
  function prop(kind,x,y,color) {
    var s='',k;
    if(kind==='tree') { var p=I.P(x,y,0); return '<use href="#city-tree" transform="translate('+p.join(' ')+')"/>'; }
    if(kind==='bench') {
      s=b(x,y,3,x+9,y+2,4,'#b38b62')+b(x,y+1.6,4,x+9,y+2.2,7,'#b38b62');
      [1,7].forEach(function(dx){s+=b(x+dx,y+.3,0,x+dx+.7,y+1.7,3,'#617678');});
    } else if(kind==='lamp') {
      s=b(x-.6,y-.6,0,x+.6,y+.6,1,'#788a87')+ln([x,y,0],[x,y,23],'#617578',2)+ln([x,y,23],[x+4,y,23],'#617578',2)+b(x+2,y-1,22,x+5,y+1,23,'#f0ddab');
    } else if(kind==='traffic-light') {
      s=b(x-.6,y-.6,0,x+.6,y+.6,1,'#7a8682')+b(x-.3,y-.3,0,x+.3,y+.3,14,'#5d6c6b')+b(x-1,y-.7,13,x+1,y+.7,19,'#425652');
      ['#cc705e','#e4bf6b','#83ad82'].forEach(function(c,i){s+=I.sphere(x,y+.8,18-i*1.7,.52,c);});
    } else if(kind==='stop-sign') {
      s=ln([x,y,0],[x,y,13],'#7c8b89',1.5)+I.ext('y',[[x-2,13],[x-1,12],[x+1,12],[x+2,13],[x+2,15],[x+1,16],[x-1,16],[x-2,15]],y,y+.5,'#ba6855');
      s+=sign('停',x,y+.6,13.3,5,'#fff3dc');
    } else if(kind==='bus-stop') {
      s=b(x,y,0,x+16,y+4, .5,'#c6cabd')+b(x,y,0,x+.6,y+4,12,'#718f89')+b(x+15.4,y,0,x+16,y+4,12,'#718f89');
      s+=f([[x+.8,y,2],[x+15,y,2],[x+15,y,11],[x+.8,y,11]],'#b5d0ce','fill-opacity=".7"');
      s+=b(x-1,y-.5,12,x+17,y+5,13,'#698e83')+b(x+3,y+.5,3,x+13,y+2,4,'#bd9771');
      s+=b(x+18,y,0,x+18.5,y+.5,16,'#6a827d')+b(x+17,y,12,x+20,y+1,16,'#718f89')+sign('BUS',x+18.5,y+1.1,13,3,'#fff5dc');
    } else if(kind==='car') {
      s=b(x,y,1,x+7,y+14,4,color||'#7f9da4')+b(x+.6,y+4,4,x+6.4,y+10,7,color||'#7f9da4');
      s+=f([[x+1,y+10.1,4.4],[x+6,y+10.1,4.4],[x+6,y+10.1,6.5],[x+1,y+10.1,6.5]],'#bdd5d7');
      s+=b(x+.3,y+13.6,2,x+2,y+14.2,3,'#eddfb4')+b(x+5,y+13.6,2,x+6.7,y+14.2,3,'#eddfb4');
      [2,10].forEach(function(dy){s+=I.cylX(y+dy,1.6,x-.3,x+.5,1.5,'#485556')+I.cylX(y+dy,1.6,x+6.5,x+7.3,1.5,'#485556');});
    } else if(kind==='flowers') {
      s=b(x,y,0,x+10,y+3,1.5,'#bd9c7a')+ground(x+.5,y+.5,9,2,1.6,'#749565');
      for(k=0;k<5;k++) s+=I.sphere(x+1+k*1.8,y+1.5,2.2,.6,k%2?'#e5ba6e':'#c98489');
    } else if(kind==='bike') {
      s=I.cylY(x,2.7,y,y+.25,2.5,'#576b6a')+I.cylY(x+7,2.7,y,y+.25,2.5,'#576b6a');
      s+=ln([x,y+.4,2.7],[x+3,y+.4,6],'#be7d60',1.4)+ln([x+3,y+.4,6],[x+7,y+.4,2.7],'#be7d60',1.4)+ln([x,y+.4,2.7],[x+5,y+.4,2.7],'#be7d60',1.4)+ln([x+5,y+.4,2.7],[x+3,y+.4,6],'#be7d60',1.4)+ln([x+6,y,6],[x+7,y,2.7],'#be7d60',1.4)+ln([x+5,y,6],[x+7,y,6],'#546c6c',1.5);
    } else if(kind==='hydrant') {
      s=b(x-.7,y-.7,0,x+.7,y+.7,4,'#bc725c')+b(x-1.7,y-.5,2,x+1.7,y+.5,3,'#bc725c')+b(x-1,y-1,4,x+1,y+1,4.5,'#d59c77');
    } else if(kind==='mailbox') {
      s=b(x,y,0,x+3,y+2,7,'#78987b')+b(x-.3,y-.3,7,x+3.3,y+2.3,8,'#567866')+ln([x+.4,y+2.1,6],[x+2.6,y+2.1,6],'#354f4e',1);
    } else if(kind==='bin') {
      s=b(x,y,0,x+3,y+3,5,'#718f82')+b(x-.2,y-.2,5,x+3.2,y+3.2,5.6,'#59766c');
    }
    return s;
  }
  window.LabelCityGeometry = { ground:ground, sign:sign, building:building, roof:roof, prop:prop, tree:tree };
})();
