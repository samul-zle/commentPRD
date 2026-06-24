/**
 * demoScript.js — 自动演示的剧本
 *
 * 剧本逻辑：
 *   改前 → 仅展示静态状态（不做任何交互动画）
 *   改后 → 依次演示三个改动点：会员浮层 / 消费后评价弹窗 / 现场拍摄弹窗
 *
 * 坐标全部引用 hotspots.js 中的 HIGHLIGHT_POSITIONS，只改那里。
 *
 * 每步结构：
 *   image       — 'before' | 'after'
 *   highlight   — HIGHLIGHT_POSITIONS 中某个对象，或 null
 *   clickTarget — highlight 的 clickAt，或 null（触发水波纹）
 *   bottomSheet — 'member' | 'consume' | 'onsite' | null
 *   annotation  — 右侧注释卡片 { tag, title, body }
 *   duration    — 本步停留毫秒数
 */

import beforeImg    from '../assets/images/before-poi.png';
import afterImg     from '../assets/images/after-poi.png';
import memberPopup  from '../assets/images/member-popup.png';
import consumePopup from '../assets/images/consume-popup.png';
import onsitePopup  from '../assets/images/onsite-popup.png';

import { HIGHLIGHT_POSITIONS as HP } from './hotspots.js';

export const IMAGES = {
  before:  beforeImg,
  after:   afterImg,
  member:  memberPopup,
  consume: consumePopup,
  onsite:  onsitePopup,
};

export const STEPS = [

  // ── 改前：仅展示静态现状，不做任何动画 ──────────────────────────────────

  {
    id: 0,
    image: 'before',
    highlight:   null,
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '改前',
      title: '当前状态',
      body: '黑金/黑钻会员仅有文字标签，无星级区分，无交互能力。所有标识均为静态展示。',
    },
    duration: 2000,
  },

  // ── crossfade 过渡到改后 ─────────────────────────────────────────────────

  {
    id: 1,
    image: 'after',
    highlight:   null,
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '改后',
      title: '升级后效果',
      body: '会员标签新增星级，消费后评价和现场拍摄标签均可点击查看判定依据。',
    },
    duration: 1200,
  },

  // ── 改后第一步：会员等级增强 ─────────────────────────────────────────────

  {
    id: 2,
    image: 'after',
    highlight:   HP.member_after,       // 高亮黑钻会员 badge
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '改后 · 会员等级增强',
      title: '黑钻4星（可点击）',
      body: '改版后会员标签新增星级数字，点击可展开包含头像、昵称、成长值、勋章的身份浮层。',
    },
    duration: 2200,
  },

  {
    id: 3,
    image: 'after',
    highlight:   HP.member_after,
    clickTarget: HP.member_after.clickAt,  // 模拟点击
    bottomSheet: null,
    annotation: {
      tag: '改后 · 会员等级增强',
      title: '点击会员标签',
      body: '触发会员身份浮层，展示详细信息和跳转会员主页入口。',
    },
    duration: 900,
  },

  {
    id: 4,
    image: 'after',
    highlight:   null,
    clickTarget: null,
    bottomSheet: 'member',              // 会员弹窗从底部滑入
    annotation: {
      tag: '改后 · 会员身份浮层',
      title: '浮层内容',
      body: '头像 + 昵称、成长值档位、会员等级 Logo + 星级、已获勋章、跳转会员主页入口。',
    },
    duration: 3000,
  },

  {
    id: 5,                              // 弹窗关闭
    image: 'after',
    highlight:   null,
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '改后 · 会员身份浮层',
      title: '浮层内容',
      body: '头像 + 昵称、成长值档位、会员等级 Logo + 星级、已获勋章、跳转会员主页入口。',
    },
    duration: 700,
  },

  // ── 改后第二步：消费后评价标签 ───────────────────────────────────────────

  {
    id: 6,
    image: 'after',
    highlight:   HP.consume,            // 高亮消费后评价标签
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '改后 · 四级真实性标签',
      title: '消费后评价（LV.2）',
      body: '由静态标签改为可点击，弹窗展示判定依据。',
    },
    duration: 2000,
  },

  {
    id: 7,
    image: 'after',
    highlight:   HP.consume,
    clickTarget: HP.consume.clickAt,    // 点击消费后评价
    bottomSheet: null,
    annotation: {
      tag: '改后 · 四级真实性标签',
      title: '点击「消费后评价」',
      body: '弹窗说明判定依据：有消费记录且在有效时效内发布。',
    },
    duration: 900,
  },

  {
    id: 8,
    image: 'after',
    highlight:   null,
    clickTarget: null,
    bottomSheet: 'consume',             // 消费后评价弹窗
    annotation: {
      tag: '改后 · 消费后评价 弹窗',
      title: '判定依据说明',
      body: '到餐14天 / 服务零售30天 / 酒店退房后30天 / 门票使用后30天内有效。',
    },
    duration: 2800,
  },

  {
    id: 9,                              // 弹窗关闭，高亮现场拍摄
    image: 'after',
    highlight:   HP.onsite,
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '改后 · 四级真实性标签',
      title: '现场拍摄（LV.3）',
      body: '地理位置 + 图片双重验证，比消费后评价可信度更高。新增标签，点击查看判定规则。',
    },
    duration: 1800,
  },

  // ── 改后第三步：现场拍摄标签 ─────────────────────────────────────────────

  {
    id: 10,
    image: 'after',
    highlight:   HP.onsite,
    clickTarget: HP.onsite.clickAt,     // 点击现场拍摄
    bottomSheet: null,
    annotation: {
      tag: '改后 · 四级真实性标签',
      title: '点击「现场拍摄」',
      body: '距店100米内 + 带本店现场拍摄图片，AI识别非现场图片则降级展示。',
    },
    duration: 900,
  },

  {
    id: 11,
    image: 'after',
    highlight:   null,
    clickTarget: null,
    bottomSheet: 'onsite',              // 现场拍摄弹窗
    annotation: {
      tag: '改后 · 现场拍摄 弹窗',
      title: '判定依据说明',
      body: '地理位置 + 图片双重验证。AI识别非现场图片时自动降级为现场评价(LV.4)。',
    },
    duration: 2800,
  },

];

export const TOTAL_STEPS = STEPS.length;
