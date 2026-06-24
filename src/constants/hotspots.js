/**
 * hotspots.js — 热区坐标的唯一数据源
 *
 * 分两部分：
 *   HIGHLIGHT_POSITIONS — 仅坐标，供自动演示（demoScript）引用高亮位置
 *   BEFORE_HOTSPOTS     — 改前：无可交互区域（改前状态所有标识均为静态）
 *   AFTER_HOTSPOTS      — 改后：三个可点击区域
 *
 * 只改这里，自动演示和自由探索同步生效。
 *
 * 坐标说明：
 *   top / left   — 热区左上角距屏幕顶/左的百分比（往下加 / 往右加）
 *   width        — 热区宽度百分比
 *   height       — 热区高度百分比
 *   clickAt      — 水波纹动画中心点（一般设在框中央附近）
 */

// ─────────────────────────────────────────────────────────────────────────────
// 视觉高亮位置（仅供自动演示用，不是可交互热区）
// ─────────────────────────────────────────────────────────────────────────────
export const HIGHLIGHT_POSITIONS = {
  // 黑金会员 badge —— 第一条评价的用户信息行
  member_before: {
    top: '40.5%', left: '33%', width: '19%', height: '3%',
    clickAt: { top: '41%', left: '41%' },
  },

  // 黑钻会员 badge（改后，同位置）
  member_after: {
    top: '40.5%', left: '33%', width: '19%', height: '3%',
    clickAt: { top: '41%', left: '41%'  },
  },

  // 消费后评价 标签 —— 标签行左侧
  consume: {
    top: '71.5%', left: '36%', width: '16%', height: '2.5%',
    clickAt: { top: '72%', left: '42%' },
  },

  // 现场拍摄 标签 —— 标签行右侧（消费后评价右边）
  onsite: {
    top: '43.5%', left: '36%', width: '14%', height: '2%',
    clickAt: { top: '43.7%', left: '42%' },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 改前视图（before-poi.png）
// 无可交互热区 —— 改前状态所有标识均为静态文字，这正是本次改动要解决的问题
// ─────────────────────────────────────────────────────────────────────────────
export const BEFORE_HOTSPOTS = [];

// ─────────────────────────────────────────────────────────────────────────────
// 改后视图（after-poi.png）
// 三个可点击区域，坐标引用 HIGHLIGHT_POSITIONS
// ─────────────────────────────────────────────────────────────────────────────
export const AFTER_HOTSPOTS = [
  {
    id: 'member-after',
    ...HIGHLIGHT_POSITIONS.member_after,
    popup: 'member',
    label: '黑钻4星',
    annotation: {
      tag: '会员等级增强',
      title: '会员身份浮层',
      body: '点击后展开浮层，显示头像、昵称、成长值档位、会员等级 Logo + 星级、已获勋章、跳转会员主页入口。',
      prd: '改动点：增加星级展示，点击可查看会员身份浮层',
    },
  },

  {
    id: 'consume',
    ...HIGHLIGHT_POSITIONS.consume,
    popup: 'consume',
    label: '消费后评价',
    annotation: {
      tag: '四级真实性标签 · LV.2',
      title: '消费后评价',
      body: '判定条件：有消费记录（订单完成后在有效时效内发布）。到餐14天 / 服务零售30天 / 酒店退房后30天 / 门票使用后30天。',
      prd: '改动点：由静态标签改为可点击，弹窗展示判定依据',
    },
  },

  {
    id: 'onsite',
    ...HIGHLIGHT_POSITIONS.onsite,
    popup: 'onsite',
    label: '现场拍摄',
    annotation: {
      tag: '四级真实性标签 · LV.3',
      title: '现场拍摄',
      body: '判定条件：距店100米内 + 带本店现场拍摄图片（地理位置 + 图片双重验证）。AI识别非现场图片则降级为现场评价(LV.4)。',
      prd: '改动点：新增 LV.3 标签，地理 + 图片双重验证',
    },
  },
];

// 按 view 取用
export const HOTSPOTS = {
  before: BEFORE_HOTSPOTS,
  after:  AFTER_HOTSPOTS,
};
