// Fuente urbana independiente: ID estable, hanzi, pinyin con tonos y ES/EN.
(function () {
  var rows = [
    ['home','房子','fángzi','Casa de LabelLearn','LabelLearn house','🏠'],
    ['apartments','公寓','gōngyù','Departamentos','Apartments','🏢'],
    ['house','住宅','zhùzhái','Vivienda','Residence','🏡'],
    ['supermarket','超市','chāoshì','Supermercado','Supermarket','🛒'],
    ['pharmacy','药店','yàodiàn','Farmacia','Pharmacy','💊'],
    ['bakery','面包店','miànbāodiàn','Panadería','Bakery','🥖'],
    ['cafe','咖啡馆','kāfēiguǎn','Cafetería','Café','☕'],
    ['restaurant','餐厅','cāntīng','Restaurante','Restaurant','🍜'],
    ['school','学校','xuéxiào','Escuela','School','🏫'],
    ['hospital','医院','yīyuàn','Hospital','Hospital','🏥'],
    ['library','图书馆','túshūguǎn','Biblioteca','Library','📚'],
    ['bank','银行','yínháng','Banco','Bank','🏦'],
    ['police','警察局','jǐngchájú','Comisaría','Police station','🚓'],
    ['street','街道','jiēdào','Calle','Street','🛣️'],
    ['intersection','十字路口','shízì lùkǒu','Intersección','Intersection','➕'],
    ['sidewalk','人行道','rénxíngdào','Vereda','Sidewalk','🚶'],
    ['crosswalk','斑马线','bānmǎxiàn','Paso peatonal','Crosswalk','🚸'],
    ['traffic-light','红绿灯','hónglǜdēng','Semáforo','Traffic light','🚦'],
    ['stop-sign','停车标志','tíngchē biāozhì','Señal de pare','Stop sign','🛑'],
    ['lamp','路灯','lùdēng','Farola','Streetlight','💡'],
    ['tree','树','shù','Árbol','Tree','🌳'],
    ['bench','长椅','chángyǐ','Banco de plaza','Bench','🪑'],
    ['car','汽车','qìchē','Auto','Car','🚗'],
    ['bus-stop','公交车站','gōngjiāochēzhàn','Parada de colectivo','Bus stop','🚏'],
    ['park','公园','gōngyuán','Plaza','Park','🌳'],
    ['playground','游乐场','yóulèchǎng','Juegos infantiles','Playground','🛝'],
    ['slide','滑梯','huátī','Tobogán','Slide','🛝'],
    ['swing','秋千','qiūqiān','Hamaca','Swing','🛝'],
    ['fountain','喷泉','pēnquán','Fuente','Fountain','⛲'],
    ['flowers','花坛','huātán','Cantero','Flower bed','🌷'],
    ['bin','垃圾桶','lājītǒng','Cesto de basura','Trash bin','🗑️'],
    ['bike','自行车','zìxíngchē','Bicicleta','Bicycle','🚲'],
    ['parking','停车场','tíngchēchǎng','Estacionamiento','Parking lot','🅿️'],
    ['mailbox','邮筒','yóutǒng','Buzón','Mailbox','📮'],
    ['hydrant','消防栓','xiāofángshuān','Hidrante','Fire hydrant','🧯'],
    ['entrance','入口','rùkǒu','Entrada','Entrance','🚪'],
    ['roof','屋顶','wūdǐng','Tejado','Roof','🏠'],
    ['window','窗户','chuānghu','Ventana','Window','🪟']
  ];
  var words = {};
  rows.forEach(function (r) { words[r[0]] = { id: r[0], zh: r[1], py: r[2], es: r[3], en: r[4], e: r[5] }; });
  window.LabelCityVocab = words;
})();
