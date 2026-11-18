/* ============================================================
   汉字关卡数据（50 关 × 4 字 = 200 个基础汉字）
   ============================================================ */
'use strict';

const LEVELS = [
  {
    id: 1, name: '数字宝宝', emoji: '🔢', sticker: '🍭',
    chars: [
      { c: '一', p: 'yī', emoji: '1️⃣', word: '一个' },
      { c: '二', p: 'èr', emoji: '2️⃣', word: '二月' },
      { c: '三', p: 'sān', emoji: '3️⃣', word: '三只' },
      { c: '四', p: 'sì', emoji: '4️⃣', word: '四季' }
    ]
  },
  {
    id: 2, name: '数字朋友', emoji: '🎈', sticker: '🎈',
    chars: [
      { c: '五', p: 'wǔ', emoji: '5️⃣', word: '五个' },
      { c: '六', p: 'liù', emoji: '6️⃣', word: '六月' },
      { c: '七', p: 'qī', emoji: '7️⃣', word: '七色' },
      { c: '八', p: 'bā', emoji: '8️⃣', word: '八只' }
    ]
  },
  {
    id: 3, name: '大数字', emoji: '💯', sticker: '🏅',
    chars: [
      { c: '九', p: 'jiǔ', emoji: '9️⃣', word: '九个' },
      { c: '十', p: 'shí', emoji: '🔟', word: '十个' },
      { c: '百', p: 'bǎi', emoji: '💯', word: '一百' },
      { c: '千', p: 'qiān', emoji: '🧮', word: '一千' }
    ]
  },
  {
    id: 4, name: '日月山水', emoji: '🏞️', sticker: '🌈',
    chars: [
      { c: '日', p: 'rì', emoji: '☀️', word: '太阳' },
      { c: '月', p: 'yuè', emoji: '🌙', word: '月亮' },
      { c: '山', p: 'shān', emoji: '⛰️', word: '大山' },
      { c: '水', p: 'shuǐ', emoji: '💧', word: '喝水' }
    ]
  },
  {
    id: 5, name: '天气变变变', emoji: '🌦️', sticker: '☔',
    chars: [
      { c: '云', p: 'yún', emoji: '☁️', word: '白云' },
      { c: '雨', p: 'yǔ', emoji: '🌧️', word: '下雨' },
      { c: '雪', p: 'xuě', emoji: '❄️', word: '雪花' },
      { c: '风', p: 'fēng', emoji: '🌬️', word: '大风' }
    ]
  },
  {
    id: 6, name: '火木土石', emoji: '🌋', sticker: '🔥',
    chars: [
      { c: '火', p: 'huǒ', emoji: '🔥', word: '火苗' },
      { c: '木', p: 'mù', emoji: '🪵', word: '木头' },
      { c: '土', p: 'tǔ', emoji: '🟫', word: '泥土' },
      { c: '石', p: 'shí', emoji: '🪨', word: '石头' }
    ]
  },
  {
    id: 7, name: '花草叶果', emoji: '🌸', sticker: '🌺',
    chars: [
      { c: '花', p: 'huā', emoji: '🌸', word: '花朵' },
      { c: '草', p: 'cǎo', emoji: '🌿', word: '小草' },
      { c: '叶', p: 'yè', emoji: '🍃', word: '树叶' },
      { c: '果', p: 'guǒ', emoji: '🍎', word: '苹果' }
    ]
  },
  {
    id: 8, name: '猫狗牛羊', emoji: '🐾', sticker: '🐾',
    chars: [
      { c: '猫', p: 'māo', emoji: '🐱', word: '小猫' },
      { c: '狗', p: 'gǒu', emoji: '🐶', word: '小狗' },
      { c: '牛', p: 'niú', emoji: '🐮', word: '小牛' },
      { c: '羊', p: 'yáng', emoji: '🐑', word: '小羊' }
    ]
  },
  {
    id: 9, name: '鸟鱼马兔', emoji: '🐰', sticker: '🐇',
    chars: [
      { c: '鸟', p: 'niǎo', emoji: '🐦', word: '小鸟' },
      { c: '鱼', p: 'yú', emoji: '🐟', word: '小鱼' },
      { c: '马', p: 'mǎ', emoji: '🐴', word: '小马' },
      { c: '兔', p: 'tù', emoji: '🐰', word: '小兔' }
    ]
  },
  {
    id: 10, name: '农场动物', emoji: '🐷', sticker: '🐷',
    chars: [
      { c: '鸡', p: 'jī', emoji: '🐔', word: '小鸡' },
      { c: '鸭', p: 'yā', emoji: '🦆', word: '小鸭' },
      { c: '鹅', p: 'é', emoji: '🦢', word: '白鹅' },
      { c: '猪', p: 'zhū', emoji: '🐷', word: '小猪' }
    ]
  },
  {
    id: 11, name: '我的身体', emoji: '👋', sticker: '✋',
    chars: [
      { c: '口', p: 'kǒu', emoji: '👄', word: '嘴巴' },
      { c: '目', p: 'mù', emoji: '👀', word: '眼睛' },
      { c: '耳', p: 'ěr', emoji: '👂', word: '耳朵' },
      { c: '手', p: 'shǒu', emoji: '✋', word: '小手' }
    ]
  },
  {
    id: 12, name: '身体秘密', emoji: '🦷', sticker: '🦷',
    chars: [
      { c: '足', p: 'zú', emoji: '🦶', word: '小脚' },
      { c: '心', p: 'xīn', emoji: '❤️', word: '爱心' },
      { c: '牙', p: 'yá', emoji: '🦷', word: '牙齿' },
      { c: '头', p: 'tóu', emoji: '👦', word: '脑袋' }
    ]
  },
  {
    id: 13, name: '我的家人', emoji: '👨‍👩‍👧', sticker: '💖',
    chars: [
      { c: '爸', p: 'bà', emoji: '👨', word: '爸爸' },
      { c: '妈', p: 'mā', emoji: '👩', word: '妈妈' },
      { c: '爷', p: 'yé', emoji: '👴', word: '爷爷' },
      { c: '奶', p: 'nǎi', emoji: '👵', word: '奶奶' }
    ]
  },
  {
    id: 14, name: '香喷喷', emoji: '🍚', sticker: '🍜',
    chars: [
      { c: '米', p: 'mǐ', emoji: '🍚', word: '大米' },
      { c: '饭', p: 'fàn', emoji: '🍱', word: '米饭' },
      { c: '面', p: 'miàn', emoji: '🍜', word: '面条' },
      { c: '菜', p: 'cài', emoji: '🥬', word: '青菜' }
    ]
  },
  {
    id: 15, name: '颜色派对', emoji: '🎨', sticker: '🌻',
    chars: [
      { c: '红', p: 'hóng', emoji: '🔴', word: '红色' },
      { c: '黄', p: 'huáng', emoji: '🟡', word: '黄色' },
      { c: '蓝', p: 'lán', emoji: '🔵', word: '蓝色' },
      { c: '绿', p: 'lǜ', emoji: '🟢', word: '绿色' }
    ]
  },
  {
    id: 16, name: '交通工具', emoji: '🚗', sticker: '🚌',
    chars: [
      { c: '车', p: 'chē', emoji: '🚗', word: '汽车' },
      { c: '船', p: 'chuán', emoji: '🚢', word: '小船' },
      { c: '路', p: 'lù', emoji: '🛣️', word: '马路' },
      { c: '桥', p: 'qiáo', emoji: '🌉', word: '小桥' }
    ]
  },
  {
    id: 17, name: '上下左右', emoji: '🧭', sticker: '🧭',
    chars: [
      { c: '上', p: 'shàng', emoji: '⬆️', word: '上面' },
      { c: '下', p: 'xià', emoji: '⬇️', word: '下面' },
      { c: '左', p: 'zuǒ', emoji: '⬅️', word: '左边' },
      { c: '右', p: 'yòu', emoji: '➡️', word: '右边' }
    ]
  },
  {
    id: 18, name: '表情变变变', emoji: '😄', sticker: '😂',
    chars: [
      { c: '哭', p: 'kū', emoji: '😭', word: '哭声' },
      { c: '笑', p: 'xiào', emoji: '😄', word: '微笑' },
      { c: '大', p: 'dà', emoji: '🐘', word: '大象' },
      { c: '小', p: 'xiǎo', emoji: '🐭', word: '小老鼠' }
    ]
  },
  {
    id: 19, name: '四季歌', emoji: '🍂', sticker: '🌷',
    chars: [
      { c: '春', p: 'chūn', emoji: '🌷', word: '春天' },
      { c: '夏', p: 'xià', emoji: '☀️', word: '夏天' },
      { c: '秋', p: 'qiū', emoji: '🍁', word: '秋天' },
      { c: '冬', p: 'dōng', emoji: '⛄', word: '冬天' }
    ]
  },
  {
    id: 20, name: '你我他好', emoji: '🤝', sticker: '🌟',
    chars: [
      { c: '你', p: 'nǐ', emoji: '🙋', word: '你好' },
      { c: '我', p: 'wǒ', emoji: '🙋‍♂️', word: '我们' },
      { c: '他', p: 'tā', emoji: '🧑', word: '他们' },
      { c: '好', p: 'hǎo', emoji: '👍', word: '很好' }
    ]
  },

  /* ---------- 拓展内容：动物与自然 ---------- */
  {
    id: 21, name: '动物朋友', emoji: '🐘', sticker: '🍊',
    chars: [
      { c: '象', p: 'xiàng', emoji: '🐘', word: '大象' },
      { c: '狮', p: 'shī', emoji: '🦁', word: '狮子' },
      { c: '虎', p: 'hǔ', emoji: '🐯', word: '老虎' },
      { c: '熊', p: 'xióng', emoji: '🐻', word: '小熊' }
    ]
  },
  {
    id: 22, name: '小小昆虫', emoji: '🐜', sticker: '🐜',
    chars: [
      { c: '虫', p: 'chóng', emoji: '🐛', word: '虫子' },
      { c: '蚁', p: 'yǐ', emoji: '🐜', word: '蚂蚁' },
      { c: '蜂', p: 'fēng', emoji: '🐝', word: '蜜蜂' },
      { c: '蝶', p: 'dié', emoji: '🦋', word: '蝴蝶' }
    ]
  },
  {
    id: 23, name: '水果摊', emoji: '🍓', sticker: '🍓',
    chars: [
      { c: '苹', p: 'píng', emoji: '🍎', word: '苹果' },
      { c: '蕉', p: 'jiāo', emoji: '🍌', word: '香蕉' },
      { c: '橙', p: 'chéng', emoji: '🍊', word: '橙子' },
      { c: '梨', p: 'lí', emoji: '🍐', word: '梨子' }
    ]
  },
  {
    id: 24, name: '蔬菜园', emoji: '🥦', sticker: '🥦',
    chars: [
      { c: '豆', p: 'dòu', emoji: '🫛', word: '豆子' },
      { c: '瓜', p: 'guā', emoji: '🍉', word: '西瓜' },
      { c: '茄', p: 'qié', emoji: '🍆', word: '茄子' },
      { c: '菇', p: 'gū', emoji: '🍄', word: '蘑菇' }
    ]
  },
  {
    id: 25, name: '好喝的', emoji: '🍵', sticker: '🍵',
    chars: [
      { c: '茶', p: 'chá', emoji: '🍵', word: '喝茶' },
      { c: '汤', p: 'tāng', emoji: '🍲', word: '喝汤' },
      { c: '汁', p: 'zhī', emoji: '🧃', word: '果汁' },
      { c: '杯', p: 'bēi', emoji: '🥤', word: '杯子' }
    ]
  },

  /* ---------- 拓展内容：家庭与动作 ---------- */
  {
    id: 26, name: '兄弟姐妹', emoji: '🧸', sticker: '🧸',
    chars: [
      { c: '哥', p: 'gē', emoji: '👦', word: '哥哥' },
      { c: '姐', p: 'jiě', emoji: '👧', word: '姐姐' },
      { c: '弟', p: 'dì', emoji: '🧒', word: '弟弟' },
      { c: '妹', p: 'mèi', emoji: '👶', word: '妹妹' }
    ]
  },
  {
    id: 27, name: '亲戚朋友', emoji: '👨‍👩‍👦', sticker: '👨‍👩‍👦',
    chars: [
      { c: '叔', p: 'shū', emoji: '👨', word: '叔叔' },
      { c: '姑', p: 'gū', emoji: '👩', word: '姑姑' },
      { c: '姨', p: 'yí', emoji: '👩‍🦰', word: '阿姨' },
      { c: '舅', p: 'jiù', emoji: '🧔', word: '舅舅' }
    ]
  },
  {
    id: 28, name: '小眼睛小耳朵', emoji: '👀', sticker: '👀',
    chars: [
      { c: '看', p: 'kàn', emoji: '👀', word: '看书' },
      { c: '听', p: 'tīng', emoji: '👂', word: '听话' },
      { c: '说', p: 'shuō', emoji: '💬', word: '说话' },
      { c: '读', p: 'dú', emoji: '📖', word: '读书' }
    ]
  },
  {
    id: 29, name: '动起来', emoji: '🏃', sticker: '🏃',
    chars: [
      { c: '走', p: 'zǒu', emoji: '🚶', word: '走路' },
      { c: '跑', p: 'pǎo', emoji: '🏃', word: '跑步' },
      { c: '跳', p: 'tiào', emoji: '🤸', word: '跳绳' },
      { c: '坐', p: 'zuò', emoji: '🪑', word: '坐好' }
    ]
  },
  {
    id: 30, name: '小手真能干', emoji: '🧹', sticker: '🧹',
    chars: [
      { c: '拿', p: 'ná', emoji: '🤲', word: '拿住' },
      { c: '放', p: 'fàng', emoji: '📥', word: '放下' },
      { c: '开', p: 'kāi', emoji: '🔓', word: '打开' },
      { c: '关', p: 'guān', emoji: '🔒', word: '关上' }
    ]
  },

  /* ---------- 拓展内容：比较与方位 ---------- */
  {
    id: 31, name: '大小多少', emoji: '⚖️', sticker: '⚖️',
    chars: [
      { c: '多', p: 'duō', emoji: '🍬', word: '很多' },
      { c: '少', p: 'shǎo', emoji: '🍬', word: '很少' },
      { c: '长', p: 'cháng', emoji: '📏', word: '长长' },
      { c: '短', p: 'duǎn', emoji: '📐', word: '短短' }
    ]
  },
  {
    id: 32, name: '高矮胖瘦', emoji: '🦒', sticker: '🦒',
    chars: [
      { c: '高', p: 'gāo', emoji: '🦒', word: '高高' },
      { c: '矮', p: 'ǎi', emoji: '🐧', word: '矮矮' },
      { c: '胖', p: 'pàng', emoji: '🐻', word: '胖胖' },
      { c: '瘦', p: 'shòu', emoji: '🦦', word: '瘦瘦' }
    ]
  },
  {
    id: 33, name: '冷热新旧', emoji: '❄️', sticker: '❄️',
    chars: [
      { c: '新', p: 'xīn', emoji: '✨', word: '新书' },
      { c: '旧', p: 'jiù', emoji: '📦', word: '旧玩具' },
      { c: '冷', p: 'lěng', emoji: '🥶', word: '很冷' },
      { c: '热', p: 'rè', emoji: '🥵', word: '很热' }
    ]
  },
  {
    id: 34, name: '早中晚', emoji: '⏰', sticker: '⏰',
    chars: [
      { c: '早', p: 'zǎo', emoji: '🌅', word: '早上' },
      { c: '晚', p: 'wǎn', emoji: '🌙', word: '晚上' },
      { c: '今', p: 'jīn', emoji: '📅', word: '今天' },
      { c: '明', p: 'míng', emoji: '🌞', word: '明天' }
    ]
  },
  {
    id: 35, name: '星期日历', emoji: '📅', sticker: '📅',
    chars: [
      { c: '星', p: 'xīng', emoji: '⭐', word: '星星' },
      { c: '期', p: 'qī', emoji: '🗓️', word: '星期' },
      { c: '昨', p: 'zuó', emoji: '↩️', word: '昨天' },
      { c: '周', p: 'zhōu', emoji: '🔄', word: '一周' }
    ]
  },
  {
    id: 36, name: '前后里外', emoji: '🗺️', sticker: '🗺️',
    chars: [
      { c: '前', p: 'qián', emoji: '⏩', word: '前面' },
      { c: '后', p: 'hòu', emoji: '⏪', word: '后面' },
      { c: '里', p: 'lǐ', emoji: '📦', word: '里面' },
      { c: '外', p: 'wài', emoji: '🌳', word: '外面' }
    ]
  },
  {
    id: 37, name: '中间旁边', emoji: '📍', sticker: '📍',
    chars: [
      { c: '中', p: 'zhōng', emoji: '🎯', word: '中间' },
      { c: '间', p: 'jiān', emoji: '↔️', word: '之间' },
      { c: '旁', p: 'páng', emoji: '👥', word: '旁边' },
      { c: '边', p: 'biān', emoji: '🧭', word: '边上' }
    ]
  },

  /* ---------- 拓展内容：生活物品 ---------- */
  {
    id: 38, name: '家里有什么', emoji: '🚪', sticker: '🚪',
    chars: [
      { c: '门', p: 'mén', emoji: '🚪', word: '大门' },
      { c: '窗', p: 'chuāng', emoji: '🪟', word: '窗户' },
      { c: '床', p: 'chuáng', emoji: '🛏️', word: '小床' },
      { c: '灯', p: 'dēng', emoji: '💡', word: '电灯' }
    ]
  },
  {
    id: 39, name: '学习用品', emoji: '✏️', sticker: '✏️',
    chars: [
      { c: '书', p: 'shū', emoji: '📕', word: '看书' },
      { c: '笔', p: 'bǐ', emoji: '🖊️', word: '铅笔' },
      { c: '纸', p: 'zhǐ', emoji: '📄', word: '白纸' },
      { c: '包', p: 'bāo', emoji: '🎒', word: '书包' }
    ]
  },
  {
    id: 40, name: '一起玩耍', emoji: '⚽', sticker: '⚽',
    chars: [
      { c: '球', p: 'qiú', emoji: '⚽', word: '皮球' },
      { c: '棋', p: 'qí', emoji: '♟️', word: '下棋' },
      { c: '偶', p: 'ǒu', emoji: '🎎', word: '玩偶' },
      { c: '鼓', p: 'gǔ', emoji: '🥁', word: '小鼓' }
    ]
  },
  {
    id: 41, name: '乐器声音', emoji: '🎼', sticker: '🎼',
    chars: [
      { c: '琴', p: 'qín', emoji: '🎹', word: '钢琴' },
      { c: '铃', p: 'líng', emoji: '🔔', word: '铃铛' },
      { c: '号', p: 'hào', emoji: '📯', word: '小号' },
      { c: '笛', p: 'dí', emoji: '🪈', word: '笛子' }
    ]
  },
  {
    id: 42, name: '厨房里', emoji: '🍲', sticker: '🍲',
    chars: [
      { c: '锅', p: 'guō', emoji: '🍳', word: '锅子' },
      { c: '碗', p: 'wǎn', emoji: '🥣', word: '饭碗' },
      { c: '勺', p: 'sháo', emoji: '🥄', word: '勺子' },
      { c: '盘', p: 'pán', emoji: '🍽️', word: '盘子' }
    ]
  },
  {
    id: 43, name: '洗澡时间', emoji: '🛁', sticker: '🛁',
    chars: [
      { c: '洗', p: 'xǐ', emoji: '🧼', word: '洗手' },
      { c: '澡', p: 'zǎo', emoji: '🛁', word: '洗澡' },
      { c: '巾', p: 'jīn', emoji: '🧻', word: '毛巾' },
      { c: '皂', p: 'zào', emoji: '🧼', word: '肥皂' }
    ]
  },
  {
    id: 44, name: '穿衣服', emoji: '🧦', sticker: '🧦',
    chars: [
      { c: '衣', p: 'yī', emoji: '👕', word: '衣服' },
      { c: '帽', p: 'mào', emoji: '🧢', word: '帽子' },
      { c: '鞋', p: 'xié', emoji: '👟', word: '鞋子' },
      { c: '袜', p: 'wà', emoji: '🧦', word: '袜子' }
    ]
  },

  /* ---------- 拓展内容：自然世界 ---------- */
  {
    id: 45, name: '天空真美', emoji: '🌤️', sticker: '🌤️',
    chars: [
      { c: '天', p: 'tiān', emoji: '🌤️', word: '天空' },
      { c: '空', p: 'kōng', emoji: '🌌', word: '空中' },
      { c: '光', p: 'guāng', emoji: '💡', word: '阳光' },
      { c: '晴', p: 'qíng', emoji: '☀️', word: '晴天' }
    ]
  },
  {
    id: 46, name: '地球家园', emoji: '🌍', sticker: '🌍',
    chars: [
      { c: '地', p: 'dì', emoji: '🌎', word: '大地' },
      { c: '林', p: 'lín', emoji: '🌲', word: '树林' },
      { c: '田', p: 'tián', emoji: '🌾', word: '田地' },
      { c: '河', p: 'hé', emoji: '🏞️', word: '小河' }
    ]
  },
  {
    id: 47, name: '海洋世界', emoji: '🌊', sticker: '🌊',
    chars: [
      { c: '海', p: 'hǎi', emoji: '🌊', word: '大海' },
      { c: '浪', p: 'làng', emoji: '🌊', word: '海浪' },
      { c: '沙', p: 'shā', emoji: '🏖️', word: '沙子' },
      { c: '贝', p: 'bèi', emoji: '🐚', word: '贝壳' }
    ]
  },

  /* ---------- 拓展内容：情绪与安全 ---------- */
  {
    id: 48, name: '有礼貌', emoji: '🤝', sticker: '🤝',
    chars: [
      { c: '请', p: 'qǐng', emoji: '🙏', word: '请坐' },
      { c: '谢', p: 'xiè', emoji: '💐', word: '谢谢' },
      { c: '让', p: 'ràng', emoji: '🤲', word: '让开' },
      { c: '帮', p: 'bāng', emoji: '🤝', word: '帮忙' }
    ]
  },
  {
    id: 49, name: '心情小屋', emoji: '💗', sticker: '💗',
    chars: [
      { c: '爱', p: 'ài', emoji: '❤️', word: '爱心' },
      { c: '怕', p: 'pà', emoji: '😨', word: '害怕' },
      { c: '急', p: 'jí', emoji: '😣', word: '着急' },
      { c: '累', p: 'lèi', emoji: '😴', word: '累了' }
    ]
  },
  {
    id: 50, name: '安全第一', emoji: '🚦', sticker: '🚦',
    chars: [
      { c: '安', p: 'ān', emoji: '🛡️', word: '平安' },
      { c: '全', p: 'quán', emoji: '✅', word: '安全' },
      { c: '慢', p: 'màn', emoji: '🐢', word: '慢慢' },
      { c: '停', p: 'tíng', emoji: '🛑', word: '停下' }
    ]
  }
];

/* 每关配色（用于地图卡片） */
const PALETTE = ['#FFB703', '#FF8FAB', '#7BC950', '#4ECDC4', '#A78BFA',
                 '#FF9F68', '#58B4FF', '#F78FB3', '#FFC75F', '#8AC926',
                 '#C77DFF', '#FF922B', '#66D9E8', '#F06595', '#A9E34B',
                 '#FFA8A8', '#74C0FC', '#B197FC', '#FFD43B', '#63E6BE'];
LEVELS.forEach(function (lv, i) {
  lv.color = PALETTE[i % PALETTE.length];
});

/* 汉字索引 */
const CHAR_MAP = {};
LEVELS.forEach(function (lv) {
  lv.chars.forEach(function (ch) {
    CHAR_MAP[ch.c] = ch;
  });
});

/* 汉字总数 */
const TOTAL_CHARS = Object.keys(CHAR_MAP).length;
