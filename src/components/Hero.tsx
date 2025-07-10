
import React from 'react';
import { ArrowRight, Sparkles, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="wave-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 fade-in">
            <Sparkles className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm text-primary font-medium">Where Design Meets Opportunity</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 fade-in-1">
            Connect. Create.{' '}
            <span className="gradient-text">Collaborate.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed fade-in-2">
            Join the premier community for designers and architects. Share your work, 
            discover inspiration, find opportunities, and build meaningful connections.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 fade-in-3">
            <Button size="lg" className="glow-primary bg-primary hover:bg-primary/90 text-lg px-8 py-3">
              Join StudioLink
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white/20 hover:bg-white/5">
              Explore Projects
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto fade-in-4">
            <div className="glass rounded-lg p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-muted-foreground">Active Designers</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-muted-foreground">Projects Shared</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center">
              <Briefcase className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold">2K+</div>
              <div className="text-muted-foreground">Jobs Posted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
