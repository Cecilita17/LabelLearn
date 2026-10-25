// Planta de 18 × 16 m. Pasillos de 1,4 m entre góndolas y corredores transversales.
(function () {
  var zones = [
    {id:'entry',x:4,y:138,w:34,d:20,zoom:4,color:'#7f9d88'},
    {id:'service',x:4,y:116,w:22,d:13,zoom:5,color:'#78968b'},
    {id:'produce',x:30,y:108,w:22,d:18,zoom:4.5,color:'#94a874'},
    {id:'bakery',x:7,y:5,w:32,d:17,zoom:4.5,color:'#bf9466'},
    {id:'butcher',x:46,y:5,w:32,d:17,zoom:4.5,color:'#c38b83'},
    {id:'fish',x:85,y:5,w:32,d:17,zoom:4.5,color:'#7eabb0'},
    {id:'deli',x:124,y:5,w:46,d:17,zoom:4,color:'#c7aa70'},
    {id:'dairy',x:1,y:27,w:11,d:18,zoom:5,color:'#8daead'},
    {id:'eggs',x:1,y:50,w:11,d:17,zoom:5,color:'#b3ad87'},
    {id:'frozen',x:1,y:71,w:10,d:23,zoom:5,color:'#8cabb7'},
    {id:'groceries',x:30,y:40,w:10,d:24,stock:'rice',zoom:5,color:'#ae9e6b'},
    {id:'breakfast',x:30,y:67,w:10,d:27,stock:'cereal',zoom:5,color:'#bba479'},
    {id:'snacks',x:54,y:40,w:10,d:24,stock:'chips',zoom:5,color:'#c69479'},
    {id:'drinks',x:54,y:67,w:10,d:27,stock:'water',zoom:5,color:'#83a7ae'},
    {id:'condiments',x:78,y:40,w:10,d:24,stock:'soy-sauce',zoom:5,color:'#b69970'},
    {id:'international',x:78,y:67,w:10,d:27,stock:'pasta',zoom:5,color:'#b39a7d'},
    {id:'cleaning',x:102,y:40,w:10,d:24,stock:'detergent',zoom:5,color:'#86a4ab'},
    {id:'hygiene',x:102,y:67,w:10,d:27,stock:'shampoo',zoom:5,color:'#a59aaf'},
    {id:'baby',x:126,y:40,w:10,d:24,stock:'diapers',zoom:5,color:'#b1a9b2'},
    {id:'pets',x:126,y:67,w:10,d:27,stock:'pet-food',zoom:5,color:'#a6997b'},
    {id:'household',x:150,y:40,w:10,d:54,stock:'paper-towels',zoom:4,color:'#96a28a'},
    {id:'checkout',x:60,y:99,w:62,d:49,zoom:3.1,color:'#7e9d8c'},
    {id:'selfcheckout',x:126,y:101,w:50,d:46,zoom:4,color:'#83a4a4'},
    {id:'bagging',x:66,y:139,w:51,d:10,zoom:4,color:'#acb296'},
    {id:'exit',x:108,y:151,w:60,d:9,zoom:3.5,color:'#7f9d88'}
  ];
  var byId = {}; zones.forEach(function(z){byId[z.id]=z;});
  window.SupermarketLayout = { width:180, depth:160, zones:zones, byId:byId,
    checkouts:[{id:'lane-1',x:71,y:112},{id:'lane-2',x:101,y:112}],
    terminals:[{id:'self-1',x:128,y:110},{id:'self-2',x:154,y:110},{id:'self-3',x:128,y:132},{id:'self-4',x:154,y:132}] };
})();
