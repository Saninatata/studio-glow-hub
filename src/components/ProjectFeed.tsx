
import React from 'react';
import ProjectCard from './ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProjectFeed = () => {
  // Mock data for demonstration
  const mockProjects = [
    {
      id: '1',
      title: 'Modern Sustainable Housing Complex',
      description: 'A revolutionary approach to urban housing with integrated green spaces and sustainable energy solutions. This project focuses on creating community-centered living spaces.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40'
      },
      stats: {
        likes: 234,
        comments: 45,
        views: 1200
      },
      tags: ['Architecture', 'Sustainable', 'Urban Planning', 'Green Design']
    },
    {
      id: '2',
      title: 'Minimalist Brand Identity System',
      description: 'Complete brand redesign for a tech startup, featuring clean typography, geometric patterns, and a cohesive color palette that reflects innovation and trust.',
      image: 'https://images.unsplash.com/photo-1586953135537-692bcbec8e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Alex Rivera',
        avatar: '/api/placeholder/40/40'
      },
      stats: {
        likes: 189,
        comments: 32,
        views: 890
      },
      tags: ['Branding', 'Identity', 'Minimalism', 'Typography']
    },
    {
      id: '3',
      title: 'Interactive Museum Exhibition Design',
      description: 'Immersive exhibition space combining digital installations with traditional artifacts, creating an engaging educational experience for visitors of all ages.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Maya Patel',
        avatar: '/api/placeholder/40/40'
      },
      stats: {
        likes: 156,
        comments: 28,
        views: 675
      },
      tags: ['Exhibition', 'Interactive', 'Museum', 'Digital Art']
    },
    {
      id: '4',
      title: 'Urban Rooftop Garden Concept',
      description: 'Transforming unused rooftop spaces into thriving urban gardens that provide fresh produce while creating community gathering spaces in dense city environments.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'David Kim',
        avatar: '/api/placeholder/40/40'
      },
      stats: {
        likes: 298,
        comments: 67,
        views: 1450
      },
      tags: ['Urban Design', 'Gardens', 'Sustainability', 'Community']
    },
    {
      id: '5',
      title: 'Mobile App UI/UX Redesign',
      description: 'Complete overhaul of a fitness app focusing on improved user experience, intuitive navigation, and motivational design elements to increase user engagement.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Emma Thompson',
        avatar: '/api/placeholder/40/40'
      },
      stats: {
        likes: 412,
        comments: 89,
        views: 2100
      },
      tags: ['UI/UX', 'Mobile', 'App Design', 'Fitness']
    },
    {
      id: '6',
      title: 'Luxury Hotel Interior Concept',
      description: 'Sophisticated interior design for a boutique hotel featuring local materials, contemporary art, and spaces that blend comfort with elegance.',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'James Wilson',
        avatar: '/api/placeholder/40/40'
      },
      stats: {
        likes: 267,
        comments: 43,
        views: 980
      },
      tags: ['Interior Design', 'Hotel', 'Luxury', 'Contemporary']
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Discover Amazing <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore the latest works from our talented community of designers and architects
          </p>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8 bg-secondary">
            <TabsTrigger value="trending" className="data-[state=active]:bg-primary">
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-primary">
              Recent
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-primary">
              Featured
            </TabsTrigger>
            <TabsTrigger value="following" className="data-[state=active]:bg-primary">
              Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockProjects.map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockProjects.reverse().map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockProjects.filter((_, index) => index % 2 === 0).map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Follow designers to see their latest projects here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProjectFeed;
