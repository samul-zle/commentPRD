import { motion } from 'motion/react';

export default function HighlightOverlay({ top, left, width, height }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ top, left, width, height, position: 'absolute', zIndex: 5 }}
    >
      {/* Main border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          border: '2px solid #FF6B00',
          boxShadow: '0 0 0 1px rgba(255,107,0,0.3), 0 0 12px rgba(255,107,0,0.25)',
        }}
      />
      {/* Pulsing glow ring */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          border: '2px solid rgba(255,107,0,0.6)',
        }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.7, 0.15, 0.7],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Corner accents */}
      {[
        { top: -3, left: -3 },
        { top: -3, right: -3 },
        { bottom: -3, left: -3 },
        { bottom: -3, right: -3 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 rounded-sm"
          style={{ ...pos, background: '#FF6B00' }}
        />
      ))}
    </motion.div>
  );
}
