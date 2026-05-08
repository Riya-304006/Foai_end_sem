import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import ISSTracker from './pages/ISSTracker';
import NewsDashboard from './pages/NewsDashboard';
import Chatbot from './pages/Chatbot';
import Charts from './pages/Charts';
import ChatWindow from './components/ChatWindow';
import './index.css';

import MissionControl from './pages/MissionControl';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<MissionControl />} />
              <Route path="tracker" element={<ISSTracker />} />
              <Route path="news" element={<NewsDashboard />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="charts" element={<Charts />} />
            </Route>
          </Routes>
          {/* Floating chatbot widget — visible on all pages */}
          <ChatWindow />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
