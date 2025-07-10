
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProjectFeed from '@/components/ProjectFeed';
import FreelanceSection from '@/components/FreelanceSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProjectFeed />
      <FreelanceSection />
      <Footer />
    </div>
  );
};

export default Index;
