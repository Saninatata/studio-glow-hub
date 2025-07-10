
import React from 'react';
import { Search, Bell, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold gradient-text">StudioLink</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Explore
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Projects
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Freelance
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Community
          </a>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-secondary/50 rounded-lg px-4 py-2 w-80">
          <Search className="w-4 h-4 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Search projects, designers..."
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button size="sm" className="glow-hover bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Upload
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
