import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Starfield (dark mode only) */}
      <div className="starfield" />

      {/* Navbar */}
      <Navbar onMenuClick={() => {}} />

      <div style={{ paddingTop: 64 }}>
        {/* Main content */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: '28px 24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
