
import React, { useState } from 'react';
import { Home, Plus, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import PostOptionsModal from './PostOptionsModal';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPostOptions, setShowPostOptions] = useState(false);

  const handlePostOptionSelect = (option: 'post' | 'project' | 'job' | 'talent') => {
    switch (option) {
      case 'post':
        navigate('/posts');
        break;
      case 'project':
        navigate('/projects');
        break;
      case 'job':
        navigate('/freelance');
        break;
      case 'talent':
        navigate('/freelance');
        break;
      default:
        navigate('/posts');
    }
  };

  const navItems = [
    {
      icon: Home,
      label: 'Feed',
      path: '/feed',
      isActive: location.pathname === '/feed'
    },
    {
      icon: Plus,
      label: 'Post',
      path: '#',
      isActive: false,
      isSpecial: true,
      onClick: () => setShowPostOptions(true)
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                    item.isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground",
                    item.isSpecial && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Icon className={cn(
                    "w-6 h-6 mb-1",
                    item.isSpecial && "text-primary-foreground"
                  )} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                  item.isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <PostOptionsModal
        isOpen={showPostOptions}
        onClose={() => setShowPostOptions(false)}
        onSelectOption={handlePostOptionSelect}
      />
    </>
  );
};

export default BottomNavigation;
