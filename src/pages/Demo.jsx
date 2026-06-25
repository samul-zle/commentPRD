import { useState } from 'react';
import DemoSequence from '../components/DemoSequence.jsx';
import InteractiveDemo from '../components/InteractiveDemo.jsx';

const TABS = [
  { key: 'auto',        label: '自动演示', desc: '按剧本自动播放，约 20 秒' },
  { key: 'interactive', label: '自由探索', desc: '手动点击高亮区域触发弹窗' },
];

export default function Demo() {
  const [activeTab, setActiveTab] = useState('auto');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f2f2f7',
      paddingTop: 56,
      fontFamily: "'Noto Sans SC', sans-serif",
    }}>
      {/* 页头 */}
      <div style={{ padding: '16px 24px 0', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        {/* iOS 分段控制器 */}
        <div style={{
          display: 'inline-flex',
          background: 'white',
          borderRadius: 10,
          padding: 3,
          gap: 2,
          marginBottom: 20,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '7px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: 13,
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: '#1c1c1e',
                background: activeTab === tab.key
                  ? '#ffdd00'
                  : 'transparent',
                boxShadow: activeTab === tab.key
                  ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)'
                  : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
              <span style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 400,
                opacity: 0.55,
                marginTop: 1,
              }}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 内容 */}
      <div style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        {activeTab === 'auto' ? <DemoSequence /> : <InteractiveDemo />}
      </div>
    </div>
  );
}
