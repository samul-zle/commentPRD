import { motion } from 'motion/react';
import { IMAGES } from '../constants/demoScript.js';

export default function BottomSheet({ type, onDismiss }) {
  const imageSrc     = IMAGES[type];
  const isTruthGuard = type === 'truthGuard';

  return (
    <>
      {/* 蒙层：点击关闭 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onDismiss}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 9,
          cursor: onDismiss ? 'pointer' : 'default',
        }}
      />

      {/* 弹窗主体，从底部滑入 */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        {/* 右上角关闭按钮（位于 clip 层外侧，不受 overflow:hidden 裁切）*/}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="关闭"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 11,
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.35)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        )}

        {/* truthGuard：上圆角 clip 层（包住可滚动区，使圆角裁切生效）*/}
        <div style={isTruthGuard ? { borderRadius: '20px 20px 0 0', overflow: 'hidden' } : {}}>
          {/* truthGuard 限高 500 + 可滚动；其余弹窗不限高 */}
          <div style={isTruthGuard ? { maxHeight: 500, overflowY: 'auto' } : {}}>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="弹窗内容"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
