import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Clock, Plus } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import ConversationModal from './ConversationModal';
import StartConversationModal from './StartConversationModal';

const ConversationsList: React.FC = () => {
  const { conversations, loading } = useMessages();
  const [selectedConversation, setSelectedConversation] = React.useState<{
    userId: string;
    userName: string;
    userAvatar?: string;
  } | null>(null);
  const [showStartModal, setShowStartModal] = React.useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Recent Conversations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStartModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground">
                Start messaging freelancers or clients to see conversations here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <div
                  key={conversation.user_id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() =>
                    setSelectedConversation({
                      userId: conversation.user_id,
                      userName: conversation.user_name || 'Unknown User',
                      userAvatar: conversation.user_avatar || undefined,
                    })
                  }
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.user_avatar || undefined} />
                    <AvatarFallback>
                      {(conversation.user_name || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {conversation.user_name || 'Unknown User'}
                      </p>
                      <div className="flex items-center gap-2">
                        {conversation.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unread_count}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(conversation.last_message_time)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {conversation.last_message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedConversation && (
        <ConversationModal
          isOpen={true}
          onClose={() => setSelectedConversation(null)}
          recipientId={selectedConversation.userId}
          recipientName={selectedConversation.userName}
          recipientAvatar={selectedConversation.userAvatar}
        />
      )}
      
      <StartConversationModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
      />
    </>
  );
};

export default ConversationsList;