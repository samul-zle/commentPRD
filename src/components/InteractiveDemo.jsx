import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IMAGES } from '../constants/demoScript.js';
import { HIGHLIGHT_POSITIONS as HP, REVIEW_CARD_ZONE } from '../constants/hotspots.js';
import PhoneEmulator from './PhoneEmulator.jsx';
import BottomSheet from './BottomSheet.jsx';
import ClickRipple from './ClickRipple.jsx';

// ══════════════════════════════════════════════════════════════════════
// 三个视图的热区配置
// 坐标来自 constants/hotspots.js，只改那里
//
// 字段说明：
//   popup      — 打开底部弹窗（'member' | 'consume' | 'onsite' | 'truthGuard'）
//   navigateTo — 切换视图（'commentPage' | 'before' | 'after'）
//   invisible  — true = 透明点击区，不渲染任何视觉样式
// ══════════════════════════════════════════════════════════════════════

const HOTSPOT_CONFIG = {

  // 改前视图 —— 无可交互高亮框，但有隐形的评价卡片点击区
  before: [
    {
      id: 'review-before',
      label: '评价卡片',
      ...REVIEW_CARD_ZONE,
      invisible:  true,
      navigateTo: 'commentPage',
      annotation: {
        tag: '评价页',
        title: '进入评价详情页',
        body: '点击评价卡片，进入评价详情页查看完整评价内容。',
        prd: null,
      },
    },
  ],

  // 改后视图 —— 三个高亮可交互区 + 隐形的评价卡片点击区
  after: [
    {
      id: 'member-after',
      label: '黑钻4星 · 点击查看浮层',
      ...HP.member_after,
      popup: 'member',
      annotation: {
        tag: '会员等级增强',
        title: '会员身份浮层',
        body: '点击后展开浮层，显示头像、昵称、成长值档位、会员等级 Logo + 星级、已获勋章、跳转会员主页入口。',
        prd: '改动点：增加星级展示，点击可查看会员身份浮层',
      },
    },
    {
      id: 'consume',
      label: '消费后评价 · 点击查看详情',
      ...HP.consume,
      popup: 'consume',
      annotation: {
        tag: '四级真实性标签 · LV.2',
        title: '消费后评价',
        body: '判定条件：有消费记录（订单完成后在有效时效内发布）。到餐14天 / 服务零售30天 / 酒店退房后30天 / 门票使用后30天。',
        prd: '改动点：由静态标签改为可点击，弹窗展示判定依据',
      },
    },
    {
      id: 'onsite',
      label: '现场拍摄 · 点击查看详情',
      ...HP.onsite,
      popup: 'onsite',
      annotation: {
        tag: '四级真实性标签 · LV.3',
        title: '现场拍摄',
        body: '判定条件：距店100米内 + 带本店现场拍摄图片（地理位置 + 图片双重验证）。AI识别非现场图片则降级为现场评价(LV.4)。',
        prd: '改动点：新增 LV.3 标签，地理 + 图片双重验证',
      },
    },
    {
      id: 'review-after',
      label: '评价卡片',
      ...REVIEW_CARD_ZONE,
      invisible:  true,
      navigateTo: 'commentPage',
      annotation: {
        tag: '评价页',
        title: '进入评价详情页',
        body: '点击评价卡片，进入评价详情页查看完整评价内容和写评人的完整身份标识。',
        prd: null,
      },
    },
  ],

  // 评价详情页 —— 高亮「美团致力于呈现真实评价」
  commentPage: [
    {
      id: 'truth-slogan',
      label: '美团致力于呈现真实评价',
      ...HP.comment_truth_slogan,
      popup: 'truthGuard',
      annotation: {
        tag: '评价真实性入口',
        title: '点击查看真实性说明',
        body: '点击文案触发评价真实性说明弹窗：真实消费验证身份 / 严格审查 / 客观算分 / 全民监督。',
        note: '真实性说明弹窗仅原型',
        prd: '改动点：「美团致力于呈现真实评价」文案增加点击，触发说明弹窗',
      },
    },
  ],
};

