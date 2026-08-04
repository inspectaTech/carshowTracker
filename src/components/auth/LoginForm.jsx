import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Mail, Lock, Eye, EyeOff, Github, Chrome } from 'lucide-react'
import { authClient } from '#/lib/auth-client'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        const { error: signInError } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        })
        if (signInError) {
          setError(signInError.message || 'Invalid credentials')
          setLoading(false)
          return
        }
      } else {
        const { error: signUpError } = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name || formData.email.split('@')[0],
        })
        if (signUpError) {
          setError(signUpError.message || 'Could not create account')
          setLoading(false)
          return
        }
      }
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOAuth = async (provider) => {
    setLoading(true)
    setError('')
    try {
      if (provider === 'Google') {
        await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })
      } else if (provider === 'GitHub') {
        setError('GitHub login is not configured yet')
      }
    } catch (err) {
      setError(err.message || 'OAuth sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      data-component="login-page"
      className="min-h-screen bg-[#04080b] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-[480px]">
        {/* Logo - hidden on smallest screens, shown centered */}
        <div data-part="logo-section" className="text-center mb-6 sm:mb-8">
          <img
            src="/cst_logo.png"
            alt="Car Show Tracker"
            className="h-16 sm:h-20 mx-auto"
          />
        </div>

        {/* Login Card */}
        <div
          data-part="login-card"
          className="bg-[#0a0d12] rounded-2xl p-6 sm:p-10 shadow-xl border border-[#1a1d22]"
        >
          {/* Welcome Text */}
          <div data-part="welcome-section" className="text-center mb-8">
            <h1 data-part="welcome-title" className="text-2xl sm:text-3xl text-white font-semibold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p data-part="welcome-subtitle" className="text-[#888888] text-sm sm:text-base mt-2">
              {isLogin
                ? 'Sign in to your Car Show Tracker account'
                : 'Join the car show community'}
            </p>
          </div>

          {/* Toggle */}
          <div data-part="mode-toggle" className="flex mb-6 bg-[#04080b] rounded-lg p-1">
            <button
              type="button"
              data-part="signin-tab"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                isLogin
                  ? 'bg-[#0a0d12] text-white shadow'
                  : 'text-[#666666] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              data-part="signup-tab"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                !isLogin
                  ? 'bg-[#0a0d12] text-white shadow'
                  : 'text-[#666666] hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div data-part="error-message" className="mb-4 p-3 bg-red-900/20 text-[#e10908] rounded-lg text-sm border border-red-900/30">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div data-part="oauth-section" className="space-y-3 mb-6">
            <button
              type="button"
              data-part="google-oauth-btn"
              onClick={() => handleOAuth('Google')}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-[#04080b] border border-[#333333] hover:border-[#555555] transition-colors text-white"
            >
              <Chrome className="h-5 w-5" />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
            <button
              type="button"
              data-part="github-oauth-btn"
              onClick={() => handleOAuth('GitHub')}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-[#04080b] border border-[#333333] hover:border-[#555555] transition-colors text-white"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm font-medium">Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div data-part="divider" className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#333333]" />
            <span className="text-[#666666] text-sm">or continue with</span>
            <div className="flex-1 h-px bg-[#333333]" />
          </div>

          {/* Form */}
          <form data-part="login-form" onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div data-part="name-field">
                <label className="block text-sm text-white mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    data-part="name-input"
                    className="w-full px-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
                    placeholder="Gearhead_23"
                  />
                </div>
              </div>
            )}

            <div data-part="email-field">
              <label className="block text-sm text-white mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  data-part="email-input"
                  className="w-full pl-10 pr-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div data-part="password-field">
              <label className="block text-sm text-white mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  data-part="password-input"
                  className="w-full pl-10 pr-12 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  data-part="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div data-part="confirm-password-field">
                <label className="block text-sm text-white mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    data-part="confirm-password-input"
                    className="w-full pl-10 pr-4 py-3 bg-[#04080b] border border-[#333333] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#e10908] transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div data-part="forgot-row" className="flex justify-end">
                <Link
                  to="/forgot-password"
                  data-part="forgot-link"
                  className="text-sm text-[#e10908] hover:text-[#ff0a08] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-part="submit-btn"
              className="w-full py-3 px-4 bg-[#e10908] hover:bg-[#c00807] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle mode */}
          <div data-part="toggle-mode" className="mt-6 text-center">
            <p className="text-sm text-[#888888]">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                data-part="switch-auth-mode"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-[#e10908] hover:text-[#ff0a08] font-medium transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div data-part="back-link" className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-[#666666] hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
