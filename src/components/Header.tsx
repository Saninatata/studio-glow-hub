
import React, { useState } from 'react';
import { Search, Bell, User, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import ProjectUploadModal from './ProjectUploadModal';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
              StudioLink
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${
                isActivePath('/') 
                  ? 'text-primary font-medium' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/projects" 
              className={`transition-colors ${
                isActivePath('/projects') 
                  ? 'text-primary font-medium' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Projects
            </Link>
            <Link 
              to="/posts" 
              className={`transition-colors ${
                isActivePath('/posts') 
                  ? 'text-primary font-medium' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Posts
            </Link>
            <Link 
              to="/freelance" 
              className={`transition-colors ${
                isActivePath('/freelance') 
                  ? 'text-primary font-medium' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Freelance
            </Link>
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
            {user ? (
              <>
                <Button 
                  size="sm" 
                  className="glow-hover bg-primary hover:bg-primary/90"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full"></span>
                </Button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {user.full_name}
                  </span>
                  <Link to="/profile">
                    <Button variant="ghost" size="icon">
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="glow-hover bg-primary hover:bg-primary/90"
              >
                Join StudioLink
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <ProjectUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </>
  );
};

export default Header;
