import React from 'react';
import { Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon } from '../ui/icons';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0A0A0C] mt-24 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="size-2 rounded-full bg-[#10B981] animate-ping" />
          <span>System Operational • Living Canvas</span>
        </div>

        <div className="flex items-center gap-5 text-muted-foreground">
          <a
            href="https://github.com/aynanshaadyant"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#FAFAFA] transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href="https://linkedin.com/in/aynanshaadyant"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#FAFAFA] transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href="mailto:aynanshaadyant@gmail.com"
            className="hover:text-[#FAFAFA] transition-colors"
            aria-label="Email"
          >
            <Mail className="size-4" />
          </a>
          <Link
            to="/admin"
            className="hover:text-[#10B981] transition-colors flex items-center gap-1 text-xs"
            title="Admin CMS Portal"
          >
            <Shield className="size-3.5" />
            <span>Admin</span>
          </Link>
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          © {new Date().getFullYear()} Aynansh Aadyant.
        </div>
      </div>
    </footer>
  );
};
