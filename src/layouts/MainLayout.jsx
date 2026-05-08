import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Starfield (dark mode only) */}
      <div className="starfield" />

      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div style={{ display: 'flex', paddingTop: 64 }}>
        {/* Sidebar */}
        <div
          style={{ width: 240, flexShrink: 0, height: 'calc(100vh - 64px)', position: 'sticky', top: 64 }}
          className="hidden md:block"
        >
          <Sidebar open={true} onClose={() => {}} />
        </div>

        {/* Mobile sidebar */}
        <div className="md:hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: '28px 24px',
            maxWidth: '100%',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
