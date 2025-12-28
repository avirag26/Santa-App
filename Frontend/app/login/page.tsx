'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Login() {
  const [formData, setFormData] = useState({
    email: 'santa@northpole.com',
    password: 'santa123'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success('Welcome back, Santa! 🎅')
        router.push('/dashboard')
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch (error) {
      toast.error('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen christmas-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="christmas-card max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            🎅
          </motion.div>
          <h1 className="text-3xl font-bold text-christmas-red text-christmas">
            Santa's Login
          </h1>
          <p className="text-gray-600 mt-2">
            Access the North Pole Workshop
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
              placeholder="santa@northpole.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent pr-12"
                placeholder="Enter your magical password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-christmas flex items-center justify-center"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                🎄 Enter Workshop
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">🎅 Santa's Login Credentials:</h3>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              <strong>Email:</strong> santa@northpole.com
            </p>
            <p className="text-sm text-blue-600">
              <strong>Password:</strong> santa123
            </p>
            <p className="text-xs text-blue-500 mt-2">
              ⚠️ Make sure to type exactly as shown (case sensitive)
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-christmas-red hover:text-red-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}