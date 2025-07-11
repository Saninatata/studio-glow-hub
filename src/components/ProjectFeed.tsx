import React from 'react';
import ProjectCard from './ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/hooks/useProjects';

const ProjectFeed = () => {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Error loading projects: {error}</p>
          </div>
        </div>
      </section>
    );
  }

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
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No projects yet. Be the first to upload your work!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No projects yet. Be the first to upload your work!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...projects].reverse().map((project, index) => (
                  <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Featured projects coming soon!
              </p>
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
