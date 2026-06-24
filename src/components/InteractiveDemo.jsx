import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IMAGES } from '../constants/demoScript.js';
import { HIGHLIGHT_POSITIONS as HP } from '../constants/hotspots.js';
import PhoneEmulator from './PhoneEmulator.jsx';
import BottomSheet from './BottomSheet.jsx';
import ClickRipple from './ClickRipple.jsx';

// 坐标全部来自 constants/hotspots.js 的 HIGHLIGHT_POSITIONS，只改那里

const HOTSPOT_CONFIG = {
  before: [
    {
      id: 'member',
      label: '黑金会员 · 点击查看浮层',
      ...HP.member_before,
      popup: 'member',
      annotation: {
        tag: '会员等级增强',
        title: '会员身份浮层',
        body: '点击后展开浮层，显示头像、昵称、成长值档位、会员等级Logo+星级、已获勋章、跳转会员主页入口。用户可在「设置-隐私」中屏蔽勋章展示。',
        prd: '改动点：增加星级展示+点击可查看身份浮层',
      },
    },
  ],
  after: [
    {
      id: 'member-after',
      label: '黑钻4星 · 点击查看浮层',
      ...HP.member_after,
      popup: 'member',
      annotation: {
        tag: '会员等级增强',
        title: '改后：黑钻4星展示',
        body: '改版后，会员标签新增星级数字（如「黑钻4星」），视觉规范与会员产品统一。用户关闭会员信息展示时不显示星级。',
        prd: '改动点：增加星级展示+点击可查看身份浮层',
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
        body: '判定条件：距店100米内 + 带本店现场拍摄图片（地理位置+图片双重验证）。AI识别为非现场图片时，降级展示为现场评价(LV.4)。',
        prd: '改动点：新增 LV.3 标签，地理+图片双重验证',
      },
    },
  ],
};

// ─── 静止状态默认注释 ──────────────────────────────────────────────────────
const DEFAULT_ANNOTATIONS = {
  before: {
    tag: '改前',
    title: '当前状态：无交互',
    body: '黑金/黑钻会员仅展示文字标签，无星级区分度，标识均为静态展示。切换到「改后」查看升级后的可交互效果。',
    prd: null,
  },
  after: {
    tag: '改后',
    title: '点击高亮区域查看标签详情',
    body: '会员标签新增星级，消费后评价和现场拍摄标签均可点击查看判定依据。',
    prd: null,
  },
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
        zIndex: 6,
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
// 设计层次：tag(11px) → title(22px 700) → body(13px) → prd(11px)
// iOS 白色卡片，阴影在浅灰背景上清晰可见
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
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 9999,
            background: '#FFDD00',
            color: '#1c1c1e',
            letterSpacing: '0.02em',
          }}>
            {data.tag}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: '#1c1c1e',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          margin: '0 0 10px 0',
        }}>
          {data.title}
        </h2>

        {/* Body */}
        <p style={{
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: 13,
          color: 'rgba(60,60,67,0.65)',
          lineHeight: 1.75,
          margin: data.prd ? '0 0 14px 0' : 0,
        }}>
          {data.body}
        </p>

        {/* PRD note */}
        {data.prd && (
          <div style={{
            display: 'flex', gap: 10,
            paddingTop: 12,
            borderTop: '1px solid rgba(60,60,67,0.08)',
          }}>
            <div style={{
              width: 2, borderRadius: 1,
              background: '#FFDD00',
              flexShrink: 0, alignSelf: 'stretch', minHeight: 14,
            }} />
            <p style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: 11,
              color: 'rgba(60,60,67,0.45)',
              lineHeight: 1.6, margin: 0,
            }}>
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
  const [view, setView]               = useState('after'); // 默认改后
  const [activePopup, setActivePopup] = useState(null);
  const [activeId, setActiveId]       = useState(null);
  const [rippleKey, setRippleKey]     = useState(0);
  const [annotation, setAnnotation]   = useState(DEFAULT_ANNOTATIONS.after);

  const hotspots      = HOTSPOT_CONFIG[view];
  const activeHotspot = hotspots.find(h => h.id === activeId) ?? null;

  const handleClick = useCallback((hs) => {
    setActiveId(hs.id);
    setActivePopup(hs.popup);
    setAnnotation(hs.annotation);
    setRippleKey(k => k + 1);
  }, []);

  const dismiss = useCallback(() => {
    setActiveId(null);
    setActivePopup(null);
    setAnnotation(DEFAULT_ANNOTATIONS[view]);
  }, [view]);

  const switchView = useCallback((v) => {
    setView(v);
    setActiveId(null);
    setActivePopup(null);
    setAnnotation(DEFAULT_ANNOTATIONS[v]);
  }, []);

  // 白色卡片通用样式（在 #f2f2f7 背景上可见）
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

        {/* 改前/改后切换 */}
        <div style={card}>
          <p style={{ fontSize: 11, color: 'rgba(60,60,67,0.45)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            切换视图
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {['before', 'after'].map(v => (
              <button
                key={v}
                onClick={() => switchView(v)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 9, border: 'none',
                  cursor: 'pointer',
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
        </div>

        {/* 可交互区域列表 */}
        <div style={card}>
          <p style={{ fontSize: 11, color: 'rgba(60,60,67,0.45)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            可点击区域
          </p>

          {hotspots.length === 0 && (
            <div style={{ padding: '4px 0' }}>
              <p style={{ fontSize: 12, color: 'rgba(60,60,67,0.4)', lineHeight: 1.6, margin: 0 }}>
                改前状态标识均为静态，无可交互区域。切换到「改后」查看可点击功能。
              </p>
            </div>
          )}

          {hotspots.map(hs => (
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
              <span style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: activeId === hs.id ? '#FFDD00' : 'rgba(60,60,67,0.2)',
              }} />
              {hs.label.split(' · ')[0]}
            </button>
          ))}
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
              src={IMAGES[view]}
              alt={view === 'before' ? '改前 POI' : '改后 POI'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top center',
                userSelect: 'none',
              }}
              draggable={false}
            />
          </AnimatePresence>

          {/* 热区 */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {hotspots.map(hs => (
              <Hotspot key={hs.id} hotspot={hs} isActive={activeId === hs.id} onClick={() => handleClick(hs)} />
            ))}
            <AnimatePresence>
              {activeHotspot && (
                <ClickRipple key={rippleKey} top={activeHotspot.clickAt.top} left={activeHotspot.clickAt.left} />
              )}
            </AnimatePresence>
          </div>

          {/* 弹窗 */}
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

        {/* 改后视图：四级标签体系说明 */}
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
                消费凭证和消费后评价取其一、现场拍摄与现场评价取其一，有高级标签则不展示低级标签
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
