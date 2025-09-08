
import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Clock, DollarSign, Briefcase, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import TalentCard from '@/components/TalentCard';
import JobCard from '@/components/JobCard';
import ConversationsList from '@/components/ConversationsList';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useTalents } from '@/hooks/useTalents';

const Freelance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const { user } = useAuth();
  const { jobs: dbJobs, loading: jobsLoading, deleteJob } = useJobs();
  const { talents, loading: talentsLoading, deleteTalent } = useTalents();

  const categories = ['all', 'ui-design', 'web-development', 'mobile-design', 'branding', 'illustration', 'photography'];
  const budgetRanges = ['all', '0-500', '500-1000', '1000-5000', '5000+'];

  const demoJobs = [
    {
      id: 1,
      title: 'Modern E-commerce Website Design',
      description: 'Looking for a talented designer to create a modern, responsive e-commerce website. The project includes homepage, product pages, checkout flow, and admin dashboard.',
      client: 'TechCorp Inc',
      budget: '$2,500',
      timeline: '2-3 weeks',
      skills: ['UI/UX Design', 'Figma', 'Responsive Design'],
      postedTime: '2 hours ago',
      proposals: 8,
      rating: 4.9,
      location: 'Remote'
    },
    {
      id: 2,
      title: 'Mobile App UI/UX Design',
      description: 'Need a complete UI/UX design for a fitness tracking mobile app. Looking for someone with experience in health/fitness app design.',
      client: 'FitLife Startup',
      budget: '$1,800',
      timeline: '3-4 weeks',
      skills: ['Mobile Design', 'UI/UX', 'Prototyping'],
      postedTime: '5 hours ago',
      proposals: 12,
      rating: 4.7,
      location: 'New York, NY'
    },
    {
      id: 3,
      title: 'Brand Identity & Logo Design',
      description: 'Startup looking for complete brand identity including logo, color palette, typography, and brand guidelines for a sustainable fashion company.',
      client: 'GreenFashion Co.',
      budget: '$1,200',
      timeline: '1-2 weeks',
      skills: ['Branding', 'Logo Design', 'Brand Guidelines'],
      postedTime: '1 day ago',
      proposals: 15,
      rating: 4.8,
      location: 'Remote'
    },
    {
      id: 4,
      title: 'Dashboard Analytics Interface',
      description: 'Need to design a comprehensive analytics dashboard for a SaaS platform. Must have experience with data visualization and complex UI components.',
      client: 'DataFlow Solutions',
      budget: '$3,200',
      timeline: '4-5 weeks',
      skills: ['Dashboard Design', 'Data Visualization', 'SaaS'],
      postedTime: '2 days ago',
      proposals: 6,
      rating: 5.0,
      location: 'San Francisco, CA'
    }
  ];

  const freelancers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior UI/UX Designer',
      avatar: '/placeholder.svg',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 85,
      skills: ['UI/UX Design', 'Figma', 'Webflow', 'Branding'],
      location: 'Los Angeles, CA',
      available: true,
      portfolio: 'Featured in 50+ projects'
    },
    {
      id: 2,
      name: 'Alex Chen',
      title: 'Full-Stack Designer & Developer',
      avatar: '/placeholder.svg',
      rating: 4.8,
      reviews: 89,
      hourlyRate: 75,
      skills: ['React', 'Node.js', 'UI Design', 'MongoDB'],
      location: 'Remote',
      available: true,
      portfolio: 'Specialized in SaaS platforms'
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      title: 'Brand & Identity Designer',
      avatar: '/placeholder.svg',
      rating: 5.0,
      reviews: 156,
      hourlyRate: 95,
      skills: ['Branding', 'Logo Design', 'Packaging', 'Print Design'],
      location: 'Miami, FL',
      available: false,
      portfolio: 'Award-winning brand designer'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Find Your Next <span className="gradient-text">Opportunity</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with clients and talented freelancers. Whether you're looking to hire or get hired, 
            we've got the perfect match for your next project.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search jobs or freelancers..."
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

          <Select value={selectedBudget} onValueChange={setSelectedBudget}>
            <SelectTrigger className="w-full md:w-40">
              <DollarSign className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range === 'all' ? 'Any Budget' : `$${range}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 bg-secondary">
            <TabsTrigger value="jobs" className="data-[state=active]:bg-primary">
              <Briefcase className="w-4 h-4 mr-2" />
              Find Jobs
            </TabsTrigger>
            <TabsTrigger value="freelancers" className="data-[state=active]:bg-primary">
              <User className="w-4 h-4 mr-2" />
              Find Talent
            </TabsTrigger>
            <TabsTrigger value="conversations" className="data-[state=active]:bg-primary">
              <MessageCircle className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <div className="space-y-6">
              {jobsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading jobs...</p>
                </div>
              ) : dbJobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No jobs available at the moment.</p>
                </div>
              ) : (
                dbJobs.map((job) => (
                  <JobCard key={job.id} job={job} onDelete={deleteJob} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="freelancers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talentsLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading talents...</p>
                </div>
              ) : talents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No talents available at the moment.</p>
                </div>
              ) : (
                talents.map((talent) => (
                  <TalentCard key={talent.id} talent={talent} onDelete={deleteTalent} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="conversations">
            <ConversationsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Freelance;