// ─── 各视图的默认注释（未点击任何热区时）─────────────────────────────────
const DEFAULT_ANNOTATION = {
  before: {
    tag: '改前',
    title: '当前状态：无高亮交互',
    body: '改前状态标识均为静态，无高亮可点击区域。可点击评价卡片区域进入评价详情页。',
    prd: null,
  },
  after: {
    tag: '改后',
    title: '点击高亮区域查看标签详情',
    body: '会员标签新增星级，消费后评价和现场拍摄标签均可点击查看判定依据。也可点击评价卡片进入评价详情页。',
    prd: null,
  },
  commentPage: {
    tag: '评价详情页',
    title: '点击高亮区域',
    body: '「美团致力于呈现真实评价」文案支持点击，弹窗展示平台评价真实性说明。',
    note: '真实性说明弹窗仅原型',
    prd: null,
  },
};

// ─── 底图映射 ────────────────────────────────────────────────────────────
const VIEW_IMAGE = {
  before:       IMAGES.before,
  after:        IMAGES.after,
  commentPage:  IMAGES.commentPage,
};

// ─── 单个热区 ──────────────────────────────────────────────────────────────
function Hotspot({ hotspot, isActive, onClick }) {
  // invisible 热区：透明点击区，不渲染任何视觉样式
  if (hotspot.invisible) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={hotspot.label}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        style={{
          position: 'absolute',
          top: hotspot.top,
          left: hotspot.left,
          width: hotspot.width,
          height: hotspot.height,
          cursor: 'pointer',
          zIndex: 6,
        }}
      />
    );
  }

  // 普通热区：黄色高亮框 + 脉冲动画 + 「点击」标签
  // zIndex: 8 确保可见热区优先于透明的 invisible 叠底区（均为 zIndex:6），防止点击穿透
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={hotspot.label}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        position: 'absolute',
        top: hotspot.top,
        left: hotspot.left,
        width: hotspot.width,
        height: hotspot.height,
        cursor: 'pointer',
        zIndex: 8,
      }}
    >
      {/* Border */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 6,
          border: isActive ? '1px solid #FFDD00' : '1px solid rgba(255,221,0,0.7)',
          boxShadow: isActive
            ? '0 0 0 1px rgba(255,221,0,0.3), 0 0 14px rgba(255,221,0,0.3)'
            : '0 0 0 1px rgba(255,221,0,0.15)',
          background: isActive ? 'rgba(255,221,0,0.12)' : 'rgba(255,221,0,0.06)',
          transition: 'all 0.2s ease',
        }}
      />
      {/* Pulse ring */}
      {!isActive && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 6,
            border: '1.5px solid rgba(255,221,0,0.5)',
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}

