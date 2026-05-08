import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Background (only for dark mode) */}
      <div className="starfield" />

      {/* Main content centered */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <main
          style={{
            width: '100%',
            maxWidth: '1440px',
            minWidth: 0,
            padding: '28px 0',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
