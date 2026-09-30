import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Terminal, Shield } from 'lucide-react';
import { GithubIcon } from '../ui/icons';

export const Navbar: React.FC = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Resume', path: '/resume' },
    { name: 'Connect', path: '/socials' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0C]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-sm text-[#FAFAFA] tracking-tight group"
        >
          <div className="size-7 rounded bg-[#121216] border border-white/10 flex items-center justify-center text-[#10B981] group-hover:border-[#10B981]/50 transition-colors">
            <Terminal className="size-4" />
          </div>
          <span className="font-mono text-sm tracking-normal">aynansh.dev</span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2">
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

        {/* External Links & Admin Access */}
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
        </div>
      </div>
    </header>
  );
};
