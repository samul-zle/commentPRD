import { motion } from 'motion/react';

export default function ReplayButton({ onReplay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(242,242,247,0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 20,
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(60,60,67,0.55)', marginBottom: 14 }}>演示完成</p>
        <button
          onClick={onReplay}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 9999, border: 'none',
            background: '#FFDD00', color: '#1c1c1e',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          重新播放
        </button>
      </div>
    </motion.div>
  );
}
