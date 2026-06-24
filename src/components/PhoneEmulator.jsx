// iPhone-style phone emulator
// Screen area: 390px × 844px (iPhone 14 standard)
export default function PhoneEmulator({ children }) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: 390,
        // Overall phone shell height
        height: 860,
      }}
    >
      {/* ── Phone outer shell ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-[52px] border-[3px] border-zinc-700/80 bg-zinc-900"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 32px 80px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Glossy highlight */}
        <div
          className="absolute inset-0 rounded-[52px] pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
          }}
        />

        {/* ── Side buttons ─────────────────────────────────────────────── */}
        {/* Volume up */}
        <div
          className="absolute rounded-l-sm bg-zinc-700"
          style={{ left: -5, top: 120, width: 4, height: 36 }}
        />
        {/* Volume down */}
        <div
          className="absolute rounded-l-sm bg-zinc-700"
          style={{ left: -5, top: 164, width: 4, height: 36 }}
        />
        {/* Silent switch */}
        <div
          className="absolute rounded-l-sm bg-zinc-700"
          style={{ left: -5, top: 88, width: 4, height: 22 }}
        />
        {/* Power button */}
        <div
          className="absolute rounded-r-sm bg-zinc-700"
          style={{ right: -5, top: 140, width: 4, height: 68 }}
        />

        {/* ── Screen container ─────────────────────────────────────────── */}
        <div
          className="absolute overflow-hidden bg-black"
          style={{
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            borderRadius: 46,
          }}
        >
          {/* Dynamic Island — 浮在内容上方，不占高度 */}
          <div
            className="absolute z-20 bg-black rounded-full"
            style={{
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 126,
              height: 36,
            }}
          />

          {/* 内容区直接从顶部开始，图片本身含状态栏 */}
          <div className="absolute inset-0 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
