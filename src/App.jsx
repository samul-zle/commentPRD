import { useState } from 'react';
import Nav from './components/Nav.jsx';
import Demo from './pages/Demo.jsx';
import LongTermDemo from './pages/LongTermDemo.jsx';

export default function App() {
  const [activeSection, setActiveSection] = useState('phase1');

  return (
    <div style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
      <Nav activeSection={activeSection} onSectionChange={setActiveSection} />
      {activeSection === 'phase1' ? <Demo /> : <LongTermDemo />}
    </div>
  );
}
