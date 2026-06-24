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
      paddingTop: 52,
      fontFamily: "'Noto Sans SC', sans-serif",
    }}>
      {/* 页头 */}
      <div style={{ padding: '32px 24px 0', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1c1c1e', marginBottom: 6, letterSpacing: '-0.01em' }}>
          一期改动 · 手机模拟器演示
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(60,60,67,0.55)', marginBottom: 28 }}>
          会员等级增强 + 四级真实性标签 + 标签说明弹窗
        </p>

        {/* iOS 分段控制器 */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(118,118,128,0.12)',
          borderRadius: 10,
          padding: 3,
          gap: 2,
          marginBottom: 40,
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
                  ? '#fff'
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
