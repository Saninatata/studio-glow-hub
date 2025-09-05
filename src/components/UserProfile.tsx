import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserProfileProps {
  userId: string;
  fullName: string | null;
  avatarUrl?: string | null;
  showTime?: string;
  isClickable?: boolean;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  fullName,
  avatarUrl,
  showTime,
  isClickable = true,
  className = ""
}) => {
  const handleUserClick = () => {
    if (isClickable) {
      // Navigate to user profile
      window.location.href = `/profile/${userId}`;
    }
  };

  const displayName = fullName || 'Unknown User';

  const ProfileContent = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatarUrl || ''} alt={displayName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className={`font-semibold ${isClickable ? 'hover:text-primary cursor-pointer' : ''}`}>
          {displayName}
        </h3>
        {showTime && (
          <p className="text-sm text-muted-foreground">{showTime}</p>
        )}
      </div>
    </div>
  );

  if (!isClickable) {
    return <ProfileContent />;
  }

  return (
    <Button 
      variant="ghost" 
      className="p-0 h-auto hover:bg-transparent w-full justify-start"
      onClick={handleUserClick}
    >
      <ProfileContent />
    </Button>
  );
};

export default UserProfile;