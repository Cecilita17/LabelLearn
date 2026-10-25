// Construye una vez la maqueta; al navegar solo cambia la transformación de cámara.
(function () {
  function create() {
    var I=window.ISO, G=window.LabelCityGeometry, M=window.LabelCityMap;
    var sc=new I.Scene(M.width,M.depth,32), words={};
    sc.camera={ min:.85, max:10, screenSize:true, ground:true };
    sc.cityWords=words;
    sc.viewBox=function(){return [-1160,-185,2320,1490];};
    if (!I.defs.some(function(s){return s.indexOf('id="city-tree"')>=0;})) I.defs.push('<g id="city-tree">'+G.tree()+'</g>');
    function deco(k,s){sc.add(null,k,s);}
    function add(id,v,k,s,a,small){
      words[id]=window.LabelCityVocab[v];
      sc.add(id,k,s,{a:a,small:small,dot:small?a:null});
    }
    var b=I.box, f=I.flat, ln=I.line, gr=G.ground, x,y,s='',j;
    deco(-100,b(0,0,-3,280,260,0,'#b7b9a0'));
    deco(-99,gr(0,0,280,260,.01,'#cbd4b7'));
    // Solado continuo, cordones y calles. Las intersecciones no tienen marcas centrales.
    M.roadsX.forEach(function(r){s+=gr(Math.max(0,r[0]-4),0,Math.min(280,r[1]+4)-Math.max(0,r[0]-4),260,.12,'#e5decb');});
    M.roadsY.forEach(function(r){s+=gr(0,Math.max(0,r[0]-4),280,Math.min(260,r[1]+4)-Math.max(0,r[0]-4),.13,'#e5decb');});
    add('sidewalk','sidewalk',-98,s,[80,148,.13]);s='';
    M.roadsX.forEach(function(r){s+=gr(r[0],0,r[1]-r[0],260,.16,'#87918d');});
    M.roadsY.forEach(function(r){s+=gr(0,r[0],280,r[1]-r[0],.17,'#87918d');});
    add('street','street',-97,s,[195,200,.2]);s='';
    [96,192].forEach(function(rx){for(y=23;y<240;y+=11) if(!M.roadsY.some(function(r){return y>r[0]-4&&y<r[1]+4;}))s+=gr(rx-.4,y,.8,5,.2,'#e7d7ae');});
    [86,174].forEach(function(ry){for(x=23;x<260;x+=11) if(!M.roadsX.some(function(r){return x>r[0]-4&&x<r[1]+4;}))s+=gr(x,ry-.4,5,.8,.21,'#e7d7ae');});
    deco(-96,s);
    add('intersection','intersection',-95,gr(86,164,20,20,.22,'#89938f'),[96,174,.22]);
    s='';
    [86,182].forEach(function(rx){[76,164].forEach(function(ry){
      for(j=0;j<6;j++) {
        s+=gr(rx+1+j*3,ry-6,1.6,4,.24,'#f4ead5')+gr(rx+1+j*3,ry+22,1.6,4,.24,'#f4ead5');
        s+=gr(rx-6,ry+1+j*3,4,1.6,.24,'#f4ead5')+gr(rx+22,ry+1+j*3,4,1.6,.24,'#f4ead5');
      }
    });});
    add('crosswalk','crosswalk',-94,s,[96,188,.24]);
    // Franjas de estacionamiento y plaza de acceso a los servicios.
    s=gr(211,194,45,45,.2,'#b6bcb1');
    for(j=0;j<4;j++)s+=ln([214+j*10,199,.25],[214+j*10,218,.25],'#eee4cd',1.4);
    s+=G.sign('P',248,222,.3,12,'#f4ebd6');
    add('parking','parking',-93,s,[249,232,.2]);
    s=gr(110,100,68,60,.2,'#94b580')+gr(112,102,64,56,.25,'#a7c28c');
    add('park','park',-92,s,[114,129,.3]);
    deco(-91,gr(136,100,7,60,.3,'#e1d2b0')+gr(111,129,66,6,.31,'#e1d2b0'));
    add('playground','playground',-90,gr(146,108,23,19,.35,'#d9ba8d'),[166,124,.4]);
    M.buildings.forEach(function(o){
      // Sombras al suelo, siempre detrás de la geometría elevada.
      deco(-89,gr(o.x+2,o.y+3,o.w+3,o.d+3,.35,'#657d6a') .replace('fill="#657d6a"','fill="#657d6a" fill-opacity=".15"'));
      add(o.id,o.id,o.x+o.w/2+o.y+o.d/2,G.building(o),[o.x+o.w/2,o.y+o.d,o.h*.65]);
    });
    // Fuente con base apoyada y vaso de agua.
    s=I.cylZ(128,118,.3,1.7,7,'#c4c7b5')+I.cylZ(128,118,1.7,2.1,5.7,'#8ebfc0')+I.cylZ(128,118,2.1,5,1,'#d9d6be');
    s+=ln([128,118,8],[125,118,3],'#cee4dc',1.8)+ln([128,118,8],[131,118,3],'#cee4dc',1.8);
    add('fountain','fountain',246,s,[128,118,5],true);
    // Hamaca: patas, travesaño, cadenas y asiento.
    s='';
    [148,160].forEach(function(sx){s+=ln([sx,109,.4],[sx,113,12],'#b48963',2)+ln([sx,117,.4],[sx,113,12],'#b48963',2);});
    s+=ln([148,113,12],[160,113,12],'#b48963',2.5);
    [152,156].forEach(function(sx){s+=ln([sx,113,12],[sx,113,3],'#667b77',.8);});
    s+=b(151,112,2.5,157,114,3.2,'#678f86');
    add('swing','swing',267,s,[154,113,7],true);
    s=b(153,141,.4,159,147,7,'#9caa91')+b(153,141,7,159,147,7.7,'#d4aa6d');
    s+=f([[153,147,7.7],[159,147,7.7],[159,155,.5],[153,155,.5]],'#c58a6d');
    s+=ln([153,147,8],[153,155,1],'#dfbc84',1.5)+ln([159,147,8],[159,155,1],'#dfbc84',1.5);
    for(j=1;j<4;j++)s+=b(153,140-j*1.5,0,159,141-j*1.5,7-j*1.6,'#c4b392');
    add('slide','slide',302,s,[156,149,6],true);
    M.objects.forEach(function(o){var kind=o[0],x=o[2],y=o[3],z=kind==='tree'?17:kind==='lamp'?20:kind==='bus-stop'?12:kind==='traffic-light'?17:5;
      add(o[1],kind,x+y+(kind==='car'?10:kind==='bus-stop'?8:0),G.prop(kind,x,y,o[4]),[x+(kind==='car'?3:kind==='bench'?4:0),y,z],kind!=='tree'&&kind!=='car');
    });
    // Mesitas de la cafetería y faroles del restaurante, dentro de sus veredas.
    [122,136].forEach(function(tx){
      var ty=233, table=I.cylZ(tx,ty,.3,4,.5,'#71857b')+I.cylZ(tx,ty,4,4.5,3,'#c7aa7b');
      table+=b(tx-5,ty-1,.3,tx-4.3,ty+1,2.5,'#71857b')+b(tx-5.5,ty-1.5,2.5,tx-3.8,ty+1.5,3,'#b69168');
      table+=b(tx+4.3,ty-1,.3,tx+5,ty+1,2.5,'#71857b')+b(tx+3.8,ty-1.5,2.5,tx+5.5,ty+1.5,3,'#b69168');
      deco(tx+ty,table);
    });
    [152,171].forEach(function(tx){
      deco(tx+223,ln([tx,222,13],[tx,222,10],'#71857b',.7)+I.cylZ(tx,222,8.2,10,1,'#ce8a63'));
    });
    // Jardines de las viviendas, senderos y cerco bajo.
    deco(-88,gr(22,229,57,12,.3,'#99b37e')+gr(34,226,6,19,.4,'#d8c8a5'));
    deco(320,ln([22,240,1],[32,240,1],'#b49473',2)+ln([42,240,1],[79,240,1],'#b49473',2));
    // Detalles educativos independientes sobre la casa de LabelLearn.
    add('home-roof','roof',249.01,G.roof(M.buildings.filter(function(o){return o.id==='home';})[0]),[38,211,31],true);
    add('home-entrance','entrance',249.02,b(36,225.7,.7,40,226.3,11,'#78938a'),[38,227,6],true);
    add('home-window','window',249.03,f([[45,225.3,6],[49,225.3,6],[49,225.3,12],[45,225.3,12]],'#88acb0'),[47,226,10],true);
    return sc;
  }
  window.LabelCityScene={create:create};
})();
