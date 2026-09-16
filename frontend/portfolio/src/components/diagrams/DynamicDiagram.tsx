import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0A0A0C',
    primaryColor: '#121216',
    primaryBorderColor: '#10B981',
    primaryTextColor: '#FAFAFA',
    lineColor: '#10B981',
    edgeLabelBackground: '#121216',
    nodeBorder: '#10B981',
    mainBkg: '#121216',
    clusterBkg: '#0A0A0C',
    clusterBorder: '#10B981',
  },
});

interface DynamicDiagramProps {
  chart: string;
  className?: string;
}

export const DynamicDiagram: React.FC<DynamicDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart.trim()) return;
      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error('Failed to render dynamic diagram:', err);
        if (isMounted) {
          setError('Unable to render architecture diagram');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="w-full p-4 border border-white/10 rounded-lg bg-[#121216] text-xs font-mono text-muted-foreground text-center">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto p-4 border border-white/10 rounded-lg bg-[#121216] flex justify-center [&_svg]:max-w-full [&_svg]:h-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
