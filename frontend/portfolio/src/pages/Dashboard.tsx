import React from 'react';
import { useLeetCode } from '../hooks/useLeetCode';
import { useSpotify } from '../hooks/useSpotify';
import { LeetCodeTile } from '../components/dashboard/LeetCodeTile';
// import { SpotifyTile } from '../components/dashboard/SpotifyTile';
import { BentoTile } from '../components/dashboard/BentoTile';
import { Activity, GitCommit, Server, ShieldCheck, Cpu } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: leetCodeStats } = useLeetCode();
  // const { data: spotifyData } = useSpotify();

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8 pb-8 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="size-5 text-[#10B981]" />
          <h1 className="text-3xl font-extrabold text-[#FAFAFA] tracking-tight">
            Live Engineering Dashboard
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl font-sans">
          Real-time telemetry, algorithmic activity, current listening rotation, and system health status.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LeetCode Tile (spans 2 cols) */}
        {leetCodeStats && <LeetCodeTile stats={leetCodeStats} />}

        {/* Spotify Tile (1 col) */}
        {/* {spotifyData && <SpotifyTile spotify={spotifyData} />} */}

        {/* System & Architecture Telemetry */}
        <BentoTile
          title="Infrastructure Telemetry"
          icon={<Server className="size-4 text-cyan-400" />}
          badge={
            <span className="text-[11px] font-mono text-[#10B981] bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              Operational
            </span>
          }
          subtitle="AWS IoT Core • DynamoDB • Cloudflare CDN"
          className="col-span-1"
        >
          <div className="space-y-3 my-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Avg Ingestion Latency</span>
              <span className="text-[#10B981] font-semibold">&lt;10ms</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Global CDN Hit Rate</span>
              <span className="text-[#FAFAFA]">99.4%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Hardware Unit Reduction</span>
              <span className="text-cyan-400">50-60%</span>
            </div>
          </div>
        </BentoTile>

        {/* GitHub & Microservices Strip */}
        <BentoTile
          title="Recent Git Activity"
          icon={<GitCommit className="size-4 text-amber-400" />}
          badge={
            <span className="text-[11px] font-mono text-muted-foreground">
              Production CI/CD
            </span>
          }
          subtitle="Monitored repository workflows"
          className="col-span-1"
        >
          <div className="my-2 space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#0A0A0C] border border-white/5">
              <span className="text-emerald-400 block font-semibold text-[11px]">
                feat: serverless MQTT telemetry consumer
              </span>
              <span className="text-muted-foreground text-[10px]">
                repo: cloud-iot-drdo • verified commit
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#0A0A0C] border border-white/5">
              <span className="text-cyan-400 block font-semibold text-[11px]">
                refactor: dynamic Mermaid schema generation
              </span>
              <span className="text-muted-foreground text-[10px]">
                repo: portfolio-frontend • verified commit
              </span>
            </div>
          </div>
        </BentoTile>

        {/* Research & Background Info */}
        <BentoTile
          title="Research Affiliations"
          icon={<ShieldCheck className="size-4 text-purple-400" />}
          badge={
            <span className="text-[11px] font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded">
              DRDO & MAIT
            </span>
          }
          subtitle="Scientific Analysis Group (SAG), DRDO"
          className="col-span-1"
        >
          <div className="my-2 space-y-2">
            <div className="flex items-start gap-2 text-xs">
              <Cpu className="size-4 text-[#10B981] mt-0.5 shrink-0" />
              <p className="text-[#A1A1AA] leading-relaxed">
                Serverless IoT & embedded firmware development under Scientific Analysis Group, DRDO.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>B.Tech in Computer Science</span>
              <span className="text-[#FAFAFA]">2023 – 2027</span>
            </div>
          </div>
        </BentoTile>
      </div>
    </div>
  );
};
