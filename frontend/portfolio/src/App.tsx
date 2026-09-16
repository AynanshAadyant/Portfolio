import { Routes, Route } from 'react-router-dom';
import { BackgroundGrid } from './components/reactbits/BackgroundGrid';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Dashboard } from './pages/Dashboard';
import { Resume } from './pages/Resume';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminAuthGuard } from './components/admin/AdminAuthGuard';

export default function App() {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-[#0A0A0C] text-[#FAFAFA] relative selection:bg-[#10B981]/25 selection:text-[#FAFAFA]">
        {/* reactbits ambient canvas background */}
        <BackgroundGrid className="fixed inset-0 pointer-events-none opacity-20 z-0" />

        {/* Main Content Layout */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow max-w-6xl w-full mx-auto px-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/socials" element={<Resume />} />
              <Route path="/admin" element={<AdminAuthGuard />} />
              <Route path="/admin/*" element={<AdminAuthGuard />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </AdminAuthProvider>
  );
}