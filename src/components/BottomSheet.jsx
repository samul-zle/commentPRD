import { motion } from 'motion/react';
import { IMAGES, LOGOS } from '../constants/demoScript.js';

export default function BottomSheet({ type, onDismiss, onCta }) {
  const imageSrc = IMAGES[type];
  const logoSrc = LOGOS[type];   // 仅部分类型有 logo
  const isTruthGuard = type === 'truthGuard';
  const hasEvaluatorCta = type === 'evaluator' && typeof onCta === 'function';

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
        exit={{ y: '120%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        {/* 悬浮 logo：
            - position absolute，top: 0 对齐弹窗顶边
            - translateY(-50%) 将自身上移半个身位，实现"一半悬出、一半压内"
            - 居中水平 */}
        {logoSrc && (
          <div className="logo" style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: type === 'onsite' || type === 'consume' ? 'translate(-45%, -43%)' : type === 'evaluator' ? 'translate(-50%, -49%)' : type === 'foodie' || type === 'ticket' || type === 'hotel' ? 'translate(-50%, -55%)' : 'translate(-50%, -50%)',
            zIndex: 12,
            pointerEvents: 'none',
          }}>
            <img
              src={logoSrc}
              alt=""
              style={{
                width: type === 'onsite' || type === 'consume' ? 265 : type === 'member' ? 167 : type === 'evaluator' ? 310 : type === 'foodie' || type === 'ticket' || type === 'hotel' ? 250 : 300,         // 固定 80px，与弹窗宽度无关，badge 大小稳定
                height: 'auto',
                display: 'block',
                maxWidth: 'unset',
              }}
              draggable={false}
            />
          </div>
        )}

        {/* 右上角关闭按钮（位于 clip 层外侧，不受 overflow:hidden 裁切）*/}
        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="关闭"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 13,
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
              opacity: isTruthGuard ? 1: 0,
            }}
          >
            ✕
          </button>
        )}

        {/* truthGuard：上圆角 clip 层（包住可滚动区，使圆角裁切生效）*/}
        <div style={isTruthGuard ? { borderRadius: '20px 20px 0 0', overflow: 'hidden' } : {}}>
          {/* truthGuard 限高 500 + 可滚动；其余弹窗不限高 */}
          <div style={isTruthGuard ? { maxHeight: 750, overflowY: 'auto' } : { position: 'relative' }}>
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
            {/* 评鉴官弹窗：「成为评鉴官」按钮透明热区 */}
            {hasEvaluatorCta && (
              <div
                role="button"
                aria-label="成为评鉴官"
                onClick={onCta}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '16%',
                  zIndex: 14,
                  cursor: 'pointer',
                }}
              />
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
