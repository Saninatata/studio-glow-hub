
import React, { useState } from 'react'
import { X, Image as ImageIcon, Video, Type, Hash, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { usePosts } from '@/hooks/usePosts'
import { toast } from '@/components/ui/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { createPost } = usePosts()

  if (!isOpen) return null

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${user?.id}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'image') {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setVideoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setVideoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

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
      let imageUrl: string | undefined
      let videoUrl: string | undefined

      // Upload image if selected
      if (imageFile) {
        const uploadedImageUrl = await uploadFile(imageFile, 'post-images', 'images')
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl
        } else {
          throw new Error('Failed to upload image')
        }
      }

      // Upload video if selected
      if (videoFile) {
        const uploadedVideoUrl = await uploadFile(videoFile, 'post-images', 'videos')
        if (uploadedVideoUrl) {
          videoUrl = uploadedVideoUrl
        } else {
          throw new Error('Failed to upload video')
        }
      }

      // Create post with uploaded file URLs
      const tagsArray = tags.trim() ? tags.split(',').map(tag => tag.trim()) : []
      
      await createPost({
        content: content.trim(),
        image_url: imageUrl,
        video_url: videoUrl,
        tags: tagsArray
      })

      toast({ title: 'Post created successfully!' })
      onClose()
      
      // Reset form
      setContent('')
      setImageFile(null)
      setVideoFile(null)
      setImagePreview(null)
      setVideoPreview(null)
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
              <label className="block text-sm font-medium mb-2">Upload Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imageFile ? imageFile.name : 'Choose Image'}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Video</label>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="hidden"
                  id="video-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('video-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {videoFile ? videoFile.name : 'Choose Video'}
                </Button>
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

          {(imagePreview || videoPreview) && (
            <div className="p-4 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {videoPreview && (
                <div className="relative">
                  <video
                    src={videoPreview}
                    className="w-full h-48 object-cover rounded-lg"
                    controls
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setVideoFile(null)
                      setVideoPreview(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
