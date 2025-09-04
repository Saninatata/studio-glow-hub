
import React, { useState } from 'react';
import { Grid, List, Filter, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';
import ProjectUploadModal from '@/components/ProjectUploadModal';

const Projects = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { projects, loading, error, deleteProject } = useProjects();
  const { user } = useAuth();

  const categories = ['all', 'ui-design', 'web-design', 'mobile-design', 'branding', 'illustration', 'photography'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           project.tags.some(tag => tag.toLowerCase().includes(selectedCategory.replace('-', ' ')));
    return matchesSearch && matchesCategory;
  });

  const myProjects = projects.filter(project => project.user_id === user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Discover <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-muted-foreground">
              Explore amazing designs from our creative community
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => setShowUploadModal(true)}
              className="glow-hover bg-primary hover:bg-primary/90 mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Project
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : 
                   category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-secondary">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary">
              All Projects ({filteredProjects.length})
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-primary">
              Trending
            </TabsTrigger>
            {user && (
              <TabsTrigger value="mine" className="data-[state=active]:bg-primary">
                My Projects ({myProjects.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'No projects found matching your criteria'
                    : 'No projects yet. Be the first to upload your work!'
                  }
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }>
                {filteredProjects.map((project, index) => (
                  <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                     <ProjectCard project={project} onDelete={deleteProject} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Trending projects coming soon!
              </p>
            </div>
          </TabsContent>

          {user && (
            <TabsContent value="mine">
              {myProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    You haven't uploaded any projects yet
                  </p>
                  <Button 
                    onClick={() => setShowUploadModal(true)}
                    className="glow-hover bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Your First Project
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                    : 'space-y-6'
                }>
                  {myProjects.map((project, index) => (
                    <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                      <ProjectCard project={project} onDelete={deleteProject} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      <ProjectUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </div>
  );
};

export default Projects;
