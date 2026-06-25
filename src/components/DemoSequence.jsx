import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'motion/react';
import { STEPS, TOTAL_STEPS } from '../constants/demoScript.js';
import PhoneEmulator from './PhoneEmulator.jsx';
import ScreenLayer from './ScreenLayer.jsx';
import AnnotationPanel from './AnnotationPanel.jsx';
import ReplayButton from './ReplayButton.jsx';

// Steps that show a click ripple animation
const CLICK_STEPS = new Set([2, 7, 10, 14]);

export default function DemoSequence() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });

  // Auto-start when entering viewport
  useEffect(() => {
    if (isInView && currentStep === -1) {
      // Small delay before starting
      const t = setTimeout(() => {
        setCurrentStep(0);
        setIsPlaying(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [isInView, currentStep]);

  // Show ripple for click steps
  useEffect(() => {
    if (!isPlaying || currentStep < 0) return;
    if (CLICK_STEPS.has(currentStep)) {
      // Show ripple briefly after step starts
      const t = setTimeout(() => setShowRipple(true), 200);
      const t2 = setTimeout(() => setShowRipple(false), 900);
      return () => { clearTimeout(t); clearTimeout(t2); };
    } else {
      setShowRipple(false);
    }
  }, [currentStep, isPlaying]);

  // Step advancement timer
  useEffect(() => {
    if (!isPlaying || currentStep < 0) return;
    if (currentStep >= TOTAL_STEPS) {
      setIsPlaying(false);
      return;
    }
    const step = STEPS[currentStep];
    timerRef.current = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, step.duration);
    return () => clearTimeout(timerRef.current);
  }, [currentStep, isPlaying]);

  const replay = useCallback(() => {
    clearTimeout(timerRef.current);
    setShowRipple(false);
    setCurrentStep(0);
    setIsPlaying(true);
  }, []);

  const isFinished = currentStep >= TOTAL_STEPS;
  const step = currentStep >= 0 && currentStep < TOTAL_STEPS ? STEPS[currentStep] : null;

  return (
    <div ref={containerRef}>
      {/* ── Phone + Annotation layout ────────────────────────────────── */}
      <div className="flex items-start justify-center gap-8 flex-wrap">
        {/* Left: annotation panel */}
        <div className="hidden lg:flex flex-col gap-3 w-64 pt-6">
          <AnnotationPanel
            step={step}
            currentStepIndex={Math.max(0, currentStep)}
            total={TOTAL_STEPS}
          />
        </div>

        {/* Center: phone emulator */}
        <div className="relative" style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
          <PhoneEmulator>
            {currentStep >= 0 ? (
              <ScreenLayer step={step} showRipple={showRipple} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: '#f2f2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid rgba(60,60,67,0.15)', borderTopColor: '#FFDD00', animation: 'spin 0.8s linear infinite' }} />
              </div>
            )}
            {/* Replay overlay */}
            {isFinished && <ReplayButton onReplay={replay} />}
          </PhoneEmulator>
        </div>

        {/* Right: empty balance column on desktop */}
        <div className="hidden lg:block w-64" />
      </div>

      {/* ── Mobile annotation (below phone on small screens) ─────────── */}
      <div className="lg:hidden mt-6 px-4">
        <AnnotationPanel
          step={step}
          currentStepIndex={Math.max(0, currentStep)}
          total={TOTAL_STEPS}
        />
      </div>

      {/* ── Replay button (mobile) ────────────────────────────────────── */}
      {isFinished && (
        <div className="lg:hidden text-center mt-4">
          <button
            onClick={replay}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 9999, border: 'none',
              background: '#FFDD00', color: '#1c1c1e',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Noto Sans SC', sans-serif",
            }}
          >
            重新播放
          </button>
        </div>
      )}
    </div>
  );
}