// ─── 注释卡片 ──────────────────────────────────────────────────────────────
function AnnotationCard({ data }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.tag + data.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: 16,
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 0 0 1px rgba(60,60,67,0.07)',
          padding: '20px 20px 18px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 顶角黄色光晕 */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,221,0,0.3), transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Tag */}
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700,
            padding: '3px 10px', borderRadius: 9999,
            background: '#FFDD00', color: '#1c1c1e', letterSpacing: '0.02em',
          }}>
            {data.tag}
          </span>
        </div>
        {/* Title */}
        <h2 style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 22, fontWeight: 700, color: '#1c1c1e',
          lineHeight: 1.25, letterSpacing: '-0.01em',
          margin: '0 0 10px 0',
        }}>
          {data.title}
        </h2>
        {/* 仅原型 等补充说明标签 */}
        {data.note && (
          <div style={{ marginBottom: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
              padding: '2px 8px', borderRadius: 9999,
              background: 'rgba(255,149,0,0.1)',
              color: 'rgba(190,100,0,0.9)',
              border: '1px solid rgba(255,149,0,0.22)',
            }}>
              ⚠ {data.note}
            </span>
          </div>
        )}
        {/* Body */}
        <p style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 13, color: 'rgba(60,60,67,0.65)',
          lineHeight: 1.75, margin: (data.prd || data.note) ? '0 0 14px 0' : 0,
        }}>
          {data.body}
        </p>
        {/* PRD note */}
        {data.prd && (
          <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(60,60,67,0.08)' }}>
            <div style={{ width: 2, borderRadius: 1, background: '#FFDD00', flexShrink: 0, alignSelf: 'stretch', minHeight: 14 }} />
            <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 11, color: 'rgba(60,60,67,0.45)', lineHeight: 1.6, margin: 0 }}>
              <span style={{ color: 'rgba(60,60,67,0.6)', fontWeight: 600 }}>PRD: </span>
              {data.prd}
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── 主组件 ────────────────────────────────────────────────────────────────
export default function InteractiveDemo() {
  const [view, setView]               = useState('after');  // 默认改后
  const [prevPoiView, setPrevPoiView] = useState('after');  // 记录来自哪个 POI 视图
  const [activePopup, setActivePopup] = useState(null);
  const [activeId, setActiveId]       = useState(null);
  const [rippleKey, setRippleKey]     = useState(0);
  const [annotation, setAnnotation]   = useState(DEFAULT_ANNOTATION.after);

  const hotspots      = HOTSPOT_CONFIG[view] ?? [];
  const activeHotspot = hotspots.find(h => h.id === activeId) ?? null;

  // 点击热区
  const handleClick = useCallback((hs) => {
    setActiveId(hs.id);
    setAnnotation(hs.annotation);
    setRippleKey(k => k + 1);

    if (hs.navigateTo) {
      // 切换视图
      if (view === 'before' || view === 'after') setPrevPoiView(view);
      setActivePopup(null);
      setTimeout(() => {
        setView(hs.navigateTo);
        setActiveId(null);
        setAnnotation(DEFAULT_ANNOTATION[hs.navigateTo]);
      }, 600); // 水波纹动画后再跳转
    } else if (hs.popup) {
      // 打开弹窗
      setActivePopup(hs.popup);
    }
  }, [view]);

  // 关闭弹窗
  const dismiss = useCallback(() => {
    setActiveId(null);
    setActivePopup(null);
    setAnnotation(DEFAULT_ANNOTATION[view]);
  }, [view]);

  // 改前/改后切换
  const switchPoiView = useCallback((v) => {
    setView(v);
    setPrevPoiView(v);
    setActiveId(null);
    setActivePopup(null);
    setAnnotation(DEFAULT_ANNOTATION[v]);
  }, []);

  // 返回 POI 视图
  const goBackToPoi = useCallback(() => {
    setView(prevPoiView);
    setActiveId(null);
    setActivePopup(null);
    setAnnotation(DEFAULT_ANNOTATION[prevPoiView]);
  }, [prevPoiView]);

  const isPoiView = view === 'before' || view === 'after';
  const card = {
    borderRadius: 14,
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(60,60,67,0.07)',
    padding: 16,
    marginBottom: 10,
  };

  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>

      {/* ── 左：控制面板 ──────────────────────────────────────────────────── */}
      <div style={{ width: 220, flexShrink: 0, paddingTop: 4 }}>

        {/* 改前/改后切换（仅 POI 视图显示）*/}
        <AnimatePresence>
          {isPoiView && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={card}
            >
              <p style={{ fontSize: 11, color: 'rgba(60,60,67,0.45)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                切换视图
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['before', 'after'].map(v => (
                  <button
                    key={v}
                    onClick={() => switchPoiView(v)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: view === v ? '#FFDD00' : 'rgba(118,118,128,0.1)',
                      color: '#1c1c1e',
                      fontSize: 13, fontWeight: view === v ? 700 : 400,
                      fontFamily: "'Noto Sans SC', sans-serif",
                      transition: 'all 0.2s',
                      boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                    }}
                  >
                    {v === 'before' ? '改前' : '改后'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 返回按钮（非 POI 视图显示）*/}
        <AnimatePresence>
          {!isPoiView && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={card}
            >
              <button
                onClick={goBackToPoi}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  width: '100%', padding: '9px 12px', borderRadius: 9, border: 'none',
                  background: '#FFDD00', color: '#1c1c1e',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'Noto Sans SC', sans-serif",
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                返回 POI 页
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 可交互区域列表（仅显示非 invisible 热区）*/}
        <div style={card}>
          <p style={{ fontSize: 11, color: 'rgba(60,60,67,0.45)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            可点击区域
          </p>

          {/* 改前无高亮区域 */}
          {view === 'before' && (
            <p style={{ fontSize: 12, color: 'rgba(60,60,67,0.4)', lineHeight: 1.6, margin: 0 }}>
              改前标识均为静态，无高亮交互区域。可点击评价卡片进入详情页。
            </p>
          )}

          {/* 改后、评价页 — 列出可见热区 */}
          {(view === 'after' || view === 'commentPage') && hotspots
            .filter(hs => !hs.invisible)
            .map(hs => (
              <button
                key={hs.id}
                onClick={() => handleClick(hs)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none',
                  background: activeId === hs.id ? 'rgba(255,221,0,0.2)' : 'rgba(118,118,128,0.06)',
                  color: '#1c1c1e',
                  fontSize: 11, cursor: 'pointer', textAlign: 'left',
                  marginBottom: 5, fontFamily: "'Noto Sans SC', sans-serif",
                  transition: 'all 0.2s',
                  boxShadow: activeId === hs.id ? 'inset 0 0 0 1px rgba(255,221,0,0.5)' : 'none',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: activeId === hs.id ? '#FFDD00' : 'rgba(60,60,67,0.2)' }} />
                {hs.label.split(' · ')[0]}
              </button>
            ))
          }
        </div>

        {/* 关闭弹窗按钮 */}
        <AnimatePresence>
          {activePopup && (
            <motion.button
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              onClick={dismiss}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
                background: 'rgba(118,118,128,0.1)',
                color: 'rgba(60,60,67,0.65)', fontSize: 12, cursor: 'pointer',
                fontFamily: "'Noto Sans SC', sans-serif",
              }}
            >
              关闭弹窗
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── 中：手机模拟器 ────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, transform: 'scale(0.85)', transformOrigin: 'top center' }}>
        <PhoneEmulator>
          {/* 底图 */}
          <AnimatePresence mode="sync">
            <motion.img
              key={view}
              src={VIEW_IMAGE[view]}
              alt={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top center',
                userSelect: 'none',
                cursor: 'default',
              }}
              draggable={false}
            />
          </AnimatePresence>

          {/* 热区叠加层 */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {hotspots.map(hs => (
              <Hotspot
                key={hs.id}
                hotspot={hs}
                isActive={activeId === hs.id}
                onClick={() => handleClick(hs)}
              />
            ))}
            <AnimatePresence>
              {activeHotspot && !activeHotspot.invisible && (
                <ClickRipple key={rippleKey} top={activeHotspot.clickAt.top} left={activeHotspot.clickAt.left} />
              )}
            </AnimatePresence>
          </div>

          {/* 底部弹窗 */}
          <AnimatePresence>
            {activePopup && (
              <BottomSheet key={activePopup} type={activePopup} onDismiss={dismiss} />
            )}
          </AnimatePresence>
        </PhoneEmulator>
      </div>

      {/* ── 右：注释面板 ──────────────────────────────────────────────────── */}
      <div style={{ width: 250, flexShrink: 0, paddingTop: 4 }}>
        <AnnotationCard data={annotation} />

        {/* 改后视图时显示四级标签体系 */}
        <AnimatePresence>
          {view === 'after' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                marginTop: 10, borderRadius: 14,
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(60,60,67,0.07)',
                padding: 16,
              }}
            >
              <p style={{ fontSize: 11, color: 'rgba(60,60,67,0.45)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                四级真实性标签
              </p>
              {[
                { lv: 'LV.1', label: '消费凭证',  desc: '最高级',          op: 1    },
                { lv: 'LV.2', label: '消费后评价', desc: '有消费记录',      op: 0.75 },
                { lv: 'LV.3', label: '现场拍摄',  desc: '地理+图片双验证', op: 0.55 },
                { lv: 'LV.4', label: '现场评价',  desc: '仅地理位置验证',  op: 0.38 },
              ].map(item => (
                <div key={item.lv} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, opacity: item.op }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#1c1c1e', background: '#FFDD00', padding: '1px 5px', borderRadius: 4, flexShrink: 0 }}>
                    {item.lv}
                  </span>
                  <span style={{ fontSize: 12, color: '#1c1c1e', flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 10, color: 'rgba(60,60,67,0.4)' }}>{item.desc}</span>
                </div>
              ))}
              <p style={{ fontSize: 10, color: 'rgba(60,60,67,0.3)', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                互斥取最高级，有高级标签则不展示低级标签
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
