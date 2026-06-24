export default function Nav() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      height: 52,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(60,60,67,0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22,
          borderRadius: '50%',
          background: '#FFDD00',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1c1c1e' }}>美团评价</span>
        <span style={{ color: 'rgba(60,60,67,0.3)', margin: '0 2px' }}>/</span>
        <span style={{ fontSize: 13, color: 'rgba(60,60,67,0.6)' }}>写评人身份标识体系升级</span>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <span style={{
          fontSize: 11,
          color: 'rgba(60,60,67,0.5)',
          background: 'rgba(118,118,128,0.12)',
          padding: '3px 10px',
          borderRadius: 9999,
        }}>
          一期方案 · PRD v1.0
        </span>
      </div>
    </nav>
  );
}
