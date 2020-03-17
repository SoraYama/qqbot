// 大群
export const GROUP_ID = 915378511;
// 测试小群
export const TEST_GROUP_ID = 1080079422;

export const isDev = process.env.NODE_ENV === 'development';

export const nameList = [
  '水虹',
  '小m',
  '阿远',
  'Luka',
  '固拉多',
  '沛沛',
  '雪芬',
  '樟脑丸',
  '小白白',
  '锅风',
  '茗子',
  'poi',
  '院长',
  '我',
  '姬堡',
  '二邪',
];

export const YUEN_ID = 1091879579;

export const ADMIN_ID = 694692391;

export const getVoiceAPI = (id: number) => `http://revise.kcwiki.moe/v3/data/${id}.json`;
