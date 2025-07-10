
import React from 'react';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FreelanceSection = () => {
  const freelancers = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Architecture Visualization Specialist',
      rating: 4.9,
      reviews: 127,
      location: 'San Francisco, CA',
      hourlyRate: 85,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      skills: ['3D Rendering', 'SketchUp', 'V-Ray', 'AutoCAD'],
      responseTime: '2 hours',
      completedProjects: 89
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      title: 'Brand Identity Designer',
      rating: 4.8,
      reviews: 94,
      location: 'New York, NY',
      hourlyRate: 75,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      skills: ['Logo Design', 'Brand Strategy', 'Adobe Creative Suite', 'Web Design'],
      responseTime: '1 hour',
      completedProjects: 156
    },
    {
      id: '3',
      name: 'Emily Foster',
      title: 'Interior Design Consultant',
      rating: 5.0,
      reviews: 78,
      location: 'Los Angeles, CA',
      hourlyRate: 95,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      skills: ['Space Planning', 'Color Theory', 'Furniture Design', '3D Modeling'],
      responseTime: '30 minutes',
      completedProjects: 67
    },
    {
      id: '4',
      name: 'Alex Kim',
      title: 'UX/UI Designer',
      rating: 4.7,
      reviews: 203,
      location: 'Seattle, WA',
      hourlyRate: 70,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      skills: ['User Research', 'Prototyping', 'Figma', 'Design Systems'],
      responseTime: '4 hours',
      completedProjects: 134
    }
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Hire Top <span className="gradient-text">Talent</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with skilled designers and architects ready to bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {freelancers.map((freelancer, index) => (
            <div 
              key={freelancer.id} 
              className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 opacity-0 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{freelancer.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{freelancer.title}</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{freelancer.rating}</span>
                  <span className="text-sm text-muted-foreground">({freelancer.reviews})</span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {freelancer.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  Responds in {freelancer.responseTime}
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${freelancer.hourlyRate}/hr
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-1">
                  {freelancer.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {freelancer.skills.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{freelancer.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <Button className="w-full glow-hover bg-primary hover:bg-primary/90">
                Contact Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>

        {/* Browse All CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
            Browse All Freelancers
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FreelanceSection;
