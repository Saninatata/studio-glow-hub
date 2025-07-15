
import React, { useState } from 'react';
import { User, Edit3, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { cleanupAuthState } from '@/utils/authCleanup';
import ProfileEditModal from './ProfileEditModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProfileButton = () => {
  const { user, signOut } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await signOut();
      } catch (err) {
        console.log('Sign out error (continuing anyway):', err);
      }
      
      // Force page reload for completely clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, force cleanup and redirect
      cleanupAuthState();
      window.location.href = '/';
    }
  };

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 p-0.5">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <User className="w-4 h-4 text-primary" />
                )}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{user.full_name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || 'No email'}
            </p>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileEditModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
      />
    </>
  );
};

export default ProfileButton;
