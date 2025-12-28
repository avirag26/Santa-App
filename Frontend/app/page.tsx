'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  GiftIcon, 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  SparklesIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      title: 'Children Management',
      description: 'Track all children worldwide, their behavior scores, and wish lists',
      icon: UserGroupIcon,
      href: '/children',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Gift Workshop',
      description: 'Manage gift production, assign elves, and track delivery status',
      icon: GiftIcon,
      href: '/gifts',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Message Center',
      description: 'Read letters from children and send magical replies',
      icon: ChatBubbleLeftRightIcon,
      href: '/messages',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Workshop Analytics',
      description: 'Monitor workshop performance and Christmas preparations',
      icon: ChartBarIcon,
      href: '/dashboard',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const christmasCountdown = () => {
    const christmas = new Date(currentTime.getFullYear(), 11, 25)
    if (currentTime > christmas) {
      christmas.setFullYear(christmas.getFullYear() + 1)
    }
    const diff = christmas.getTime() - currentTime.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return { days, hours, minutes, seconds }
  }

  const countdown = christmasCountdown()

  return (
    <div className="min-h-screen christmas-bg">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <SparklesIcon className="h-10 w-10 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white text-christmas">
              Santa's Workshop
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-3"
          >
            <Link 
              href="/kids-portal" 
              className="btn-christmas-gold text-sm py-2 px-4"
            >
              🧒 Kids Portal
            </Link>
            <Link 
              href="/child-register" 
              className="btn-christmas-green text-sm py-2 px-4"
            >
              📝 Register
            </Link>
            <Link 
              href="/login" 
              className="btn-christmas text-sm py-2 px-4"
            >
              🎅 Santa Login
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-bold text-white mb-6 text-christmas">
            🎄 Welcome to the North Pole! 🎄
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            The most magical workshop management system in the world! 
            Help Santa manage children, gifts, elves, and spread Christmas joy globally.
          </p>
          
          {/* Christmas Countdown */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="christmas-card max-w-2xl mx-auto mb-12"
          >
            <h3 className="text-2xl font-bold text-christmas-red mb-4 flex items-center justify-center">
              <HeartIcon className="h-8 w-8 mr-2" />
              Christmas Countdown
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-christmas-red text-white p-4 rounded-lg">
                <div className="text-3xl font-bold">{countdown.days}</div>
                <div className="text-sm">Days</div>
              </div>
              <div className="bg-christmas-green text-white p-4 rounded-lg">
                <div className="text-3xl font-bold">{countdown.hours}</div>
                <div className="text-sm">Hours</div>
              </div>
              <div className="bg-christmas-gold text-white p-4 rounded-lg">
                <div className="text-3xl font-bold">{countdown.minutes}</div>
                <div className="text-sm">Minutes</div>
              </div>
              <div className="bg-purple-600 text-white p-4 rounded-lg">
                <div className="text-3xl font-bold">{countdown.seconds}</div>
                <div className="text-sm">Seconds</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              whileHover={{ scale: 1.05 }}
              className="christmas-card group cursor-pointer"
            >
              <Link href={feature.href}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Kids Registration Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="christmas-card text-center mb-16 bg-gradient-to-r from-green-50 to-red-50"
        >
          <h3 className="text-3xl font-bold text-christmas-red mb-4 text-christmas">
            🧒 Kids Corner - Join Santa's Magic! 🎄
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Register to join Santa's Nice List or access your personal Christmas portal!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/child-register"
              className="btn-christmas-green text-xl py-4 px-8 flex items-center space-x-3"
            >
              <span>🎁</span>
              <span>Register as a Kid</span>
              <span>✨</span>
            </Link>
            <Link 
              href="/kids-portal"
              className="btn-christmas text-xl py-4 px-8 flex items-center space-x-3"
            >
              <span>🎅</span>
              <span>Kids Portal</span>
              <span>📬</span>
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 mb-2">New Kids - Register:</h4>
              <p>✅ Create your wishlist</p>
              <p>📬 Get your Santa account</p>
              <p>🎁 Join the Nice List</p>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <h4 className="font-semibold text-red-800 mb-2">Existing Kids - Portal:</h4>
              <p>💬 Send messages to Santa</p>
              <p>👀 Read Santa's replies</p>
              <p>🎁 Update your wishlist</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="christmas-card text-center"
        >
          <h3 className="text-2xl font-bold text-christmas-red mb-6">
            🌟 This Year's Christmas Magic 🌟
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-christmas-green">2.1M+</div>
              <div className="text-gray-600">Children Registered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-christmas-red">850K+</div>
              <div className="text-gray-600">Gifts in Production</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-christmas-gold">1,247</div>
              <div className="text-gray-600">Active Elves</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">99.8%</div>
              <div className="text-gray-600">On-Time Delivery</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-white/80">
        <p>© 2024 Santa's Workshop - Spreading Christmas Magic Worldwide 🎅✨</p>
      </footer>
    </div>
  )
}