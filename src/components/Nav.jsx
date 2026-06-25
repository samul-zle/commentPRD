const TABS = [
  { key: 'phase1', label: '一期方案', sub: 'PRD v1.0' },
  { key: 'longTerm', label: '中长期方案', sub: 'Long-term' },
];

export default function Nav({ activeSection = 'phase1', onSectionChange }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(60,60,67,0.1)',
    }}>

      {/* 左：品牌标题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          width: 22, height: 22,
          borderRadius: '50%',
          background: '#FFDD00',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1c1e' }}>美团评价</span>
        <span style={{ color: 'rgba(60,60,67,0.3)', margin: '0 2px' }}>/</span>
        <span style={{ fontSize: 13, color: 'rgba(60,60,67,0.55)' }}>写评人身份标识体系升级</span>
      </div>

      {/* 中：方案切换 — 绝对居中，iOS Segmented Control */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        background: 'rgba(118,118,128,0.12)',
        borderRadius: 12,
        padding: 4,
        gap: 3,
      }}>
        {TABS.map(tab => {
          const isActive = activeSection === tab.key;
          const isLongTerm = tab.key === 'longTerm';
          return (
            <button
              key={tab.key}
              onClick={() => onSectionChange?.(tab.key)}
              style={{
                padding: '6px 22px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
                transition: 'all 0.22s ease',
                background: isActive ? 'linear-gradient(135deg, #ffdd00, #ffdd00)' : 'transparent',
                boxShadow: isActive
                  ? (isLongTerm
                    ? '0 2px 10px rgba(255,107,0,0.4)'
                    : '0 1px 4px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.08)')
                  : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

    </nav>
  );
}
