import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import FollowButton from './FollowButton';
import StartConversationModal from './StartConversationModal';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileProps {
  userId: string;
  fullName: string | null;
  avatarUrl?: string | null;
  showTime?: string;
  isClickable?: boolean;
  className?: string;
  showActions?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  fullName,
  avatarUrl,
  showTime,
  isClickable = true,
  className = "",
  showActions = false
}) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { user } = useAuth();
  const handleUserClick = () => {
    if (isClickable) {
      // Navigate to user profile
      window.location.href = `/profile/${userId}`;
    }
  };

  const displayName = fullName || 'Unknown User';

  const ProfileContent = () => (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex items-center space-x-3">
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
      
      {showActions && user && userId !== user.id && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowMessageModal(true);
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <FollowButton targetUserId={userId} />
        </div>
      )}
    </div>
  );

  const content = showActions || !isClickable ? (
    <ProfileContent />
  ) : (
    <Button 
      variant="ghost" 
      className="p-0 h-auto hover:bg-transparent w-full justify-start"
      onClick={handleUserClick}
    >
      <ProfileContent />
    </Button>
  );

  return (
    <>
      {content}
      <StartConversationModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        recipientId={userId}
        recipientName={displayName}
      />
    </>
  );
};

export default UserProfile;