
import React, { useState } from 'react';
import { Search, Bell, Plus, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import ProjectUploadModal from './ProjectUploadModal';
import ProfileButton from './ProfileButton';
import PostOptionsModal from './PostOptionsModal';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPostOptions, setShowPostOptions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/posts', label: 'Posts' },
    { path: '/freelance', label: 'Freelance' },
  ];

  const NavLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onLinkClick}
          className={`transition-colors ${mobile ? 'block py-3 px-4 text-lg' : ''} ${
            isActivePath(item.path)
              ? 'text-primary font-medium'
              : 'text-foreground hover:text-primary'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  const isAuthenticatedPage = ['/feed', '/posts', '/profile'].includes(location.pathname);

  return (
    <>
      <header className={`sticky top-0 z-50 glass border-b border-white/10 ${isAuthenticatedPage ? 'md:block hidden' : ''}`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
              StudioLink
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Navigation</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-2">
                  <NavLinks mobile onLinkClick={() => setMobileMenuOpen(false)} />
                  
                  {user && (
                    <div className="border-t border-border mt-4 pt-4">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-3 px-4 text-lg text-foreground hover:text-primary transition-colors"
                      >
                        Profile
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowPostOptions(true);
                        }}
                        className="w-full justify-start text-lg py-3 px-4 h-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full justify-start text-lg py-3 px-4 h-auto text-red-500 hover:text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                  
                  {!user && (
                    <div className="border-t border-border mt-4 pt-4">
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowAuthModal(true);
                        }}
                        className="w-full glow-hover bg-primary hover:bg-primary/90"
                      >
                        Join StudioLink
                      </Button>
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-secondary/50 rounded-lg px-4 py-2 w-80">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="Search projects, designers..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Button 
                  size="sm" 
                  className="glow-hover bg-primary hover:bg-primary/90"
                  onClick={() => setShowPostOptions(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
                
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full"></span>
                </Button>
                
                <ProfileButton />
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

          {/* Mobile Auth Button (when not authenticated) */}
          {!user && (
            <div className="md:hidden">
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="glow-hover bg-primary hover:bg-primary/90"
                size="sm"
              >
                Join
              </Button>
            </div>
          )}
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

      <PostOptionsModal
        isOpen={showPostOptions}
        onClose={() => setShowPostOptions(false)}
      />
    </>
  );
};

export default Header;
