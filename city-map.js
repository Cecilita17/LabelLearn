// Barrio compacto: dos ejes conectados y un anillo perimetral; nueve manzanas.
// Unidades del motor: 10 cm. Escala de maqueta, fachadas hacia las calles.
window.LabelCityMap = {
  width: 280, depth: 260,
  roadsX: [[0, 14], [86, 106], [182, 202], [266, 280]],
  roadsY: [[0, 14], [76, 96], [164, 184], [246, 260]],
  buildings: [
    { id: 'hospital', x: 22, y: 24, w: 54, d: 40, h: 31, color: '#e8e6d9', accent: '#cf6a62', type: 'hospital', sign: '医院' },
    { id: 'school', x: 116, y: 24, w: 55, d: 39, h: 27, color: '#e9bd78', accent: '#527c89', type: 'school', sign: '学校' },
    { id: 'apartments', x: 212, y: 23, w: 42, d: 40, h: 48, color: '#e0b7a2', accent: '#617f84', type: 'apartments', sign: '公寓' },
    { id: 'supermarket', x: 22, y: 106, w: 53, d: 21, h: 19, color: '#e5dbc6', accent: '#6e976d', type: 'shop', sign: '超市' },
    { id: 'pharmacy', x: 22, y: 138, w: 23, d: 17, h: 18, color: '#e4ebe0', accent: '#5a987c', type: 'shop', sign: '药店' },
    { id: 'bakery', x: 50, y: 138, w: 25, d: 17, h: 18, color: '#f0d9b1', accent: '#bb7554', type: 'bakery', sign: '面包店' },
    { id: 'library', x: 212, y: 105, w: 42, d: 23, h: 26, color: '#d8cbb7', accent: '#648b8f', type: 'library', sign: '图书馆' },
    { id: 'bank', x: 212, y: 140, w: 20, d: 16, h: 21, color: '#dedbd0', accent: '#758b88', type: 'bank', sign: '银行' },
    { id: 'police', x: 237, y: 140, w: 19, d: 16, h: 20, color: '#d5e0e0', accent: '#537488', type: 'police', sign: '警察局' },
    { id: 'home', x: 24, y: 198, w: 28, d: 27, h: 22, color: '#f1d7b0', accent: '#c17b5e', type: 'home', sign: 'LabelLearn' },
    { id: 'house', x: 61, y: 201, w: 17, d: 24, h: 20, color: '#d4dfce', accent: '#658b84', type: 'house', sign: '' },
    { id: 'cafe', x: 117, y: 198, w: 25, d: 24, h: 20, color: '#e8ceba', accent: '#728d83', type: 'shop', sign: '咖啡馆' },
    { id: 'restaurant', x: 149, y: 198, w: 25, d: 24, h: 22, color: '#edd7b9', accent: '#b76d59', type: 'shop', sign: '餐厅' }
  ],
  // Cada instancia conserva su ID; el vocabulario puede compartirse.
  objects: [
    ['tree','tree-oak',117,107], ['tree','tree-elm',171,107], ['tree','tree-park',171,155],
    ['tree','tree-hospital',78,30], ['tree','tree-school',174,31], ['tree','tree-home',21,234],
    ['tree','tree-east',258,220], ['tree','tree-south',214,232],
    ['bench','bench-park',118,142], ['bench','bench-fountain',160,152],
    ['bench','bench-library',257,119], ['lamp','lamp-west',81,69], ['lamp','lamp-east',205,158],
    ['lamp','lamp-south',179,235], ['traffic-light','signal-center',109,73],
    ['traffic-light','signal-east',179,161], ['stop-sign','stop-school',179,70],
    ['bus-stop','bus-school',139,69], ['bus-stop','bus-east',232,239],
    ['car','car-blue',88,115,'#759eaf'], ['car','car-cream',88,207,'#e8ce88'],
    ['car','car-red',271,131,'#bd7765'], ['car','car-parking',221,209,'#8aa49a'],
    ['bin','bin-park',113,151], ['mailbox','mail-west',78,135], ['hydrant','hydrant-east',259,162],
    ['bike','bike-cafe',145,229], ['flowers','flowers-home',42,235], ['flowers','flowers-school',156,66]
  ]
};
