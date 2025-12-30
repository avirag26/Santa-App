'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  HeartIcon,
  GiftIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ChildRegister() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    country: '',
    city: '',
    address: '',
    parentEmail: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const childData = {
        ...formData,
        age: parseInt(formData.age),
        behaviorScore: 75, // Default good behavior score
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/child-auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(childData),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.child) {
          try {
            localStorage.setItem('child', JSON.stringify(data.child))
          } catch (e) {
            // Ignore storage errors
          }
        }

        const loginInfo = data.loginInfo || {};
        toast.success(
          (t) => (
            <div className="text-center">
              <p className="font-bold mb-2">🎉 Welcome to the Nice List!</p>
              <p className="text-xs mb-2">Your magical password is:</p>
              <p className="bg-white text-christmas-red font-black px-3 py-1 rounded-md text-lg mb-2 select-all">
                {loginInfo.password || 'check your email'}
              </p>
              <p className="text-[10px] opacity-70">Write it down to login later!</p>
            </div>
          ),
          { duration: 6000 }
        )

        setTimeout(() => {
          router.push('/kids-portal')
        }, 3000)
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      toast.error('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen christmas-bg overflow-y-auto">
      {/* Header */}
      <header className="relative z-10 p-4">
        <nav className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <SparklesIcon className="h-6 w-6 text-yellow-400" />
            <h1 className="text-xl font-bold text-white text-christmas">
              Santa's Workshop
            </h1>
          </Link>
          <Link
            href="/login"
            className="text-white hover:text-yellow-300 font-medium text-sm"
          >
            Santa Login →
          </Link>
        </nav>
      </header>

      {/* Registration Form */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="christmas-card"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-4xl mb-3"
            >
              🎅
            </motion.div>
            <h1 className="text-2xl font-bold text-christmas-red text-christmas mb-2">
              Join Santa's Nice List!
            </h1>
            <p className="text-gray-600 text-sm">
              Register to send letters to Santa and track your Christmas wishes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="flex items-center text-base font-semibold text-blue-800 mb-3">
                <span className="text-xl mr-2">👤</span>
                About You
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Age *
                  </label>
                  <select
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                  >
                    <option value="">Select your age</option>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map(age => (
                      <option key={age} value={age}>{age} years old</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Parent's Email
                  </label>
                  <input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    placeholder="parent@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-green-50 rounded-lg p-3">
              <h3 className="flex items-center text-base font-semibold text-green-800 mb-3">
                <span className="text-xl mr-2">🗺️</span>
                Where You Live
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                  >
                    <option value="">Select your country</option>
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Brazil">Brazil</option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    placeholder="Your city"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-christmas-red focus:border-transparent"
                    placeholder="Your full address (so Santa can find you!)"
                  />
                </div>
              </div>
            </div>

            {/* Christmas Wishlist inputs removed: kids now set wishlist inside the Kids Portal */}

            {/* Submit Button - Always Visible */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-christmas flex items-center justify-center space-x-2 text-base py-3 mt-4"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <HeartIcon className="h-5 w-5" />
                  <span>🎁 Join Santa's Nice List! 🎄</span>
                  <SparklesIcon className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Compact Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 mb-2">
              Already registered?
              <Link href="/" className="text-christmas-red hover:text-red-700 font-medium ml-1">
                Go back to homepage
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}