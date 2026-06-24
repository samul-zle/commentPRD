import { motion } from 'motion/react';

export default function ClickRipple({ top, left }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Finger dot */}
      <motion.div
        className="absolute"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'rgba(255,107,0,0.6)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1, opacity: 0.8 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Ripple ring 1 */}
      <motion.div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1px solid rgba(255,107,0,0.8)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 3.5, opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />

      {/* Ripple ring 2 */}
      <motion.div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,107,0,0.5)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 5, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
      />
    </div>
  );
}
