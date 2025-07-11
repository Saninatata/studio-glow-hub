import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/hooks/useAuth';

const Posts = () => {
  const [newPost, setNewPost] = useState('');
  const { user } = useAuth();

  const posts = [
    {
      id: 1,
      author: {
        name: 'Sarah Design',
        avatar: '/placeholder.svg',
        handle: '@sarahdesign'
      },
      content: 'Just finished working on this amazing dashboard design for a fintech startup. The challenge was to make complex financial data feel approachable and beautiful. What do you think about the color scheme?',
      image: '/placeholder.svg',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: true
    },
    {
      id: 2,
      author: {
        name: 'Alex Chen',
        avatar: '/placeholder.svg',
        handle: '@alexchen'
      },
      content: 'Been experimenting with 3D elements in web design lately. This card hover effect took me way too long to perfect, but I think it was worth it! 🎨',
      timestamp: '4 hours ago',
      likes: 156,
      comments: 23,
      shares: 12,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: 3,
      author: {
        name: 'Maria Lopez',
        avatar: '/placeholder.svg',
        handle: '@marialopez'
      },
      content: 'Quick tip for fellow designers: When working with clients, always present 3 options. It gives them choice without overwhelming them, and they usually pick the middle option anyway! 😄',
      timestamp: '1 day ago',
      likes: 89,
      comments: 15,
      shares: 7,
      isLiked: false,
      isBookmarked: true
    }
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Handle post submission here
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Community <span className="gradient-text">Posts</span>
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts, tips, and inspiration with the design community
          </p>
        </div>

        {/* Create Post */}
        {user && (
          <Card className="glass border-white/10 mb-8">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px] resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Add to your post</span>
                </div>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="glow-hover bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="glass border-white/10 project-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{post.author.name}</h3>
                        <span className="text-sm text-muted-foreground">{post.author.handle}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>
                
                {post.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`hover:text-red-400 ${post.isLiked ? 'text-red-400' : ''}`}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="hover:text-blue-400">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.comments}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="hover:text-green-400">
                      <Share2 className="w-4 h-4 mr-2" />
                      {post.shares}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`hover:text-yellow-400 ${post.isBookmarked ? 'text-yellow-400' : ''}`}
                  >
                    <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="hover:bg-primary/10">
            Load More Posts
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Posts;
