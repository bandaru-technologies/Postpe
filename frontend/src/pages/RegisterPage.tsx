import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Eye, EyeOff, Zap, Lock, Mail, User, Phone, Loader2, CheckCircle2,
} from 'lucide-react'
import { authService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterData = z.infer<typeof registerSchema>

type Step = 'register' | 'success'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState<Step>('register')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) })

  const onRegister = async (data: RegisterData) => {
    try {
      const res = await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      })
      login(res.token, res.user)
      setStep('success')
      toast.success('Account created successfully!')
      setTimeout(() => navigate('/'), 1500)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string> } }; message?: string }
      const msg = error?.response?.data?.message
        || Object.values(error?.response?.data?.errors ?? {}).join(', ')
        || error?.message
        || 'Registration failed. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-navy-900" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-white">
              Post<span className="text-accent">Pe</span>
            </span>
          </Link>

          {step === 'register' && (
            <>
              <h1 className="text-3xl font-bold text-white mt-6 mb-2">Create Account</h1>
              <p className="text-gray-400">Join millions of buyers and sellers</p>
            </>
          )}
          {step === 'success' && (
            <>
              <h1 className="text-3xl font-bold text-white mt-6 mb-2">Welcome to PostPe!</h1>
              <p className="text-gray-400">Account created. Redirecting...</p>
            </>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['register', 'success'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? 'bg-accent text-navy-900'
                  : step === 'success' && i === 0
                  ? 'bg-green-500 text-white'
                  : 'bg-navy-700 text-gray-400'
              }`}>
                {step === 'success' && i === 0 ? '✓' : i + 1}
              </div>
              {i < 1 && <div className={`w-12 h-0.5 ${step === 'success' ? 'bg-green-500' : 'bg-navy-700'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {/* Registration form */}
          {step === 'register' && (
            <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input {...register('name')} placeholder="Your full name" className="input pl-10" />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input {...register('email')} type="email" placeholder="you@example.com" className="input pl-10" />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="10-digit mobile number"
                    className="input pl-10"
                    maxLength={10}
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    className="input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-base py-3 mt-2">
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Creating Account...</>
                ) : 'Create Account'}
              </button>
            </form>
          )}

          {/* Success step */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Account Verified!</h3>
              <p className="text-gray-400 text-sm">You're all set. Redirecting to home...</p>
              <div className="mt-4 flex justify-center">
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
              </div>
            </div>
          )}

          {step === 'register' && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="link font-medium">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
