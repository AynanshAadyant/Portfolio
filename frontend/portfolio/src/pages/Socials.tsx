import React from 'react';
import { SpotlightCard } from '../components/reactbits/SpotlightCard';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../components/ui/icons';
import { Mail, MessageSquareCode, ArrowUpRight } from 'lucide-react';

export const Socials: React.FC = () => {
  const socialLinks = [
    {
      title: 'GitHub',
      handle: '@AynanshAadyant',
      description:
        'Explore open-source repositories, system architecture diagrams, cloud telemetry pipelines, and algorithmic solutions.',
      url: 'https://github.com/aynanshaadyant',
      icon: <GithubIcon className="size-6 text-[#FAFAFA]" />,
      accentColor: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'hover:border-white/40',
      badge: 'Code & Repositories',
      badgeColor: 'text-white/80 bg-white/5 border-white/10',
    },
    {
      title: 'LinkedIn',
      handle: 'aynanshaadyant',
      description:
        'Professional background, engineering milestones, DRDO research experience, and engineering network updates.',
      url: 'https://linkedin.com/in/aynanshaadyant',
      icon: <LinkedinIcon className="size-6 text-cyan-400" />,
      accentColor: 'rgba(34, 211, 238, 0.15)',
      borderHover: 'hover:border-cyan-500/40',
      badge: 'Professional Network',
      badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
    },
    {
      title: 'Instagram',
      handle: '@aynanshaadyant',
      description:
        'Personal updates, developer journey, behind-the-scenes engineering moments, and creative interests.',
      url: 'https://instagram.com/aynanshaadyant',
      icon: <InstagramIcon className="size-6 text-pink-400" />,
      accentColor: 'rgba(244, 114, 182, 0.15)',
      borderHover: 'hover:border-pink-500/40',
      badge: 'Social & Life',
      badgeColor: 'text-pink-400 bg-pink-950/40 border-pink-800/40',
    },
    {
      title: 'Direct Mail',
      handle: 'aynanshaadyant@gmail.com',
      description:
        'Get in touch for internships, full-time engineering opportunities, technical discussions, or consulting.',
      url: 'mailto:aynanshaadyant@gmail.com',
      icon: <Mail className="size-6 text-emerald-400" />,
      accentColor: 'rgba(16, 185, 129, 0.15)',
      borderHover: 'hover:border-emerald-500/40',
      badge: 'Inquiries & Collabs',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    },
  ];

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquareCode className="size-6 text-[#10B981]" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] tracking-tight">
            Connect with me
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground font-sans max-w-2xl">
          Whether you want to discuss distributed systems, collaborate on open-source projects,
          explore software engineering opportunities, or simply say hello — feel free to reach out.
        </p>
      </div>

      {/* Social Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {socialLinks.map((item) => (
          <SpotlightCard
            key={item.title}
            spotlightColor={item.accentColor}
            className={`p-6 flex flex-col justify-between group transition-all duration-300 ${item.borderHover}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="p-3 rounded-lg bg-[#0A0A0C] border border-white/5 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#FAFAFA] tracking-tight mb-1 group-hover:text-white transition-colors">
                {item.title}
              </h2>
              <p className="text-xs font-mono text-muted-foreground mb-3">{item.handle}</p>
              <p className="text-sm text-[#A1A1AA] font-sans leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground group-hover:text-[#FAFAFA] transition-colors">
                Open link
              </span>
              <a
                href={item.url}
                target={item.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={item.url.startsWith('mailto:') ? undefined : 'noreferrer'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0A0A0C] border border-white/10 group-hover:border-white/25 text-xs font-mono text-[#FAFAFA] hover:text-[#10B981] transition-all"
                aria-label={`Connect via ${item.title}`}
              >
                <span>Navigate</span>
                <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Quick Summary Callout */}
      <div className="p-5 rounded-lg border border-white/10 bg-[#121216] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#10B981] uppercase tracking-wider block mb-1">
            Availability Status
          </span>
          <p className="text-sm text-[#FAFAFA] font-sans">
            Currently open to Software Engineering Opportunities (2026 / 2027) & Research Collaborations.
          </p>
        </div>
        <a
          href="mailto:aynanshaadyant@gmail.com"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] text-xs font-mono font-semibold transition-all"
        >
          <Mail className="size-3.5" />
          <span>Quick Email</span>
        </a>
      </div>
    </div>
  );
};

export default Socials;
