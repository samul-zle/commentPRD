import { AnimatePresence, motion } from 'motion/react';

export default function AnnotationPanel({ step, currentStepIndex, total }) {
  if (!step) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 240 }}>

      {/* 注释卡片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
          {step.annotation?.tag && (
            <div style={{ marginBottom: 12 }}>
              <span style={{
                display: 'inline-block',
                fontSize: 11, fontWeight: 700,
                padding: '3px 10px', borderRadius: 9999,
                background: '#FFDD00',
                color: '#1c1c1e',
                letterSpacing: '0.02em',
              }}>
                {step.annotation.tag}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: 20, fontWeight: 700,
            color: '#1c1c1e',
            lineHeight: 1.3, letterSpacing: '-0.01em',
            margin: '0 0 10px 0',
          }}>
            {step.annotation?.title}
          </h2>

          {/* Body */}
          <p style={{
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: 12, color: 'rgba(60,60,67,0.65)',
            lineHeight: 1.75, margin: 0,
          }}>
            {step.annotation?.body}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 进度条 */}
      <div style={{ padding: '0 2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'rgba(60,60,67,0.4)' }}>演示进度</span>
          <span style={{ fontSize: 10, color: 'rgba(60,60,67,0.4)' }}>
            {currentStepIndex + 1} / {total}
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 9999, background: 'rgba(60,60,67,0.1)', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: 9999, background: '#FFDD00' }}
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStepIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 图例 */}
      <div style={{
        borderRadius: 12, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(60,60,67,0.07)',
        padding: '12px 14px',
        fontSize: 10, color: 'rgba(60,60,67,0.5)', lineHeight: 1.6,
      }}>
        {[
          { color: '#FFDD00', border: '1.5px solid #FFDD00', label: '高亮：改动区域' },
          { color: 'rgba(255,221,0,0.5)', border: 'none', label: '点击：模拟用户操作', round: true },
          { color: '#fff', border: '1px solid rgba(60,60,67,0.15)', label: '底部弹窗：功能详情' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 2 ? 6 : 0 }}>
            <div style={{
              width: 12, height: 12, flexShrink: 0,
              borderRadius: item.round ? '50%' : 3,
              background: item.color,
              border: item.border,
            }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
