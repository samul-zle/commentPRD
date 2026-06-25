/**
 * LongTermDemo.jsx — 长期方案交互演示
 *
 * 视图：
 *   longTerm          ← 主视图（长期poi.png），含评鉴官 / 达人两个热区
 *   evaluatorLanding  ← 评鉴官落地页（手机内跳转，无热区）
 *
 * 弹窗：
 *   evaluator — 评鉴官弹窗 + 底部「成为评鉴官」透明热区（onCta → evaluatorLanding）
 *   foodie    — 达人弹窗（美食），右侧说明区展示门票/酒店卡片
 */

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IMAGES, LONG_TERM_SIDEBAR } from '../constants/demoScript.js';
import PhoneEmulator from '../components/PhoneEmulator.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
import ClickRipple from '../components/ClickRipple.jsx';

// ══════════════════════════════════════════════════════════════════════
// 热区坐标
// 以长期poi.png 为基准，百分比坐标
// ⚠ 如需微调，只改这里
// ══════════════════════════════════════════════════════════════════════
const HOTSPOTS = [
  {
    id: 'evaluator-tag',
    label: '评鉴官 · 点击查看',
    top: '40.5%', left: '50%', width: '14%', height: '3%',
    clickAt: { top: '42%', left: '57%' },
    popup: 'evaluator',
    annotation: {
      tag: '评鉴官标识',
      title: '评鉴官身份浮层',
      body: '美团官方认证的评鉴官，具备专业评价资质。点击标签展开评鉴官身份卡片，可跳转「成为评鉴官」报名页。',
      prd: '中长期方案：新增评鉴官专属标识，点击可查看身份详情并引导报名',
    },
  },
  {
    id: 'foodie-tag',
    label: '达人 · 点击查看',
    top: '43%', left: '1%', width: '10.5%', height: '2.5%',
    clickAt: { top: '44%', left: '6%' },
    popup: 'foodie',
    annotation: {
      tag: '达人标识',
      title: '美食达人身份浮层',
      body: '内容创作活跃、拥有粉丝基础的达人用户。点击标签展开达人身份卡片，区分评价的参考价值。',
      prd: '中长期方案：新增达人标识体系，覆盖美食/门票/酒店等多个品类',
    },
  },
];

// ── 默认注释 ──────────────────────────────────────────────────────────
const DEFAULT_ANNOTATION = {
  longTerm: {
    tag: '中长期方案',
    title: '点击高亮区域',
    body: '中长期方案新增「评鉴官」与「达人」两类写评人标识，赋予评价更丰富的参考维度。',
    prd: null,
  },
  evaluatorLanding: {
    tag: '评鉴官落地页',
    title: '成为评鉴官',
    body: '展示评鉴官申请页面，用户可了解评鉴官资质要求并提交申请。',
    prd: null,
  },
};

// ── 底图映射 ────────────────────────────────────────────────────────────
const VIEW_IMAGE = {
  longTerm:          IMAGES.longTerm,
  evaluatorLanding:  IMAGES.evaluatorLanding,
};

