import React from 'react';
import { useContent } from '../hooks/useContent';
import { useProjects } from '../hooks/useProjects';
import { HeroSection } from '../components/home/HeroSection';
import { RightNowStrip } from '../components/home/RightNowStrip';
import { SelectedWork } from '../components/home/SelectedWork';

export const Home: React.FC = () => {
  const { data: statusPill } = useContent('home.status_pill');
  const { data: headline } = useContent('home.hero.headline');
  const { data: subheadline } = useContent('home.hero.subheadline');
  const { data: building } = useContent('home.right_now.building');
  const { data: reading } = useContent('home.right_now.reading');
  const { data: learning } = useContent('home.right_now.learning');
  const { data: projects = [] } = useProjects();

  return (
    <div className="flex flex-col">
      <HeroSection
        statusPillText={statusPill || 'Open to Software Engineering Roles'}
        headlineText={headline || 'Architecting resilient distributed backends and intelligent systems.'}
        subheadlineText={subheadline || 'Computer Science undergrad at MAIT with experience building serverless cloud pipelines.'}
      />

      <RightNowStrip
        building={building || 'Distributed Microservices'}
        reading={reading || 'Designing Data-Intensive Applications'}
        learning={learning || 'Cloud Orchestration'}
      />

      <SelectedWork projects={projects} />
    </div>
  );
};
