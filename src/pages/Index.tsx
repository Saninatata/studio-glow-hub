
import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProjectFeed from '@/components/ProjectFeed';
import FreelanceSection from '@/components/FreelanceSection';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect authenticated users to the feed
  if (user) {
    return <Navigate to="/feed" replace />;
  }

  // Show home page for non-authenticated users
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