// ─── 单个热区 ──────────────────────────────────────────────────────────────
function Hotspot({ hotspot, isActive, onClick }) {
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
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 6,
        border: isActive ? '1px solid #ffdd00' : '1px solid rgba(255,149,0,0.7)',
        boxShadow: isActive
          ? '0 0 0 1px rgba(255,149,0,0.3), 0 0 14px rgba(255,149,0,0.3)'
          : '0 0 0 1px rgba(255,149,0,0.15)',
        background: isActive ? 'rgba(255,149,0,0.12)' : 'rgba(255,149,0,0.06)',
        transition: 'all 0.2s ease',
      }} />
      {/* Pulse ring */}
      {!isActive && (
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 6,
            border: '1.5px solid rgba(255,149,0,0.5)',
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
        {/* 顶角橙色光晕 */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,149,0,0.25), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700,
            padding: '3px 10px', borderRadius: 9999,
            background: 'linear-gradient(135deg, #ffdd00, #ffdd00)',
            color: '#fff', letterSpacing: '0.02em',
          }}>
            {data.tag}
          </span>
        </div>
        <h2 style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 22, fontWeight: 700, color: '#1c1c1e',
          lineHeight: 1.25, letterSpacing: '-0.01em',
          margin: '0 0 10px 0',
        }}>
          {data.title}
        </h2>
        <p style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 13, color: 'rgba(60,60,67,0.65)',
          lineHeight: 1.75, margin: data.prd ? '0 0 14px 0' : 0,
        }}>
          {data.body}
        </p>
        {data.prd && (
          <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(60,60,67,0.08)' }}>
            <div style={{ width: 2, borderRadius: 1, background: '#ffdd00', flexShrink: 0, alignSelf: 'stretch', minHeight: 14 }} />
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

// ─── 单个达人品类预览卡（弹窗+Logo 组合，仿 BottomSheet 悬浮 logo）──────────
// width 由父容器 flex-wrap 控制，固定为两列宽度
function DarenItemCard({ label, popup, logo }) {
  return (
    <div style={{ width: 'calc(50% - 7px)', flexShrink: 0, flexGrow: 0, minWidth: 0 }}>
      {/* 弹窗预览区：logo 悬浮在顶部，与 BottomSheet 同构 */}
      <div style={{
        position: 'relative',
        marginTop: 26,          /* 给 logo 溢出顶部留出空间 */
        borderRadius: 10,
        overflow: 'visible',
        background: 'rgba(118,118,128,0.05)',
        border: '1px solid rgba(60,60,67,0.07)',
      }}>
        {/* 悬浮 Logo：水平居中，上半部分溢出容器 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          <img
            src={logo}
            alt={label + ' logo'}
            style={{ width: 120, height: 'auto', display: 'block' }}
            draggable={false}
          />
        </div>

        {/* 弹窗缩略图 */}
        <img
          src={popup}
          alt={label + '弹窗'}
          style={{
            width: '100%', height: 'auto',
            display: 'block',
            borderRadius: 10,
          }}
          draggable={false}
        />
      </div>

      {/* 品类标签 */}
      <p style={{
        fontSize: 13, fontWeight: 600,
        color: 'rgba(60,60,67,0.65)',
        textAlign: 'center',
        margin: '8px 0 0',
      }}>
        {label}
      </p>
    </div>
  );
}

// ─── 右侧「达人生态」说明卡片 ──────────────────────────────────────────────
function DarenSidebarCard() {
  // 4 个品类 → 2×2 整齐布局
  const items = [
    { key: 'foodie',  ...LONG_TERM_SIDEBAR.foodie  },
    { key: 'ticket',  ...LONG_TERM_SIDEBAR.ticket  },
    { key: 'hotel',   ...LONG_TERM_SIDEBAR.hotel   },
    { key: 'leisure', ...LONG_TERM_SIDEBAR.leisure  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.12, duration: 0.3 }}
      style={{
        marginTop: 10,
        borderRadius: 14,
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(60,60,67,0.07)',
        padding: '16px 14px 14px',
      }}
    >
      <p style={{
        fontSize: 11, color: 'rgba(60,60,67,0.45)',
        marginBottom: 4, fontWeight: 600,
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        中长期方案 · 达人生态
      </p>

      {/* flex-wrap 两列：前两个并排，第三个换行居中 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        {items.map(item => (
          <DarenItemCard key={item.key} label={item.label} popup={item.popup} logo={item.logo} />
        ))}
      </div>

      <p style={{
        fontSize: 10, color: 'rgba(60,60,67,0.35)',
        margin: '10px 0 0',
        lineHeight: 1.55,
        textAlign: 'center',
        letterSpacing: '0.02em',
      }}>
        更多达人品类设计中
      </p>
    </motion.div>
  );
}

// ─── 主组件 ────────────────────────────────────────────────────────────────
export default function LongTermDemo() {
  const [view, setView]             = useState('longTerm');
  const [activePopup, setActivePopup] = useState(null);
  const [activeId, setActiveId]     = useState(null);
  const [rippleKey, setRippleKey]   = useState(0);
  const [annotation, setAnnotation] = useState(DEFAULT_ANNOTATION.longTerm);

  const hotspots      = view === 'longTerm' ? HOTSPOTS : [];
  const activeHotspot = hotspots.find(h => h.id === activeId) ?? null;

  // 点击热区
  const handleClick = useCallback((hs) => {
    setActiveId(hs.id);
    setAnnotation(hs.annotation);
    setRippleKey(k => k + 1);
    if (hs.popup) {
      setActivePopup(hs.popup);
    }
  }, []);

  // 「成为评鉴官」CTA → 跳转落地页
  const handleEvaluatorCta = useCallback(() => {
    setActivePopup(null);
    setActiveId(null);
    setTimeout(() => {
      setView('evaluatorLanding');
      setAnnotation(DEFAULT_ANNOTATION.evaluatorLanding);
    }, 250);
  }, []);

  // 关闭弹窗
  const dismiss = useCallback(() => {
    setActiveId(null);
    setActivePopup(null);
    setAnnotation(DEFAULT_ANNOTATION[view]);
  }, [view]);

  // 返回主视图
  const goBack = useCallback(() => {
    setView('longTerm');
    setActiveId(null);
    setActivePopup(null);
    setAnnotation(DEFAULT_ANNOTATION.longTerm);
  }, []);

  const card = {
    borderRadius: 14,
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(60,60,67,0.07)',
    padding: 16,
    marginBottom: 10,
  };

  const isMainView = view === 'longTerm';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f2f2f7',
      paddingTop: 56,
      fontFamily: "'Noto Sans SC', sans-serif",
    }}>
      {/* 页头 */}
      <div style={{ padding: '32px 24px 0', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1c1c1e', marginBottom: 6, letterSpacing: '-0.01em' }}>
          中长期方案 · 写评人标识体系
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(60,60,67,0.55)', marginBottom: 40 }}>
          评鉴官标识 + 达人标识 — 为评价赋予更丰富的参考维度
        </p>
      </div>

      {/* 主体布局 */}
      <div style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>

          {/* ── 左：控制面板 ─────────────────────────────────────────────── */}
          <div style={{ width: 220, flexShrink: 0, paddingTop: 4 }}>

            {/* 返回按钮（落地页时显示）*/}
            <AnimatePresence>
              {!isMainView && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={card}
                >
                  <button
                    onClick={goBack}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      width: '100%', padding: '9px 12px', borderRadius: 9, border: 'none',
                      background: 'linear-gradient(135deg, #ffdd00, #ffdd00)',
                      color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
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

            {/* 可点击区域列表（主视图时显示）*/}
            <AnimatePresence>
              {isMainView && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={card}
                >
                  <p style={{
                    fontSize: 11, color: 'rgba(60,60,67,0.45)',
                    marginBottom: 10, fontWeight: 600,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    可点击区域
                  </p>
                  {HOTSPOTS.map(hs => (
                    <button
                      key={hs.id}
                      onClick={() => handleClick(hs)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none',
                        background: activeId === hs.id ? 'rgba(255,149,0,0.15)' : 'rgba(118,118,128,0.06)',
                        color: '#1c1c1e',
                        fontSize: 11, cursor: 'pointer', textAlign: 'left',
                        marginBottom: 5, fontFamily: "'Noto Sans SC', sans-serif",
                        transition: 'all 0.2s',
                        boxShadow: activeId === hs.id ? 'inset 0 0 0 1px rgba(255,149,0,0.5)' : 'none',
                      }}
                    >
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: activeId === hs.id ? '#ffdd00' : 'rgba(60,60,67,0.2)',
                      }} />
                      {hs.label.split(' · ')[0]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

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

          {/* ── 中：手机模拟器 ────────────────────────────────────────────── */}
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
                    userSelect: 'none', cursor: 'default',
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
                  {activeHotspot && (
                    <ClickRipple key={rippleKey} top={activeHotspot.clickAt.top} left={activeHotspot.clickAt.left} />
                  )}
                </AnimatePresence>
              </div>

              {/* 底部弹窗 */}
              <AnimatePresence>
                {activePopup && (
                  <BottomSheet
                    key={activePopup}
                    type={activePopup}
                    onDismiss={dismiss}
                    onCta={activePopup === 'evaluator' ? handleEvaluatorCta : undefined}
                  />
                )}
              </AnimatePresence>
            </PhoneEmulator>
          </div>

          {/* ── 右：注释面板 ──────────────────────────────────────────────── */}
          <div style={{ width: 340, flexShrink: 0, paddingTop: 4 }}>
            <AnnotationCard data={annotation} />

            {/* 达人生态说明卡（固定展示）*/}
            <DarenSidebarCard />
          </div>

        </div>
      </div>
    </div>
  );
}
