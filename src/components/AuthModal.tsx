
import React, { useState } from 'react'
import { X, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/use-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, fullName)
        toast({ title: 'Account created successfully!' })
      } else {
        await signIn(email, password)
        toast({ title: 'Welcome back!' })
      }
      onClose()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            {isSignUp ? 'Join StudioLink' : 'Welcome Back'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-12"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full glow-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
