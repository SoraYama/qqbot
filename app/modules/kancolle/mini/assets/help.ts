import { MAX_HOME_LEVEL } from '../constants';

const helpText = {
  help: '显示某个帮助信息, 参数为指令',
  start: '初始化角色, 入坑的起点',
  build:
    '模拟大建, 后面需要加的参数为: 油 弹 钢 铝, 用空格分开即可 (最低为 [1500, 1500, 2000, 1000], 最高为 [7000, 7000, 7000, 7000])',
  sec: '置换秘书舰, 后面参数为舰娘ID',
  drop: '解体舰娘来换取报酬, 后面参数为舰娘们的ID, 可以一次解体多个',
  me: '查询你当前的信息',
  upgrade: `拆解まるゆ来升级镇守府, 高等级镇守府资源回复速度更快 [注: 镇守府等级最高为${MAX_HOME_LEVEL}级]`,
};

export default helpText;
