
import React from 'react';
import { Home, Plus, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();

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
      path: '/posts',
      isActive: location.pathname === '/posts',
      isSpecial: true
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
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
                item.isSpecial && item.isActive && "text-primary-foreground"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
