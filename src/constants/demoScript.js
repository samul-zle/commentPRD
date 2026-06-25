/**
 * demoScript.js — 自动演示的剧本
 *
 * 热区坐标全部来自 hotspots.js 的 HIGHLIGHT_POSITIONS，只改那里。
 */

import beforeImg       from '../assets/images/before-poi.png';
import afterImg        from '../assets/images/after-poi.png';
import memberPopup     from '../assets/images/member-popup.png';
import consumePopup    from '../assets/images/consume-popup.png';
import onsitePopup     from '../assets/images/onsite-popup.png';
import commentPageImg  from '../assets/images/commentPage.png';
import truthGuardImg   from '../assets/images/truth-guard-full2.png';
import memberLogoImg   from '../assets/images/member-logo.gif';
import commentLogoImg  from '../assets/images/comment-log.png';

// ── 长期方案图片 ────────────────────────────────────────────────────────────
import longTermPoiImg    from '../assets/images/长期方案/长期poi.png';
import evaluatorPopup    from '../assets/images/长期方案/评鉴官弹窗.png';
import evaluatorLogoImg  from '../assets/images/长期方案/评鉴官.gif';
import evaluatorLandImg  from '../assets/images/长期方案/评鉴官落地页.png';
import foodiePopup       from '../assets/images/长期方案/美食弹窗.png';
import foodieLogoImg     from '../assets/images/长期方案/轻食达人.gif';
import ticketPopup       from '../assets/images/长期方案/门票弹窗.png';
import ticketLogoImg     from '../assets/images/长期方案/门票切图.gif';
import hotelPopup        from '../assets/images/长期方案/酒店弹窗.png';
import hotelLogoImg      from '../assets/images/长期方案/酒店切图.gif';
import leisurePopup      from '../assets/images/长期方案/休闲玩乐弹窗.png';
import leisureLogoImg    from '../assets/images/长期方案/休闲玩乐切图.gif';

import { HIGHLIGHT_POSITIONS as HP } from './hotspots.js';

export const IMAGES = {
  before:              beforeImg,
  after:               afterImg,
  member:              memberPopup,
  consume:             consumePopup,
  onsite:              onsitePopup,
  commentPage:         commentPageImg,
  truthGuard:          truthGuardImg,
  // 长期方案
  longTerm:            longTermPoiImg,
  evaluator:           evaluatorPopup,
  evaluatorLanding:    evaluatorLandImg,
  foodie:              foodiePopup,
  ticket:              ticketPopup,
  hotel:               hotelPopup,
};

// 弹窗顶部独立 logo（member 和 truthGuard 弹窗使用）
export const LOGOS = {
  member:      memberLogoImg,
  onsite:      commentLogoImg,
  consume:     commentLogoImg,
  // 长期方案
  evaluator:   evaluatorLogoImg,
  foodie:      foodieLogoImg,
  ticket:      ticketLogoImg,
  hotel:       hotelLogoImg,
};

// 右侧说明区：达人品类预览（供 LongTermDemo 右侧卡片使用，2×2 布局）
export const LONG_TERM_SIDEBAR = {
  foodie:  { popup: foodiePopup,  logo: foodieLogoImg,  label: '美食达人'    },
  ticket:  { popup: ticketPopup,  logo: ticketLogoImg,  label: '门票达人'    },
  hotel:   { popup: hotelPopup,   logo: hotelLogoImg,   label: '酒店达人'    },
  leisure: { popup: leisurePopup, logo: leisureLogoImg, label: '休闲玩乐达人'  },
};

export const STEPS = [

  // ── 改前：仅展示静态现状 ──────────────────────────────────────────────
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

  // ── crossfade 过渡到改后 ──────────────────────────────────────────────
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

  // ── 改后第一步：会员等级增强 ──────────────────────────────────────────
  {
    id: 2,
    image: 'after',
    highlight:   HP.member_after,
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
    clickTarget: HP.member_after.clickAt,
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
    bottomSheet: 'member',
    annotation: {
      tag: '改后 · 会员身份浮层',
      title: '浮层内容',
      body: '头像 + 昵称、成长值档位、会员等级 Logo + 星级、已获勋章、跳转会员主页入口。',
    },
    duration: 3000,
  },
  {
    id: 5,
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

  // ── 改后第二步：消费后评价 ────────────────────────────────────────────
  {
    id: 6,
    image: 'after',
    highlight:   HP.consume,
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
    clickTarget: HP.consume.clickAt,
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
    bottomSheet: 'consume',
    annotation: {
      tag: '改后 · 消费后评价 弹窗',
      title: '判定依据说明',
      body: '到餐14天 / 服务零售30天 / 酒店退房后30天 / 门票使用后30天内有效。',
    },
    duration: 2800,
  },

  // ── 改后第三步：现场拍摄 ──────────────────────────────────────────────
  {
    id: 9,
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
  {
    id: 10,
    image: 'after',
    highlight:   HP.onsite,
    clickTarget: HP.onsite.clickAt,
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
    bottomSheet: 'onsite',
    annotation: {
      tag: '改后 · 现场拍摄 弹窗',
      title: '判定依据说明',
      body: '地理位置 + 图片双重验证。AI识别非现场图片时自动降级为现场评价(LV.4)。',
    },
    duration: 2800,
  },

  // ── 评价真实性入口（评价页 → 真实性说明弹窗）────────────────────────
  {
    id: 12,
    image: 'commentPage',
    highlight:   null,
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '评价真实性入口',
      title: '进入评价详情页',
      body: '点击评价卡片进入评价页，顶部展示「美团致力于呈现真实评价」入口。',
    },
    duration: 1500,
  },
  {
    id: 13,
    image: 'commentPage',
    highlight:   HP.comment_truth_slogan,
    clickTarget: null,
    bottomSheet: null,
    annotation: {
      tag: '评价真实性入口',
      title: '「美团致力于呈现真实评价」',
      body: '点击文案触发评价真实性说明弹窗：真实消费验证身份 / 严格审查 / 客观算分 / 全民监督。',
    },
    duration: 2200,
  },
  {
    id: 14,
    image: 'commentPage',
    highlight:   HP.comment_truth_slogan,
    clickTarget: HP.comment_truth_slogan.clickAt,
    bottomSheet: null,
    annotation: {
      tag: '评价真实性入口',
      title: '触发真实性说明弹窗',
      body: '点击后展示美团评价真实性说明弹窗，四大模块体系化呈现平台治理机制。',
    },
    duration: 900,
  },
  {
    id: 15,
    image: 'commentPage',
    highlight:   null,
    clickTarget: null,
    bottomSheet: 'truthGuard',
    annotation: {
      tag: '评价真实性说明',
      title: '美团评价真实性说明弹窗',
      body: '四大模块：真实消费验证身份、严格审查守护真实、客观算分科学公正、全民监督共建真实。',
      note: '真实性说明弹窗仅原型',
    },
    duration: 3000,
  },

];

export const TOTAL_STEPS = STEPS.length;
