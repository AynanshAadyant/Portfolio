import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Terminal,
  Shield,
  Menu,
  X,
  Home,
  Layers,
  Activity,
  FileText,
  MessageSquareCode,
  ArrowUpRight,
} from 'lucide-react';
import { GithubIcon } from '../ui/icons';

export const Navbar: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Close mobile sidebar whenever route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  // Close on Escape key press or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileSidebarOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMobileSidebarOpen(false);
      }
    };

    if (isMobileSidebarOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="size-4" /> },
    { name: 'Projects', path: '/projects', icon: <Layers className="size-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Activity className="size-4" /> },
    { name: 'Resume', path: '/resume', icon: <FileText className="size-4" /> },
    { name: 'Connect', path: '/socials', icon: <MessageSquareCode className="size-4" /> },
  ];

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0C] backdrop-blur-md shadow-md"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="flex items-center gap-2.5 font-bold text-sm text-[#FAFAFA] tracking-tight group"
        >
          <div className="size-7 rounded bg-[#121216] border border-white/10 flex items-center justify-center text-[#10B981] group-hover:border-[#10B981]/50 transition-colors">
            <Terminal className="size-4" />
          </div>
          <span className="font-mono text-sm tracking-normal">aynansh.dev</span>
        </Link>

        {/* Desktop Navigation Items (hidden on mobile, visible on md+) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#FAFAFA] bg-white/[0.06] border border-white/10'
                    : 'text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/[0.02]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* External Links & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://github.com/aynanshaadyant"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-[#FAFAFA] transition-colors p-1.5 rounded hover:bg-white/5"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="size-4" />
          </a>

          {/* Admin CMS link (desktop only, hidden on mobile) */}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `hidden md:flex p-1.5 rounded transition-colors items-center gap-1 text-xs font-mono ${
                isActive
                  ? 'text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30'
                  : 'text-muted-foreground hover:text-[#10B981] hover:bg-white/5'
              }`
            }
            title="Admin CMS Portal"
            aria-label="Admin CMS Portal"
          >
            <Shield className="size-4" />
          </NavLink>

          {/* Mobile Sidebar Toggle Button */}
          <button
            onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
            aria-label={isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileSidebarOpen}
            className="flex md:hidden p-2 rounded-lg text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 border border-white/5 transition-colors cursor-pointer"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Slide-over Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Sidebar Panel */}
          <aside
            className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] bg-[#0D0D11] border-l border-white/10 shadow-2xl flex flex-col justify-between p-6 md:hidden animate-in slide-in-from-right duration-200"
            aria-label="Mobile Navigation Sidebar"
          >
            <div className="space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <Link
                  to="/"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="flex items-center gap-2 font-bold text-sm text-[#FAFAFA] group"
                >
                  <div className="size-7 rounded bg-[#121216] border border-white/10 flex items-center justify-center text-[#10B981]">
                    <Terminal className="size-4" />
                  </div>
                  <span className="font-mono text-sm">aynansh.dev</span>
                </Link>

                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  aria-label="Close navigation sidebar"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="size-5 text-emerald-400" />
                </button>
              </div>

              {/* Navigation Links */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-3 block mb-3">
                  Navigation
                </span>
                <nav className="space-y-1.5">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.path === '/'}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-[#FAFAFA] bg-emerald-950/40 border border-emerald-800/50 shadow-sm'
                            : 'text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={isActive ? 'text-emerald-400' : 'text-muted-foreground'}>
                            {link.icon}
                          </span>
                          <span className="flex-1 font-sans">{link.name}</span>
                          {isActive && (
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <a
                href="https://github.com/aynanshaadyant"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-[#FAFAFA] transition-colors py-1.5 px-2 rounded hover:bg-white/5"
              >
                <GithubIcon className="size-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="size-3 text-muted-foreground" />
              </a>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 py-1.5 px-2">
                <span className="size-1.5 rounded-full bg-[#10B981] animate-ping" />
                <span>Online</span>
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
};

export default Navbar;
