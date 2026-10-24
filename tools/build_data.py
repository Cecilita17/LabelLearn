#!/usr/bin/env python3
"""Genera data.js a partir de vocab/vocabulario_casa_chino_mandarin.md.

Fuente de verdad:
  - hanzi / pinyin / español  -> el .md
  - emoji / inglés            -> EMOJI (abajo)
  - ubicación en la escena    -> LAYOUT (abajo)

LAYOUT: cada habitación es una lista de columnas "L0|L1|L2|L3" (de abajo hacia arriba):
  L0 = suelo, L1 = sobre un mueble/estante, L2 = pared a media altura, L3 = pared alta / techo.
Uso:  python3 tools/build_data.py
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MD = ROOT / 'vocab' / 'vocabulario_casa_chino_mandarin.md'

# id, sección del .md, hanzi, pinyin, es, en, emoji, exterior?
ROOMS = [
    ('structure', 1, '房屋结构', 'fángwū jiégòu', 'Estructura', 'Structure', '🏠', 0),
    ('bedroom', 2, '卧室', 'wòshì', 'Dormitorio', 'Bedroom', '🛏️', 0),
    ('living', 3, '客厅', 'kètīng', 'Sala de estar', 'Living room', '🛋️', 0),
    ('kitchen', 4, '厨房', 'chúfáng', 'Cocina', 'Kitchen', '🍳', 0),
    ('bathroom', 5, '浴室', 'yùshì', 'Baño', 'Bathroom', '🛁', 0),
    ('laundry', 6, '洗衣房', 'xǐyīfáng', 'Lavadero', 'Laundry room', '🧺', 0),
    ('dining', 7, '餐厅', 'cāntīng', 'Comedor', 'Dining room', '🍽️', 0),
    ('kids', 8, '儿童房', 'értóngfáng', 'Habitación infantil', "Kids' room", '🧸', 0),
    ('study', 9, '书房', 'shūfáng', 'Estudio', 'Study', '💻', 0),
    ('entrance', 10, '玄关', 'xuánguān', 'Entrada y pasillo', 'Entrance & hallway', '🚪', 0),
    ('garden', 11, '院子', 'yuànzi', 'Patio, balcón y jardín', 'Yard, balcony & garden', '🌳', 1),
    ('misc', 12, '日常杂物', 'rìcháng záwù', 'Objetos pequeños', 'Small things', '🔑', 0),
    ('positions', 13, '位置', 'wèizhi', 'Posiciones', 'Positions', '📍', 0),
]

LAYOUT = {
    'structure': ['地板|瓷砖|墙|天花板', '门|门把手|门锁|门框', '钥匙|窗台|窗户|窗框', '|窗帘|百叶窗|通风口',
                  '台阶|楼梯|走廊|阳台', '插头|插座|电灯开关|灯泡', '踢脚线|电线|裂缝|角落', '房子|公寓|房间|屋顶'],
    'bedroom': ['床底下|床架|床头板|床头', '床|床垫|床单|被子', '被套|枕头|枕套|毯子', '床头柜|台灯|闹钟|空调',
                '衣柜|衣架|镜子|电风扇', '抽屉柜|抽屉|架子|书架', '梳妆台|加湿器|全身镜|收纳盒',
                '地毯|脏衣篮|一堆衣服|叠好的衣服', '散落的衣服|纸箱||'],
    'living': ['沙发|靠垫|毯子|挂画', '扶手椅|边桌|落地灯|吊灯', '地毯|茶几|杂志|天花板灯', '电视柜|游戏机|电视|音箱',
               '书柜|书架|相框|时钟', '盆栽|植物|花瓶|', '玩具箱|玩具|充电器|插线板', '垃圾桶|杂物|一堆东西|遥控器'],
    'kitchen': ['冰箱|冷冻室|保鲜盒|保鲜膜', '炉灶|燃气灶|调料架|抽油烟机', '烤箱|微波炉|烤面包机|铝箔纸',
                '水槽|洗碗池里的脏盘子|水龙头|洗碗海绵', '橱柜|台面|电饭煲|电水壶', '洗碗机|沥水架|洗碗布|抹布',
                '垃圾袋|咖啡机|搅拌机|洗洁精', '锅|锅盖|平底锅|菜刀', '砧板|勺子|叉子|筷子', '盘子|碗|杯子|玻璃杯',
                '马克杯|盐|糖|油', '剩饭|||'],
    'bathroom': ['马桶|马桶盖|冲水按钮|厕纸架', '马桶刷|厕纸|毛巾架|毛巾', '浴室柜|洗手池|镜柜|镜子',
                 '浴室防滑垫|淋浴|淋浴喷头|浴帘', '浴缸|沐浴露|洗发水|护发素', '地漏|排水管|浴巾|水垢',
                 '肥皂|洗手液|牙刷杯|牙刷', '牙膏|梳子|吹风机|剃须刀', '指甲刀|棉签|化妆棉|护肤品'],
    'laundry': ['洗衣机|洗衣液|洗衣粉|柔顺剂', '烘干机|漂白剂|清洁剂|刷子', '洗衣篮|脏衣服|干净衣服|湿衣服',
                '熨衣板|熨斗|衣夹|晾衣绳', '水桶|拖把|扫帚|簸箕', '晾衣架|吸尘器|手套|抹布', '垃圾桶|||'],
    'dining': ['餐桌|桌布|餐垫|吊灯', '桌子腿|餐具|餐巾|餐巾纸', '餐椅|椅垫|椅背|', '高脚椅|儿童餐椅||',
               '餐具柜|托盘|水果盘|花瓶', '水壶|水杯|食物残渣|污渍'],
    'kids': ['婴儿床|婴儿床垫|床围|婴儿毯', '小床|安抚奶嘴|夜灯|婴儿监视器', '换尿布台|尿布|湿巾|奶瓶',
             '游戏垫|爬行垫|玩具车|积木', '玩具箱|玩具|毛绒玩具|洋娃娃', '玩具架|拼图|绘本|故事书',
             '儿童衣柜|小桌子|小椅子|', '乱放的玩具|一堆玩具||'],
    'study': ['办公椅|书桌|台灯|日历', '电脑|显示器|摄像头|麦克风', '键盘|鼠标|鼠标垫|耳机',
              '笔记本电脑|平板电脑|电子阅读器|充电线', '笔记本|铅笔|圆珠笔|橡皮', '尺子|剪刀|胶水|便签纸',
              '打印机|文件夹|文件|纸张', '垃圾桶|书堆|杂乱的桌面|'],
    'entrance': ['门垫|大门|门铃|走廊灯', '门槛|楼梯扶手||', '鞋柜|鞋架|鞋子|拖鞋', '伞架|雨伞|穿衣镜|',
                 '衣帽架|外套|挂钩|钥匙挂钩', '背包|包|购物袋|', '纸箱|快递包裹||'],
    'garden': ['草坪|院子|后院|花园', '草|花盆|花|', '泥土|树|树枝|树叶', '石头|围墙|栅栏|栏杆', '户外椅|户外桌|遮阳伞|',
               '水管|浇水壶|扫帚|晾衣绳', '落叶|水坑|排水沟|垃圾桶'],
    'misc': ['手机|手机壳|充电宝|电池', '眼镜|钱包|硬币|钥匙串', '纸巾盒|纸巾|塑料袋|遥控器', '箱子|盒子|篮子|瓶子',
             '盖子|绳子|胶带|蜘蛛网', '垃圾|纸屑|碎片|灰尘', '污垢|水渍||'],
    'positions': ['下面|中间|上面|', '左边|旁边|右边|', '外面|里面|前面|后面', '对面|附近|角落里|到处'],
}

EMOJI = """
房子 🏠 house
公寓 🏢 apartment
房间 🚪 room
墙 🧱 wall
天花板 ⬜ ceiling
屋顶 🔺 roof
地板 🟫 floor
瓷砖 🔲 tile
门 🚪 door
门框 🔳 door frame
门把手 🔘 door handle
门锁 🔒 lock
钥匙 🔑 key
窗户 🪟 window
窗框 🖼️ window frame
窗台 🌼 windowsill
窗帘 🎭 curtain
百叶窗 🟰 blinds
楼梯 🪜 stairs
台阶 👣 step
走廊 🛤️ hallway
阳台 🌇 balcony
插座 🔌 power outlet
插头 ⚡ plug
电线 🧵 electric wire
电灯开关 🎛️ light switch
灯泡 💡 light bulb
通风口 🌬️ air vent
踢脚线 ➖ baseboard
裂缝 💥 crack
角落 📐 corner
床 🛏️ bed
床架 🪵 bed frame
床垫 🛌 mattress
床单 🟦 bed sheet
被子 🛌 comforter
毯子 🧶 blanket
枕头 💤 pillow
枕套 ✉️ pillowcase
被套 👝 duvet cover
床头板 🚧 headboard
床头柜 🗄️ nightstand
台灯 💡 desk lamp
衣柜 🧥 wardrobe
衣架 👔 clothes hanger
抽屉 🗃️ drawer
抽屉柜 🗳️ chest of drawers
架子 🪜 shelf
书架 📚 bookshelf
镜子 🪞 mirror
全身镜 🪞 full-length mirror
梳妆台 💄 vanity table
地毯 🟥 rug
闹钟 ⏰ alarm clock
电风扇 🌀 electric fan
空调 ❄️ air conditioner
加湿器 💨 humidifier
脏衣篮 🧺 laundry basket
一堆衣服 👕 pile of clothes
叠好的衣服 👚 folded clothes
散落的衣服 👖 scattered clothes
纸箱 📦 cardboard box
收纳盒 🧰 storage box
床底下 ⬇️ under the bed
床头 🔝 head of the bed
沙发 🛋️ sofa
扶手椅 🪑 armchair
靠垫 🟧 cushion
茶几 ☕ coffee table
边桌 🕯️ side table
电视 📺 television
遥控器 🕹️ remote control
电视柜 📼 TV stand
书柜 📕 bookcase
落地灯 🏮 floor lamp
吊灯 🔆 pendant light
天花板灯 🔅 ceiling light
挂画 🖼️ wall painting
相框 📷 photo frame
花瓶 🏺 vase
盆栽 🪴 potted plant
植物 🌿 plant
时钟 🕰️ wall clock
音箱 🔊 speaker
游戏机 🎮 game console
玩具 🧩 toys
玩具箱 🧸 toy box
杂志 📰 magazine
充电器 🔋 charger
插线板 🔌 power strip
垃圾桶 🗑️ trash can
杂物 🧳 odds and ends
一堆东西 📦 pile of stuff
冰箱 🧊 fridge
冷冻室 ❄️ freezer
炉灶 🍳 stove
燃气灶 🔥 gas stove
烤箱 ♨️ oven
微波炉 📟 microwave
水槽 🚰 sink
水龙头 💧 tap
橱柜 🚪 kitchen cabinet
台面 ⬛ countertop
抽油烟机 🌫️ range hood
洗碗机 🫧 dishwasher
电饭煲 🍚 rice cooker
电水壶 🫖 electric kettle
咖啡机 ☕ coffee maker
搅拌机 🥤 blender
烤面包机 🍞 toaster
锅 🍲 pot
平底锅 🥘 frying pan
锅盖 🥡 pot lid
菜刀 🔪 kitchen knife
砧板 🪵 cutting board
勺子 🥄 spoon
叉子 🍴 fork
筷子 🥢 chopsticks
盘子 🍽️ plate
碗 🥣 bowl
杯子 🥛 cup
玻璃杯 🥃 glass
马克杯 🍵 mug
洗碗海绵 🧽 dish sponge
洗洁精 🧴 dish soap
抹布 🧼 cleaning rag
洗碗布 🧻 dish towel
沥水架 🪣 dish rack
垃圾袋 🛍️ trash bag
保鲜盒 🍱 food container
保鲜膜 🎞️ plastic wrap
铝箔纸 📜 aluminum foil
调料架 🫙 spice rack
盐 🧂 salt
糖 🍬 sugar
油 🛢️ oil
洗碗池里的脏盘子 🍝 dirty dishes in the sink
剩饭 🍛 leftovers
马桶 🚽 toilet
马桶盖 🔵 toilet lid
冲水按钮 🔘 flush button
厕纸 🧻 toilet paper
厕纸架 🪝 toilet paper holder
洗手池 🫗 washbasin
镜柜 💊 mirror cabinet
淋浴 🚿 shower
淋浴喷头 💦 shower head
浴缸 🛁 bathtub
浴帘 🎐 shower curtain
毛巾 🧣 towel
浴巾 🏖️ bath towel
毛巾架 🪝 towel rack
肥皂 🧼 soap
洗手液 🧴 hand soap
洗发水 🧴 shampoo
护发素 💇 conditioner
沐浴露 🫧 body wash
牙刷 🪥 toothbrush
牙膏 🦷 toothpaste
牙刷杯 🥤 toothbrush cup
梳子 🪮 comb
吹风机 🌪️ hair dryer
剃须刀 🪒 razor
指甲刀 ✂️ nail clipper
棉签 🪡 cotton swabs
化妆棉 ⚪ cotton pads
护肤品 🧖 skincare products
浴室柜 🗄️ bathroom cabinet
地漏 ⭕ floor drain
排水管 🪠 drain pipe
浴室防滑垫 🟩 non-slip mat
马桶刷 🧹 toilet brush
水垢 🟤 limescale
洗衣机 🫧 washing machine
烘干机 🔥 dryer
洗衣液 🧴 liquid detergent
洗衣粉 🥛 powder detergent
柔顺剂 🌸 fabric softener
漂白剂 🧪 bleach
洗衣篮 🧺 laundry hamper
脏衣服 👕 dirty clothes
干净衣服 👔 clean clothes
湿衣服 💧 wet clothes
晾衣架 🪜 drying rack
晾衣绳 🧵 clothesline
衣夹 📎 clothespin
熨斗 ♨️ iron
熨衣板 📏 ironing board
水桶 🪣 bucket
拖把 🧹 mop
扫帚 🧹 broom
簸箕 🥄 dustpan
吸尘器 🌪️ vacuum cleaner
清洁剂 🧴 cleaning product
刷子 🖌️ scrub brush
手套 🧤 gloves
餐桌 🟫 dining table
餐椅 🪑 dining chair
桌布 🏁 tablecloth
餐垫 ▫️ placemat
餐巾 🧻 napkin
餐巾纸 🧻 paper napkin
餐具 🍴 cutlery
餐具柜 🗄️ sideboard
高脚椅 🪑 high chair
儿童餐椅 👶 baby feeding chair
水壶 🫗 water jug
水杯 🥛 water glass
托盘 🍽️ tray
水果盘 🍇 fruit bowl
桌子腿 🦵 table leg
椅背 🪑 chair back
椅垫 🟧 chair cushion
食物残渣 🥖 crumbs
污渍 🟤 stain
婴儿床 🍼 crib
小床 🛏️ small bed
床围 🟨 crib bumper
婴儿床垫 🟦 crib mattress
换尿布台 🧷 changing table
尿布 👶 diaper
湿巾 🧻 wet wipes
奶瓶 🍼 baby bottle
安抚奶嘴 🍭 pacifier
婴儿毯 🧶 baby blanket
毛绒玩具 🧸 stuffed toy
玩具车 🚗 toy car
积木 🧱 building blocks
拼图 🧩 puzzle
洋娃娃 🪆 doll
绘本 📖 picture book
故事书 📘 storybook
玩具架 🗄️ toy shelf
游戏垫 🟩 play mat
爬行垫 🟪 crawling mat
夜灯 🌙 night light
婴儿监视器 📹 baby monitor
儿童衣柜 🧥 kids' wardrobe
小椅子 🪑 small chair
小桌子 🪑 small table
乱放的玩具 🎲 scattered toys
一堆玩具 🧸 pile of toys
书桌 🗂️ desk
办公椅 💺 office chair
电脑 🖥️ computer
笔记本电脑 💻 laptop
显示器 🖥️ monitor
键盘 ⌨️ keyboard
鼠标 🖱️ mouse
鼠标垫 🟦 mousepad
耳机 🎧 headphones
麦克风 🎙️ microphone
摄像头 📷 webcam
平板电脑 📱 tablet
电子阅读器 📖 e-reader
充电线 🔌 charging cable
笔记本 📓 notebook
铅笔 ✏️ pencil
圆珠笔 🖊️ ballpoint pen
橡皮 🩹 eraser
尺子 📏 ruler
剪刀 ✂️ scissors
胶水 🧴 glue
文件夹 📁 folder
文件 📄 documents
纸张 📃 sheets of paper
打印机 🖨️ printer
便签纸 🗒️ sticky notes
日历 📅 calendar
书堆 📚 pile of books
杂乱的桌面 🌪️ messy desk
大门 🚪 front door
门铃 🔔 doorbell
门垫 🟫 doormat
鞋柜 🗄️ shoe cabinet
鞋架 🪜 shoe rack
鞋子 👟 shoes
拖鞋 🩴 slippers
雨伞 ☂️ umbrella
伞架 🌂 umbrella stand
外套 🧥 coat
衣帽架 🎩 coat rack
挂钩 🪝 hook
钥匙挂钩 🔑 key hook
包 👜 bag
背包 🎒 backpack
购物袋 🛍️ shopping bag
快递包裹 📦 parcel
穿衣镜 🪞 full-length mirror
走廊灯 💡 hallway light
门槛 ➖ threshold
楼梯扶手 🛗 stair railing
院子 🏡 yard
后院 🏞️ backyard
花园 🌷 garden
草坪 🟩 lawn
草 🌱 grass
树 🌳 tree
树枝 🌿 branch
树叶 🍃 leaf
花 🌸 flower
花盆 🪴 flowerpot
泥土 🟫 soil
石头 🪨 stone
围墙 🧱 perimeter wall
栅栏 🚧 fence
栏杆 🪜 railing
户外桌 🪑 outdoor table
户外椅 💺 outdoor chair
遮阳伞 ⛱️ parasol
水管 🪢 hose
浇水壶 🫗 watering can
落叶 🍂 fallen leaves
水坑 💦 puddle
排水沟 🌊 drainage ditch
手机 📱 cell phone
手机壳 📲 phone case
充电宝 🔋 power bank
眼镜 👓 glasses
纸巾 🤧 tissues
纸巾盒 🧻 tissue box
塑料袋 🛍️ plastic bag
盒子 📦 box
箱子 🧳 trunk
篮子 🧺 basket
瓶子 🍾 bottle
盖子 ⭕ lid
绳子 🪢 rope
胶带 📼 tape
电池 🔋 battery
钥匙串 🔑 keychain
钱包 👛 wallet
硬币 🪙 coin
纸屑 📄 paper scraps
灰尘 🌫️ dust
污垢 🟤 grime
蜘蛛网 🕸️ cobweb
碎片 🧩 fragments
水渍 💧 water mark
垃圾 🗑️ garbage
上面 ⬆️ above
下面 ⬇️ below
里面 📥 inside
外面 📤 outside
前面 ⏫ in front
后面 ⏬ behind
旁边 ↔️ next to
中间 ⏺️ in the middle
左边 ⬅️ left
右边 ➡️ right
附近 📍 nearby
对面 🔁 opposite
角落里 📐 in the corner
到处 🌐 everywhere
"""


def parse_md():
    sections, cur = {}, None
    for line in MD.read_text(encoding='utf-8').splitlines():
        m = re.match(r'^## (\d+)\.', line)
        if m:
            cur = int(m.group(1)); sections[cur] = {}
            continue
        if cur and line.startswith('| ') and not line.startswith('| 中文') and not line.startswith('|---'):
            zh, py, es = [c.strip() for c in line.strip('|').split('|')]
            sections[cur][zh] = (py, es)
    return sections


def main():
    sections = parse_md()
    emoji = {}
    for line in EMOJI.strip().splitlines():
        zh, e, en = line.split(' ', 2)
        emoji[zh] = (e, en)

    errors, rooms = [], []
    for rid, sec, zh, py, es, en, icon, outdoor in ROOMS:
        words = sections[sec]
        used, cols = [], []
        for col in LAYOUT[rid]:
            cells = col.split('|')
            assert len(cells) == 4, (rid, col)
            out = []
            for w in cells:
                if not w:
                    out.append(None); continue
                if w not in words: errors.append('%s: "%s" no está en la sección %d' % (rid, w, sec)); out.append(None); continue
                if w not in emoji: errors.append('falta emoji/inglés: ' + w); out.append(None); continue
                used.append(w)
                out.append([emoji[w][0], w, words[w][0], words[w][1], emoji[w][1]])
            cols.append(out)
        for w in words:
            if used.count(w) != 1:
                errors.append('%s: "%s" aparece %d veces en el layout' % (rid, w, used.count(w)))
        rooms.append({'id': rid, 'icon': icon, 'zh': zh, 'py': py, 'es': es, 'en': en, 'outdoor': bool(outdoor), 'cols': cols})
        print('%-10s %2d palabras, %d columnas' % (rid, len(words), len(cols)))
    if errors:
        print('\n'.join(errors)); sys.exit(1)
    out = ROOT / 'data.js'
    out.write_text(
        '// GENERADO por tools/build_data.py – no editar a mano.\n'
        '// Celda: [emoji, hanzi, pinyin, español, inglés]. Cada columna = 4 niveles (suelo → techo).\n'
        'window.LABELLEARN_ROOMS = ' + json.dumps(rooms, ensure_ascii=False, separators=(',', ':')) + ';\n',
        encoding='utf-8')
    print('data.js escrito')


if __name__ == '__main__':
    main()
