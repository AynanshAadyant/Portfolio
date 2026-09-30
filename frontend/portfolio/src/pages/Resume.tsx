import React from 'react';
import { useContent } from '../hooks/useContent';
import { Button } from '../components/ui/button';
import { TechTag } from '../components/projects/TechTag';
import { Download, Briefcase, GraduationCap, Code2, Award, ShieldCheck, Cpu } from 'lucide-react';

export const Resume: React.FC = () => {
  const { data: bio } = useContent('resume.bio');

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA] tracking-tight mb-2">
            Aynansh Aadyant
          </h1>
          <p className="text-sm font-mono text-emerald-400">
            Software Engineer
          </p>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            New Delhi, India • Open to 2026/2027 Engineering Opportunities
          </p>
        </div>

        <a href="../resume/resume_14_09_fullstack.pdf" target="_blank" rel="noreferrer" download className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2 bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] font-semibold">
            <Download className="size-4" />
            Download Resume (PDF)
          </Button>
        </a>
      </div>

      {/* Summary */}
      <section className="mb-10 p-5 rounded-lg border border-white/10 bg-[#121216]">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">
          Executive Summary
        </h2>
        <p className="text-sm text-[#FAFAFA] leading-relaxed font-sans">
          {bio ||
            'Full-stack and backend-leaning engineer with deep experience in Node.js, TypeScript, AWS, and C++ algorithmic problem-solving.'}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6 text-[#FAFAFA]">
          <Briefcase className="size-5 text-[#10B981]" />
          <h2 className="text-xl font-bold tracking-tight">Work & Research Experience</h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-white/10 bg-[#121216]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <h3 className="text-lg font-bold text-[#FAFAFA]">
                Research & Engineering Intern
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                Scientific Analysis Group (SAG), DRDO
              </span>
            </div>
            <p className="text-xs font-mono text-emerald-400 mb-4">
              Serverless IoT & Cloud Architecture
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#A1A1AA] font-sans">
              <li>
                Engineered an end-to-end telemetry pipeline using ESP32 microcontrollers communicating over MQTT.
              </li>
              <li>
                Architected serverless AWS event triggers via AWS IoT Core, Lambda workers, and DynamoDB for live streaming.
              </li>
              <li>
                Reduced unit prototype costs by 50-60% while achieving sub-10ms latency updates to monitoring dashboards.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6 text-[#FAFAFA]">
          <GraduationCap className="size-5 text-cyan-400" />
          <h2 className="text-xl font-bold tracking-tight">Education</h2>
        </div>

        <div className="p-6 rounded-lg border border-white/10 bg-[#121216]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <h3 className="text-base font-bold text-[#FAFAFA]">
              Maharaja Agrasen Institute of Technology (MAIT)
            </h3>
            <span className="text-xs font-mono text-muted-foreground">2023 – 2027</span>
          </div>
          <p className="text-xs font-mono text-cyan-400 mb-2">
            Bachelor of Technology (B.Tech) in Computer Science and Engineering
          </p>
          <p className="text-sm text-[#A1A1AA]">
            Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Distributed Systems, Computer Networks.
          </p>
        </div>
      </section>

      {/* Research Affiliations */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6 text-[#FAFAFA]">
          <ShieldCheck className="size-5 text-purple-400" />
          <h2 className="text-xl font-bold tracking-tight">Research Affiliations</h2>
        </div>

        <div className="p-6 rounded-lg border border-white/10 bg-[#121216]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <h3 className="text-base font-bold text-[#FAFAFA]">
              Scientific Analysis Group (SAG), DRDO & MAIT
            </h3>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded">
              Active Affiliation
            </span>
          </div>
          <p className="text-sm text-[#A1A1AA] leading-relaxed mb-3">
            Serverless IoT and embedded firmware development under Scientific Analysis Group, DRDO, coupled with Computer Science engineering foundations at Maharaja Agrasen Institute of Technology.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground pt-3 border-t border-white/5">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Cpu className="size-3.5" /> Embedded Systems & Cloud Telemetry
            </span>
            <span>•</span>
            <span className="text-[#FAFAFA]">B.Tech in Computer Science</span>
            <span>•</span>
            <span className="text-cyan-400">2023 – 2027</span>
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6 text-[#FAFAFA]">
          <Code2 className="size-5 text-amber-400" />
          <h2 className="text-xl font-bold tracking-tight">Technical Skills & Competencies</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg border border-white/10 bg-[#121216]">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-3">
              Languages & Core
            </span>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'JavaScript', 'C++', 'Python', 'SQL', 'HTML/CSS'].map((item) => (
                <TechTag key={item} label={item} />
              ))}
            </div>
          </div>

          <div className="p-5 rounded-lg border border-white/10 bg-[#121216]">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-3">
              Cloud & Backend
            </span>
            <div className="flex flex-wrap gap-2">
              {['AWS IoT Core', 'AWS Lambda', 'DynamoDB', 'Node.js', 'Express.js', 'REST APIs', 'MQTT'].map(
                (item) => (
                  <TechTag key={item} label={item} />
                )
              )}
            </div>
          </div>

          <div className="p-5 rounded-lg border border-white/10 bg-[#121216]">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-3">
              Frontend & UI
            </span>
            <div className="flex flex-wrap gap-2">
              {['React.js', 'Vite', 'Tailwind CSS', 'TanStack Query', 'ShadCN', 'Mermaid.js'].map(
                (item) => (
                  <TechTag key={item} label={item} />
                )
              )}
            </div>
          </div>

          <div className="p-5 rounded-lg border border-white/10 bg-[#121216]">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-3">
              Databases, AI & Tools
            </span>
            <div className="flex flex-wrap gap-2">
              {['MongoDB', 'Cloudinary', 'Mistral AI API', 'Git & GitHub', 'Postman', 'Linux'].map(
                (item) => (
                  <TechTag key={item} label={item} />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Milestones */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-6 text-[#FAFAFA]">
          <Award className="size-5 text-purple-400" />
          <h2 className="text-xl font-bold tracking-tight">Milestones & Problem Solving</h2>
        </div>

        <div className="p-5 rounded-lg border border-white/10 bg-[#121216] font-mono text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#FAFAFA]">LeetCode Solved</span>
            <span className="text-[#10B981]">600+ Problems (365-Day Continuous Streak)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#FAFAFA]">LeetCode Contest Rating</span>
            <span className="text-cyan-400">1600 (Top Percentile)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#FAFAFA]">SAG, DRDO Internship</span>
            <span className="text-amber-400">Low-Latency Hardware Telemetry Deployment</span>
          </div>
        </div>
      </section>
    </div>
  );
};
