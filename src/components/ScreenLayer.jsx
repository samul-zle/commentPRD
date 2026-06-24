import { AnimatePresence, motion } from 'motion/react';
import { IMAGES } from '../constants/demoScript.js';
import HighlightOverlay from './HighlightOverlay.jsx';
import BottomSheet from './BottomSheet.jsx';
import ClickRipple from './ClickRipple.jsx';

export default function ScreenLayer({ step, showRipple }) {
  if (!step) return (
    <div style={{ position: 'absolute', inset: 0, background: '#f2f2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid rgba(60,60,67,0.12)', borderTopColor: '#FFDD00', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const imageSrc = IMAGES[step.image];

  return (
    <div className="absolute inset-0">
      {/* ── Background image with crossfade (only when image source changes) */}
      <AnimatePresence mode="sync">
        <motion.img
          key={step.image}
          src={imageSrc}
          alt="POI 评价页"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'top center',
          }}
          draggable={false}
        />
      </AnimatePresence>

      {/* ── Overlay container (percentage-positioned) ──────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Highlight overlay */}
        <AnimatePresence>
          {step.highlight && (
            <HighlightOverlay key={`hl-${step.id}`} {...step.highlight} />
          )}
        </AnimatePresence>

        {/* Click ripple */}
        <AnimatePresence>
          {showRipple && step.clickTarget && (
            <ClickRipple
              key={`ripple-${step.id}`}
              top={step.clickTarget.top}
              left={step.clickTarget.left}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom sheet popups ─────────────────────────────────────── */}
      <AnimatePresence>
        {step.bottomSheet && (
          <BottomSheet
            key={`sheet-${step.bottomSheet}`}
            type={step.bottomSheet}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
