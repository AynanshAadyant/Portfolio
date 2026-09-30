import React, { useState, useEffect } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="size-4" /> },
    { name: 'Projects', path: '/projects', icon: <Layers className="size-4" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Activity className="size-4" /> },
    { name: 'Resume', path: '/resume', icon: <FileText className="size-4" /> },
    { name: 'Connect', path: '/socials', icon: <MessageSquareCode className="size-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0C]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
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

        {/* External Links & Mobile Hamburger Toggle */}
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

          {/* Admin CMS link */}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-mono ${
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

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="flex md:hidden p-2 rounded-lg text-muted-foreground hover:text-[#FAFAFA] hover:bg-white/5 border border-white/5 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="size-5 text-emerald-400" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 md:hidden bg-[#0A0A0C]/95 backdrop-blur-2xl border-b border-white/10 flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-3 mb-2 block">
              Navigation
            </span>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all ${
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
                    <span className="flex-1 font-sans font-medium">{link.name}</span>
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#10B981] animate-ping" />
                <span>System Operational</span>
              </span>
              <span className="text-emerald-400 font-semibold">2026 / 2027</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://github.com/aynanshaadyant"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#121216] border border-white/10 text-xs font-mono text-muted-foreground hover:text-[#FAFAFA] hover:border-white/20 transition-all"
              >
                <GithubIcon className="size-4" />
                <span>GitHub</span>
                <ArrowUpRight className="size-3 text-muted-foreground" />
              </a>

              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#121216] border border-white/10 text-xs font-mono text-muted-foreground hover:text-[#10B981] hover:border-[#10B981]/30 transition-all"
              >
                <Shield className="size-3.5" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
