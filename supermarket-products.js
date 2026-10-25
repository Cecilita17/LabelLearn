// Catálogo de frescos. Un tipo de producto = una posición seleccionable, no una pieza por unidad.
(function () {
  var V=window.SupermarketVocab;
  var groups={
    produce:[
      ['apple','苹果','píngguǒ','Manzana','Apple'],['banana','香蕉','xiāngjiāo','Banana','Banana'],
      ['orange','橙子','chéngzi','Naranja','Orange'],['mandarin','橘子','júzi','Mandarina','Mandarin'],
      ['pear','梨','lí','Pera','Pear'],['grapes','葡萄','pútao','Uva','Grapes'],
      ['strawberry','草莓','cǎoméi','Frutilla','Strawberry'],['peach','桃子','táozi','Durazno','Peach'],
      ['watermelon','西瓜','xīguā','Sandía','Watermelon'],['melon','甜瓜','tiánguā','Melón','Melon'],
      ['pineapple','菠萝','bōluó','Ananá','Pineapple'],['kiwi','猕猴桃','míhóutáo','Kiwi','Kiwi'],
      ['lemon','柠檬','níngméng','Limón','Lemon'],['mango','芒果','mángguǒ','Mango','Mango'],
      ['cherry','樱桃','yīngtáo','Cereza','Cherry'],
      ['potato','土豆','tǔdòu','Papa','Potato'],['onion','洋葱','yángcōng','Cebolla','Onion'],
      ['carrot','胡萝卜','húluóbo','Zanahoria','Carrot'],['tomato','番茄','fānqié','Tomate','Tomato'],
      ['lettuce','生菜','shēngcài','Lechuga','Lettuce'],['cucumber','黄瓜','huángguā','Pepino','Cucumber'],
      ['broccoli','西兰花','xīlánhuā','Brócoli','Broccoli'],['cauliflower','菜花','càihuā','Coliflor','Cauliflower'],
      ['spinach','菠菜','bōcài','Espinaca','Spinach'],['pepper','甜椒','tiánjiāo','Morrón','Bell pepper'],
      ['garlic','大蒜','dàsuàn','Ajo','Garlic'],['aubergine','茄子','qiézi','Berenjena','Eggplant'],
      ['pumpkin','南瓜','nánguā','Zapallo','Pumpkin'],['zucchini','西葫芦','xīhúlu','Zucchini','Zucchini'],
      ['cabbage','卷心菜','juǎnxīncài','Repollo','Cabbage']
    ],
    bakery:[
      ['white-bread','白面包','bái miànbāo','Pan blanco','White bread'],['wholemeal-bread','全麦面包','quánmài miànbāo','Pan integral','Wholemeal bread'],
      ['baguette','法棍','fǎgùn','Baguette','Baguette'],['sliced-bread','吐司面包','tǔsī miànbāo','Pan de molde','Sandwich bread'],
      ['croissant','可颂','kěsòng','Medialuna (croissant)','Croissant'],['doughnut','甜甜圈','tiántiánquān','Dona','Doughnut'],
      ['muffin','玛芬蛋糕','mǎfēn dàngāo','Muffin','Muffin'],['biscuit','饼干','bǐnggān','Galletitas','Cookies'],
      ['cake','蛋糕','dàngāo','Torta','Cake'],['pie','水果派','shuǐguǒ pài','Tarta de frutas','Fruit pie'],
      ['pastries','糕点','gāodiǎn','Facturas y pastelería','Pastries']
    ],
    butcher:[
      ['beef','牛肉','niúròu','Carne vacuna','Beef'],['pork','猪肉','zhūròu','Carne de cerdo','Pork'],
      ['whole-chicken','整鸡','zhěngjī','Pollo entero','Whole chicken'],['chicken-breast','鸡胸肉','jīxiōngròu','Pechuga de pollo','Chicken breast'],
      ['mince','肉末','ròumò','Carne picada','Minced meat'],['ribs','排骨','páigǔ','Costillas','Ribs'],
      ['steak','牛排','niúpái','Bife','Steak'],['sausage','香肠','xiāngcháng','Salchichas','Sausages']
    ],
    fish:[
      ['whole-fish','整条鱼','zhěng tiáo yú','Pescado entero','Whole fish'],['fillet','鱼片','yúpiàn','Filete de pescado','Fish fillet'],
      ['salmon','三文鱼','sānwényú','Salmón','Salmon'],['tuna','金枪鱼','jīnqiāngyú','Atún','Tuna'],
      ['shrimp','虾','xiā','Camarones','Shrimp'],['squid','鱿鱼','yóuyú','Calamares','Squid'],
      ['shellfish','贝类','bèilèi','Mariscos de concha','Shellfish']
    ],
    deli:[
      ['ham','火腿','huǒtuǐ','Jamón','Ham'],['cheese-slices','奶酪片','nǎilàopiàn','Queso en fetas','Sliced cheese'],
      ['salami','萨拉米','sàlāmǐ','Salame','Salami'],['cheese-block','奶酪','nǎilào','Queso','Cheese'],
      ['cold-cuts','冷切肉拼盘','lěngqièròu pīnpán','Fiambres variados','Cold cuts platter']
    ],
    dairy:[
      ['milk','牛奶','niúnǎi','Leche','Milk'],['yogurt','酸奶','suānnǎi','Yogur','Yogurt'],
      ['butter','黄油','huángyóu','Manteca','Butter'],['cream','奶油','nǎiyóu','Crema','Cream'],
      ['cheese','奶酪','nǎilào','Queso','Cheese'],['cream-cheese','奶油奶酪','nǎiyóu nǎilào','Queso crema','Cream cheese'],
      ['dairy-dessert','奶布丁','nǎi bùdīng','Postre lácteo','Milk pudding']
    ],
    eggs:[['eggs','鸡蛋','jīdàn','Huevos','Eggs']],
    frozen:[
      ['ice-cream','冰淇淋','bīngqílín','Helados','Ice cream'],['frozen-vegetables','冷冻蔬菜','lěngdòng shūcài','Verduras congeladas','Frozen vegetables'],
      ['frozen-fries','冷冻薯条','lěngdòng shǔtiáo','Papas fritas congeladas','Frozen fries'],['frozen-pizza','冷冻比萨','lěngdòng bǐsà','Pizza congelada','Frozen pizza'],
      ['frozen-fish','冷冻鱼','lěngdòng yú','Pescado congelado','Frozen fish'],['ready-meal','冷冻方便餐','lěngdòng fāngbiàncān','Comida preparada congelada','Frozen ready meal']
    ]
  };
  // Se conservan los IDs de la primera entrega; se precisan tres nombres antes genéricos.
  var aliases={'white-bread':'bread',beef:'meat','whole-fish':'fish-product','cheese-block':'cheese'};
  var oldIds={apple:'product-apple',carrot:'product-carrot','white-bread':'product-bread',beef:'product-meat','whole-fish':'product-fish-product',ham:'product-ham',milk:'product-milk',eggs:'product-egg-carton','ice-cream':'product-ice-cream'};
  var products=[];
  Object.keys(groups).forEach(function(zone){groups[zone].forEach(function(r,index){
    var word=aliases[r[0]]||r[0];
    if(!V[word]||['bread','meat','fish-product'].indexOf(word)>=0)V[word]={id:word,zh:r[1],py:r[2],es:r[3],en:r[4],kind:'object',e:''};
    products.push({id:oldIds[r[0]]||'fresh-'+r[0],model:r[0],word:word,zone:zone,index:index});
  });});
  var terms=[
    ['bottle','瓶子','píngzi','Botella','Bottle'],['box','盒子','hézi','Caja','Box'],
    ['can','罐子','guànzi','Lata','Can'],['container-bag','袋子','dàizi','Bolsa','Bag'],
    ['package','包','bāo','Paquete','Pack'],['tray','托盘','tuōpán','Bandeja','Tray'],
    ['kilogram','公斤','gōngjīn','Kilo','Kilogram'],['half-kilo','半公斤','bàn gōngjīn','Medio kilo','Half a kilogram'],
    ['litre','升','shēng','Litro','Litre'],['price-kg','每公斤价格','měi gōngjīn jiàgé','Precio por kilo','Price per kilogram'],
    ['fresh-food','新鲜食品','xīnxiān shípǐn','Producto fresco','Fresh food']
  ];
  var fixtures=[
    ['display-crate','果蔬筐','guǒshūkuāng','Cajón de frutas y verduras','Produce crate'],
    ['produce-bag','果蔬袋','guǒshūdài','Bolsa para frutas y verduras','Produce bag'],
    ['restock-cart','补货车','bǔhuòchē','Carrito de reposición','Restocking cart'],
    ['display-case','展示柜','zhǎnshìguì','Vitrina','Display case'],['bread-rack','面包架','miànbāojià','Estante de pan','Bread rack'],
    ['tongs','食品夹','shípǐnjiā','Pinzas para alimentos','Food tongs'],['paper-bag','纸袋','zhǐdài','Bolsa de papel','Paper bag'],
    ['counter','柜台','guìtái','Mostrador','Counter'],['chilled-case','冷藏展示柜','lěngcáng zhǎnshìguì','Mostrador refrigerado','Refrigerated display case'],
    ['cutting-board','砧板','zhēnbǎn','Tabla de cortar','Cutting board'],['wrapping-machine','保鲜膜包装机','bǎoxiānmó bāozhuāngjī','Máquina para envolver','Wrapping machine'],
    ['ice','冰块','bīngkuài','Hielo en cubos','Ice cubes'],['slicer','切片机','qiēpiànjī','Cortadora de fiambre','Deli slicer'],
    ['wrapping-paper','包装纸','bāozhuāngzhǐ','Papel para envolver','Wrapping paper'],['fridge','冷藏柜','lěngcángguì','Heladera de exhibición','Refrigerated cabinet'],
    ['chest-freezer','卧式冰柜','wòshì bīngguì','Freezer horizontal','Chest freezer'],['upright-freezer','立式冷冻柜','lìshì lěngdòngguì','Freezer vertical','Upright freezer']
  ];
  [[terms,'term'],[fixtures,'object']].forEach(function(g){g[0].forEach(function(r){if(!V[r[0]])V[r[0]]={id:r[0],zh:r[1],py:r[2],es:r[3],en:r[4],kind:g[1],e:''};});});
  window.SupermarketProducts={products:products,groups:groups,terms:terms.map(function(r){return r[0];}).concat(['frozen']),zones:Object.keys(groups)};
})();
