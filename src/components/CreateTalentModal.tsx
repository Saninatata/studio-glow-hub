
import React, { useState } from 'react'
import { X, Users, Star, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/use-toast'

interface CreateTalentModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateTalentModal: React.FC<CreateTalentModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [location, setLocation] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [availability, setAvailability] = useState('full-time')
  const [portfolio, setPortfolio] = useState('')
  const [bio, setBio] = useState('')
  const [services, setServices] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: 'Please sign in to offer your talent', variant: 'destructive' })
      return
    }

    if (!title.trim() || !skills.trim() || !bio.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'descriptive' })
      return
    }

    setLoading(true)
    try {
      // Here you would typically save to database
      toast({ title: 'Talent profile created successfully!' })
      onClose()
      
      // Reset form
      setTitle('')
      setSkills('')
      setExperience('')
      setLocation('')
      setHourlyRate('')
      setAvailability('full-time')
      setPortfolio('')
      setBio('')
      setServices('')
    } catch (error: any) {
      toast({
        title: 'Failed to create talent profile',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-xl p-8 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Offer Your Talent</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Professional Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior UI/UX Designer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <div className="relative">
                <Star className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 5+ years"
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills & Expertise *</label>
            <Input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Figma, Adobe Creative Suite, User Research, Prototyping"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="New York, NY"
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hourly Rate</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="$75/hour"
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="project-based">Project-based</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Portfolio URL</label>
            <Input
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Professional Bio *</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell potential clients about your background, experience, and what makes you unique..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Services Offered</label>
            <Textarea
              value={services}
              onChange={(e) => setServices(e.target.value)}
              placeholder="List the specific services you provide (e.g., Website design, Mobile app design, Brand identity, User research...)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="glow-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Create Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTalentModal
