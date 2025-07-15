
import React, { useState } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'
import { toast } from '@/components/ui/use-toast'

interface ProjectUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProjectUploadModal: React.FC<ProjectUploadModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { createProject } = useProjects()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: 'Please sign in to upload projects', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      
      await createProject({
        title,
        description,
        image_url: imageUrl,
        tags: tagArray
      })

      toast({ title: 'Project uploaded successfully!' })
      onClose()
      
      // Reset form
      setTitle('')
      setDescription('')
      setImageUrl('')
      setTags('')
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Upload Project</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="pl-12"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Paste a direct link to your project image
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="UI/UX, Web Design, Branding (comma separated)"
            />
          </div>

          <Button
            type="submit"
            className="w-full glow-primary"
            disabled={loading}
          >
            {loading ? 'Uploading...' : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Project
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ProjectUploadModal
