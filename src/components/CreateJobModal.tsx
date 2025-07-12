
import React, { useState } from 'react'
import { X, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/use-toast'

interface CreateJobModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [jobType, setJobType] = useState('full-time')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [benefits, setBenefits] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({ title: 'Please sign in to post jobs', variant: 'destructive' })
      return
    }

    if (!title.trim() || !company.trim() || !description.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      // Here you would typically save to database
      toast({ title: 'Job posted successfully!' })
      onClose()
      
      // Reset form
      setTitle('')
      setCompany('')
      setLocation('')
      setSalary('')
      setJobType('full-time')
      setDescription('')
      setRequirements('')
      setBenefits('')
    } catch (error: any) {
      toast({
        title: 'Failed to post job',
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
          <h2 className="text-2xl font-bold gradient-text">Post a Job</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior UI/UX Designer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Design Studio Inc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Remote / New York, NY"
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salary Range</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="$80k - $120k"
                  className="pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Requirements</label>
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="List the required skills, experience, and qualifications..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Benefits & Perks</label>
            <Textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Health insurance, remote work, flexible hours, etc..."
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
              {loading ? 'Posting...' : (
                <>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateJobModal
