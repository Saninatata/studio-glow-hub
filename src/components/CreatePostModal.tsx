
import React, { useState } from 'react'
import { X, Image as ImageIcon, Video, Type, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/use-toast'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: 'Please sign in to create posts', variant: 'destructive' })
      return
    }

    if (!content.trim()) {
      toast({ title: 'Please add some content to your post', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // Here you would typically save to database
      // For now, just show success message
      toast({ title: 'Post created successfully!' })
      onClose()
      
      // Reset form
      setContent('')
      setImageUrl('')
      setVideoUrl('')
      setTags('')
    } catch (error: any) {
      toast({
        title: 'Failed to create post',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Create Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">What's on your mind?</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, ideas, or updates..."
              rows={4}
              className="resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Add Image</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Add Video</label>
              <div className="relative">
                <Video className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="design, inspiration, tips (comma separated)"
                className="pl-12"
              />
            </div>
          </div>

          {(imageUrl || videoUrl) && (
            <div className="p-4 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mb-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              {videoUrl && (
                <video
                  src={videoUrl}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="glow-primary"
              disabled={loading}
            >
              {loading ? 'Publishing...' : (
                <>
                  <Type className="w-4 h-4 mr-2" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal
