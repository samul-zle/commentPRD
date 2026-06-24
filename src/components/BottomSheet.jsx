import { motion } from 'motion/react';
import { IMAGES } from '../constants/demoScript.js';

export default function BottomSheet({ type, onDismiss }) {
  const imageSrc = IMAGES[type];

  return (
    <>
      {/* 蒙层 */}
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
      </motion.div>
    </>
  );
}
